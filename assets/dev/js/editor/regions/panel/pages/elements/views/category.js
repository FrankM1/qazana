var PanelElementsElementsCollection = require( '../collections/elements' ),
	PanelElementsCategoryView;

PanelElementsCategoryView = Marionette.CompositeView.extend( {
	template: '#tmpl-qazana-panel-elements-category',

	className: 'qazana-panel-category',

	ui: {
		title: '.qazana-panel-category-title',
		items: '.qazana-panel-category-items',
	},

	events: {
		'click @ui.title': 'onTitleClick',
	},

	id: function() {
		return 'qazana-panel-category-' + this.model.get( 'name' );
	},

	childView: require( 'qazana-panel/pages/elements/views/element' ),

	childViewContainer: '.qazana-panel-category-items',

	initialize: function() {
		this.collection = new PanelElementsElementsCollection( this.model.get( 'items' ) );
	},

	onRender: function() {
		var isActive = qazana.channels.panelElements.request( 'category:' + this.model.get( 'name' ) + ':active' );

		if ( undefined === isActive ) {
			isActive = this.model.get( 'defaultActive' );
		}

		if ( isActive ) {
			this.$el.addClass( 'qazana-active' );

			this.ui.items.show();
		}
	},

	onTitleClick: function() {
		var $items = this.ui.items,
			activeClass = 'qazana-active',
			isActive = this.$el.hasClass( activeClass ),
			slideFn = isActive ? 'slideUp' : 'slideDown';

		qazana.channels.panelElements.reply( 'category:' + this.model.get( 'name' ) + ':active', ! isActive );

		this.$el.toggleClass( activeClass, ! isActive );

		$items[ slideFn ]( 300, function() {
			qazana.getPanelView().updateScrollbar();
		} );
	},
} );

module.exports = PanelElementsCategoryView;
