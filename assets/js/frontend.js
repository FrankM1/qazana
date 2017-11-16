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
    
    this.reInit = function( $scope ) {
        
        var $elements = $scope.find( '.qazana-element' );

        $elements.each( function() {
            self.runReadyTrigger( $( this ) );
        } );

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

},{"qazana-frontend/handlers/accordion":4,"qazana-frontend/handlers/alert":5,"qazana-frontend/handlers/counter":8,"qazana-frontend/handlers/global":9,"qazana-frontend/handlers/piechart":10,"qazana-frontend/handlers/progress":11,"qazana-frontend/handlers/section":12,"qazana-frontend/handlers/spacer":13,"qazana-frontend/handlers/tabs":14,"qazana-frontend/handlers/text-editor":15,"qazana-frontend/handlers/toggle":16,"qazana-frontend/handlers/tooltip":17,"qazana-frontend/handlers/video":18,"qazana-frontend/handlers/widget":19}],2:[function(require,module,exports){
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
				lightbox: new LightboxModule()
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

},{"qazana-frontend/elements-handler":1,"qazana-frontend/handler-module":3,"qazana-frontend/modules/stretch-element":20,"qazana-frontend/utils/anchors":21,"qazana-frontend/utils/carousel":22,"qazana-frontend/utils/lightbox":23,"qazana-frontend/utils/youtube":24,"qazana-utils/hooks":25,"qazana-utils/hot-keys":26}],3:[function(require,module,exports){
var ViewModule = require( '../utils/view-module' ),
	HandlerModule;

HandlerModule = ViewModule.extend( {
	$element: null,

	onElementChange: null,

	onEditSettingsChange: null,

	onGeneralSettingsChange: null,

	onPageSettingsChange: null,

	isEdit: null,

	__construct: function( settings ) {
		this.$element  = settings.$element;

		this.isEdit = this.$element.hasClass( 'qazana-element-edit-mode' );

		if ( this.isEdit ) {
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

		return this.getItems( elementSettings, setting );
	},

	getEditSettings: function( setting ) {
		var attributes = {};

		if ( this.isEdit ) {
			attributes = qazanaFrontend.config.elements.editSettings[ this.getModelCID() ].attributes;
		}

		return this.getItems( attributes, setting );
	}
} );

module.exports = HandlerModule;

},{"../utils/view-module":28}],4:[function(require,module,exports){
var TabsModule = require( 'qazana-frontend/handlers/base-tabs' );

module.exports = function( $scope ) {
	new TabsModule( {
		$element: $scope,
		showTabFn: 'slideDown',
		hideTabFn: 'slideUp'
	} );
};

},{"qazana-frontend/handlers/base-tabs":7}],5:[function(require,module,exports){
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
var HandlerModule = require( 'qazana-frontend/handler-module' );

module.exports = HandlerModule.extend( {
	$activeContent: null,

	getDefaultSettings: function() {
		return {
			selectors: {
				tabTitle: '.qazana-tab-title',
				tabContent: '.qazana-tab-content'
			},
			classes: {
				active: 'qazana-active'
			},
			showTabFn: 'show',
			hideTabFn: 'hide',
			toggleSelf: true,
			hidePrevious: true,
			autoExpand: true
		};
	},

	getDefaultElements: function() {
		var selectors = this.getSettings( 'selectors' );

		return {
			$tabTitles: this.$element.find( selectors.tabTitle ),
			$tabContents: this.$element.find( selectors.tabContent )
		};
	},

	activateDefaultTab: function() {
		var settings = this.getSettings();

		if ( ! settings.autoExpand || 'editor' === settings.autoExpand && ! this.isEdit ) {
			return;
		}

		var defaultActiveTab = this.getEditSettings( 'activeItemIndex' ) || 1,
			originalToggleMethods = {
				showTabFn: settings.showTabFn,
				hideTabFn: settings.hideTabFn
			};

		// Toggle tabs without animation to avoid jumping
		this.setSettings( {
			showTabFn: 'show',
			hideTabFn: 'hide'
		} );

		this.changeActiveTab( defaultActiveTab );

		// Return back original toggle effects
		this.setSettings( originalToggleMethods );
	},

	deactivateActiveTab: function( tabIndex ) {
		var settings = this.getSettings(),
			activeClass = settings.classes.active,
			activeFilter = tabIndex ? '[data-tab="' + tabIndex + '"]' : '.' + activeClass,
			$activeTitle = this.elements.$tabTitles.filter( activeFilter ),
			$activeContent = this.elements.$tabContents.filter( activeFilter );

		$activeTitle.add( $activeContent ).removeClass( activeClass );

		$activeContent[ settings.hideTabFn ]();
	},

	activateTab: function( tabIndex ) {
		var settings = this.getSettings(),
			activeClass = settings.classes.active,
			$requestedTitle = this.elements.$tabTitles.filter( '[data-tab="' + tabIndex + '"]' ),
			$requestedContent = this.elements.$tabContents.filter( '[data-tab="' + tabIndex + '"]' );

		$requestedTitle.add( $requestedContent ).addClass( activeClass );

		$requestedContent[ settings.showTabFn ]();
	},

	isActiveTab: function( tabIndex ) {
		return this.elements.$tabTitles.filter( '[data-tab="' + tabIndex + '"]' ).hasClass( this.getSettings( 'classes.active' ) );
	},

	bindEvents: function() {
		var self = this;

		self.elements.$tabTitles.on( 'focus', function( event ) {
			self.changeActiveTab( event.currentTarget.dataset.tab );
		} );

		if ( self.getSettings( 'toggleSelf' ) ) {
			self.elements.$tabTitles.on( 'mousedown', function( event ) {
				if ( jQuery( event.currentTarget ).is( ':focus' ) ) {
					self.changeActiveTab( event.currentTarget.dataset.tab );
				}
			} );
		}
	},

	onInit: function() {
		HandlerModule.prototype.onInit.apply( this, arguments );

		this.activateDefaultTab();
	},

	onEditSettingsChange: function( propertyName ) {
		if ( 'activeItemIndex' === propertyName ) {
			this.activateDefaultTab();
		}
	},

	changeActiveTab: function( tabIndex ) {
		var isActiveTab = this.isActiveTab( tabIndex ),
			settings = this.getSettings();

		if ( ( settings.toggleSelf || ! isActiveTab ) && settings.hidePrevious ) {
			this.deactivateActiveTab();
		}

		if ( ! settings.hidePrevious && isActiveTab ) {
			this.deactivateActiveTab( tabIndex );
		}

		if ( ! isActiveTab ) {
			this.activateTab( tabIndex );
		}
	}
} );

},{"qazana-frontend/handler-module":3}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{"qazana-frontend/handler-module":3}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
module.exports = function( $scope, $ ) {
	qazanaFrontend.waypoint( $scope.find( '.qazana-progress-bar' ), function() {
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

},{"qazana-frontend/handler-module":3,"qazana-frontend/handlers/background-video":6}],13:[function(require,module,exports){
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

},{"qazana-frontend/handler-module":3}],14:[function(require,module,exports){
var TabsModule = require( 'qazana-frontend/handlers/base-tabs' );

module.exports = function( $scope ) {
	new TabsModule( {
		$element: $scope,
		toggleSelf: false
	} );
};

},{"qazana-frontend/handlers/base-tabs":7}],15:[function(require,module,exports){
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

},{"qazana-frontend/handler-module":3}],16:[function(require,module,exports){
var TabsModule = require( 'qazana-frontend/handlers/base-tabs' );

module.exports = function( $scope ) {
	new TabsModule( {
		$element: $scope,
		showTabFn: 'slideDown',
		hideTabFn: 'slideUp',
		hidePrevious: false,
		autoExpand: 'editor'
	} );
};

},{"qazana-frontend/handlers/base-tabs":7}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
var HandlerModule = require( 'qazana-frontend/handler-module' ),
	VideoModule;

VideoModule = HandlerModule.extend( {
	getDefaultSettings: function() {
		return {
			selectors: {
				imageOverlay: '.qazana-custom-embed-image-overlay',
				videoWrapper: '.qazana-wrapper',
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

	handleAspectRatio: function() {
		this.getLightBox().setVideoAspectRatio( this.getElementSettings( 'aspect_ratio' ) );
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
	}
} );

module.exports = function( $scope ) {
	new VideoModule( { $element: $scope } );
};

},{"qazana-frontend/handler-module":3}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
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

},{"../../utils/view-module":28}],21:[function(require,module,exports){
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

},{"../../utils/view-module":28}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
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

			var $slide = $( '<div>', { 'class': slideClass } );

			if ( slide.video ) {
				$slide.attr( 'data-qazana-slideshow-video', slide.video );

				var $playIcon = $( '<div>', { 'class': classes.playButton } ).html( $( '<i>', { 'class': classes.playButtonIcon } ) );

				$slide.append( $playIcon );
			} else {
				var $zoomContainer = $( '<div>', { 'class': 'swiper-zoom-container' } ),
					$slideImage = $( '<img>', { 'class': classes.image + ' ' + classes.preventClose } ).attr( 'src', slide.image );

				$zoomContainer.append( $slideImage );

				$slide.append( $zoomContainer );
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
		var $activeSlide = this.getSlide( 'active' ),
			videoURL = $activeSlide.data( 'qazana-slideshow-video' );

		if ( ! videoURL ) {
			return;
		}

		var classes = this.getSettings( 'classes' );

		var $videoContainer = jQuery( '<div>', { 'class': classes.videoContainer + ' ' + classes.invisible } ),
			$videoWrapper = jQuery( '<div>', { 'class': classes.videoWrapper } ),
			$videoFrame = jQuery( '<iframe>', { src: videoURL } ),
			$playIcon = $activeSlide.children( '.' + classes.playButton );

		$videoContainer.append( $videoWrapper );

		$videoWrapper.append( $videoFrame );

		$activeSlide.append( $videoContainer );

		$playIcon.addClass( classes.playing ).removeClass( classes.hidden );

		$videoFrame.on( 'load', function() {
			$playIcon.addClass( classes.hidden );

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
		var element = event.currentTarget,
			$target = jQuery( event.target ),
			editMode = qazanaFrontend.isEditMode(),
			isClickInsideQazana = !! $target.closest( '#qazana' ).length;

		if ( ! this.isLightboxLink( element ) ) {

			if ( editMode && isClickInsideQazana ) {
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

		if ( qazanaFrontend.isEditMode() ) {
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

},{"../../utils/view-module":28}],24:[function(require,module,exports){
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

},{"../../utils/view-module":28}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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

},{"qazana-utils/module":27}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvZGV2L2pzL2Zyb250ZW5kL2VsZW1lbnRzLWhhbmRsZXIuanMiLCJhc3NldHMvZGV2L2pzL2Zyb250ZW5kL2Zyb250ZW5kLmpzIiwiYXNzZXRzL2Rldi9qcy9mcm9udGVuZC9oYW5kbGVyLW1vZHVsZS5qcyIsImFzc2V0cy9kZXYvanMvZnJvbnRlbmQvaGFuZGxlcnMvYWNjb3JkaW9uLmpzIiwiYXNzZXRzL2Rldi9qcy9mcm9udGVuZC9oYW5kbGVycy9hbGVydC5qcyIsImFzc2V0cy9kZXYvanMvZnJvbnRlbmQvaGFuZGxlcnMvYmFja2dyb3VuZC12aWRlby5qcyIsImFzc2V0cy9kZXYvanMvZnJvbnRlbmQvaGFuZGxlcnMvYmFzZS10YWJzLmpzIiwiYXNzZXRzL2Rldi9qcy9mcm9udGVuZC9oYW5kbGVycy9jb3VudGVyLmpzIiwiYXNzZXRzL2Rldi9qcy9mcm9udGVuZC9oYW5kbGVycy9nbG9iYWwuanMiLCJhc3NldHMvZGV2L2pzL2Zyb250ZW5kL2hhbmRsZXJzL3BpZWNoYXJ0LmpzIiwiYXNzZXRzL2Rldi9qcy9mcm9udGVuZC9oYW5kbGVycy9wcm9ncmVzcy5qcyIsImFzc2V0cy9kZXYvanMvZnJvbnRlbmQvaGFuZGxlcnMvc2VjdGlvbi5qcyIsImFzc2V0cy9kZXYvanMvZnJvbnRlbmQvaGFuZGxlcnMvc3BhY2VyLmpzIiwiYXNzZXRzL2Rldi9qcy9mcm9udGVuZC9oYW5kbGVycy90YWJzLmpzIiwiYXNzZXRzL2Rldi9qcy9mcm9udGVuZC9oYW5kbGVycy90ZXh0LWVkaXRvci5qcyIsImFzc2V0cy9kZXYvanMvZnJvbnRlbmQvaGFuZGxlcnMvdG9nZ2xlLmpzIiwiYXNzZXRzL2Rldi9qcy9mcm9udGVuZC9oYW5kbGVycy90b29sdGlwLmpzIiwiYXNzZXRzL2Rldi9qcy9mcm9udGVuZC9oYW5kbGVycy92aWRlby5qcyIsImFzc2V0cy9kZXYvanMvZnJvbnRlbmQvaGFuZGxlcnMvd2lkZ2V0LmpzIiwiYXNzZXRzL2Rldi9qcy9mcm9udGVuZC9tb2R1bGVzL3N0cmV0Y2gtZWxlbWVudC5qcyIsImFzc2V0cy9kZXYvanMvZnJvbnRlbmQvdXRpbHMvYW5jaG9ycy5qcyIsImFzc2V0cy9kZXYvanMvZnJvbnRlbmQvdXRpbHMvY2Fyb3VzZWwuanMiLCJhc3NldHMvZGV2L2pzL2Zyb250ZW5kL3V0aWxzL2xpZ2h0Ym94LmpzIiwiYXNzZXRzL2Rldi9qcy9mcm9udGVuZC91dGlscy95b3V0dWJlLmpzIiwiYXNzZXRzL2Rldi9qcy91dGlscy9ob29rcy5qcyIsImFzc2V0cy9kZXYvanMvdXRpbHMvaG90LWtleXMuanMiLCJhc3NldHMvZGV2L2pzL3V0aWxzL21vZHVsZS5qcyIsImFzc2V0cy9kZXYvanMvdXRpbHMvdmlldy1tb2R1bGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25jQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIEVsZW1lbnRzSGFuZGxlcjtcblxuRWxlbWVudHNIYW5kbGVyID0gZnVuY3Rpb24oICQgKSB7XG5cdHZhciBzZWxmID0gdGhpcztcblxuXHQvLyBlbGVtZW50LXR5cGUuc2tpbi10eXBlXG5cdHZhciBoYW5kbGVycyA9IHtcblx0XHQvLyBFbGVtZW50c1xuXHRcdCdzZWN0aW9uJzogcmVxdWlyZSggJ3FhemFuYS1mcm9udGVuZC9oYW5kbGVycy9zZWN0aW9uJyApLFxuXG5cdFx0Ly8gV2lkZ2V0c1xuXHRcdCdhY2NvcmRpb24uZGVmYXVsdCc6IHJlcXVpcmUoICdxYXphbmEtZnJvbnRlbmQvaGFuZGxlcnMvYWNjb3JkaW9uJyApLFxuXHRcdCdhbGVydC5kZWZhdWx0JzogcmVxdWlyZSggJ3FhemFuYS1mcm9udGVuZC9oYW5kbGVycy9hbGVydCcgKSxcblx0XHQnY291bnRlci5kZWZhdWx0JzogcmVxdWlyZSggJ3FhemFuYS1mcm9udGVuZC9oYW5kbGVycy9jb3VudGVyJyApLFxuXHRcdCdwcm9ncmVzcy5kZWZhdWx0JzogcmVxdWlyZSggJ3FhemFuYS1mcm9udGVuZC9oYW5kbGVycy9wcm9ncmVzcycgKSxcblx0XHQndGFicy5kZWZhdWx0JzogcmVxdWlyZSggJ3FhemFuYS1mcm9udGVuZC9oYW5kbGVycy90YWJzJyApLFxuXHRcdCd0b2dnbGUuZGVmYXVsdCc6IHJlcXVpcmUoICdxYXphbmEtZnJvbnRlbmQvaGFuZGxlcnMvdG9nZ2xlJyApLFxuXHRcdCd2aWRlby5kZWZhdWx0JzogcmVxdWlyZSggJ3FhemFuYS1mcm9udGVuZC9oYW5kbGVycy92aWRlbycgKSxcblx0XHQndG9vbHRpcC5kZWZhdWx0JzogcmVxdWlyZSggJ3FhemFuYS1mcm9udGVuZC9oYW5kbGVycy90b29sdGlwJyApLFxuXHRcdCdwaWVjaGFydC5kZWZhdWx0JzogcmVxdWlyZSggJ3FhemFuYS1mcm9udGVuZC9oYW5kbGVycy9waWVjaGFydCcgKSxcblx0XHQvLydpbWFnZS1jYXJvdXNlbC5kZWZhdWx0JzogcmVxdWlyZSggJ3FhemFuYS1mcm9udGVuZC9oYW5kbGVycy9pbWFnZS1jYXJvdXNlbCcgKSxcblx0XHQndGV4dC1lZGl0b3IuZGVmYXVsdCc6IHJlcXVpcmUoICdxYXphbmEtZnJvbnRlbmQvaGFuZGxlcnMvdGV4dC1lZGl0b3InICksXG5cdFx0J3NwYWNlci5kZWZhdWx0JzogcmVxdWlyZSggJ3FhemFuYS1mcm9udGVuZC9oYW5kbGVycy9zcGFjZXInIClcblx0fTtcblxuXHR2YXIgYWRkR2xvYmFsSGFuZGxlcnMgPSBmdW5jdGlvbigpIHtcblx0XHRxYXphbmFGcm9udGVuZC5ob29rcy5hZGRBY3Rpb24oICdmcm9udGVuZC9lbGVtZW50X3JlYWR5L2dsb2JhbCcsIHJlcXVpcmUoICdxYXphbmEtZnJvbnRlbmQvaGFuZGxlcnMvZ2xvYmFsJyApICk7XG5cdFx0cWF6YW5hRnJvbnRlbmQuaG9va3MuYWRkQWN0aW9uKCAnZnJvbnRlbmQvZWxlbWVudF9yZWFkeS93aWRnZXQnLCByZXF1aXJlKCAncWF6YW5hLWZyb250ZW5kL2hhbmRsZXJzL3dpZGdldCcgKSApO1xuXHR9O1xuXG5cdHZhciBhZGRFbGVtZW50c0hhbmRsZXJzID0gZnVuY3Rpb24oKSB7XG5cdFx0JC5lYWNoKCBoYW5kbGVycywgZnVuY3Rpb24oIGVsZW1lbnROYW1lLCBmdW5jQ2FsbGJhY2sgKSB7XG5cdFx0XHRxYXphbmFGcm9udGVuZC5ob29rcy5hZGRBY3Rpb24oICdmcm9udGVuZC9lbGVtZW50X3JlYWR5LycgKyBlbGVtZW50TmFtZSwgZnVuY0NhbGxiYWNrICk7XG5cdFx0fSApO1xuXHR9O1xuXG5cdHZhciBydW5FbGVtZW50c0hhbmRsZXJzID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyICRlbGVtZW50cztcblxuXHRcdGlmICggcWF6YW5hRnJvbnRlbmQuaXNFZGl0TW9kZSgpICkge1xuXHRcdFx0Ly8gRWxlbWVudHMgb3V0c2lkZSBmcm9tIHRoZSBQcmV2aWV3XG5cdFx0XHQkZWxlbWVudHMgPSBqUXVlcnkoICcucWF6YW5hLWVsZW1lbnQnLCAnLnFhemFuYTpub3QoLnFhemFuYS1lZGl0LW1vZGUpJyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkZWxlbWVudHMgPSAkKCAnLnFhemFuYS1lbGVtZW50JyApO1xuXHRcdH1cblxuXHRcdCRlbGVtZW50cy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdHNlbGYucnVuUmVhZHlUcmlnZ2VyKCAkKCB0aGlzICkgKTtcblx0XHR9ICk7XG5cdH07XG5cblx0dmFyIGluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRpZiAoICEgcWF6YW5hRnJvbnRlbmQuaXNFZGl0TW9kZSgpICkge1xuXHRcdFx0c2VsZi5pbml0SGFuZGxlcnMoKTtcblx0XHR9XG5cdH07XG5cblx0dGhpcy5pbml0SGFuZGxlcnMgPSBmdW5jdGlvbigpIHtcblx0XHRhZGRHbG9iYWxIYW5kbGVycygpO1xuXG5cdFx0YWRkRWxlbWVudHNIYW5kbGVycygpO1xuXG5cdFx0cnVuRWxlbWVudHNIYW5kbGVycygpO1xuICAgIH07XG4gICAgXG4gICAgdGhpcy5yZUluaXQgPSBmdW5jdGlvbiggJHNjb3BlICkge1xuICAgICAgICBcbiAgICAgICAgdmFyICRlbGVtZW50cyA9ICRzY29wZS5maW5kKCAnLnFhemFuYS1lbGVtZW50JyApO1xuXG4gICAgICAgICRlbGVtZW50cy5lYWNoKCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNlbGYucnVuUmVhZHlUcmlnZ2VyKCAkKCB0aGlzICkgKTtcbiAgICAgICAgfSApO1xuXG4gICAgfTtcblxuXHR0aGlzLmdldEhhbmRsZXJzID0gZnVuY3Rpb24oIGhhbmRsZXJOYW1lICkge1xuXHRcdGlmICggaGFuZGxlck5hbWUgKSB7XG5cdFx0XHRyZXR1cm4gaGFuZGxlcnNbIGhhbmRsZXJOYW1lIF07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGhhbmRsZXJzO1xuXHR9O1xuXG5cdHRoaXMucnVuUmVhZHlUcmlnZ2VyID0gZnVuY3Rpb24oICRzY29wZSApIHtcblx0XHR2YXIgZWxlbWVudFR5cGUgPSAkc2NvcGUuYXR0ciggJ2RhdGEtZWxlbWVudF90eXBlJyApO1xuXG5cdFx0aWYgKCAhIGVsZW1lbnRUeXBlICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIEluaXRpYWxpemluZyB0aGUgYCRzY29wZWAgYXMgZnJvbnRlbmQgalF1ZXJ5IGluc3RhbmNlXG5cdFx0JHNjb3BlID0galF1ZXJ5KCAkc2NvcGUgKTtcblxuXHRcdHFhemFuYUZyb250ZW5kLmhvb2tzLmRvQWN0aW9uKCAnZnJvbnRlbmQvZWxlbWVudF9yZWFkeS9nbG9iYWwnLCAkc2NvcGUsICQgKTtcblxuXHRcdHZhciBpc1dpZGdldFR5cGUgPSAoIC0xID09PSBbICdzZWN0aW9uJywgJ2NvbHVtbicgXS5pbmRleE9mKCBlbGVtZW50VHlwZSApICk7XG5cblx0XHRpZiAoIGlzV2lkZ2V0VHlwZSApIHtcblx0XHRcdHFhemFuYUZyb250ZW5kLmhvb2tzLmRvQWN0aW9uKCAnZnJvbnRlbmQvZWxlbWVudF9yZWFkeS93aWRnZXQnLCAkc2NvcGUsICQgKTtcblx0XHR9XG5cblx0XHRxYXphbmFGcm9udGVuZC5ob29rcy5kb0FjdGlvbiggJ2Zyb250ZW5kL2VsZW1lbnRfcmVhZHkvJyArIGVsZW1lbnRUeXBlLCAkc2NvcGUsICQgKTtcblx0fTtcblxuXHRpbml0KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVsZW1lbnRzSGFuZGxlcjtcbiIsIi8qIGdsb2JhbCBxYXphbmFGcm9udGVuZENvbmZpZyAqL1xuKCBmdW5jdGlvbiggJCApIHtcblx0dmFyIGVsZW1lbnRzID0ge30sXG5cdFx0RXZlbnRNYW5hZ2VyID0gcmVxdWlyZSggJ3FhemFuYS11dGlscy9ob29rcycgKSxcblx0XHRNb2R1bGUgPSByZXF1aXJlKCAncWF6YW5hLWZyb250ZW5kL2hhbmRsZXItbW9kdWxlJyApLFxuXHRcdEVsZW1lbnRzSGFuZGxlciA9IHJlcXVpcmUoICdxYXphbmEtZnJvbnRlbmQvZWxlbWVudHMtaGFuZGxlcicgKSxcblx0XHRZb3VUdWJlTW9kdWxlID0gcmVxdWlyZSggJ3FhemFuYS1mcm9udGVuZC91dGlscy95b3V0dWJlJyApLFxuXHRcdEFuY2hvcnNNb2R1bGUgPSByZXF1aXJlKCAncWF6YW5hLWZyb250ZW5kL3V0aWxzL2FuY2hvcnMnICksXG5cdFx0TGlnaHRib3hNb2R1bGUgPSByZXF1aXJlKCAncWF6YW5hLWZyb250ZW5kL3V0aWxzL2xpZ2h0Ym94JyApO1xuXHRcdENhcm91c2VsTW9kdWxlID0gcmVxdWlyZSggJ3FhemFuYS1mcm9udGVuZC91dGlscy9jYXJvdXNlbCcgKTtcblx0XHRcblx0dmFyIFFhemFuYUZyb250ZW5kID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdFx0ZGlhbG9nc01hbmFnZXI7XG5cblx0XHR0aGlzLmNvbmZpZyA9IHFhemFuYUZyb250ZW5kQ29uZmlnO1xuXG5cdFx0dGhpcy5Nb2R1bGUgPSBNb2R1bGU7XG5cblx0XHR2YXIgc2V0RGV2aWNlTW9kZURhdGEgPSBmdW5jdGlvbigpIHtcblx0XHRcdGVsZW1lbnRzLiRib2R5LmF0dHIoICdkYXRhLXFhemFuYS1kZXZpY2UtbW9kZScsIHNlbGYuZ2V0Q3VycmVudERldmljZU1vZGUoKSApO1xuXHRcdH07XG5cblx0XHR2YXIgaW5pdEVsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRlbGVtZW50cy53aW5kb3cgPSB3aW5kb3c7XG5cblx0XHRcdGVsZW1lbnRzLiR3aW5kb3cgPSAkKCB3aW5kb3cgKTtcblxuXHRcdFx0ZWxlbWVudHMuJGRvY3VtZW50ID0gJCggZG9jdW1lbnQgKTtcblxuXHRcdFx0ZWxlbWVudHMuJGJvZHkgPSAkKCAnYm9keScgKTtcblxuXHRcdFx0ZWxlbWVudHMuJHFhemFuYSA9IGVsZW1lbnRzLiRkb2N1bWVudC5maW5kKCAnLnFhemFuYScgKTtcblx0XHR9O1xuXG5cdFx0dmFyIGJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRcdGVsZW1lbnRzLiR3aW5kb3cub24oICdyZXNpemUnLCBzZXREZXZpY2VNb2RlRGF0YSApO1xuXHRcdH07XG5cblx0XHR2YXIgaW5pdE9uUmVhZHlDb21wb25lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRzZWxmLnV0aWxzID0ge1xuXHRcdFx0XHR5b3V0dWJlOiBuZXcgWW91VHViZU1vZHVsZSgpLFxuXHRcdFx0XHRhbmNob3JzOiBuZXcgQW5jaG9yc01vZHVsZSgpLFxuXHRcdFx0XHRsaWdodGJveDogbmV3IExpZ2h0Ym94TW9kdWxlKClcblx0XHRcdFx0Ly9jYXJvdXNlbDogbmV3IENhcm91c2VsTW9kdWxlKClcblx0XHRcdH07XG5cblx0XHRcdHNlbGYubW9kdWxlcyA9IHtcblx0XHRcdFx0U3RyZXRjaEVsZW1lbnQ6IHJlcXVpcmUoICdxYXphbmEtZnJvbnRlbmQvbW9kdWxlcy9zdHJldGNoLWVsZW1lbnQnIClcblx0XHRcdH07XG5cblx0XHRcdHNlbGYuZWxlbWVudHNIYW5kbGVyID0gbmV3IEVsZW1lbnRzSGFuZGxlciggJCApO1xuXHRcdH07XG5cblx0XHR2YXIgaW5pdEhvdEtleXMgPSBmdW5jdGlvbigpIHtcblx0XHRcdHNlbGYuaG90S2V5cyA9IHJlcXVpcmUoICdxYXphbmEtdXRpbHMvaG90LWtleXMnICk7XG5cblx0XHRcdHNlbGYuaG90S2V5cy5iaW5kTGlzdGVuZXIoIGVsZW1lbnRzLiR3aW5kb3cgKTtcblx0XHR9O1xuXG5cdFx0dmFyIGdldFNpdGVTZXR0aW5ncyA9IGZ1bmN0aW9uKCBzZXR0aW5nVHlwZSwgc2V0dGluZ05hbWUgKSB7XG5cdFx0XHR2YXIgc2V0dGluZ3NPYmplY3QgPSBzZWxmLmlzRWRpdE1vZGUoKSA/IHFhemFuYS5zZXR0aW5nc1sgc2V0dGluZ1R5cGUgXS5tb2RlbC5hdHRyaWJ1dGVzIDogc2VsZi5jb25maWcuc2V0dGluZ3NbIHNldHRpbmdUeXBlIF07XG5cblx0XHRcdGlmICggc2V0dGluZ05hbWUgKSB7XG5cdFx0XHRcdHJldHVybiBzZXR0aW5nc09iamVjdFsgc2V0dGluZ05hbWUgXTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHNldHRpbmdzT2JqZWN0O1xuXHRcdH07XG5cblx0XHR0aGlzLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRcdHNlbGYuaG9va3MgPSBuZXcgRXZlbnRNYW5hZ2VyKCk7XG5cblx0XHRcdGluaXRFbGVtZW50cygpO1xuXG5cdFx0XHRiaW5kRXZlbnRzKCk7XG5cblx0XHRcdHNldERldmljZU1vZGVEYXRhKCk7XG5cblx0XHRcdGVsZW1lbnRzLiR3aW5kb3cudHJpZ2dlciggJ3FhemFuYS9mcm9udGVuZC9pbml0JyApO1xuXG5cdFx0XHRpZiAoICEgc2VsZi5pc0VkaXRNb2RlKCkgKSB7XG5cdFx0XHRcdGluaXRIb3RLZXlzKCk7XG5cdFx0XHR9XG5cblx0XHRcdGluaXRPblJlYWR5Q29tcG9uZW50cygpO1xuXHRcdH07XG5cblx0XHR0aGlzLmdldEVsZW1lbnRzID0gZnVuY3Rpb24oIGVsZW1lbnQgKSB7XG5cdFx0XHRpZiAoIGVsZW1lbnQgKSB7XG5cdFx0XHRcdHJldHVybiBlbGVtZW50c1sgZWxlbWVudCBdO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZWxlbWVudHM7XG5cdFx0fTtcblxuXHRcdHRoaXMuZ2V0RGlhbG9nc01hbmFnZXIgPSBmdW5jdGlvbigpIHtcblx0XHRcdGlmICggISBkaWFsb2dzTWFuYWdlciApIHtcblx0XHRcdFx0ZGlhbG9nc01hbmFnZXIgPSBuZXcgRGlhbG9nc01hbmFnZXIuSW5zdGFuY2UoKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGRpYWxvZ3NNYW5hZ2VyO1xuXHRcdH07XG5cblx0XHR0aGlzLmdldFBhZ2VTZXR0aW5ncyA9IGZ1bmN0aW9uKCBzZXR0aW5nTmFtZSApIHtcblx0XHRcdHJldHVybiBnZXRTaXRlU2V0dGluZ3MoICdwYWdlJywgc2V0dGluZ05hbWUgKTtcblx0XHR9O1xuXG5cdFx0dGhpcy5nZXRHZW5lcmFsU2V0dGluZ3MgPSBmdW5jdGlvbiggc2V0dGluZ05hbWUgKSB7XG5cdFx0XHRyZXR1cm4gZ2V0U2l0ZVNldHRpbmdzKCAnZ2VuZXJhbCcsIHNldHRpbmdOYW1lICk7XG5cdFx0fTtcblxuXHRcdHRoaXMuaXNFZGl0TW9kZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHNlbGYuY29uZmlnLmlzRWRpdE1vZGU7XG5cdFx0fTtcblxuXHRcdC8vIEJhc2VkIG9uIHVuZGVyc2NvcmUgZnVuY3Rpb25cblx0XHR0aGlzLnRocm90dGxlID0gZnVuY3Rpb24oIGZ1bmMsIHdhaXQgKSB7XG5cdFx0XHR2YXIgdGltZW91dCxcblx0XHRcdFx0Y29udGV4dCxcblx0XHRcdFx0YXJncyxcblx0XHRcdFx0cmVzdWx0LFxuXHRcdFx0XHRwcmV2aW91cyA9IDA7XG5cblx0XHRcdHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRwcmV2aW91cyA9IERhdGUubm93KCk7XG5cdFx0XHRcdHRpbWVvdXQgPSBudWxsO1xuXHRcdFx0XHRyZXN1bHQgPSBmdW5jLmFwcGx5KCBjb250ZXh0LCBhcmdzICk7XG5cblx0XHRcdFx0aWYgKCAhIHRpbWVvdXQgKSB7XG5cdFx0XHRcdFx0Y29udGV4dCA9IGFyZ3MgPSBudWxsO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciBub3cgPSBEYXRlLm5vdygpLFxuXHRcdFx0XHRcdHJlbWFpbmluZyA9IHdhaXQgLSAoIG5vdyAtIHByZXZpb3VzICk7XG5cblx0XHRcdFx0Y29udGV4dCA9IHRoaXM7XG5cdFx0XHRcdGFyZ3MgPSBhcmd1bWVudHM7XG5cblx0XHRcdFx0aWYgKCByZW1haW5pbmcgPD0gMCB8fCByZW1haW5pbmcgPiB3YWl0ICkge1xuXHRcdFx0XHRcdGlmICggdGltZW91dCApIHtcblx0XHRcdFx0XHRcdGNsZWFyVGltZW91dCggdGltZW91dCApO1xuXHRcdFx0XHRcdFx0dGltZW91dCA9IG51bGw7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cHJldmlvdXMgPSBub3c7XG5cdFx0XHRcdFx0cmVzdWx0ID0gZnVuYy5hcHBseSggY29udGV4dCwgYXJncyApO1xuXG5cdFx0XHRcdFx0aWYgKCAhIHRpbWVvdXQgKSB7XG5cdFx0XHRcdFx0XHRjb250ZXh0ID0gYXJncyA9IG51bGw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgaWYgKCAhIHRpbWVvdXQgKSB7XG5cdFx0XHRcdFx0dGltZW91dCA9IHNldFRpbWVvdXQoIGxhdGVyLCByZW1haW5pbmcgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9O1xuXHRcdH07XG5cblx0XHR0aGlzLmFkZExpc3RlbmVyT25jZSA9IGZ1bmN0aW9uKCBsaXN0ZW5lcklELCBldmVudCwgY2FsbGJhY2ssIHRvICkge1xuXHRcdFx0aWYgKCAhIHRvICkge1xuXHRcdFx0XHR0byA9IHNlbGYuZ2V0RWxlbWVudHMoICckd2luZG93JyApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICEgc2VsZi5pc0VkaXRNb2RlKCkgKSB7XG5cdFx0XHRcdHRvLm9uKCBldmVudCwgY2FsbGJhY2sgKTtcblxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICggdG8gaW5zdGFuY2VvZiBqUXVlcnkgKSB7XG5cdFx0XHRcdHZhciBldmVudE5TID0gZXZlbnQgKyAnLicgKyBsaXN0ZW5lcklEO1xuXG5cdFx0XHRcdHRvLm9mZiggZXZlbnROUyApLm9uKCBldmVudE5TLCBjYWxsYmFjayApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dG8ub2ZmKCBldmVudCwgbnVsbCwgbGlzdGVuZXJJRCApLm9uKCBldmVudCwgY2FsbGJhY2ssIGxpc3RlbmVySUQgKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0dGhpcy5nZXRDdXJyZW50RGV2aWNlTW9kZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGdldENvbXB1dGVkU3R5bGUoIGVsZW1lbnRzLiRxYXphbmFbIDAgXSwgJzphZnRlcicgKS5jb250ZW50LnJlcGxhY2UoIC9cIi9nLCAnJyApO1xuXHRcdH07XG5cblx0XHR0aGlzLndheXBvaW50ID0gZnVuY3Rpb24oICRlbGVtZW50LCBjYWxsYmFjaywgb3B0aW9ucyApIHtcblx0XHRcdHZhciBjb3JyZWN0Q2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIGVsZW1lbnQgPSB0aGlzLmVsZW1lbnQgfHwgdGhpcztcblxuXHRcdFx0XHRyZXR1cm4gY2FsbGJhY2suYXBwbHkoIGVsZW1lbnQsIGFyZ3VtZW50cyApO1xuXHRcdFx0fTtcblxuXHRcdFx0cmV0dXJuICRlbGVtZW50LnFhemFuYVdheXBvaW50KCBjb3JyZWN0Q2FsbGJhY2ssIG9wdGlvbnMgKTtcblx0XHR9O1xuXHR9O1xuXG5cdHdpbmRvdy5xYXphbmFGcm9udGVuZCA9IG5ldyBRYXphbmFGcm9udGVuZCgpO1xufSApKCBqUXVlcnkgKTtcblxuaWYgKCAhIHFhemFuYUZyb250ZW5kLmlzRWRpdE1vZGUoKSApIHtcblx0alF1ZXJ5KCBxYXphbmFGcm9udGVuZC5pbml0ICk7XG59XG4iLCJ2YXIgVmlld01vZHVsZSA9IHJlcXVpcmUoICcuLi91dGlscy92aWV3LW1vZHVsZScgKSxcblx0SGFuZGxlck1vZHVsZTtcblxuSGFuZGxlck1vZHVsZSA9IFZpZXdNb2R1bGUuZXh0ZW5kKCB7XG5cdCRlbGVtZW50OiBudWxsLFxuXG5cdG9uRWxlbWVudENoYW5nZTogbnVsbCxcblxuXHRvbkVkaXRTZXR0aW5nc0NoYW5nZTogbnVsbCxcblxuXHRvbkdlbmVyYWxTZXR0aW5nc0NoYW5nZTogbnVsbCxcblxuXHRvblBhZ2VTZXR0aW5nc0NoYW5nZTogbnVsbCxcblxuXHRpc0VkaXQ6IG51bGwsXG5cblx0X19jb25zdHJ1Y3Q6IGZ1bmN0aW9uKCBzZXR0aW5ncyApIHtcblx0XHR0aGlzLiRlbGVtZW50ICA9IHNldHRpbmdzLiRlbGVtZW50O1xuXG5cdFx0dGhpcy5pc0VkaXQgPSB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCAncWF6YW5hLWVsZW1lbnQtZWRpdC1tb2RlJyApO1xuXG5cdFx0aWYgKCB0aGlzLmlzRWRpdCApIHtcblx0XHRcdHRoaXMuYWRkRWRpdG9yTGlzdGVuZXIoKTtcblx0XHR9XG5cdH0sXG5cblx0Z2V0VW5pcXVlSGFuZGxlcklEOiBmdW5jdGlvbiggY2lkLCAkZWxlbWVudCApIHtcblx0XHRpZiAoICEgY2lkICkge1xuXHRcdFx0Y2lkID0gdGhpcy5nZXRNb2RlbENJRCgpO1xuXHRcdH1cblxuXHRcdGlmICggISAkZWxlbWVudCApIHtcblx0XHRcdCRlbGVtZW50ID0gdGhpcy4kZWxlbWVudDtcblx0XHR9XG5cblx0XHRyZXR1cm4gY2lkICsgJGVsZW1lbnQuYXR0ciggJ2RhdGEtZWxlbWVudF90eXBlJyApICsgdGhpcy5nZXRDb25zdHJ1Y3RvcklEKCk7XG5cdH0sXG5cblx0YWRkRWRpdG9yTGlzdGVuZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzZWxmID0gdGhpcyxcblx0XHRcdHVuaXF1ZUhhbmRsZXJJRCA9IHNlbGYuZ2V0VW5pcXVlSGFuZGxlcklEKCk7XG5cblx0XHRpZiAoIHNlbGYub25FbGVtZW50Q2hhbmdlICkge1xuXHRcdFx0dmFyIGVsZW1lbnROYW1lID0gc2VsZi5nZXRFbGVtZW50TmFtZSgpLFxuXHRcdFx0XHRldmVudE5hbWUgPSAnY2hhbmdlJztcblxuXHRcdFx0aWYgKCAnZ2xvYmFsJyAhPT0gZWxlbWVudE5hbWUgKSB7XG5cdFx0XHRcdGV2ZW50TmFtZSArPSAnOicgKyBlbGVtZW50TmFtZTtcblx0XHRcdH1cblxuXHRcdFx0cWF6YW5hRnJvbnRlbmQuYWRkTGlzdGVuZXJPbmNlKCB1bmlxdWVIYW5kbGVySUQsIGV2ZW50TmFtZSwgZnVuY3Rpb24oIGNvbnRyb2xWaWV3LCBlbGVtZW50VmlldyApIHtcblx0XHRcdFx0dmFyIGVsZW1lbnRWaWV3SGFuZGxlcklEID0gc2VsZi5nZXRVbmlxdWVIYW5kbGVySUQoIGVsZW1lbnRWaWV3Lm1vZGVsLmNpZCwgZWxlbWVudFZpZXcuJGVsICk7XG5cblx0XHRcdFx0aWYgKCBlbGVtZW50Vmlld0hhbmRsZXJJRCAhPT0gdW5pcXVlSGFuZGxlcklEICkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNlbGYub25FbGVtZW50Q2hhbmdlKCBjb250cm9sVmlldy5tb2RlbC5nZXQoICduYW1lJyApLCAgY29udHJvbFZpZXcsIGVsZW1lbnRWaWV3ICk7XG5cdFx0XHR9LCBxYXphbmEuY2hhbm5lbHMuZWRpdG9yICk7XG5cdFx0fVxuXG5cdFx0WyAncGFnZScsICdnZW5lcmFsJyBdLmZvckVhY2goIGZ1bmN0aW9uKCBzZXR0aW5nc1R5cGUgKSB7XG5cdFx0XHR2YXIgbGlzdGVuZXJNZXRob2ROYW1lID0gJ29uJyArIHNldHRpbmdzVHlwZS5jaGFyQXQoIDAgKS50b1VwcGVyQ2FzZSgpICsgc2V0dGluZ3NUeXBlLnNsaWNlKCAxICkgKyAnU2V0dGluZ3NDaGFuZ2UnO1xuXG5cdFx0XHRpZiAoIHNlbGZbIGxpc3RlbmVyTWV0aG9kTmFtZSBdICkge1xuXHRcdFx0XHRxYXphbmFGcm9udGVuZC5hZGRMaXN0ZW5lck9uY2UoIHVuaXF1ZUhhbmRsZXJJRCwgJ2NoYW5nZScsIGZ1bmN0aW9uKCBtb2RlbCApIHtcblx0XHRcdFx0XHRzZWxmWyBsaXN0ZW5lck1ldGhvZE5hbWUgXSggbW9kZWwuY2hhbmdlZCApO1xuXHRcdFx0XHR9LCBxYXphbmEuc2V0dGluZ3NbIHNldHRpbmdzVHlwZSBdLm1vZGVsICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9LFxuXG5cdGdldEVsZW1lbnROYW1lOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy4kZWxlbWVudC5kYXRhKCAnZWxlbWVudF90eXBlJyApLnNwbGl0KCAnLicgKVswXTtcblx0fSxcblxuXHRnZXRTa2luTmFtZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuJGVsZW1lbnQuZGF0YSggJ2VsZW1lbnRfdHlwZScgKS5zcGxpdCggJy4nIClbMV07XG5cdH0sXG5cblx0Z2V0SUQ6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLiRlbGVtZW50LmRhdGEoICdpZCcgKTtcblx0fSxcblxuXHRnZXRNb2RlbENJRDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuJGVsZW1lbnQuZGF0YSggJ21vZGVsLWNpZCcgKTtcblx0fSxcblxuXHRnZXRFbGVtZW50U2V0dGluZ3M6IGZ1bmN0aW9uKCBzZXR0aW5nICkge1xuXHRcdHZhciBlbGVtZW50U2V0dGluZ3MgPSB7fSxcblx0XHRcdG1vZGVsQ0lEID0gdGhpcy5nZXRNb2RlbENJRCgpLFxuXHRcdFx0c2VsZiA9IHRoaXMsXG5cdFx0XHRzZXR0aW5ncyxcblx0XHRcdGVsZW1lbnROYW1lID0gc2VsZi5nZXRFbGVtZW50TmFtZSgpLnJlcGxhY2UoLy0vZywgJ18nKSxcblx0XHRcdHNraW5OYW1lID0gc2VsZi5nZXRTa2luTmFtZSgpICYmICdnbG9iYWwnICE9PSBlbGVtZW50TmFtZSA/IHNlbGYuZ2V0U2tpbk5hbWUoKS5yZXBsYWNlKC8tL2csICdfJykgOiAnZGVmYXVsdCc7XG5cdFx0XG5cdFx0aWYgKCBxYXphbmFGcm9udGVuZC5pc0VkaXRNb2RlKCkgJiYgbW9kZWxDSUQgKSB7XG5cdFx0XHRzZXR0aW5ncyA9IHFhemFuYUZyb250ZW5kLmNvbmZpZy5lbGVtZW50cy5kYXRhWyBtb2RlbENJRCBdO1xuXHRcdFx0c2V0dGluZ3NLZXlzID0gcWF6YW5hRnJvbnRlbmQuY29uZmlnLmVsZW1lbnRzLmtleXNbIHNldHRpbmdzLmF0dHJpYnV0ZXMud2lkZ2V0VHlwZSB8fCBzZXR0aW5ncy5hdHRyaWJ1dGVzLmVsVHlwZSBdO1xuXG5cdFx0XHRqUXVlcnkuZWFjaCggc2V0dGluZ3MuZ2V0QWN0aXZlQ29udHJvbHMoKSwgZnVuY3Rpb24oIGNvbnRyb2xLZXkgKSB7XG5cblx0XHRcdFx0aWYgKCAtMSAhPT0gc2V0dGluZ3NLZXlzLmluZGV4T2YoIGNvbnRyb2xLZXkgKSApIHtcblxuXHRcdFx0XHRcdHZhciBuZXdDb250cm9sS2V5ID0gY29udHJvbEtleTtcblx0XHRcdFx0XHRpZiAoIHNraW5OYW1lICE9PSAnZGVmYXVsdCcgKSB7XG5cdFx0XHRcdFx0XHRuZXdDb250cm9sS2V5ID0gY29udHJvbEtleS5yZXBsYWNlKCBza2luTmFtZSArICdfJywgJycgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxlbWVudFNldHRpbmdzWyBuZXdDb250cm9sS2V5IF0gPSBzZXR0aW5ncy5hdHRyaWJ1dGVzWyBjb250cm9sS2V5IF07XG5cdFx0XHRcdH1cblxuXHRcdFx0fSApO1xuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0c2V0dGluZ3MgPSB0aGlzLiRlbGVtZW50LmRhdGEoICdzZXR0aW5ncycgKSB8fCB7fTtcblxuXHRcdFx0aWYgKCBzZXR0aW5ncyAmJiBza2luTmFtZSAhPT0gJ2RlZmF1bHQnICkge1xuXHRcdFx0XHRqUXVlcnkuZWFjaCggc2V0dGluZ3MsIGZ1bmN0aW9uKCBjb250cm9sS2V5ICkge1xuXHRcdFx0XHRcdHZhciBuZXdDb250cm9sS2V5ID0gY29udHJvbEtleTtcblx0XHRcdFx0XHRuZXdDb250cm9sS2V5ID0gY29udHJvbEtleS5yZXBsYWNlKCBza2luTmFtZSArICdfJywgJycgKTtcblx0XHRcdFx0XHRlbGVtZW50U2V0dGluZ3NbIG5ld0NvbnRyb2xLZXkgXSA9IHNlbGYuZ2V0SXRlbXMoIHNldHRpbmdzLCBjb250cm9sS2V5ICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZWxlbWVudFNldHRpbmdzID0gc2V0dGluZ3M7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5nZXRJdGVtcyggZWxlbWVudFNldHRpbmdzLCBzZXR0aW5nICk7XG5cdH0sXG5cblx0Z2V0RWRpdFNldHRpbmdzOiBmdW5jdGlvbiggc2V0dGluZyApIHtcblx0XHR2YXIgYXR0cmlidXRlcyA9IHt9O1xuXG5cdFx0aWYgKCB0aGlzLmlzRWRpdCApIHtcblx0XHRcdGF0dHJpYnV0ZXMgPSBxYXphbmFGcm9udGVuZC5jb25maWcuZWxlbWVudHMuZWRpdFNldHRpbmdzWyB0aGlzLmdldE1vZGVsQ0lEKCkgXS5hdHRyaWJ1dGVzO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLmdldEl0ZW1zKCBhdHRyaWJ1dGVzLCBzZXR0aW5nICk7XG5cdH1cbn0gKTtcblxubW9kdWxlLmV4cG9ydHMgPSBIYW5kbGVyTW9kdWxlO1xuIiwidmFyIFRhYnNNb2R1bGUgPSByZXF1aXJlKCAncWF6YW5hLWZyb250ZW5kL2hhbmRsZXJzL2Jhc2UtdGFicycgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggJHNjb3BlICkge1xuXHRuZXcgVGFic01vZHVsZSgge1xuXHRcdCRlbGVtZW50OiAkc2NvcGUsXG5cdFx0c2hvd1RhYkZuOiAnc2xpZGVEb3duJyxcblx0XHRoaWRlVGFiRm46ICdzbGlkZVVwJ1xuXHR9ICk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggJHNjb3BlLCAkICkge1xuXHQkc2NvcGUuZmluZCggJy5xYXphbmEtYWxlcnQtZGlzbWlzcycgKS5vbiggJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0JCggdGhpcyApLnBhcmVudCgpLmZhZGVPdXQoKTtcblx0fSApO1xufTtcbiIsInZhciBIYW5kbGVyTW9kdWxlID0gcmVxdWlyZSggJ3FhemFuYS1mcm9udGVuZC9oYW5kbGVyLW1vZHVsZScgKTtcblxudmFyIFZpZGVvID0gZnVuY3Rpb24oICRiYWNrZ3JvdW5kVmlkZW9Db250YWluZXIsICQgKSB7XG5cdHZhciBwbGF5ZXIsXG5cdFx0ZWxlbWVudHMgPSB7fSxcblx0XHRpc1lUVmlkZW8gPSBmYWxzZTtcblxuXHR2YXIgY2FsY1ZpZGVvc1NpemUgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgY29udGFpbmVyV2lkdGggPSAkYmFja2dyb3VuZFZpZGVvQ29udGFpbmVyLm91dGVyV2lkdGgoKSxcblx0XHRcdGNvbnRhaW5lckhlaWdodCA9ICRiYWNrZ3JvdW5kVmlkZW9Db250YWluZXIub3V0ZXJIZWlnaHQoKSxcblx0XHRcdGFzcGVjdFJhdGlvU2V0dGluZyA9ICcxNjo5JywgLy9URU1QXG5cdFx0XHRhc3BlY3RSYXRpb0FycmF5ID0gYXNwZWN0UmF0aW9TZXR0aW5nLnNwbGl0KCAnOicgKSxcblx0XHRcdGFzcGVjdFJhdGlvID0gYXNwZWN0UmF0aW9BcnJheVsgMCBdIC8gYXNwZWN0UmF0aW9BcnJheVsgMSBdLFxuXHRcdFx0cmF0aW9XaWR0aCA9IGNvbnRhaW5lcldpZHRoIC8gYXNwZWN0UmF0aW8sXG5cdFx0XHRyYXRpb0hlaWdodCA9IGNvbnRhaW5lckhlaWdodCAqIGFzcGVjdFJhdGlvLFxuXHRcdFx0aXNXaWR0aEZpeGVkID0gY29udGFpbmVyV2lkdGggLyBjb250YWluZXJIZWlnaHQgPiBhc3BlY3RSYXRpbztcblxuXHRcdHJldHVybiB7XG5cdFx0XHR3aWR0aDogaXNXaWR0aEZpeGVkID8gY29udGFpbmVyV2lkdGggOiByYXRpb0hlaWdodCxcblx0XHRcdGhlaWdodDogaXNXaWR0aEZpeGVkID8gcmF0aW9XaWR0aCA6IGNvbnRhaW5lckhlaWdodFxuXHRcdH07XG5cdH07XG5cblx0dmFyIGNoYW5nZVZpZGVvU2l6ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciAkdmlkZW8gPSBpc1lUVmlkZW8gPyBqUXVlcnkoIHBsYXllci5nZXRJZnJhbWUoKSApIDogZWxlbWVudHMuJGJhY2tncm91bmRWaWRlbyxcblx0XHRcdHNpemUgPSBjYWxjVmlkZW9zU2l6ZSgpO1xuXG5cdFx0JHZpZGVvLndpZHRoKCBzaXplLndpZHRoICkuaGVpZ2h0KCBzaXplLmhlaWdodCApO1xuXHR9O1xuXG5cdHZhciBwcmVwYXJlWVRWaWRlbyA9IGZ1bmN0aW9uKCBZVCwgdmlkZW9JRCApIHtcblx0XHRwbGF5ZXIgPSBuZXcgWVQuUGxheWVyKCBlbGVtZW50cy4kYmFja2dyb3VuZFZpZGVvWyAwIF0sIHtcblx0XHRcdHZpZGVvSWQ6IHZpZGVvSUQsXG5cdFx0XHRldmVudHM6IHtcblx0XHRcdFx0b25SZWFkeTogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cGxheWVyLm11dGUoKTtcblx0XHRcdFx0XHRwbGF5ZXIucGxheVZpZGVvKCk7XG5cblx0XHRcdFx0XHRjaGFuZ2VWaWRlb1NpemUoKTtcblxuXHRcdFx0XHR9LFxuXHRcdFx0XHRvblN0YXRlQ2hhbmdlOiBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdFx0aWYgKCBldmVudC5kYXRhID09PSBZVC5QbGF5ZXJTdGF0ZS5FTkRFRCApIHtcblx0XHRcdFx0XHRcdHBsYXllci5zZWVrVG8oIDAgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRwbGF5ZXJWYXJzOiB7XG5cdFx0XHRcdGNvbnRyb2xzOiAwLFxuXHRcdFx0XHRzaG93aW5mbzogMFxuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdHFhemFuYUZyb250ZW5kLmdldEVsZW1lbnRzKCAnJHdpbmRvdycgKS5vbiggJ3Jlc2l6ZScsIGNoYW5nZVZpZGVvU2l6ZSApO1xuXHR9O1xuXG5cdHZhciBwcmVwYXJlVmltZW9WaWRlbyA9IGZ1bmN0aW9uKCBZVCwgdmlkZW9JRCApIHtcblx0XHRxYXphbmFGcm9udGVuZC5nZXRFbGVtZW50cyggJyR3aW5kb3cnICkub24oICdyZXNpemUnLCBjaGFuZ2VWaWRlb1NpemUgKTtcblx0fTtcblxuXHR2YXIgaW5pdEVsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0ZWxlbWVudHMuJGJhY2tncm91bmRWaWRlbyA9ICRiYWNrZ3JvdW5kVmlkZW9Db250YWluZXIuY2hpbGRyZW4oICcucWF6YW5hLWJhY2tncm91bmQtdmlkZW8nICk7XG5cdH07XG5cblx0dmFyIHJ1biA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciB2aWRlb0lEID0gZWxlbWVudHMuJGJhY2tncm91bmRWaWRlby5kYXRhKCAndmlkZW8taWQnICksXG5cdFx0XHR2aWRlb0hvc3QgPSBlbGVtZW50cy4kYmFja2dyb3VuZFZpZGVvLmRhdGEoICd2aWRlby1ob3N0JyApO1xuXG5cdFx0aWYgKCB2aWRlb0lEICYmIHZpZGVvSG9zdCA9PT0gJ3lvdXR1YmUnICkge1xuXHRcdFx0aXNZVFZpZGVvID0gdHJ1ZTtcblxuXHRcdFx0cWF6YW5hRnJvbnRlbmQudXRpbHMueW91dHViZS5vbllvdXR1YmVBcGlSZWFkeSggZnVuY3Rpb24oIFlUICkge1xuXHRcdFx0XHRzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRwcmVwYXJlWVRWaWRlbyggWVQsIHZpZGVvSUQgKTtcblx0XHRcdFx0fSwgMSApO1xuXHRcdFx0fSk7XG5cblx0XHR9IGVsc2UgaWYgKCB2aWRlb0lEICYmIHZpZGVvSG9zdCA9PT0gJ3ZpbWVvJyApIHtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZWxlbWVudHMuJGJhY2tncm91bmRWaWRlby5vbmUoICdjYW5wbGF5JywgY2hhbmdlVmlkZW9TaXplICk7XG5cdFx0fVxuXHR9O1xuXG5cdHZhciBpbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0aW5pdEVsZW1lbnRzKCk7XG5cdFx0cnVuKCk7XG5cdH07XG5cblx0aW5pdCgpO1xufTtcblxudmFyIEJhY2tncm91bmRWaWRlbyA9IEhhbmRsZXJNb2R1bGUuZXh0ZW5kKCB7XG5cdFxuXHRvbkluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciAkYmFja2dyb3VuZFZpZGVvQ29udGFpbmVyID0gdGhpcy4kZWxlbWVudC5maW5kKCAnLnFhemFuYS1iYWNrZ3JvdW5kLXZpZGVvLWNvbnRhaW5lcicgKTtcblx0XHRpZiAoICRiYWNrZ3JvdW5kVmlkZW9Db250YWluZXIgKSB7XG5cdFx0XHRuZXcgVmlkZW8oICRiYWNrZ3JvdW5kVmlkZW9Db250YWluZXIsICQgKTtcblx0XHR9XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tncm91bmRWaWRlbztcbiIsInZhciBIYW5kbGVyTW9kdWxlID0gcmVxdWlyZSggJ3FhemFuYS1mcm9udGVuZC9oYW5kbGVyLW1vZHVsZScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBIYW5kbGVyTW9kdWxlLmV4dGVuZCgge1xuXHQkYWN0aXZlQ29udGVudDogbnVsbCxcblxuXHRnZXREZWZhdWx0U2V0dGluZ3M6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRzZWxlY3RvcnM6IHtcblx0XHRcdFx0dGFiVGl0bGU6ICcucWF6YW5hLXRhYi10aXRsZScsXG5cdFx0XHRcdHRhYkNvbnRlbnQ6ICcucWF6YW5hLXRhYi1jb250ZW50J1xuXHRcdFx0fSxcblx0XHRcdGNsYXNzZXM6IHtcblx0XHRcdFx0YWN0aXZlOiAncWF6YW5hLWFjdGl2ZSdcblx0XHRcdH0sXG5cdFx0XHRzaG93VGFiRm46ICdzaG93Jyxcblx0XHRcdGhpZGVUYWJGbjogJ2hpZGUnLFxuXHRcdFx0dG9nZ2xlU2VsZjogdHJ1ZSxcblx0XHRcdGhpZGVQcmV2aW91czogdHJ1ZSxcblx0XHRcdGF1dG9FeHBhbmQ6IHRydWVcblx0XHR9O1xuXHR9LFxuXG5cdGdldERlZmF1bHRFbGVtZW50czogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNlbGVjdG9ycyA9IHRoaXMuZ2V0U2V0dGluZ3MoICdzZWxlY3RvcnMnICk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0JHRhYlRpdGxlczogdGhpcy4kZWxlbWVudC5maW5kKCBzZWxlY3RvcnMudGFiVGl0bGUgKSxcblx0XHRcdCR0YWJDb250ZW50czogdGhpcy4kZWxlbWVudC5maW5kKCBzZWxlY3RvcnMudGFiQ29udGVudCApXG5cdFx0fTtcblx0fSxcblxuXHRhY3RpdmF0ZURlZmF1bHRUYWI6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzZXR0aW5ncyA9IHRoaXMuZ2V0U2V0dGluZ3MoKTtcblxuXHRcdGlmICggISBzZXR0aW5ncy5hdXRvRXhwYW5kIHx8ICdlZGl0b3InID09PSBzZXR0aW5ncy5hdXRvRXhwYW5kICYmICEgdGhpcy5pc0VkaXQgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIGRlZmF1bHRBY3RpdmVUYWIgPSB0aGlzLmdldEVkaXRTZXR0aW5ncyggJ2FjdGl2ZUl0ZW1JbmRleCcgKSB8fCAxLFxuXHRcdFx0b3JpZ2luYWxUb2dnbGVNZXRob2RzID0ge1xuXHRcdFx0XHRzaG93VGFiRm46IHNldHRpbmdzLnNob3dUYWJGbixcblx0XHRcdFx0aGlkZVRhYkZuOiBzZXR0aW5ncy5oaWRlVGFiRm5cblx0XHRcdH07XG5cblx0XHQvLyBUb2dnbGUgdGFicyB3aXRob3V0IGFuaW1hdGlvbiB0byBhdm9pZCBqdW1waW5nXG5cdFx0dGhpcy5zZXRTZXR0aW5ncygge1xuXHRcdFx0c2hvd1RhYkZuOiAnc2hvdycsXG5cdFx0XHRoaWRlVGFiRm46ICdoaWRlJ1xuXHRcdH0gKTtcblxuXHRcdHRoaXMuY2hhbmdlQWN0aXZlVGFiKCBkZWZhdWx0QWN0aXZlVGFiICk7XG5cblx0XHQvLyBSZXR1cm4gYmFjayBvcmlnaW5hbCB0b2dnbGUgZWZmZWN0c1xuXHRcdHRoaXMuc2V0U2V0dGluZ3MoIG9yaWdpbmFsVG9nZ2xlTWV0aG9kcyApO1xuXHR9LFxuXG5cdGRlYWN0aXZhdGVBY3RpdmVUYWI6IGZ1bmN0aW9uKCB0YWJJbmRleCApIHtcblx0XHR2YXIgc2V0dGluZ3MgPSB0aGlzLmdldFNldHRpbmdzKCksXG5cdFx0XHRhY3RpdmVDbGFzcyA9IHNldHRpbmdzLmNsYXNzZXMuYWN0aXZlLFxuXHRcdFx0YWN0aXZlRmlsdGVyID0gdGFiSW5kZXggPyAnW2RhdGEtdGFiPVwiJyArIHRhYkluZGV4ICsgJ1wiXScgOiAnLicgKyBhY3RpdmVDbGFzcyxcblx0XHRcdCRhY3RpdmVUaXRsZSA9IHRoaXMuZWxlbWVudHMuJHRhYlRpdGxlcy5maWx0ZXIoIGFjdGl2ZUZpbHRlciApLFxuXHRcdFx0JGFjdGl2ZUNvbnRlbnQgPSB0aGlzLmVsZW1lbnRzLiR0YWJDb250ZW50cy5maWx0ZXIoIGFjdGl2ZUZpbHRlciApO1xuXG5cdFx0JGFjdGl2ZVRpdGxlLmFkZCggJGFjdGl2ZUNvbnRlbnQgKS5yZW1vdmVDbGFzcyggYWN0aXZlQ2xhc3MgKTtcblxuXHRcdCRhY3RpdmVDb250ZW50WyBzZXR0aW5ncy5oaWRlVGFiRm4gXSgpO1xuXHR9LFxuXG5cdGFjdGl2YXRlVGFiOiBmdW5jdGlvbiggdGFiSW5kZXggKSB7XG5cdFx0dmFyIHNldHRpbmdzID0gdGhpcy5nZXRTZXR0aW5ncygpLFxuXHRcdFx0YWN0aXZlQ2xhc3MgPSBzZXR0aW5ncy5jbGFzc2VzLmFjdGl2ZSxcblx0XHRcdCRyZXF1ZXN0ZWRUaXRsZSA9IHRoaXMuZWxlbWVudHMuJHRhYlRpdGxlcy5maWx0ZXIoICdbZGF0YS10YWI9XCInICsgdGFiSW5kZXggKyAnXCJdJyApLFxuXHRcdFx0JHJlcXVlc3RlZENvbnRlbnQgPSB0aGlzLmVsZW1lbnRzLiR0YWJDb250ZW50cy5maWx0ZXIoICdbZGF0YS10YWI9XCInICsgdGFiSW5kZXggKyAnXCJdJyApO1xuXG5cdFx0JHJlcXVlc3RlZFRpdGxlLmFkZCggJHJlcXVlc3RlZENvbnRlbnQgKS5hZGRDbGFzcyggYWN0aXZlQ2xhc3MgKTtcblxuXHRcdCRyZXF1ZXN0ZWRDb250ZW50WyBzZXR0aW5ncy5zaG93VGFiRm4gXSgpO1xuXHR9LFxuXG5cdGlzQWN0aXZlVGFiOiBmdW5jdGlvbiggdGFiSW5kZXggKSB7XG5cdFx0cmV0dXJuIHRoaXMuZWxlbWVudHMuJHRhYlRpdGxlcy5maWx0ZXIoICdbZGF0YS10YWI9XCInICsgdGFiSW5kZXggKyAnXCJdJyApLmhhc0NsYXNzKCB0aGlzLmdldFNldHRpbmdzKCAnY2xhc3Nlcy5hY3RpdmUnICkgKTtcblx0fSxcblxuXHRiaW5kRXZlbnRzOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHRzZWxmLmVsZW1lbnRzLiR0YWJUaXRsZXMub24oICdmb2N1cycsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdHNlbGYuY2hhbmdlQWN0aXZlVGFiKCBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQudGFiICk7XG5cdFx0fSApO1xuXG5cdFx0aWYgKCBzZWxmLmdldFNldHRpbmdzKCAndG9nZ2xlU2VsZicgKSApIHtcblx0XHRcdHNlbGYuZWxlbWVudHMuJHRhYlRpdGxlcy5vbiggJ21vdXNlZG93bicsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0aWYgKCBqUXVlcnkoIGV2ZW50LmN1cnJlbnRUYXJnZXQgKS5pcyggJzpmb2N1cycgKSApIHtcblx0XHRcdFx0XHRzZWxmLmNoYW5nZUFjdGl2ZVRhYiggZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LnRhYiApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fVxuXHR9LFxuXG5cdG9uSW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0SGFuZGxlck1vZHVsZS5wcm90b3R5cGUub25Jbml0LmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcblxuXHRcdHRoaXMuYWN0aXZhdGVEZWZhdWx0VGFiKCk7XG5cdH0sXG5cblx0b25FZGl0U2V0dGluZ3NDaGFuZ2U6IGZ1bmN0aW9uKCBwcm9wZXJ0eU5hbWUgKSB7XG5cdFx0aWYgKCAnYWN0aXZlSXRlbUluZGV4JyA9PT0gcHJvcGVydHlOYW1lICkge1xuXHRcdFx0dGhpcy5hY3RpdmF0ZURlZmF1bHRUYWIoKTtcblx0XHR9XG5cdH0sXG5cblx0Y2hhbmdlQWN0aXZlVGFiOiBmdW5jdGlvbiggdGFiSW5kZXggKSB7XG5cdFx0dmFyIGlzQWN0aXZlVGFiID0gdGhpcy5pc0FjdGl2ZVRhYiggdGFiSW5kZXggKSxcblx0XHRcdHNldHRpbmdzID0gdGhpcy5nZXRTZXR0aW5ncygpO1xuXG5cdFx0aWYgKCAoIHNldHRpbmdzLnRvZ2dsZVNlbGYgfHwgISBpc0FjdGl2ZVRhYiApICYmIHNldHRpbmdzLmhpZGVQcmV2aW91cyApIHtcblx0XHRcdHRoaXMuZGVhY3RpdmF0ZUFjdGl2ZVRhYigpO1xuXHRcdH1cblxuXHRcdGlmICggISBzZXR0aW5ncy5oaWRlUHJldmlvdXMgJiYgaXNBY3RpdmVUYWIgKSB7XG5cdFx0XHR0aGlzLmRlYWN0aXZhdGVBY3RpdmVUYWIoIHRhYkluZGV4ICk7XG5cdFx0fVxuXG5cdFx0aWYgKCAhIGlzQWN0aXZlVGFiICkge1xuXHRcdFx0dGhpcy5hY3RpdmF0ZVRhYiggdGFiSW5kZXggKTtcblx0XHR9XG5cdH1cbn0gKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oICRzY29wZSwgJCApIHtcblxuXHR2YXIgJGNvdW50ZXIgPSAkc2NvcGUuZmluZCggJy5xYXphbmEtY291bnRlci1udW1iZXInICk7XG5cdHZhciBhbmltYXRpb24gPSAkY291bnRlci5kYXRhKCdhbmltYXRpb24tdHlwZScpO1xuXG5cdGlmICggYW5pbWF0aW9uID09PSAnbm9uZScgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0aWYgKCAnY291bnQnID09PSBhbmltYXRpb24gKXtcblx0XHR2YXIgb2RvbWV0ZXIgPSBuZXcgT2RvbWV0ZXIoe2VsOiAkY291bnRlclswXSwgYW5pbWF0aW9uOiAnY291bnQnIH0gKTtcblx0fSBlbHNlIHtcblx0XHR2YXIgb2RvbWV0ZXIgPSBuZXcgT2RvbWV0ZXIoeyBlbDogJGNvdW50ZXJbMF0gfSk7XG5cdH1cblxuXHRxYXphbmFGcm9udGVuZC53YXlwb2ludCggJHNjb3BlLmZpbmQoICcucWF6YW5hLWNvdW50ZXItbnVtYmVyJyApLCBmdW5jdGlvbigpIHtcblx0XHRvZG9tZXRlci51cGRhdGUoICQodGhpcykuZGF0YSgndG8tdmFsdWUnKSApO1xuXHR9LCB7IG9mZnNldDogJzkwJScgfSApO1xuXG59O1xuIiwidmFyIEhhbmRsZXJNb2R1bGUgPSByZXF1aXJlKCdxYXphbmEtZnJvbnRlbmQvaGFuZGxlci1tb2R1bGUnKSxcblx0R2xvYmFsSGFuZGxlcjtcblxuR2xvYmFsSGFuZGxlciA9IEhhbmRsZXJNb2R1bGUuZXh0ZW5kKHtcblx0Z2V0RWxlbWVudE5hbWU6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gJ2dsb2JhbCc7XG5cdH0sXG5cdGFuaW1hdGU6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0XHQkZWxlbWVudCA9IHRoaXMuJGVsZW1lbnQsXG5cdFx0XHRhbmltYXRpb24gPSB0aGlzLmdldEFuaW1hdGlvbigpLFxuXHRcdFx0ZWxlbWVudFNldHRpbmdzID0gdGhpcy5nZXRFbGVtZW50U2V0dGluZ3MoKSxcblx0XHRcdGFuaW1hdGlvbkRlbGF5ID0gZWxlbWVudFNldHRpbmdzLl9hbmltYXRpb25fZGVsYXkgfHwgZWxlbWVudFNldHRpbmdzLmFuaW1hdGlvbl9kZWxheSB8fCAwO1xuXG5cdFx0JGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2FuaW1hdGVkJykucmVtb3ZlQ2xhc3Moc2VsZi5wcmV2QW5pbWF0aW9uKTtcblx0XHRcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdHNlbGYucHJldkFuaW1hdGlvbiA9IGFuaW1hdGlvbjtcblx0XHRcdCRlbGVtZW50LmFkZENsYXNzKGFuaW1hdGlvbikuYWRkQ2xhc3MoJ2FuaW1hdGVkJyk7XG5cdFx0fSwgYW5pbWF0aW9uRGVsYXkpO1xuXHR9LFxuXHRnZXRBbmltYXRpb246IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgZWxlbWVudFNldHRpbmdzID0gdGhpcy5nZXRFbGVtZW50U2V0dGluZ3MoKTtcblxuXHRcdHJldHVybiBlbGVtZW50U2V0dGluZ3MuX2FuaW1hdGlvbl9hbmltYXRlZCAmJiBlbGVtZW50U2V0dGluZ3MuX2FuaW1hdGlvbl9pbjtcblx0fSxcblx0b25Jbml0OiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0SGFuZGxlck1vZHVsZS5wcm90b3R5cGUub25Jbml0LmFwcGx5KHNlbGYsIGFyZ3VtZW50cyk7XG5cblx0XHRpZiAoICEgc2VsZi5nZXRBbmltYXRpb24oKSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRcblx0fSxcblx0b25FbGVtZW50Q2hhbmdlOiBmdW5jdGlvbiggcHJvcGVydHlOYW1lICkge1xuXHRcdGlmICggL15fP2FuaW1hdGlvbi8udGVzdCggcHJvcGVydHlOYW1lICkgKSB7XG5cdFx0XHR0aGlzLmFuaW1hdGUoKTtcblx0XHR9XG5cdH1cbn0gKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggJHNjb3BlICkge1xuXHRuZXcgR2xvYmFsSGFuZGxlciggeyAkZWxlbWVudDogJHNjb3BlIH0gKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCAkc2NvcGUsICQgKSB7XHJcblxyXG4gICAgdmFyICRjaGFydCA9ICRzY29wZS5maW5kKCcucWF6YW5hLXBpZWNoYXJ0Jyk7XHJcbiAgICB2YXIgJHBpZWNoYXJ0X3Byb2dyZXNzID0gJGNoYXJ0LmZpbmQoJy5xYXphbmEtcGllY2hhcnQtbnVtYmVyLWNvdW50Jyk7XHJcblxyXG4gICAgdmFyIGFuaW1hdGlvbiA9IHtcclxuICAgICAgICBkdXJhdGlvbjogJGNoYXJ0LmRhdGEoJ2R1cmF0aW9uJylcclxuICAgIH07XHJcblxyXG4gICAgaWYgKCAkY2hhcnQuY2xvc2VzdCgnLnFhemFuYS1lbGVtZW50JykuaGFzQ2xhc3MoJ3FhemFuYS1waWVjaGFydC1hbmltYXRpb24tdHlwZS1ub25lJykgKSB7XHJcbiAgICAgICAgYW5pbWF0aW9uID0ge1xyXG4gICAgICAgICAgICBkdXJhdGlvbjogMFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCBmYWxzZSA9PSBhbmltYXRpb24gKXtcclxuICAgICAgICAkcGllY2hhcnRfcHJvZ3Jlc3MuaHRtbCgkcGllY2hhcnRfcHJvZ3Jlc3MuZGF0YSgndmFsdWUnKSApO1xyXG4gICAgICAgICRjaGFydC5hZGRDbGFzcygnYW5pbWF0ZWQnKTtcclxuICAgIH1cclxuXHJcbiAgICBxYXphbmFGcm9udGVuZC53YXlwb2ludCggJGNoYXJ0LCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgaWYgKCAhICRjaGFydC5oYXNDbGFzcygnYW5pbWF0ZWQnKSApIHtcclxuXHJcbiAgICAgICAgICAgICRjaGFydC5jaXJjbGVQcm9ncmVzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRBbmdsZTogLU1hdGguUEkgLyA0ICogMixcclxuICAgICAgICAgICAgICAgICAgICBlbXB0eUZpbGw6ICRjaGFydC5kYXRhKCdlbXB0eWZpbGwnKSxcclxuICAgICAgICAgICAgICAgICAgICBhbmltYXRpb246IGFuaW1hdGlvblxyXG4gICAgICAgICAgICB9KS5vbignY2lyY2xlLWFuaW1hdGlvbi1wcm9ncmVzcycsIGZ1bmN0aW9uIChldmVudCwgcHJvZ3Jlc3MpIHtcclxuICAgICAgICAgICAgICAgICRwaWVjaGFydF9wcm9ncmVzcy5odG1sKCBwYXJzZUludCggKCAkcGllY2hhcnRfcHJvZ3Jlc3MuZGF0YSgndmFsdWUnKSApICogcHJvZ3Jlc3MgKSApO1xyXG4gICAgICAgICAgICB9KS5vbignY2lyY2xlLWFuaW1hdGlvbi1lbmQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICRjaGFydC5hZGRDbGFzcygnYW5pbWF0ZWQnKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LCB7IG9mZnNldDogJzkwJScgfSApO1xyXG5cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggJHNjb3BlLCAkICkge1xuXHRxYXphbmFGcm9udGVuZC53YXlwb2ludCggJHNjb3BlLmZpbmQoICcucWF6YW5hLXByb2dyZXNzLWJhcicgKSwgZnVuY3Rpb24oKSB7XG5cdFx0dmFyICRwcm9ncmVzc2JhciA9ICQoIHRoaXMgKTtcblxuXHRcdCRwcm9ncmVzc2Jhci5jc3MoICd3aWR0aCcsICRwcm9ncmVzc2Jhci5kYXRhKCAnbWF4JyApICsgJyUnICk7XG5cdH0sIHsgb2Zmc2V0OiAnOTAlJyB9ICk7XG59O1xuIiwidmFyIEJhY2tncm91bmRWaWRlbyA9IHJlcXVpcmUoICdxYXphbmEtZnJvbnRlbmQvaGFuZGxlcnMvYmFja2dyb3VuZC12aWRlbycgKTtcblxudmFyIEhhbmRsZXJNb2R1bGUgPSByZXF1aXJlKCAncWF6YW5hLWZyb250ZW5kL2hhbmRsZXItbW9kdWxlJyApO1xuXG52YXIgU3RyZXRjaGVkU2VjdGlvbiA9IEhhbmRsZXJNb2R1bGUuZXh0ZW5kKCB7XG5cblx0YmluZEV2ZW50czogZnVuY3Rpb24oKSB7XG5cdFx0cWF6YW5hRnJvbnRlbmQuYWRkTGlzdGVuZXJPbmNlKCB0aGlzLiRlbGVtZW50LmRhdGEoICdtb2RlbC1jaWQnICksICdyZXNpemUnLCB0aGlzLnN0cmV0Y2hTZWN0aW9uICk7XG5cdH0sXG5cblx0c3RyZXRjaFNlY3Rpb246IGZ1bmN0aW9uKCkge1xuXHRcdC8vIENsZWFyIGFueSBwcmV2aW91c2x5IGV4aXN0aW5nIGNzcyBhc3NvY2lhdGVkIHdpdGggdGhpcyBzY3JpcHRcblx0XHR2YXIgZGlyZWN0aW9uID0gcWF6YW5hRnJvbnRlbmQuY29uZmlnLmlzX3J0bCA/ICdyaWdodCcgOiAnbGVmdCcsXG5cdFx0XHRyZXNldENzcyA9IHt9LFxuXHRcdFx0aXNTdHJldGNoZWQgPSB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCAncWF6YW5hLXNlY3Rpb24tc3RyZXRjaGVkJyApO1xuXG5cdFx0aWYgKCBxYXphbmFGcm9udGVuZC5pc0VkaXRNb2RlKCkgfHwgaXNTdHJldGNoZWQgKSB7XG5cdFx0XHRyZXNldENzcy53aWR0aCA9ICdhdXRvJztcblxuXHRcdFx0cmVzZXRDc3NbIGRpcmVjdGlvbiBdID0gMDtcblxuXHRcdFx0dGhpcy4kZWxlbWVudC5jc3MoIHJlc2V0Q3NzICk7XG5cdFx0fVxuXG5cdFx0aWYgKCAhIGlzU3RyZXRjaGVkICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZhciAkc2VjdGlvbkNvbnRhaW5lcixcblx0XHRcdGhhc1NwZWNpYWxDb250YWluZXIgPSBmYWxzZTtcblxuXHRcdHRyeSB7XG5cdFx0XHQkc2VjdGlvbkNvbnRhaW5lciA9IGpRdWVyeSggcWF6YW5hRnJvbnRlbmQuZ2V0R2VuZXJhbFNldHRpbmdzKCAncWF6YW5hX3N0cmV0Y2hlZF9zZWN0aW9uX2NvbnRhaW5lcicgKSApO1xuXG5cdFx0XHRpZiAoICRzZWN0aW9uQ29udGFpbmVyLmxlbmd0aCApIHtcblx0XHRcdFx0aGFzU3BlY2lhbENvbnRhaW5lciA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fSBjYXRjaCAoIGUgKSB7fVxuXG5cdFx0aWYgKCAhIGhhc1NwZWNpYWxDb250YWluZXIgKSB7XG5cdFx0XHQkc2VjdGlvbkNvbnRhaW5lciA9IHFhemFuYUZyb250ZW5kLmdldEVsZW1lbnRzKCAnJHdpbmRvdycgKTtcblx0XHR9XG5cblx0XHR2YXIgY29udGFpbmVyV2lkdGggPSAkc2VjdGlvbkNvbnRhaW5lci5vdXRlcldpZHRoKCksXG5cdFx0XHRzZWN0aW9uV2lkdGggPSB0aGlzLiRlbGVtZW50Lm91dGVyV2lkdGgoKSxcblx0XHRcdHNlY3Rpb25PZmZzZXQgPSB0aGlzLiRlbGVtZW50Lm9mZnNldCgpLmxlZnQsXG5cdFx0XHRjb3JyZWN0T2Zmc2V0ID0gc2VjdGlvbk9mZnNldDtcblxuXHRcdGlmICggaGFzU3BlY2lhbENvbnRhaW5lciApIHtcblx0XHRcdHZhciBjb250YWluZXJPZmZzZXQgPSAkc2VjdGlvbkNvbnRhaW5lci5vZmZzZXQoKS5sZWZ0O1xuXG5cdFx0XHRpZiAoIHNlY3Rpb25PZmZzZXQgPiBjb250YWluZXJPZmZzZXQgKSB7XG5cdFx0XHRcdGNvcnJlY3RPZmZzZXQgPSBzZWN0aW9uT2Zmc2V0IC0gY29udGFpbmVyT2Zmc2V0O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29ycmVjdE9mZnNldCA9IDA7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCBxYXphbmFGcm9udGVuZC5jb25maWcuaXNfcnRsICkge1xuXHRcdFx0Y29ycmVjdE9mZnNldCA9IGNvbnRhaW5lcldpZHRoIC0gKCBzZWN0aW9uV2lkdGggKyBjb3JyZWN0T2Zmc2V0ICk7XG5cdFx0fVxuXG5cdFx0cmVzZXRDc3Mud2lkdGggPSBjb250YWluZXJXaWR0aCArICdweCc7XG5cblx0XHRyZXNldENzc1sgZGlyZWN0aW9uIF0gPSAtY29ycmVjdE9mZnNldCArICdweCc7XG5cblx0XHR0aGlzLiRlbGVtZW50LmNzcyggcmVzZXRDc3MgKTtcblx0fSxcblxuXHRvbkluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdEhhbmRsZXJNb2R1bGUucHJvdG90eXBlLm9uSW5pdC5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG5cblx0XHR0aGlzLnN0cmV0Y2hTZWN0aW9uKCk7XG5cdH0sXG5cblx0b25HZW5lcmFsU2V0dGluZ3NDaGFuZ2U6IGZ1bmN0aW9uKCBjaGFuZ2VkICkge1xuXHRcdGlmICggJ3FhemFuYV9zdHJldGNoZWRfc2VjdGlvbl9jb250YWluZXInIGluIGNoYW5nZWQgKSB7XG5cdFx0XHR0aGlzLnN0cmV0Y2hTZWN0aW9uKCk7XG5cdFx0fVxuXHR9XG59ICk7XG5cbnZhciBTVkdTaGFwZXMgPSBIYW5kbGVyTW9kdWxlLmV4dGVuZCgge1xuXHRcblx0Z2V0RGVmYXVsdFNldHRpbmdzOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c2VsZWN0b3JzOiB7XG5cdFx0XHRcdGNvbnRhaW5lcjogJz4gLnFhemFuYS1zaGFwZS0lcydcblx0XHRcdH0sXG5cdFx0XHRzdmdVUkw6IHFhemFuYUZyb250ZW5kLmNvbmZpZy51cmxzLmFzc2V0cyArICdzaGFwZXMvJ1xuXHRcdH07XG5cdH0sXG5cblx0Z2V0RGVmYXVsdEVsZW1lbnRzOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgZWxlbWVudHMgPSB7fSxcblx0XHRcdHNlbGVjdG9ycyA9IHRoaXMuZ2V0U2V0dGluZ3MoICdzZWxlY3RvcnMnICk7XG5cblx0XHRlbGVtZW50cy4kdG9wQ29udGFpbmVyID0gdGhpcy4kZWxlbWVudC5maW5kKCBzZWxlY3RvcnMuY29udGFpbmVyLnJlcGxhY2UoICclcycsICd0b3AnICkgKTtcblxuXHRcdGVsZW1lbnRzLiRib3R0b21Db250YWluZXIgPSB0aGlzLiRlbGVtZW50LmZpbmQoIHNlbGVjdG9ycy5jb250YWluZXIucmVwbGFjZSggJyVzJywgJ2JvdHRvbScgKSApO1xuXG5cdFx0cmV0dXJuIGVsZW1lbnRzO1xuXHR9LFxuXG5cdGJ1aWxkU1ZHOiBmdW5jdGlvbiggc2lkZSApIHtcblx0XHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0XHRiYXNlU2V0dGluZ0tleSA9ICdzaGFwZV9kaXZpZGVyXycgKyBzaWRlLFxuXHRcdFx0c2hhcGVUeXBlID0gc2VsZi5nZXRFbGVtZW50U2V0dGluZ3MoIGJhc2VTZXR0aW5nS2V5ICksXG5cdFx0XHQkc3ZnQ29udGFpbmVyID0gdGhpcy5lbGVtZW50c1sgJyQnICsgc2lkZSArICdDb250YWluZXInIF07XG5cblx0XHQkc3ZnQ29udGFpbmVyLmVtcHR5KCkuYXR0ciggJ2RhdGEtc2hhcGUnLCBzaGFwZVR5cGUgKTtcblxuXHRcdGlmICggISBzaGFwZVR5cGUgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIGZpbGVOYW1lID0gc2hhcGVUeXBlO1xuXG5cdFx0aWYgKCBzZWxmLmdldEVsZW1lbnRTZXR0aW5ncyggYmFzZVNldHRpbmdLZXkgKyAnX25lZ2F0aXZlJyApICkge1xuXHRcdFx0ZmlsZU5hbWUgKz0gJy1uZWdhdGl2ZSc7XG5cdFx0fVxuXG5cdFx0dmFyIHN2Z1VSTCA9IHNlbGYuZ2V0U2V0dGluZ3MoICdzdmdVUkwnICkgKyBmaWxlTmFtZSArICcuc3ZnJztcblxuXHRcdGpRdWVyeS5nZXQoIHN2Z1VSTCwgZnVuY3Rpb24oIGRhdGEgKSB7XG5cdFx0XHQkc3ZnQ29udGFpbmVyLmFwcGVuZCggZGF0YS5jaGlsZE5vZGVzWzBdICk7XG5cdFx0fSApO1xuXG5cdFx0dGhpcy5zZXROZWdhdGl2ZSggc2lkZSApO1xuXHR9LFxuXG5cdHNldE5lZ2F0aXZlOiBmdW5jdGlvbiggc2lkZSApIHtcblx0XHR0aGlzLmVsZW1lbnRzWyAnJCcgKyBzaWRlICsgJ0NvbnRhaW5lcicgXS5hdHRyKCAnZGF0YS1uZWdhdGl2ZScsICEhIHRoaXMuZ2V0RWxlbWVudFNldHRpbmdzKCAnc2hhcGVfZGl2aWRlcl8nICsgc2lkZSArICdfbmVnYXRpdmUnICkgKTtcblx0fSxcblxuXHRvbkluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdEhhbmRsZXJNb2R1bGUucHJvdG90eXBlLm9uSW5pdC5hcHBseSggc2VsZiwgYXJndW1lbnRzICk7XG5cblx0XHRbICd0b3AnLCAnYm90dG9tJyBdLmZvckVhY2goIGZ1bmN0aW9uKCBzaWRlICkge1xuXHRcdFx0aWYgKCBzZWxmLmdldEVsZW1lbnRTZXR0aW5ncyggJ3NoYXBlX2RpdmlkZXJfJyArIHNpZGUgKSApIHtcblx0XHRcdFx0c2VsZi5idWlsZFNWRyggc2lkZSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fSxcblxuXHRvbkVsZW1lbnRDaGFuZ2U6IGZ1bmN0aW9uKCBwcm9wZXJ0eU5hbWUgKSB7XG5cdFx0dmFyIHNoYXBlQ2hhbmdlID0gcHJvcGVydHlOYW1lLm1hdGNoKCAvXnNoYXBlX2RpdmlkZXJfKHRvcHxib3R0b20pJC8gKTtcblxuXHRcdGlmICggc2hhcGVDaGFuZ2UgKSB7XG5cdFx0XHR0aGlzLmJ1aWxkU1ZHKCBzaGFwZUNoYW5nZVsxXSApO1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIG5lZ2F0aXZlQ2hhbmdlID0gcHJvcGVydHlOYW1lLm1hdGNoKCAvXnNoYXBlX2RpdmlkZXJfKHRvcHxib3R0b20pX25lZ2F0aXZlJC8gKTtcblxuXHRcdGlmICggbmVnYXRpdmVDaGFuZ2UgKSB7XG5cdFx0XHR0aGlzLmJ1aWxkU1ZHKCBuZWdhdGl2ZUNoYW5nZVsxXSApO1xuXG5cdFx0XHR0aGlzLnNldE5lZ2F0aXZlKCBuZWdhdGl2ZUNoYW5nZVsxXSApO1xuXHRcdH1cblx0fVxufSApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCAkc2NvcGUgKSB7XG5cblx0aWYgKCBxYXphbmFGcm9udGVuZC5pc0VkaXRNb2RlKCkgKSB7XG5cdFx0bmV3IFNWR1NoYXBlcyggeyAkZWxlbWVudDogJHNjb3BlIH0gKTtcblxuXHRcdGlmICggJHNjb3BlLmhhc0NsYXNzKCAncWF6YW5hLXNlY3Rpb24tc3RyZXRjaGVkJyApICkge1xuXHRcdFx0bmV3IFN0cmV0Y2hlZFNlY3Rpb24oIHsgJGVsZW1lbnQ6ICRzY29wZSB9ICk7XG5cdFx0fVxuXHR9XG5cblx0bmV3IEJhY2tncm91bmRWaWRlbyggeyAkZWxlbWVudDogJHNjb3BlIH0gKTtcblxufTtcbiIsInZhciBIYW5kbGVyTW9kdWxlID0gcmVxdWlyZSggJ3FhemFuYS1mcm9udGVuZC9oYW5kbGVyLW1vZHVsZScgKSxcblNwYWNlTW9kdWxlO1xuXG5TcGFjZU1vZHVsZSA9IEhhbmRsZXJNb2R1bGUuZXh0ZW5kKCB7XG5cblx0b25FbGVtZW50Q2hhbmdlOiBmdW5jdGlvbiggcHJvcGVydHlOYW1lICkge1xuICAgICAgICBpZiAoICEgcWF6YW5hRnJvbnRlbmQuaXNFZGl0TW9kZSgpICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpZiAoICdzcGFjZScgPT09IHByb3BlcnR5TmFtZSApIHtcbiAgICAgICAgICAgIHZhciBzcGFjZSA9IHRoaXMuZ2V0RWxlbWVudFNldHRpbmdzKCAnc3BhY2UnICk7XG5cdFx0XHR0aGlzLiRlbGVtZW50LmZpbmQoJy5xYXphbmEtc3BhY2UtcmVzaXplLXZhbHVlJykuaHRtbCgnU3BhY2luZzogJyArIHNwYWNlLnNpemUgKyBzcGFjZS51bml0KTtcblx0XHRcdHJldHVybjtcblx0XHR9XG4gICAgfSxcblxuICAgIG9uSW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICggISBxYXphbmFGcm9udGVuZC5pc0VkaXRNb2RlKCkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuICAgICAgICB2YXIgc3BhY2UgPSB0aGlzLmdldEVsZW1lbnRTZXR0aW5ncygnc3BhY2UnKTtcbiAgICAgICAgdmFyIHRleHQgPSAnPHNwYW4gY2xhc3M9XCJxYXphbmEtc3BhY2UtcmVzaXplLXZhbHVlXCI+U3BhY2luZzogJyArIHNwYWNlLnNpemUgKyBzcGFjZS51bml0ICsgJzwvc3Bhbj4nO1xuICAgICAgICB0aGlzLiRlbGVtZW50LmZpbmQoJy5xYXphbmEtc3BhY2VyLWlubmVyJykuaHRtbCh0ZXh0KTtcblx0fVxuICAgIFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oICRzY29wZSApIHtcblx0bmV3IFNwYWNlTW9kdWxlKCB7ICRlbGVtZW50OiAkc2NvcGUgfSApO1xufTtcbiIsInZhciBUYWJzTW9kdWxlID0gcmVxdWlyZSggJ3FhemFuYS1mcm9udGVuZC9oYW5kbGVycy9iYXNlLXRhYnMnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oICRzY29wZSApIHtcblx0bmV3IFRhYnNNb2R1bGUoIHtcblx0XHQkZWxlbWVudDogJHNjb3BlLFxuXHRcdHRvZ2dsZVNlbGY6IGZhbHNlXG5cdH0gKTtcbn07XG4iLCJ2YXIgSGFuZGxlck1vZHVsZSA9IHJlcXVpcmUoICdxYXphbmEtZnJvbnRlbmQvaGFuZGxlci1tb2R1bGUnICksXG5cdFRleHRFZGl0b3I7XG5cblRleHRFZGl0b3IgPSBIYW5kbGVyTW9kdWxlLmV4dGVuZCgge1xuXHRkcm9wQ2FwTGV0dGVyOiAnJyxcblxuXHRnZXREZWZhdWx0U2V0dGluZ3M6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRzZWxlY3RvcnM6IHtcblx0XHRcdFx0cGFyYWdyYXBoOiAncDpmaXJzdCdcblx0XHRcdH0sXG5cdFx0XHRjbGFzc2VzOiB7XG5cdFx0XHRcdGRyb3BDYXA6ICdxYXphbmEtZHJvcC1jYXAnLFxuXHRcdFx0XHRkcm9wQ2FwTGV0dGVyOiAncWF6YW5hLWRyb3AtY2FwLWxldHRlcidcblx0XHRcdH1cblx0XHR9O1xuXHR9LFxuXG5cdGdldERlZmF1bHRFbGVtZW50czogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNlbGVjdG9ycyA9IHRoaXMuZ2V0U2V0dGluZ3MoICdzZWxlY3RvcnMnICksXG5cdFx0XHRjbGFzc2VzID0gdGhpcy5nZXRTZXR0aW5ncyggJ2NsYXNzZXMnICksXG5cdFx0XHQkZHJvcENhcCA9IGpRdWVyeSggJzxzcGFuPicsIHsgJ2NsYXNzJzogY2xhc3Nlcy5kcm9wQ2FwIH0gKSxcblx0XHRcdCRkcm9wQ2FwTGV0dGVyID0galF1ZXJ5KCAnPHNwYW4+JywgeyAnY2xhc3MnOiBjbGFzc2VzLmRyb3BDYXBMZXR0ZXIgfSApO1xuXG5cdFx0JGRyb3BDYXAuYXBwZW5kKCAkZHJvcENhcExldHRlciApO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdCRwYXJhZ3JhcGg6IHRoaXMuJGVsZW1lbnQuZmluZCggc2VsZWN0b3JzLnBhcmFncmFwaCApLFxuXHRcdFx0JGRyb3BDYXA6ICRkcm9wQ2FwLFxuXHRcdFx0JGRyb3BDYXBMZXR0ZXI6ICRkcm9wQ2FwTGV0dGVyXG5cdFx0fTtcblx0fSxcblxuXHRnZXRFbGVtZW50TmFtZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICd0ZXh0LWVkaXRvcic7XG5cdH0sXG5cblx0d3JhcERyb3BDYXA6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBpc0Ryb3BDYXBFbmFibGVkID0gdGhpcy5nZXRFbGVtZW50U2V0dGluZ3MoICdkcm9wX2NhcCcgKTtcblxuXHRcdGlmICggISBpc0Ryb3BDYXBFbmFibGVkICkge1xuXHRcdFx0Ly8gSWYgdGhlcmUgaXMgYW4gb2xkIGRyb3AgY2FwIGluc2lkZSB0aGUgcGFyYWdyYXBoXG5cdFx0XHRpZiAoIHRoaXMuZHJvcENhcExldHRlciApIHtcblx0XHRcdFx0dGhpcy5lbGVtZW50cy4kZHJvcENhcC5yZW1vdmUoKTtcblxuXHRcdFx0XHR0aGlzLmVsZW1lbnRzLiRwYXJhZ3JhcGgucHJlcGVuZCggdGhpcy5kcm9wQ2FwTGV0dGVyICk7XG5cblx0XHRcdFx0dGhpcy5kcm9wQ2FwTGV0dGVyID0gJyc7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2YXIgJHBhcmFncmFwaCA9IHRoaXMuZWxlbWVudHMuJHBhcmFncmFwaDtcblxuXHRcdGlmICggISAkcGFyYWdyYXBoLmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2YXJcdHBhcmFncmFwaENvbnRlbnQgPSAkcGFyYWdyYXBoLmh0bWwoKS5yZXBsYWNlKCAvJm5ic3A7L2csICcgJyApLFxuXHRcdFx0Zmlyc3RMZXR0ZXJNYXRjaCA9IHBhcmFncmFwaENvbnRlbnQubWF0Y2goIC9eICooW14gXSA/KS8gKTtcblxuXHRcdGlmICggISBmaXJzdExldHRlck1hdGNoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZhciBmaXJzdExldHRlciA9IGZpcnN0TGV0dGVyTWF0Y2hbMV0sXG5cdFx0XHR0cmltbWVkRmlyc3RMZXR0ZXIgPSBmaXJzdExldHRlci50cmltKCk7XG5cblx0XHQvLyBEb24ndCBhcHBseSBkcm9wIGNhcCB3aGVuIHRoZSBjb250ZW50IHN0YXJ0aW5nIHdpdGggYW4gSFRNTCB0YWdcblx0XHRpZiAoICc8JyA9PT0gdHJpbW1lZEZpcnN0TGV0dGVyICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuZHJvcENhcExldHRlciA9IGZpcnN0TGV0dGVyO1xuXG5cdFx0dGhpcy5lbGVtZW50cy4kZHJvcENhcExldHRlci50ZXh0KCB0cmltbWVkRmlyc3RMZXR0ZXIgKTtcblxuXHRcdHZhciByZXN0b3JlZFBhcmFncmFwaENvbnRlbnQgPSBwYXJhZ3JhcGhDb250ZW50LnNsaWNlKCBmaXJzdExldHRlci5sZW5ndGggKS5yZXBsYWNlKCAvXiAqLywgZnVuY3Rpb24oIG1hdGNoICkge1xuXHRcdFx0cmV0dXJuIG5ldyBBcnJheSggbWF0Y2gubGVuZ3RoICsgMSApLmpvaW4oICcmbmJzcDsnICk7XG5cdFx0fSk7XG5cblx0XHQkcGFyYWdyYXBoLmh0bWwoIHJlc3RvcmVkUGFyYWdyYXBoQ29udGVudCApLnByZXBlbmQoIHRoaXMuZWxlbWVudHMuJGRyb3BDYXAgKTtcblx0fSxcblxuXHRvbkluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdEhhbmRsZXJNb2R1bGUucHJvdG90eXBlLm9uSW5pdC5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG5cblx0XHR0aGlzLndyYXBEcm9wQ2FwKCk7XG5cdH0sXG5cblx0b25FbGVtZW50Q2hhbmdlOiBmdW5jdGlvbiggcHJvcGVydHlOYW1lICkge1xuXHRcdGlmICggJ2Ryb3BfY2FwJyA9PT0gcHJvcGVydHlOYW1lICkge1xuXHRcdFx0dGhpcy53cmFwRHJvcENhcCgpO1xuXHRcdH1cblx0fVxufSApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCAkc2NvcGUgKSB7XG5cdG5ldyBUZXh0RWRpdG9yKCB7ICRlbGVtZW50OiAkc2NvcGUgfSApO1xufTtcbiIsInZhciBUYWJzTW9kdWxlID0gcmVxdWlyZSggJ3FhemFuYS1mcm9udGVuZC9oYW5kbGVycy9iYXNlLXRhYnMnICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oICRzY29wZSApIHtcblx0bmV3IFRhYnNNb2R1bGUoIHtcblx0XHQkZWxlbWVudDogJHNjb3BlLFxuXHRcdHNob3dUYWJGbjogJ3NsaWRlRG93bicsXG5cdFx0aGlkZVRhYkZuOiAnc2xpZGVVcCcsXG5cdFx0aGlkZVByZXZpb3VzOiBmYWxzZSxcblx0XHRhdXRvRXhwYW5kOiAnZWRpdG9yJ1xuXHR9ICk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggJHNjb3BlLCAkICkge1xuXG5cdGlmICggJHNjb3BlLmZpbmQoICcucWF6YW5hLXRvb2x0aXAnICkuaGFzQ2xhc3MoJ3YtLXNob3cnKSApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHQkc2NvcGUubW91c2VlbnRlciggZnVuY3Rpb24oKSB7XG5cdFx0JCggdGhpcyApLmZpbmQoICcucWF6YW5hLXRvb2x0aXAnICkuYWRkQ2xhc3MoJ3YtLXNob3cnKTtcblx0fSkubW91c2VsZWF2ZSggZnVuY3Rpb24oKSB7XG5cdFx0JCggdGhpcyApLmZpbmQoICcucWF6YW5hLXRvb2x0aXAnICkucmVtb3ZlQ2xhc3MoJ3YtLXNob3cnKTtcblx0fSk7XG5cbn07XG4iLCJ2YXIgSGFuZGxlck1vZHVsZSA9IHJlcXVpcmUoICdxYXphbmEtZnJvbnRlbmQvaGFuZGxlci1tb2R1bGUnICksXG5cdFZpZGVvTW9kdWxlO1xuXG5WaWRlb01vZHVsZSA9IEhhbmRsZXJNb2R1bGUuZXh0ZW5kKCB7XG5cdGdldERlZmF1bHRTZXR0aW5nczogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHNlbGVjdG9yczoge1xuXHRcdFx0XHRpbWFnZU92ZXJsYXk6ICcucWF6YW5hLWN1c3RvbS1lbWJlZC1pbWFnZS1vdmVybGF5Jyxcblx0XHRcdFx0dmlkZW9XcmFwcGVyOiAnLnFhemFuYS13cmFwcGVyJyxcblx0XHRcdFx0dmlkZW9GcmFtZTogJ2lmcmFtZSdcblx0XHRcdH1cblx0XHR9O1xuXHR9LFxuXG5cdGdldERlZmF1bHRFbGVtZW50czogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNlbGVjdG9ycyA9IHRoaXMuZ2V0U2V0dGluZ3MoICdzZWxlY3RvcnMnICk7XG5cblx0XHR2YXIgZWxlbWVudHMgPSB7XG5cdFx0XHQkaW1hZ2VPdmVybGF5OiB0aGlzLiRlbGVtZW50LmZpbmQoIHNlbGVjdG9ycy5pbWFnZU92ZXJsYXkgKSxcblx0XHRcdCR2aWRlb1dyYXBwZXI6IHRoaXMuJGVsZW1lbnQuZmluZCggc2VsZWN0b3JzLnZpZGVvV3JhcHBlciApXG5cdFx0fTtcblxuXHRcdGVsZW1lbnRzLiR2aWRlb0ZyYW1lID0gZWxlbWVudHMuJHZpZGVvV3JhcHBlci5maW5kKCBzZWxlY3RvcnMudmlkZW9GcmFtZSApO1xuXG5cdFx0cmV0dXJuIGVsZW1lbnRzO1xuXHR9LFxuXG5cdGdldExpZ2h0Qm94OiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gcWF6YW5hRnJvbnRlbmQudXRpbHMubGlnaHRib3g7XG5cdH0sXG5cblx0aGFuZGxlVmlkZW86IGZ1bmN0aW9uKCkge1xuXHRcdGlmICggISB0aGlzLmdldEVsZW1lbnRTZXR0aW5ncyggJ2xpZ2h0Ym94JyApICkge1xuXHRcdFx0dGhpcy5lbGVtZW50cy4kaW1hZ2VPdmVybGF5LnJlbW92ZSgpO1xuXG5cdFx0XHR0aGlzLnBsYXlWaWRlbygpO1xuXHRcdH1cblx0fSxcblxuXHRwbGF5VmlkZW86IGZ1bmN0aW9uKCkge1xuXHRcdHZhciAkdmlkZW9GcmFtZSA9IHRoaXMuZWxlbWVudHMuJHZpZGVvRnJhbWUsXG5cdFx0XHRuZXdTb3VyY2VVcmwgPSAkdmlkZW9GcmFtZVswXS5zcmMucmVwbGFjZSggJyZhdXRvcGxheT0wJywgJycgKTtcblxuXHRcdCR2aWRlb0ZyYW1lWzBdLnNyYyA9IG5ld1NvdXJjZVVybCArICcmYXV0b3BsYXk9MSc7XG5cdH0sXG5cblx0YW5pbWF0ZVZpZGVvOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmdldExpZ2h0Qm94KCkuc2V0RW50cmFuY2VBbmltYXRpb24oIHRoaXMuZ2V0RWxlbWVudFNldHRpbmdzKCAnbGlnaHRib3hfY29udGVudF9hbmltYXRpb24nICkgKTtcblx0fSxcblxuXHRoYW5kbGVBc3BlY3RSYXRpbzogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5nZXRMaWdodEJveCgpLnNldFZpZGVvQXNwZWN0UmF0aW8oIHRoaXMuZ2V0RWxlbWVudFNldHRpbmdzKCAnYXNwZWN0X3JhdGlvJyApICk7XG5cdH0sXG5cblx0YmluZEV2ZW50czogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5lbGVtZW50cy4kaW1hZ2VPdmVybGF5Lm9uKCAnY2xpY2snLCB0aGlzLmhhbmRsZVZpZGVvICk7XG5cdH0sXG5cblx0b25FbGVtZW50Q2hhbmdlOiBmdW5jdGlvbiggcHJvcGVydHlOYW1lICkge1xuXHRcdGlmICggJ2xpZ2h0Ym94X2NvbnRlbnRfYW5pbWF0aW9uJyA9PT0gcHJvcGVydHlOYW1lICkge1xuXHRcdFx0dGhpcy5hbmltYXRlVmlkZW8oKTtcblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZhciBpc0xpZ2h0Qm94RW5hYmxlZCA9IHRoaXMuZ2V0RWxlbWVudFNldHRpbmdzKCAnbGlnaHRib3gnICk7XG5cblx0XHRpZiAoICdsaWdodGJveCcgPT09IHByb3BlcnR5TmFtZSAmJiAhIGlzTGlnaHRCb3hFbmFibGVkICkge1xuXHRcdFx0dGhpcy5nZXRMaWdodEJveCgpLmdldE1vZGFsKCkuaGlkZSgpO1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKCAnYXNwZWN0X3JhdGlvJyA9PT0gcHJvcGVydHlOYW1lICYmIGlzTGlnaHRCb3hFbmFibGVkICkge1xuXHRcdFx0dGhpcy5oYW5kbGVBc3BlY3RSYXRpbygpO1xuXHRcdH1cblx0fVxufSApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCAkc2NvcGUgKSB7XG5cdG5ldyBWaWRlb01vZHVsZSggeyAkZWxlbWVudDogJHNjb3BlIH0gKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCAkc2NvcGUsICQgKSB7XG5cdGlmICggISBxYXphbmFGcm9udGVuZC5pc0VkaXRNb2RlKCkgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0aWYgKCAkc2NvcGUuaGFzQ2xhc3MoICdxYXphbmEtd2lkZ2V0LWVkaXQtZGlzYWJsZWQnICkgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0JHNjb3BlLmZpbmQoICcucWF6YW5hLWVsZW1lbnQnICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0cWF6YW5hRnJvbnRlbmQuZWxlbWVudHNIYW5kbGVyLnJ1blJlYWR5VHJpZ2dlciggJCggdGhpcyApICk7XG5cdH0gKTtcbn07XG4iLCJ2YXIgVmlld01vZHVsZSA9IHJlcXVpcmUoICcuLi8uLi91dGlscy92aWV3LW1vZHVsZScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3TW9kdWxlLmV4dGVuZCgge1xuXHRnZXREZWZhdWx0U2V0dGluZ3M6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRlbGVtZW50OiBudWxsLFxuXHRcdFx0ZGlyZWN0aW9uOiBxYXphbmFGcm9udGVuZC5jb25maWcuaXNfcnRsID8gJ3JpZ2h0JyA6ICdsZWZ0Jyxcblx0XHRcdHNlbGVjdG9yczoge1xuXHRcdFx0XHRjb250YWluZXI6IHdpbmRvd1xuXHRcdFx0fVxuXHRcdH07XG5cdH0sXG5cblx0Z2V0RGVmYXVsdEVsZW1lbnRzOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0JGVsZW1lbnQ6IGpRdWVyeSggdGhpcy5nZXRTZXR0aW5ncyggJ2VsZW1lbnQnICkgKVxuXHRcdH07XG5cdH0sXG5cblx0c3RyZXRjaDogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGNvbnRhaW5lclNlbGVjdG9yID0gdGhpcy5nZXRTZXR0aW5ncyggJ3NlbGVjdG9ycy5jb250YWluZXInICksXG5cdFx0XHQkZWxlbWVudCA9IHRoaXMuZWxlbWVudHMuJGVsZW1lbnQsXG5cdFx0XHQkY29udGFpbmVyID0galF1ZXJ5KCBjb250YWluZXJTZWxlY3RvciApLFxuXHRcdFx0aXNTcGVjaWFsQ29udGFpbmVyID0gd2luZG93ICE9PSAkY29udGFpbmVyWzBdO1xuXG5cdFx0dGhpcy5yZXNldCgpO1xuXG5cdFx0dmFyIGNvbnRhaW5lcldpZHRoID0gJGNvbnRhaW5lci5vdXRlcldpZHRoKCksXG5cdFx0XHRlbGVtZW50V2lkdGggPSAkZWxlbWVudC5vdXRlcldpZHRoKCksXG5cdFx0XHRlbGVtZW50T2Zmc2V0ID0gJGVsZW1lbnQub2Zmc2V0KCkubGVmdCxcblx0XHRcdGNvcnJlY3RPZmZzZXQgPSBlbGVtZW50T2Zmc2V0O1xuXG5cdFx0aWYgKCBpc1NwZWNpYWxDb250YWluZXIgKSB7XG5cdFx0XHR2YXIgY29udGFpbmVyT2Zmc2V0ID0gJGNvbnRhaW5lci5vZmZzZXQoKS5sZWZ0O1xuXG5cdFx0XHRpZiAoIGVsZW1lbnRPZmZzZXQgPiBjb250YWluZXJPZmZzZXQgKSB7XG5cdFx0XHRcdGNvcnJlY3RPZmZzZXQgPSBlbGVtZW50T2Zmc2V0IC0gY29udGFpbmVyT2Zmc2V0O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29ycmVjdE9mZnNldCA9IDA7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCBxYXphbmFGcm9udGVuZC5jb25maWcuaXNfcnRsICkge1xuXHRcdFx0Y29ycmVjdE9mZnNldCA9IGNvbnRhaW5lcldpZHRoIC0gKCBlbGVtZW50V2lkdGggKyBjb3JyZWN0T2Zmc2V0ICk7XG5cdFx0fVxuXG5cdFx0dmFyIGNzcyA9IHt9O1xuXG5cdFx0Y3NzLndpZHRoID0gY29udGFpbmVyV2lkdGggKyAncHgnO1xuXG5cdFx0Y3NzWyB0aGlzLmdldFNldHRpbmdzKCAnZGlyZWN0aW9uJyApIF0gPSAtY29ycmVjdE9mZnNldCArICdweCc7XG5cblx0XHQkZWxlbWVudC5jc3MoIGNzcyApO1xuXHR9LFxuXG5cdHJlc2V0OiBmdW5jdGlvbigpIHtcblx0XHR2YXIgY3NzID0ge307XG5cblx0XHRjc3Mud2lkdGggPSAnYXV0byc7XG5cblx0XHRjc3NbIHRoaXMuZ2V0U2V0dGluZ3MoICdkaXJlY3Rpb24nICkgXSA9IDA7XG5cblx0XHR0aGlzLmVsZW1lbnRzLiRlbGVtZW50LmNzcyggY3NzICk7XG5cdH1cbn0gKTtcbiIsInZhciBWaWV3TW9kdWxlID0gcmVxdWlyZSggJy4uLy4uL3V0aWxzL3ZpZXctbW9kdWxlJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdNb2R1bGUuZXh0ZW5kKCB7XG5cdGdldERlZmF1bHRTZXR0aW5nczogZnVuY3Rpb24oKSB7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0c2Nyb2xsRHVyYXRpb246IDUwMCxcblx0XHRcdHNlbGVjdG9yczoge1xuXHRcdFx0XHRsaW5rczogJ2FbaHJlZio9XCIjXCJdJyxcblx0XHRcdFx0dGFyZ2V0czogJy5xYXphbmEtZWxlbWVudCwgLnFhemFuYS1tZW51LWFuY2hvcicsXG5cdFx0XHRcdHNjcm9sbGFibGU6ICdodG1sLCBib2R5Jyxcblx0XHRcdFx0d3BBZG1pbkJhcjogJyN3cGFkbWluYmFyJ1xuXHRcdFx0fVxuXHRcdH07XG5cdH0sXG5cblx0Z2V0RGVmYXVsdEVsZW1lbnRzOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgJCA9IGpRdWVyeSxcblx0XHRcdHNlbGVjdG9ycyA9IHRoaXMuZ2V0U2V0dGluZ3MoICdzZWxlY3RvcnMnICk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0JHNjcm9sbGFibGU6ICQoIHNlbGVjdG9ycy5zY3JvbGxhYmxlICksXG5cdFx0XHQkd3BBZG1pbkJhcjogJCggc2VsZWN0b3JzLndwQWRtaW5CYXIgKVxuXHRcdH07XG5cdH0sXG5cblx0YmluZEV2ZW50czogZnVuY3Rpb24oKSB7XG5cdFx0cWF6YW5hRnJvbnRlbmQuZ2V0RWxlbWVudHMoICckZG9jdW1lbnQnICkub24oICdjbGljaycsIHRoaXMuZ2V0U2V0dGluZ3MoICdzZWxlY3RvcnMubGlua3MnICksIHRoaXMuaGFuZGxlQW5jaG9yTGlua3MgKTtcblx0fSxcblxuXHRoYW5kbGVBbmNob3JMaW5rczogZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdHZhciBjbGlja2VkTGluayA9IGV2ZW50LmN1cnJlbnRUYXJnZXQsXG5cdFx0XHRpc1NhbWVQYXRobmFtZSA9ICggbG9jYXRpb24ucGF0aG5hbWUgPT09IGNsaWNrZWRMaW5rLnBhdGhuYW1lICksXG5cdFx0XHRpc1NhbWVIb3N0bmFtZSA9ICggbG9jYXRpb24uaG9zdG5hbWUgPT09IGNsaWNrZWRMaW5rLmhvc3RuYW1lICk7XG5cblx0XHRpZiAoICEgaXNTYW1lSG9zdG5hbWUgfHwgISBpc1NhbWVQYXRobmFtZSB8fCBjbGlja2VkTGluay5oYXNoLmxlbmd0aCA8IDIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyICRhbmNob3IgPSBqUXVlcnkoIGNsaWNrZWRMaW5rLmhhc2ggKS5maWx0ZXIoIHRoaXMuZ2V0U2V0dGluZ3MoICdzZWxlY3RvcnMudGFyZ2V0cycgKSApO1xuXG5cdFx0aWYgKCAhICRhbmNob3IubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZhciBoYXNBZG1pbkJhciA9ICggMSA8PSB0aGlzLmVsZW1lbnRzLiR3cEFkbWluQmFyLmxlbmd0aCApLFxuXHRcdFx0c2Nyb2xsVG9wID0gJGFuY2hvci5vZmZzZXQoKS50b3A7XG5cblx0XHRpZiAoIGhhc0FkbWluQmFyICkge1xuXHRcdFx0c2Nyb2xsVG9wIC09IHRoaXMuZWxlbWVudHMuJHdwQWRtaW5CYXIuaGVpZ2h0KCk7XG5cdFx0fVxuXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdHNjcm9sbFRvcCA9IHFhemFuYUZyb250ZW5kLmhvb2tzLmFwcGx5RmlsdGVycyggJ2Zyb250ZW5kL2hhbmRsZXJzL21lbnVfYW5jaG9yL3Njcm9sbF90b3BfZGlzdGFuY2UnLCBzY3JvbGxUb3AgKTtcblxuXHRcdHRoaXMuZWxlbWVudHMuJHNjcm9sbGFibGUuYW5pbWF0ZSgge1xuXHRcdFx0c2Nyb2xsVG9wOiBzY3JvbGxUb3Bcblx0XHR9LCB0aGlzLmdldFNldHRpbmdzKCAnc2Nyb2xsRHVyYXRpb24nICksICdsaW5lYXInICk7XG5cdH0sXG5cblx0b25Jbml0OiBmdW5jdGlvbigpIHtcblx0XHRWaWV3TW9kdWxlLnByb3RvdHlwZS5vbkluaXQuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuXG5cdFx0dGhpcy5iaW5kRXZlbnRzKCk7XG5cdH1cbn0gKTtcbiIsInZhciBhZGROYXYgPSBmdW5jdGlvbigkc2NvcGUsICRzbGljaywgc2V0dGluZ3MpIHtcbiAgICBcbiAgICAkc2NvcGUgPSAkc2NvcGUuY2xvc2VzdCgnLnFhemFuYS13aWRnZXQtY29udGFpbmVyJyk7XG5cbiAgICBpZiAoICRzY29wZS5kYXRhKCAnbmF2JyApICkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyICR3cmFwcGVyID0gJHNjb3BlLmZpbmQoXCIucWF6YW5hLWxvb3Atd3JhcHBlclwiKTtcblxuICAgIC8vIHNsaWNrIGhhcyBhbHJlYWR5IGJlZW4gaW5pdGlhbGl6ZWQsIHNvIHdlIGtub3cgdGhlIGRvdHMgYXJlIGFscmVhZHkgaW4gdGhlIERPTTtcbiAgICB2YXIgJGRvdHMgPSAkc2NvcGUuZmluZChcIi5zbGljay1kb3RzXCIpO1xuXG4gICAgaWYgKCAkZG90cy5sZW5ndGggPD0gMCApIHtcbiAgICAgICAgLy8gc2xpY2sgaGFzIGFscmVhZHkgYmVlbiBpbml0aWFsaXplZCwgc28gd2Uga25vdyB0aGUgZG90cyBhcmUgYWxyZWFkeSBpbiB0aGUgRE9NO1xuICAgICAgICAkZG90cyA9ICRzY29wZS5hcHBlbmQoXCI8dWwgY2xhc3M9J3NsaWNrLWRvdHMnIC8+XCIpO1xuICAgIH1cblxuICAgIGlmICggc2V0dGluZ3MuYXJyb3dzICkge1xuXG4gICAgICAgIC8vIHdyYXAgdGhlICRkb3RzIHNvIHdlIGNhbiBwdXQgb3VyIGFycm93cyBuZXh0IHRvIHRoZW07XG4gICAgICAgICR3cmFwcGVyLnBhcmVudCgpLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInNsaWNrLW5hdmlnYXRpb25cXFwiPjwvZGl2PlwiKTtcblxuICAgICAgICAkd3JhcHBlci5wYXJlbnQoKS5maW5kKCcuc2xpY2stbmF2aWdhdGlvbicpXG4gICAgICAgICAgICAucHJlcGVuZChcIjxhIGNsYXNzPVxcXCJwcmV2XFxcIj48aSBjbGFzcz1cXFwicmljb24gcmljb24tc2xpZGVyLWFycm93LWxlZnRcXFwiPjwvaT48L2E+XCIpXG4gICAgICAgICAgICAuYXBwZW5kKFwiPGEgY2xhc3M9XFxcIm5leHRcXFwiPjxpIGNsYXNzPVxcXCJyaWNvbiByaWNvbi1zbGlkZXItYXJyb3ctcmlnaHRcXFwiPjwvaT48L2E+XCIpO1xuXG4gICAgICAgIGlmICggJHNsaWNrLmxlbmd0aCAmJiBzZXR0aW5ncy5zbGlkZXNUb1Njcm9sbCApIHtcbiAgICAgICAgICAgIC8vIGF0dGFjaCBwcmV2aW91cyBidXR0b24gZXZlbnRzO1xuICAgICAgICAgICAgJGRvdHMucGFyZW50KCkuZmluZChcImEucHJldlwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRzbGljay5zbGljaygnc2xpY2tHb1RvJywgJHNsaWNrLnNsaWNrKCdzbGlja0N1cnJlbnRTbGlkZScpIC0gc2V0dGluZ3Muc2xpZGVzVG9TY3JvbGwpO1xuICAgICAgICAgICAgfSkuZW5kKClcbiAgICAgICAgICAgIC8vIGF0dGFjaCBuZXh0IGJ1dHRvbiBldmVudHM7XG4gICAgICAgICAgICAuZmluZChcImEubmV4dFwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRzbGljay5zbGljaygnc2xpY2tHb1RvJywgJHNsaWNrLnNsaWNrKCdzbGlja0N1cnJlbnRTbGlkZScpICsgc2V0dGluZ3Muc2xpZGVzVG9TY3JvbGwpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAkc2NvcGUuYXR0ciggJ2RhdGEtbmF2JywgJ3RydWUnICk7XG59O1xuXG52YXIgQ2Fyb3VzZWwgPSBmdW5jdGlvbiggJGNhcm91c2VsLCBzZXR0aW5ncyApIHtcbiAgICBcbiAgICBpZiAoICRjYXJvdXNlbC5maW5kKFwiZGl2LnNsaWNrLXNsaWRlcy1iaWdnaWVcIikubGVuZ3RoIDwgMSB8fCB0eXBlb2Ygc2V0dGluZ3MgPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIHZhciBlbGVtZW50U2V0dGluZ3MgPSB7fTtcbiAgICB2YXIgc2xpY2tfZ2xvYmFscyA9IHdpbmRvdy5zbGlja19nbG9iYWxzO1xuICAgIFxuICAgIHNldHRpbmdzLmRpcmVjdGlvbiA9IHNldHRpbmdzLmlzX3J0bCA/ICdydGwnIDogJ2x0cic7XG4gICAgc2V0dGluZ3MucnRsID0gKCAncnRsJyA9PT0gc2V0dGluZ3MuZGlyZWN0aW9uICk7XG4gICAgc2V0dGluZ3MuZG90cyA9ICggc2V0dGluZ3MubmF2aWdhdGlvbiA9PT0gJ2RvdHMnIHx8IHNldHRpbmdzLm5hdmlnYXRpb24gPT09ICdib3RoJyApO1xuICAgIHNldHRpbmdzLmFycm93cyA9ICggc2V0dGluZ3MubmF2aWdhdGlvbiA9PT0gJ2Fycm93cycgfHwgc2V0dGluZ3MubmF2aWdhdGlvbiA9PT0gJ2JvdGgnICk7XG4gICAgIFxuICAgIHZhciBpc19zbGlkZXNob3cgPSAnMScgPT09IHBhcnNlRmxvYXQoc2V0dGluZ3Muc2xpZGVzVG9TaG93KTtcblxuICAgIGlmICggISBpc19zbGlkZXNob3cgKSB7XG4gICAgICAgIHNldHRpbmdzLnNsaWRlc1RvU2Nyb2xsID0gcGFyc2VGbG9hdChzZXR0aW5ncy5zbGlkZXNUb1Njcm9sbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgc2V0dGluZ3MuZmFkZSA9ICggJ2ZhZGUnID09PSBzZXR0aW5ncy5lZmZlY3QgKTtcbiAgICB9XG5cbiAgICBpZiAoICEgc2V0dGluZ3Muc2xpZGVzVG9TY3JvbGwgKSB7XG4gICAgICAgIHNldHRpbmdzLnNsaWRlc1RvU2Nyb2xsID0gMTtcbiAgICB9XG5cbiAgICBzZXR0aW5ncy5zbGlkZXNUb1Nob3cgPSBwYXJzZUZsb2F0KHNldHRpbmdzLnNsaWRlc1RvU2hvdyk7XG5cbiAgICBqUXVlcnkuZWFjaCggc2V0dGluZ3MsIGZ1bmN0aW9uKCBjb250cm9sS2V5ICkge1xuXG4gICAgICAgIHZhciB2YWx1ZSA9IHNldHRpbmdzWyBjb250cm9sS2V5IF07XG5cbiAgICAgICAgaWYgKCB2YWx1ZSA9PT0gJ3llcycgKSB7XG4gICAgICAgICAgICBlbGVtZW50U2V0dGluZ3NbIGNvbnRyb2xLZXkgXSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbGVtZW50U2V0dGluZ3NbIGNvbnRyb2xLZXkgXSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICB9ICk7XG5cbiAgICB2YXIgb3B0aW9uc0JpZ2dpZSA9IGpRdWVyeS5leHRlbmQoIHt9LCBzbGlja19nbG9iYWxzLCBlbGVtZW50U2V0dGluZ3MgKSxcbiAgICAgICAgLy8gbGFyZ2Ugc2xpZGVzaG93O1xuICAgICAgICAkYmlnZ2llID0gJGNhcm91c2VsLmZpbmQoXCJkaXYuc2xpY2stc2xpZGVzLWJpZ2dpZVwiKSxcbiAgICAgICAgLy8gY2xhc3MgdG8gaW5kaWNhdGUgdGhlIHNsaWRlc2hvdyBpcyBkaXNhYmxlZCAob24gbW91c2VvdmVyIHNvIHRoZSB1c2VyIGNhbiBzZWUgdGhlIGZ1bGwgcGhvdG8pO1xuICAgICAgICBkaXNhYmxlZENsYXNzID0gXCJpcy1kaXNhYmxlZFwiLFxuXG4gICAgICAgIC8vIHByZXYvbmV4dCBidXR0b24gY2xpY2sgZXZlbnRzIC0gdHJpZ2dlciBhIGNoYW5nZSB0aGUgbGFyZ2Ugc2xpZGVzaG93O1xuICAgICAgICBnb1RvUHJldmlvdXNTbGlkZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gTnVtYmVyKCRiaWdnaWUuc2xpY2soJ3NsaWNrQ3VycmVudFNsaWRlJykpO1xuICAgICAgICAgICAgJGJpZ2dpZS5zbGljaygnc2xpY2tHb1RvJywgKGluZGV4IC0gMSkpO1xuXG4gICAgICAgIH0sXG4gICAgICAgIGdvVG9OZXh0U2xpZGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IE51bWJlcigkYmlnZ2llLnNsaWNrKCdzbGlja0N1cnJlbnRTbGlkZScpKTtcbiAgICAgICAgICAgICRiaWdnaWUuc2xpY2soJ3NsaWNrR29UbycsIChpbmRleCArIDEpKTtcbiAgICAgICAgfTtcblxuICAgIC8vIGFmdGVyIHNsaWNrIGlzIGluaXRpYWxpemVkICh0aGVzZSB3b3VsZG4ndCB3b3JrIHByb3Blcmx5IGlmIGRvbmUgYmVmb3JlIGluaXQpO1xuICAgICRiaWdnaWUub24oJ2luaXQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gYWRkIHRoZSBuYXZpZ2F0aW9uO1xuICAgICAgICBuZXcgYWRkTmF2KCRiaWdnaWUucGFyZW50KCksICRiaWdnaWUsIG9wdGlvbnNCaWdnaWUpO1xuICAgIH0pO1xuXG4gICAgaWYgKCAhICRiaWdnaWUuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykgKSB7XG4gICAgICAgIC8vIGluaXQgdGhlIHNsaWRlc2hvd3M7XG4gICAgICAgICRiaWdnaWUuc2xpY2sob3B0aW9uc0JpZ2dpZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJGJpZ2dpZS5zbGljaygncmVmcmVzaCcpO1xuICAgIH1cblxuICAgIC8vIGF0dGFjaCBwcmV2L25leHQgYnV0dG9uIGV2ZW50cyBub3cgdGhhdCB0aGUgc21hbGxzIGFycm93cyBoYXZlIGJlZW4gYWRkZWQ7XG4gICAgJGNhcm91c2VsXG4gICAgICAgIC8vIGF0dGFjaCBwcmV2aW91cyBidXR0b24gZXZlbnRzO1xuICAgICAgICAuZmluZChcImEucHJldlwiKS5vbihcImNsaWNrXCIsIGdvVG9QcmV2aW91c1NsaWRlKS5lbmQoKVxuICAgICAgICAvLyBhdHRhY2ggbmV4dCBidXR0b24gZXZlbnRzO1xuICAgICAgICAuZmluZChcImEubmV4dFwiKS5vbihcImNsaWNrXCIsIGdvVG9OZXh0U2xpZGUpO1xuXG4gICAgLy8gaWYgdGhlIGRldmljZSBpcyBOT1QgYSB0b3VjaHNjcmVlbjtcbiAgICAvLyB0aGVuIGhpZGUgdGhlIGNvbnRyb2xzIHdoZW4gdGhlIHVzZXIgaXNuJ3QgaW50ZXJhY3Rpbmcgd2l0aCB0aGVtO1xuICAgIGlmIChNb2Rlcm5penIudG91Y2ggPT09IGZhbHNlKSB7XG5cbiAgICAgICAgLy8gc2hvdy9oaWRlIHRoZSBlbGVtZW50cyB0aGF0IG92ZXJsYXkgJHNsaWRlc2hvdzEgKHNvY2lhbCwgcHJldiwgbmV4dCk7XG4gICAgICAgICRiaWdnaWUucGFyZW50KCkub24oXCJtb3VzZWVudGVyXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJGJpZ2dpZS5wYXJlbnQoKS5yZW1vdmVDbGFzcyhkaXNhYmxlZENsYXNzKTtcbiAgICAgICAgfSkub24oXCJtb3VzZWxlYXZlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJGJpZ2dpZS5wYXJlbnQoKS5hZGRDbGFzcyhkaXNhYmxlZENsYXNzKTtcbiAgICAgICAgfSlcbiAgICAgICAgLy8gb24gbG9hZCwgZGlzYWJsZSB0aGUgc2xpZGVzaG93IChtYXliZSk7XG4gICAgICAgIC5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGRpc2FibGUgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIC8vIG1ha2Ugc3VyZSB0aGUgdXNlciBpc24ndCBob3ZlcmluZyBvdmVyIHRoZSBwaG90byBnYWxsZXJ5O1xuICAgICAgICAgICAgICAgIGlmICgkYmlnZ2llLnBhcmVudCgpLmlzKFwiOmhvdmVyXCIpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAkYmlnZ2llLnBhcmVudCgpLmFkZENsYXNzKGRpc2FibGVkQ2xhc3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIGJlZm9yZSBcImRpc2FibGluZ1wiIHRoZSBvdmVybGF5IGVsZW1lbnRzLCB3YWl0IDIgc2Vjb25kcztcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGRpc2FibGUsIDIwMDApO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2Fyb3VzZWw7XG4iLCJ2YXIgVmlld01vZHVsZSA9IHJlcXVpcmUoICcuLi8uLi91dGlscy92aWV3LW1vZHVsZScgKSxcblx0TGlnaHRib3hNb2R1bGU7XG5cbkxpZ2h0Ym94TW9kdWxlID0gVmlld01vZHVsZS5leHRlbmQoIHtcblx0b2xkQXNwZWN0UmF0aW86IG51bGwsXG5cblx0b2xkQW5pbWF0aW9uOiBudWxsLFxuXG5cdHN3aXBlcjogbnVsbCxcblxuXHRnZXREZWZhdWx0U2V0dGluZ3M6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRjbGFzc2VzOiB7XG5cdFx0XHRcdGFzcGVjdFJhdGlvOiAncWF6YW5hLWFzcGVjdC1yYXRpby0lcycsXG5cdFx0XHRcdGl0ZW06ICdxYXphbmEtbGlnaHRib3gtaXRlbScsXG5cdFx0XHRcdGltYWdlOiAncWF6YW5hLWxpZ2h0Ym94LWltYWdlJyxcblx0XHRcdFx0dmlkZW9Db250YWluZXI6ICdxYXphbmEtdmlkZW8tY29udGFpbmVyJyxcblx0XHRcdFx0dmlkZW9XcmFwcGVyOiAncWF6YW5hLWZpdC1hc3BlY3QtcmF0aW8nLFxuXHRcdFx0XHRwbGF5QnV0dG9uOiAncWF6YW5hLWN1c3RvbS1lbWJlZC1wbGF5Jyxcblx0XHRcdFx0cGxheUJ1dHRvbkljb246ICdmYScsXG5cdFx0XHRcdHBsYXlpbmc6ICdxYXphbmEtcGxheWluZycsXG5cdFx0XHRcdGhpZGRlbjogJ3FhemFuYS1oaWRkZW4nLFxuXHRcdFx0XHRpbnZpc2libGU6ICdxYXphbmEtaW52aXNpYmxlJyxcblx0XHRcdFx0cHJldmVudENsb3NlOiAncWF6YW5hLWxpZ2h0Ym94LXByZXZlbnQtY2xvc2UnLFxuXHRcdFx0XHRzbGlkZXNob3c6IHtcblx0XHRcdFx0XHRjb250YWluZXI6ICdzd2lwZXItY29udGFpbmVyJyxcblx0XHRcdFx0XHRzbGlkZXNXcmFwcGVyOiAnc3dpcGVyLXdyYXBwZXInLFxuXHRcdFx0XHRcdHByZXZCdXR0b246ICdxYXphbmEtc3dpcGVyLWJ1dHRvbiBxYXphbmEtc3dpcGVyLWJ1dHRvbi1wcmV2Jyxcblx0XHRcdFx0XHRuZXh0QnV0dG9uOiAncWF6YW5hLXN3aXBlci1idXR0b24gcWF6YW5hLXN3aXBlci1idXR0b24tbmV4dCcsXG5cdFx0XHRcdFx0cHJldkJ1dHRvbkljb246ICdlaWNvbi1jaGV2cm9uLWxlZnQnLFxuXHRcdFx0XHRcdG5leHRCdXR0b25JY29uOiAnZWljb24tY2hldnJvbi1yaWdodCcsXG5cdFx0XHRcdFx0c2xpZGU6ICdzd2lwZXItc2xpZGUnXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRzZWxlY3RvcnM6IHtcblx0XHRcdFx0bGlua3M6ICdhLCBbZGF0YS1xYXphbmEtbGlnaHRib3hdJyxcblx0XHRcdFx0c2xpZGVzaG93OiB7XG5cdFx0XHRcdFx0YWN0aXZlU2xpZGU6ICcuc3dpcGVyLXNsaWRlLWFjdGl2ZScsXG5cdFx0XHRcdFx0cHJldlNsaWRlOiAnLnN3aXBlci1zbGlkZS1wcmV2Jyxcblx0XHRcdFx0XHRuZXh0U2xpZGU6ICcuc3dpcGVyLXNsaWRlLW5leHQnXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRtb2RhbE9wdGlvbnM6IHtcblx0XHRcdFx0aWQ6ICdxYXphbmEtbGlnaHRib3gnLFxuXHRcdFx0XHRlbnRyYW5jZUFuaW1hdGlvbjogJ3pvb21JbicsXG5cdFx0XHRcdHZpZGVvQXNwZWN0UmF0aW86IDE2OSxcblx0XHRcdFx0cG9zaXRpb246IHtcblx0XHRcdFx0XHRlbmFibGU6IGZhbHNlXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHR9LFxuXG5cdGdldE1vZGFsOiBmdW5jdGlvbigpIHtcblx0XHRpZiAoICEgTGlnaHRib3hNb2R1bGUubW9kYWwgKSB7XG5cdFx0XHR0aGlzLmluaXRNb2RhbCgpO1xuXHRcdH1cblxuXHRcdHJldHVybiBMaWdodGJveE1vZHVsZS5tb2RhbDtcblx0fSxcblxuXHRpbml0TW9kYWw6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBtb2RhbCA9IExpZ2h0Ym94TW9kdWxlLm1vZGFsID0gcWF6YW5hRnJvbnRlbmQuZ2V0RGlhbG9nc01hbmFnZXIoKS5jcmVhdGVXaWRnZXQoICdsaWdodGJveCcsIHtcblx0XHRcdGNsYXNzTmFtZTogJ3FhemFuYS1saWdodGJveCcsXG5cdFx0XHRjbG9zZUJ1dHRvbjogdHJ1ZSxcblx0XHRcdGNsb3NlQnV0dG9uQ2xhc3M6ICdlaWNvbi1jbG9zZScsXG5cdFx0XHRzZWxlY3RvcnM6IHtcblx0XHRcdFx0cHJldmVudENsb3NlOiAnLicgKyB0aGlzLmdldFNldHRpbmdzKCAnY2xhc3Nlcy5wcmV2ZW50Q2xvc2UnIClcblx0XHRcdH0sXG5cdFx0XHRoaWRlOiB7XG5cdFx0XHRcdG9uQ2xpY2s6IHRydWVcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHRtb2RhbC5vbiggJ2hpZGUnLCBmdW5jdGlvbigpIHtcblx0XHRcdG1vZGFsLnNldE1lc3NhZ2UoICcnICk7XG5cdFx0fSApO1xuXHR9LFxuXG5cdHNob3dNb2RhbDogZnVuY3Rpb24oIG9wdGlvbnMgKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdFx0ZGVmYXVsdE9wdGlvbnMgPSBzZWxmLmdldERlZmF1bHRTZXR0aW5ncygpLm1vZGFsT3B0aW9ucztcblxuXHRcdHNlbGYuc2V0U2V0dGluZ3MoICdtb2RhbE9wdGlvbnMnLCBqUXVlcnkuZXh0ZW5kKCBkZWZhdWx0T3B0aW9ucywgb3B0aW9ucy5tb2RhbE9wdGlvbnMgKSApO1xuXG5cdFx0dmFyIG1vZGFsID0gc2VsZi5nZXRNb2RhbCgpO1xuXG5cdFx0bW9kYWwuc2V0SUQoIHNlbGYuZ2V0U2V0dGluZ3MoICdtb2RhbE9wdGlvbnMuaWQnICkgKTtcblxuXHRcdG1vZGFsLm9uU2hvdyA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0RGlhbG9nc01hbmFnZXIuZ2V0V2lkZ2V0VHlwZSggJ2xpZ2h0Ym94JyApLnByb3RvdHlwZS5vblNob3cuYXBwbHkoIG1vZGFsLCBhcmd1bWVudHMgKTtcblxuXHRcdFx0c2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHNlbGYuc2V0RW50cmFuY2VBbmltYXRpb24oKTtcblx0XHRcdH0sIDEwICk7XG5cdFx0fTtcblxuXHRcdG1vZGFsLm9uSGlkZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0RGlhbG9nc01hbmFnZXIuZ2V0V2lkZ2V0VHlwZSggJ2xpZ2h0Ym94JyApLnByb3RvdHlwZS5vbkhpZGUuYXBwbHkoIG1vZGFsLCBhcmd1bWVudHMgKTtcblxuXHRcdFx0bW9kYWwuZ2V0RWxlbWVudHMoICd3aWRnZXRDb250ZW50JyApLnJlbW92ZUNsYXNzKCAnYW5pbWF0ZWQnICk7XG5cdFx0fTtcblxuXHRcdHN3aXRjaCAoIG9wdGlvbnMudHlwZSApIHtcblx0XHRcdGNhc2UgJ2ltYWdlJzpcblx0XHRcdFx0c2VsZi5zZXRJbWFnZUNvbnRlbnQoIG9wdGlvbnMudXJsICk7XG5cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICd2aWRlbyc6XG5cdFx0XHRcdHNlbGYuc2V0VmlkZW9Db250ZW50KCBvcHRpb25zLnVybCApO1xuXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAnc2xpZGVzaG93Jzpcblx0XHRcdFx0c2VsZi5zZXRTbGlkZXNob3dDb250ZW50KCBvcHRpb25zLnNsaWRlc2hvdyApO1xuXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0c2VsZi5zZXRIVE1MQ29udGVudCggb3B0aW9ucy5odG1sICk7XG5cdFx0fVxuXG5cdFx0bW9kYWwuc2hvdygpO1xuXHR9LFxuXG5cdHNldEhUTUxDb250ZW50OiBmdW5jdGlvbiggaHRtbCApIHtcblx0XHR0aGlzLmdldE1vZGFsKCkuc2V0TWVzc2FnZSggaHRtbCApO1xuXHR9LFxuXG5cdHNldEltYWdlQ29udGVudDogZnVuY3Rpb24oIGltYWdlVVJMICkge1xuXHRcdHZhciBzZWxmID0gdGhpcyxcblx0XHRcdGNsYXNzZXMgPSBzZWxmLmdldFNldHRpbmdzKCAnY2xhc3NlcycgKSxcblx0XHRcdCRpdGVtID0galF1ZXJ5KCAnPGRpdj4nLCB7ICdjbGFzcyc6IGNsYXNzZXMuaXRlbSB9ICksXG5cdFx0XHQkaW1hZ2UgPSBqUXVlcnkoICc8aW1nPicsIHsgc3JjOiBpbWFnZVVSTCwgJ2NsYXNzJzogY2xhc3Nlcy5pbWFnZSArICcgJyArIGNsYXNzZXMucHJldmVudENsb3NlIH0gKTtcblxuXHRcdCRpdGVtLmFwcGVuZCggJGltYWdlICk7XG5cblx0XHRzZWxmLmdldE1vZGFsKCkuc2V0TWVzc2FnZSggJGl0ZW0gKTtcblx0fSxcblxuXHRzZXRWaWRlb0NvbnRlbnQ6IGZ1bmN0aW9uKCB2aWRlb0VtYmVkVVJMICkge1xuXHRcdHZpZGVvRW1iZWRVUkwgPSB2aWRlb0VtYmVkVVJMLnJlcGxhY2UoICcmYXV0b3BsYXk9MCcsICcnICkgKyAnJmF1dG9wbGF5PTEnO1xuXG5cdFx0dmFyIGNsYXNzZXMgPSB0aGlzLmdldFNldHRpbmdzKCAnY2xhc3NlcycgKSxcblx0XHRcdCR2aWRlb0NvbnRhaW5lciA9IGpRdWVyeSggJzxkaXY+JywgeyAnY2xhc3MnOiBjbGFzc2VzLnZpZGVvQ29udGFpbmVyIH0gKSxcblx0XHRcdCR2aWRlb1dyYXBwZXIgPSBqUXVlcnkoICc8ZGl2PicsIHsgJ2NsYXNzJzogY2xhc3Nlcy52aWRlb1dyYXBwZXIgfSApLFxuXHRcdFx0JHZpZGVvRnJhbWUgPSBqUXVlcnkoICc8aWZyYW1lPicsIHsgc3JjOiB2aWRlb0VtYmVkVVJMLCBhbGxvd2Z1bGxzY3JlZW46IDEgfSApLFxuXHRcdFx0bW9kYWwgPSB0aGlzLmdldE1vZGFsKCk7XG5cblx0XHQkdmlkZW9Db250YWluZXIuYXBwZW5kKCAkdmlkZW9XcmFwcGVyICk7XG5cblx0XHQkdmlkZW9XcmFwcGVyLmFwcGVuZCggJHZpZGVvRnJhbWUgKTtcblxuXHRcdG1vZGFsLnNldE1lc3NhZ2UoICR2aWRlb0NvbnRhaW5lciApO1xuXG5cdFx0dGhpcy5zZXRWaWRlb0FzcGVjdFJhdGlvKCk7XG5cblx0XHR2YXIgb25IaWRlTWV0aG9kID0gbW9kYWwub25IaWRlO1xuXG5cdFx0bW9kYWwub25IaWRlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRvbkhpZGVNZXRob2QoKTtcblxuXHRcdFx0bW9kYWwuZ2V0RWxlbWVudHMoICdtZXNzYWdlJyApLnJlbW92ZUNsYXNzKCAncWF6YW5hLWZpdC1hc3BlY3QtcmF0aW8nICk7XG5cdFx0fTtcblx0fSxcblxuXHRzZXRTbGlkZXNob3dDb250ZW50OiBmdW5jdGlvbiggb3B0aW9ucyApIHtcblx0XHR2YXIgJCA9IGpRdWVyeSxcblx0XHRcdHNlbGYgPSB0aGlzLFxuXHRcdFx0Y2xhc3NlcyA9IHNlbGYuZ2V0U2V0dGluZ3MoICdjbGFzc2VzJyApLFxuXHRcdFx0c2xpZGVzaG93Q2xhc3NlcyA9IGNsYXNzZXMuc2xpZGVzaG93LFxuXHRcdFx0JGNvbnRhaW5lciA9ICQoICc8ZGl2PicsIHsgJ2NsYXNzJzogc2xpZGVzaG93Q2xhc3Nlcy5jb250YWluZXIgfSApLFxuXHRcdFx0JHNsaWRlc1dyYXBwZXIgPSAkKCAnPGRpdj4nLCB7ICdjbGFzcyc6IHNsaWRlc2hvd0NsYXNzZXMuc2xpZGVzV3JhcHBlciB9ICksXG5cdFx0XHQkcHJldkJ1dHRvbiA9ICQoICc8ZGl2PicsIHsgJ2NsYXNzJzogc2xpZGVzaG93Q2xhc3Nlcy5wcmV2QnV0dG9uICsgJyAnICsgY2xhc3Nlcy5wcmV2ZW50Q2xvc2UgfSApLmh0bWwoICQoICc8aT4nLCB7ICdjbGFzcyc6IHNsaWRlc2hvd0NsYXNzZXMucHJldkJ1dHRvbkljb24gfSApICksXG5cdFx0XHQkbmV4dEJ1dHRvbiA9ICQoICc8ZGl2PicsIHsgJ2NsYXNzJzogc2xpZGVzaG93Q2xhc3Nlcy5uZXh0QnV0dG9uICsgJyAnICsgY2xhc3Nlcy5wcmV2ZW50Q2xvc2UgfSApLmh0bWwoICQoICc8aT4nLCB7ICdjbGFzcyc6IHNsaWRlc2hvd0NsYXNzZXMubmV4dEJ1dHRvbkljb24gfSApICk7XG5cblx0XHRvcHRpb25zLnNsaWRlcy5mb3JFYWNoKCBmdW5jdGlvbiggc2xpZGUgKSB7XG5cdFx0XHR2YXIgc2xpZGVDbGFzcyA9ICBzbGlkZXNob3dDbGFzc2VzLnNsaWRlICsgJyAnICsgY2xhc3Nlcy5pdGVtO1xuXG5cdFx0XHRpZiAoIHNsaWRlLnZpZGVvICkge1xuXHRcdFx0XHRzbGlkZUNsYXNzICs9ICcgJyArIGNsYXNzZXMudmlkZW87XG5cdFx0XHR9XG5cblx0XHRcdHZhciAkc2xpZGUgPSAkKCAnPGRpdj4nLCB7ICdjbGFzcyc6IHNsaWRlQ2xhc3MgfSApO1xuXG5cdFx0XHRpZiAoIHNsaWRlLnZpZGVvICkge1xuXHRcdFx0XHQkc2xpZGUuYXR0ciggJ2RhdGEtcWF6YW5hLXNsaWRlc2hvdy12aWRlbycsIHNsaWRlLnZpZGVvICk7XG5cblx0XHRcdFx0dmFyICRwbGF5SWNvbiA9ICQoICc8ZGl2PicsIHsgJ2NsYXNzJzogY2xhc3Nlcy5wbGF5QnV0dG9uIH0gKS5odG1sKCAkKCAnPGk+JywgeyAnY2xhc3MnOiBjbGFzc2VzLnBsYXlCdXR0b25JY29uIH0gKSApO1xuXG5cdFx0XHRcdCRzbGlkZS5hcHBlbmQoICRwbGF5SWNvbiApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmFyICR6b29tQ29udGFpbmVyID0gJCggJzxkaXY+JywgeyAnY2xhc3MnOiAnc3dpcGVyLXpvb20tY29udGFpbmVyJyB9ICksXG5cdFx0XHRcdFx0JHNsaWRlSW1hZ2UgPSAkKCAnPGltZz4nLCB7ICdjbGFzcyc6IGNsYXNzZXMuaW1hZ2UgKyAnICcgKyBjbGFzc2VzLnByZXZlbnRDbG9zZSB9ICkuYXR0ciggJ3NyYycsIHNsaWRlLmltYWdlICk7XG5cblx0XHRcdFx0JHpvb21Db250YWluZXIuYXBwZW5kKCAkc2xpZGVJbWFnZSApO1xuXG5cdFx0XHRcdCRzbGlkZS5hcHBlbmQoICR6b29tQ29udGFpbmVyICk7XG5cdFx0XHR9XG5cblx0XHRcdCRzbGlkZXNXcmFwcGVyLmFwcGVuZCggJHNsaWRlICk7XG5cdFx0fSApO1xuXG5cdFx0JGNvbnRhaW5lci5hcHBlbmQoXG5cdFx0XHQkc2xpZGVzV3JhcHBlcixcblx0XHRcdCRwcmV2QnV0dG9uLFxuXHRcdFx0JG5leHRCdXR0b25cblx0XHQpO1xuXG5cdFx0dmFyIG1vZGFsID0gc2VsZi5nZXRNb2RhbCgpO1xuXG5cdFx0bW9kYWwuc2V0TWVzc2FnZSggJGNvbnRhaW5lciApO1xuXG5cdFx0dmFyIG9uU2hvd01ldGhvZCA9IG1vZGFsLm9uU2hvdztcblxuXHRcdG1vZGFsLm9uU2hvdyA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0b25TaG93TWV0aG9kKCk7XG5cblx0XHRcdHZhciBzd2lwZXJPcHRpb25zID0ge1xuXHRcdFx0XHRwcmV2QnV0dG9uOiAkcHJldkJ1dHRvbixcblx0XHRcdFx0bmV4dEJ1dHRvbjogJG5leHRCdXR0b24sXG5cdFx0XHRcdHBhZ2luYXRpb25DbGlja2FibGU6IHRydWUsXG5cdFx0XHRcdGdyYWJDdXJzb3I6IHRydWUsXG5cdFx0XHRcdG9uU2xpZGVDaGFuZ2VFbmQ6IHNlbGYub25TbGlkZUNoYW5nZSxcblx0XHRcdFx0cnVuQ2FsbGJhY2tzT25Jbml0OiBmYWxzZSxcblx0XHRcdFx0bG9vcDogdHJ1ZSxcblx0XHRcdFx0a2V5Ym9hcmRDb250cm9sOiB0cnVlXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAoIG9wdGlvbnMuc3dpcGVyICkge1xuXHRcdFx0XHQkLmV4dGVuZCggc3dpcGVyT3B0aW9ucywgb3B0aW9ucy5zd2lwZXIgKTtcblx0XHRcdH1cblxuXHRcdFx0c2VsZi5zd2lwZXIgPSBuZXcgU3dpcGVyKCAkY29udGFpbmVyLCBzd2lwZXJPcHRpb25zICk7XG5cblx0XHRcdHNlbGYuc2V0VmlkZW9Bc3BlY3RSYXRpbygpO1xuXG5cdFx0XHRzZWxmLnBsYXlTbGlkZVZpZGVvKCk7XG5cdFx0fTtcblx0fSxcblxuXHRzZXRWaWRlb0FzcGVjdFJhdGlvOiBmdW5jdGlvbiggYXNwZWN0UmF0aW8gKSB7XG5cdFx0YXNwZWN0UmF0aW8gPSBhc3BlY3RSYXRpbyB8fCB0aGlzLmdldFNldHRpbmdzKCAnbW9kYWxPcHRpb25zLnZpZGVvQXNwZWN0UmF0aW8nICk7XG5cblx0XHR2YXIgJHdpZGdldENvbnRlbnQgPSB0aGlzLmdldE1vZGFsKCkuZ2V0RWxlbWVudHMoICd3aWRnZXRDb250ZW50JyApLFxuXHRcdFx0b2xkQXNwZWN0UmF0aW8gPSB0aGlzLm9sZEFzcGVjdFJhdGlvLFxuXHRcdFx0YXNwZWN0UmF0aW9DbGFzcyA9IHRoaXMuZ2V0U2V0dGluZ3MoICdjbGFzc2VzLmFzcGVjdFJhdGlvJyApO1xuXG5cdFx0dGhpcy5vbGRBc3BlY3RSYXRpbyA9IGFzcGVjdFJhdGlvO1xuXG5cdFx0aWYgKCBvbGRBc3BlY3RSYXRpbyApIHtcblx0XHRcdCR3aWRnZXRDb250ZW50LnJlbW92ZUNsYXNzKCBhc3BlY3RSYXRpb0NsYXNzLnJlcGxhY2UoICclcycsIG9sZEFzcGVjdFJhdGlvICkgKTtcblx0XHR9XG5cblx0XHRpZiAoIGFzcGVjdFJhdGlvICkge1xuXHRcdFx0JHdpZGdldENvbnRlbnQuYWRkQ2xhc3MoIGFzcGVjdFJhdGlvQ2xhc3MucmVwbGFjZSggJyVzJywgYXNwZWN0UmF0aW8gKSApO1xuXHRcdH1cblx0fSxcblxuXHRnZXRTbGlkZTogZnVuY3Rpb24oIHNsaWRlU3RhdGUgKSB7XG5cdFx0cmV0dXJuIHRoaXMuc3dpcGVyLnNsaWRlcy5maWx0ZXIoIHRoaXMuZ2V0U2V0dGluZ3MoICdzZWxlY3RvcnMuc2xpZGVzaG93LicgKyBzbGlkZVN0YXRlICsgJ1NsaWRlJyApICk7XG5cdH0sXG5cblx0cGxheVNsaWRlVmlkZW86IGZ1bmN0aW9uKCkge1xuXHRcdHZhciAkYWN0aXZlU2xpZGUgPSB0aGlzLmdldFNsaWRlKCAnYWN0aXZlJyApLFxuXHRcdFx0dmlkZW9VUkwgPSAkYWN0aXZlU2xpZGUuZGF0YSggJ3FhemFuYS1zbGlkZXNob3ctdmlkZW8nICk7XG5cblx0XHRpZiAoICEgdmlkZW9VUkwgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIGNsYXNzZXMgPSB0aGlzLmdldFNldHRpbmdzKCAnY2xhc3NlcycgKTtcblxuXHRcdHZhciAkdmlkZW9Db250YWluZXIgPSBqUXVlcnkoICc8ZGl2PicsIHsgJ2NsYXNzJzogY2xhc3Nlcy52aWRlb0NvbnRhaW5lciArICcgJyArIGNsYXNzZXMuaW52aXNpYmxlIH0gKSxcblx0XHRcdCR2aWRlb1dyYXBwZXIgPSBqUXVlcnkoICc8ZGl2PicsIHsgJ2NsYXNzJzogY2xhc3Nlcy52aWRlb1dyYXBwZXIgfSApLFxuXHRcdFx0JHZpZGVvRnJhbWUgPSBqUXVlcnkoICc8aWZyYW1lPicsIHsgc3JjOiB2aWRlb1VSTCB9ICksXG5cdFx0XHQkcGxheUljb24gPSAkYWN0aXZlU2xpZGUuY2hpbGRyZW4oICcuJyArIGNsYXNzZXMucGxheUJ1dHRvbiApO1xuXG5cdFx0JHZpZGVvQ29udGFpbmVyLmFwcGVuZCggJHZpZGVvV3JhcHBlciApO1xuXG5cdFx0JHZpZGVvV3JhcHBlci5hcHBlbmQoICR2aWRlb0ZyYW1lICk7XG5cblx0XHQkYWN0aXZlU2xpZGUuYXBwZW5kKCAkdmlkZW9Db250YWluZXIgKTtcblxuXHRcdCRwbGF5SWNvbi5hZGRDbGFzcyggY2xhc3Nlcy5wbGF5aW5nICkucmVtb3ZlQ2xhc3MoIGNsYXNzZXMuaGlkZGVuICk7XG5cblx0XHQkdmlkZW9GcmFtZS5vbiggJ2xvYWQnLCBmdW5jdGlvbigpIHtcblx0XHRcdCRwbGF5SWNvbi5hZGRDbGFzcyggY2xhc3Nlcy5oaWRkZW4gKTtcblxuXHRcdFx0JHZpZGVvQ29udGFpbmVyLnJlbW92ZUNsYXNzKCBjbGFzc2VzLmludmlzaWJsZSApO1xuXHRcdH0gKTtcblx0fSxcblxuXHRzZXRFbnRyYW5jZUFuaW1hdGlvbjogZnVuY3Rpb24oIGFuaW1hdGlvbiApIHtcblx0XHRhbmltYXRpb24gPSBhbmltYXRpb24gfHwgdGhpcy5nZXRTZXR0aW5ncyggJ21vZGFsT3B0aW9ucy5lbnRyYW5jZUFuaW1hdGlvbicgKTtcblxuXHRcdHZhciAkd2lkZ2V0TWVzc2FnZSA9IHRoaXMuZ2V0TW9kYWwoKS5nZXRFbGVtZW50cyggJ21lc3NhZ2UnICk7XG5cblx0XHRpZiAoIHRoaXMub2xkQW5pbWF0aW9uICkge1xuXHRcdFx0JHdpZGdldE1lc3NhZ2UucmVtb3ZlQ2xhc3MoIHRoaXMub2xkQW5pbWF0aW9uICk7XG5cdFx0fVxuXG5cdFx0dGhpcy5vbGRBbmltYXRpb24gPSBhbmltYXRpb247XG5cblx0XHRpZiAoIGFuaW1hdGlvbiApIHtcblx0XHRcdCR3aWRnZXRNZXNzYWdlLmFkZENsYXNzKCAnYW5pbWF0ZWQgJyArIGFuaW1hdGlvbiApO1xuXHRcdH1cblx0fSxcblxuXHRpc0xpZ2h0Ym94TGluazogZnVuY3Rpb24oIGVsZW1lbnQgKSB7XG5cdFx0aWYgKCAnQScgPT09IGVsZW1lbnQudGFnTmFtZSAmJiAhIC9cXC4ocG5nfGpwZT9nfGdpZnxzdmcpJC9pLnRlc3QoIGVsZW1lbnQuaHJlZiApICkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHZhciBnZW5lcmFsT3BlbkluTGlnaHRib3ggPSBxYXphbmFGcm9udGVuZC5nZXRHZW5lcmFsU2V0dGluZ3MoICdxYXphbmFfZ2xvYmFsX2ltYWdlX2xpZ2h0Ym94JyApLFxuXHRcdFx0Y3VycmVudExpbmtPcGVuSW5MaWdodGJveCA9IGVsZW1lbnQuZGF0YXNldC5xYXphbmFPcGVuTGlnaHRib3g7XG5cblx0XHRyZXR1cm4gJ3llcycgPT09IGN1cnJlbnRMaW5rT3BlbkluTGlnaHRib3ggfHwgZ2VuZXJhbE9wZW5JbkxpZ2h0Ym94ICYmICdubycgIT09IGN1cnJlbnRMaW5rT3BlbkluTGlnaHRib3g7XG5cdH0sXG5cblx0b3Blbkxpbms6IGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHR2YXIgZWxlbWVudCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQsXG5cdFx0XHQkdGFyZ2V0ID0galF1ZXJ5KCBldmVudC50YXJnZXQgKSxcblx0XHRcdGVkaXRNb2RlID0gcWF6YW5hRnJvbnRlbmQuaXNFZGl0TW9kZSgpLFxuXHRcdFx0aXNDbGlja0luc2lkZVFhemFuYSA9ICEhICR0YXJnZXQuY2xvc2VzdCggJyNxYXphbmEnICkubGVuZ3RoO1xuXG5cdFx0aWYgKCAhIHRoaXMuaXNMaWdodGJveExpbmsoIGVsZW1lbnQgKSApIHtcblxuXHRcdFx0aWYgKCBlZGl0TW9kZSAmJiBpc0NsaWNrSW5zaWRlUWF6YW5hICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGlmICggcWF6YW5hRnJvbnRlbmQuaXNFZGl0TW9kZSgpICYmICEgcWF6YW5hRnJvbnRlbmQuZ2V0R2VuZXJhbFNldHRpbmdzKCAncWF6YW5hX2VuYWJsZV9saWdodGJveF9pbl9lZGl0b3InICkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIGxpZ2h0Ym94RGF0YSA9IHt9O1xuXG5cdFx0aWYgKCBlbGVtZW50LmRhdGFzZXQucWF6YW5hTGlnaHRib3ggKSB7XG5cdFx0XHRsaWdodGJveERhdGEgPSBKU09OLnBhcnNlKCBlbGVtZW50LmRhdGFzZXQucWF6YW5hTGlnaHRib3ggKTtcblx0XHR9XG5cblx0XHRpZiAoIGxpZ2h0Ym94RGF0YS50eXBlICYmICdzbGlkZXNob3cnICE9PSBsaWdodGJveERhdGEudHlwZSApIHtcblx0XHRcdHRoaXMuc2hvd01vZGFsKCBsaWdodGJveERhdGEgKTtcblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICggISBlbGVtZW50LmRhdGFzZXQucWF6YW5hTGlnaHRib3hTbGlkZXNob3cgKSB7XG5cdFx0XHR0aGlzLnNob3dNb2RhbCgge1xuXHRcdFx0XHR0eXBlOiAnaW1hZ2UnLFxuXHRcdFx0XHR1cmw6IGVsZW1lbnQuaHJlZlxuXHRcdFx0fSApO1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIHNsaWRlc2hvd0lEID0gZWxlbWVudC5kYXRhc2V0LnFhemFuYUxpZ2h0Ym94U2xpZGVzaG93O1xuXG5cdFx0dmFyICRhbGxTbGlkZXNob3dMaW5rcyA9IGpRdWVyeSggdGhpcy5nZXRTZXR0aW5ncyggJ3NlbGVjdG9ycy5saW5rcycgKSApLmZpbHRlciggZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gc2xpZGVzaG93SUQgPT09IHRoaXMuZGF0YXNldC5xYXphbmFMaWdodGJveFNsaWRlc2hvdztcblx0XHR9ICk7XG5cblx0XHR2YXIgc2xpZGVzID0gW10sXG5cdFx0XHR1bmlxdWVMaW5rcyA9IHt9O1xuXG5cdFx0JGFsbFNsaWRlc2hvd0xpbmtzLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCB1bmlxdWVMaW5rc1sgdGhpcy5ocmVmIF0gKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dW5pcXVlTGlua3NbIHRoaXMuaHJlZiBdID0gdHJ1ZTtcblxuXHRcdFx0dmFyIHNsaWRlSW5kZXggPSB0aGlzLmRhdGFzZXQucWF6YW5hTGlnaHRib3hJbmRleDtcblxuXHRcdFx0aWYgKCB1bmRlZmluZWQgPT09IHNsaWRlSW5kZXggKSB7XG5cdFx0XHRcdHNsaWRlSW5kZXggPSAkYWxsU2xpZGVzaG93TGlua3MuaW5kZXgoIHRoaXMgKTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIHNsaWRlRGF0YSA9IHtcblx0XHRcdFx0aW1hZ2U6IHRoaXMuaHJlZixcblx0XHRcdFx0aW5kZXg6IHNsaWRlSW5kZXhcblx0XHRcdH07XG5cblx0XHRcdGlmICggdGhpcy5kYXRhc2V0LnFhemFuYUxpZ2h0Ym94VmlkZW8gKSB7XG5cdFx0XHRcdHNsaWRlRGF0YS52aWRlbyA9IHRoaXMuZGF0YXNldC5xYXphbmFMaWdodGJveFZpZGVvO1xuXHRcdFx0fVxuXG5cdFx0XHRzbGlkZXMucHVzaCggc2xpZGVEYXRhICk7XG5cdFx0fSApO1xuXG5cdFx0c2xpZGVzLnNvcnQoIGZ1bmN0aW9uKCBhLCBiICkge1xuXHRcdFx0cmV0dXJuIGEuaW5kZXggLSBiLmluZGV4O1xuXHRcdH0gKTtcblxuXHRcdHZhciBpbml0aWFsU2xpZGUgPSBlbGVtZW50LmRhdGFzZXQucWF6YW5hTGlnaHRib3hJbmRleDtcblxuXHRcdGlmICggdW5kZWZpbmVkID09PSBpbml0aWFsU2xpZGUgKSB7XG5cdFx0XHRpbml0aWFsU2xpZGUgPSAkYWxsU2xpZGVzaG93TGlua3MuaW5kZXgoIGVsZW1lbnQgKTtcblx0XHR9XG5cblx0XHR0aGlzLnNob3dNb2RhbCgge1xuXHRcdFx0dHlwZTogJ3NsaWRlc2hvdycsXG5cdFx0XHRtb2RhbE9wdGlvbnM6IHtcblx0XHRcdFx0aWQ6ICdxYXphbmEtbGlnaHRib3gtc2xpZGVzaG93LScgKyBzbGlkZXNob3dJRFxuXHRcdFx0fSxcblx0XHRcdHNsaWRlc2hvdzoge1xuXHRcdFx0XHRzbGlkZXM6IHNsaWRlcyxcblx0XHRcdFx0c3dpcGVyOiB7XG5cdFx0XHRcdFx0aW5pdGlhbFNsaWRlOiAraW5pdGlhbFNsaWRlXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9ICk7XG5cdH0sXG5cblx0YmluZEV2ZW50czogZnVuY3Rpb24oKSB7XG5cdFx0cWF6YW5hRnJvbnRlbmQuZ2V0RWxlbWVudHMoICckZG9jdW1lbnQnICkub24oICdjbGljaycsIHRoaXMuZ2V0U2V0dGluZ3MoICdzZWxlY3RvcnMubGlua3MnICksIHRoaXMub3BlbkxpbmsgKTtcblx0fSxcblxuXHRvbkluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFZpZXdNb2R1bGUucHJvdG90eXBlLm9uSW5pdC5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG5cblx0XHRpZiAoIHFhemFuYUZyb250ZW5kLmlzRWRpdE1vZGUoKSApIHtcblx0XHRcdHFhemFuYS5zZXR0aW5ncy5nZW5lcmFsLm1vZGVsLm9uKCAnY2hhbmdlJywgdGhpcy5vbkdlbmVyYWxTZXR0aW5nc0NoYW5nZSApO1xuXHRcdH1cblx0fSxcblxuXHRvbkdlbmVyYWxTZXR0aW5nc0NoYW5nZTogZnVuY3Rpb24oIG1vZGVsICkge1xuXHRcdGlmICggJ3FhemFuYV9saWdodGJveF9jb250ZW50X2FuaW1hdGlvbicgaW4gbW9kZWwuY2hhbmdlZCApIHtcblx0XHRcdHRoaXMuc2V0U2V0dGluZ3MoICdtb2RhbE9wdGlvbnMuZW50cmFuY2VBbmltYXRpb24nLCBtb2RlbC5jaGFuZ2VkLnFhemFuYV9saWdodGJveF9jb250ZW50X2FuaW1hdGlvbiApO1xuXG5cdFx0XHR0aGlzLnNldEVudHJhbmNlQW5pbWF0aW9uKCk7XG5cdFx0fVxuXHR9LFxuXG5cdG9uU2xpZGVDaGFuZ2U6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXNcblx0XHRcdC5nZXRTbGlkZSggJ3ByZXYnIClcblx0XHRcdC5hZGQoIHRoaXMuZ2V0U2xpZGUoICduZXh0JyApIClcblx0XHRcdC5hZGQoIHRoaXMuZ2V0U2xpZGUoICdhY3RpdmUnICkgKVxuXHRcdFx0LmZpbmQoICcuJyArIHRoaXMuZ2V0U2V0dGluZ3MoICdjbGFzc2VzLnZpZGVvV3JhcHBlcicgKSApXG5cdFx0XHQucmVtb3ZlKCk7XG5cblx0XHR0aGlzLnBsYXlTbGlkZVZpZGVvKCk7XG5cdH1cbn0gKTtcblxubW9kdWxlLmV4cG9ydHMgPSBMaWdodGJveE1vZHVsZTtcbiIsInZhciBWaWV3TW9kdWxlID0gcmVxdWlyZSggJy4uLy4uL3V0aWxzL3ZpZXctbW9kdWxlJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdNb2R1bGUuZXh0ZW5kKCB7XG5cdGdldERlZmF1bHRTZXR0aW5nczogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGlzSW5zZXJ0ZWQ6IGZhbHNlLFxuXHRcdFx0QVBJU3JjOiAnaHR0cHM6Ly93d3cueW91dHViZS5jb20vaWZyYW1lX2FwaScsXG5cdFx0XHRzZWxlY3RvcnM6IHtcblx0XHRcdFx0Zmlyc3RTY3JpcHQ6ICdzY3JpcHQ6Zmlyc3QnXG5cdFx0XHR9XG5cdFx0fTtcblx0fSxcblxuXHRnZXREZWZhdWx0RWxlbWVudHM6IGZ1bmN0aW9uKCkge1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdCRmaXJzdFNjcmlwdDogalF1ZXJ5KCB0aGlzLmdldFNldHRpbmdzKCAnc2VsZWN0b3JzLmZpcnN0U2NyaXB0JyApIClcblx0XHR9O1xuXHR9LFxuXG5cdGluc2VydFlUQVBJOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnNldFNldHRpbmdzKCAnaXNJbnNlcnRlZCcsIHRydWUgKTtcblxuXHRcdHRoaXMuZWxlbWVudHMuJGZpcnN0U2NyaXB0LmJlZm9yZSggalF1ZXJ5KCAnPHNjcmlwdD4nLCB7IHNyYzogdGhpcy5nZXRTZXR0aW5ncyggJ0FQSVNyYycgKSB9ICkgKTtcblx0fSxcblxuXHRvbllvdXR1YmVBcGlSZWFkeTogZnVuY3Rpb24oIGNhbGxiYWNrICkge1xuXHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdGlmICggISBzZWxmLmdldFNldHRpbmdzKCAnSXNJbnNlcnRlZCcgKSApIHtcblx0XHRcdHNlbGYuaW5zZXJ0WVRBUEkoKTtcblx0XHR9XG5cblx0XHRpZiAoIHdpbmRvdy5ZVCAmJiBZVC5sb2FkZWQgKSB7XG5cdFx0XHRjYWxsYmFjayggWVQgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gSWYgbm90IHJlYWR5IGNoZWNrIGFnYWluIGJ5IHRpbWVvdXQuLlxuXHRcdFx0c2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHNlbGYub25Zb3V0dWJlQXBpUmVhZHkoIGNhbGxiYWNrICk7XG5cdFx0XHR9LCAzNTAgKTtcblx0XHR9XG5cdH0sXG5cblx0Z2V0WW91dHViZUlERnJvbVVSTDogZnVuY3Rpb24oIHVybCApIHtcblx0XHR2YXIgdmlkZW9JRFBhcnRzID0gdXJsLm1hdGNoKCAvXig/Omh0dHBzPzpcXC9cXC8pPyg/Ond3d1xcLik/KD86bVxcLik/KD86eW91dHVcXC5iZVxcL3x5b3V0dWJlXFwuY29tXFwvKD86KD86d2F0Y2gpP1xcPyg/Oi4qJik/dmk/PXwoPzplbWJlZHx2fHZpfHVzZXIpXFwvKSkoW14/JlwiJz5dKykvICk7XG5cblx0XHRyZXR1cm4gdmlkZW9JRFBhcnRzICYmIHZpZGVvSURQYXJ0c1sxXTtcblx0fVxufSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEhhbmRsZXMgbWFuYWdpbmcgYWxsIGV2ZW50cyBmb3Igd2hhdGV2ZXIgeW91IHBsdWcgaXQgaW50by4gUHJpb3JpdGllcyBmb3IgaG9va3MgYXJlIGJhc2VkIG9uIGxvd2VzdCB0byBoaWdoZXN0IGluXG4gKiB0aGF0LCBsb3dlc3QgcHJpb3JpdHkgaG9va3MgYXJlIGZpcmVkIGZpcnN0LlxuICovXG52YXIgRXZlbnRNYW5hZ2VyID0gZnVuY3Rpb24oKSB7XG5cdHZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZSxcblx0XHRNZXRob2RzQXZhaWxhYmxlO1xuXG5cdC8qKlxuXHQgKiBDb250YWlucyB0aGUgaG9va3MgdGhhdCBnZXQgcmVnaXN0ZXJlZCB3aXRoIHRoaXMgRXZlbnRNYW5hZ2VyLiBUaGUgYXJyYXkgZm9yIHN0b3JhZ2UgdXRpbGl6ZXMgYSBcImZsYXRcIlxuXHQgKiBvYmplY3QgbGl0ZXJhbCBzdWNoIHRoYXQgbG9va2luZyB1cCB0aGUgaG9vayB1dGlsaXplcyB0aGUgbmF0aXZlIG9iamVjdCBsaXRlcmFsIGhhc2guXG5cdCAqL1xuXHR2YXIgU1RPUkFHRSA9IHtcblx0XHRhY3Rpb25zOiB7fSxcblx0XHRmaWx0ZXJzOiB7fVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBSZW1vdmVzIHRoZSBzcGVjaWZpZWQgaG9vayBieSByZXNldHRpbmcgdGhlIHZhbHVlIG9mIGl0LlxuXHQgKlxuXHQgKiBAcGFyYW0gdHlwZSBUeXBlIG9mIGhvb2ssIGVpdGhlciAnYWN0aW9ucycgb3IgJ2ZpbHRlcnMnXG5cdCAqIEBwYXJhbSBob29rIFRoZSBob29rIChuYW1lc3BhY2UuaWRlbnRpZmllcikgdG8gcmVtb3ZlXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRmdW5jdGlvbiBfcmVtb3ZlSG9vayggdHlwZSwgaG9vaywgY2FsbGJhY2ssIGNvbnRleHQgKSB7XG5cdFx0dmFyIGhhbmRsZXJzLCBoYW5kbGVyLCBpO1xuXG5cdFx0aWYgKCAhIFNUT1JBR0VbIHR5cGUgXVsgaG9vayBdICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpZiAoICEgY2FsbGJhY2sgKSB7XG5cdFx0XHRTVE9SQUdFWyB0eXBlIF1bIGhvb2sgXSA9IFtdO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRoYW5kbGVycyA9IFNUT1JBR0VbIHR5cGUgXVsgaG9vayBdO1xuXHRcdFx0aWYgKCAhIGNvbnRleHQgKSB7XG5cdFx0XHRcdGZvciAoIGkgPSBoYW5kbGVycy5sZW5ndGg7IGktLTsgKSB7XG5cdFx0XHRcdFx0aWYgKCBoYW5kbGVyc1sgaSBdLmNhbGxiYWNrID09PSBjYWxsYmFjayApIHtcblx0XHRcdFx0XHRcdGhhbmRsZXJzLnNwbGljZSggaSwgMSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Zm9yICggaSA9IGhhbmRsZXJzLmxlbmd0aDsgaS0tOyApIHtcblx0XHRcdFx0XHRoYW5kbGVyID0gaGFuZGxlcnNbIGkgXTtcblx0XHRcdFx0XHRpZiAoIGhhbmRsZXIuY2FsbGJhY2sgPT09IGNhbGxiYWNrICYmIGhhbmRsZXIuY29udGV4dCA9PT0gY29udGV4dCApIHtcblx0XHRcdFx0XHRcdGhhbmRsZXJzLnNwbGljZSggaSwgMSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBVc2UgYW4gaW5zZXJ0IHNvcnQgZm9yIGtlZXBpbmcgb3VyIGhvb2tzIG9yZ2FuaXplZCBiYXNlZCBvbiBwcmlvcml0eS4gVGhpcyBmdW5jdGlvbiBpcyByaWRpY3Vsb3VzbHkgZmFzdGVyXG5cdCAqIHRoYW4gYnViYmxlIHNvcnQsIGV0YzogaHR0cDovL2pzcGVyZi5jb20vamF2YXNjcmlwdC1zb3J0XG5cdCAqXG5cdCAqIEBwYXJhbSBob29rcyBUaGUgY3VzdG9tIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBhcHByb3ByaWF0ZSBob29rcyB0byBwZXJmb3JtIGFuIGluc2VydCBzb3J0IG9uLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0ZnVuY3Rpb24gX2hvb2tJbnNlcnRTb3J0KCBob29rcyApIHtcblx0XHR2YXIgdG1wSG9vaywgaiwgcHJldkhvb2s7XG5cdFx0Zm9yICggdmFyIGkgPSAxLCBsZW4gPSBob29rcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcblx0XHRcdHRtcEhvb2sgPSBob29rc1sgaSBdO1xuXHRcdFx0aiA9IGk7XG5cdFx0XHR3aGlsZSAoICggcHJldkhvb2sgPSBob29rc1sgaiAtIDEgXSApICYmIHByZXZIb29rLnByaW9yaXR5ID4gdG1wSG9vay5wcmlvcml0eSApIHtcblx0XHRcdFx0aG9va3NbIGogXSA9IGhvb2tzWyBqIC0gMSBdO1xuXHRcdFx0XHQtLWo7XG5cdFx0XHR9XG5cdFx0XHRob29rc1sgaiBdID0gdG1wSG9vaztcblx0XHR9XG5cblx0XHRyZXR1cm4gaG9va3M7XG5cdH1cblxuXHQvKipcblx0ICogQWRkcyB0aGUgaG9vayB0byB0aGUgYXBwcm9wcmlhdGUgc3RvcmFnZSBjb250YWluZXJcblx0ICpcblx0ICogQHBhcmFtIHR5cGUgJ2FjdGlvbnMnIG9yICdmaWx0ZXJzJ1xuXHQgKiBAcGFyYW0gaG9vayBUaGUgaG9vayAobmFtZXNwYWNlLmlkZW50aWZpZXIpIHRvIGFkZCB0byBvdXIgZXZlbnQgbWFuYWdlclxuXHQgKiBAcGFyYW0gY2FsbGJhY2sgVGhlIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgaG9vayBpcyBleGVjdXRlZC5cblx0ICogQHBhcmFtIHByaW9yaXR5IFRoZSBwcmlvcml0eSBvZiB0aGlzIGhvb2suIE11c3QgYmUgYW4gaW50ZWdlci5cblx0ICogQHBhcmFtIFtjb250ZXh0XSBBIHZhbHVlIHRvIGJlIHVzZWQgZm9yIHRoaXNcblx0ICogQHByaXZhdGVcblx0ICovXG5cdGZ1bmN0aW9uIF9hZGRIb29rKCB0eXBlLCBob29rLCBjYWxsYmFjaywgcHJpb3JpdHksIGNvbnRleHQgKSB7XG5cdFx0dmFyIGhvb2tPYmplY3QgPSB7XG5cdFx0XHRjYWxsYmFjazogY2FsbGJhY2ssXG5cdFx0XHRwcmlvcml0eTogcHJpb3JpdHksXG5cdFx0XHRjb250ZXh0OiBjb250ZXh0XG5cdFx0fTtcblxuXHRcdC8vIFV0aWxpemUgJ3Byb3AgaXRzZWxmJyA6IGh0dHA6Ly9qc3BlcmYuY29tL2hhc293bnByb3BlcnR5LXZzLWluLXZzLXVuZGVmaW5lZC8xOVxuXHRcdHZhciBob29rcyA9IFNUT1JBR0VbIHR5cGUgXVsgaG9vayBdO1xuXHRcdGlmICggaG9va3MgKSB7XG5cdFx0XHQvLyBURU1QIEZJWCBCVUdcblx0XHRcdHZhciBoYXNTYW1lQ2FsbGJhY2sgPSBmYWxzZTtcblx0XHRcdGpRdWVyeS5lYWNoKCBob29rcywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICggdGhpcy5jYWxsYmFjayA9PT0gY2FsbGJhY2sgKSB7XG5cdFx0XHRcdFx0aGFzU2FtZUNhbGxiYWNrID0gdHJ1ZTtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblxuXHRcdFx0aWYgKCBoYXNTYW1lQ2FsbGJhY2sgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdC8vIEVORCBURU1QIEZJWCBCVUdcblxuXHRcdFx0aG9va3MucHVzaCggaG9va09iamVjdCApO1xuXHRcdFx0aG9va3MgPSBfaG9va0luc2VydFNvcnQoIGhvb2tzICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGhvb2tzID0gWyBob29rT2JqZWN0IF07XG5cdFx0fVxuXG5cdFx0U1RPUkFHRVsgdHlwZSBdWyBob29rIF0gPSBob29rcztcblx0fVxuXG5cdC8qKlxuXHQgKiBSdW5zIHRoZSBzcGVjaWZpZWQgaG9vay4gSWYgaXQgaXMgYW4gYWN0aW9uLCB0aGUgdmFsdWUgaXMgbm90IG1vZGlmaWVkIGJ1dCBpZiBpdCBpcyBhIGZpbHRlciwgaXQgaXMuXG5cdCAqXG5cdCAqIEBwYXJhbSB0eXBlICdhY3Rpb25zJyBvciAnZmlsdGVycydcblx0ICogQHBhcmFtIGhvb2sgVGhlIGhvb2sgKCBuYW1lc3BhY2UuaWRlbnRpZmllciApIHRvIGJlIHJhbi5cblx0ICogQHBhcmFtIGFyZ3MgQXJndW1lbnRzIHRvIHBhc3MgdG8gdGhlIGFjdGlvbi9maWx0ZXIuIElmIGl0J3MgYSBmaWx0ZXIsIGFyZ3MgaXMgYWN0dWFsbHkgYSBzaW5nbGUgcGFyYW1ldGVyLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0ZnVuY3Rpb24gX3J1bkhvb2soIHR5cGUsIGhvb2ssIGFyZ3MgKSB7XG5cdFx0dmFyIGhhbmRsZXJzID0gU1RPUkFHRVsgdHlwZSBdWyBob29rIF0sIGksIGxlbjtcblxuXHRcdGlmICggISBoYW5kbGVycyApIHtcblx0XHRcdHJldHVybiAoICdmaWx0ZXJzJyA9PT0gdHlwZSApID8gYXJnc1sgMCBdIDogZmFsc2U7XG5cdFx0fVxuXG5cdFx0bGVuID0gaGFuZGxlcnMubGVuZ3RoO1xuXHRcdGlmICggJ2ZpbHRlcnMnID09PSB0eXBlICkge1xuXHRcdFx0Zm9yICggaSA9IDA7IGkgPCBsZW47IGkrKyApIHtcblx0XHRcdFx0YXJnc1sgMCBdID0gaGFuZGxlcnNbIGkgXS5jYWxsYmFjay5hcHBseSggaGFuZGxlcnNbIGkgXS5jb250ZXh0LCBhcmdzICk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGZvciAoIGkgPSAwOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0XHRcdGhhbmRsZXJzWyBpIF0uY2FsbGJhY2suYXBwbHkoIGhhbmRsZXJzWyBpIF0uY29udGV4dCwgYXJncyApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiAoICdmaWx0ZXJzJyA9PT0gdHlwZSApID8gYXJnc1sgMCBdIDogdHJ1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBZGRzIGFuIGFjdGlvbiB0byB0aGUgZXZlbnQgbWFuYWdlci5cblx0ICpcblx0ICogQHBhcmFtIGFjdGlvbiBNdXN0IGNvbnRhaW4gbmFtZXNwYWNlLmlkZW50aWZpZXJcblx0ICogQHBhcmFtIGNhbGxiYWNrIE11c3QgYmUgYSB2YWxpZCBjYWxsYmFjayBmdW5jdGlvbiBiZWZvcmUgdGhpcyBhY3Rpb24gaXMgYWRkZWRcblx0ICogQHBhcmFtIFtwcmlvcml0eT0xMF0gVXNlZCB0byBjb250cm9sIHdoZW4gdGhlIGZ1bmN0aW9uIGlzIGV4ZWN1dGVkIGluIHJlbGF0aW9uIHRvIG90aGVyIGNhbGxiYWNrcyBib3VuZCB0byB0aGUgc2FtZSBob29rXG5cdCAqIEBwYXJhbSBbY29udGV4dF0gU3VwcGx5IGEgdmFsdWUgdG8gYmUgdXNlZCBmb3IgdGhpc1xuXHQgKi9cblx0ZnVuY3Rpb24gYWRkQWN0aW9uKCBhY3Rpb24sIGNhbGxiYWNrLCBwcmlvcml0eSwgY29udGV4dCApIHtcblx0XHRpZiAoICdzdHJpbmcnID09PSB0eXBlb2YgYWN0aW9uICYmICdmdW5jdGlvbicgPT09IHR5cGVvZiBjYWxsYmFjayApIHtcblx0XHRcdHByaW9yaXR5ID0gcGFyc2VJbnQoICggcHJpb3JpdHkgfHwgMTAgKSwgMTAgKTtcblx0XHRcdF9hZGRIb29rKCAnYWN0aW9ucycsIGFjdGlvbiwgY2FsbGJhY2ssIHByaW9yaXR5LCBjb250ZXh0ICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIE1ldGhvZHNBdmFpbGFibGU7XG5cdH1cblxuXHQvKipcblx0ICogUGVyZm9ybXMgYW4gYWN0aW9uIGlmIGl0IGV4aXN0cy4gWW91IGNhbiBwYXNzIGFzIG1hbnkgYXJndW1lbnRzIGFzIHlvdSB3YW50IHRvIHRoaXMgZnVuY3Rpb247IHRoZSBvbmx5IHJ1bGUgaXNcblx0ICogdGhhdCB0aGUgZmlyc3QgYXJndW1lbnQgbXVzdCBhbHdheXMgYmUgdGhlIGFjdGlvbi5cblx0ICovXG5cdGZ1bmN0aW9uIGRvQWN0aW9uKCAvKiBhY3Rpb24sIGFyZzEsIGFyZzIsIC4uLiAqLyApIHtcblx0XHR2YXIgYXJncyA9IHNsaWNlLmNhbGwoIGFyZ3VtZW50cyApO1xuXHRcdHZhciBhY3Rpb24gPSBhcmdzLnNoaWZ0KCk7XG5cblx0XHRpZiAoICdzdHJpbmcnID09PSB0eXBlb2YgYWN0aW9uICkge1xuXHRcdFx0X3J1bkhvb2soICdhY3Rpb25zJywgYWN0aW9uLCBhcmdzICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIE1ldGhvZHNBdmFpbGFibGU7XG5cdH1cblxuXHQvKipcblx0ICogUmVtb3ZlcyB0aGUgc3BlY2lmaWVkIGFjdGlvbiBpZiBpdCBjb250YWlucyBhIG5hbWVzcGFjZS5pZGVudGlmaWVyICYgZXhpc3RzLlxuXHQgKlxuXHQgKiBAcGFyYW0gYWN0aW9uIFRoZSBhY3Rpb24gdG8gcmVtb3ZlXG5cdCAqIEBwYXJhbSBbY2FsbGJhY2tdIENhbGxiYWNrIGZ1bmN0aW9uIHRvIHJlbW92ZVxuXHQgKi9cblx0ZnVuY3Rpb24gcmVtb3ZlQWN0aW9uKCBhY3Rpb24sIGNhbGxiYWNrICkge1xuXHRcdGlmICggJ3N0cmluZycgPT09IHR5cGVvZiBhY3Rpb24gKSB7XG5cdFx0XHRfcmVtb3ZlSG9vayggJ2FjdGlvbnMnLCBhY3Rpb24sIGNhbGxiYWNrICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIE1ldGhvZHNBdmFpbGFibGU7XG5cdH1cblxuXHQvKipcblx0ICogQWRkcyBhIGZpbHRlciB0byB0aGUgZXZlbnQgbWFuYWdlci5cblx0ICpcblx0ICogQHBhcmFtIGZpbHRlciBNdXN0IGNvbnRhaW4gbmFtZXNwYWNlLmlkZW50aWZpZXJcblx0ICogQHBhcmFtIGNhbGxiYWNrIE11c3QgYmUgYSB2YWxpZCBjYWxsYmFjayBmdW5jdGlvbiBiZWZvcmUgdGhpcyBhY3Rpb24gaXMgYWRkZWRcblx0ICogQHBhcmFtIFtwcmlvcml0eT0xMF0gVXNlZCB0byBjb250cm9sIHdoZW4gdGhlIGZ1bmN0aW9uIGlzIGV4ZWN1dGVkIGluIHJlbGF0aW9uIHRvIG90aGVyIGNhbGxiYWNrcyBib3VuZCB0byB0aGUgc2FtZSBob29rXG5cdCAqIEBwYXJhbSBbY29udGV4dF0gU3VwcGx5IGEgdmFsdWUgdG8gYmUgdXNlZCBmb3IgdGhpc1xuXHQgKi9cblx0ZnVuY3Rpb24gYWRkRmlsdGVyKCBmaWx0ZXIsIGNhbGxiYWNrLCBwcmlvcml0eSwgY29udGV4dCApIHtcblx0XHRpZiAoICdzdHJpbmcnID09PSB0eXBlb2YgZmlsdGVyICYmICdmdW5jdGlvbicgPT09IHR5cGVvZiBjYWxsYmFjayApIHtcblx0XHRcdHByaW9yaXR5ID0gcGFyc2VJbnQoICggcHJpb3JpdHkgfHwgMTAgKSwgMTAgKTtcblx0XHRcdF9hZGRIb29rKCAnZmlsdGVycycsIGZpbHRlciwgY2FsbGJhY2ssIHByaW9yaXR5LCBjb250ZXh0ICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIE1ldGhvZHNBdmFpbGFibGU7XG5cdH1cblxuXHQvKipcblx0ICogUGVyZm9ybXMgYSBmaWx0ZXIgaWYgaXQgZXhpc3RzLiBZb3Ugc2hvdWxkIG9ubHkgZXZlciBwYXNzIDEgYXJndW1lbnQgdG8gYmUgZmlsdGVyZWQuIFRoZSBvbmx5IHJ1bGUgaXMgdGhhdFxuXHQgKiB0aGUgZmlyc3QgYXJndW1lbnQgbXVzdCBhbHdheXMgYmUgdGhlIGZpbHRlci5cblx0ICovXG5cdGZ1bmN0aW9uIGFwcGx5RmlsdGVycyggLyogZmlsdGVyLCBmaWx0ZXJlZCBhcmcsIGFyZzIsIC4uLiAqLyApIHtcblx0XHR2YXIgYXJncyA9IHNsaWNlLmNhbGwoIGFyZ3VtZW50cyApO1xuXHRcdHZhciBmaWx0ZXIgPSBhcmdzLnNoaWZ0KCk7XG5cblx0XHRpZiAoICdzdHJpbmcnID09PSB0eXBlb2YgZmlsdGVyICkge1xuXHRcdFx0cmV0dXJuIF9ydW5Ib29rKCAnZmlsdGVycycsIGZpbHRlciwgYXJncyApO1xuXHRcdH1cblxuXHRcdHJldHVybiBNZXRob2RzQXZhaWxhYmxlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlbW92ZXMgdGhlIHNwZWNpZmllZCBmaWx0ZXIgaWYgaXQgY29udGFpbnMgYSBuYW1lc3BhY2UuaWRlbnRpZmllciAmIGV4aXN0cy5cblx0ICpcblx0ICogQHBhcmFtIGZpbHRlciBUaGUgYWN0aW9uIHRvIHJlbW92ZVxuXHQgKiBAcGFyYW0gW2NhbGxiYWNrXSBDYWxsYmFjayBmdW5jdGlvbiB0byByZW1vdmVcblx0ICovXG5cdGZ1bmN0aW9uIHJlbW92ZUZpbHRlciggZmlsdGVyLCBjYWxsYmFjayApIHtcblx0XHRpZiAoICdzdHJpbmcnID09PSB0eXBlb2YgZmlsdGVyICkge1xuXHRcdFx0X3JlbW92ZUhvb2soICdmaWx0ZXJzJywgZmlsdGVyLCBjYWxsYmFjayApO1xuXHRcdH1cblxuXHRcdHJldHVybiBNZXRob2RzQXZhaWxhYmxlO1xuXHR9XG5cblx0LyoqXG5cdCAqIE1haW50YWluIGEgcmVmZXJlbmNlIHRvIHRoZSBvYmplY3Qgc2NvcGUgc28gb3VyIHB1YmxpYyBtZXRob2RzIG5ldmVyIGdldCBjb25mdXNpbmcuXG5cdCAqL1xuXHRNZXRob2RzQXZhaWxhYmxlID0ge1xuXHRcdHJlbW92ZUZpbHRlcjogcmVtb3ZlRmlsdGVyLFxuXHRcdGFwcGx5RmlsdGVyczogYXBwbHlGaWx0ZXJzLFxuXHRcdGFkZEZpbHRlcjogYWRkRmlsdGVyLFxuXHRcdHJlbW92ZUFjdGlvbjogcmVtb3ZlQWN0aW9uLFxuXHRcdGRvQWN0aW9uOiBkb0FjdGlvbixcblx0XHRhZGRBY3Rpb246IGFkZEFjdGlvblxuXHR9O1xuXG5cdC8vIHJldHVybiBhbGwgb2YgdGhlIHB1YmxpY2x5IGF2YWlsYWJsZSBtZXRob2RzXG5cdHJldHVybiBNZXRob2RzQXZhaWxhYmxlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudE1hbmFnZXI7XG4iLCJ2YXIgSG90S2V5cyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgaG90S2V5c0hhbmRsZXJzID0gdGhpcy5ob3RLZXlzSGFuZGxlcnMgPSB7fTtcblxuXHR2YXIgaXNNYWMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gLTEgIT09IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZiggJ01hYyBPUyBYJyApO1xuXHR9O1xuXG5cdHZhciBhcHBseUhvdEtleSA9IGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHR2YXIgaGFuZGxlcnMgPSBob3RLZXlzSGFuZGxlcnNbIGV2ZW50LndoaWNoIF07XG5cblx0XHRpZiAoICEgaGFuZGxlcnMgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0alF1ZXJ5LmVhY2goIGhhbmRsZXJzLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBoYW5kbGVyID0gdGhpcztcblxuXHRcdFx0aWYgKCBoYW5kbGVyLmlzV29ydGhIYW5kbGluZyAmJiAhIGhhbmRsZXIuaXNXb3J0aEhhbmRsaW5nKCBldmVudCApICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZpeCBmb3Igc29tZSBrZXlib2FyZCBzb3VyY2VzIHRoYXQgY29uc2lkZXIgYWx0IGtleSBhcyBjdHJsIGtleVxuXHRcdFx0aWYgKCAhIGhhbmRsZXIuYWxsb3dBbHRLZXkgJiYgZXZlbnQuYWx0S2V5ICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdGhhbmRsZXIuaGFuZGxlKCBldmVudCApO1xuXHRcdH0gKTtcblx0fTtcblxuXHR0aGlzLmlzQ29udHJvbEV2ZW50ID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdHJldHVybiBldmVudFsgaXNNYWMoKSA/ICdtZXRhS2V5JyA6ICdjdHJsS2V5JyBdO1xuXHR9O1xuXG5cdHRoaXMuYWRkSG90S2V5SGFuZGxlciA9IGZ1bmN0aW9uKCBrZXlDb2RlLCBoYW5kbGVyTmFtZSwgaGFuZGxlciApIHtcblx0XHRpZiAoICEgaG90S2V5c0hhbmRsZXJzWyBrZXlDb2RlIF0gKSB7XG5cdFx0XHRob3RLZXlzSGFuZGxlcnNbIGtleUNvZGUgXSA9IHt9O1xuXHRcdH1cblxuXHRcdGhvdEtleXNIYW5kbGVyc1sga2V5Q29kZSBdWyBoYW5kbGVyTmFtZSBdID0gaGFuZGxlcjtcblx0fTtcblxuXHR0aGlzLmJpbmRMaXN0ZW5lciA9IGZ1bmN0aW9uKCAkbGlzdGVuZXIgKSB7XG5cdFx0JGxpc3RlbmVyLm9uKCAna2V5ZG93bicsIGFwcGx5SG90S2V5ICk7XG5cdH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBIb3RLZXlzKCk7XG4iLCJ2YXIgTW9kdWxlID0gZnVuY3Rpb24oKSB7XG5cdHZhciAkID0galF1ZXJ5LFxuXHRcdGluc3RhbmNlUGFyYW1zID0gYXJndW1lbnRzLFxuXHRcdHNlbGYgPSB0aGlzLFxuXHRcdHNldHRpbmdzLFxuXHRcdGV2ZW50cyA9IHt9O1xuXG5cdHZhciBlbnN1cmVDbG9zdXJlTWV0aG9kcyA9IGZ1bmN0aW9uKCkge1xuXHRcdCQuZWFjaCggc2VsZiwgZnVuY3Rpb24oIG1ldGhvZE5hbWUgKSB7XG5cdFx0XHR2YXIgb2xkTWV0aG9kID0gc2VsZlsgbWV0aG9kTmFtZSBdO1xuXG5cdFx0XHRpZiAoICdmdW5jdGlvbicgIT09IHR5cGVvZiBvbGRNZXRob2QgKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0c2VsZlsgbWV0aG9kTmFtZSBdID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBvbGRNZXRob2QuYXBwbHkoIHNlbGYsIGFyZ3VtZW50cyApO1xuXHRcdFx0fTtcblx0XHR9KTtcblx0fTtcblxuXHR2YXIgaW5pdFNldHRpbmdzID0gZnVuY3Rpb24oKSB7XG5cdFx0c2V0dGluZ3MgPSBzZWxmLmdldERlZmF1bHRTZXR0aW5ncygpO1xuXG5cdFx0dmFyIGluc3RhbmNlU2V0dGluZ3MgPSBpbnN0YW5jZVBhcmFtc1swXTtcblxuXHRcdGlmICggaW5zdGFuY2VTZXR0aW5ncyApIHtcblx0XHRcdCQuZXh0ZW5kKCBzZXR0aW5ncywgaW5zdGFuY2VTZXR0aW5ncyApO1xuXHRcdH1cblx0fTtcblxuXHR2YXIgaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdHNlbGYuX19jb25zdHJ1Y3QuYXBwbHkoIHNlbGYsIGluc3RhbmNlUGFyYW1zICk7XG5cblx0XHRlbnN1cmVDbG9zdXJlTWV0aG9kcygpO1xuXG5cdFx0aW5pdFNldHRpbmdzKCk7XG5cblx0XHRzZWxmLnRyaWdnZXIoICdpbml0JyApO1xuXHR9O1xuXG5cdHRoaXMuZ2V0SXRlbXMgPSBmdW5jdGlvbiggaXRlbXMsIGl0ZW1LZXkgKSB7XG5cdFx0aWYgKCBpdGVtS2V5ICkge1xuXHRcdFx0dmFyIGtleVN0YWNrID0gaXRlbUtleS5zcGxpdCggJy4nICksXG5cdFx0XHRcdGN1cnJlbnRLZXkgPSBrZXlTdGFjay5zcGxpY2UoIDAsIDEgKTtcblxuXHRcdFx0aWYgKCAhIGtleVN0YWNrLmxlbmd0aCApIHtcblx0XHRcdFx0cmV0dXJuIGl0ZW1zWyBjdXJyZW50S2V5IF07XG5cdFx0XHR9XG5cblx0XHRcdGlmICggISBpdGVtc1sgY3VycmVudEtleSBdICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0aGlzLmdldEl0ZW1zKCAgaXRlbXNbIGN1cnJlbnRLZXkgXSwga2V5U3RhY2suam9pbiggJy4nICkgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gaXRlbXM7XG5cdH07XG5cblx0dGhpcy5nZXRTZXR0aW5ncyA9IGZ1bmN0aW9uKCBzZXR0aW5nICkge1xuXHRcdHJldHVybiB0aGlzLmdldEl0ZW1zKCBzZXR0aW5ncywgc2V0dGluZyApO1xuXHR9O1xuXG5cdHRoaXMuc2V0U2V0dGluZ3MgPSBmdW5jdGlvbiggc2V0dGluZ0tleSwgdmFsdWUsIHNldHRpbmdzQ29udGFpbmVyICkge1xuXHRcdGlmICggISBzZXR0aW5nc0NvbnRhaW5lciApIHtcblx0XHRcdHNldHRpbmdzQ29udGFpbmVyID0gc2V0dGluZ3M7XG5cdFx0fVxuXG5cdFx0aWYgKCAnb2JqZWN0JyA9PT0gdHlwZW9mIHNldHRpbmdLZXkgKSB7XG5cdFx0XHQkLmV4dGVuZCggc2V0dGluZ3NDb250YWluZXIsIHNldHRpbmdLZXkgKTtcblxuXHRcdFx0cmV0dXJuIHNlbGY7XG5cdFx0fVxuXG5cdFx0dmFyIGtleVN0YWNrID0gc2V0dGluZ0tleS5zcGxpdCggJy4nICksXG5cdFx0XHRjdXJyZW50S2V5ID0ga2V5U3RhY2suc3BsaWNlKCAwLCAxICk7XG5cblx0XHRpZiAoICEga2V5U3RhY2subGVuZ3RoICkge1xuXHRcdFx0c2V0dGluZ3NDb250YWluZXJbIGN1cnJlbnRLZXkgXSA9IHZhbHVlO1xuXG5cdFx0XHRyZXR1cm4gc2VsZjtcblx0XHR9XG5cblx0XHRpZiAoICEgc2V0dGluZ3NDb250YWluZXJbIGN1cnJlbnRLZXkgXSApIHtcblx0XHRcdHNldHRpbmdzQ29udGFpbmVyWyBjdXJyZW50S2V5IF0gPSB7fTtcblx0XHR9XG5cblx0XHRyZXR1cm4gc2VsZi5zZXRTZXR0aW5ncygga2V5U3RhY2suam9pbiggJy4nICksIHZhbHVlLCBzZXR0aW5nc0NvbnRhaW5lclsgY3VycmVudEtleSBdICk7XG5cdH07XG5cblx0dGhpcy5mb3JjZU1ldGhvZEltcGxlbWVudGF0aW9uID0gZnVuY3Rpb24oIG1ldGhvZEFyZ3VtZW50cyApIHtcblx0XHR2YXIgZnVuY3Rpb25OYW1lID0gbWV0aG9kQXJndW1lbnRzLmNhbGxlZS5uYW1lO1xuXG5cdFx0dGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCAnVGhlIG1ldGhvZCAnICsgZnVuY3Rpb25OYW1lICsgJyBtdXN0IHRvIGJlIGltcGxlbWVudGVkIGluIHRoZSBpbmhlcml0b3IgY2hpbGQuJyApO1xuXHR9O1xuXG5cdHRoaXMub24gPSBmdW5jdGlvbiggZXZlbnROYW1lLCBjYWxsYmFjayApIHtcblx0XHRpZiAoICEgZXZlbnRzWyBldmVudE5hbWUgXSApIHtcblx0XHRcdGV2ZW50c1sgZXZlbnROYW1lIF0gPSBbXTtcblx0XHR9XG5cblx0XHRldmVudHNbIGV2ZW50TmFtZSBdLnB1c2goIGNhbGxiYWNrICk7XG5cblx0XHRyZXR1cm4gc2VsZjtcblx0fTtcblxuXHR0aGlzLm9mZiA9IGZ1bmN0aW9uKCBldmVudE5hbWUsIGNhbGxiYWNrICkge1xuXHRcdGlmICggISBldmVudHNbIGV2ZW50TmFtZSBdICkge1xuXHRcdFx0cmV0dXJuIHNlbGY7XG5cdFx0fVxuXG5cdFx0aWYgKCAhIGNhbGxiYWNrICkge1xuXHRcdFx0ZGVsZXRlIGV2ZW50c1sgZXZlbnROYW1lIF07XG5cblx0XHRcdHJldHVybiBzZWxmO1xuXHRcdH1cblxuXHRcdHZhciBjYWxsYmFja0luZGV4ID0gZXZlbnRzWyBldmVudE5hbWUgXS5pbmRleE9mKCBjYWxsYmFjayApO1xuXG5cdFx0aWYgKCAtMSAhPT0gY2FsbGJhY2tJbmRleCApIHtcblx0XHRcdGRlbGV0ZSBldmVudHNbIGV2ZW50TmFtZSBdWyBjYWxsYmFja0luZGV4IF07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHNlbGY7XG5cdH07XG5cblx0dGhpcy50cmlnZ2VyID0gZnVuY3Rpb24oIGV2ZW50TmFtZSApIHtcblx0XHR2YXIgbWV0aG9kTmFtZSA9ICdvbicgKyBldmVudE5hbWVbIDAgXS50b1VwcGVyQ2FzZSgpICsgZXZlbnROYW1lLnNsaWNlKCAxICksXG5cdFx0XHRwYXJhbXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzLCAxICk7XG5cblx0XHRpZiAoIHNlbGZbIG1ldGhvZE5hbWUgXSApIHtcblx0XHRcdHNlbGZbIG1ldGhvZE5hbWUgXS5hcHBseSggc2VsZiwgcGFyYW1zICk7XG5cdFx0fVxuXG5cdFx0dmFyIGNhbGxiYWNrcyA9IGV2ZW50c1sgZXZlbnROYW1lIF07XG5cblx0XHRpZiAoICEgY2FsbGJhY2tzICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdCQuZWFjaCggY2FsbGJhY2tzLCBmdW5jdGlvbiggaW5kZXgsIGNhbGxiYWNrICkge1xuXHRcdFx0Y2FsbGJhY2suYXBwbHkoIHNlbGYsIHBhcmFtcyApO1xuXHRcdH0gKTtcblx0fTtcblxuXHRpbml0KCk7XG59O1xuXG5Nb2R1bGUucHJvdG90eXBlLl9fY29uc3RydWN0ID0gZnVuY3Rpb24oKSB7fTtcblxuTW9kdWxlLnByb3RvdHlwZS5nZXREZWZhdWx0U2V0dGluZ3MgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHt9O1xufTtcblxuTW9kdWxlLmV4dGVuZHNDb3VudCA9IDA7XG5cbk1vZHVsZS5leHRlbmQgPSBmdW5jdGlvbiggcHJvcGVydGllcyApIHtcblx0dmFyICQgPSBqUXVlcnksXG5cdFx0cGFyZW50ID0gdGhpcztcblxuXHR2YXIgY2hpbGQgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gcGFyZW50LmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcblx0fTtcblxuXHQkLmV4dGVuZCggY2hpbGQsIHBhcmVudCApO1xuXG5cdGNoaWxkLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoICQuZXh0ZW5kKCB7fSwgcGFyZW50LnByb3RvdHlwZSwgcHJvcGVydGllcyApICk7XG5cblx0Y2hpbGQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY2hpbGQ7XG5cblx0Lypcblx0ICogQ29uc3RydWN0b3IgSUQgaXMgdXNlZCB0byBzZXQgYW4gdW5pcXVlIElEXG4gICAgICogdG8gZXZlcnkgZXh0ZW5kIG9mIHRoZSBNb2R1bGUuXG4gICAgICpcblx0ICogSXQncyB1c2VmdWwgaW4gc29tZSBjYXNlcyBzdWNoIGFzIHVuaXF1ZVxuXHQgKiBsaXN0ZW5lciBmb3IgZnJvbnRlbmQgaGFuZGxlcnMuXG5cdCAqL1xuXHR2YXIgY29uc3RydWN0b3JJRCA9ICsrTW9kdWxlLmV4dGVuZHNDb3VudDtcblxuXHRjaGlsZC5wcm90b3R5cGUuZ2V0Q29uc3RydWN0b3JJRCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBjb25zdHJ1Y3RvcklEO1xuXHR9O1xuXG5cdGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7XG5cblx0cmV0dXJuIGNoaWxkO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNb2R1bGU7XG4iLCJ2YXIgTW9kdWxlID0gcmVxdWlyZSggJ3FhemFuYS11dGlscy9tb2R1bGUnICksXG5cdFZpZXdNb2R1bGU7XG5cblZpZXdNb2R1bGUgPSBNb2R1bGUuZXh0ZW5kKCB7XG5cdGVsZW1lbnRzOiBudWxsLFxuXG5cdGdldERlZmF1bHRFbGVtZW50czogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHt9O1xuXHR9LFxuXG5cdGJpbmRFdmVudHM6IGZ1bmN0aW9uKCkge30sXG5cblx0b25Jbml0OiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmluaXRFbGVtZW50cygpO1xuXG5cdFx0dGhpcy5iaW5kRXZlbnRzKCk7XG5cdH0sXG5cblx0aW5pdEVsZW1lbnRzOiBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmVsZW1lbnRzID0gdGhpcy5nZXREZWZhdWx0RWxlbWVudHMoKTtcblx0fVxufSApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdNb2R1bGU7XG4iXX0=
