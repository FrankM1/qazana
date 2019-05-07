var HandlerModule = require( 'qazana-frontend/handler-module' );

var WidgetParallax = HandlerModule.extend( {

	/**
	 * @param {number} speed
	 * @param {string} y
	 * @return {undefined}
	 */
	parallaxMove: function( $el, speed, direction, invert ) {
		speed = void 0 !== speed ? speed : '0.5';
		direction = void 0 !== direction ? direction : 'y';
		invert = void 0 !== invert ? '' : '-';

		var ttHeight = jQuery( window ).scrollTop();
		var position = $el.parent().offset();
        var tx = 0 - Math.round( ( position.top - ttHeight ) * speed );
        var options = {
            targets: $el.get( 0 ),
            duration: 0,
        };

		if ( 'x' === direction ) {
            options.translateX = invert + tx + 'px';
		} else {
            options.translateY = invert + tx + 'px';
        }

        anime( options );
	},

	onScroll: function() {
		this.parallaxMove(
			jQuery( '> .qazana-widget-container', this.$element ),
			this.getElementSettings( 'parallax_speed' ).size,
			this.getElementSettings( 'parallax_axis' ),
			this.getElementSettings( 'parallax_invert' )
		);
	},

	onInit: function() {
		// Exit if parallax not enabled
		if ( ! this.getElementSettings( 'parallax' ) ) {
			return;
		}

		var self = this;
		var availableDevices = this.getElementSettings( 'parallax_on' ) || [];

		if ( -1 !== availableDevices.indexOf( qazanaFrontend.getCurrentDeviceMode() ) ) {
			var macClass = 'MacIntel' === navigator.platform ? ' is-mac' : '';

			this.$element.addClass( macClass );

			jQuery( window ).on( 'scroll.qazanaParallax resize.qazanaParallax', function() {
				if ( self.$element.hasClass( 'qazana-entry-animation' ) && ! self.$element.hasClass( 'qazana-item-animated' ) ) {} else {
					self.onScroll();
				}
			} );
		}
	},
} );

module.exports = function( $scope ) {
	new WidgetParallax( { $element: $scope } );
};
