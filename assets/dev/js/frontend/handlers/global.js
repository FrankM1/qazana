var HandlerModule = require( 'qazana-frontend/handler-module' ),
	GlobalHandler;

GlobalHandler = HandlerModule.extend( {

	getElementName: function() {
		return 'global';
	},

	animate: function() {
        var animationDuration,
            self = this,
			$element = this.$element,
			animation = this.getAnimation(),
            elementSettings = this.getElementSettings(),
            duration = elementSettings._animation_duration || '',
			animationDelay = elementSettings._animation_delay || elementSettings.animation_delay || 0;

        if ( 'fast' === duration ) {
            animationDuration = '500';
        } else if ( 'slow' === duration ) {
            animationDuration = '2000';
        } else {
            animationDuration = '1000';
        }

		$element.removeClass( 'qazana-element-animation-done' ).removeClass( self.prevAnimation );

        $element.css( {
            'animation-duration': animationDuration + 'ms',
        } );

        qazanaFrontend.waypoint( $element, function() {
            setTimeout( function() {
                self.prevAnimation = animation;
                $element.addClass( animation ).addClass( 'qazana-element-animation-done' );
            }, animationDelay );
        }, { offset: '90%' } );

	},

	getAnimation: function() {
		var elementSettings = this.getElementSettings();

		return elementSettings._animation_animated && elementSettings._animation_in;
	},

    removeLoader: function() {
        this.$element.find( '.qazana-loading-indicator' ).remove();
        this.$element.removeClass( 'qazana-has-loading-indicator' );
        jQuery( window ).trigger( 'resize' );
    },

	onInit: function() {
		HandlerModule.prototype.onInit.apply( this, arguments );
        this.removeLoader();

        if ( 'animated' === this.getElementSettings( '_animation_animated' ) ) {
            this.animate();
        }
	},

	onElementChange: function( propertyName ) {
		if ( /^_?animation/.test( propertyName ) ) {
			this.animate();
		}
	},

} );

module.exports = function( $scope ) {
	new GlobalHandler( { $element: $scope } );
};
