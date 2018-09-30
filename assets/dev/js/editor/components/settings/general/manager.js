var BaseSettings = require( 'qazana-editor/components/settings/base/manager' );

module.exports = BaseSettings.extend( {
	changeCallbacks: {
		qazana_page_title_selector: function( newValue ) {
			var newSelector = newValue || 'h1.entry-title',
				titleSelectors = qazana.settings.page.model.controls.hide_title.selectors = {};

			titleSelectors[ newSelector ] = 'display: none';

			qazana.settings.page.updateStylesheet();
		},
		custom_css: function( newValue ) {
            this.custom_css( newValue );
		}
    },
    
    custom_css: function( newValue ) {
		var controlsCSS = this.getControlsCSS();

        if ( ! newValue ) {
            newValue = this.model.get('custom_css');
        } 
        
        if ( newValue ) {
            newValue = newValue.replace( /selector/g, this.getSettings( 'cssWrapperSelector' ) );
            controlsCSS.stylesheet.addRawCSS('general-settings-custom-css', newValue);
        }
    },

    updateStylesheet: function( keepOldEntries ) {
        var controlsCSS = this.getControlsCSS();

		if ( ! keepOldEntries ) {
			controlsCSS.stylesheet.empty();
        }
        
		controlsCSS.addStyleRules(this.model.getStyleControls(), this.model.attributes, this.model.controls, [/{{WRAPPER}}/g], [this.getSettings('cssWrapperSelector')]);
        
        this.custom_css();
        
		controlsCSS.addStyleToDocument();
	},
	
	reloadPreview: function() {
		qazana.reloadPreview();

		qazana.once( 'preview:loaded', function() {
			qazana.getPanelView().setPage( 'general_settings' );
		} );
	},
} );
