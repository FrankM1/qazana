module.exports = function( $scope, $ ) {
	qazanaFrontend.utils.waypoint( $scope.find( '.qazana-progress-bar' ), function() {
		var $progressbar = $( this );

		$progressbar.css( 'width', $progressbar.data( 'max' ) + '%' );
	}, { offset: '90%' } );
};
