/* global QazanaConfig */
var App;

Marionette.TemplateCache.prototype.compileTemplate = function( rawTemplate, options ) {
	options = {
		evaluate: /<#([\s\S]+?)#>/g,
		interpolate: /{{{([\s\S]+?)}}}/g,
		escape: /{{([^}]+?)}}(?!})/g
	};

	return _.template( rawTemplate, options );
};

App = Marionette.Application.extend( {
	helpers: require( 'qazana-editor-utils/helpers' ),
	heartbeat: require( 'qazana-editor-utils/heartbeat' ),
	imagesManager: require( 'qazana-editor-utils/images-manager' ),
	debug: require( 'qazana-editor-utils/debug' ),
	schemes: require( 'qazana-editor-utils/schemes' ),
	presetsFactory: require( 'qazana-editor-utils/presets-factory' ),
	templates: require( 'qazana-templates/manager' ),
	ajax: require( 'qazana-editor-utils/ajax' ),
	conditions: require( 'qazana-editor-utils/conditions' ),
	revisions:  require( 'qazana-revisions/manager' ),
	hotKeys: require( 'qazana-editor-utils/hot-keys' ),

	channels: {
		editor: Backbone.Radio.channel( 'BUILDER:editor' ),
		data: Backbone.Radio.channel( 'BUILDER:data' ),
		panelElements: Backbone.Radio.channel( 'BUILDER:panelElements' ),
		dataEditMode: Backbone.Radio.channel( 'BUILDER:editmode' ),
		deviceMode: Backbone.Radio.channel( 'BUILDER:deviceMode' ),
		templates: Backbone.Radio.channel( 'BUILDER:templates' )
	},

	// Exporting modules that can be used externally
	modules: {
		element: require( 'qazana-models/element' ),
		WidgetView: require( 'qazana-views/widget' ),
		panel: {
			Menu: require( 'qazana-panel/pages/menu/menu' )
		},
		controls: {
			Base: require( 'qazana-views/controls/base' ),
			BaseMultiple: require( 'qazana-views/controls/base-multiple' ),
			Color: require( 'qazana-views/controls/color' ),
			Dimensions: require( 'qazana-views/controls/dimensions' ),
			Image_dimensions: require( 'qazana-views/controls/image-dimensions' ),
			Media: require( 'qazana-views/controls/media' ),
			Slider: require( 'qazana-views/controls/slider' ),
			Wysiwyg: require( 'qazana-views/controls/wysiwyg' ),
			Choose: require( 'qazana-views/controls/choose' ),
			Url: require( 'qazana-views/controls/base-multiple' ),
			Font: require( 'qazana-views/controls/font' ),
			Section: require( 'qazana-views/controls/section' ),
			Tab: require( 'qazana-views/controls/tab' ),
			Repeater: require( 'qazana-views/controls/repeater' ),
			Wp_widget: require( 'qazana-views/controls/wp_widget' ),
			Icon: require( 'qazana-views/controls/icon' ),
			Gallery: require( 'qazana-views/controls/gallery' ),
			Select2: require( 'qazana-views/controls/select2' ),
			Date_time: require( 'qazana-views/controls/date-time' ),
			Code: require( 'qazana-views/controls/code' ),
			Box_shadow: require( 'qazana-views/controls/shadow' ),
			Text_shadow: require( 'qazana-views/controls/shadow' ),
			Structure: require( 'qazana-views/controls/structure' ),
			Animation: require( 'qazana-views/controls/select2' ),
			Hover_animation: require( 'qazana-views/controls/select2' ),
			Order: require( 'qazana-views/controls/order' ),
			Switcher: require( 'qazana-views/controls/switcher' ),
			Number: require( 'qazana-views/controls/number' )
		},
		templateLibrary: {
			ElementsCollectionView: require( 'qazana-panel/pages/elements/views/elements' )
		}
	},

	_defaultDeviceMode: 'desktop',

	addControlView: function( controlID, ControlView ) {
		this.modules.controls[ controlID[0].toUpperCase() + controlID.slice( 1 ) ] = ControlView;
	},

	getElementData: function( modelElement ) {
		var elType = modelElement.get( 'elType' );

		if ( 'widget' === elType ) {
			var widgetType = modelElement.get( 'widgetType' );

			if ( ! this.config.widgets[ widgetType ] ) {
				return false;
			}

			return this.config.widgets[ widgetType ];
		}

		if ( ! this.config.elements[ elType ] ) {
			return false;
		}

		return this.config.elements[ elType ];
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
			if ( isInner && controlData.hide_in_inner || ! isInner && controlData.hide_in_top ) {
				return;
			}

			controls[ controlKey ] = _.extend( {}, self.config.controls[ controlData.type ], controlData  );
		} );

		return controls;
	},

	getControlView: function( controlID ) {
		return this.modules.controls[ controlID[0].toUpperCase() + controlID.slice( 1 ) ] || this.modules.controls.Base;
	},

	getPanelView: function() {
		return this.getRegion( 'panel' ).currentView;
	},

	initComponents: function() {
		var EventManager = require( 'qazana-utils/hooks' ),
			Settings = require( 'qazana-editor-utils/page-settings' );

		this.hooks = new EventManager();

		this.settings = new Settings();

		/**
		 * @deprecated - use `this.settings.page` instead
		 */
		this.pageSettings = this.settings.page;

		this.templates.init();

		this.initDialogsManager();

		this.heartbeat.init();

		this.ajax.init();
	},

	initDialogsManager: function() {
		this.dialogsManager = new DialogsManager.Instance();
	},

	initElements: function() {
		var ElementModel = qazana.modules.element,
			config = this.config.data;

		// If it's an reload, use the not-saved data
		if ( this.elements ) {
			config = this.elements.toJSON();
		}

		this.elements = new ElementModel.Collection( config );
	},

	initPreview: function() {
		this.$previewWrapper = Backbone.$( '#qazana-preview' );

		this.$previewResponsiveWrapper = Backbone.$( '#qazana-preview-responsive-wrapper' );

		var previewIframeId = 'qazana-preview-iframe';

		// Make sure the iFrame does not exist.
		if ( ! this.$preview ) {
			this.$preview = Backbone.$( '<iframe>', {
				id: previewIframeId,
				src: this.config.preview_link + '&' + ( new Date().getTime() ),
				allowfullscreen: 1
			} );

			this.$previewResponsiveWrapper.append( this.$preview );
		}

		this.$preview.on( 'load', _.bind( this.onPreviewLoaded, this ) );
	},

	initFrontend: function() {
		var frontendWindow = this.$preview[0].contentWindow;
		
		window.qazanaFrontend = frontendWindow.qazanaFrontend;
		
		frontendWindow.qazana = this;

		//qazanaFrontend.init();

		//qazanaFrontend.elementsHandler.initHandlers();

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
					at: 'center center'
				},
				strings: {
					confirm: qazana.translate( 'delete' ),
					cancel: qazana.translate( 'cancel' )
				},
				onConfirm: function() {
					self.getRegion( 'sections' ).currentView.collection.reset();
				}
			} );

			return dialog;
		};
	},

	initHotKeys: function() {
		var keysDictionary = {
			del: 46,
			d: 68,
			l: 76,
			m: 77,
			p: 80,
			s: 83
		};

		var $ = jQuery,
			hotKeysHandlers = {},
			hotKeysManager = this.hotKeys;

		hotKeysHandlers[ keysDictionary.del ] = {
			deleteElement: {
				isWorthHandling: function( event ) {
					var isEditorOpen = 'editor' === qazana.getPanelView().getCurrentPageName(),
						isInputTarget = $( event.target ).is( ':input, .qazana-input' );

					return isEditorOpen && ! isInputTarget;
				},
				handle: function() {
					qazana.getPanelView().getCurrentPageView().getOption( 'editedElementView' ).removeElement();
				}
			}
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
				}
			}
		};

		hotKeysHandlers[ keysDictionary.l ] = {
			showTemplateLibrary: {
				isWorthHandling: function( event ) {
					return hotKeysManager.isControlEvent( event ) && event.shiftKey;
				},
				handle: function() {
					qazana.templates.showTemplatesModal();
				}
			}
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
				}
			}
		};

		hotKeysHandlers[ keysDictionary.p ] = {
			changeEditMode: {
				isWorthHandling: function( event ) {
					return hotKeysManager.isControlEvent( event );
				},
				handle: function() {
					qazana.getPanelView().modeSwitcher.currentView.toggleMode();
				}
			}
		};

		hotKeysHandlers[ keysDictionary.s ] = {
			saveEditor: {
				isWorthHandling: function( event ) {
					return hotKeysManager.isControlEvent( event );
				},
				handle: function() {
					qazana.getPanelView().getFooterView()._publishBuilder();
				}
			}
		};

		_.each( hotKeysHandlers, function( handlers, keyCode ) {
			_.each( handlers, function( handler, handlerName ) {
				hotKeysManager.addHotKeyHandler( keyCode, handlerName, handler );
			} );
		} );

		//hotKeysManager.bindListener( this.$window.add( qazanaFrontend.getElements( '$window' ) ) );
	},

	preventClicksInsideEditor: function() {
		this.$previewContents.on( 'click', function( event ) {
			var $target = Backbone.$( event.target ),
				editMode = qazana.channels.dataEditMode.request( 'activeMode' ),
				isClickInsideQazana = !! $target.closest( '#qazana' ).length,
				isTargetInsideDocument = this.contains( $target[0] );

			if ( isClickInsideQazana && 'edit' === editMode || ! isTargetInsideDocument ) {
				return;
			}

			if ( $target.closest( 'a' ).length ) {
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

	onStart: function() {
		this.$window = Backbone.$( window );

		NProgress.start();
		NProgress.inc( 0.2 );

		this.config = QazanaConfig;

		Backbone.Radio.DEBUG = false;
		Backbone.Radio.tuneIn( 'BUILDER' );

		this.initComponents();

		this.channels.dataEditMode.reply( 'activeMode', 'edit' );

		this.listenTo( this.channels.dataEditMode, 'switch', this.onEditModeSwitched );

		this.setWorkSaver();

		this.initClearPageDialog();

		this.$window.trigger( 'qazana:init' );

		this.initPreview();

	},

	onPreviewLoaded: function() {
		NProgress.done();

		this.$previewContents = this.$preview.contents();

		var $previewQazanaEl = this.$previewContents.find( '#qazana' );

		if ( ! $previewQazanaEl.length ) {
			this.onPreviewElNotFound();
			return;
		}

		this.initFrontend();

		this.initElements();

		this.initHotKeys();

		var iframeRegion = new Marionette.Region( {
			// Make sure you get the DOM object out of the jQuery object
			el: $previewQazanaEl[0]
		} );

		this.schemes.init();

		this.schemes.printSchemesStyle();

		this.preventClicksInsideEditor();

		var Preview = require( 'qazana-views/preview' ),
			PanelLayoutView = require( 'qazana-layouts/panel/panel' );

		this.addRegions( {
			sections: iframeRegion,
			panel: '#qazana-panel'
		} );

		this.getRegion( 'sections' ).show( new Preview( {
			collection: this.elements
		} ) );

		this.getRegion( 'panel' ).show( new PanelLayoutView() );

		this.$previewContents
		    .children() // <html>
		    .addClass( 'qazana-html' )
		    .children( 'body' )
		    .addClass( 'qazana-editor-active' )
			.addClass( 'qazana-page' );

		this.setResizablePanel();

		this.changeDeviceMode( this._defaultDeviceMode );

		Backbone.$( '#qazana-loading, #qazana-preview-loading' ).fadeOut( 600 );

		_.defer( function() {
			//qazanaFrontend.getElements( 'window' ).jQuery.holdReady( false );
		} );

		this.enqueueTypographyFonts();
		this.onEditModeSwitched();

		this.trigger( 'preview:loaded' );
	},

	onEditModeSwitched: function() {
		var activeMode = this.channels.dataEditMode.request( 'activeMode' );

		if ( 'edit' === activeMode ) {
			this.exitPreviewMode();
		} else {
			this.enterPreviewMode( 'preview' === activeMode );
		}
	},

	onPreviewElNotFound: function() {
		var dialog = this.dialogsManager.createWidget( 'confirm', {
			id: 'qazana-fatal-error-dialog',
			headerMessage: qazana.translate( 'preview_el_not_found_header' ),
			message: qazana.translate( 'preview_el_not_found_message' ),
			position: {
				my: 'center center',
				at: 'center center'
			},
            strings: {
				confirm: qazana.translate( 'learn_more' ),
				cancel: qazana.translate( 'go_back' )
            },
			onConfirm: function() {
				open( qazana.config.help_the_content_url, '_blank' );
			},
			onCancel: function() {
				parent.history.go( -1 );
			},
			hideOnButtonClick: false
		} );

		dialog.show();
	},

	setFlagEditorChange: function( status ) {
		qazana.channels.editor
			.reply( 'status', status )
			.trigger( 'status:change', status );
	},

	isEditorChanged: function() {
		return ( true === qazana.channels.editor.request( 'status' ) );
	},

	setWorkSaver: function() {
		this.$window.on( 'beforeunload', function() {
			if ( qazana.isEditorChanged() ) {
				return qazana.translate( 'before_unload_alert' );
			}
		} );
	},

	setResizablePanel: function() {
		var self = this,
			side = qazana.config.is_rtl ? 'right' : 'left';

		self.panel.$el.resizable( {
			handles: qazana.config.is_rtl ? 'w' : 'e',
			minWidth: 200,
			maxWidth: 680,
			start: function() {
				self.$previewWrapper
					.addClass( 'ui-resizable-resizing' )
					.css( 'pointer-events', 'none' );
			},
			stop: function() {
				self.$previewWrapper
					.removeClass( 'ui-resizable-resizing' )
					.css( 'pointer-events', '' );

				qazana.channels.data.trigger( 'scrollbar:update' );
			},
			resize: function( event, ui ) {
				self.$previewWrapper
					.css( side, ui.size.width );
			}
		} );
	},

	enterPreviewMode: function( hidePanel ) {
		var $elements = this.$previewContents.find( 'body' );

		if ( hidePanel ) {
			$elements = $elements.add( 'body' );
		}

		$elements
			.removeClass( 'qazana-editor-active' )
			.addClass( 'qazana-editor-preview' );

		if ( hidePanel ) {
			// Handle panel resize
			this.$previewWrapper.css( qazana.config.is_rtl ? 'right' : 'left', '' );

			this.panel.$el.css( 'width', '' );
		}
	},

	exitPreviewMode: function() {
		this.$previewContents
			.find( 'body' )
			.add( 'body' )
			.removeClass( 'qazana-editor-preview' )
			.addClass( 'qazana-editor-active' );
	},

	changeEditMode: function( newMode ) {
		var dataEditMode = qazana.channels.dataEditMode,
			oldEditMode = dataEditMode.request( 'activeMode' );

		dataEditMode.reply( 'activeMode', newMode );

		if ( newMode !== oldEditMode ) {
			dataEditMode.trigger( 'switch', newMode );
		}
	},

	saveEditor: function( options ) {
		options = _.extend( {
			status: 'draft',
            save_state: 'save',
			onSuccess: null
		}, options );

		if ( qazana.elements.length === 0 ) {
        	options.save_state = 'delete';
        }

		var self = this,
			newData = qazana.elements.toJSON( { removeDefault: true } );

		return this.ajax.send( 'save_builder', {
	        data: {
		        post_id: this.config.post_id,
		        status: options.status,
                save_state: options.save_state,
		        data: JSON.stringify( newData )
	        },
			success: function( data ) {
				self.setFlagEditorChange( false );

				self.config.data = newData;

				self.channels.editor.trigger( 'saved', data );

				if ( _.isFunction( options.onSuccess ) ) {
					options.onSuccess.call( this, data );
				}
			}
		} );
	},

	reloadPreview: function() {
		Backbone.$( '#qazana-preview-loading' ).show();

		this.$preview[0].contentWindow.location.reload( true );
	},

	clearPage: function() {
		this.getClearPageDialog().show();
	},

	changeDeviceMode: function( newDeviceMode ) {
		var oldDeviceMode = this.channels.deviceMode.request( 'currentMode' );

		if ( oldDeviceMode === newDeviceMode ) {
			return;
		}

		Backbone.$( 'body' )
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
			string = string.replace( /{(\d+)}/g, function( match, number ) {
				return undefined !== templateArgs[ number ] ? templateArgs[ number ] : match;
			} );
		}

		return string;
	},

	compareVersions: function( versionA, versionB, operator ) {
		var prepareVersion = function( version ) {
			version = version + '';

			return version.replace( /[^\d.]+/, '.-1.' );
		};

		versionA  = prepareVersion( versionA );
		versionB = prepareVersion( versionB );

		if ( versionA === versionB ) {
			return ! operator || /^={2,3}$/.test( operator );
		}

		var versionAParts = versionA.split( '.' ).map( Number ),
			versionBParts = versionB.split( '.' ).map( Number ),
			longestVersionParts = Math.max( versionAParts.length, versionBParts.length );

		for ( var i = 0; i < longestVersionParts; i++ ) {
			var valueA = versionAParts[ i ] || 0,
				valueB = versionBParts[ i ] || 0;

			if ( valueA !== valueB ) {
				return this.conditions.compare( valueA, valueB, operator );
			}
		}
	},
} );

module.exports = ( window.qazana = new App() ).start();
