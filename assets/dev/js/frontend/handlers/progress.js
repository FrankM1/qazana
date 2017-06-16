module.exports = function( $scope, $ ) {
	builderFrontend.utils.waypoint( $scope.find( '.builder-progress-bar' ), function() {
		var $progressbar = $( this );

		$progressbar.css( 'width', $progressbar.data( 'max' ) + '%' );
	}, { offset: '90%' } );
};
