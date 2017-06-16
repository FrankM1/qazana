var TemplateLibraryImportView;

TemplateLibraryImportView = Marionette.ItemView.extend( {
	template: '#tmpl-builder-template-library-import',

	id: 'builder-template-library-import',

	ui: {
		uploadForm: '#builder-template-library-import-form'
	},

	events: {
		'submit @ui.uploadForm': 'onFormSubmit'
	},

	onFormSubmit: function( event ) {
		event.preventDefault();

		builder.templates.getLayout().showLoadingView();

		builder.ajax.send( 'import_template', {
			data: new FormData( this.ui.uploadForm[ 0 ] ),
			processData: false,
			contentType: false,
			success: function( data ) {
				builder.templates.getTemplatesCollection().add( data.item );

				builder.templates.showTemplates();
			},
			error: function( data ) {
				builder.templates.showErrorDialog( data );
			}
		} );
	}
} );

module.exports = TemplateLibraryImportView;
