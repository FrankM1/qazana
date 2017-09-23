var PanelFooterItemView;

PanelFooterItemView = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-panel-footer-content',

	tagName: 'nav',

	id: 'qazana-panel-footer-tools',

	possibleRotateModes: [ 'portrait', 'landscape' ],

	ui: {
		menuButtons: '.qazana-panel-footer-tool',
		deviceModeIcon: '#qazana-panel-footer-responsive > i',
		deviceModeButtons: '#qazana-panel-footer-responsive .qazana-panel-footer-sub-menu-item',
		buttonSave: '#qazana-panel-footer-save',
		buttonSaveButton: '#qazana-panel-footer-save .qazana-button',
		buttonPublish: '#qazana-panel-footer-publish',
		watchTutorial: '#qazana-panel-footer-watch-tutorial',
		showTemplates: '#qazana-panel-footer-templates-modal',
		saveTemplate: '#qazana-panel-footer-save-template'
	},

	events: {
		'click @ui.deviceModeButtons': 'onClickResponsiveButtons',
		'click @ui.buttonSave': 'onClickButtonSave',
		'click @ui.buttonPublish': 'onClickButtonPublish',
		'click @ui.watchTutorial': 'onClickWatchTutorial',
		'click @ui.showTemplates': 'onClickShowTemplates',
		'click @ui.saveTemplate': 'onClickSaveTemplate'
	},

	initialize: function() {
		this._initDialog();

		this.listenTo( qazana.channels.editor, 'status:change', this.onEditorChanged )
			.listenTo( qazana.channels.deviceMode, 'change', this.onDeviceModeChange );
	},

	_initDialog: function() {
		var dialog;

		this.getDialog = function() {
			if ( ! dialog ) {
				var $ = Backbone.$,
					$dialogMessage = $( '<div>', {
						'class': 'qazana-dialog-message'
					} ),
					$messageIcon = $( '<i>', {
						'class': 'fa fa-check-circle'
					} ),
					$messageText = $( '<div>', {
						'class': 'qazana-dialog-message-text'
					} ).text( qazana.translate( 'saved' ) );

				$dialogMessage.append( $messageIcon, $messageText );

				dialog = qazana.dialogsManager.createWidget( 'simple', {
					id: 'qazana-saved-popup',
					position: {
						element: 'message',
						of: 'widget'
					},
					hide: {
						auto: true,
						autoDelay: 1500
					}
				} );

				dialog.setMessage( $dialogMessage );
			}

			return dialog;
		};
	},

	_publishBuilder: function() {
		var self = this;

		var options = {
			status: 'publish',
			onSuccess: function() {
				self.getDialog().show();

				self.ui.buttonSaveButton.removeClass( 'qazana-button-state' );

				NProgress.done();
			}
		};

		self.ui.buttonSaveButton.addClass( 'qazana-button-state' );

		NProgress.start();

		qazana.saveEditor( options );
	},

	_saveBuilderDraft: function() {
		qazana.saveEditor();
	},

	getDeviceModeButton: function( deviceMode ) {
		return this.ui.deviceModeButtons.filter( '[data-device-mode="' + deviceMode + '"]' );
	},

	onPanelClick: function( event ) {
		var $target = Backbone.$( event.target ),
			isClickInsideOfTool = $target.closest( '.qazana-panel-footer-sub-menu-wrapper' ).length;

		if ( isClickInsideOfTool ) {
			return;
		}

		var $tool = $target.closest( '.qazana-panel-footer-tool' ),
			isClosedTool = $tool.length && ! $tool.hasClass( 'qazana-open' );

		this.ui.menuButtons.removeClass( 'qazana-open' );

		if ( isClosedTool ) {
			$tool.addClass( 'qazana-open' );
		}
	},

	onEditorChanged: function() {
		this.ui.buttonSave.toggleClass( 'qazana-save-active', qazana.isEditorChanged() );
	},

	onDeviceModeChange: function() {
		var previousDeviceMode = qazana.channels.deviceMode.request( 'previousMode' ),
			currentDeviceMode = qazana.channels.deviceMode.request( 'currentMode' );

		this.getDeviceModeButton( previousDeviceMode ).removeClass( 'active' );

		this.getDeviceModeButton( currentDeviceMode ).addClass( 'active' );

		// Change the footer icon
		this.ui.deviceModeIcon.removeClass( 'eicon-device-' + previousDeviceMode ).addClass( 'eicon-device-' + currentDeviceMode );
	},

	onClickButtonSave: function() {
		//this._saveBuilderDraft();
		this._publishBuilder();
	},

	onClickButtonPublish: function( event ) {
		// Prevent click on save button
		event.stopPropagation();

		this._publishBuilder();
	},

	onClickResponsiveButtons: function( event ) {
		var $clickedButton = this.$( event.currentTarget ),
			newDeviceMode = $clickedButton.data( 'device-mode' );

		qazana.changeDeviceMode( newDeviceMode );
	},

	onClickWatchTutorial: function() {
		qazana.introduction.startIntroduction();
	},

	onClickShowTemplates: function() {
		qazana.templates.showTemplatesModal();
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
			qazana.getPanelView().$el.on( 'click', _.bind( self.onPanelClick, self ) );
		} );
	}
} );

module.exports = PanelFooterItemView;
