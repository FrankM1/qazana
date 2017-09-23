var ViewModule = require( 'qazana-utils/view-module' ),
	SettingsModel = require( 'qazana-models/base-settings' ),
	ControlsCSSParser = require( 'qazana-editor-utils/controls-css-parser' );

module.exports = ViewModule.extend( {
	controlsCSS: null,

	renderStyles: function() {
		this.controlsCSS.addStyleRules( this.model.getStyleControls(), this.model.attributes, this.model.controls, [ /\{\{WRAPPER}}/g ], [ 'body.qazana-page-' + qazana.config.post_id ] );
		this.controlsCSS.stylesheet.addRawCSS( 'page-settings-custom-css', this.model.get('custom_css').replace( /selector/g, 'body.qazana-page-' + qazana.config.post_id ) );
	},

	

} );
