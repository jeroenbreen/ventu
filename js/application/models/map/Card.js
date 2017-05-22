function Card(marker, building, index) {
    this.type = 'card';
    this.marker = marker;
    this.building = building;
    this.index = index;
    this.position = this._getPosition(index);
    this.transform = null;

    this.element = null;
    this.shade = null;

    this.hammer = null;
    this.buttons = {
        love: null,
        hate: null
    };
    this.status = {
        event: 'instack'
    };
    this._create();
    this._addListener();
}

Card.prototype = Object.create(_Element.prototype);


Card.prototype._create = function () {
    var self = this,
        card,
        cardImage,
        cardText,
        cardHead,
        cardFeatures,
        cardButtons;

    // TODO @walstra kun je deze even goed verweven, ook in mijn repo aub. Ik heb ook een nep SearchUtil, die gewoon teruggeeft wat er in komt.
    if (SearchUtil) {
        $(['LeesMeer', 'Interessant', 'NietInteressant']).each(function (index, resourceName) {
            function completed(resourceValue) {
                $('span.' + resourceName).html(resourceValue);
            }
            SearchUtil.getResourceValue('Ventu2.LocalResources.Application', resourceName, completed);
        });
    }

    card = $('<div class="ventu-card ventu-card--dynamic">');
    cardImage = $('<div class="ventu-card-image" style="background-image:url(' + this.building.getCardImage() + ')"></div>');
    cardText = $('<div class="ventu-card-text">');
    cardHead = $('<div class="ventu-card-header"><h4>' + this.building.getCardCity() + '</h4><h3>' + this.building.getCardAddress() + '</h3></div>');
    cardFeatures = $('<div class="ventu-features"></div>');
    cardFeatures.append(this.building.getCardFeatures());
    cardButtons = $('<div class="ventu-card-buttons ventu-card-buttons-3"></div>');
    this.buttons.love = $('<div class="ventu-card-button-container"><div class="ventu-card-button ventu-card-button--love"><div class="ventu-card-button-icon"></div></div><div class="ventu-card-button-label">Interessant</div></div></div>');
    this.buttons.readMore = $('<div class="ventu-card-button-container"><div class="ventu-card-button ventu-card-button--read-more"><div class="ventu-card-button-icon"></div></div><div class="ventu-card-button-label">Lees meer</div></div></div>');
    this.buttons.hate = $('<div class="ventu-card-button-container"><div class="ventu-card-button ventu-card-button--hate"><div class="ventu-card-button-icon"></div></div><div class="ventu-card-button-label">Niet interessant</div></div></div>');
    cardButtons.append(this.buttons.hate);
    cardButtons.append(this.buttons.readMore);
    cardButtons.append(this.buttons.love);
    cardText.append(cardHead);
    cardText.append(cardFeatures);
    card.append(cardImage);
    card.append(cardText);
    card.append(cardButtons);

    if (settings.card.shade) {
        this.shade = new Shade(this, card);
    }

    // bind actions to buttons
    (function (self) {
        self.buttons.love.on('click', function (e) {
            self.resetAnimation($(this));

            setTimeout(function () {
                self._addToList('love');
                window.ventu.user.uses('buttons');
            }, 500);
        });
        self.buttons.hate.on('click', function (e) {
            self.resetAnimation($(this));

            setTimeout(function () {
                self._addToList('hate');
                window.ventu.user.uses('buttons');
            }, 500);
        });
    })(self);

    card.hide();
    this.element = card;

    window.ventu.domElements.stack.append(this.element);

    if (window.ventu.config.isMapPresent) {
        this.marker.hasCard = true;
    }
};

Card.prototype._addListener = function () {
    var self = this;
    this.hammer = Hammer(this.element[0]);

    this.hammer.on('dragstart', function () {
        self._clearfloat();
        window.ventu.user.didFindOut('swiping');
    });

    this.hammer.on('drag', function (event) {
        if (event != null && event.gesture !== null) {
            var dx = event.gesture.deltaX,
                dy = event.gesture.deltaY;
            self._swipeHint(dx, dy);
            self._moveDrag(dx, dy);
        }
    });

    this.hammer.on('release', function (event) {
        self._removeHoverTriggers();
        if (event !== null && event.gesture !== null) {
            var dx = event.gesture.deltaX,
                dy = event.gesture.deltaY;

            if (dx > window.ventu.config.swipe.complete) {
                self._addToList('love');
            } else if (dx < -window.ventu.config.swipe.complete) {
                self._addToList('hate');
            } else {
                self._moveToOrigin(true);
            }
        }
    });
};


// launch

Card.prototype.launch = function (type) {
    var self = this,
        thisTransform;
    if (!type) {
        if (window.ventu.user.askIfDidSee('cardLaunch') || !window.ventu.config.isMapPresent) {
            type = 'soft';
        } else {
            type = 'cool'
        }
    }
    thisTransform = type === 'cool' ? this.marker.getTransform() : [0, 0, 0, 0, 0, 0, 1, 1];
    // start position
    this.setTransform(thisTransform, false);

    if (this.shade) {
        this.shade.project(thisTransform, false);
    }

    switch (type) {
        case 'cool':
            this._coolLaunch();
            break;
        case 'soft':
            this._softLaunch();
            break;
    }

    // float
    if (this.index === 0 && !window.ventu.user.askIfDidSee('cardFloat') && window.environment.floatFirst) {
        setTimeout(function () {
            self._moveFloat();
            window.ventu.user.didSee('cardFloat');
        }, (window.ventu.map.cards.length * 150 + 1000));
    }
};

