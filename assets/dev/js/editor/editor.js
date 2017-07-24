/* global QazanaConfig */
var App;

Marionette.TemplateCache.prototype.compileTemplate = function( rawTemplate, options ) {
	options = {
		evaluate: /<#([\s\S]+?)#>/g,
		interpolate: /\{\{\{([\s\S]+?)\}\}\}/g,
		escape: /\{\{([^\}]+?)\}\}(?!\})/g
	};

	return _.template( rawTemplate, options );
};

App = Marionette.Application.extend( {
	helpers: require( 'qazana-utils/helpers' ),
	heartbeat: require( 'qazana-utils/heartbeat' ),
	imagesManager: require( 'qazana-utils/images-manager' ),
	schemes: require( 'qazana-utils/schemes' ),
	presetsFactory: require( 'qazana-utils/presets-factory' ),
	modals: require( 'qazana-utils/modals' ),
	templates: require( 'qazana-templates/manager' ),
	ajax: require( 'qazana-utils/ajax' ),
	conditions: require( 'qazana-utils/conditions' ),
	revisions:  require( 'qazana-revisions/manager' ),
	hotKeys: require( 'qazana-utils/hot-keys' ),

	channels: {
		editor: Backbone.Radio.channel( 'BUILDER:editor' ),
		data: Backbone.Radio.channel( 'BUILDER:data' ),
		panelElements: Backbone.Radio.channel( 'BUILDER:panelElements' ),
		dataEditMode: Backbone.Radio.channel( 'BUILDER:editmode' ),
		deviceMode: Backbone.Radio.channel( 'BUILDER:deviceMode' ),
		templates: Backbone.Radio.channel( 'BUILDER:templates' )
	},

	modules: {
		element: require( 'qazana-models/element' ),
		WidgetView: require( 'qazana-views/widget' ),
		templateLibrary: {
			ElementsCollectionView: require( 'qazana-panel/pages/elements/views/elements' )
		}
	},

	// Private Members
	_controlsItemView: null,

	_defaultDeviceMode: 'desktop',

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
		var elementData = this.getElementData( modelElement );

		if ( ! elementData ) {
			return false;
		}

		var elType = modelElement.get( 'elType' );

		if ( 'widget' === elType ) {
			return elementData.controls;
		}

		var isInner = modelElement.get( 'isInner' );

		return _.filter( elementData.controls, function( controlData ) {
			return ! ( isInner && controlData.hide_in_inner || ! isInner && controlData.hide_in_top );
		} );
	},

	getControlItemView: function( controlType ) {
		if ( null === this._controlsItemView ) {
			this._controlsItemView = {
				color: require( 'qazana-views/controls/color' ),
				dimensions: require( 'qazana-views/controls/dimensions' ),
				image_dimensions: require( 'qazana-views/controls/image-dimensions' ),
				media: require( 'qazana-views/controls/media' ),
				slider: require( 'qazana-views/controls/slider' ),
				wysiwyg: require( 'qazana-views/controls/wysiwyg' ),
				choose: require( 'qazana-views/controls/choose' ),
				url: require( 'qazana-views/controls/url' ),
				font: require( 'qazana-views/controls/font' ),
				section: require( 'qazana-views/controls/section' ),
				tab: require( 'qazana-views/controls/tab' ),
				repeater: require( 'qazana-views/controls/repeater' ),
				wp_widget: require( 'qazana-views/controls/wp_widget' ),
				icon: require( 'qazana-views/controls/icon' ),
				gallery: require( 'qazana-views/controls/gallery' ),
				select2: require( 'qazana-views/controls/select2' ),
				date_time: require( 'qazana-views/controls/date-time' ),
				code: require( 'qazana-views/controls/code' ),
				box_shadow: require( 'qazana-views/controls/box-shadow' ),
				structure: require( 'qazana-views/controls/structure' ),
				animation: require( 'qazana-views/controls/animation' ),
				hover_animation: require( 'qazana-views/controls/animation' ),
				order: require( 'qazana-views/controls/order' ),
				number: require( 'qazana-views/controls/number' )
			};

			this.channels.editor.trigger( 'controls:initialize' );
		}

		return this._controlsItemView[ controlType ] || require( 'qazana-views/controls/base' );
	},

	getPanelView: function() {
		return this.getRegion( 'panel' ).currentView;
	},

	initComponents: function() {
		var EventManager = require( '../utils/hooks' );
		this.hooks = new EventManager();
		this.templates.init();

		this.initDialogsManager();

		this.heartbeat.init();
		this.modals.init();
		this.ajax.init();
		this.revisions.init();
		this.hotKeys.init();
	},

	initDialogsManager: function() {
		this.dialogsManager = new DialogsManager.Instance();
	},

	initElements: function() {
		var ElementModel = qazana.modules.element;

		this.elements = new ElementModel.Collection( this.config.data );
	},

	initPreview: function() {
		this.$previewWrapper = Backbone.$( '#qazana-preview' );

		this.$previewResponsiveWrapper = Backbone.$( '#qazana-preview-responsive-wrapper' );

		var previewIframeId = 'qazana-preview-iframe';

		// Make sure the iFrame does not exist.
		if ( ! Backbone.$( '#' + previewIframeId ).length ) {
			var previewIFrame = document.createElement( 'iframe' );

			previewIFrame.id = previewIframeId;
			previewIFrame.src = this.config.preview_link + '&' + ( new Date().getTime() );

			this.$previewResponsiveWrapper.append( previewIFrame );
		}

		this.$preview = Backbone.$( '#' + previewIframeId );

		this.$preview.on( 'load', _.bind( this.onPreviewLoaded, this ) );

		this.initElements();
	},

	initFrontend: function() {
		qazanaFrontend.setScopeWindow( this.$preview[0].contentWindow );

		qazanaFrontend.init();
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

	onStart: function() {
		this.$window = Backbone.$( window );

		NProgress.start();
		NProgress.inc( 0.2 );

		this.config = QazanaConfig;

		Backbone.Radio.DEBUG = false;
		Backbone.Radio.tuneIn( 'BUILDER' );

		this.initComponents();

		this.listenTo( this.channels.dataEditMode, 'switch', this.onEditModeSwitched );

		this.setWorkSaver();

		this.initClearPageDialog();

		this.$window.trigger( 'qazana:init' );

		this.initPreview();

	},

	onPreviewLoaded: function() {
		NProgress.done();

		this.initFrontend();

		this.hotKeys.bindListener( Backbone.$( qazanaFrontend.getScopeWindow() ) );

		this.$previewContents = this.$preview.contents();

		var Preview = require( 'qazana-views/preview' ),
			PanelLayoutView = require( 'qazana-layouts/panel/panel' );

		var $previewQazanaEl = this.$previewContents.find( '#qazana' );

		if ( ! $previewQazanaEl.length ) {
			this.onPreviewElNotFound();
			return;
		}

		var iframeRegion = new Marionette.Region( {
			// Make sure you get the DOM object out of the jQuery object
			el: $previewQazanaEl[0]
		} );

		this.schemes.init();

		this.schemes.printSchemesStyle();

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
			qazanaFrontend.getScopeWindow().jQuery.holdReady( false );
		} );

		this.enqueueTypographyFonts();

		this.trigger( 'preview:loaded' );
	},

	onEditModeSwitched: function( activeMode ) {
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
			.reply( 'change', status )
			.trigger( 'change', status );
	},

	isEditorChanged: function() {
		return ( true === qazana.channels.editor.request( 'change' ) );
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
			newData = qazana.elements.toJSON();

		return this.ajax.send( 'save_qazana', {
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
	}
} );

module.exports = ( window.qazana = new App() ).start();
