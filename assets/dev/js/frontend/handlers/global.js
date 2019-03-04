var HandlerModule = require( 'qazana-frontend/handler-module' ),
	GlobalHandler;

GlobalHandler = HandlerModule.extend( {

	getElementName: function() {
		return 'global';
	},

	animate: function() {
		var self = this,
			$element = this.$element,
			animation = this.getAnimation(),
			elementSettings = this.getElementSettings(),
			animationDelay = elementSettings._animation_delay || elementSettings.animation_delay || 0;

		$element.removeClass( 'animated' ).removeClass( self.prevAnimation );

		setTimeout( function() {
			self.prevAnimation = animation;
			$element.addClass( animation ).addClass( 'animated' );
		}, animationDelay );
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
