var TemplateLibraryHeaderLogoView;

TemplateLibraryHeaderLogoView = Marionette.ItemView.extend( {
	template: '#tmpl-builder-template-library-header-logo',

	id: 'builder-template-library-header-logo',

	events: {
		'click': 'onClick'
	},

	onClick: function() {
		builder.templates.setTemplatesSource( 'remote' );
		builder.templates.showTemplates();
	}
} );

module.exports = TemplateLibraryHeaderLogoView;
