var PanelSchemeBaseView = require( 'qazana-panel/pages/schemes/base' ),
	PanelSchemeTypographyView;

PanelSchemeTypographyView = PanelSchemeBaseView.extend( {
	getType: function() {
		return 'typography';
	}
} );

module.exports = PanelSchemeTypographyView;
