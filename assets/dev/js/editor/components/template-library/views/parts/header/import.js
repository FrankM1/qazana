var TemplateLibraryHeaderImportView;

TemplateLibraryHeaderImportView = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-template-library-header-import',

	id: 'qazana-template-library-header-import',

	className: 'qazana-template-library-header-item',

	events: {
		'click': 'onClick'
	},

	onClick: function(e) {
		qazana.templates.getLayout().showImportView();
	}
} );

module.exports = TemplateLibraryHeaderImportView;
