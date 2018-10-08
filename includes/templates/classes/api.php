<?php
namespace Qazana\Template_Library;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * Qazana API.
 *
 * Qazana API handler class is responsible for communicating with Qazana
 * remote servers retrieving templates data and to send uninstall feedback.
 *
 * @since 1.0.0
 */
class Api {

	/**
	 * Qazana library option key.
	 */
	const LIBRARY_OPTION_KEY = 'qazana_remote_info_library';

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
	public static $api_info_url = 'https://api.qazana.net/api/v1/qazana/templates';

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
	private static $api_get_template_content_url = 'https://api.qazana.net/api/v1/templates/%d';

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
	private static function get_info_data( $force_update = true ) {
		$cache_key = 'qazana_remote_info_api_data_' . qazana_get_version();

		$info_data = get_transient( $cache_key );

		if ( $force_update || false === $info_data ) {
			$timeout = ( $force_update ) ? 25 : 8;

			$response = wp_remote_post( self::$api_info_url, [
				'timeout' => $timeout,
				'body' => [
					// Which API version is used.
					'api_version' => qazana_get_version(),
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
				$info_data['library']['categories'] = $info_data['library']['categories'] ? json_decode( $info_data['library']['categories'] ) : [];
				update_option( self::LIBRARY_OPTION_KEY, $info_data['library'], 'no' );
				unset( $info_data['library'] );
			}

			set_transient( $cache_key, $info_data, 12 * HOUR_IN_SECONDS );
		}

		return $info_data;
	}

    /**
	 * Get templates data.
	 *
	 * Retrieve the templates data from a remote server.
	 *
	 * @since 2.0.0
	 * @access public
	 * @static
	 *
	 * @param bool $force_update Optional. Whether to force the data update or
	 *                                     not. Default is false.
	 *
	 * @return array The templates data.
	 */
	public static function get_library_data( $force_update = false ) {
		self::get_info_data( $force_update );

        $library_data = get_option( self::LIBRARY_OPTION_KEY );

		if ( empty( $library_data ) ) {
			return [];
		}

		return $library_data;
	}


	/**
	 * Get template content.
	 *
	 * Retrieve the templates content received from a remote server.
	 *
	 * @since 1.0.0
	 * @access public
	 * @static
	 *
	 * @param int $template_id The template ID.
	 *
	 * @return array The template content.
	 */
	public static function get_template_content( $template_id ) {
        $url = sprintf( self::$api_get_template_content_url, $template_id );
        
        /**
		 * API: Template url.
		 *
		 * Filters the url to use.
		 *
		 * @since 1.0.0
		 *
		 * @param array $url Url strng.
		 */
		$url = apply_filters( 'qazana/api/get_templates/url', $url, $template_id );

		$body_args = [
			// Which API version is used.
			'api_version' => qazana_get_version(),
			// Which language to return.
			'site_lang' => get_bloginfo( 'language' ),
		];

		/**
		 * API: Template body args.
		 *
		 * Filters the body arguments send with the GET request when fetching the content.
		 *
		 * @since 1.0.0
		 *
		 * @param array $body_args Body arguments.
		 */
		$body_args = apply_filters( 'qazana/api/get_templates/body_args', $body_args );

		$response = wp_remote_get( $url, [
			'timeout' => 40,
			'body' => $body_args,
		] );

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$response_code = (int) wp_remote_retrieve_response_code( $response );

		if ( 200 !== $response_code ) {
			return new \WP_Error( 'response_code_error', sprintf( 'The request returned with a status code of %s.', $response_code ) );
		}

		$template_content = json_decode( wp_remote_retrieve_body( $response ), true );

		if ( isset( $template_content['error'] ) ) {
			return new \WP_Error( 'response_error', $template_content['error'] );
		}

		if ( empty( $template_content['data'] ) && empty( $template_content['content'] ) ) {
			return new \WP_Error( 'template_data_error', 'An invalid data was returned.' );
		}

		return $template_content;
	}

}
