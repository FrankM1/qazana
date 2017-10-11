var HandlerModule = require( 'qazana-frontend/handler-module' ),
VideoModule;

VideoModule = HandlerModule.extend( {
	getDefaultSettings: function() {
		return {
			selectors: {
				imageOverlay: '.qazana-custom-embed-image-overlay',
				videoWrapper: '.qazana-video-wrapper',
				videoFrame: 'iframe'
			}
		};
	},

	getDefaultElements: function() {
		var selectors = this.getSettings( 'selectors' );

		var elements = {
			$imageOverlay: this.$element.find( selectors.imageOverlay ),
			$videoWrapper: this.$element.find( selectors.videoWrapper )
		};

		elements.$videoFrame = elements.$videoWrapper.find( selectors.videoFrame );

		return elements;
	},

	getLightBox: function() {
		return qazanaFrontend.utils.lightbox;
	},

	handleVideo: function() {
		if ( ! this.getElementSettings( 'lightbox' ) ) {
			this.elements.$imageOverlay.remove();

			this.playVideo();
		}
	},

	playVideo: function() {
		var $videoFrame = this.elements.$videoFrame,
			newSourceUrl = $videoFrame[0].src.replace( '&autoplay=0', '' );

		$videoFrame[0].src = newSourceUrl + '&autoplay=1';
	},

	animateVideo: function() {
		this.getLightBox().setEntranceAnimation( this.getElementSettings( 'lightbox_content_animation' ) );
	},

	getAspectRatio: function() {

		var aspect_ratio = this.getElementSettings( 'aspect_ratio' );
		var selectors = this.getSettings( 'selectors' );
		
		if ( aspect_ratio === 'custom' ) {
			aspect_ratio = this.getElementSettings( 'custom_aspect_ratio' );
		} else {
			return;
		}

		var aspect_ratio_parts = aspect_ratio.split(':');

		var calculate_aspect_ratio = (Math.round(aspect_ratio_parts[1]) / Math.round(aspect_ratio_parts[0]));

		// Calculate padding top
		var padding = ( calculate_aspect_ratio * 100).toFixed(2);
		
		if (padding > 0) {
			this.$element.find( selectors.videoWrapper ).css('padding-bottom', padding.replace(".00", "") + '%');
		}

		return calculate_aspect_ratio;
	},

	handleAspectRatio: function() {		
		this.getLightBox().setVideoAspectRatio( this.getAspectRatio() );
	},

	bindEvents: function() {
		this.elements.$imageOverlay.on( 'click', this.handleVideo );
	},

	onElementChange: function( propertyName ) {
		if ( 'lightbox_content_animation' === propertyName ) {
			this.animateVideo();
			return;
		}

		var isLightBoxEnabled = this.getElementSettings( 'lightbox' );

		if ( 'lightbox' === propertyName && ! isLightBoxEnabled ) {
			this.getLightBox().getModal().hide();
			return;
		}

		if ( 'aspect_ratio' === propertyName && isLightBoxEnabled ) {
			this.handleAspectRatio();
		}
	},

	onInit: function() {
		this.getAspectRatio();
	}

} );

module.exports = function( $scope ) {
	new VideoModule( { $element: $scope } );
};
