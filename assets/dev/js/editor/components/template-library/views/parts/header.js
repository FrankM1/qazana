var TemplateLibraryHeaderView;

TemplateLibraryHeaderView = Marionette.LayoutView.extend( {

	className: 'qazana-templates-modal__header',

	template: '#tmpl-qazana-templates-modal__header',

	regions: {
		logoArea: '.qazana-templates-modal__header__logo-area',
		tools: '#qazana-template-library-header-tools',
		menuArea: '.qazana-templates-modal__header__menu-area'
	},

	ui: {
		closeModal: '.qazana-templates-modal__header__close-modal'
	},

	events: {
		'click @ui.closeModal': 'onCloseModalClick'
	},

	onCloseModalClick: function() {
		this._parent._parent._parent.hideModal();
	}
} );

module.exports = TemplateLibraryHeaderView;
