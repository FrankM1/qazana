var ViewModule = require( 'qazana-utils/view-module' ),
	SettingsModel = require( 'qazana-models/base-settings' ),
	ControlsCSSParser = require( 'qazana-editor-utils/controls-css-parser' );

module.exports = ViewModule.extend( {
	controlsCSS: null,

	model: null,

	hasChange: false,

	reloadPreviewFlag: false,

	changeCallbacks: {

		post_title: function( newValue ) {
			var $title = qazanaFrontend.getElements( '$document' ).find( qazana.config.page_title_selector );

			$title.text( newValue );
		},

		template: function() {
			
			var self = this;

			this.save( function() {
				self.reloadPreview();
			} );
		},

		custom_css: function( newValue ) {
			newValue = newValue.replace( /selector/g, 'body.qazana-page-' + qazana.config.post_id );
			this.controlsCSS.stylesheet.addRawCSS( 'page-settings-custom-css', newValue );
		}			
		
	},

	addChangeCallback: function( attribute, callback ) {
		this.changeCallbacks[ attribute ] = callback;
	},

	getDefaultSettings: function() {
		return {
			savedSettings: qazana.config.page_settings.settings
		};
	},

	bindEvents: function() {
		qazana.on( 'preview:loaded', this.updateStylesheet );

		this.model.on( 'change', this.onModelChange );
	},

	renderStyles: function() {
		this.controlsCSS.addStyleRules( this.model.getStyleControls(), this.model.attributes, this.model.controls, [ /\{\{WRAPPER}}/g ], [ 'body.qazana-page-' + qazana.config.post_id ] );
		this.controlsCSS.stylesheet.addRawCSS( 'page-settings-custom-css', this.model.get('custom_css').replace( /selector/g, 'body.qazana-page-' + qazana.config.post_id ) );
	},

	updateStylesheet: function() {
		this.renderStyles();

		this.controlsCSS.addStyleToDocument();
	},

	initModel: function() {
		this.model = new SettingsModel( this.getSettings( 'savedSettings' ), {
			controls: qazana.config.page_settings.controls
		} );
	},

	initControlsCSSParser: function() {
		this.controlsCSS = new ControlsCSSParser();
	},

	save: function( callback ) {
		var self = this;

		if ( ! self.hasChange ) {
			return;
		}

		var settings = self.model.toJSON( { removeDefault: true } ),
			data = {
				id: qazana.config.post_id,
				data: JSON.stringify( settings )
			};

		NProgress.start();

		qazana.ajax.send( 'save_page_settings', {
			data: data,
			success: function() {
				NProgress.done();

				self.setSettings( 'savedSettings', settings );

				self.hasChange = false;

				if ( self.reloadPreviewFlag ) {
					self.reloadPreviewFlag = false;
					self.reloadPreview();
				}

				if ( callback ) {
					callback.apply( self, arguments );
				}
			},
			error: function() {
				alert( 'An error occurred' );
			}
		} );
	},

	onInit: function() {
		this.initModel();

		this.initControlsCSSParser();

		this.debounceSave = _.debounce( this.save, 3000 );

		ViewModule.prototype.onInit.apply( this, arguments );
	},

	onModelChange: function( model ) {
		var self = this;

		self.hasChange = true;

		this.controlsCSS.stylesheet.empty();

		_.each( model.changed, function( value, key ) {

			if ( self.changeCallbacks[ key ] ) {
				self.changeCallbacks[ key ].call( self, value );
			}

			if ( self.model.controls[ key ].render_type === 'preview' ) {
				self.reloadPreviewFlag = true;
			}

		} );

		self.updateStylesheet();

		self.debounceSave();
	},

	reloadPreview: function() {
		qazana.reloadPreview();

		qazana.once( 'preview:loaded', function() {
			qazana.getPanelView().setPage( 'settingsPage' );
		} );
	}

} );
