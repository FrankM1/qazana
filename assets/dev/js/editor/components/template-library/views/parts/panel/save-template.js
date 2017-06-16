var TemplateLibrarySaveTemplateView;

TemplateLibrarySaveTemplateView = Marionette.ItemView.extend( {
	template: '#tmpl-builder-template-library-save-template',

	id: 'builder-template-library-save-template',

	ui: {
		form: '#builder-template-library-save-template-form',
		submitButton: '#builder-template-library-save-template-submit'
	},

	events: {
		'submit @ui.form': 'onFormSubmit'
	},

	getSaveType: function() {
		return this.model ? this.model.get( 'elType' ) : 'page';
	},

	templateHelpers: function() {
		var saveType = this.getSaveType(),
			templateType = builder.templates.getTemplateTypes( saveType );

		return templateType.saveDialog;
	},

	onFormSubmit: function( event ) {
		event.preventDefault();

		var formData = this.ui.form.builderSerializeObject(),
			saveType = this.model ? this.model.get( 'elType' ) : 'page';

		formData.data = this.model ? [ this.model.toJSON() ] : builder.elements.toJSON();

		this.ui.submitButton.addClass( 'builder-button-state' );

		builder.templates.saveTemplate( saveType, formData );
	}
} );

module.exports = TemplateLibrarySaveTemplateView;
