var ElementEmptyView;

ElementEmptyView = Marionette.ItemView.extend( {
	template: '#tmpl-builder-empty-preview',

	className: 'builder-empty-view',

	events: {
		'click': 'onClickAdd'
	},

	onClickAdd: function() {
		builder.getPanelView().setPage( 'elements' );
	}
} );

module.exports = ElementEmptyView;
