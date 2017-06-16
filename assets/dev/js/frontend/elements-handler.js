var ElementsHandler;

ElementsHandler = function( $ ) {
	this.runReadyTrigger = function( $scope ) {
		var elementType = $scope.data( 'element_type' );

		if ( ! elementType ) {
			return;
		}

		builderFrontend.hooks.doAction( 'frontend/element_ready/global', $scope, $ );

		var isWidgetType = ( -1 === [ 'section', 'column' ].indexOf( elementType ) );

		if ( isWidgetType ) {
			builderFrontend.hooks.doAction( 'frontend/element_ready/widget', $scope, $ );
		}

		builderFrontend.hooks.doAction( 'frontend/element_ready/' + elementType, $scope, $ );

		$(document).trigger( 'element_ready', $scope );
		$(document).trigger( 'element_ready::'+ elementType, $scope );
	};

	this.addExternalListener = function( $scope, event, callback, externalElement ) {
		var $externalElement = $( externalElement || builderFrontend.getScopeWindow() );

		if ( ! builderFrontend.isEditMode() ) {
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
