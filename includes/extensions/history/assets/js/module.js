var HistoryPageView = require( './panel-page' ),
	Manager;

Manager = function() {
	var self = this;

	var addPanelPage = function() {
		qazana.getPanelView().addPage( 'historyPage', {
			view: HistoryPageView,
			title: qazana.translate( 'history' ),
		} );
	};

	var init = function() {
		qazana.on( 'preview:loaded', addPanelPage );

		self.history = require( './history/manager' );

		self.revisions = require( './revisions/manager' );

		self.revisions.init();
	};

	jQuery( window ).on( 'qazana:init', init );
};

module.exports = new Manager();
