<?php
namespace Qazana\Template_Library;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

use Qazana\Plugin;

class Template_Api {

    /**
     * [$api_template_url description]
     * @var string
     */
    public static $api_template_url = 'https://api.radiumthemes.com/api/v1/builder/templates';

    /**
     * [$api_template_content_url description]
     * @var string
     */
    private static $api_template_content_url = 'https://api.radiumthemes.com/api/v1/builder/templates/%d';

    /**
     * [__construct description]
     */
    public function __construct() {
        add_action( 'wp_ajax_qazana_reset_remote_library', array( $this, 'ajax_reset_api_data' ) );
    }

    /**
     * This function notifies the user of upgrade notices, new templates and contributors
     *
     * @param bool $force
     *
     * @return array|bool
     */
    private static function _get_info_data( $force = false ) {
        $cache_key = 'qazana_remote_template_data_' . qazana()->get_version();
        $info_data = get_transient( $cache_key );

        if ( $force || false === $info_data ) {
            $response = wp_remote_post( self::$api_template_url, [
                'timeout' => 25,
                'body' => [
                    // Which API version is used
                    'api_version' => qazana()->get_version(),
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
                update_option( 'qazana_remote_templates_data', $info_data['templates'], 'no' );
                unset( $info_data['templates'] );
            }
            set_transient( $cache_key, $info_data, 12 * HOUR_IN_SECONDS );
        }

        return $info_data;
    }

    public static function get_templates_data() {
        self::_get_info_data(true);

        $templates = get_option( 'qazana_remote_templates_data' );

        if ( empty( $templates ) )
            return [];

        return $templates;
    }

    public static function get_template_content( $template_id ) {

        $url = sprintf( self::$api_template_content_url, $template_id );

        $response = wp_remote_get( $url, [
            'timeout' => 40,
            'body' => [
                // Which API version is used
                'api_version' => qazana()->get_version(),
                // Which language to return
                'site_lang' => get_bloginfo( 'language' ),
            ],
        ] );


        if ( is_wp_error( $response ) || 200 !== (int) wp_remote_retrieve_response_code( $response ) ) {
            return false;
        }

        $template_content = json_decode( wp_remote_retrieve_body( $response ), true );
        if ( empty( $template_content ) || ! is_array( $template_content ) ) {
            return false;
        }

        return $template_content;
    }

    public function ajax_reset_api_data() {
        check_ajax_referer( 'qazana_reset_library', '_nonce' );

        self::_get_info_data( true );

        wp_send_json_success();
    }

}

new Template_Api;
