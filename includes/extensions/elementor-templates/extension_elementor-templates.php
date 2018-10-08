<?php
namespace Qazana\Extensions;

use Qazana\Utils;
use Qazana\Template_Library\Api;

class Elementor_Templates extends Base {

    const ELEMENTOR_VERSION = '2.0.0';

    /**
	 * Elementor library option key.
	 */
	const LIBRARY_OPTION_KEY = 'elementor_remote_info_library';

	/**
	 * Elementor feed option key.
	 */
	const FEED_OPTION_KEY = 'elementor_remote_info_feed_data';

	/**
	 * API info URL.
	 *
	 * Holds the URL of the info API.
	 *
	 * @access public
	 * @static
	 *
	 * @var string API info URL.
	 */
	public static $api_info_url = 'http://my.elementor.com/api/v1/info/';

	/**
	 * API get template content URL.
	 *
	 * Holds the URL of the template content API.
	 *
	 * @access private
	 * @static
	 *
	 * @var string API get template content URL.
	 */
	private static $api_get_template_content_url = 'http://my.elementor.com/api/v1/templates/%d';

    /**
	 * Unique extension name
	 *
	 * @return string
	 */
    public function get_name() {
        return 'elementor-templates';
    }
        
    /**
     * Extension title
     *
     * @return string
     */
    public function get_title() {
        return __( 'Elementor Templates', 'qazana' );
    }

	public function __construct() {
        add_filter( 'qazana/api/get_templates/url', [ $this, 'add_elementor_template_source' ], 10, 2 );
        add_filter( 'option_' . Api::LIBRARY_OPTION_KEY, [ $this, 'filter_template' ], 10, 2 );
    }

    public function add_elementor_template_source( $url, $template_id ) {
        $response = $this->filter_template( [], Api::LIBRARY_OPTION_KEY );

        $index = array_search( $template_id, array_column($response['templates'], 'id') );
        $template = $response['templates'][$index];

        if ( $template['source'] === 'elementor') {
            $url = sprintf( self::$api_get_template_content_url, $template_id );
        }

        return $url;
    }

	public function filter_template( $templates, $option ) {
        $response = self::get_info_data();

        $el_templates = array_values(array_filter($response['templates'], function ($template) {
            if ( $template['is_pro'] ) {
                return;
            }

            return $template;
        }));

        array_walk($el_templates, function (&$value) {
            $value['source'] = 'elementor';
            $value['supports'] = 'all';
        });

        $response['templates'] = $el_templates;

        $response = array_merge( $templates, $response );

        return $response;
    }

    /**
	 * Get info data.
	 *
	 * This function notifies the user of upgrade notices, new templates and contributors.
	 *
	 * @since 2.0.0
	 * @access private
	 * @static
	 *
	 * @param bool $force_update Optional. Whether to force the data retrieval or
	 *                                     not. Default is false.
	 *
	 * @return array|false Info data, or false.
	 */
	private static function get_info_data( $force_update = false ) {
		$cache_key = 'elementor_remote_info_api_data_' . self::ELEMENTOR_VERSION;

		$info_data = get_transient( $cache_key );

		if ( $force_update || false === $info_data ) {
			$timeout = ( $force_update ) ? 25 : 8;

			$response = wp_remote_post( self::$api_info_url, [
				'timeout' => $timeout,
				'body' => [
					// Which API version is used.
					'api_version' => self::ELEMENTOR_VERSION,
					// Which language to return.
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

			if ( isset( $info_data['library'] ) ) {
				$info_data['library']['categories'] = json_decode( $info_data['library']['categories'] );

				update_option( self::LIBRARY_OPTION_KEY, $info_data['library'], 'no' );
			}

			set_transient( $cache_key, $info_data, 12 * HOUR_IN_SECONDS );
		}

		return $info_data['library'];
	}
    
}