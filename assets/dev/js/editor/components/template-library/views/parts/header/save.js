var TemplateLibraryHeaderSaveView;

TemplateLibraryHeaderSaveView = Marionette.ItemView.extend( {
	template: '#tmpl-builder-template-library-header-save',

	id: 'builder-template-library-header-save',

	className: 'builder-template-library-header-item',

	events: {
		'click': 'onClick'
	},

	onClick: function() {
		builder.templates.getLayout().showSaveTemplateView();
	}
} );

module.exports = TemplateLibraryHeaderSaveView;
