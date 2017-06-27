var PanelSchemeItemView;

PanelSchemeItemView = Marionette.ItemView.extend( {
	getTemplate: function() {
		return Marionette.TemplateCache.get( '#tmpl-qazana-panel-scheme-' + this.getUIType() + '-item' );
	},

	className: function() {
		return 'qazana-panel-scheme-item';
	}
} );

module.exports = PanelSchemeItemView;
