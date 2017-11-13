var PanelElementsCategoryView = require( './category' ),
	PanelElementsCategoriesView;

PanelElementsCategoriesView = Marionette.CompositeView.extend( {
	template: '#tmpl-qazana-panel-categories',

	childView: PanelElementsCategoryView,

	childViewContainer: '#qazana-panel-categories',

	id: 'qazana-panel-elements-categories',

	initialize: function() {
		this.listenTo( qazana.channels.panelElements, 'filter:change', this.onPanelElementsFilterChange );
	},

	onPanelElementsFilterChange: function() {
		if ( qazana.channels.panelElements.request( 'filter:value' ) ) {
			qazana.getPanelView().getCurrentPageView().showView( 'elements' );
		}
	}
} );

module.exports = PanelElementsCategoriesView;
