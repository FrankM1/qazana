var TemplateLibraryTemplateView = require( 'builder-templates/views/template/base' ),
    TemplateLibraryTemplateThemeView;

TemplateLibraryTemplateThemeView = TemplateLibraryTemplateView.extend( {
    template: '#tmpl-builder-template-library-template-theme',

    onPreviewButtonClick: function() {
        builder.templates.getLayout().showPreviewView( this.model );
    }
} );

module.exports = TemplateLibraryTemplateThemeView;
