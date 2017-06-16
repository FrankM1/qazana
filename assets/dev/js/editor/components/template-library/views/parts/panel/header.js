var TemplateLibraryHeaderView;

TemplateLibraryHeaderView = Marionette.LayoutView.extend( {

	id: 'builder-template-library-header',

	template: '#tmpl-builder-template-library-header',

	regions: {
		logoArea: '#builder-template-library-header-logo-area',
		tools: '#builder-template-library-header-tools',
		menuArea: '#builder-template-library-header-menu-area',
		searchArea: '#builder-template-library-header-search-area'
	},

	ui: {
		closeModal: '#builder-template-library-header-close-modal'
	},

	events: {
		'click @ui.closeModal': 'onCloseModalClick'
	},

	onCloseModalClick: function() {
		builder.templates.closeModal();
	}
} );

module.exports = TemplateLibraryHeaderView;
