var BaseSettings = require( 'qazana-editor/settings/base/manager' );

module.exports = BaseSettings.extend( {
	changeCallbacks: {
		post_title: function( newValue ) {
			var $title = qazanaFrontend.getElements( '$document' ).find( qazana.config.page_title_selector );

			$title.text( newValue );
		},

		template: function() {
			this.save( function() {
				qazana.reloadPreview();

				qazana.once( 'preview:loaded', function() {
					qazana.getPanelView().setPage( 'page_settings' );
				} );
			} );
		},

		custom_css: function( newValue ) {
			newValue = newValue.replace( /selector/g, this.getSettings( 'cssWrapperSelector' ) );
			this.controlsCSS.stylesheet.addRawCSS( 'page-settings-custom-css', newValue );
		}			
		
	},

	updateStylesheet: function( keepOldEntries ) {
		if ( ! keepOldEntries ) {
			this.controlsCSS.stylesheet.empty();
		}

		this.controlsCSS.addStyleRules( this.model.getStyleControls(), this.model.attributes, this.model.controls, [ /{{WRAPPER}}/g ], [ this.getSettings( 'cssWrapperSelector' ) ] );
		
		//this.controlsCSS.stylesheet.addRawCSS( 'page-settings-custom-css', this.model.get('custom_css').replace( /selector/g, [ this.getSettings( 'cssWrapperSelector' ) ] ) );
		
		this.controlsCSS.addStyleToDocument();
	},

	getDataToSave: function( data ) {
		data.id = qazana.config.post_id;

		return data;
	}
} );
