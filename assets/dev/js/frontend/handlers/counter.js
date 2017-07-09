module.exports = function( $scope, $ ) {

	var $counter = $scope.find( '.qazana-counter-number' );
	var animation = $counter.data('animation-type');

	if ( animation === 'none' ) {
		return;
	}

	if ( 'count' == animation ){
		var odometer = new Odometer({el: $counter[0], animation: 'count' } );
	} else {
		var odometer = new Odometer({ el: $counter[0] });
	}

	qazanaFrontend.utils.waypoint( $scope.find( '.qazana-counter-number' ), function() {
			odometer.update( $(this).data('to-value') );
	}, { offset: '90%' } );

};
