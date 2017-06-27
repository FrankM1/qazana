module.exports = function( $scope, $ ) {
	if ( ! qazanaFrontend.isEditMode() ) {
		return;
	}

	if ( $scope.hasClass( 'qazana-widget-edit-disabled' ) ) {
		return;
	}

	$scope.find( '.qazana-element' ).each( function() {
		qazanaFrontend.elementsHandler.runReadyTrigger( $( this ) );
	} );
};
