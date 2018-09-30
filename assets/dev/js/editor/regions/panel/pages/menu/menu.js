var PanelMenuGroupView = require( 'qazana-panel/pages/menu/views/group' ),
	PanelMenuPageView;

PanelMenuPageView = Marionette.CompositeView.extend( {
	id: 'qazana-panel-page-menu',

	template: '#tmpl-qazana-panel-menu',

	childView: PanelMenuGroupView,

	childViewContainer: '#qazana-panel-page-menu-content',

	initialize: function() {
		this.collection = PanelMenuPageView.getGroups();
	},

	onDestroy: function() {
		var arrowClass = 'eicon-arrow-' + ( qazana.config.is_rtl ? 'right' : 'left' );

		qazana.panel.currentView.getHeaderView().ui.menuIcon.removeClass( arrowClass ).addClass( 'eicon-menu-bar' );
	},
}, {
	groups: null,

	initGroups: function() {
		var menus = [];

		if ( qazana.config.user.is_administrator ) {
			menus = [
				{
					name: 'style',
					title: qazana.translate( 'global_style' ),
					items: [
						{
							name: 'global-colors',
							icon: 'fa fa-paint-brush',
							title: qazana.translate( 'global_colors' ),
							type: 'page',
							pageName: 'colorScheme',
						},
						{
							name: 'global-fonts',
							icon: 'fa fa-font',
							title: qazana.translate( 'global_fonts' ),
							type: 'page',
							pageName: 'typographyScheme',
						},
						{
							name: 'color-picker',
							icon: 'fa fa-eyedropper',
							title: qazana.translate( 'color_picker' ),
							type: 'page',
							pageName: 'colorPickerScheme',
						},
					],
				},
				{
					name: 'settings',
					title: qazana.translate( 'settings' ),
					items: [
						{
							name: 'qazana-settings',
							icon: 'fa fa-external-link',
							title: qazana.translate( 'qazana_settings' ),
							type: 'link',
							link: qazana.config.settings_page_link,
							newTab: true,
						},
						{
							name: 'about-qazana',
							icon: 'fa fa-info-circle',
							title: qazana.translate( 'about_qazana' ),
							type: 'link',
							link: qazana.config.qazana_site,
							newTab: true,
						},
					],
				},
			];
		}

		this.groups = new Backbone.Collection( menus );
	},

	getGroups: function() {
		if ( ! this.groups ) {
			this.initGroups();
		}

		return this.groups;
	},

	addItem: function( itemData, groupName, before ) {
		var group = this.getGroups().findWhere( { name: groupName } );

		if ( ! group ) {
			return;
		}

		var items = group.get( 'items' ),
			beforeItem;

		if ( before ) {
			beforeItem = _.findWhere( items, { name: before } );
		}

		if ( beforeItem ) {
			items.splice( items.indexOf( beforeItem ), 0, itemData );
		} else {
			items.push( itemData );
		}
	},
} );

module.exports = PanelMenuPageView;
