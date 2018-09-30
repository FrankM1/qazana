var InsertTemplateHandler;

InsertTemplateHandler = Marionette.Behavior.extend( {
	ui: {
		insertButton: '.qazana-template-library-template-insert',
	},

	events: {
		'click @ui.insertButton': 'onInsertButtonClick',
	},

	onInsertButtonClick: function() {
		if ( this.view.model.get( 'hasPageSettings' ) ) {
			InsertTemplateHandler.showImportDialog( this.view.model );
			return;
		}

		qazana.templates.importTemplate( this.view.model );
	},
}, {
	dialog: null,

	showImportDialog: function( model ) {
		var dialog = InsertTemplateHandler.getDialog();

		dialog.onConfirm = function() {
			qazana.templates.importTemplate( model, { withPageSettings: true } );
		};

		dialog.onCancel = function() {
			qazana.templates.importTemplate( model );
		};

		dialog.show();
	},

	initDialog: function() {
		InsertTemplateHandler.dialog = qazana.dialogsManager.createWidget( 'confirm', {
			id: 'qazana-insert-template-settings-dialog',
			headerMessage: qazana.translate( 'import_template_dialog_header' ),
			message: qazana.translate( 'import_template_dialog_message' ) + '<br>' + qazana.translate( 'import_template_dialog_message_attention' ),
			strings: {
				confirm: qazana.translate( 'yes' ),
				cancel: qazana.translate( 'no' ),
			},
		} );
	},

	getDialog: function() {
		if ( ! InsertTemplateHandler.dialog ) {
			InsertTemplateHandler.initDialog();
		}

		return InsertTemplateHandler.dialog;
	},
} );

module.exports = InsertTemplateHandler;
