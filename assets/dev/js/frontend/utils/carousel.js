var addNav = function($scope, $slick, settings) {
    
    $scope = $scope.closest('.qazana-widget-container');

    if ( $scope.data( 'nav' ) ) {
        return;
    }

    var $wrapper = $scope.find(".qazana-loop-wrapper");

    // slick has already been initialized, so we know the dots are already in the DOM;
    var $dots = $scope.find(".slick-dots");

    if ( $dots.length <= 0 ) {
        // slick has already been initialized, so we know the dots are already in the DOM;
        $dots = $scope.append("<ul class='slick-dots' />");
    }

    if ( settings.arrows ) {

        // wrap the $dots so we can put our arrows next to them;
        $wrapper.parent().append("<div class=\"slick-navigation\"></div>");

        $wrapper.parent().find('.slick-navigation')
            .prepend("<a class=\"prev\"><i class=\"ricon ricon-slider-arrow-left\"></i></a>")
            .append("<a class=\"next\"><i class=\"ricon ricon-slider-arrow-right\"></i></a>");

        if ( $slick.length && settings.slidesToScroll ) {
            // attach previous button events;
            $dots.parent().find("a.prev").on("click", function() {
                $slick.slick('slickGoTo', $slick.slick('slickCurrentSlide') - settings.slidesToScroll);
            }).end()
            // attach next button events;
            .find("a.next").on("click", function() {
                $slick.slick('slickGoTo', $slick.slick('slickCurrentSlide') + settings.slidesToScroll);
            });
        }
    }

    $scope.attr( 'data-nav', 'true' );
};

var Carousel = function( $carousel, settings ) {
    
    if ( $carousel.find("div.slick-slides-biggie").length < 1 || typeof settings === 'undefined' ) {
        return;
    }
    
    var elementSettings = {};
    var slick_globals = window.slick_globals;
    
    settings.direction = settings.is_rtl ? 'rtl' : 'ltr';
    settings.rtl = ( 'rtl' === settings.direction );
    settings.dots = ( settings.navigation === 'dots' || settings.navigation === 'both' );
    settings.arrows = ( settings.navigation === 'arrows' || settings.navigation === 'both' );
     
    var is_slideshow = '1' === parseFloat(settings.slidesToShow);

    if ( ! is_slideshow ) {
        settings.slidesToScroll = parseFloat(settings.slidesToScroll);
    } else {
        settings.fade = ( 'fade' === settings.effect );
    }

    if ( ! settings.slidesToScroll ) {
        settings.slidesToScroll = 1;
    }

    settings.slidesToShow = parseFloat(settings.slidesToShow);

    jQuery.each( settings, function( controlKey ) {

        var value = settings[ controlKey ];

        if ( value === 'yes' ) {
            elementSettings[ controlKey ] = true;
        } else {
            elementSettings[ controlKey ] = value;
        }

    } );

    var optionsBiggie = jQuery.extend( {}, slick_globals, elementSettings ),
        // large slideshow;
        $biggie = $carousel.find("div.slick-slides-biggie"),
        // class to indicate the slideshow is disabled (on mouseover so the user can see the full photo);
        disabledClass = "is-disabled",

        // prev/next button click events - trigger a change the large slideshow;
        goToPreviousSlide = function() {
            var index = Number($biggie.slick('slickCurrentSlide'));
            $biggie.slick('slickGoTo', (index - 1));

        },
        goToNextSlide = function() {
            var index = Number($biggie.slick('slickCurrentSlide'));
            $biggie.slick('slickGoTo', (index + 1));
        };

    // after slick is initialized (these wouldn't work properly if done before init);
    $biggie.on('init', function() {
        // add the navigation;
        new addNav($biggie.parent(), $biggie, optionsBiggie);
    });

    if ( ! $biggie.hasClass('slick-initialized') ) {
        // init the slideshows;
        $biggie.slick(optionsBiggie);
    } else {
        $biggie.slick('refresh');
    }

    // attach prev/next button events now that the smalls arrows have been added;
    $carousel
        // attach previous button events;
        .find("a.prev").on("click", goToPreviousSlide).end()
        // attach next button events;
        .find("a.next").on("click", goToNextSlide);

    // if the device is NOT a touchscreen;
    // then hide the controls when the user isn't interacting with them;
    if (Modernizr.touch === false) {

        // show/hide the elements that overlay $slideshow1 (social, prev, next);
        $biggie.parent().on("mouseenter", function() {
            $biggie.parent().removeClass(disabledClass);
        }).on("mouseleave", function() {
            $biggie.parent().addClass(disabledClass);
        })
        // on load, disable the slideshow (maybe);
        .each(function() {
            var disable = function() {

                // make sure the user isn't hovering over the photo gallery;
                if ($biggie.parent().is(":hover") === false) {
                    $biggie.parent().addClass(disabledClass);
                }
            };

            // before "disabling" the overlay elements, wait 2 seconds;
            window.setTimeout(disable, 2000);
        });
    }

};

module.exports = Carousel;
