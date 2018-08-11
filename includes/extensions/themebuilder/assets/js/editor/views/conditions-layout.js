var BaseModalLayout = qazana.modules.components.templateLibrary.views.BaseModalLayout;

module.exports = BaseModalLayout.extend( {

	getModalOptions: function() {
		return {
			id: 'qazana-conditions-modal'
		};
	},

	getLogoOptions: function() {
		return {
			title: qazana.translate( 'display_conditions' )
		};
	},

	initialize: function() {
		BaseModalLayout.prototype.initialize.apply( this, arguments );

		this.showLogo();
	}
} );