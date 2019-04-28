var TemplateLibraryTemplateView = require( 'qazana-templates/views/template/base' ),
    TemplateLibraryTemplateThemeView;

TemplateLibraryTemplateThemeView = TemplateLibraryTemplateView.extend( {
    template: '#tmpl-qazana-template-library-template-theme',

    onPreviewButtonClick: function() {
        qazana.templates.getLayout().showPreviewView( this.model );
    },
} );

module.exports = TemplateLibraryTemplateThemeView;
