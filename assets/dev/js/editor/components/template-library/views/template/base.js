var TemplateLibraryTemplateView;

TemplateLibraryTemplateView = Marionette.ItemView.extend( {
	className: function() {
		return 'builder-template-library-template builder-template-library-template-' + this.model.get( 'source' );
	},

	ui: function() {
		return {
			insertButton: '.builder-template-library-template-insert',
			previewButton: '.builder-template-library-template-preview'
		};
	},

	events: function() {
		return {
			'click @ui.insertButton': 'onInsertButtonClick',
			'click @ui.previewButton': 'onPreviewButtonClick'
		};
	},

	onInsertButtonClick: function() {
		builder.templates.importTemplate( this.model );
	}
} );

module.exports = TemplateLibraryTemplateView;
