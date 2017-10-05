var BaseSettings = require( 'qazana-editor/settings/base/manager' );

module.exports = BaseSettings.extend( {
	changeCallbacks: {
		qazana_page_title_selector: function( newValue ) {
			var newSelector = newValue || 'h1.entry-title',
				titleSelectors = qazana.settings.page.model.controls.hide_title.selectors = {};

			titleSelectors[ newSelector ] = 'display: none';

			qazana.settings.page.updateStylesheet();
		},
		custom_css: function( newValue ) {
			newValue = newValue.replace( /selector/g, this.getSettings( 'cssWrapperSelector' ) );
			this.controlsCSS.stylesheet.addRawCSS( 'general-settings-custom-css', newValue );
		}
	},
	
	reloadPreview: function() {
		qazana.reloadPreview();

		qazana.once( 'preview:loaded', function() {
			qazana.getPanelView().setPage( 'general_settings' );
		} );
	}
} );
