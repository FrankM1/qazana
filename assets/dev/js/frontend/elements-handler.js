var ElementsHandler;

ElementsHandler = function( $ ) {
	this.runReadyTrigger = function( $scope ) {
		var elementType = $scope.data( 'element_type' );

		if ( ! elementType ) {
			return;
		}

		qazanaFrontend.hooks.doAction( 'frontend/element_ready/global', $scope, $ );

		var isWidgetType = ( -1 === [ 'section', 'column' ].indexOf( elementType ) );

		if ( isWidgetType ) {
			qazanaFrontend.hooks.doAction( 'frontend/element_ready/widget', $scope, $ );
		}

		qazanaFrontend.hooks.doAction( 'frontend/element_ready/' + elementType, $scope, $ );
	};

	this.addExternalListener = function( $scope, event, callback, externalElement ) {
		var $externalElement = $( externalElement || qazanaFrontend.getScopeWindow() );

		if ( ! qazanaFrontend.isEditMode() ) {
			$externalElement.on( event, callback );

			return;
		}

		var eventNS = event + '.' + $scope.attr( 'id' );

		$externalElement
			.off( eventNS )
			.on( eventNS, callback );
	};
};

module.exports = ElementsHandler;
