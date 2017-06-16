var TemplateLibraryHeaderPreviewView;

TemplateLibraryHeaderPreviewView = Marionette.ItemView.extend( {
	template: '#tmpl-builder-template-library-header-preview',

	id: 'builder-template-library-header-preview',

	ui: {
		insertButton: '#builder-template-library-header-preview-insert'
	},

	events: {
		'click @ui.insertButton': 'onInsertButtonClick'
	},

	onInsertButtonClick: function() {
		builder.templates.importTemplate( this.model );
	}
} );

module.exports = TemplateLibraryHeaderPreviewView;
