<?php
namespace Builder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Admin_Api {

    /**
     * [$api_info_url description]
     * @var string
     */
    public $api_info_url = 'https://api.radiumthemes.com/api/v1/builder/updates/';

    /**
     * [$api_feedback_url description]
     * @var string
     */
    private $api_feedback_url = 'https://api.radiumthemes.com/api/v1/builder/feedback/';

    public function send_feedback( $feedback_key, $feedback_text ) {

		return wp_remote_post( $this->api_feedback_url, [
			'timeout' => 30,
			'body' => [
				'api_version' => builder_get_version(),
				'site_lang' => get_bloginfo( 'language' ),
				'feedback_key' => $feedback_key,
				'feedback' => $feedback_text,
			],
		] );

	}

    /**
     * This function notifies the user of upgrade notices, new templates and contributors
     *
     * @param bool $force
     *
     * @return array|bool
     */
    private function _get_info_data( $force = false ) {
        $cache_key = 'builder_remote_info_api_data_' . builder()->get_version();
        $info_data = get_transient( $cache_key );

        if ( $force || false === $info_data ) {
            $response = wp_remote_post( $this->api_info_url, [
                'timeout' => 25,
                'body' => [
                    // Which API version is used
                    'api_version' => builder()->get_version(),
                    // Which language to return
                    'site_lang' => get_bloginfo( 'language' ),
                ],
            ] );

            if ( is_wp_error( $response ) || 200 !== (int) wp_remote_retrieve_response_code( $response ) ) {
                set_transient( $cache_key, [], 2 * HOUR_IN_SECONDS );

                return false;
            }

            $info_data = json_decode( wp_remote_retrieve_body( $response ), true );
            if ( empty( $info_data ) || ! is_array( $info_data ) ) {
                set_transient( $cache_key, [], 2 * HOUR_IN_SECONDS );

                return false;
            }

            if ( isset( $info_data['templates'] ) ) {
                update_option( 'builder_remote_info_api_data', $info_data['templates'], 'no' );
                unset( $info_data['templates'] );
            }
            set_transient( $cache_key, $info_data, 12 * HOUR_IN_SECONDS );
        }

        return $info_data;
    }

    public function get_upgrade_notice() {
        $data = $this->_get_info_data();
        if ( empty( $data['upgrade_notice'] ) )
            return false;

        return $data['upgrade_notice'];
    }

    public function ajax_remote_info_api_data() {
        check_ajax_referer( 'builder_reset_library', '_nonce' );

        $this->_get_info_data( true );

        wp_send_json_success();
    }

    public function __construct() {
        add_action( 'wp_ajax_builder_clear_library_cache', [ $this, 'ajax_remote_info_api_data' ] );
    }
}
