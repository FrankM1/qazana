var HandlerModule = require( 'qazana-frontend/handler-module' ),
	ImageCarouselHandler;

ImageCarouselHandler = HandlerModule.extend( {
	getDefaultSettings: function() {
		return {
			selectors: {
				carousel: '.qazana-image-carousel',
			},
		};
	},

	getDefaultElements: function() {
		var selectors = this.getSettings( 'selectors' );

		return {
			$carousel: this.$element.find( selectors.carousel ),
		};
	},

	onInit: function() {
		HandlerModule.prototype.onInit.apply( this, arguments );

        var self = this,
            elementSettings = this.getElementSettings(),
			slidesToShow = +elementSettings.slidesToShow || 3,
			isSingleSlide = 1 === slidesToShow,
			defaultLGDevicesSlidesCount = isSingleSlide ? 1 : 2,
            breakpoints = qazanaFrontend.config.breakpoints,
            addNav = qazanaFrontend.utils.carousel.addNav,
            slickGlobals = qazanaFrontend.utils.carousel.slickGlobals;

		var slickOptions = {
			slidesToShow: slidesToShow,
			autoplay: 'yes' === elementSettings.autoplay,
			autoplaySpeed: elementSettings.autoplaySpeed,
			infinite: 'yes' === elementSettings.infinite,
			pauseOnHover: 'yes' === elementSettings.pauseOnHover,
			speed: elementSettings.speed,
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

        var options = jQuery.extend( {}, slickOptions, slickGlobals );
        var navOptions = {
            slidesToScroll: elementSettings.slidesToScroll,
            arrows: -1 !== [ 'arrows', 'both' ].indexOf( elementSettings.navigation ),
            dots: -1 !== [ 'dots', 'both' ].indexOf( elementSettings.navigation ),
        };

        // after slick is initialized (these wouldn't work properly if done before init);
        this.elements.$carousel.on( 'init', function( event, slick ) {
            addNav( self.$element, slick.$slider, navOptions );
        } );

        this.elements.$carousel.slick( options );
	},
} );

module.exports = function( $scope ) {
	new ImageCarouselHandler( { $element: $scope } );
};
