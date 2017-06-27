var TemplateLibraryHeaderPreviewView;

TemplateLibraryHeaderPreviewView = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-template-library-header-preview',

	id: 'qazana-template-library-header-preview',

	ui: {
		insertButton: '#qazana-template-library-header-preview-insert'
	},

	events: {
		'click @ui.insertButton': 'onInsertButtonClick'
	},

	onInsertButtonClick: function() {
		qazana.templates.importTemplate( this.model );
	}
} );

module.exports = TemplateLibraryHeaderPreviewView;
