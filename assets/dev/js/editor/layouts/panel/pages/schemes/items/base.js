var PanelSchemeItemView;

PanelSchemeItemView = Marionette.ItemView.extend( {
	getTemplate: function() {
		return Marionette.TemplateCache.get( '#tmpl-builder-panel-scheme-' + this.getUIType() + '-item' );
	},

	className: function() {
		return 'builder-panel-scheme-item';
	}
} );

module.exports = PanelSchemeItemView;
