var SplitText = require( '../animations/splitText' );
var FitText = require( '../animations/fitText' );

module.exports = function( $scope ) {

    if ( $scope.is( '[data-fittext-options]' ) ) {
		new FitText( $scope, $scope.data( 'fittext-options' ) );
    }

	if (
		! $scope.parents( '[data-custom-animations]' ).length &&
        ! $scope[ 0 ].hasAttribute( 'data-custom-animations' ) &&
        $scope.is( '[data-split-text]' )
	) {
        new SplitText( $scope, $scope.data( 'split-options' ) );
    }
};
