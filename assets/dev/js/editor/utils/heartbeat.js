var heartbeat;

heartbeat = {

	init: function() {
		var modal;

		this.getModal = function() {
			if ( ! modal ) {
				modal = this.initModal();
			}

			return modal;
		};

		Backbone.$( document ).on( {
			'heartbeat-send': function( event, data ) {
				data.builder_post_lock = {
					post_ID: builder.config.post_id
				};
			},
			'heartbeat-tick': function( event, response ) {
				if ( response.locked_user ) {
					if ( builder.isEditorChanged() ) {
						builder.saveEditor( { status: 'autosave' } );
					}

					heartbeat.showLockMessage( response.locked_user );
				} else {
					heartbeat.getModal().hide();
				}

				builder.config.nonce = response.builder_nonce;
			}
		} );

		if ( builder.config.locked_user ) {
			heartbeat.showLockMessage( builder.config.locked_user );
		}
	},

	initModal: function() {
		var modal = builder.dialogsManager.createWidget( 'options', {
			headerMessage: builder.translate( 'take_over' )
		} );

		modal.addButton( {
			name: 'go_back',
			text: builder.translate( 'go_back' ),
			callback: function() {
				parent.history.go( -1 );
			}
		} );

		modal.addButton( {
			name: 'take_over',
			text: builder.translate( 'take_over' ),
			callback: function() {
				wp.heartbeat.enqueue( 'builder_force_post_lock', true );
				wp.heartbeat.connectNow();
			}
		} );

		return modal;
	},

	showLockMessage: function( lockedUser ) {
		var modal = heartbeat.getModal();

		modal
			.setMessage( builder.translate( 'dialog_user_taken_over', [ lockedUser ] ) )
		    .show();
	}
};

module.exports = heartbeat;
