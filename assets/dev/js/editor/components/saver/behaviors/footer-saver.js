module.exports = Marionette.Behavior.extend( {
	previewWindow: null,

	ui: function() {
		return {
			buttonPreview: '#qazana-panel-saver-button-preview',
			buttonPublish: '#qazana-panel-saver-button-publish',
			buttonSaveOptions: '#qazana-panel-saver-button-save-options',
			buttonPublishLabel: '#qazana-panel-saver-button-publish-label',
			menuSaveDraft: '#qazana-panel-saver-menu-save-draft',
			lastEditedWrapper: '.qazana-last-edited-wrapper',
		};
	},

	events: function() {
		return {
			'click @ui.buttonPreview': 'onClickButtonPreview',
			'click @ui.buttonPublish': 'onClickButtonPublish',
			'click @ui.menuSaveDraft': 'onClickMenuSaveDraft',
		};
	},

	initialize: function() {
		qazana.saver
			.on( 'before:save', this.onBeforeSave.bind( this ) )
			.on( 'after:save', this.onAfterSave.bind( this ) )
			.on( 'after:saveError', this.onAfterSaveError.bind( this ) )
			.on( 'page:status:change', this.onPageStatusChange );

		qazana.settings.page.model.on( 'change', this.onPageSettingsChange.bind( this ) );

		qazana.channels.editor.on( 'status:change', this.activateSaveButtons.bind( this ) );
	},

	activateSaveButtons: function( hasChanges ) {
		hasChanges = hasChanges || 'draft' === qazana.settings.page.model.get( 'post_status' );

		this.ui.buttonPublish.add( this.ui.menuSaveDraft ).toggleClass( 'qazana-saver-disabled', ! hasChanges );
		this.ui.buttonSaveOptions.toggleClass( 'qazana-saver-disabled', ! hasChanges );
	},

	onRender: function() {
		this.setMenuItems( qazana.settings.page.model.get( 'post_status' ) );
		this.addTooltip();
	},

	onPageSettingsChange: function( settings ) {
		var changed = settings.changed;

		if ( ! _.isUndefined( changed.post_status ) ) {
			this.setMenuItems( changed.post_status );

			this.refreshWpPreview();

			// Refresh page-settings post-status value.
			if ( 'page_settings' === qazana.getPanelView().getCurrentPageName() ) {
				qazana.getPanelView().getCurrentPageView().render();
			}
		}
	},

	onPageStatusChange: function( newStatus ) {
		if ( 'publish' === newStatus ) {
			qazana.notifications.showToast( {
				message: qazana.config.document.panel.messages.publish_notification,
				buttons: [
					{
						name: 'view_page',
						text: qazana.translate( 'have_a_look' ),
						callback: function() {
							open( qazana.config.document.urls.permalink );
						},
					},
				],
			} );
		}
	},

	onBeforeSave: function( options ) {
		NProgress.start();
		if ( 'autosave' === options.status ) {
			this.ui.lastEditedWrapper.addClass( 'qazana-state-active' );
		} else {
			this.ui.buttonPublish.addClass( 'qazana-button-state' );
		}
	},

	onAfterSave: function( data ) {
		NProgress.done();
		this.ui.buttonPublish.removeClass( 'qazana-button-state' );
		this.ui.lastEditedWrapper.removeClass( 'qazana-state-active' );
		this.refreshWpPreview();
		this.setLastEdited( data );
	},

	setLastEdited: function( data ) {
		this.ui.lastEditedWrapper
			.removeClass( 'qazana-button-state' )
			.find( '.qazana-last-edited' )
			.html( data.config.last_edited );
	},

	onAfterSaveError: function() {
		NProgress.done();
		this.ui.buttonPublish.removeClass( 'qazana-button-state' );
	},

	onClickButtonPreview: function() {
		// Open immediately in order to avoid popup blockers.
		this.previewWindow = open( qazana.config.document.urls.wp_preview, 'wp-preview-' + qazana.config.document.id );

		if ( qazana.saver.isEditorChanged() ) {
			// Force save even if it's saving now.
			if ( qazana.saver.isSaving ) {
				qazana.saver.isSaving = false;
			}

			qazana.saver.doAutoSave();
		}
	},

	onClickButtonPublish: function() {
		var postStatus = qazana.settings.page.model.get( 'post_status' );

		if ( this.ui.buttonPublish.hasClass( 'qazana-saver-disabled' ) ) {
			return;
		}

		switch ( postStatus ) {
			case 'publish':
			case 'private':
				qazana.saver.update();
				break;
			case 'draft':
				if ( qazana.config.current_user_can_publish ) {
					qazana.saver.publish();
				} else {
					qazana.saver.savePending();
				}
				break;
			case 'pending': // User cannot change post status
			case undefined: // TODO: as a contributor it's undefined instead of 'pending'.
				if ( qazana.config.current_user_can_publish ) {
					qazana.saver.publish();
				} else {
					qazana.saver.update();
				}
				break;
		}
	},

	onClickMenuSaveDraft: function() {
		qazana.saver.saveDraft();
	},

	setMenuItems: function( postStatus ) {
		var publishLabel = 'publish';

		switch ( postStatus ) {
			case 'publish':
			case 'private':
				publishLabel = 'update';

				if ( qazana.config.current_revision_id !== qazana.config.document.id ) {
					this.activateSaveButtons( true );
				}

				break;
			case 'draft':
				if ( ! qazana.config.current_user_can_publish ) {
					publishLabel = 'submit';
				}

				this.activateSaveButtons( true );
				break;
			case 'pending': // User cannot change post status
			case undefined: // TODO: as a contributor it's undefined instead of 'pending'.
				if ( ! qazana.config.current_user_can_publish ) {
					publishLabel = 'update';
				}
				break;
		}

		this.ui.buttonPublishLabel.html( qazana.translate( publishLabel ) );
	},

	addTooltip: function() {
		// Create tooltip on controls
		this.$el.find( '.tooltip-target' ).tipsy( {
			// `n` for down, `s` for up
			gravity: 's',
			title: function() {
				return this.getAttribute( 'data-tooltip' );
			},
		} );
	},

	refreshWpPreview: function() {
		if ( this.previewWindow ) {
			// Refresh URL form updated config.
			try {
				this.previewWindow.location.href = qazana.config.document.urls.wp_preview;
			} catch ( e ) {
				// If the this.previewWindow is closed or it's domain was changed.
				// Do nothing.
			}
		}
	},
} );
