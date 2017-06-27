module.exports = function( $scope, $ ) {
	if ( qazanaFrontend.isEditMode() ) {
		return;
	}

	var animation = $scope.data( 'animation' );

	if ( ! animation ) {
		return;
	}

	$scope.addClass( 'qazana-invisible' ).removeClass( animation );

	qazanaFrontend.utils.waypoint( $scope, function() {
		$scope.removeClass( 'qazana-invisible' ).addClass( animation );
	}, { offset: '90%' } );
};
