var TemplateLibraryHeaderBackView;

TemplateLibraryHeaderBackView = Marionette.ItemView.extend( {
	template: '#tmpl-builder-template-library-header-back',

	id: 'builder-template-library-header-preview-back',

	events: {
		'click': 'onClick'
	},

	onClick: function() {
		builder.templates.showTemplates();
	}
} );

module.exports = TemplateLibraryHeaderBackView;
