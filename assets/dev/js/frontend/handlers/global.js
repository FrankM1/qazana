var HandlerModule = require( 'qazana-frontend/handler-module' ),
    GlobalHandler;
var SplitText = require( '../animations/splitText' );

GlobalHandler = HandlerModule.extend( {

} );

module.exports = function( $scope ) {
    new GlobalHandler( {
        $element: $scope,
    } );
};
