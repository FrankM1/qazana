var TemplateLibraryTemplatesEmptyView;

TemplateLibraryTemplatesEmptyView = Marionette.ItemView.extend( {
	id: 'qazana-template-library-templates-empty',

	template: '#tmpl-qazana-template-library-templates-empty',

	ui: {
		title: '.qazana-template-library-blank-title',
		message: '.qazana-template-library-blank-message',
	},

	modesStrings: {
		empty: {
			title: qazana.translate( 'templates_empty_title' ),
			message: qazana.translate( 'templates_empty_message' ),
		},
		noResults: {
			title: qazana.translate( 'templates_no_results_title' ),
			message: qazana.translate( 'templates_no_results_message' ),
		},
		noFavorites: {
			title: qazana.translate( 'templates_no_favorites_title' ),
			message: qazana.translate( 'templates_no_favorites_message' ),
		},
	},

	getCurrentMode: function() {
		if ( qazana.templates.getFilter( 'text' ) ) {
			return 'noResults';
		}

		if ( qazana.templates.getFilter( 'favorite' ) ) {
			return 'noFavorites';
		}

		return 'empty';
	},

	onRender: function() {
		var modeStrings = this.modesStrings[ this.getCurrentMode() ];

		this.ui.title.html( modeStrings.title );

		this.ui.message.html( modeStrings.message );
	},
} );

module.exports = TemplateLibraryTemplatesEmptyView;
