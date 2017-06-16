/* global BuilderConfig */
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
	helpers: require( 'builder-utils/helpers' ),
	heartbeat: require( 'builder-utils/heartbeat' ),
	imagesManager: require( 'builder-utils/images-manager' ),
	schemes: require( 'builder-utils/schemes' ),
	presetsFactory: require( 'builder-utils/presets-factory' ),
	modals: require( 'builder-utils/modals' ),
	templates: require( 'builder-templates/manager' ),
	ajax: require( 'builder-utils/ajax' ),
	conditions: require( 'builder-utils/conditions' ),
	revisions:  require( 'builder-revisions/manager' ),
	hotKeys: require( 'builder-utils/hot-keys' ),

	channels: {
		editor: Backbone.Radio.channel( 'BUILDER:editor' ),
		data: Backbone.Radio.channel( 'BUILDER:data' ),
		panelElements: Backbone.Radio.channel( 'BUILDER:panelElements' ),
		dataEditMode: Backbone.Radio.channel( 'BUILDER:editmode' ),
		deviceMode: Backbone.Radio.channel( 'BUILDER:deviceMode' ),
		templates: Backbone.Radio.channel( 'BUILDER:templates' )
	},

	modules: {
		element: require( 'builder-models/element' ),
		WidgetView: require( 'builder-views/widget' ),
		templateLibrary: {
			ElementsCollectionView: require( 'builder-panel/pages/elements/views/elements' )
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
				color: require( 'builder-views/controls/color' ),
				dimensions: require( 'builder-views/controls/dimensions' ),
				image_dimensions: require( 'builder-views/controls/image-dimensions' ),
				media: require( 'builder-views/controls/media' ),
				slider: require( 'builder-views/controls/slider' ),
				wysiwyg: require( 'builder-views/controls/wysiwyg' ),
				choose: require( 'builder-views/controls/choose' ),
				url: require( 'builder-views/controls/url' ),
				font: require( 'builder-views/controls/font' ),
				section: require( 'builder-views/controls/section' ),
				tab: require( 'builder-views/controls/tab' ),
				repeater: require( 'builder-views/controls/repeater' ),
				wp_widget: require( 'builder-views/controls/wp_widget' ),
				icon: require( 'builder-views/controls/icon' ),
				gallery: require( 'builder-views/controls/gallery' ),
				select2: require( 'builder-views/controls/select2' ),
				date_time: require( 'builder-views/controls/date-time' ),
				code: require( 'builder-views/controls/code' ),
				box_shadow: require( 'builder-views/controls/box-shadow' ),
				structure: require( 'builder-views/controls/structure' ),
				animation: require( 'builder-views/controls/animation' ),
				hover_animation: require( 'builder-views/controls/animation' ),
				order: require( 'builder-views/controls/order' )
			};

			this.channels.editor.trigger( 'controls:initialize' );
		}

		return this._controlsItemView[ controlType ] || require( 'builder-views/controls/base' );
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
		var ElementModel = builder.modules.element;

		this.elements = new ElementModel.Collection( this.config.data );
	},

	initPreview: function() {
		this.$previewWrapper = Backbone.$( '#builder-preview' );

		this.$previewResponsiveWrapper = Backbone.$( '#builder-preview-responsive-wrapper' );

		var previewIframeId = 'builder-preview-iframe';

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
		builderFrontend.setScopeWindow( this.$preview[0].contentWindow );

		builderFrontend.init();
	},

	initClearPageDialog: function() {
		var self = this,
			dialog;

		self.getClearPageDialog = function() {
			if ( dialog ) {
				return dialog;
			}

			dialog = this.dialogsManager.createWidget( 'confirm', {
				id: 'builder-clear-page-dialog',
				headerMessage: builder.translate( 'clear_page' ),
				message: builder.translate( 'dialog_confirm_clear_page' ),
				position: {
					my: 'center center',
					at: 'center center'
				},
				strings: {
					confirm: builder.translate( 'delete' ),
					cancel: builder.translate( 'cancel' )
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

		this.config = BuilderConfig;

		Backbone.Radio.DEBUG = false;
		Backbone.Radio.tuneIn( 'BUILDER' );

		this.initComponents();

		this.listenTo( this.channels.dataEditMode, 'switch', this.onEditModeSwitched );

		this.setWorkSaver();

		this.initClearPageDialog();

		this.$window.trigger( 'builder:init' );

		this.initPreview();

	},

	onPreviewLoaded: function() {
		NProgress.done();

		this.initFrontend();

		this.hotKeys.bindListener( Backbone.$( builderFrontend.getScopeWindow() ) );

		this.$previewContents = this.$preview.contents();

		var Preview = require( 'builder-views/preview' ),
			PanelLayoutView = require( 'builder-layouts/panel/panel' );

		var $previewBuilderEl = this.$previewContents.find( '#builder' );

		if ( ! $previewBuilderEl.length ) {
			this.onPreviewElNotFound();
			return;
		}

		var iframeRegion = new Marionette.Region( {
			// Make sure you get the DOM object out of the jQuery object
			el: $previewBuilderEl[0]
		} );

		this.schemes.init();

		this.schemes.printSchemesStyle();

		this.$previewContents.on( 'click', function( event ) {
			var $target = Backbone.$( event.target ),
				editMode = builder.channels.dataEditMode.request( 'activeMode' ),
				isClickInsideBuilder = !! $target.closest( '#builder' ).length,
				isTargetInsideDocument = this.contains( $target[0] );

			if ( isClickInsideBuilder && 'edit' === editMode || ! isTargetInsideDocument ) {
				return;
			}

			if ( $target.closest( 'a' ).length ) {
				event.preventDefault();
			}

			if ( ! isClickInsideBuilder ) {
				var panelView = builder.getPanelView();

				if ( 'elements' !== panelView.getCurrentPageName() ) {
					panelView.setPage( 'elements' );
				}
			}
		} );

		this.addRegions( {
			sections: iframeRegion,
			panel: '#builder-panel'
		} );

		this.getRegion( 'sections' ).show( new Preview( {
			collection: this.elements
		} ) );

		this.getRegion( 'panel' ).show( new PanelLayoutView() );

		this.$previewContents
		    .children() // <html>
		    .addClass( 'builder-html' )
		    .children( 'body' )
		    .addClass( 'builder-editor-active' )
			.addClass( 'builder-page' );

		this.setResizablePanel();

		this.changeDeviceMode( this._defaultDeviceMode );

		Backbone.$( '#builder-loading, #builder-preview-loading' ).fadeOut( 600 );

		_.defer( function() {
			builderFrontend.getScopeWindow().jQuery.holdReady( false );
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
			id: 'builder-fatal-error-dialog',
			headerMessage: builder.translate( 'preview_el_not_found_header' ),
			message: builder.translate( 'preview_el_not_found_message' ),
			position: {
				my: 'center center',
				at: 'center center'
			},
            strings: {
				confirm: builder.translate( 'learn_more' ),
				cancel: builder.translate( 'go_back' )
            },
			onConfirm: function() {
				open( builder.config.help_the_content_url, '_blank' );
			},
			onCancel: function() {
				parent.history.go( -1 );
			},
			hideOnButtonClick: false
		} );

		dialog.show();
	},

	setFlagEditorChange: function( status ) {
		builder.channels.editor
			.reply( 'change', status )
			.trigger( 'change', status );
	},

	isEditorChanged: function() {
		return ( true === builder.channels.editor.request( 'change' ) );
	},

	setWorkSaver: function() {
		this.$window.on( 'beforeunload', function() {
			if ( builder.isEditorChanged() ) {
				return builder.translate( 'before_unload_alert' );
			}
		} );
	},

	setResizablePanel: function() {
		var self = this,
			side = builder.config.is_rtl ? 'right' : 'left';

		self.panel.$el.resizable( {
			handles: builder.config.is_rtl ? 'w' : 'e',
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

				builder.channels.data.trigger( 'scrollbar:update' );
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
			.removeClass( 'builder-editor-active' )
			.addClass( 'builder-editor-preview' );

		if ( hidePanel ) {
			// Handle panel resize
			this.$previewWrapper.css( builder.config.is_rtl ? 'right' : 'left', '' );

			this.panel.$el.css( 'width', '' );
		}
	},

	exitPreviewMode: function() {
		this.$previewContents
			.find( 'body' )
			.add( 'body' )
			.removeClass( 'builder-editor-preview' )
			.addClass( 'builder-editor-active' );
	},

	changeEditMode: function( newMode ) {
		var dataEditMode = builder.channels.dataEditMode,
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

		if ( builder.elements.length === 0 ) {
        	options.save_state = 'delete';
        }

		var self = this,
			newData = builder.elements.toJSON();

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
		Backbone.$( '#builder-preview-loading' ).show();

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
			.removeClass( 'builder-device-' + oldDeviceMode )
			.addClass( 'builder-device-' + newDeviceMode );

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

module.exports = ( window.builder = new App() ).start();
