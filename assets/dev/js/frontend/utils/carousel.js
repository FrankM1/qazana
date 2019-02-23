var ViewModule = require( '../../utils/view-module' ),
    CarouselModule;

CarouselModule = ViewModule.extend( {

    slickGlobals: {
        dots: true, // Change the slider's direction to become right-to-left
        accessibility: false, // Enables tabbing and arrow key navigation
        asNavFor: null, // Set the slider to be the navigation of other slider (Class or ID Name)
        appendArrows: null, // Change where the navigation arrows are attached (Selector, htmlString, Array, Element, jQuery object)
        prevArrow: null, // Allows you to select a node or customize the HTML for the "Previous" arrow.
        nextArrow: null, // Allows you to select a node or customize the HTML for the "Next" arrow.
        centerMode: false, // Enables centered view with partial prev/next slides. Use with odd numbered slidesToShow counts.
        centerPadding: '50px', // Side padding when in center mode (px or %)
        cssEase: 'cubic-bezier(.29,1,.29,1)', // Custom easing. See http://cubic-bezier.com/#.29,1,.29,1 Mimicking Greenshock Power4.Ease-Out
        draggable: Modernizr.touch, // Enable mouse dragging
        focusOnSelect: false, // Enable focus on selected element (click)
        easing: 'linear', // Add easing for jQuery animate. Use with easing libraries or default easing methods
        lazyLoad: 'ondemand', // Set lazy loading technique. Accepts 'ondemand' or 'progressive'.
        pauseOnDotsHover: true, // Pause Autoplay when a dot is hovered
        slide: 'div', // Element query to use as slide
        swipe: true, // Enable swiping
        touchMove: true, // Enable slide motion with touch
        touchThreshold: 5, // To advance slides, the user must swipe a length of (1/touchThreshold) * the width of the slider.
        useCSS: true, // Enable/Disable CSS Transitions
        vertical: false, // Vertical slide mode
        rtl: false, // Change the slider's direction to become right-to-left
    },

    addNav: function( $scope, $slick, settings ) {
        if ( $scope.data( 'has-nav' ) ) {
            return;
        }

        var $wrapper = $scope.parent();
        var $dots = $scope.find( '.slick-dots' ); // slick has already been initialized, so we know the dots are already in the DOM;

        if ( settings.dots && $dots.length <= 0 ) {
            $dots = $scope.append( "<ul class='slick-dots' />" ); // slick has already been initialized, so we know the dots are already in the DOM;
        }

        if ( settings.arrows ) {
            // wrap the $dots so we can put our arrows next to them;
            $wrapper.append( '<div class="slick-navigation" />' );

            $wrapper.find( '.slick-navigation' )
                .prepend( '<a class="prev"><i class="ricon ricon-slider-arrow-left"></i></a>' )
                .append( '<a class="next"><i class="ricon ricon-slider-arrow-right"></i></a>' );

            if ( $slick.length && settings.slidesToScroll ) {
                // attach previous button events;
                $wrapper.find( 'a.prev' ).on( 'click', function() {
                    $slick.slick( 'slickGoTo', $slick.slick( 'slickCurrentSlide' ) - settings.slidesToScroll );
                } ).end()
                // attach next button events;
                .find( 'a.next' ).on( 'click', function() {
                    $slick.slick( 'slickGoTo', $slick.slick( 'slickCurrentSlide' ) + settings.slidesToScroll );
                } );
            }
        }

        $scope.data( 'has-nav', 'true' );
    },

    Carousel: function() {
		HandlerModule.prototype.onInit.apply( this, arguments );

        var self = this,
            elementSettings = this.getElementSettings(),
			slidesToShow = +elementSettings.slidesToShow || 3,
			isSingleSlide = 1 === slidesToShow,
			defaultLGDevicesSlidesCount = isSingleSlide ? 1 : 2,
            breakpoints = qazanaFrontend.config.breakpoints;

		var slickOptions = {
			slidesToShow: slidesToShow,
			autoplay: 'yes' === elementSettings.autoplay,
			autoplaySpeed: elementSettings.autoplaySpeed,
			infinite: 'yes' === elementSettings.infinite,
			pauseOnHover: 'yes' === elementSettings.pauseOnHover,
			speed: elementSettings.speed,
			arrows: -1 !== [ 'arrows', 'both' ].indexOf( elementSettings.navigation ),
			dots: -1 !== [ 'dots', 'both' ].indexOf( elementSettings.navigation ),
			rtl: 'rtl' === elementSettings.direction,
			responsive: [
				{
					breakpoint: breakpoints.lg,
					settings: {
						slidesToShow: +elementSettings.slidesToShow_tablet || defaultLGDevicesSlidesCount,
						slidesToScroll: +elementSettings.slidesToScroll_tablet || defaultLGDevicesSlidesCount,
					},
				},
				{
					breakpoint: breakpoints.md,
					settings: {
						slidesToShow: +elementSettings.slidesToShow_mobile || 1,
						slidesToScroll: +elementSettings.slidesToScroll_mobile || 1,
					},
				},
			],
		};

		if ( isSingleSlide ) {
			slickOptions.fade = 'fade' === elementSettings.effect;
		} else {
			slickOptions.slidesToScroll = +elementSettings.slidesToScroll || defaultLGDevicesSlidesCount;
		}

        var options = jQuery.extend( {}, this.slickGlobals, slickOptions );

        this.elements.$carousel.slick( options );

        // after slick is initialized (these wouldn't work properly if done before init);
        this.elements.$carousel.on( 'init', function( event, slick ) {
            // add the navigation.
            self.addNav( slick.$slider.parent(), slick.$slider, options );
        } );
	},

} );

module.exports = CarouselModule;
