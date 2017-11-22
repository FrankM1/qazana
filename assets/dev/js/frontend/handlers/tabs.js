var TabsModule = require( 'qazana-frontend/handlers/base-tabs' );

module.exports = function( $scope ) {
	new TabsModule( {
		$element: $scope,
		toggleSelf: false
	} );
};
