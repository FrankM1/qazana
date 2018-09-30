var BaseModalLayout = require( 'qazana-templates/views/base-modal-layout' ),
	NewTemplateView = require( 'qazana-admin/new-template/view' );

module.exports = BaseModalLayout.extend( {

	getModalOptions: function() {
		return {
			id: 'qazana-new-template-modal',
		};
	},

	getLogoOptions: function() {
		return {
			title: qazanaAdmin.config.i18n.new_template,
		};
	},

	initialize: function() {
		BaseModalLayout.prototype.initialize.apply( this, arguments );

		this.showLogo();

		this.showContentView();
	},

	getDialogsManager: function() {
		return qazanaAdmin.getDialogsManager();
	},

	showContentView: function() {
		this.modalContent.show( new NewTemplateView() );
	},
} );
