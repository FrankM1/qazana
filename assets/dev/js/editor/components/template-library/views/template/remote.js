var TemplateLibraryTemplateView = require( 'qazana-templates/views/template/base' ),
	TemplateLibraryTemplateRemoteView;

TemplateLibraryTemplateRemoteView = TemplateLibraryTemplateView.extend( {
	template: '#tmpl-qazana-template-library-template-remote',

	onPreviewButtonClick: function() {
		qazana.templates.getLayout().showPreviewView( this.model );
	}
} );

module.exports = TemplateLibraryTemplateRemoteView;
