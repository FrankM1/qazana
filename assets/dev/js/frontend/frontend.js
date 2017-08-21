/* global qazanaFrontendConfig */
( function( $ ) {
	var EventManager = require( '../utils/hooks' ),
		Module = require( './handler-module' ),
		elements = {},
		ElementsHandler = require( 'qazana-frontend/elements-handler' ),
	    Utils = require( 'qazana-frontend/utils' );

	var QazanaFrontend = function() {
		var self = this,
			scopeWindow = window;

		this.config = window.qazanaFrontendConfig;

		this.Module = Module;

		var addGlobalHandlers = function() {
			self.hooks.addAction( 'frontend/element_ready/global', require( 'qazana-frontend/handlers/global' ) );
			self.hooks.addAction( 'frontend/element_ready/widget', require( 'qazana-frontend/handlers/widget' ) );
		};

		var addElementsHandlers = function() {
			$.each( self.handlers, function( elementName, funcCallback ) {
				self.hooks.addAction( 'frontend/element_ready/' + elementName, funcCallback );
			} );
		};

		var runElementsHandlers = function() {
			var $elements;

			if ( self.isEditMode() ) {
				// Elements outside from the Preview
				$elements = self.getScopeWindow().jQuery( '.qazana-element', '.qazana:not(.qazana-edit-mode)' );
			} else {
				$elements = $( '.qazana-element' );
			}

			$elements.each( function() {
				self.elementsHandler.runReadyTrigger( $( this ) );
			} );
		};

		// element-type.skin-type
		this.handlers = {
			// Elements
			'section': require( 'qazana-frontend/handlers/section' ),

			// Widgets
			'accordion.default': require( 'qazana-frontend/handlers/accordion' ),
			'alert.default': require( 'qazana-frontend/handlers/alert' ),
			'counter.default': require( 'qazana-frontend/handlers/counter' ),
			'piechart.default': require( 'qazana-frontend/handlers/piechart' ),
			'progress.default': require( 'qazana-frontend/handlers/progress' ),
			'tabs.default': require( 'qazana-frontend/handlers/tabs' ),
			'toggle.default': require( 'qazana-frontend/handlers/toggle' ),
			'tooltip.default': require( 'qazana-frontend/handlers/tooltip' ),
			'video.default': require( 'qazana-frontend/handlers/video' ),
			//'image-carousel.default': require( 'qazana-frontend/handlers/image-carousel' ),
			'menu-anchor.default': require( 'qazana-frontend/handlers/menu-anchor' ),
		};

		this.getScopeWindow = function() {
			return scopeWindow;
		};

		this.setScopeWindow = function( window ) {
			scopeWindow = window;
		};

		this.isEditMode = function() {
			return window.qazanaFrontendConfig ? window.qazanaFrontendConfig.isEditMode : false;
		};

		this.hooks = new EventManager();
		this.elementsHandler = new ElementsHandler( $ );
		this.utils = new Utils( $ );

		this.initHandlers = function() {

		};

		this.init = function() {

			initElements();

			if ( self.isEditMode() ) {
				return;
			}

			addGlobalHandlers();

			addElementsHandlers();

			self.utils.insertYTApi();

			runElementsHandlers();
		};

		var initElements = function() {
			elements.window = window;

			elements.$window = $( window );

			elements.$document = $( document );

			elements.$body = $( 'body' );

			elements.$qazana = elements.$document.find( '.qazana' );
		};

		this.getElements = function( element ) {
			if ( element ) {
				return elements[ element ];
			}

			return elements;
		};

		// Based on underscore function
		this.throttle = function( func, wait ) {
			var timeout,
				context,
				args,
				result,
				previous = 0;

			var later = function() {
				previous = Date.now();
				timeout = null;
				result = func.apply( context, args );

				if ( ! timeout ) {
					context = args = null;
				}
			};

			return function() {
				var now = Date.now(),
					remaining = wait - ( now - previous );

				context = this;
				args = arguments;

				if ( remaining <= 0 || remaining > wait ) {
					if ( timeout ) {
						clearTimeout( timeout );
						timeout = null;
					}

					previous = now;
					result = func.apply( context, args );

					if ( ! timeout ) {
						context = args = null;
					}
				} else if ( ! timeout ) {
					timeout = setTimeout( later, remaining );
				}

				return result;
			};

		};

    };

	window.qazanaFrontend = new QazanaFrontend();
})( jQuery );

jQuery( function() {
	window.qazanaFrontend.init();
});
