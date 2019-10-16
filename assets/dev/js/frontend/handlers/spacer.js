var HandlerModule = require( 'qazana-frontend/handler-module' ),
SpaceModule;

SpaceModule = HandlerModule.extend( {

	onElementChange: function( propertyName ) {
		if ( 'space' === propertyName ) {
            var space = this.getElementSettings( 'space' );
			this.$element.find( '.qazana-space-resize-value' ).html( 'Spacing: ' + space.size + space.unit );
		}
    },

    onInit: function() {
        if ( ! qazanaFrontend.isEditMode() ) {
			return;
		}
        var space = this.getElementSettings( 'space' );
        var text = '<span class="qazana-space-resize-value">Spacing: ' + space.size + space.unit + '</span>';
        this.$element.find( '.qazana-spacer-inner' ).html( text );
	},

} );

module.exports = function( $scope ) {
	new SpaceModule( { $element: $scope } );
};
