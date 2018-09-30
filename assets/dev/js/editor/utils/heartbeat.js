class Heartbeat {
	constructor() {
		let modal;

		this.getModal = () => {
			if ( ! modal ) {
				modal = this.initModal();
			}

			return modal;
		};

		jQuery( document ).on( {
			'heartbeat-send': ( event, data ) => {
				data.qazana_post_lock = {
					post_ID: qazana.config.document.id,
				};
			},
			'heartbeat-tick': ( event, response ) => {
				if ( response.locked_user ) {
					if ( qazana.saver.isEditorChanged() ) {
						qazana.saver.saveEditor( {
							status: 'autosave',
						} );
					}

					this.showLockMessage( response.locked_user );
				} else {
					this.getModal().hide();
				}

				qazana.config.nonce = response.qazanaNonce;
			},
			'heartbeat-tick.wp-refresh-nonces': ( event, response ) => {
				const nonces = response[ 'qazana-refresh-nonces' ];

				if ( nonces ) {
					if ( nonces.heartbeatNonce ) {
						qazana.config.nonce = nonces.qazanaNonce;
					}

					if ( nonces.heartbeatNonce ) {
						window.heartbeatSettings.nonce = nonces.heartbeatNonce;
					}
				}
			},
		} );

		if ( qazana.config.locked_user ) {
			this.showLockMessage( qazana.config.locked_user );
		}
	}

	initModal() {
		const modal = qazana.dialogsManager.createWidget( 'lightbox', {
			headerMessage: qazana.translate( 'take_over' ),
		} );

		modal.addButton( {
			name: 'go_back',
			text: qazana.translate( 'go_back' ),
			callback() {
				parent.history.go( -1 );
			},
		} );

		modal.addButton( {
			name: 'take_over',
			text: qazana.translate( 'take_over' ),
			callback() {
				wp.heartbeat.enqueue( 'qazana_force_post_lock', true );
				wp.heartbeat.connectNow();
			},
		} );

		return modal;
	}

	showLockMessage( lockedUser ) {
		const modal = this.getModal();

		modal
			.setMessage( qazana.translate( 'dialog_user_taken_over', [ lockedUser ] ) )
			.show();
	}
}

export default Heartbeat;
