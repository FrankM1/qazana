var TemplateLibraryHeaderLogoView;

TemplateLibraryHeaderLogoView = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-template-library-header-logo',

	id: 'qazana-template-library-header-logo',

	events: {
		'click': 'onClick'
	},

	onClick: function() {
		qazana.templates.setTemplatesSource( 'remote' );
		qazana.templates.showTemplates();
	}
} );

module.exports = TemplateLibraryHeaderLogoView;
