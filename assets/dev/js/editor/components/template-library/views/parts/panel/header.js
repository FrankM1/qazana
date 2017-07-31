var TemplateLibraryHeaderView;

TemplateLibraryHeaderView = Marionette.LayoutView.extend( {

	id: 'qazana-template-library-header',

	template: '#tmpl-qazana-template-library-header',

	regions: {
		logoArea: '#qazana-template-library-header-logo-area',
		tools: '#qazana-template-library-header-tools',
		import: '#qazana-template-library-header-import',
		menuArea: '#qazana-template-library-header-menu-area',
		searchArea: '#qazana-template-library-header-search-area'
	},

	ui: {
		closeModal: '#qazana-template-library-header-close-modal'
	},

	events: {
		'click @ui.closeModal': 'onCloseModalClick'
	},

	onCloseModalClick: function() {
		qazana.templates.closeModal();
	}
} );

module.exports = TemplateLibraryHeaderView;
