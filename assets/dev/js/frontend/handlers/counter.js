module.exports = function( $scope, $ ) {
	var $counter = $scope.find( '.qazana-counter-number-value' );
    var animation = $counter.data( 'animation-type' );
    var odometer;

	if ( 'none' === animation ) {
		return;
	}

	if ( 'count' === animation ) {
		odometer = new Odometer( { el: $counter[ 0 ], animation: 'count' } );
	} else {
		odometer = new Odometer( { el: $counter[ 0 ] } );
	}

	qazanaFrontend.waypoint( $counter, function() {
		odometer.update( $( this ).data( 'to-value' ) );
	}, { offset: '90%' } );
};
