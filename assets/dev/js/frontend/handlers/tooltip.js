module.exports = function( $scope, $ ) {
	$scope.mouseenter( function() {
		$( this ).find( '.qazana-tooltip' ).addClass('v--show');
	}).mouseleave( function() {
		$( this ).find( '.qazana-tooltip' ).removeClass('v--show');
	});

};
