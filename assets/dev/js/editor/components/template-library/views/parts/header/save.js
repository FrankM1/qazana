var TemplateLibraryHeaderSaveView;

TemplateLibraryHeaderSaveView = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-template-library-header-save',

	id: 'qazana-template-library-header-save',

	className: 'qazana-template-library-header-item',

	events: {
		'click': 'onClick'
	},

	onClick: function() {
		qazana.templates.getLayout().showSaveTemplateView();
	}
} );

module.exports = TemplateLibraryHeaderSaveView;
