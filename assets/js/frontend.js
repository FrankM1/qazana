(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

		$(document).trigger( 'element_ready', $scope );
		$(document).trigger( 'element_ready::'+ elementType, $scope );
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

},{}],2:[function(require,module,exports){
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

},{"../utils/hooks":18,"./handler-module":3,"qazana-frontend/elements-handler":1,"qazana-frontend/handlers/accordion":4,"qazana-frontend/handlers/alert":5,"qazana-frontend/handlers/counter":7,"qazana-frontend/handlers/global":8,"qazana-frontend/handlers/menu-anchor":9,"qazana-frontend/handlers/piechart":10,"qazana-frontend/handlers/progress":11,"qazana-frontend/handlers/section":12,"qazana-frontend/handlers/tabs":13,"qazana-frontend/handlers/toggle":14,"qazana-frontend/handlers/video":15,"qazana-frontend/handlers/widget":16,"qazana-frontend/utils":17}],3:[function(require,module,exports){
var ViewModule = require( '../utils/view-module' ),
	HandlerModule;

HandlerModule = ViewModule.extend( {
	$element: null,

	onElementChange: null,

	onGeneralSettingsChange: null,

	onPageSettingsChange: null,

	__construct: function( settings ) {
		this.$element  = settings.$element;

		if ( qazanaFrontend.isEditMode() ) {
			this.addEditorListener();
		}
	},

	getUniqueHandlerID: function( cid, $element ) {
		if ( ! cid ) {
			cid = this.getModelCID();
		}

		if ( ! $element ) {
			$element = this.$element;
		}

		return cid + $element.attr( 'data-element_type' ) + this.getConstructorID();
	},

	addEditorListener: function() {
		var self = this,
			uniqueHandlerID = self.getUniqueHandlerID();

		if ( self.onElementChange ) {
			var elementName = self.getElementName(),
				eventName = 'change';

			if ( 'global' !== elementName ) {
				eventName += ':' + elementName;
			}

			qazanaFrontend.addListenerOnce( uniqueHandlerID, eventName, function( controlView, elementView ) {
				var elementViewHandlerID = self.getUniqueHandlerID( elementView.model.cid, elementView.$el );

				if ( elementViewHandlerID !== uniqueHandlerID ) {
					return;
				}

				self.onElementChange( controlView.model.get( 'name' ),  controlView, elementView );
			}, qazana.channels.editor );
		}

		[ 'page', 'general' ].forEach( function( settingsType ) {
			var listenerMethodName = 'on' + settingsType.charAt( 0 ).toUpperCase() + settingsType.slice( 1 ) + 'SettingsChange';

			if ( self[ listenerMethodName ] ) {
				qazanaFrontend.addListenerOnce( uniqueHandlerID, 'change', function( model ) {
					self[ listenerMethodName ]( model.changed );
				}, qazana.settings[ settingsType ].model );
			}
		} );
	},

	getElementName: function() {
		return this.$element.data( 'element_type' ).split( '.' )[0];
	},

	getID: function() {
		return this.$element.data( 'id' );
	},

	getModelCID: function() {
		return this.$element.data( 'model-cid' );
	},

	getElementSettings: function( setting ) {
		var elementSettings = {},
			modelCID = this.getModelCID();

		if ( qazanaFrontend.isEditMode() && modelCID ) {
			var settings = qazanaFrontend.config.elements.data[ modelCID ],
				settingsKeys = qazanaFrontend.config.elements.keys[ settings.attributes.widgetType || settings.attributes.elType ];

			jQuery.each( settings.getActiveControls(), function( controlKey ) {
				if ( -1 !== settingsKeys.indexOf( controlKey ) ) {
					elementSettings[ controlKey ] = settings.attributes[ controlKey ];
				}
			} );
		} else {
			elementSettings = this.$element.data( 'settings' ) || {};
		}

		return this.getItems( elementSettings, setting );
	},

	getEditSettings: function( setting ) {
		if ( ! qazanaFrontend.isEditMode() ) {
			return {};
		}

		var editSettings = qazanaFrontend.config.elements.editSettings[ this.getModelCID() ];

		return this.getItems( editSettings.attributes, setting );
	}
} );

module.exports = HandlerModule;

},{"../utils/view-module":20}],4:[function(require,module,exports){
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

module.exports = function( $scope, $ ) {
	var defaultActiveSection = $scope.find( '.qazana-accordion' ).data( 'active-section' ),
		$accordionTitles = $scope.find( '.qazana-accordion-title' );

	if ( ! defaultActiveSection ) {
		defaultActiveSection = 1;
	}

	activateSection( defaultActiveSection, $accordionTitles );

	$accordionTitles.on( 'click', function() {
		activateSection( this.dataset.section, $accordionTitles );
	} );
};

},{}],5:[function(require,module,exports){
module.exports = function( $scope, $ ) {
	$scope.find( '.qazana-alert-dismiss' ).on( 'click', function() {
		$( this ).parent().fadeOut();
	} );
};

},{}],6:[function(require,module,exports){
module.exports = function( $scope, $ ) {

	var BackgroundVideo = function( $backgroundVideoContainer, $ ) {
		var player,
			elements = {},
			isYTVideo = false;

		var calcVideosSize = function() {
			var containerWidth = $backgroundVideoContainer.outerWidth(),
				containerHeight = $backgroundVideoContainer.outerHeight(),
				aspectRatioSetting = '16:9', //TEMP
				aspectRatioArray = aspectRatioSetting.split( ':' ),
				aspectRatio = aspectRatioArray[ 0 ] / aspectRatioArray[ 1 ],
				ratioWidth = containerWidth / aspectRatio,
				ratioHeight = containerHeight * aspectRatio,
				isWidthFixed = containerWidth / containerHeight > aspectRatio;

			return {
				width: isWidthFixed ? containerWidth : ratioHeight,
				height: isWidthFixed ? ratioWidth : containerHeight
			};
		};

		var changeVideoSize = function() {
			var $video = isYTVideo ? $( player.getIframe() ) : elements.$backgroundVideo,
				size = calcVideosSize();

			$video.width( size.width ).height( size.height );
		};

		var prepareYTVideo = function( YT, videoID ) {
			player = new YT.Player( elements.$backgroundVideo[ 0 ], {
				videoId: videoID,
				events: {
					onReady: function() {
						player.mute();
						player.playVideo();

						changeVideoSize();

					},
					onStateChange: function( event ) {
						if ( event.data === YT.PlayerState.ENDED ) {
							player.seekTo( 0 );
						}
					}
				},
				playerVars: {
					controls: 0,
					showinfo: 0
				}
			} );

			$( qazanaFrontend.getScopeWindow() ).on( 'resize', changeVideoSize );
		};

	    var prepareVimeoVideo = function( YT, videoID ) {

	        $( qazanaFrontend.getScopeWindow() ).on( 'resize', changeVideoSize );
	    };

		var initElements = function() {
			elements.$backgroundVideo = $backgroundVideoContainer.children( '.qazana-background-video' );
		};

		var run = function() {
			var videoID = elements.$backgroundVideo.data( 'video-id' ),
			 	videoHost = elements.$backgroundVideo.data( 'video-host' );

			if ( videoID && videoHost === 'youtube' ) {
				isYTVideo = true;

				qazanaFrontend.utils.onYoutubeApiReady( function( YT ) {
					setTimeout( function() {
						prepareYTVideo( YT, videoID );
					}, 1 );
				} );

	        } else if ( videoID && videoHost === 'vimeo' ) {
			} else {
				elements.$backgroundVideo.one( 'canplay', changeVideoSize );
			}
		};

		var init = function() {
			initElements();
			run();
		};

		init();
	};

	var $backgroundVideoContainer = $scope.find( '.qazana-background-video-container' );

	if ( $backgroundVideoContainer ) {
		new BackgroundVideo( $backgroundVideoContainer, $ );
	}
};

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
module.exports = function( $scope, $ ) {
	if ( qazanaFrontend.isEditMode() ) {
		return;
	}

	var animation = $scope.data( 'animation' );

	if ( ! animation ) {
		return;
	}

	$scope.addClass( 'qazana-invisible' ).removeClass( animation );

	qazanaFrontend.utils.waypoint( $scope, function() {
		$scope.removeClass( 'qazana-invisible' ).addClass( animation );
	}, { offset: '90%' } );
};

},{}],9:[function(require,module,exports){
module.exports = function( $scope, $ ) {
	if ( qazanaFrontend.isEditMode() ) {
		return;
	}

	var $anchor = $scope.find( '.qazana-menu-anchor' ),
		anchorID = $anchor.attr( 'id' ),
		$anchorLinks = $( 'a[href*="#' + anchorID + '"]' ),
		$scrollable = $( 'html, body' ),
		adminBarHeight = $( '#wpadminbar' ).height();

	$anchorLinks.on( 'click', function( event ) {
		var isSamePathname = ( location.pathname === this.pathname ),
			isSameHostname = ( location.hostname === this.hostname );

		if ( ! isSameHostname || ! isSamePathname ) {
			return;
		}

		event.preventDefault();

		$scrollable.animate( {
			scrollTop: $anchor.offset().top - adminBarHeight
		}, 1000 );
	} );
	
};

},{}],10:[function(require,module,exports){
module.exports = function( $scope, $ ) {

    var $chart = $scope.find('.qazana-piechart');
    var $piechart_progress = $chart.find('.qazana-piechart-number-count');

    var animation = {
        duration: $chart.data('duration')
    };

    if ( $chart.closest('.qazana-element').hasClass('qazana-piechart-animation-type-none') ) {
        animation = {
            duration: 0
        };
    }

    if ( false == animation ){
        $piechart_progress.html($piechart_progress.data('value') );
        $chart.addClass('animated');
    }

    qazanaFrontend.utils.waypoint( $chart, function() {

    if ( ! $chart.hasClass('animated') ) {

        $chart.circleProgress({
                startAngle: -Math.PI / 4 * 2,
                emptyFill: $chart.data('emptyfill'),
                animation: animation
        }).on('circle-animation-progress', function (event, progress) {
            $piechart_progress.html( parseInt( ( $piechart_progress.data('value') ) * progress ) );
        }).on('circle-animation-end', function (event) {
            $chart.addClass('animated');
        });

    }

    }, { offset: '90%' } );

};

},{}],11:[function(require,module,exports){
module.exports = function( $scope, $ ) {
	qazanaFrontend.utils.waypoint( $scope.find( '.qazana-progress-bar' ), function() {
		var $progressbar = $( this );

		$progressbar.css( 'width', $progressbar.data( 'max' ) + '%' );
	}, { offset: '90%' } );
};

},{}],12:[function(require,module,exports){
var BackgroundVideo = require( 'qazana-frontend/handlers/background-video' );

var HandlerModule = require( 'qazana-frontend/handler-module' );

var StretchedSection = HandlerModule.extend( {

	bindEvents: function() {
		qazanaFrontend.addListenerOnce( this.$element.data( 'model-cid' ), 'resize', this.stretchSection );
	},

	stretchSection: function() {
		// Clear any previously existing css associated with this script
		var direction = qazanaFrontend.config.is_rtl ? 'right' : 'left',
			resetCss = {},
			isStretched = this.$element.hasClass( 'qazana-section-stretched' );

		if ( qazanaFrontend.isEditMode() || isStretched ) {
			resetCss.width = 'auto';

			resetCss[ direction ] = 0;

			this.$element.css( resetCss );
		}

		if ( ! isStretched ) {
			return;
		}

		var $sectionContainer,
			hasSpecialContainer = false;

		try {
			$sectionContainer = jQuery( qazanaFrontend.getGeneralSettings( 'qazana_stretched_section_container' ) );

			if ( $sectionContainer.length ) {
				hasSpecialContainer = true;
			}
		} catch ( e ) {}

		if ( ! hasSpecialContainer ) {
			$sectionContainer = qazanaFrontend.getElements( '$window' );
		}

		var containerWidth = $sectionContainer.outerWidth(),
			sectionWidth = this.$element.outerWidth(),
			sectionOffset = this.$element.offset().left,
			correctOffset = sectionOffset;

		if ( hasSpecialContainer ) {
			var containerOffset = $sectionContainer.offset().left;

			if ( sectionOffset > containerOffset ) {
				correctOffset = sectionOffset - containerOffset;
			} else {
				correctOffset = 0;
			}
		}

		if ( qazanaFrontend.config.is_rtl ) {
			correctOffset = containerWidth - ( sectionWidth + correctOffset );
		}

		resetCss.width = containerWidth + 'px';

		resetCss[ direction ] = -correctOffset + 'px';

		this.$element.css( resetCss );
	},

	onInit: function() {
		HandlerModule.prototype.onInit.apply( this, arguments );

		this.stretchSection();
	},

	onGeneralSettingsChange: function( changed ) {
		if ( 'qazana_stretched_section_container' in changed ) {
			this.stretchSection();
		}
	}
} );

module.exports = function( $scope, $ ) {

	if ( qazanaFrontend.isEditMode() || $scope.hasClass( 'qazana-section-stretched' ) ) {
		new StretchedSection( { $element: $scope } );
	}
	new BackgroundVideo( $scope, $ );

};

},{"qazana-frontend/handler-module":3,"qazana-frontend/handlers/background-video":6}],13:[function(require,module,exports){
module.exports = function( $scope, $ ) {
	var defaultActiveTab = $scope.find( '.qazana-tabs' ).data( 'active-tab' ),
		$tabsTitles = $scope.find( '.qazana-tab-title' ),
		$tabs = $scope.find( '.qazana-tab-content' ),
		$active,
		$content;

	if ( ! defaultActiveTab ) {
		defaultActiveTab = 1;
	}

	var activateTab = function( tabIndex ) {
		if ( $active ) {
			$active.removeClass( 'active' );

			$content.hide();
		}

		$active = $tabsTitles.filter( '[data-tab="' + tabIndex + '"]' );

		$active.addClass( 'active' );

		$content = $tabs.filter( '[data-tab="' + tabIndex + '"]' );

		$content.show();
	};

	activateTab( defaultActiveTab );

	$tabsTitles.on( 'click', function() {
		activateTab( this.dataset.tab );
	} );
};

},{}],14:[function(require,module,exports){
module.exports = function( $scope, $ ) {
	var $toggleTitles = $scope.find( '.qazana-toggle-title' );

	$toggleTitles.on( 'click', function() {
		var $active = $( this ),
			$content = $active.next();

		if ( $active.hasClass( 'active' ) ) {
			$active.removeClass( 'active' );
			$content.slideUp();
		} else {
			$active.addClass( 'active' );
			$content.slideDown();
		}
	} );
};

},{}],15:[function(require,module,exports){
module.exports = function( $scope, $ ) {
	var $imageOverlay = $scope.find( '.qazana-custom-embed-image-overlay' ),
		$videoFrame = $scope.find( 'iframe' );

	if ( ! $imageOverlay.length ) {
		return;
	}

	$imageOverlay.on( 'click', function() {
		$imageOverlay.remove();
		var newSourceUrl = $videoFrame[0].src;
		// Remove old autoplay if exists
		newSourceUrl = newSourceUrl.replace( '&autoplay=0', '' );

		$videoFrame[0].src = newSourceUrl + '&autoplay=1';
	} );
};

},{}],16:[function(require,module,exports){
module.exports = function( $scope, $ ) {
	if ( ! qazanaFrontend.isEditMode() ) {
		return;
	}

	if ( $scope.hasClass( 'qazana-widget-edit-disabled' ) ) {
		return;
	}

	$scope.find( '.qazana-element' ).each( function() {
		qazanaFrontend.elementsHandler.runReadyTrigger( $( this ) );
	} );
};

},{}],17:[function(require,module,exports){
module.exports = function( $ ) {
    var self = this;

    this.onYoutubeApiReady = function( callback ) {
        if ( window.YT && YT.loaded ) {
            callback( YT );
        } else {
            // If not ready check again by timeout..
            setTimeout( function() {
                self.onYoutubeApiReady( callback );
            }, 350 );
        }
    };

    this.insertYTApi = function() {
        $( 'script:first' ).before(  $( '<script>', { src: 'https://www.youtube.com/iframe_api' } ) );
    };

    this.waypoint = function( $element, callback, options ) {
		var correctCallback = function() {
			var element = this.element || this;

			return callback.apply( element, arguments );
		};

		$element.waypoint( correctCallback, options );
	};
    
};

},{}],18:[function(require,module,exports){
'use strict';

/**
 * Handles managing all events for whatever you plug it into. Priorities for hooks are based on lowest to highest in
 * that, lowest priority hooks are fired first.
 */
var EventManager = function() {
	var slice = Array.prototype.slice,
		MethodsAvailable;

	/**
	 * Contains the hooks that get registered with this EventManager. The array for storage utilizes a "flat"
	 * object literal such that looking up the hook utilizes the native object literal hash.
	 */
	var STORAGE = {
		actions: {},
		filters: {}
	};

	/**
	 * Removes the specified hook by resetting the value of it.
	 *
	 * @param type Type of hook, either 'actions' or 'filters'
	 * @param hook The hook (namespace.identifier) to remove
	 *
	 * @private
	 */
	function _removeHook( type, hook, callback, context ) {
		var handlers, handler, i;

		if ( ! STORAGE[ type ][ hook ] ) {
			return;
		}
		if ( ! callback ) {
			STORAGE[ type ][ hook ] = [];
		} else {
			handlers = STORAGE[ type ][ hook ];
			if ( ! context ) {
				for ( i = handlers.length; i--; ) {
					if ( handlers[ i ].callback === callback ) {
						handlers.splice( i, 1 );
					}
				}
			} else {
				for ( i = handlers.length; i--; ) {
					handler = handlers[ i ];
					if ( handler.callback === callback && handler.context === context ) {
						handlers.splice( i, 1 );
					}
				}
			}
		}
	}

	/**
	 * Use an insert sort for keeping our hooks organized based on priority. This function is ridiculously faster
	 * than bubble sort, etc: http://jsperf.com/javascript-sort
	 *
	 * @param hooks The custom array containing all of the appropriate hooks to perform an insert sort on.
	 * @private
	 */
	function _hookInsertSort( hooks ) {
		var tmpHook, j, prevHook;
		for ( var i = 1, len = hooks.length; i < len; i++ ) {
			tmpHook = hooks[ i ];
			j = i;
			while ( ( prevHook = hooks[ j - 1 ] ) && prevHook.priority > tmpHook.priority ) {
				hooks[ j ] = hooks[ j - 1 ];
				--j;
			}
			hooks[ j ] = tmpHook;
		}

		return hooks;
	}

	/**
	 * Adds the hook to the appropriate storage container
	 *
	 * @param type 'actions' or 'filters'
	 * @param hook The hook (namespace.identifier) to add to our event manager
	 * @param callback The function that will be called when the hook is executed.
	 * @param priority The priority of this hook. Must be an integer.
	 * @param [context] A value to be used for this
	 * @private
	 */
	function _addHook( type, hook, callback, priority, context ) {
		var hookObject = {
			callback: callback,
			priority: priority,
			context: context
		};

		// Utilize 'prop itself' : http://jsperf.com/hasownproperty-vs-in-vs-undefined/19
		var hooks = STORAGE[ type ][ hook ];
		if ( hooks ) {
			// TEMP FIX BUG
			var hasSameCallback = false;
			jQuery.each( hooks, function() {
				if ( this.callback === callback ) {
					hasSameCallback = true;
					return false;
				}
			} );

			if ( hasSameCallback ) {
				return;
			}
			// END TEMP FIX BUG

			hooks.push( hookObject );
			hooks = _hookInsertSort( hooks );
		} else {
			hooks = [ hookObject ];
		}

		STORAGE[ type ][ hook ] = hooks;
	}

	/**
	 * Runs the specified hook. If it is an action, the value is not modified but if it is a filter, it is.
	 *
	 * @param type 'actions' or 'filters'
	 * @param hook The hook ( namespace.identifier ) to be ran.
	 * @param args Arguments to pass to the action/filter. If it's a filter, args is actually a single parameter.
	 * @private
	 */
	function _runHook( type, hook, args ) {
		var handlers = STORAGE[ type ][ hook ], i, len;

		if ( ! handlers ) {
			return ( 'filters' === type ) ? args[ 0 ] : false;
		}

		len = handlers.length;
		if ( 'filters' === type ) {
			for ( i = 0; i < len; i++ ) {
				args[ 0 ] = handlers[ i ].callback.apply( handlers[ i ].context, args );
			}
		} else {
			for ( i = 0; i < len; i++ ) {
				handlers[ i ].callback.apply( handlers[ i ].context, args );
			}
		}

		return ( 'filters' === type ) ? args[ 0 ] : true;
	}

	/**
	 * Adds an action to the event manager.
	 *
	 * @param action Must contain namespace.identifier
	 * @param callback Must be a valid callback function before this action is added
	 * @param [priority=10] Used to control when the function is executed in relation to other callbacks bound to the same hook
	 * @param [context] Supply a value to be used for this
	 */
	function addAction( action, callback, priority, context ) {
		if ( 'string' === typeof action && 'function' === typeof callback ) {
			priority = parseInt( ( priority || 10 ), 10 );
			_addHook( 'actions', action, callback, priority, context );
		}

		return MethodsAvailable;
	}

	/**
	 * Performs an action if it exists. You can pass as many arguments as you want to this function; the only rule is
	 * that the first argument must always be the action.
	 */
	function doAction( /* action, arg1, arg2, ... */ ) {
		var args = slice.call( arguments );
		var action = args.shift();

		if ( 'string' === typeof action ) {
			_runHook( 'actions', action, args );
		}

		return MethodsAvailable;
	}

	/**
	 * Removes the specified action if it contains a namespace.identifier & exists.
	 *
	 * @param action The action to remove
	 * @param [callback] Callback function to remove
	 */
	function removeAction( action, callback ) {
		if ( 'string' === typeof action ) {
			_removeHook( 'actions', action, callback );
		}

		return MethodsAvailable;
	}

	/**
	 * Adds a filter to the event manager.
	 *
	 * @param filter Must contain namespace.identifier
	 * @param callback Must be a valid callback function before this action is added
	 * @param [priority=10] Used to control when the function is executed in relation to other callbacks bound to the same hook
	 * @param [context] Supply a value to be used for this
	 */
	function addFilter( filter, callback, priority, context ) {
		if ( 'string' === typeof filter && 'function' === typeof callback ) {
			priority = parseInt( ( priority || 10 ), 10 );
			_addHook( 'filters', filter, callback, priority, context );
		}

		return MethodsAvailable;
	}

	/**
	 * Performs a filter if it exists. You should only ever pass 1 argument to be filtered. The only rule is that
	 * the first argument must always be the filter.
	 */
	function applyFilters( /* filter, filtered arg, arg2, ... */ ) {
		var args = slice.call( arguments );
		var filter = args.shift();

		if ( 'string' === typeof filter ) {
			return _runHook( 'filters', filter, args );
		}

		return MethodsAvailable;
	}

	/**
	 * Removes the specified filter if it contains a namespace.identifier & exists.
	 *
	 * @param filter The action to remove
	 * @param [callback] Callback function to remove
	 */
	function removeFilter( filter, callback ) {
		if ( 'string' === typeof filter ) {
			_removeHook( 'filters', filter, callback );
		}

		return MethodsAvailable;
	}

	/**
	 * Maintain a reference to the object scope so our public methods never get confusing.
	 */
	MethodsAvailable = {
		removeFilter: removeFilter,
		applyFilters: applyFilters,
		addFilter: addFilter,
		removeAction: removeAction,
		doAction: doAction,
		addAction: addAction
	};

	// return all of the publicly available methods
	return MethodsAvailable;
};

module.exports = EventManager;

},{}],19:[function(require,module,exports){
var Module = function() {
	var $ = jQuery,
		instanceParams = arguments,
		self = this,
		settings,
		events = {};

	var ensureClosureMethods = function() {
		$.each( self, function( methodName ) {
			var oldMethod = self[ methodName ];

			if ( 'function' !== typeof oldMethod ) {
				return;
			}

			self[ methodName ] = function() {
				return oldMethod.apply( self, arguments );
			};
		});
	};

	var initSettings = function() {
		settings = self.getDefaultSettings();

		var instanceSettings = instanceParams[0];

		if ( instanceSettings ) {
			$.extend( settings, instanceSettings );
		}
	};

	var init = function() {
		self.__construct.apply( self, instanceParams );

		ensureClosureMethods();

		initSettings();

		self.trigger( 'init' );
	};

	this.getItems = function( items, itemKey ) {
		if ( itemKey ) {
			var keyStack = itemKey.split( '.' ),
				currentKey = keyStack.splice( 0, 1 );

			if ( ! keyStack.length ) {
				return items[ currentKey ];
			}

			if ( ! items[ currentKey ] ) {
				return;
			}

			return this.getItems(  items[ currentKey ], keyStack.join( '.' ) );
		}

		return items;
	};

	this.getSettings = function( setting ) {
		return this.getItems( settings, setting );
	};

	this.setSettings = function( settingKey, value, settingsContainer ) {
		if ( ! settingsContainer ) {
			settingsContainer = settings;
		}

		if ( 'object' === typeof settingKey ) {
			$.extend( settingsContainer, settingKey );

			return self;
		}

		var keyStack = settingKey.split( '.' ),
			currentKey = keyStack.splice( 0, 1 );

		if ( ! keyStack.length ) {
			settingsContainer[ currentKey ] = value;

			return self;
		}

		if ( ! settingsContainer[ currentKey ] ) {
			settingsContainer[ currentKey ] = {};
		}

		return self.setSettings( keyStack.join( '.' ), value, settingsContainer[ currentKey ] );
	};

	this.on = function( eventName, callback ) {
		if ( ! events[ eventName ] ) {
			events[ eventName ] = [];
		}

		events[ eventName ].push( callback );

		return self;
	};

	this.off = function( eventName, callback ) {
		if ( ! events[ eventName ] ) {
			return self;
		}

		if ( ! callback ) {
			delete events[ eventName ];

			return self;
		}

		var callbackIndex = events[ eventName ].indexOf( callback );

		if ( -1 !== callbackIndex ) {
			delete events[ eventName ][ callbackIndex ];
		}

		return self;
	};

	this.trigger = function( eventName ) {
		var methodName = 'on' + eventName[ 0 ].toUpperCase() + eventName.slice( 1 ),
			params = Array.prototype.slice.call( arguments, 1 );

		if ( self[ methodName ] ) {
			self[ methodName ].apply( self, params );
		}

		var callbacks = events[ eventName ];

		if ( ! callbacks ) {
			return;
		}

		$.each( callbacks, function( index, callback ) {
			callback.apply( self, params );
		} );
	};

	init();
};

Module.prototype.__construct = function() {};

Module.prototype.getDefaultSettings = function() {
	return {};
};

Module.extendsCount = 0;

Module.extend = function( properties ) {
	var $ = jQuery,
		parent = this;

	var child = function() {
		return parent.apply( this, arguments );
	};

	$.extend( child, parent );

	child.prototype = Object.create( $.extend( {}, parent.prototype, properties ) );

	child.prototype.constructor = child;

	/*
	 * Constructor ID is used to set an unique ID
     * to every extend of the Module.
     *
	 * It's useful in some cases such as unique
	 * listener for frontend handlers.
	 */
	var constructorID = ++Module.extendsCount;

	child.prototype.getConstructorID = function() {
		return constructorID;
	};

	child.__super__ = parent.prototype;

	return child;
};

module.exports = Module;

},{}],20:[function(require,module,exports){
var Module = require( 'qazana-utils/module' ),
	ViewModule;

ViewModule = Module.extend( {
	elements: null,

	getDefaultElements: function() {
		return {};
	},

	bindEvents: function() {},

	onInit: function() {
		this.initElements();

		this.bindEvents();
	},

	initElements: function() {
		this.elements = this.getDefaultElements();
	}
} );

module.exports = ViewModule;

},{"qazana-utils/module":19}]},{},[2])
//# sourceMappingURL=frontend.js.map
