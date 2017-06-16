var PanelFooterItemView;

PanelFooterItemView = Marionette.ItemView.extend( {
	template: '#tmpl-builder-panel-footer-content',

	tagName: 'nav',

	id: 'builder-panel-footer-tools',

	possibleRotateModes: [ 'portrait', 'landscape' ],

	ui: {
		menuButtons: '.builder-panel-footer-tool',
		deviceModeIcon: '#builder-panel-footer-responsive > i',
		deviceModeButtons: '#builder-panel-footer-responsive .builder-panel-footer-sub-menu-item',
		buttonSave: '#builder-panel-footer-save',
		buttonSaveButton: '#builder-panel-footer-save .builder-button',
		buttonPublish: '#builder-panel-footer-publish',
		watchTutorial: '#builder-panel-footer-watch-tutorial',
		showTemplates: '#builder-panel-footer-templates-modal',
		saveTemplate: '#builder-panel-footer-save-template'
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

		this.listenTo( builder.channels.editor, 'change', this.onEditorChanged )
			.listenTo( builder.channels.deviceMode, 'change', this.onDeviceModeChange );
	},

	_initDialog: function() {
		var dialog;

		this.getDialog = function() {
			if ( ! dialog ) {
				var $ = Backbone.$,
					$dialogMessage = $( '<div>', {
						'class': 'builder-dialog-message'
					} ),
					$messageIcon = $( '<i>', {
						'class': 'fa fa-check-circle'
					} ),
					$messageText = $( '<div>', {
						'class': 'builder-dialog-message-text'
					} ).text( builder.translate( 'saved' ) );

				$dialogMessage.append( $messageIcon, $messageText );

				dialog = builder.dialogsManager.createWidget( 'popup', {
					hide: {
						delay: 1500
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
				self.ui.buttonSaveButton.removeClass( 'builder-button-state' );
				NProgress.done();
			}
		};

		self.ui.buttonSaveButton.addClass( 'builder-button-state' );

		NProgress.start();

		builder.saveEditor( options );
	},

	_saveBuilderDraft: function() {
		builder.saveEditor();
	},

	getDeviceModeButton: function( deviceMode ) {
		return this.ui.deviceModeButtons.filter( '[data-device-mode="' + deviceMode + '"]' );
	},

	onPanelClick: function( event ) {
		var $target = Backbone.$( event.target ),
			isClickInsideOfTool = $target.closest( '.builder-panel-footer-sub-menu-wrapper' ).length;

		if ( isClickInsideOfTool ) {
			return;
		}

		var $tool = $target.closest( '.builder-panel-footer-tool' ),
			isClosedTool = $tool.length && ! $tool.hasClass( 'builder-open' );

		this.ui.menuButtons.removeClass( 'builder-open' );

		if ( isClosedTool ) {
			$tool.addClass( 'builder-open' );
		}
	},

	onEditorChanged: function() {
		this.ui.buttonSave.toggleClass( 'builder-save-active', builder.isEditorChanged() );
	},

	onDeviceModeChange: function() {
		var previousDeviceMode = builder.channels.deviceMode.request( 'previousMode' ),
			currentDeviceMode = builder.channels.deviceMode.request( 'currentMode' );

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

		builder.changeDeviceMode( newDeviceMode );
	},

	onClickWatchTutorial: function() {
		builder.introduction.startIntroduction();
	},

	onClickShowTemplates: function() {
		builder.templates.startModal( function() {
			builder.templates.showTemplates();
		} );
	},

	onClickSaveTemplate: function() {
		builder.templates.startModal( function() {
			builder.templates.getLayout().showSaveTemplateView();
		} );
	},

	onRender: function() {
		var self = this;

		_.defer( function() {
			builder.getPanelView().$el.on( 'click', _.bind( self.onPanelClick, self ) );
		} );
	}
} );

module.exports = PanelFooterItemView;
