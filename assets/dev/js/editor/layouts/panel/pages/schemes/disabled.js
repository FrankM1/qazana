var PanelSchemeDisabledView;

PanelSchemeDisabledView = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-panel-schemes-disabled',

	id: 'qazana-panel-schemes-disabled',

	className: 'qazana-panel-nerd-box',

	disabledTitle: '',

	templateHelpers: function() {
		return {
			disabledTitle: this.disabledTitle
		};
	}
} );

module.exports = PanelSchemeDisabledView;
