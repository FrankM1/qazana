var activateSection = function( sectionIndex, $accordionTitles ) {
	var $activeTitle = $accordionTitles.filter( '.active' ),
		$requestedTitle = $accordionTitles.filter( '[data-section="' + sectionIndex + '"]' ),
		isRequestedActive = $requestedTitle.hasClass( 'active' );

	$activeTitle
		.removeClass( 'active' )
		.next()
		.slideUp();

	if ( ! isRequestedActive ) {
		$requestedTitle
			.addClass( 'active' )
			.next()
			.slideDown();
	}
};

module.exports = function( $scope ) {
	
	var defaultActiveSection = $scope.find( '.qazana-accordion' ).data( 'active-section' ),
		$accordionTitles = $scope.find( '.qazana-accordion-title' );

	if ( ! defaultActiveSection ) {
		defaultActiveSection = 1;
	}

	activateSection( defaultActiveSection, $accordionTitles );

	$accordionTitles.off( 'click').on( 'click', function() {
		activateSection( this.dataset.section, $accordionTitles );
	} );
};
