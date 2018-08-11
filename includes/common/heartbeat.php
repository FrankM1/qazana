<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Qazana heartbeat.
 *
 * Qazana heartbeat handler class is responsible for initializing Qazana
 * heartbeat. The class communicates with WordPress Heartbeat API while working
 * with Qazana.
 *
 * @since 1.0.0
 */
class Heartbeat {

	/**
	 * Heartbeat received.
	 *
	 * Locks the Heartbeat response received when editing with Qazana.
	 *
	 * Fired by `heartbeat_received` filter.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param array $response The Heartbeat response.
	 * @param array $data     The `$_POST` data sent.
	 *
	 * @return array Heartbeat response received.
	 */
	public function heartbeat_received( $response, $data ) {
		if ( isset( $data['qazana_post_lock']['post_ID'] ) ) {
			$post_id = $data['qazana_post_lock']['post_ID'];
			$locked_user = qazana()->editor->get_locked_user( $post_id );

			if ( ! $locked_user || ! empty( $data['qazana_force_post_lock'] ) ) {
				qazana()->editor->lock_post( $post_id );
			} else {
				$response['locked_user'] = $locked_user->display_name;
			}

			$response['qazanaNonce'] = qazana()->editor->create_nonce( get_post_type( $post_id ) );
		}
		return $response;
	}

	/**
	 * Refresh nonces.
	 *
	 * Filter the nonces to send to the editor when editing with Qazana. Used
	 * to refresh the nonce when the nonce expires while editing. This way the
	 * user doesn't need to log-in again as Qazana fetches the new nonce from
	 * the server using ajax.
	 *
	 * Fired by `wp_refresh_nonces` filter.
	 *
	 * @since 1.8.0
	 * @access public
	 *
	 * @param array $response The no-priv Heartbeat response object or array.
	 * @param array $data     The `$_POST` data sent.
	 *
	 * @return array Refreshed nonces.
	 */
	public function refresh_nonces( $response, $data ) {
		if ( isset( $data['qazana_post_lock']['post_ID'] ) ) {
			$post_type = get_post_type( $data['qazana_post_lock']['post_ID'] );
			$response['qazana-refresh-nonces'] = [
				'qazanaNonce' => qazana()->editor->create_nonce( $post_type ),
				'heartbeatNonce' => wp_create_nonce( 'heartbeat-nonce' ),
			];
		}

		return $response;
	}

	/**
	 * Heartbeat constructor.
	 *
	 * Initializing Qazana heartbeat.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function __construct() {
		add_filter( 'heartbeat_received', [ $this, 'heartbeat_received' ], 10, 2 );
		add_filter( 'wp_refresh_nonces', [ $this, 'refresh_nonces' ], 30, 2 );
	}
}
