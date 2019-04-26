var HandlerModule = require( 'qazana-frontend/handler-module' ),
    GlobalHandler;

GlobalHandler = HandlerModule.extend( {

} );

module.exports = function( $scope ) {
    new GlobalHandler( {
        $element: $scope,
    } );
};
