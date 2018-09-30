module.exports = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-panel-footer-content',

	tagName: 'nav',

	id: 'qazana-panel-footer-tools',

	possibleRotateModes: [ 'portrait', 'landscape' ],

	ui: {
		buttonSave: '#qazana-panel-saver-button-publish, #qazana-panel-saver-menu-save-draft', // TODO: remove. Compatibility for Pro <= 1.9.5
		menuButtons: '.qazana-panel-footer-tool',
		settings: '#qazana-panel-footer-settings',
		deviceModeIcon: '#qazana-panel-footer-responsive > i',
		deviceModeButtons: '#qazana-panel-footer-responsive .qazana-panel-footer-sub-menu-item',
		saveTemplate: '#qazana-panel-saver-menu-save-template',
		history: '#qazana-panel-footer-history',
		navigator: '#qazana-panel-footer-navigator',
	},

	events: {
		'click @ui.menuButtons': 'onMenuButtonsClick',
		'click @ui.settings': 'onSettingsClick',
		'click @ui.deviceModeButtons': 'onResponsiveButtonsClick',
		'click @ui.saveTemplate': 'onSaveTemplateClick',
		'click @ui.history': 'onHistoryClick',
		'click @ui.navigator': 'onNavigatorClick',
	},

	behaviors: function() {
		var behaviors = {
			saver: {
				behaviorClass: qazana.modules.components.saver.behaviors.FooterSaver,
			},
		};

		return qazana.hooks.applyFilters( 'panel/footer/behaviors', behaviors, this );
	},

	initialize: function() {
		this.listenTo( qazana.channels.deviceMode, 'change', this.onDeviceModeChange );
	},

	getDeviceModeButton: function( deviceMode ) {
		return this.ui.deviceModeButtons.filter( '[data-device-mode="' + deviceMode + '"]' );
	},

	onMenuButtonsClick: function( event ) {
		var $tool = jQuery( event.currentTarget );

		// If the tool is not toggleable or the click is inside of a tool
		if ( ! $tool.hasClass( 'qazana-toggle-state' ) || jQuery( event.target ).closest( '.qazana-panel-footer-sub-menu-item' ).length ) {
			return;
		}

		var isOpen = $tool.hasClass( 'qazana-open' );

		this.ui.menuButtons.not( '.qazana-leave-open' ).removeClass( 'qazana-open' );

		if ( ! isOpen ) {
			$tool.addClass( 'qazana-open' );
		}
	},

	onSettingsClick: function() {
		var self = this;

		if ( 'page_settings' !== qazana.getPanelView().getCurrentPageName() ) {
			qazana.getPanelView().setPage( 'page_settings' );

			qazana.getPanelView().getCurrentPageView().once( 'destroy', function() {
				self.ui.settings.removeClass( 'qazana-open' );
			} );
		}
	},

	onDeviceModeChange: function() {
		var previousDeviceMode = qazana.channels.deviceMode.request( 'previousMode' ),
			currentDeviceMode = qazana.channels.deviceMode.request( 'currentMode' );

		this.getDeviceModeButton( previousDeviceMode ).removeClass( 'active' );

		this.getDeviceModeButton( currentDeviceMode ).addClass( 'active' );

		// Change the footer icon
		this.ui.deviceModeIcon.removeClass( 'eicon-device-' + previousDeviceMode ).addClass( 'eicon-device-' + currentDeviceMode );
	},

	onResponsiveButtonsClick: function( event ) {
		var $clickedButton = this.$( event.currentTarget ),
			newDeviceMode = $clickedButton.data( 'device-mode' );

		qazana.changeDeviceMode( newDeviceMode );
	},

	onSaveTemplateClick: function() {
		qazana.templates.startModal( {
			onReady: function() {
				qazana.templates.getLayout().showSaveTemplateView();
			},
		} );
	},

	onHistoryClick: function() {
		if ( 'historyPage' !== qazana.getPanelView().getCurrentPageName() ) {
			qazana.getPanelView().setPage( 'historyPage' );
		}
	},

	onNavigatorClick: function() {
		if ( qazana.navigator.isOpen() ) {
			qazana.navigator.close();
		} else {
			qazana.navigator.open();
		}
	},
} );
