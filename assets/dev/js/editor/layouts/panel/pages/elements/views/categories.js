var PanelElementsCategoryView = require( './category' ),
	PanelElementsCategoriesView;

PanelElementsCategoriesView = Marionette.CompositeView.extend( {
	template: '#tmpl-builder-panel-categories',

	childView: PanelElementsCategoryView,

	childViewContainer: '#builder-panel-categories',

	id: 'builder-panel-elements-categories',

	initialize: function() {
		this.listenTo( builder.channels.panelElements, 'filter:change', this.onPanelElementsFilterChange );
	},

	onPanelElementsFilterChange: function() {
		builder.getPanelView().getCurrentPageView().showView( 'elements' );
	}
} );

module.exports = PanelElementsCategoriesView;