Card.prototype._softLaunch = function () {
    var self = this,
        wait = 500;
    this.element.addClass('no-transition').fadeIn(wait, function () {
        $(this).removeClass('no-transition')
    });

    setTimeout(function () {
        self._launchNext();
    }, (0.5 * wait));
};

Card.prototype._coolLaunch = function () {
    var self = this,
        next;
    this.element.addClass('no-transition').fadeIn(500, function () {
        $(this).removeClass('no-transition')
    });

    if (this.shade) {
        this.shade.element.fadeIn();
    }

    this.element.addClass('slow-transition');

    // launch
    setTimeout(function () {
        // keep the rotation
        self._moveToOrigin(false);
    }, 100);

    // launch next
    setTimeout(function () {
        self.element.removeClass('slow-transition');

        next = self._launchNext();
        if (!next) {
            // update user when the last card is launched
            window.ventu.user.didSee('cardLaunch');
        }
    }, 150);

    // update user
    window.ventu.user.didSee('cardLaunch');
};

Card.prototype._launchNext = function () {
    var next = this._getNext();
    if (next) {
        next.launch();
        return true;
    } else {
        return false;
    }
};






// actions

Card.prototype._setCurrent = function () {
    var next;

    this.position.rotate = 0;
    this.position.zIndex = window.ventu.config.card.sealevel;
    this.position.shadeZindex = window.ventu.config.card.sealevel - window.ventu.config.card.zGap + 2;
    this.position.shiftX = 0;
    this.position.shiftY = 0;

    if (this.shade) {
        this.shade.element.fadeIn(100);
    }
    if (window.ventu.config.isMapPresent) {
        this.marker.select();
    }
    this._moveToOrigin(true);
    this.marker.parent.currentCard = this;
    this.element.addClass('ventu-card--current');
    // already unrotate the next card (for nicer effect)
    next = this._getNext();
    if (next) {
        next._moveToOrigin(true);
        //next.element.addClass('ventu-card--current');
    }
};

Card.prototype._unsetCurrent = function (rotate, zIndex, shiftX, shiftY, shadeZindex) {
    this.position.rotate = rotate;
    this.position.zIndex = zIndex;
    this.position.shadeZindex = shadeZindex;
    this.position.shiftX = shiftX;
    this.position.shiftY = shiftY;
    this._moveToOriginalPositionInStack();
    if (window.ventu.config.isMapPresent) {
        this.marker.unselect();
    }
};

Card.prototype.swap = function () {
    var self = this,
        topCard = window.ventu.map.currentCard,
        originalX = this.position.shiftX;
    // pull both horizontal out of stack
    topCard.position.shiftX = -500;
    this.position.shiftX = 500;
    topCard._moveToOriginalPositionInStack();
    this._moveToOriginalPositionInStack();

    setTimeout(function () {

        topCard._unsetCurrent(self.position.rotate, self.position.zIndex, originalX, self.position.shiftY, self.position.shadeZindex);
        self._setCurrent();

        if (this.shade) {
            window.ventu.domElements.stack.append(self.shade.element);
        }
        window.ventu.domElements.stack.append(self.element);

        self.marker.parent.cards.move(self.index, 0);

        $(self.marker.parent.cards).each(function (index, card) {
            if (card !== null) {
                card.index = index;
                card.position = card._getPosition(index);
                card._moveToOriginalPositionInStack();
            }
        });

    }, 500);
};


// moves


Card.prototype._moveToOriginalPositionInStack = function () {
    var thisTransform = [0, 0, 0, 0, 0, 0, 1, 1];
    this.setTransform(thisTransform, false);

    if (this.shade) {
        this.shade.project(thisTransform, false);
        this.shade.fadeIn();
    }
};

Card.prototype._moveToOrigin = function (unrotate) {
    var transform = [0, 0, 0, 0, 0, 0, 1, 1];
    if (unrotate) {
        this.position.rotate = 0;
    }
    this.element.removeClass('no-transition');
    if (this.shade) {
        this.shade.element.removeClass('no-transition');
    }
    this.setTransform(transform, false);
    if (this.shade) {
        this.shade.project(transform, true);
    }
};


Card.prototype._moveFloat = function () {
    var self = this;
    this.element.addClass('ventu-card-float');
    if (this.shade) {
        this.shade.element.addClass('ventu-card-shade-float');
    }
    setTimeout(function () {
        self._clearfloat();
    }, 4000)
};

Card.prototype._moveDrag = function (dx, dy) {
    var x = dx,
        y = dy,
        rotY = dx / 5,
        rotX = dy / -5,
        rotZ = dx / 20,
        transform = [x, y, 0, rotX, rotY, rotZ, 1, 1];
    this.element.addClass('no-transition');
    if (this.shade) {
        this.shade.element.addClass('no-transition');
    }
    this.setTransform(transform, false);
    if (this.shade) {
        this.shade.project(transform, true);
    }
};

