/* global qazanaFrontendConfig */
( function( $ ) {
	var elements = {},
		EventManager = require( 'qazana-utils/hooks' ),
		Module = require( 'qazana-frontend/handler-module' ),
		ElementsHandler = require( 'qazana-frontend/elements-handler' ),
        YouTubeModule = require( 'qazana-frontend/utils/youtube' ),
        VimeoModule = require( 'qazana-frontend/utils/vimeo' ),
		AnchorsModule = require( 'qazana-frontend/utils/anchors' ),
		LightboxModule = require( 'qazana-frontend/utils/lightbox' );
		//CarouselModule = require( 'qazana-frontend/utils/carousel' );

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

			elements.$wpAdminBar = elements.$document.find( '#wpadminbar' );
		};

		var bindEvents = function() {
			elements.$window.on( 'resize', setDeviceModeData );
		};

		var initOnReadyComponents = function() {
			self.utils = {
                youtube: new YouTubeModule(),
                vimeo: new VimeoModule(),
				anchors: new AnchorsModule(),
				lightbox: new LightboxModule()
				// carousel: new CarouselModule()
			};

			self.modules = {
				StretchElement: require( 'qazana-frontend/modules/stretch-element' ),
				Masonry: require( 'qazana-utils/masonry' )
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

		var addIeCompatibility = function() {
			var isIE = 'Microsoft Internet Explorer' === navigator.appName || !! navigator.userAgent.match( /Trident/g ) || !! navigator.userAgent.match( /MSIE/g ) || !! navigator.userAgent.match( /rv:11/ ),
				el = document.createElement( 'div' ),
				supportsGrid = 'string' === typeof el.style.grid;

			if ( ! isIE && supportsGrid ) {
				return;
			}
			elements.$body.addClass( 'qazana-msie' );

			var msieCss = '<link rel="stylesheet" id="qazana-frontend-css-msie" href="' + qazanaFrontend.config.urls.assets + 'css/frontend-msie.min.css?' + qazanaFrontend.config.version + '" type="text/css" />';

			elements.$body.append( msieCss );
		};

		this.init = function() {
			self.hooks = new EventManager();

			initElements();

			addIeCompatibility();

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

			this.removeListeners( listenerID, event, to );

			if ( to instanceof jQuery ) {
				var eventNS = event + '.' + listenerID;

				to.on( eventNS, callback );
			} else {
				to.on( event, callback, listenerID );
			}
		};

		this.removeListeners = function( listenerID, event, callback, from ) {
			if ( ! from ) {
				from = self.getElements( '$window' );
			}

			if ( from instanceof jQuery ) {
				var eventNS = event + '.' + listenerID;

				from.off( eventNS, callback );
			} else {
				from.off( event, callback, listenerID );
			}
		};

		this.getCurrentDeviceMode = function() {
			return getComputedStyle( elements.$qazana[ 0 ], ':after' ).content.replace( /"/g, '' );
		};

		this.waypoint = function( $element, callback, options ) {
			var defaultOptions = {
				offset: '100%',
				triggerOnce: true,
			};

			options = $.extend( defaultOptions, options );

			var correctCallback = function() {
				var element = this.element || this,
					result = callback.apply( element, arguments );

				// If is Waypoint new API and is frontend
				if ( options.triggerOnce && this.destroy ) {
					this.destroy();
				}

				return result;
			};

			return $element.qazanaWaypoint( correctCallback, options );
		};
	};

	window.qazanaFrontend = new QazanaFrontend();
} )( jQuery );

if ( ! qazanaFrontend.isEditMode() ) {
	jQuery( qazanaFrontend.init );
}
