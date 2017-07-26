var PanelMenuItemView = require( 'qazana-panel/pages/menu/views/item' ),
	PanelMenuPageView;

PanelMenuPageView = Marionette.CollectionView.extend( {
	id: 'qazana-panel-page-menu',

	childView: PanelMenuItemView,

	initialize: function() {
		this.collection = new Backbone.Collection( [
            {
                icon: 'fa fa-paint-brush',
                title: qazana.translate( 'global_colors' ),
				type: 'page',
                pageName: 'colorScheme'
            },
            {
                icon: 'fa fa-font',
                title: qazana.translate( 'global_fonts' ),
				type: 'page',
                pageName: 'typographyScheme'
            },
			{
				icon: 'fa fa-eyedropper',
				title: qazana.translate( 'color_picker' ),
				type: 'page',
				pageName: 'colorPickerScheme'
			},
			{
				icon: 'fa fa-history',
				title: qazana.translate( 'revision_history' ),
				type: 'page',
				pageName: 'revisionsPage'
			},
			{
				icon: 'fa fa-cog',
				title: qazana.translate( 'page_settings' ),
				type: 'page',
				pageName: 'settingsPage'
			},
            {
                icon: 'fa fa-eraser',
                title: qazana.translate( 'clear_page' ),
                callback: function() {
                    qazana.clearPage();
                }
            },
			{
				/*icon: 'eicon-qazana',
				title: qazana.translate( 'qazana_settings' ),
				type: 'link',
				link: qazana.config.settings_page_link,
				newTab: true
			},
			{*/
				icon: 'fa fa-info-circle',
				title: qazana.translate( 'about_qazana' ),
				type: 'link',
				link: qazana.config.qazana_site,
				newTab: true
			}
		] );
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
	}
} );

module.exports = PanelMenuPageView;
