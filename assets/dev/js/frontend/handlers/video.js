var HandlerModule = require( 'qazana-frontend/handler-module' ),
VideoModule;

VideoModule = HandlerModule.extend( {
    getDefaultSettings: function() {
        return {
            selectors: {
                imageOverlay: '.qazana-custom-embed-image-overlay',
                videoWrapper: '.qazana-wrapper',
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

    handleAspectRatio: function() {
        this.getLightBox().setVideoAspectRatio( this.getElementSettings( 'aspect_ratio' ) );
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
    }
} );

module.exports = function( $scope ) {
    new VideoModule( { $element: $scope } );
};
