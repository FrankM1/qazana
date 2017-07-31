var TemplateLibraryImportView;

TemplateLibraryImportView = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-template-library-import',

	id: 'qazana-template-library-import',

	ui: {
		uploadForm: '#qazana-template-library-import-form',
		input: '#qazana-template-library-import-file',
		submitButton: '#qazana-template-library-import-submit'
	},

	events: {
		'submit @ui.uploadForm': 'onFormSubmit',
		'change @ui.input': 'onInputChanged'
	},

	onInputChanged: function( event ) {
	    this.file = event.target.files;
	},

	onFormSubmit: function( event ) {
		var self = this;

		event.preventDefault();
		var	uploadForm = new FormData();
		qazana.templates.getLayout().showLoadingView();

		jQuery(self.ui.submitButton).addClass( 'qazana-button-state' );

		if ( ! self.file ) {
			qazana.templates.showErrorDialog( 'Please select a template file to import' );
			qazana.templates.showTemplates();
			return;
		}

		uploadForm.append( 'file', self.file[0] );

		qazana.ajax.send( 'import_template', {
			data: uploadForm,
			processData: false,
			contentType: false,
			cache: false,
			success: function( response ) {
				qazana.templates.getTemplatesCollection().add( response );
				qazana.templates.setTemplatesSource( 'local', true );
				qazana.templates.showTemplates();
			},
			error: function( response ) {
				qazana.templates.showErrorDialog( response );
			}
		} );

	}
} );

module.exports = TemplateLibraryImportView;
