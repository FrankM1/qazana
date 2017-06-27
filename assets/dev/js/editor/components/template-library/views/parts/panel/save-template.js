var TemplateLibrarySaveTemplateView;

TemplateLibrarySaveTemplateView = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-template-library-save-template',

	id: 'qazana-template-library-save-template',

	ui: {
		form: '#qazana-template-library-save-template-form',
		submitButton: '#qazana-template-library-save-template-submit'
	},

	events: {
		'submit @ui.form': 'onFormSubmit'
	},

	getSaveType: function() {
		return this.model ? this.model.get( 'elType' ) : 'page';
	},

	templateHelpers: function() {
		var saveType = this.getSaveType(),
			templateType = qazana.templates.getTemplateTypes( saveType );

		return templateType.saveDialog;
	},

	onFormSubmit: function( event ) {
		event.preventDefault();

		var formData = this.ui.form.qazanaSerializeObject(),
			saveType = this.model ? this.model.get( 'elType' ) : 'page';

		formData.data = this.model ? [ this.model.toJSON() ] : qazana.elements.toJSON();

		this.ui.submitButton.addClass( 'qazana-button-state' );

		qazana.templates.saveTemplate( saveType, formData );
	}
} );

module.exports = TemplateLibrarySaveTemplateView;
