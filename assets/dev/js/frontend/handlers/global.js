module.exports = function( $scope, $ ) {
	if ( builderFrontend.isEditMode() ) {
		return;
	}

	var animation = $scope.data( 'animation' );

	if ( ! animation ) {
		return;
	}

	$scope.addClass( 'builder-invisible' ).removeClass( animation );

	builderFrontend.utils.waypoint( $scope, function() {
		$scope.removeClass( 'builder-invisible' ).addClass( animation );
	}, { offset: '90%' } );
};
