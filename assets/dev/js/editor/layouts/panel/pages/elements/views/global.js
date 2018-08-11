module.exports = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-panel-global',

	id: 'qazana-panel-global',

	initialize: function() {
		qazana.getPanelView().getCurrentPageView().search.reset();
	},

	onDestroy: function() {
		var panel = qazana.getPanelView();

		if ( 'elements' === panel.getCurrentPageName() ) {
			setTimeout( function() {
				var elementsPageView = panel.getCurrentPageView();

				if ( ! elementsPageView.search.currentView ) {
					elementsPageView.showView( 'search' );
				}
			} );
		}
	}
} );
