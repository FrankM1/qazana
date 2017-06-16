module.exports = function( $scope, $ ) {
	if ( ! builderFrontend.isEditMode() ) {
		return;
	}

	if ( $scope.hasClass( 'builder-widget-edit-disabled' ) ) {
		return;
	}

	$scope.find( '.builder-element' ).each( function() {
		builderFrontend.elementsHandler.runReadyTrigger( $( this ) );
	} );
};
