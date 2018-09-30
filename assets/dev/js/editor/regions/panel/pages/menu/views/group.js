var PanelMenuItemView = require( 'qazana-panel/pages/menu/views/item' );

module.exports = Marionette.CompositeView.extend( {
	template: '#tmpl-qazana-panel-menu-group',

	className: 'qazana-panel-menu-group',

	childView: PanelMenuItemView,

	childViewContainer: '.qazana-panel-menu-items',

	initialize: function() {
		this.collection = new Backbone.Collection( this.model.get( 'items' ) );
	},

	onChildviewClick: function( childView ) {
		var menuItemType = childView.model.get( 'type' );

		switch ( menuItemType ) {
			case 'page':
				var pageName = childView.model.get( 'pageName' ),
					pageTitle = childView.model.get( 'title' );

				qazana.getPanelView().setPage( pageName, pageTitle );

				break;

			case 'link':
				var link = childView.model.get( 'link' ),
					isNewTab = childView.model.get( 'newTab' );

				if ( isNewTab ) {
					open( link, '_blank' );
				} else {
					location.href = childView.model.get( 'link' );
				}

				break;

			default:
				var callback = childView.model.get( 'callback' );

				if ( _.isFunction( callback ) ) {
					callback.call( childView );
				}
		}
	},
} );
