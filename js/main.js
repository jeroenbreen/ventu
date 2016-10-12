$(window).ready(function(){

    window.environment = {
        development: true
    };

    document.ontouchmove = function(event){
        // prevents unwanted scrolling on tablet
        event.preventDefault();
    };

    window.ventuConfig = {
        whatScreen: whatScreen(),
        overlay: false,
        environment: {
            development: true
        }
    };
    window.ventu = new App();


    // listeners
    mapListeners();
    // guideListeners();
    // menuListeners();
    // mapCreaters();
    // setResponsiveness();
    // createTooltips();
    ventu.init();

});


