/* global QazanaConfig */
import Heartbeat from './utils/heartbeat';
import Navigator from './regions/navigator/navigator';

Marionette.TemplateCache.prototype.compileTemplate = function( rawTemplate, options ) {
	options = {
		evaluate: /<#([\s\S]+?)#>/g,
		interpolate: /{{{([\s\S]+?)}}}/g,
		escape: /{{([^}]+?)}}(?!})/g,
	};

	return _.template( rawTemplate, options );
};

var App = Marionette.Application.extend( {
	previewLoadedOnce: false,

	helpers: require( 'qazana-editor-utils/helpers' ),
	imagesManager: require( 'qazana-editor-utils/images-manager' ),
	debug: require( 'qazana-editor-utils/debug' ),
	schemes: require( 'qazana-editor-utils/schemes' ),
	presetsFactory: require( 'qazana-editor-utils/presets-factory' ),
	templates: require( 'qazana-templates/manager' ),
	ajax: require( 'qazana-editor-utils/ajax' ),
	conditions: require( 'qazana-editor-utils/conditions' ),
	hotKeys: require( 'qazana-utils/hot-keys' ),
	history: require( 'qazana-extensions/history/assets/js/module' ),

	channels: {
		editor: Backbone.Radio.channel( 'QAZANA:editor' ),
		data: Backbone.Radio.channel( 'QAZANA:data' ),
		panelElements: Backbone.Radio.channel( 'QAZANA:panelElements' ),
		dataEditMode: Backbone.Radio.channel( 'QAZANA:editmode' ),
		deviceMode: Backbone.Radio.channel( 'QAZANA:deviceMode' ),
		templates: Backbone.Radio.channel( 'QAZANA:templates' ),
	},

	// Exporting modules that can be used externally
	modules: {
		Module: require( 'qazana-utils/module' ),
		components: {
			templateLibrary: {
				views: {
					parts: {
						headerParts: {
							logo: require( 'qazana-templates/views/parts/header-parts/logo' ),
						},
					},
					BaseModalLayout: require( 'qazana-templates/views/base-modal-layout' ),
				},
			},
			saver: {
				behaviors: {
                    HeaderSaver: require( './components/saver/behaviors/header-saver' ),
					FooterSaver: require( './components/saver/behaviors/footer-saver' ),
				},
			},
		},
		controls: {
			Animation: require( 'qazana-controls/select2' ),
			Base: require( 'qazana-controls/base' ),
			BaseData: require( 'qazana-controls/base-data' ),
			BaseMultiple: require( 'qazana-controls/base-multiple' ),
			Box_shadow: require( 'qazana-controls/box-shadow' ),
			Button: require( 'qazana-controls/button' ),
			Choose: require( 'qazana-controls/choose' ),
			Code: require( 'qazana-controls/code' ),
			Color: require( 'qazana-controls/color' ),
			Date_time: require( 'qazana-controls/date-time' ),
			Dimensions: require( 'qazana-controls/dimensions' ),
			Font: require( 'qazana-controls/font' ),
			Gallery: require( 'qazana-controls/gallery' ),
			Hover_animation: require( 'qazana-controls/select2' ),
			Icon: require( 'qazana-controls/icon' ),
			Image_dimensions: require( 'qazana-controls/image-dimensions' ),
			Media: require( 'qazana-controls/media' ),
			Number: require( 'qazana-controls/number' ),
			Order: require( 'qazana-controls/order' ),
			Query: require( 'qazana-controls/query' ),
			Popover_toggle: require( 'qazana-controls/popover-toggle' ),
			Repeater: require( 'qazana-controls/repeater' ),
			RepeaterRow: require( 'qazana-controls/repeater-row' ),
			Section: require( 'qazana-controls/section' ),
			Select: require( 'qazana-controls/select' ),
			Select2: require( 'qazana-controls/select2' ),
			Slider: require( 'qazana-controls/slider' ),
			Structure: require( 'qazana-controls/structure' ),
			Switcher: require( 'qazana-controls/switcher' ),
			Tab: require( 'qazana-controls/tab' ),
			Text_shadow: require( 'qazana-controls/box-shadow' ),
			Url: require( 'qazana-controls/url' ),
			Wp_widget: require( 'qazana-controls/wp_widget' ),
			Wysiwyg: require( 'qazana-controls/wysiwyg' ),
		},
		elements: {
			models: {
				BaseSettings: require( 'qazana-elements/models/base-settings' ),
				Element: require( 'qazana-elements/models/element' ),
			},
			views: {
				Widget: require( 'qazana-elements/views/widget' ),
			},
		},
		layouts: {
			panel: {
				pages: {
					elements: {
						views: {
							Global: require( 'qazana-panel/pages/elements/views/global' ),
							Elements: require( 'qazana-panel/pages/elements/views/elements' ),
						},
					},
					menu: {
						Menu: require( 'qazana-panel/pages/menu/menu' ),
					},
				},
			},
		},
		views: {
			ControlsStack: require( 'qazana-views/controls-stack' ),
		},
	},

	backgroundClickListeners: {
		popover: {
			element: '.qazana-controls-popover',
			ignore: '.qazana-control-popover-toggle-toggle, .qazana-control-popover-toggle-toggle-label, .select2-container',
		},
		tagsList: {
			element: '.qazana-tags-list',
			ignore: '.qazana-control-dynamic-switcher',
		},
	},

	userCan: function( capability ) {
		return -1 === this.config.user.restrictions.indexOf( capability );
	},

	_defaultDeviceMode: 'desktop',

	addControlView: function( controlID, ControlView ) {
		this.modules.controls[ qazana.helpers.firstLetterUppercase( controlID ) ] = ControlView;
	},

	checkEnvCompatibility: function() {
		return this.envData.gecko || this.envData.webkit;
	},

	getElementData: function( model ) {
		var elType = model.get( 'elType' );

		if ( 'widget' === elType ) {
			var widgetType = model.get( 'widgetType' );

			if ( ! this.config.widgets[ widgetType ] ) {
				return false;
			}

			return this.config.widgets[ widgetType ];
		}

		if ( ! this.config.elements[ elType ] ) {
			return false;
		}

		var elementConfig = this.helpers.cloneObject( this.config.elements[ elType ] );

		if ( 'section' === elType && model.get( 'isInner' ) ) {
			elementConfig.title = qazana.translate( 'inner_section' );
		}

		return elementConfig;
	},

	getElementControls: function( modelElement ) {
		var self = this,
			elementData = self.getElementData( modelElement );

		if ( ! elementData ) {
			return false;
		}

		var isInner = modelElement.get( 'isInner' ),
			controls = {};

		_.each( elementData.controls, function( controlData, controlKey ) {
			if ( ( isInner && controlData.hide_in_inner ) || ( ! isInner && controlData.hide_in_top ) ) {
				return;
			}

			controls[ controlKey ] = controlData;
		} );

		return controls;
	},

	mergeControlsSettings: function( controls ) {
		_.each( controls, ( controlData, controlKey ) => {
			controls[ controlKey ] = jQuery.extend( true, {}, this.config.controls[ controlData.type ], controlData );
		} );

		return controls;
	},

	getControlView: function( controlID ) {
		var capitalizedControlName = qazana.helpers.firstLetterUppercase( controlID ),
			View = this.modules.controls[ capitalizedControlName ];

		if ( ! View ) {
			var controlData = this.config.controls[ controlID ],
				isUIControl = -1 !== controlData.features.indexOf( 'ui' );

			View = this.modules.controls[ isUIControl ? 'Base' : 'BaseData' ];
		}

		return View;
	},

	getPanelView: function() {
		return this.panel.currentView;
	},

	getPreviewView: function() {
		return this.sections.currentView;
	},

	initEnvData: function() {
		this.envData = _.pick( tinymce.Env, [ 'desktop', 'mac', 'webkit', 'gecko', 'ie', 'opera' ] );
	},

	initComponents: function() {
		var EventManager = require( 'qazana-utils/hooks' ),
			DynamicTags = require( 'qazana-dynamic-tags/manager' ),
			Settings = require( 'qazana-editor/components/settings/settings' ),
			Saver = require( 'qazana-editor/components/saver/manager' ),
			Notifications = require( 'qazana-editor-utils/notifications' ),
			DocumentConditions = require( './components/document-conditions/manager' );

		this.hooks = new EventManager();

		this.saver = new Saver();

		this.settings = new Settings();

		this.dynamicTags = new DynamicTags();

		this.templates.init();

		this.initDialogsManager();

		this.documentConditions = new DocumentConditions();

		this.notifications = new Notifications();

		this.ajax.init();

		this.initHotKeys();

		this.initEnvData();
	},

	initDialogsManager: function() {
		this.dialogsManager = new DialogsManager.Instance();
	},

	initElements: function() {
		var ElementCollection = require( 'qazana-elements/collections/elements' ),
			config = this.config.data;

		// If it's an reload, use the not-saved data
		if ( this.elements ) {
			config = this.elements.toJSON();
		}

		this.elements = new ElementCollection( config );

		this.elementsModel = new Backbone.Model( {
			elements: this.elements,
		} );
	},

	initPreview: function() {
		var $ = jQuery;

		this.$previewWrapper = $( '#qazana-preview' );

		this.$previewResponsiveWrapper = $( '#qazana-preview-responsive-wrapper' );

		var previewIframeId = 'qazana-preview-iframe';

		// Make sure the iFrame does not exist.
		if ( ! this.$preview ) {
			this.$preview = $( '<iframe>', {
				id: previewIframeId,
				src: this.config.document.urls.preview,
				allowfullscreen: 1,
			} );

			this.$previewResponsiveWrapper.append( this.$preview );
		}

		this.$preview.on( 'load', this.onPreviewLoaded.bind( this ) );
	},

	initFrontend: function() {
		var frontendWindow = this.$preview[ 0 ].contentWindow;

		window.qazanaFrontend = frontendWindow.qazanaFrontend;

		frontendWindow.qazana = this;

		qazanaFrontend.init();

		qazanaFrontend.elementsHandler.initHandlers();

		this.trigger( 'frontend:init' );
	},

	initClearPageDialog: function() {
		var self = this,
			dialog;

		self.getClearPageDialog = function() {
			if ( dialog ) {
				return dialog;
			}

			dialog = this.dialogsManager.createWidget( 'confirm', {
				id: 'qazana-clear-page-dialog',
				headerMessage: qazana.translate( 'clear_page' ),
				message: qazana.translate( 'dialog_confirm_clear_page' ),
				position: {
					my: 'center center',
					at: 'center center',
				},
				strings: {
					confirm: qazana.translate( 'delete' ),
					cancel: qazana.translate( 'cancel' ),
				},
				onConfirm: function() {
					self.elements.reset();
				},
			} );

			return dialog;
		};
	},

	initHotKeys: function() {
		var keysDictionary = {
			c: 67,
			d: 68,
			i: 73,
			l: 76,
			m: 77,
			p: 80,
			s: 83,
			v: 86,
			del: 46,
		};

		var $ = jQuery,
			hotKeysHandlers = {},
			hotKeysManager = this.hotKeys;

		hotKeysHandlers[ keysDictionary.c ] = {
			copyElement: {
				isWorthHandling: function( event ) {
					if ( ! hotKeysManager.isControlEvent( event ) ) {
						return false;
					}

					var isEditorOpen = 'editor' === qazana.getPanelView().getCurrentPageName();

					if ( ! isEditorOpen ) {
						return false;
					}

					var frontendWindow = qazanaFrontend.getElements( 'window' ),
						textSelection = getSelection() + frontendWindow.getSelection();

					if ( ! textSelection && qazana.envData.gecko ) {
						textSelection = [ window, frontendWindow ].some( function( window ) {
							var activeElement = window.document.activeElement;

							if ( ! activeElement || -1 === [ 'INPUT', 'TEXTAREA' ].indexOf( activeElement.tagName ) ) {
								return;
							}

							var originalInputType;

							// Some of input types can't retrieve a selection
							if ( 'INPUT' === activeElement.tagName ) {
								originalInputType = activeElement.type;

								activeElement.type = 'text';
							}

							var selection = activeElement.value.substring( activeElement.selectionStart, activeElement.selectionEnd );

							activeElement.type = originalInputType;

							return ! ! selection;
						} );
					}

					return ! textSelection;
				},
				handle: function() {
					qazana.getPanelView().getCurrentPageView().getOption( 'editedElementView' ).copy();
				},
			},
		};

		hotKeysHandlers[ keysDictionary.d ] = {
			duplicateElement: {
				isWorthHandling: function( event ) {
					return hotKeysManager.isControlEvent( event );
				},
				handle: function() {
					var panel = qazana.getPanelView();

					if ( 'editor' !== panel.getCurrentPageName() ) {
						return;
					}

					panel.getCurrentPageView().getOption( 'editedElementView' ).duplicate();
				},
			},
		};

		hotKeysHandlers[ keysDictionary.i ] = {
			navigator: {
				isWorthHandling: function( event ) {
					return hotKeysManager.isControlEvent( event ) && 'edit' === qazana.channels.dataEditMode.request( 'activeMode' );
				},
				handle: function() {
					if ( qazana.navigator.storage.visible ) {
						qazana.navigator.close();
					} else {
						qazana.navigator.open();
					}
				},
			},
		};

		hotKeysHandlers[ keysDictionary.l ] = {
			showTemplateLibrary: {
				isWorthHandling: function( event ) {
					return hotKeysManager.isControlEvent( event ) && event.shiftKey;
				},
				handle: function() {
					qazana.templates.startModal();
				},
			},
		};

		hotKeysHandlers[ keysDictionary.m ] = {
			changeDeviceMode: {
				devices: [ 'desktop', 'tablet', 'mobile' ],
				isWorthHandling: function( event ) {
					return hotKeysManager.isControlEvent( event ) && event.shiftKey;
				},
				handle: function() {
					var currentDeviceMode = qazana.channels.deviceMode.request( 'currentMode' ),
						modeIndex = this.devices.indexOf( currentDeviceMode );

					modeIndex++;

					if ( modeIndex >= this.devices.length ) {
						modeIndex = 0;
					}

					qazana.changeDeviceMode( this.devices[ modeIndex ] );
				},
			},
		};

		hotKeysHandlers[ keysDictionary.p ] = {
			changeEditMode: {
				isWorthHandling: function( event ) {
					return hotKeysManager.isControlEvent( event );
				},
				handle: function() {
					qazana.getPanelView().modeSwitcher.currentView.toggleMode();
                },
			},
		};

		hotKeysHandlers[ keysDictionary.s ] = {
			saveEditor: {
				isWorthHandling: function( event ) {
					return hotKeysManager.isControlEvent( event );
				},
				handle: function() {
					qazana.saver.saveDraft();
				},
			},
		};

		hotKeysHandlers[ keysDictionary.v ] = {
			pasteElement: {
				isWorthHandling: function( event ) {
					if ( ! hotKeysManager.isControlEvent( event ) ) {
						return false;
					}

					return -1 !== [ 'BODY', 'IFRAME' ].indexOf( document.activeElement.tagName ) && 'BODY' === qazanaFrontend.getElements( 'window' ).document.activeElement.tagName;
				},
				handle: function( event ) {
					var targetElement = qazana.channels.editor.request( 'contextMenu:targetView' );

					if ( ! targetElement ) {
						var panel = qazana.getPanelView();

						if ( 'editor' === panel.getCurrentPageName() ) {
							targetElement = panel.getCurrentPageView().getOption( 'editedElementView' );
						}
					}

					if ( event.shiftKey ) {
						if ( targetElement && targetElement.pasteStyle && qazana.getStorage( 'transfer' ) ) {
							targetElement.pasteStyle();
						}

						return;
					}

					if ( ! targetElement ) {
						targetElement = qazana.getPreviewView();
					}

					if ( targetElement.isPasteEnabled() ) {
						targetElement.paste();
					}
				},
			},
		};

		hotKeysHandlers[ keysDictionary.del ] = {
			deleteElement: {
				isWorthHandling: function( event ) {
					var isEditorOpen = 'editor' === qazana.getPanelView().getCurrentPageName();

					if ( ! isEditorOpen ) {
						return false;
					}

					var $target = $( event.target );

					if ( $target.is( ':input, .qazana-input' ) ) {
						return false;
					}

					return ! $target.closest( '[contenteditable="true"]' ).length;
				},
				handle: function() {
					qazana.getPanelView().getCurrentPageView().getOption( 'editedElementView' ).removeElement();
				},
			},
		};

		_.each( hotKeysHandlers, function( handlers, keyCode ) {
			_.each( handlers, function( handler, handlerName ) {
				hotKeysManager.addHotKeyHandler( keyCode, handlerName, handler );
			} );
		} );

		hotKeysManager.bindListener( this.$window );
	},

	initPanel: function() {
		this.addRegions( { panel: require( 'qazana-regions/panel/panel' ) } );
	},

	initNavigator: function() {
		this.addRegions( {
			navigator: {
				el: '#qazana-navigator',
				regionClass: Navigator,
			},
		} );
	},

	preventClicksInsideEditor: function() {
		this.$previewContents.on( 'submit', function( event ) {
			event.preventDefault();
		} );

		this.$previewContents.on( 'click', function( event ) {
			var $target = jQuery( event.target ),
				editMode = qazana.channels.dataEditMode.request( 'activeMode' ),
				isClickInsideQazana = !! $target.closest( '#qazana, .pen-menu' ).length,
				isTargetInsideDocument = this.contains( $target[ 0 ] );

			if ( ( isClickInsideQazana && 'edit' === editMode ) || ! isTargetInsideDocument ) {
				return;
			}

			if ( $target.closest( 'a:not(.qazana-clickable)' ).length ) {
				event.preventDefault();
			}

			if ( ! isClickInsideQazana ) {
				var panelView = qazana.getPanelView();

				if ( 'elements' !== panelView.getCurrentPageName() ) {
					panelView.setPage( 'elements' );
				}
			}
		} );
	},

	addBackgroundClickArea: function( element ) {
		element.addEventListener( 'click', this.onBackgroundClick.bind( this ), true );
	},

	addBackgroundClickListener: function( key, listener ) {
		this.backgroundClickListeners[ key ] = listener;
	},

	removeBackgroundClickListener: function( key ) {
		delete this.backgroundClickListeners[ key ];
	},

	showFatalErrorDialog: function( options ) {
		var defaultOptions = {
			id: 'qazana-fatal-error-dialog',
			headerMessage: '',
			message: '',
			position: {
				my: 'center center',
				at: 'center center',
			},
			strings: {
				confirm: qazana.translate( 'learn_more' ),
				cancel: qazana.translate( 'go_back' ),
			},
			onConfirm: null,
			onCancel: function() {
				parent.history.go( -1 );
			},
			hide: {
				onBackgroundClick: false,
				onButtonClick: false,
			},
		};

		options = jQuery.extend( true, defaultOptions, options );

		this.dialogsManager.createWidget( 'confirm', options ).show();
	},

	checkPageStatus: function() {
		if ( qazana.config.current_revision_id !== qazana.config.document.id ) {
			this.notifications.showToast( {
				message: this.translate( 'working_on_draft_notification' ),
				buttons: [
					{
						name: 'view_revisions',
						text: qazana.translate( 'view_all_revisions' ),
						callback: function() {
							var panel = qazana.getPanelView();

							panel.setPage( 'historyPage' );
							panel.getCurrentPageView().activateTab( 'revisions' );
						},
					},
				],
			} );
		}
	},

	getStorage: function( key ) {
		var qazanaStorage = localStorage.getItem( 'qazana' );

		if ( qazanaStorage ) {
			qazanaStorage = JSON.parse( qazanaStorage );
		} else {
			qazanaStorage = {};
		}

		if ( key ) {
			return qazanaStorage[ key ];
		}

		return qazanaStorage;
	},

	setStorage: function( key, value ) {
		var qazanaStorage = this.getStorage();

		qazanaStorage[ key ] = value;

		localStorage.setItem( 'qazana', JSON.stringify( qazanaStorage ) );
	},

	openLibraryOnStart: function() {
		if ( '#library' === location.hash ) {
			qazana.templates.startModal();

			location.hash = '';
		}
	},

	enterPreviewMode: function( hidePanel ) {
		var $elements = qazanaFrontend.getElements( '$body' );

		if ( hidePanel ) {
			$elements = $elements.add( this.$body );
		}

		$elements
			.removeClass( 'qazana-editor-active' )
			.addClass( 'qazana-editor-preview' );

		this.$previewQazanaEl
			.removeClass( 'qazana-edit-area-active' )
			.addClass( 'qazana-edit-area-preview' );

		if ( hidePanel ) {
			// Handle panel resize
			this.$previewWrapper.css( this.config.is_rtl ? 'right' : 'left', '' );

			this.panel.$el.css( 'width', '' );
		}
	},

	exitPreviewMode: function() {
		qazanaFrontend.getElements( '$body' ).add( this.$body )
			.removeClass( 'qazana-editor-preview' )
			.addClass( 'qazana-editor-active' );

		this.$previewQazanaEl
			.removeClass( 'qazana-edit-area-preview' )
			.addClass( 'qazana-edit-area-active' );
	},

	changeEditMode: function( newMode ) {
		var dataEditMode = qazana.channels.dataEditMode,
			oldEditMode = dataEditMode.request( 'activeMode' );

		dataEditMode.reply( 'activeMode', newMode );

		if ( newMode !== oldEditMode ) {
			dataEditMode.trigger( 'switch', newMode );
		}
	},

	reloadPreview: function() {
		jQuery( '#qazana-preview-loading' ).show();

		this.$preview[ 0 ].contentWindow.location.reload( true );
	},

	clearPage: function() {
		this.getClearPageDialog().show();
	},

	changeDeviceMode: function( newDeviceMode ) {
		var oldDeviceMode = this.channels.deviceMode.request( 'currentMode' );

		if ( oldDeviceMode === newDeviceMode ) {
			return;
		}

		this.$body
			.removeClass( 'qazana-device-' + oldDeviceMode )
			.addClass( 'qazana-device-' + newDeviceMode );

		this.channels.deviceMode
			.reply( 'previousMode', oldDeviceMode )
			.reply( 'currentMode', newDeviceMode )
			.trigger( 'change' );
	},

	enqueueTypographyFonts: function() {
		var self = this,
			typographyScheme = this.schemes.getScheme( 'typography' );

		self.helpers.resetEnqueuedFontsCache();

		_.each( typographyScheme.items, function( item ) {
			self.helpers.enqueueFont( item.value.font_family );
		} );
	},

	translate: function( stringKey, templateArgs, i18nStack ) {
		if ( ! i18nStack ) {
			i18nStack = this.config.i18n;
		}

		var string = i18nStack[ stringKey ];

		if ( undefined === string ) {
			string = stringKey;
		}

		if ( templateArgs ) {
			// TODO: bc since 2.0.4
			string = string.replace( /{(\d+)}/g, function( match, number ) {
				return undefined !== templateArgs[ number ] ? templateArgs[ number ] : match;
			} );

			string = string.replace( /%(?:(\d+)\$)?s/g, function( match, number ) {
				if ( ! number ) {
					number = 1;
				}

				number--;

				return undefined !== templateArgs[ number ] ? templateArgs[ number ] : match;
			} );
		}

		return string;
	},

	onStart: function() {
		this.$window = jQuery( window );

		this.$body = jQuery( 'body' );

		NProgress.start();
		NProgress.inc( 0.2 );

		this.config = QazanaConfig;

		Backbone.Radio.DEBUG = false;
		Backbone.Radio.tuneIn( 'QAZANA' );

		this.initComponents();

		if ( ! this.checkEnvCompatibility() ) {
			this.onEnvNotCompatible();
		}

		this.channels.dataEditMode.reply( 'activeMode', 'edit' );

		this.listenTo( this.channels.dataEditMode, 'switch', this.onEditModeSwitched );

		this.initClearPageDialog();

		this.addBackgroundClickArea( document );

		this.$window.trigger( 'qazana:init' );

		this.initPreview();
	},

	onPreviewLoaded: function() {
		NProgress.done();

		var previewWindow = this.$preview[ 0 ].contentWindow;

		if ( ! previewWindow.qazanaFrontend ) {
			this.onPreviewLoadingError();

			return;
		}

		this.$previewContents = this.$preview.contents();
		this.$previewQazanaEl = this.$previewContents.find( '#qazana' );

		if ( ! this.$previewQazanaEl.length ) {
			this.onPreviewElNotFound();

			return;
		}

		this.initFrontend();

		this.initElements();

		var iframeRegion = new Marionette.Region( {
			// Make sure you get the DOM object out of the jQuery object
			el: this.$previewQazanaEl[ 0 ],
		} );

		this.schemes.init();
		this.schemes.printSchemesStyle();

		this.preventClicksInsideEditor();

		this.addBackgroundClickArea( qazanaFrontend.getElements( '$document' )[ 0 ] );

		if ( this.previewLoadedOnce ) {
			this.getPanelView().setPage( 'elements', null, { autoFocusSearch: false } );
		} else {
			this.onFirstPreviewLoaded();
		}

		this.initNavigator();

		this.addRegions( {
			sections: iframeRegion,
		} );

		var Preview = require( 'qazana-views/preview' );

		this.sections.show( new Preview( { model: this.elementsModel } ) );

		this.$previewContents.children().addClass( 'qazana-html' );

		qazanaFrontend.getElements( '$body' ).addClass( 'qazana-editor-active' ).addClass( 'qazana-page' );

		if ( ! qazana.userCan( 'design' ) ) {
			qazanaFrontend.getElements( '$body' ).addClass( 'qazana-editor-content-only' );
		}

		this.changeDeviceMode( this._defaultDeviceMode );

		jQuery( '#qazana-loading, #qazana-preview-loading' ).fadeOut( 600 );

		_.defer( function() {
			qazanaFrontend.getElements( 'window' ).jQuery.holdReady( false );
		} );

		this.enqueueTypographyFonts();

		this.onEditModeSwitched();

		this.hotKeys.bindListener( qazanaFrontend.getElements( '$window' ) );

		this.trigger( 'preview:loaded' );
	},

	onFirstPreviewLoaded: function() {
		this.initPanel();

		this.heartbeat = new Heartbeat();

		this.checkPageStatus();

		this.openLibraryOnStart();

		this.previewLoadedOnce = true;
	},

	onEditModeSwitched: function() {
		var activeMode = this.channels.dataEditMode.request( 'activeMode' );

		if ( 'edit' === activeMode ) {
			this.exitPreviewMode();
		} else {
			this.enterPreviewMode( 'preview' === activeMode );
		}
	},

	onEnvNotCompatible: function() {
		this.showFatalErrorDialog( {
			headerMessage: this.translate( 'device_incompatible_header' ),
			message: this.translate( 'device_incompatible_message' ),
			strings: {
				confirm: qazana.translate( 'proceed_anyway' ),
			},
			hide: {
				onButtonClick: true,
			},
			onConfirm: function() {
				this.hide();
			},
		} );
	},

	onPreviewLoadingError: function() {
		this.showFatalErrorDialog( {
			headerMessage: this.translate( 'preview_not_loading_header' ),
			message: this.translate( 'preview_not_loading_message' ),
			onConfirm: function() {
				open( qazana.config.help_preview_error_url, '_blank' );
			},
		} );
	},

	onPreviewElNotFound: function() {
		var args = this.$preview[ 0 ].contentWindow.qazanaPreviewErrorArgs;

		if ( ! args ) {
			args = {
				headerMessage: this.translate( 'preview_el_not_found_header' ),
				message: this.translate( 'preview_el_not_found_message' ),
				confirmURL: qazana.config.help_the_content_url,
			};
		}

		args.onConfirm = function() {
			open( args.confirmURL, '_blank' );
		};

		this.showFatalErrorDialog( args );
	},

	onBackgroundClick: function( event ) {
		jQuery.each( this.backgroundClickListeners, function() {
			var $clickedTarget = jQuery( event.target );

			// If it's a label that associated with an input
			if ( $clickedTarget[ 0 ].control ) {
				$clickedTarget = $clickedTarget.add( $clickedTarget[ 0 ].control );
			}

			if ( this.ignore && $clickedTarget.closest( this.ignore ).length ) {
				return;
			}

			if ( this.callback ) {
				this.callback();

				return;
			}

			var $clickedTargetClosestElement = $clickedTarget.closest( this.element );

			jQuery( this.element ).not( $clickedTargetClosestElement ).hide();
		} );
	},
} );

window.qazana = new App();

if ( -1 === location.href.search( 'QAZANA_TESTS=1' ) ) {
	qazana.start();
}

export default qazana;
