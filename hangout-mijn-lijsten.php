<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Ventu Hangout Mijn Lijsten</title>

    <?php include('php-includes/standard-files.php'); ?>

    <script src="js/sign-in/main.js"></script>

</head>

<body class="ventu-hangout">

<?php include('php-includes/nav-logged-in.php'); ?>

<div class="container">
    <section id="ventu-hangout-header-back">
        <div class="row">
            <div class="col-sm-12">
                <a class="ventu-hangout-header-back-button" href="">
                    Terug
                </a>
            </div>
        </div>
    </section>

    <section id="ventu-hangout-header-title">
        <div class="row">
            <div class="col-sm-12">
                <h1>
                    Mijn interesse lijst
                </h1>
            </div>
        </div>
    </section>



    <section id="ventu-hangout-content-section">
        <div class="ventu-hangout-lists-wrapper">
            <div class="row">
                <div class="col-lg-12">
                    <h3>Mijn lijsten</h3>
                </div>
            </div>

            <div class="row">
                <div class="col-lg-6">
                    <a href="hangout-interesselijst.php">
                        <div class="ventu-hangout-list-entry">
                            <div class="aspect16by9">
                                <img src="http://realspotter.nl/media/objects/1E/87/D1/77/1E87D177-2066-4047-8114-F25EEF3FBB01/org/1.jpg">
                            </div>
                            <div class="ventu-hangout-list-entry-title">
                                <div class="ventu-hangout-list-entry-title-icon ventu-hangout-list-entry-title-icon-share"></div>
                                <div class="ventu-hangout-list-entry-title-label">
                                    Mijn interesselijst
                                </div>
                            </div>
                            <div class="ventu-hangout-list-entry-content">
                                14 objecten
                            </div>
                        </div>
                    </a>
                </div>
                <div class="col-lg-6">

                    <a href="hangout-interesselijst.php">
                        <div class="ventu-hangout-list-entry ventu-hangout-list-entry--create">
                            <div class="aspect16by9">

                            </div>
                            <div class="ventu-hangout-list-entry-content ventu-hangout-tip-content">
                                <h5>
                                    <span class="ventu-hangout-tip-button ventu-hangout-tip-button--add"></span>
                                    Maak hier jouw gedeelde lijst
                                </h5>
                                <p>
                                    <b>Samen vinden doe je met Ventu!</b><br>
                                    Daarom kan je eenvoudig op Ventu lijstjes maken en delen met anderen. Gebruik het
                                    <span class="ventu-icon ventu-icon--in-text ventu-icon--add"></span> icoon om nieuwe objecten toe te voegen en nodig jouw collega’s per email uit om te
                                    reageren en stemmen op hun favoriete objecten.
                                </p>
                                <p>
                                    <b>Begin met jouw lijst</b> <img src="img/tools/arrow-right-grey.svg" style="margin-left: 6px; width: 10px;">
                                </p>
                            </div>

                        </div>
                    </a>

                </div>
            </div>
        </div>

        <div class="ventu-hangout-lists-wrapper">
            <div class="row">
                <div class="col-lg-12">
                    <h3>Lijsten die ik volg</h3>
                </div>
            </div>

            <div class="row">

                <div class="col-lg-6">

                    <a href="hangout-share.php">
                        <div class="ventu-hangout-list-entry">
                            <div class="aspect16by9">
                                <img src="http://realspotter.nl/media/objects/1E/87/D1/77/1E87D177-2066-4047-8114-F25EEF3FBB01/org/1.jpg">
                            </div>
                            <div class="ventu-hangout-list-entry-title">
                                <div class="ventu-hangout-list-entry-title-icon ventu-hangout-list-entry-title-icon-follow"></div>
                                <div class="ventu-hangout-list-entry-title-label">
                                    Ik doe mee met lijst
                                </div>
                            </div>
                            <div class="ventu-hangout-list-members">
                                <?php include('php-includes/hangout/members.php'); ?>
                            </div>
                            <div class="ventu-hangout-list-entry-content">
                                1 object
                            </div>
                        </div>
                    </a>
                </div>

            </div>
        </div>

        <div class="ventu-hangout-lists-wrapper">
            <div class="row">
                <div class="col-lg-12">
                    <h3>Mijn verwijderde objecten</h3>
                </div>
            </div>

            <div class="row">

                <div class="col-lg-6">

                    <div class="ventu-hangout-list-entry">
                        <div class="aspect16by9">
                            <img src="http://realspotter.nl/media/objects/97/F3/E0/6B/97F3E06B-55B4-4647-9ADF-D76E58F661AD/thumb/1.jpg">
                        </div>
                        <div class="ventu-hangout-list-entry-title">
                            <div class="ventu-hangout-list-entry-title-icon ventu-hangout-list-entry-title-icon-hate"></div>
                            <div class="ventu-hangout-list-entry-title-label">
                                Niet interessant
                            </div>
                        </div>
                        <div class="ventu-hangout-list-entry-content">
                            6 object
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>



<?php include('php-includes/about.php'); ?>

<?php include('php-includes/footer.php'); ?>

<?php include('php-includes/modals.php'); ?>

</div>

</body>
</html>