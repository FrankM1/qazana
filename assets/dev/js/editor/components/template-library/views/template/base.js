var TemplateLibraryTemplateView;

TemplateLibraryTemplateView = Marionette.ItemView.extend( {
	className: function() {
		return 'qazana-template-library-template qazana-template-library-template-' + this.model.get( 'source' );
	},

	ui: function() {
		return {
			insertButton: '.qazana-template-library-template-insert',
			previewButton: '.qazana-template-library-template-preview'
		};
	},

	events: function() {
		return {
			'click @ui.insertButton': 'onInsertButtonClick',
			'click @ui.previewButton': 'onPreviewButtonClick'
		};
	},

	onInsertButtonClick: function() {
		qazana.templates.importTemplate( this.model );
	}
} );

module.exports = TemplateLibraryTemplateView;
