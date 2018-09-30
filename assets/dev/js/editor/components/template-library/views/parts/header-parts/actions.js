module.exports = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-template-library-header-actions',

	id: 'qazana-template-library-header-actions',

	ui: {
		import: '#qazana-template-library-header-import i',
		sync: '#qazana-template-library-header-sync i',
		save: '#qazana-template-library-header-save i',
	},

	events: {
		'click @ui.import': 'onImportClick',
		'click @ui.sync': 'onSyncClick',
		'click @ui.save': 'onSaveClick',
	},

	onImportClick: function() {
		qazana.templates.getLayout().showImportView();
	},

	onSyncClick: function() {
		var self = this;

		self.ui.sync.addClass( 'eicon-animation-spin' );

		qazana.templates.requestLibraryData( {
			onUpdate: function() {
				self.ui.sync.removeClass( 'eicon-animation-spin' );

				qazana.templates.setTemplatesPage( qazana.templates.getFilter( 'source' ), qazana.templates.getFilter( 'type' ) );
			},
			forceUpdate: true,
			forceSync: true,
		} );
	},

	onSaveClick: function() {
		qazana.templates.getLayout().showSaveTemplateView();
	},
} );
