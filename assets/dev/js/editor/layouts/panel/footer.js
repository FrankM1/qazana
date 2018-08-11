module.exports = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-panel-footer-content',

	tagName: 'nav',

	id: 'qazana-panel-footer-tools',

	possibleRotateModes: [ 'portrait', 'landscape' ],

	ui: {
		menuButtons: '.qazana-panel-footer-tool',
		settings: '#qazana-panel-footer-settings',
		deviceModeIcon: '#qazana-panel-footer-responsive > i',
		deviceModeButtons: '#qazana-panel-footer-responsive .qazana-panel-footer-sub-menu-item',
		saveTemplate: '#qazana-panel-saver-menu-save-template',
		history: '#qazana-panel-footer-history'
	},

	events: {
		'click @ui.settings': 'onClickSettings',
		'click @ui.deviceModeButtons': 'onClickResponsiveButtons',
		'click @ui.saveTemplate': 'onClickSaveTemplate',
		'click @ui.history': 'onClickHistory'
	},

	behaviors: function() {
		var behaviors = {
			saver: {
				behaviorClass: qazana.modules.components.saver.behaviors.FooterSaver
			}
		};

		return qazana.hooks.applyFilters( 'panel/footer/behaviors', behaviors, this );
	},

	initialize: function() {
		this.listenTo( qazana.channels.deviceMode, 'change', this.onDeviceModeChange );
	},

	getDeviceModeButton: function( deviceMode ) {
		return this.ui.deviceModeButtons.filter( '[data-device-mode="' + deviceMode + '"]' );
	},

	onPanelClick: function( event ) {
		var $target = jQuery( event.target ),
			isClickInsideOfTool = $target.closest( '.qazana-panel-footer-sub-menu-wrapper' ).length;

		if ( isClickInsideOfTool ) {
			return;
		}

		var $tool = $target.closest( '.qazana-panel-footer-tool' ),
			isClosedTool = $tool.length && ! $tool.hasClass( 'qazana-open' );

		this.ui.menuButtons.filter( ':not(.qazana-leave-open)' ).removeClass( 'qazana-open' );

		if ( isClosedTool ) {
			$tool.addClass( 'qazana-open' );
		}
	},

	onClickSettings: function() {
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

	onClickResponsiveButtons: function( event ) {
		var $clickedButton = this.$( event.currentTarget ),
			newDeviceMode = $clickedButton.data( 'device-mode' );

		qazana.changeDeviceMode( newDeviceMode );
	},

	onClickSaveTemplate: function() {
		qazana.templates.startModal( {
			onReady: function() {
				qazana.templates.getLayout().showSaveTemplateView();
			}
		} );
	},

	onClickHistory: function() {
		if ( 'historyPage' !== qazana.getPanelView().getCurrentPageName() ) {
			qazana.getPanelView().setPage( 'historyPage' );
		}
	},

	onRender: function() {
		var self = this;

		_.defer( function() {
			qazana.getPanelView().$el.on( 'click', self.onPanelClick.bind( self ) );
		} );
	}
} );
