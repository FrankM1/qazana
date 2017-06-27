var TemplateLibraryHeaderBackView;

TemplateLibraryHeaderBackView = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-template-library-header-back',

	id: 'qazana-template-library-header-preview-back',

	events: {
		'click': 'onClick'
	},

	onClick: function() {
		qazana.templates.showTemplates();
	}
} );

module.exports = TemplateLibraryHeaderBackView;
