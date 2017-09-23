var ElementsHandler;

ElementsHandler = function( $ ) {
	var self = this;

	// element-type.skin-type
	var handlers = {
		// Elements
		'section': require( 'qazana-frontend/handlers/section' ),

		// Widgets
		'accordion.default': require( 'qazana-frontend/handlers/accordion' ),
		'alert.default': require( 'qazana-frontend/handlers/alert' ),
		'counter.default': require( 'qazana-frontend/handlers/counter' ),
		'progress.default': require( 'qazana-frontend/handlers/progress' ),
		'tabs.default': require( 'qazana-frontend/handlers/tabs' ),
		'toggle.default': require( 'qazana-frontend/handlers/toggle' ),
		'video.default': require( 'qazana-frontend/handlers/video' ),
		//'image-carousel.default': require( 'qazana-frontend/handlers/image-carousel' ),
		'text-editor.default': require( 'qazana-frontend/handlers/text-editor' )
	};

	var addGlobalHandlers = function() {
		qazanaFrontend.hooks.addAction( 'frontend/element_ready/global', require( 'qazana-frontend/handlers/global' ) );
		qazanaFrontend.hooks.addAction( 'frontend/element_ready/widget', require( 'qazana-frontend/handlers/widget' ) );
	};

	var addElementsHandlers = function() {
		$.each( handlers, function( elementName, funcCallback ) {
			qazanaFrontend.hooks.addAction( 'frontend/element_ready/' + elementName, funcCallback );
		} );
	};

	var runElementsHandlers = function() {
		var $elements;

		if ( qazanaFrontend.isEditMode() ) {
			// Elements outside from the Preview
			$elements = jQuery( '.qazana-element', '.qazana:not(.qazana-edit-mode)' );
		} else {
			$elements = $( '.qazana-element' );
		}

		$elements.each( function() {
			self.runReadyTrigger( $( this ) );
		} );
	};

	var init = function() {
		if ( ! qazanaFrontend.isEditMode() ) {
			self.initHandlers();
		}
	};

	this.initHandlers = function() {
		addGlobalHandlers();

		addElementsHandlers();

		runElementsHandlers();
	};

	this.getHandlers = function( handlerName ) {
		if ( handlerName ) {
			return handlers[ handlerName ];
		}

		return handlers;
	};

	this.runReadyTrigger = function( $scope ) {
		var elementType = $scope.attr( 'data-element_type' );

		if ( ! elementType ) {
			return;
		}

		// Initializing the `$scope` as frontend jQuery instance
		$scope = jQuery( $scope );

		qazanaFrontend.hooks.doAction( 'frontend/element_ready/global', $scope, $ );

		var isWidgetType = ( -1 === [ 'section', 'column' ].indexOf( elementType ) );

		if ( isWidgetType ) {
			qazanaFrontend.hooks.doAction( 'frontend/element_ready/widget', $scope, $ );
		}

		qazanaFrontend.hooks.doAction( 'frontend/element_ready/' + elementType, $scope, $ );
	};

	init();
};

module.exports = ElementsHandler;
