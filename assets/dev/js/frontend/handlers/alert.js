module.exports = function( $scope, $ ) {
	$scope.find( '.qazana-alert-dismiss' ).on( 'click', function() {
		$( this ).parent().fadeOut();
	} );
};