// Card.prototype.detail = function () {
//     this._moveToOrigin(true);
//     location.href = this.building.getContent().text.detailLinkUrl;
// };



// swiping


Card.prototype._swipeHint = function (dx, dy) {
    if (dx > window.ventu.config.swipe.complete) {
        if (window.ventu.config.isCatcherPresent) {
            window.ventu.list.love.element.main.addClass('selected');
            window.ventu.list.hate.element.main.removeClass('selected');
        }
    } else if (dx > window.ventu.config.swipe.suggest) {
        this.buttons.love.addClass('hover');
    } else if (dx < -window.ventu.config.swipe.complete) {
        if (window.ventu.config.isCatcherPresent) {
            window.ventu.list.hate.element.main.addClass('selected');
            window.ventu.list.love.element.main.removeClass('selected');
        }
    } else if (dx < -window.ventu.config.swipe.suggest) {
        this.buttons.hate.addClass('hover');
    } else {
        this._removeHoverTriggers();
    }

};







// helpers

Card.prototype._getPosition = function (index) {
    var gap = index === 0 ? 0 : window.ventu.config.card.zGap,
        zIndex = window.ventu.config.card.sealevel + (index * -window.ventu.config.card.zOffset) - gap;
    return {
        rotate: index === 0 ? 0 : window.ventu.config.card.rotation * Math.random() - (window.ventu.config.card.rotation / 2),
        zIndex: zIndex,
        shiftX: window.ventu.config.device.type === 0 ? 0 : index * window.ventu.config.card.shift, // no shfits for mobile, only rotate
        shiftY: window.ventu.config.device.type === 0 ? 0 : index * window.ventu.config.card.shift
    }
};

Card.prototype._getNext = function () {
    var map = this.marker.parent,
        index = map.cards.indexOf(this);
    if (map.cards[index + 1]) {
        return map.cards[index + 1];
    } else {
        return null;
    }
};









// administration

Card.prototype._clearfloat = function () {
    this.element.removeClass('ventu-card-float');
    if (this.shade) {
        this.shade.element.removeClass('ventu-card-shade-float');
    }
};

Card.prototype._removeHoverTriggers = function () {
    this.buttons.hate.removeClass('hover');
    this.buttons.love.removeClass('hover');
};

Card.prototype.destroy = function (removeFormArray) {
    var index;
    if (removeFormArray) {
        index = window.ventu.map.cards.indexOf(this);
        if (index > -1) {
            window.ventu.map.cards.splice(index, 1);
        }
    }

    this.element.remove();
    if (this.shade) {
        this.shade.element.remove();
    }
};

Card.prototype._addToList = function (type) {
    var self = this,
        map = this.marker.parent,
        config = window.ventu.config.sizes.bottomBar[type],
        next = this._getNext();

    this.status.event = 'tolist';
    this.element.fadeOut(500);
    if (this.shade) {
        this.shade.element.fadeOut(500);
    }


    if (window.ventu.config.isMapPresent) {
        this.marker.hasCard = false;
        if (type === 'love') {
            this.marker.love();
        } else {
            this.marker.hate();
        }
        window.ventu.map.createNewCard();
    }

    // update user
    window.ventu.user.uses('rating');

    // update bottom bar
    map.status.left--;
    map.status[type]++;
    map.updateBottomBar();

    setTimeout(function () {
        if (next && next.status.event !== 'tolist') {
            next._setCurrent();
        }
    }, 10);
};

Card.prototype.resetAnimation = function (element) {
    var ripple = element.find('.ventu-ripple');
    if (ripple.length > 0) {
        ripple[0].style.webkitAnimation = 'none';
        ripple[0].style.mozAnimation = 'none';
        ripple[0].style.oAnimation = 'none';
        ripple[0].style.animation = 'none';

        setTimeout(function () {
            ripple[0].style.webkitAnimation = '';
            ripple[0].style.mozAnimation = '';
            ripple[0].style.oAnimation = '';
            ripple[0].style.animation = '';
        }, 10);
    }
};

// @walstra: wat doet dit?
Array.prototype.move = function (pos1, pos2) {
    // local variables
    var i, tmp;
    // cast input parameters to integers
    pos1 = parseInt(pos1, 10);
    pos2 = parseInt(pos2, 10);
    // if positions are different and inside array
    if (pos1 !== pos2 &&
        0 <= pos1 && pos1 <= this.length &&
        0 <= pos2 && pos2 <= this.length) {
        // save element from position 1
        tmp = this[pos1];
        // move element down and shift other elements up
        if (pos1 < pos2) {
            for (i = pos1; i < pos2; i++) {
                this[i] = this[i + 1];
            }
        }
        // move element up and shift other elements down
        else {
            for (i = pos1; i > pos2; i--) {
                this[i] = this[i - 1];
            }
        }
        // put element from position 1 to destination
        this[pos2] = tmp;
    }
};