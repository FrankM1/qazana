<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Utils {

	/**
	 * @static
	 * @since 1.0.0
	 * @access public
	*/
	public static function is_ajax() {
		return defined( 'DOING_AJAX' ) && DOING_AJAX;
	}

	/**
	 * @static
	 * @since 1.0.0
	 * @access public
	*/
	public static function is_script_debug() {
		return defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG;
	}

	/**
	 * @static
	 * @since 1.0.0
	 * @access public
	*/
	public static function get_edit_link( $post_id = 0 ) {
		$edit_link = add_query_arg( [ 'post' => $post_id, 'action' => 'qazana' ], admin_url( 'post.php' ) );

		return apply_filters( 'qazana/utils/get_edit_link', $edit_link, $post_id );
	}

    /**
     * Get video id
     * Supports youtube and vimeo
     *
     * @param  [type] $url [description]
     * @return [type]      [description]
     */
	public static function get_video_id_from_url( $url ) {

        $video_id = false;
        $video_data = array();
        $video_data['host'] = '';

        // get video id
        if ( strpos( $url, 'youtu' ) ) {
            $video_data['host'] = 'youtube';
        } elseif ( strpos( $url, 'vimeo' ) ) {
            $video_data['host'] = 'vimeo';
        }

        $parts = parse_url( $url );

        if ( isset( $parts['query'] ) ) {

            parse_str( $parts['query'], $args );

            if ( isset( $args['v'] ) ) {
                $video_data['id'] = $args['v'];
                return $video_data;
            } else if ( isset( $args['vi'] ) ) {
                $video_data['id'] = $args['vi'];
                return $video_data;
            }
        }

        if ( isset( $parts['path'] ) ) {
            $path = explode( '/', trim( $parts['path'], '/' ) );
            $video_data['id'] = $path[ count( $path ) -1 ];
            return $video_data;
        }

        return $video_id;

	}

	/**
	 * @static
	 * @since 1.6.4
	 * @access public
	*/
	public static function get_preview_url( $post_id ) {
		$preview_url = set_url_scheme( add_query_arg( 'qazana-preview', '', get_permalink( $post_id ) ) );

		return apply_filters( 'qazana/utils/preview_url', $preview_url, $post_id );
	}

	/**
	 * @static
	 * @since 1.0.0
	 * @access public
	*/
	public static function is_post_type_support( $post_id = 0 ) {
		$post_type = get_post_type( $post_id );
		$is_supported = post_type_supports( $post_type, 'qazana' );

		return apply_filters( 'qazana/utils/is_post_type_support', $is_supported, $post_id, $post_type );
	}

	/**
	 * @static
	 * @since 1.0.0
	 * @access public
	*/
	public static function get_placeholder_image_src() {
		return apply_filters( 'qazana/utils/get_placeholder_image_src', qazana()->core_assets_url . 'images/placeholder.png' );
	}

	/**
	 * @static
	 * @since 1.0.0
	 * @access public
	*/
	public static function generate_random_string() {
		return dechex( rand() );
	}

	/**
	 * Tell to WP Cache plugins do not cache this request.
	 *
	 * @static
	 * @since 1.0.0
	 * @access public
	 * @return void
	 */
	public static function do_not_cache() {
		if ( ! defined( 'DONOTCACHEPAGE' ) ) {
			define( 'DONOTCACHEPAGE', true );
		}

		if ( ! defined( 'DONOTCACHEDB' ) ) {
			define( 'DONOTCACHEDB', true );
		}

		if ( ! defined( 'DONOTMINIFY' ) ) {
			define( 'DONOTMINIFY', true );
		}

		if ( ! defined( 'DONOTCDN' ) ) {
			define( 'DONOTCDN', true );
		}

		if ( ! defined( 'DONOTCACHCEOBJECT' ) ) {
			define( 'DONOTCACHCEOBJECT', true );
		}

		// Set the headers to prevent caching for the different browsers.
		nocache_headers();
	}

	/**
	 * @static
	 * @since 1.0.0
	 * @access public
	*/
	public static function get_timezone_string() {
		$current_offset = (float) get_option( 'gmt_offset' );
		$timezone_string = get_option( 'timezone_string' );

		// Create a UTC+- zone if no timezone string exists.
		if ( empty( $timezone_string ) ) {
			if ( 0 === $current_offset ) {
				$timezone_string = 'UTC+0';
			} elseif ( $current_offset < 0 ) {
				$timezone_string = 'UTC' . $current_offset;
			} else {
				$timezone_string = 'UTC+' . $current_offset;
			}
		}

		return $timezone_string;
	}

	public static function get_client_ip() {
		$server_ip_keys = [
			'HTTP_CLIENT_IP',
			'HTTP_X_FORWARDED_FOR',
			'HTTP_X_FORWARDED',
			'HTTP_X_CLUSTER_CLIENT_IP',
			'HTTP_FORWARDED_FOR',
			'HTTP_FORWARDED',
			'REMOTE_ADDR',
		];

		foreach ( $server_ip_keys as $key ) {
			if ( isset( $_SERVER[ $key ] ) && filter_var( $_SERVER[ $key ], FILTER_VALIDATE_IP ) ) {
				return $_SERVER[ $key ];
			}
		}

		// Fallback local ip.
		return '127.0.0.1';
	}

	public static function get_site_domain() {
		return str_ireplace( 'www.', '', parse_url( home_url(), PHP_URL_HOST ) );
	}

	/**
	 * @static
	 * @since 1.0.10
	 * @access public
	*/
	public static function do_action_deprecated( $tag, $args, $version, $replacement = false, $message = null ) {
		if ( function_exists( 'do_action_deprecated' ) ) { /* WP >= 4.6 */
			do_action_deprecated( $tag, $args, $version, $replacement, $message );
		} else {
			do_action_ref_array( $tag, $args );
		}
	}

	/**
	 * @static
	 * @since 1.0.10
	 * @access public
	*/
	public static function apply_filters_deprecated( $tag, $args, $version, $replacement = false, $message = null ) {
		if ( function_exists( 'apply_filters_deprecated' ) ) { /* WP >= 4.6 */
			return apply_filters_deprecated( $tag, $args, $version, $replacement, $message );
		} else {
			return apply_filters_ref_array( $tag, $args );
		}
	}
}
