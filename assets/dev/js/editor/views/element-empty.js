var ElementEmptyView;

ElementEmptyView = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-empty-preview',

	className: 'qazana-empty-view',

	events: {
		'click': 'onClickAdd'
	},

	onClickAdd: function() {
		qazana.getPanelView().setPage( 'elements' );
	}
} );

module.exports = ElementEmptyView;
