var ViewModule = require( 'qazana-utils/view-module' ),
	NewTemplateLayout = require( 'qazana-admin/new-template/layout' );

var NewTemplateModule = ViewModule.extend( {

	getDefaultSettings: function() {
		return {
			selectors: {
				addButton: '.page-title-action:first, #qazana-template-library-add-new',
			},
		};
	},

	getDefaultElements: function() {
		var selectors = this.getSettings( 'selectors' );

		return {
			$addButton: jQuery( selectors.addButton ),
		};
	},

	bindEvents: function() {
		this.elements.$addButton.on( 'click', this.onAddButtonClick );
	},

	onInit: function() {
		ViewModule.prototype.onInit.apply( this, arguments );

		this.layout = new NewTemplateLayout();
	},

	onAddButtonClick: function( event ) {
		event.preventDefault();

		this.layout.showModal();
	},
} );

jQuery( function() {
	window.qazanaNewTemplate = new NewTemplateModule();
} );
