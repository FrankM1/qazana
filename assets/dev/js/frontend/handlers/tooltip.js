module.exports = function( $scope, $ ) {

	if ( $scope.find( '.qazana-tooltip' ).hasClass('v--show') ) {
		return;
	}

	$scope.mouseenter( function() {
		$( this ).find( '.qazana-tooltip' ).addClass('v--show');
	}).mouseleave( function() {
		$( this ).find( '.qazana-tooltip' ).removeClass('v--show');
	});

};
