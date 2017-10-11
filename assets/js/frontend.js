(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
		'tooltip.default': require( 'qazana-frontend/handlers/tooltip' ),
		'piechart.default': require( 'qazana-frontend/handlers/piechart' ),
		//'image-carousel.default': require( 'qazana-frontend/handlers/image-carousel' ),
		'text-editor.default': require( 'qazana-frontend/handlers/text-editor' ),
		'spacer.default': require( 'qazana-frontend/handlers/spacer' )
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

},{"qazana-frontend/handlers/accordion":4,"qazana-frontend/handlers/alert":5,"qazana-frontend/handlers/counter":7,"qazana-frontend/handlers/global":8,"qazana-frontend/handlers/piechart":9,"qazana-frontend/handlers/progress":10,"qazana-frontend/handlers/section":11,"qazana-frontend/handlers/spacer":12,"qazana-frontend/handlers/tabs":13,"qazana-frontend/handlers/text-editor":14,"qazana-frontend/handlers/toggle":15,"qazana-frontend/handlers/tooltip":16,"qazana-frontend/handlers/video":17,"qazana-frontend/handlers/widget":18}],2:[function(require,module,exports){
/* global qazanaFrontendConfig */
( function( $ ) {
	var elements = {},
		EventManager = require( 'qazana-utils/hooks' ),
		Module = require( 'qazana-frontend/handler-module' ),
		ElementsHandler = require( 'qazana-frontend/elements-handler' ),
		YouTubeModule = require( 'qazana-frontend/utils/youtube' ),
		AnchorsModule = require( 'qazana-frontend/utils/anchors' ),
		LightboxModule = require( 'qazana-frontend/utils/lightbox' );
		CarouselModule = require( 'qazana-frontend/utils/carousel' );
		
	var QazanaFrontend = function() {
		var self = this,
			dialogsManager;

		this.config = qazanaFrontendConfig;

		this.Module = Module;

		var setDeviceModeData = function() {
			elements.$body.attr( 'data-qazana-device-mode', self.getCurrentDeviceMode() );
		};

		var initElements = function() {
			elements.window = window;

			elements.$window = $( window );

			elements.$document = $( document );

			elements.$body = $( 'body' );

			elements.$qazana = elements.$document.find( '.qazana' );
		};

		var bindEvents = function() {
			elements.$window.on( 'resize', setDeviceModeData );
		};

		var initOnReadyComponents = function() {
			self.utils = {
				youtube: new YouTubeModule(),
				anchors: new AnchorsModule(),
				//lightbox: new LightboxModule()
				//carousel: new CarouselModule()
			};

			self.modules = {
				StretchElement: require( 'qazana-frontend/modules/stretch-element' )
			};

			self.elementsHandler = new ElementsHandler( $ );
		};

		var initHotKeys = function() {
			self.hotKeys = require( 'qazana-utils/hot-keys' );

			self.hotKeys.bindListener( elements.$window );
		};

		var getSiteSettings = function( settingType, settingName ) {
			var settingsObject = self.isEditMode() ? qazana.settings[ settingType ].model.attributes : self.config.settings[ settingType ];

			if ( settingName ) {
				return settingsObject[ settingName ];
			}

			return settingsObject;
		};

		this.init = function() {
			self.hooks = new EventManager();

			initElements();

			bindEvents();

			setDeviceModeData();

			elements.$window.trigger( 'qazana/frontend/init' );

			if ( ! self.isEditMode() ) {
				initHotKeys();
			}

			initOnReadyComponents();
		};

		this.getElements = function( element ) {
			if ( element ) {
				return elements[ element ];
			}

			return elements;
		};

		this.getDialogsManager = function() {
			if ( ! dialogsManager ) {
				dialogsManager = new DialogsManager.Instance();
			}

			return dialogsManager;
		};

		this.getPageSettings = function( settingName ) {
			return getSiteSettings( 'page', settingName );
		};

		this.getGeneralSettings = function( settingName ) {
			return getSiteSettings( 'general', settingName );
		};

		this.isEditMode = function() {
			return self.config.isEditMode;
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

		this.addListenerOnce = function( listenerID, event, callback, to ) {
			if ( ! to ) {
				to = self.getElements( '$window' );
			}

			if ( ! self.isEditMode() ) {
				to.on( event, callback );

				return;
			}

			if ( to instanceof jQuery ) {
				var eventNS = event + '.' + listenerID;

				to.off( eventNS ).on( eventNS, callback );
			} else {
				to.off( event, null, listenerID ).on( event, callback, listenerID );
			}
		};

		this.getCurrentDeviceMode = function() {
			return getComputedStyle( elements.$qazana[ 0 ], ':after' ).content.replace( /"/g, '' );
		};

		this.waypoint = function( $element, callback, options ) {
			var correctCallback = function() {
				var element = this.element || this;

				return callback.apply( element, arguments );
			};

			return $element.qazanaWaypoint( correctCallback, options );
		};
	};

	window.qazanaFrontend = new QazanaFrontend();
} )( jQuery );

if ( ! qazanaFrontend.isEditMode() ) {
	jQuery( qazanaFrontend.init );
}

},{"qazana-frontend/elements-handler":1,"qazana-frontend/handler-module":3,"qazana-frontend/modules/stretch-element":19,"qazana-frontend/utils/anchors":20,"qazana-frontend/utils/carousel":21,"qazana-frontend/utils/lightbox":22,"qazana-frontend/utils/youtube":23,"qazana-utils/hooks":24,"qazana-utils/hot-keys":25}],3:[function(require,module,exports){
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

				self.onElementChange( controlView.model.get( 'name' ), controlView, elementView );
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

	getSkinName: function() {
		return this.$element.data( 'element_type' ).split( '.' )[1];
	},

	getID: function() {
		return this.$element.data( 'id' );
	},

	getModelCID: function() {
		return this.$element.data( 'model-cid' );
	},

	getElementSettings: function( setting ) {
		var elementSettings = {},
			modelCID = this.getModelCID(),
			self = this,
			settings,
			elementName = self.getElementName().replace(/-/g, '_'),
			skinName = self.getSkinName() && 'global' !== elementName ? self.getSkinName().replace(/-/g, '_') : 'default';
		
		if ( qazanaFrontend.isEditMode() && modelCID ) {
			settings = qazanaFrontend.config.elements.data[ modelCID ];
			settingsKeys = qazanaFrontend.config.elements.keys[ settings.attributes.widgetType || settings.attributes.elType ];

			jQuery.each( settings.getActiveControls(), function( controlKey ) {

				if ( -1 !== settingsKeys.indexOf( controlKey ) ) {

					var newControlKey = controlKey;
					if ( skinName !== 'default' ) {
						newControlKey = controlKey.replace( skinName + '_', '' );
					}
					elementSettings[ newControlKey ] = settings.attributes[ controlKey ];
				}

			} );

		} else {

			settings = this.$element.data( 'settings' ) || {};

			if ( settings && skinName !== 'default' ) {
				jQuery.each( settings, function( controlKey ) {
					var newControlKey = controlKey;
					newControlKey = controlKey.replace( skinName + '_', '' );
					elementSettings[ newControlKey ] = self.getItems( settings, controlKey );
				} );

			} else {
				elementSettings = settings;
			}

		}

		return self.getItems( elementSettings, setting );
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

},{"../utils/view-module":27}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
module.exports = function( $scope, $ ) {
	$scope.find( '.qazana-alert-dismiss' ).on( 'click', function() {
		$( this ).parent().fadeOut();
	} );
};

},{}],6:[function(require,module,exports){
var HandlerModule = require( 'qazana-frontend/handler-module' );

var Video = function( $backgroundVideoContainer, $ ) {
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
		var $video = isYTVideo ? jQuery( player.getIframe() ) : elements.$backgroundVideo,
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

		qazanaFrontend.getElements( '$window' ).on( 'resize', changeVideoSize );
	};

	var prepareVimeoVideo = function( YT, videoID ) {
		qazanaFrontend.getElements( '$window' ).on( 'resize', changeVideoSize );
	};

	var initElements = function() {
		elements.$backgroundVideo = $backgroundVideoContainer.children( '.qazana-background-video' );
	};

	var run = function() {
		var videoID = elements.$backgroundVideo.data( 'video-id' ),
			videoHost = elements.$backgroundVideo.data( 'video-host' );

		if ( videoID && videoHost === 'youtube' ) {
			isYTVideo = true;

			qazanaFrontend.utils.youtube.onYoutubeApiReady( function( YT ) {
				setTimeout( function() {
					prepareYTVideo( YT, videoID );
				}, 1 );
			});

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

var BackgroundVideo = HandlerModule.extend( {
	
	onInit: function() {
		var $backgroundVideoContainer = this.$element.find( '.qazana-background-video-container' );
		if ( $backgroundVideoContainer ) {
			new Video( $backgroundVideoContainer, $ );
		}
	}
});

module.exports = BackgroundVideo;

},{"qazana-frontend/handler-module":3}],7:[function(require,module,exports){
module.exports = function( $scope, $ ) {

	var $counter = $scope.find( '.qazana-counter-number' );
	var animation = $counter.data('animation-type');

	if ( animation === 'none' ) {
		return;
	}

	if ( 'count' === animation ){
		var odometer = new Odometer({el: $counter[0], animation: 'count' } );
	} else {
		var odometer = new Odometer({ el: $counter[0] });
	}

	qazanaFrontend.waypoint( $scope.find( '.qazana-counter-number' ), function() {
		odometer.update( $(this).data('to-value') );
	}, { offset: '90%' } );

};

},{}],8:[function(require,module,exports){
var HandlerModule = require('qazana-frontend/handler-module'),
	GlobalHandler;

GlobalHandler = HandlerModule.extend({
	getElementName: function () {
		return 'global';
	},
	animate: function () {
		var self = this,
			$element = this.$element,
			animation = this.getAnimation(),
			elementSettings = this.getElementSettings(),
			animationDelay = elementSettings._animation_delay || elementSettings.animation_delay || 0;

		$element.removeClass('animated').removeClass(self.prevAnimation);
		
		setTimeout(function () {
			self.prevAnimation = animation;
			$element.addClass(animation).addClass('animated');
		}, animationDelay);
	},
	getAnimation: function () {
		var elementSettings = this.getElementSettings();

		return elementSettings._animation_animated && elementSettings._animation_in;
	},
	onInit: function () {
		var self = this;

		HandlerModule.prototype.onInit.apply(self, arguments);

		if ( ! self.getAnimation()) {
			return;
		}
		
	},
	onElementChange: function( propertyName ) {
		if ( /^_?animation/.test( propertyName ) ) {
			this.animate();
		}
	}
} );

module.exports = function( $scope ) {
	new GlobalHandler( { $element: $scope } );
};

},{"qazana-frontend/handler-module":3}],9:[function(require,module,exports){
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

    qazanaFrontend.waypoint( $chart, function() {

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

},{}],10:[function(require,module,exports){
module.exports = function( $scope, $ ) {
	qazanaFrontend.waypoint( $scope.find( '.qazana-progress-bar' ), function() {
		var $progressbar = $( this );

		$progressbar.css( 'width', $progressbar.data( 'max' ) + '%' );
	}, { offset: '90%' } );
};

},{}],11:[function(require,module,exports){
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

var SVGShapes = HandlerModule.extend( {
	
	getDefaultSettings: function() {
		return {
			selectors: {
				container: '> .qazana-shape-%s'
			},
			svgURL: qazanaFrontend.config.urls.assets + 'shapes/'
		};
	},

	getDefaultElements: function() {
		var elements = {},
			selectors = this.getSettings( 'selectors' );

		elements.$topContainer = this.$element.find( selectors.container.replace( '%s', 'top' ) );

		elements.$bottomContainer = this.$element.find( selectors.container.replace( '%s', 'bottom' ) );

		return elements;
	},

	buildSVG: function( side ) {
		var self = this,
			baseSettingKey = 'shape_divider_' + side,
			shapeType = self.getElementSettings( baseSettingKey ),
			$svgContainer = this.elements[ '$' + side + 'Container' ];

		$svgContainer.empty().attr( 'data-shape', shapeType );

		if ( ! shapeType ) {
			return;
		}

		var fileName = shapeType;

		if ( self.getElementSettings( baseSettingKey + '_negative' ) ) {
			fileName += '-negative';
		}

		var svgURL = self.getSettings( 'svgURL' ) + fileName + '.svg';

		jQuery.get( svgURL, function( data ) {
			$svgContainer.append( data.childNodes[0] );
		} );

		this.setNegative( side );
	},

	setNegative: function( side ) {
		this.elements[ '$' + side + 'Container' ].attr( 'data-negative', !! this.getElementSettings( 'shape_divider_' + side + '_negative' ) );
	},

	onInit: function() {
		var self = this;

		HandlerModule.prototype.onInit.apply( self, arguments );

		[ 'top', 'bottom' ].forEach( function( side ) {
			if ( self.getElementSettings( 'shape_divider_' + side ) ) {
				self.buildSVG( side );
			}
		} );
	},

	onElementChange: function( propertyName ) {
		var shapeChange = propertyName.match( /^shape_divider_(top|bottom)$/ );

		if ( shapeChange ) {
			this.buildSVG( shapeChange[1] );

			return;
		}

		var negativeChange = propertyName.match( /^shape_divider_(top|bottom)_negative$/ );

		if ( negativeChange ) {
			this.buildSVG( negativeChange[1] );

			this.setNegative( negativeChange[1] );
		}
	}
} );

module.exports = function( $scope ) {

	if ( qazanaFrontend.isEditMode() ) {
		new SVGShapes( { $element: $scope } );

		if ( $scope.hasClass( 'qazana-section-stretched' ) ) {
			new StretchedSection( { $element: $scope } );
		}
	}

	new BackgroundVideo( { $element: $scope } );

};

},{"qazana-frontend/handler-module":3,"qazana-frontend/handlers/background-video":6}],12:[function(require,module,exports){
var HandlerModule = require( 'qazana-frontend/handler-module' ),
SpaceModule;

SpaceModule = HandlerModule.extend( {

	onElementChange: function( propertyName ) {
        if ( ! qazanaFrontend.isEditMode() ) {
			return;
		}
		if ( 'space' === propertyName ) {
            var space = this.getElementSettings( 'space' );
			this.$element.find('.qazana-space-resize-value').html('Spacing: ' + space.size + space.unit);
			return;
		}
    },

    onInit: function() {
        if ( ! qazanaFrontend.isEditMode() ) {
			return;
		}
        var space = this.getElementSettings('space');
        var text = '<span class="qazana-space-resize-value">Spacing: ' + space.size + space.unit + '</span>';
        this.$element.find('.qazana-spacer-inner').html(text);
	}
    
});

module.exports = function( $scope ) {
	new SpaceModule( { $element: $scope } );
};

},{"qazana-frontend/handler-module":3}],13:[function(require,module,exports){
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
var HandlerModule = require( 'qazana-frontend/handler-module' ),
	TextEditor;

TextEditor = HandlerModule.extend( {
	dropCapLetter: '',

	getDefaultSettings: function() {
		return {
			selectors: {
				paragraph: 'p:first'
			},
			classes: {
				dropCap: 'qazana-drop-cap',
				dropCapLetter: 'qazana-drop-cap-letter'
			}
		};
	},

	getDefaultElements: function() {
		var selectors = this.getSettings( 'selectors' ),
			classes = this.getSettings( 'classes' ),
			$dropCap = jQuery( '<span>', { 'class': classes.dropCap } ),
			$dropCapLetter = jQuery( '<span>', { 'class': classes.dropCapLetter } );

		$dropCap.append( $dropCapLetter );

		return {
			$paragraph: this.$element.find( selectors.paragraph ),
			$dropCap: $dropCap,
			$dropCapLetter: $dropCapLetter
		};
	},

	getElementName: function() {
		return 'text-editor';
	},

	wrapDropCap: function() {
		var isDropCapEnabled = this.getElementSettings( 'drop_cap' );

		if ( ! isDropCapEnabled ) {
			// If there is an old drop cap inside the paragraph
			if ( this.dropCapLetter ) {
				this.elements.$dropCap.remove();

				this.elements.$paragraph.prepend( this.dropCapLetter );

				this.dropCapLetter = '';
			}

			return;
		}

		var $paragraph = this.elements.$paragraph;

		if ( ! $paragraph.length ) {
			return;
		}

		var	paragraphContent = $paragraph.html().replace( /&nbsp;/g, ' ' ),
			firstLetterMatch = paragraphContent.match( /^ *([^ ] ?)/ );

		if ( ! firstLetterMatch ) {
			return;
		}

		var firstLetter = firstLetterMatch[1],
			trimmedFirstLetter = firstLetter.trim();

		// Don't apply drop cap when the content starting with an HTML tag
		if ( '<' === trimmedFirstLetter ) {
			return;
		}

		this.dropCapLetter = firstLetter;

		this.elements.$dropCapLetter.text( trimmedFirstLetter );

		var restoredParagraphContent = paragraphContent.slice( firstLetter.length ).replace( /^ */, function( match ) {
			return new Array( match.length + 1 ).join( '&nbsp;' );
		});

		$paragraph.html( restoredParagraphContent ).prepend( this.elements.$dropCap );
	},

	onInit: function() {
		HandlerModule.prototype.onInit.apply( this, arguments );

		this.wrapDropCap();
	},

	onElementChange: function( propertyName ) {
		if ( 'drop_cap' === propertyName ) {
			this.wrapDropCap();
		}
	}
} );

module.exports = function( $scope ) {
	new TextEditor( { $element: $scope } );
};

},{"qazana-frontend/handler-module":3}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
var HandlerModule = require( 'qazana-frontend/handler-module' ),
VideoModule;

VideoModule = HandlerModule.extend( {
	getDefaultSettings: function() {
		return {
			selectors: {
				imageOverlay: '.qazana-custom-embed-image-overlay',
				videoWrapper: '.qazana-video-wrapper',
				videoFrame: 'iframe'
			}
		};
	},

	getDefaultElements: function() {
		var selectors = this.getSettings( 'selectors' );

		var elements = {
			$imageOverlay: this.$element.find( selectors.imageOverlay ),
			$videoWrapper: this.$element.find( selectors.videoWrapper )
		};

		elements.$videoFrame = elements.$videoWrapper.find( selectors.videoFrame );

		return elements;
	},

	getLightBox: function() {
		return qazanaFrontend.utils.lightbox;
	},

	handleVideo: function() {
		if ( ! this.getElementSettings( 'lightbox' ) ) {
			this.elements.$imageOverlay.remove();

			this.playVideo();
		}
	},

	playVideo: function() {
		var $videoFrame = this.elements.$videoFrame,
			newSourceUrl = $videoFrame[0].src.replace( '&autoplay=0', '' );

		$videoFrame[0].src = newSourceUrl + '&autoplay=1';
	},

	animateVideo: function() {
		this.getLightBox().setEntranceAnimation( this.getElementSettings( 'lightbox_content_animation' ) );
	},

	getAspectRatio: function() {

		var aspect_ratio = this.getElementSettings( 'aspect_ratio' );
		var selectors = this.getSettings( 'selectors' );
		
		if ( aspect_ratio === 'custom' ) {
			aspect_ratio = this.getElementSettings( 'custom_aspect_ratio' );
		} else {
			return;
		}

		var aspect_ratio_parts = aspect_ratio.split(':');

		var calculate_aspect_ratio = (Math.round(aspect_ratio_parts[1]) / Math.round(aspect_ratio_parts[0]));

		// Calculate padding top
		var padding = ( calculate_aspect_ratio * 100).toFixed(2);
		
		if (padding > 0) {
			this.$element.find( selectors.videoWrapper ).css('padding-bottom', padding.replace(".00", "") + '%');
		}

		return calculate_aspect_ratio;
	},

	handleAspectRatio: function() {		
		this.getLightBox().setVideoAspectRatio( this.getAspectRatio() );
	},

	bindEvents: function() {
		this.elements.$imageOverlay.on( 'click', this.handleVideo );
	},

	onElementChange: function( propertyName ) {
		if ( 'lightbox_content_animation' === propertyName ) {
			this.animateVideo();
			return;
		}

		var isLightBoxEnabled = this.getElementSettings( 'lightbox' );

		if ( 'lightbox' === propertyName && ! isLightBoxEnabled ) {
			this.getLightBox().getModal().hide();
			return;
		}

		if ( 'aspect_ratio' === propertyName && isLightBoxEnabled ) {
			this.handleAspectRatio();
		}
	},

	onInit: function() {
		this.getAspectRatio();
	}

} );

module.exports = function( $scope ) {
	new VideoModule( { $element: $scope } );
};

},{"qazana-frontend/handler-module":3}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
var ViewModule = require( '../../utils/view-module' );

module.exports = ViewModule.extend( {
	getDefaultSettings: function() {
		return {
			element: null,
			direction: qazanaFrontend.config.is_rtl ? 'right' : 'left',
			selectors: {
				container: window
			}
		};
	},

	getDefaultElements: function() {
		return {
			$element: jQuery( this.getSettings( 'element' ) )
		};
	},

	stretch: function() {
		var containerSelector = this.getSettings( 'selectors.container' ),
			$element = this.elements.$element,
			$container = jQuery( containerSelector ),
			isSpecialContainer = window !== $container[0];

		this.reset();

		var containerWidth = $container.outerWidth(),
			elementWidth = $element.outerWidth(),
			elementOffset = $element.offset().left,
			correctOffset = elementOffset;

		if ( isSpecialContainer ) {
			var containerOffset = $container.offset().left;

			if ( elementOffset > containerOffset ) {
				correctOffset = elementOffset - containerOffset;
			} else {
				correctOffset = 0;
			}
		}

		if ( qazanaFrontend.config.is_rtl ) {
			correctOffset = containerWidth - ( elementWidth + correctOffset );
		}

		var css = {};

		css.width = containerWidth + 'px';

		css[ this.getSettings( 'direction' ) ] = -correctOffset + 'px';

		$element.css( css );
	},

	reset: function() {
		var css = {};

		css.width = 'auto';

		css[ this.getSettings( 'direction' ) ] = 0;

		this.elements.$element.css( css );
	}
} );

},{"../../utils/view-module":27}],20:[function(require,module,exports){
var ViewModule = require( '../../utils/view-module' );

module.exports = ViewModule.extend( {
	getDefaultSettings: function() {

		return {
			scrollDuration: 500,
			selectors: {
				links: 'a[href*="#"]',
				targets: '.qazana-element, .qazana-menu-anchor',
				scrollable: 'html, body',
				wpAdminBar: '#wpadminbar'
			}
		};
	},

	getDefaultElements: function() {
		var $ = jQuery,
			selectors = this.getSettings( 'selectors' );

		return {
			$scrollable: $( selectors.scrollable ),
			$wpAdminBar: $( selectors.wpAdminBar )
		};
	},

	bindEvents: function() {
		qazanaFrontend.getElements( '$document' ).on( 'click', this.getSettings( 'selectors.links' ), this.handleAnchorLinks );
	},

	handleAnchorLinks: function( event ) {
		var clickedLink = event.currentTarget,
			isSamePathname = ( location.pathname === clickedLink.pathname ),
			isSameHostname = ( location.hostname === clickedLink.hostname );

		if ( ! isSameHostname || ! isSamePathname || clickedLink.hash.length < 2 ) {
			return;
		}

		var $anchor = jQuery( clickedLink.hash ).filter( this.getSettings( 'selectors.targets' ) );

		if ( ! $anchor.length ) {
			return;
		}

		var hasAdminBar = ( 1 <= this.elements.$wpAdminBar.length ),
			scrollTop = $anchor.offset().top;

		if ( hasAdminBar ) {
			scrollTop -= this.elements.$wpAdminBar.height();
		}

		event.preventDefault();

		scrollTop = qazanaFrontend.hooks.applyFilters( 'frontend/handlers/menu_anchor/scroll_top_distance', scrollTop );

		this.elements.$scrollable.animate( {
			scrollTop: scrollTop
		}, this.getSettings( 'scrollDuration' ), 'linear' );
	},

	onInit: function() {
		ViewModule.prototype.onInit.apply( this, arguments );

		this.bindEvents();
	}
} );

},{"../../utils/view-module":27}],21:[function(require,module,exports){
var addNav = function($scope, $slick, settings) {
    
    $scope = $scope.closest('.qazana-widget-container');

    if ( $scope.data( 'nav' ) ) {
        return;
    }

    var $wrapper = $scope.find(".qazana-loop-wrapper");

    // slick has already been initialized, so we know the dots are already in the DOM;
    var $dots = $scope.find(".slick-dots");

    if ( $dots.length <= 0 ) {
        // slick has already been initialized, so we know the dots are already in the DOM;
        $dots = $scope.append("<ul class='slick-dots' />");
    }

    if ( settings.arrows ) {

        // wrap the $dots so we can put our arrows next to them;
        $wrapper.parent().append("<div class=\"slick-navigation\"></div>");

        $wrapper.parent().find('.slick-navigation')
            .prepend("<a class=\"prev\"><i class=\"ricon ricon-slider-arrow-left\"></i></a>")
            .append("<a class=\"next\"><i class=\"ricon ricon-slider-arrow-right\"></i></a>");

        if ( $slick.length && settings.slidesToScroll ) {
            // attach previous button events;
            $dots.parent().find("a.prev").on("click", function() {
                $slick.slick('slickGoTo', $slick.slick('slickCurrentSlide') - settings.slidesToScroll);
            }).end()
            // attach next button events;
            .find("a.next").on("click", function() {
                $slick.slick('slickGoTo', $slick.slick('slickCurrentSlide') + settings.slidesToScroll);
            });
        }
    }

    $scope.attr( 'data-nav', 'true' );
};

var Carousel = function( $carousel, settings ) {
    
    if ( $carousel.find("div.slick-slides-biggie").length < 1 || typeof settings === 'undefined' ) {
        return;
    }
    
    var elementSettings = {};
    var slick_globals = window.slick_globals;
    
    settings.direction = settings.is_rtl ? 'rtl' : 'ltr';
    settings.rtl = ( 'rtl' === settings.direction );
    settings.dots = ( settings.navigation === 'dots' || settings.navigation === 'both' );
    settings.arrows = ( settings.navigation === 'arrows' || settings.navigation === 'both' );
     
    var is_slideshow = '1' === parseFloat(settings.slidesToShow);

    if ( ! is_slideshow ) {
        settings.slidesToScroll = parseFloat(settings.slidesToScroll);
    } else {
        settings.fade = ( 'fade' === settings.effect );
    }

    if ( ! settings.slidesToScroll ) {
        settings.slidesToScroll = 1;
    }

    settings.slidesToShow = parseFloat(settings.slidesToShow);

    jQuery.each( settings, function( controlKey ) {

        var value = settings[ controlKey ];

        if ( value === 'yes' ) {
            elementSettings[ controlKey ] = true;
        } else {
            elementSettings[ controlKey ] = value;
        }

    } );

    var optionsBiggie = jQuery.extend( {}, slick_globals, elementSettings ),
        // large slideshow;
        $biggie = $carousel.find("div.slick-slides-biggie"),
        // class to indicate the slideshow is disabled (on mouseover so the user can see the full photo);
        disabledClass = "is-disabled",

        // prev/next button click events - trigger a change the large slideshow;
        goToPreviousSlide = function() {
            var index = Number($biggie.slick('slickCurrentSlide'));
            $biggie.slick('slickGoTo', (index - 1));

        },
        goToNextSlide = function() {
            var index = Number($biggie.slick('slickCurrentSlide'));
            $biggie.slick('slickGoTo', (index + 1));
        };

    // after slick is initialized (these wouldn't work properly if done before init);
    $biggie.on('init', function() {
        // add the navigation;
        new addNav($biggie.parent(), $biggie, optionsBiggie);
    });

    if ( ! $biggie.hasClass('slick-initialized') ) {
        // init the slideshows;
        $biggie.slick(optionsBiggie);
    } else {
        $biggie.slick('refresh');
    }

    // attach prev/next button events now that the smalls arrows have been added;
    $carousel
        // attach previous button events;
        .find("a.prev").on("click", goToPreviousSlide).end()
        // attach next button events;
        .find("a.next").on("click", goToNextSlide);

    // if the device is NOT a touchscreen;
    // then hide the controls when the user isn't interacting with them;
    if (Modernizr.touch === false) {

        // show/hide the elements that overlay $slideshow1 (social, prev, next);
        $biggie.parent().on("mouseenter", function() {
            $biggie.parent().removeClass(disabledClass);
        }).on("mouseleave", function() {
            $biggie.parent().addClass(disabledClass);
        })
        // on load, disable the slideshow (maybe);
        .each(function() {
            var disable = function() {

                // make sure the user isn't hovering over the photo gallery;
                if ($biggie.parent().is(":hover") === false) {
                    $biggie.parent().addClass(disabledClass);
                }
            };

            // before "disabling" the overlay elements, wait 2 seconds;
            window.setTimeout(disable, 2000);
        });
    }

};

module.exports = Carousel;

},{}],22:[function(require,module,exports){
var ViewModule = require( '../../utils/view-module' ),
	LightboxModule;

LightboxModule = ViewModule.extend( {
	oldAspectRatio: null,

	oldAnimation: null,

	swiper: null,

	getDefaultSettings: function() {
		return {
			classes: {
				aspectRatio: 'qazana-aspect-ratio-%s',
				item: 'qazana-lightbox-item',
				image: 'qazana-lightbox-image',
				videoContainer: 'qazana-video-container',
				videoWrapper: 'qazana-fit-aspect-ratio',
				playButton: 'qazana-custom-embed-play',
				playButtonIcon: 'fa',
				playing: 'qazana-playing',
				hidden: 'qazana-hidden',
				invisible: 'qazana-invisible',
				preventClose: 'qazana-lightbox-prevent-close',
				slideshow: {
					container: 'swiper-container',
					slidesWrapper: 'swiper-wrapper',
					prevButton: 'qazana-swiper-button qazana-swiper-button-prev',
					nextButton: 'qazana-swiper-button qazana-swiper-button-next',
					prevButtonIcon: 'eicon-chevron-left',
					nextButtonIcon: 'eicon-chevron-right',
					slide: 'swiper-slide'
				}
			},
			selectors: {
				links: 'a, [data-qazana-lightbox]',
				slideshow: {
					activeSlide: '.swiper-slide-active',
					prevSlide: '.swiper-slide-prev',
					nextSlide: '.swiper-slide-next'
				}
			},
			modalOptions: {
				id: 'qazana-lightbox',
				entranceAnimation: 'zoomIn',
				videoAspectRatio: 169,
				position: {
					enable: false
				}
			}
		};
	},

	getModal: function() {
		if ( ! LightboxModule.modal ) {
			this.initModal();
		}

		return LightboxModule.modal;
	},

	initModal: function() {
		var modal = LightboxModule.modal = qazanaFrontend.getDialogsManager().createWidget( 'lightbox', {
			className: 'qazana-lightbox',
			closeButton: true,
			closeButtonClass: 'eicon-close',
			selectors: {
				preventClose: '.' + this.getSettings( 'classes.preventClose' )
			},
			hide: {
				onClick: true
			}
		} );

		modal.on( 'hide', function() {
			modal.setMessage( '' );
		} );
	},

	showModal: function( options ) {
		var self = this,
			defaultOptions = self.getDefaultSettings().modalOptions;

		self.setSettings( 'modalOptions', jQuery.extend( defaultOptions, options.modalOptions ) );

		var modal = self.getModal();

		modal.setID( self.getSettings( 'modalOptions.id' ) );

		modal.onShow = function() {
			DialogsManager.getWidgetType( 'lightbox' ).prototype.onShow.apply( modal, arguments );

			setTimeout( function() {
				self.setEntranceAnimation();
			}, 10 );
		};

		modal.onHide = function() {
			DialogsManager.getWidgetType( 'lightbox' ).prototype.onHide.apply( modal, arguments );

			modal.getElements( 'widgetContent' ).removeClass( 'animated' );
		};

		switch ( options.type ) {
			case 'image':
				self.setImageContent( options.url );

				break;
			case 'video':
				self.setVideoContent( options.url );

				break;
			case 'slideshow':
				self.setSlideshowContent( options.slideshow );

				break;
			default:
				self.setHTMLContent( options.html );
		}

		modal.show();
	},

	setHTMLContent: function( html ) {
		this.getModal().setMessage( html );
	},

	setImageContent: function( imageURL ) {
		var self = this,
			classes = self.getSettings( 'classes' ),
			$item = jQuery( '<div>', { 'class': classes.item } ),
			$image = jQuery( '<img>', { src: imageURL, 'class': classes.image + ' ' + classes.preventClose } );

		$item.append( $image );

		self.getModal().setMessage( $item );
	},

	setVideoContent: function( videoEmbedURL ) {
		videoEmbedURL = videoEmbedURL.replace( '&autoplay=0', '' ) + '&autoplay=1';

		var classes = this.getSettings( 'classes' ),
			$videoContainer = jQuery( '<div>', { 'class': classes.videoContainer } ),
			$videoWrapper = jQuery( '<div>', { 'class': classes.videoWrapper } ),
			$videoFrame = jQuery( '<iframe>', { src: videoEmbedURL, allowfullscreen: 1 } ),
			modal = this.getModal();

		$videoContainer.append( $videoWrapper );

		$videoWrapper.append( $videoFrame );

		modal.setMessage( $videoContainer );

		this.setVideoAspectRatio();

		var onHideMethod = modal.onHide;

		modal.onHide = function() {
			onHideMethod();

			modal.getElements( 'message' ).removeClass( 'qazana-fit-aspect-ratio' );
		};
	},

	setSlideshowContent: function( options ) {
		var $ = jQuery,
			self = this,
			classes = self.getSettings( 'classes' ),
			slideshowClasses = classes.slideshow,
			$container = $( '<div>', { 'class': slideshowClasses.container } ),
			$slidesWrapper = $( '<div>', { 'class': slideshowClasses.slidesWrapper } ),
			$prevButton = $( '<div>', { 'class': slideshowClasses.prevButton + ' ' + classes.preventClose } ).html( $( '<i>', { 'class': slideshowClasses.prevButtonIcon } ) ),
			$nextButton = $( '<div>', { 'class': slideshowClasses.nextButton + ' ' + classes.preventClose } ).html( $( '<i>', { 'class': slideshowClasses.nextButtonIcon } ) );

		options.slides.forEach( function( slide ) {
			var slideClass =  slideshowClasses.slide + ' ' + classes.item;

			if ( slide.video ) {
				slideClass += ' ' + classes.video;
			}

			var $slide = $( '<div>', { 'class': slideClass } ),
				$zoomContainer = $( '<div>', { 'class': 'swiper-zoom-container' } ),
				$slideImage = $( '<img>', { 'class': classes.image + ' ' + classes.preventClose } ).attr( 'src', slide.image );

			$slide.append( $zoomContainer );

			$zoomContainer.append( $slideImage );

			if ( slide.video ) {
				$slide.attr( 'data-qazana-slideshow-video', slide.video );

				var $playIcon = $( '<div>', { 'class': classes.playButton } ).html( $( '<i>', { 'class': classes.playButtonIcon } ) );

				$slide.append( $playIcon );
			}

			$slidesWrapper.append( $slide );
		} );

		$container.append(
			$slidesWrapper,
			$prevButton,
			$nextButton
		);

		var modal = self.getModal();

		modal.setMessage( $container );

		var onShowMethod = modal.onShow;

		modal.onShow = function() {
			onShowMethod();

			var swiperOptions = {
				prevButton: $prevButton,
				nextButton: $nextButton,
				paginationClickable: true,
				grabCursor: true,
				onSlideChangeEnd: self.onSlideChange,
				runCallbacksOnInit: false,
				loop: true,
				keyboardControl: true
			};

			if ( options.swiper ) {
				$.extend( swiperOptions, options.swiper );
			}

			self.swiper = new Swiper( $container, swiperOptions );

			self.setVideoAspectRatio();

			self.playSlideVideo();
		};
	},

	setVideoAspectRatio: function( aspectRatio ) {
		aspectRatio = aspectRatio || this.getSettings( 'modalOptions.videoAspectRatio' );

		var $widgetContent = this.getModal().getElements( 'widgetContent' ),
			oldAspectRatio = this.oldAspectRatio,
			aspectRatioClass = this.getSettings( 'classes.aspectRatio' );

		this.oldAspectRatio = aspectRatio;

		if ( oldAspectRatio ) {
			$widgetContent.removeClass( aspectRatioClass.replace( '%s', oldAspectRatio ) );
		}

		if ( aspectRatio ) {
			$widgetContent.addClass( aspectRatioClass.replace( '%s', aspectRatio ) );
		}
	},

	getSlide: function( slideState ) {
		return this.swiper.slides.filter( this.getSettings( 'selectors.slideshow.' + slideState + 'Slide' ) );
	},

	playSlideVideo: function() {
		var selectors = this.getSettings( 'selectors' ),
			$activeSlide = this.getSlide( 'active' ),
			videoURL = $activeSlide.data( 'qazana-slideshow-video' );

		if ( ! videoURL ) {
			return;
		}

		var classes = this.getSettings( 'classes' );

		var $videoContainer = jQuery( '<div>', { 'class': classes.videoContainer + ' ' + classes.invisible } ),
			$videoWrapper = jQuery( '<div>', { 'class': classes.videoWrapper } ),
			$videoFrame = jQuery( '<iframe>', { src: videoURL } ),
			$playIcon = $activeSlide.children( '.' + classes.playButton ),
			$slideImage = $activeSlide.find( '.' + classes.image );

		$videoContainer.append( $videoWrapper );

		$videoWrapper.append( $videoFrame );

		$activeSlide.append( $videoContainer );

		$playIcon.addClass( classes.playing );

		$playIcon.add( $slideImage ).removeClass( classes.hidden );

		$videoFrame.on( 'load', function() {
			$playIcon.add( $slideImage ).addClass( classes.hidden );

			$videoContainer.removeClass( classes.invisible );
		} );
	},

	setEntranceAnimation: function( animation ) {
		animation = animation || this.getSettings( 'modalOptions.entranceAnimation' );

		var $widgetMessage = this.getModal().getElements( 'message' );

		if ( this.oldAnimation ) {
			$widgetMessage.removeClass( this.oldAnimation );
		}

		this.oldAnimation = animation;

		if ( animation ) {
			$widgetMessage.addClass( 'animated ' + animation );
		}
	},

	isLightboxLink: function( element ) {
		if ( 'A' === element.tagName && ! /\.(png|jpe?g|gif|svg)$/i.test( element.href ) ) {
			return false;
		}

		var generalOpenInLightbox = qazanaFrontend.getGeneralSettings( 'qazana_global_image_lightbox' ),
			currentLinkOpenInLightbox = element.dataset.qazanaOpenLightbox;

		return 'yes' === currentLinkOpenInLightbox || generalOpenInLightbox && 'no' !== currentLinkOpenInLightbox;
	},

	openLink: function( event ) {
		var element = event.currentTarget;

		if ( ! this.isLightboxLink( element ) ) {
			if ( qazanaFrontend.isEditMode() ) {
				event.preventDefault();
			}

			return;
		}

		event.preventDefault();

		if ( qazanaFrontend.isEditMode() && ! qazanaFrontend.getGeneralSettings( 'qazana_enable_lightbox_in_editor' ) ) {
			return;
		}

		var lightboxData = {};

		if ( element.dataset.qazanaLightbox ) {
			lightboxData = JSON.parse( element.dataset.qazanaLightbox );
		}

		if ( lightboxData.type && 'slideshow' !== lightboxData.type ) {
			this.showModal( lightboxData );

			return;
		}

		if ( ! element.dataset.qazanaLightboxSlideshow ) {
			this.showModal( {
				type: 'image',
				url: element.href
			} );

			return;
		}

		var slideshowID = element.dataset.qazanaLightboxSlideshow;

		var $allSlideshowLinks = jQuery( this.getSettings( 'selectors.links' ) ).filter( function() {
			return slideshowID === this.dataset.qazanaLightboxSlideshow;
		} );

		var slides = [],
			uniqueLinks = {};

		$allSlideshowLinks.each( function() {
			if ( uniqueLinks[ this.href ] ) {
				return;
			}

			uniqueLinks[ this.href ] = true;

			var slideIndex = this.dataset.qazanaLightboxIndex;

			if ( undefined === slideIndex ) {
				slideIndex = $allSlideshowLinks.index( this );
			}

			var slideData = {
				image: this.href,
				index: slideIndex
			};

			if ( this.dataset.qazanaLightboxVideo ) {
				slideData.video = this.dataset.qazanaLightboxVideo;
			}

			slides.push( slideData );
		} );

		slides.sort( function( a, b ) {
			return a.index - b.index;
		} );

		var initialSlide = element.dataset.qazanaLightboxIndex;

		if ( undefined === initialSlide ) {
			initialSlide = $allSlideshowLinks.index( element );
		}

		this.showModal( {
			type: 'slideshow',
			modalOptions: {
				id: 'qazana-lightbox-slideshow-' + slideshowID
			},
			slideshow: {
				slides: slides,
				swiper: {
					initialSlide: +initialSlide
				}
			}
		} );
	},

	bindEvents: function() {
		qazanaFrontend.getElements( '$document' ).on( 'click', this.getSettings( 'selectors.links' ), this.openLink );
	},

	onInit: function() {
		ViewModule.prototype.onInit.apply( this, arguments );
		if ( qazanaFrontend.isEditMode() && typeof qazana.settings !== 'undefined' ) {
			qazana.settings.general.model.on( 'change', this.onGeneralSettingsChange );
		}
	},

	onGeneralSettingsChange: function( model ) {
		if ( 'qazana_lightbox_content_animation' in model.changed ) {
			this.setSettings( 'modalOptions.entranceAnimation', model.changed.qazana_lightbox_content_animation );

			this.setEntranceAnimation();
		}
	},

	onSlideChange: function() {
		this
			.getSlide( 'prev' )
			.add( this.getSlide( 'next' ) )
			.add( this.getSlide( 'active' ) )
			.find( '.' + this.getSettings( 'classes.videoWrapper' ) )
			.remove();

		this.playSlideVideo();
	}
} );

module.exports = LightboxModule;

},{"../../utils/view-module":27}],23:[function(require,module,exports){
var ViewModule = require( '../../utils/view-module' );

module.exports = ViewModule.extend( {
	getDefaultSettings: function() {
		return {
			isInserted: false,
			APISrc: 'https://www.youtube.com/iframe_api',
			selectors: {
				firstScript: 'script:first'
			}
		};
	},

	getDefaultElements: function() {

		return {
			$firstScript: jQuery( this.getSettings( 'selectors.firstScript' ) )
		};
	},

	insertYTAPI: function() {
		this.setSettings( 'isInserted', true );

		this.elements.$firstScript.before( jQuery( '<script>', { src: this.getSettings( 'APISrc' ) } ) );
	},

	onYoutubeApiReady: function( callback ) {
		var self = this;

		if ( ! self.getSettings( 'IsInserted' ) ) {
			self.insertYTAPI();
		}

		if ( window.YT && YT.loaded ) {
			callback( YT );
		} else {
			// If not ready check again by timeout..
			setTimeout( function() {
				self.onYoutubeApiReady( callback );
			}, 350 );
		}
	},

	getYoutubeIDFromURL: function( url ) {
		var videoIDParts = url.match( /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?vi?=|(?:embed|v|vi|user)\/))([^?&"'>]+)/ );

		return videoIDParts && videoIDParts[1];
	}
} );

},{"../../utils/view-module":27}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
var HotKeys = function() {
	var hotKeysHandlers = this.hotKeysHandlers = {};

	var isMac = function() {
		return -1 !== navigator.userAgent.indexOf( 'Mac OS X' );
	};

	var applyHotKey = function( event ) {
		var handlers = hotKeysHandlers[ event.which ];

		if ( ! handlers ) {
			return;
		}

		jQuery.each( handlers, function() {
			var handler = this;

			if ( handler.isWorthHandling && ! handler.isWorthHandling( event ) ) {
				return;
			}

			// Fix for some keyboard sources that consider alt key as ctrl key
			if ( ! handler.allowAltKey && event.altKey ) {
				return;
			}

			event.preventDefault();

			handler.handle( event );
		} );
	};

	this.isControlEvent = function( event ) {
		return event[ isMac() ? 'metaKey' : 'ctrlKey' ];
	};

	this.addHotKeyHandler = function( keyCode, handlerName, handler ) {
		if ( ! hotKeysHandlers[ keyCode ] ) {
			hotKeysHandlers[ keyCode ] = {};
		}

		hotKeysHandlers[ keyCode ][ handlerName ] = handler;
	};

	this.bindListener = function( $listener ) {
		$listener.on( 'keydown', applyHotKey );
	};
};

module.exports = new HotKeys();

},{}],26:[function(require,module,exports){
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

	this.forceMethodImplementation = function( methodArguments ) {
		var functionName = methodArguments.callee.name;

		throw new ReferenceError( 'The method ' + functionName + ' must to be implemented in the inheritor child.' );
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

},{}],27:[function(require,module,exports){
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

},{"qazana-utils/module":26}]},{},[2])
//# sourceMappingURL=frontend.js.map
