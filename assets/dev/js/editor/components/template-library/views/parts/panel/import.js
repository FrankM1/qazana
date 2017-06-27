var TemplateLibraryImportView;

TemplateLibraryImportView = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-template-library-import',

	id: 'qazana-template-library-import',

	ui: {
		uploadForm: '#qazana-template-library-import-form'
	},

	events: {
		'submit @ui.uploadForm': 'onFormSubmit'
	},

	onFormSubmit: function( event ) {
		event.preventDefault();

		qazana.templates.getLayout().showLoadingView();

		qazana.ajax.send( 'import_template', {
			data: new FormData( this.ui.uploadForm[ 0 ] ),
			processData: false,
			contentType: false,
			success: function( data ) {
				qazana.templates.getTemplatesCollection().add( data.item );

				qazana.templates.showTemplates();
			},
			error: function( data ) {
				qazana.templates.showErrorDialog( data );
			}
		} );
	}
} );

module.exports = TemplateLibraryImportView;
