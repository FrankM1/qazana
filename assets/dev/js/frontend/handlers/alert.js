module.exports = function( $scope, $ ) {
	$scope.find( '.builder-alert-dismiss' ).on( 'click', function() {
		$( this ).parent().fadeOut();
	} );
};
