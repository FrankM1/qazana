var PanelMenuItemView;

PanelMenuItemView = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-panel-menu-item',

	className: 'qazana-panel-menu-item',

	triggers: {
		click: 'click'
	}
} );

module.exports = PanelMenuItemView;
