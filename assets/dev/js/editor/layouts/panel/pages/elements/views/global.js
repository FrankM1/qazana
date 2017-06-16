module.exports = Marionette.ItemView.extend( {
	template: '#tmpl-builder-panel-global',

	id: 'builder-panel-global',

	initialize: function() {
		builder.getPanelView().getCurrentPageView().search.reset();
	},

	onDestroy: function() {
		builder.getPanelView().getCurrentPageView().showView( 'search' );
	}
} );
