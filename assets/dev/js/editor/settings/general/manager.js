var BaseSettings = require( 'qazana-editor/settings/base/manager' );

module.exports = BaseSettings.extend( {
	changeCallbacks: {
		qazana_page_title_selector: function( newValue ) {
			var newSelector = newValue || 'h1.entry-title',
				titleSelectors = qazana.settings.page.model.controls.hide_title.selectors = {};

			titleSelectors[ newSelector ] = 'display: none';

			qazana.settings.page.updateStylesheet();
		}
	}
} );
