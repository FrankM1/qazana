<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Qazana utils.
 *
 * Qazana utils handler class is responsible for different utility methods
 * used by Qazana.
 *
 * @since 1.0.0
 */
class Utils {

	/**
	 * Is ajax.
	 *
	 * Whether the current request is a WordPress ajax request.
	 *
	 * @since 1.0.0
	 * @access public
	 * @static
	 *
	 * @return bool True if it's a WordPress ajax request, false otherwise.
	 */
	public static function is_ajax() {
		// TODO: When minimum required version of WordPress will be 4.7, use `wp_doing_ajax()` instead.
		return defined( 'DOING_AJAX' ) && DOING_AJAX;
	}

	/**
	 * Is script debug.
	 *
	 * Whether script debug is enabled or not.
	 *
	 * @since 1.0.0
	 * @access public
	 * @static
	 *
	 * @return bool True if it's a script debug is active, false otherwise.
	 */
	public static function is_script_debug() {
		return defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG;
	}

	/**
	 * Get edit link.
	 *
	 * Retrieve Qazana edit link.
	 *
	 * @since 1.0.0
	 * @deprecated 2.0.0 Use `qazana()->documents->get( $post_id )->get_edit_url()` method instead.
	 *
	 * @access public
	 * @static
	 *
	 * @param int $post_id Optional. Post ID. Default is `0`.
	 *
	 * @return string Post edit link.
	 */
	public static function get_edit_link( $post_id = 0 ) {
		//TODO _deprecated_function( __METHOD__, '2.0.0', 'qazana()->documents->get( $post_id )->get_edit_url()' );

		if ( ! $post_id ) {
			$post_id = get_the_ID();
		}

		$edit_link = '';
		$document = qazana()->documents->get( $post_id );

		if ( $document ) {
			$edit_link = $document->get_edit_url();
		}

		/**
		 * Get edit link.
		 *
		 * Filters the Qazana edit link.
		 *
		 * @since 1.0.0
		 * @deprecated 2.0.0 Use `qazana/document/urls/edit` filter instead.
		 *
		 * @param string $edit_link New URL query string (unescaped).
		 * @param int    $post_id   Post ID.
		 */
		$edit_link = apply_filters( 'qazana/utils/get_edit_link', $edit_link, $post_id );

		return $edit_link;
	}

	/**
	 * Get preview URL.
	 *
	 * Retrieve the post preview URL.
	 *
	 * @since 1.6.4
	 * @deprecated 2.0.0 Use `qazana()->documents->get( $post_id )->get_preview_url()` method instead.
	 *
	 * @access public
	 * @static
	 *
	 * @param int $post_id Optional. Post ID. Default is `0`.
	 *
	 * @return string Post preview URL.
	 */
	public static function get_preview_url( $post_id ) {
		//TODO _deprecated_function( __METHOD__, '2.0.0', 'qazana()->documents->get( $post_id )->get_preview_url()' );

		$url = qazana()->documents->get( $post_id )->get_preview_url();

		/**
		 * Preview URL.
		 *
		 * Filters the Qazana preview URL.
		 *
		 * @since 1.6.4
		 * @deprecated 2.0.0 Use `qazana/document/urls/preview` filter instead.
		 *
		 * @param string $preview_url URL with chosen scheme.
		 * @param int    $post_id     Post ID.
		 */
		$url = apply_filters( 'qazana/utils/preview_url', $url, $post_id );

		return $url;
	}

	/**
	 * Get WordPress preview url.
	 *
	 * Retrieve WordPress preview URL for any given post ID.
	 *
	 * @since 1.9.0
	 * @deprecated 2.0.0 Use `qazana()->documents->get( $post_id )->get_wp_preview_url()` method instead.
	 *
	 * @access public
	 * @static
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return string WordPress preview URL.
	 */
	public static function get_wp_preview_url( $post_id ) {
	    //TODO _deprecated_function( __METHOD__, '2.0.0', 'qazana()->documents->get( $post_id )->get_wp_preview_url()' );

		$wp_preview_url = qazana()->documents->get( $post_id )->get_wp_preview_url();

		/**
		 * WordPress preview URL.
		 *
		 * Filters the WordPress preview URL.
		 *
		 * @since 1.9.0
		 * @deprecated 2.0.0 Use `qazana/document/urls/wp_preview` filter instead.
		 *
		 * @param string $wp_preview_url WordPress preview URL.
		 * @param int    $post_id        Post ID.
		 */
		$wp_preview_url = apply_filters( 'qazana/utils/wp_preview_url', $wp_preview_url, $post_id );

		return $wp_preview_url;
	}

	/**
	 * Replace URLs.
	 *
	 * Replace old URLs to new URLs. This method also updates all the Qazana data.
	 *
	 * @since  2.1.0
	 * @access public
	 *
	 * @param $from
	 * @param $to
	 *
	 * @return string
	 * @throws \Exception
	 */
	public static function replace_urls( $from, $to ) {
		$from = trim( $from );
		$to = trim( $to );

		if ( $from === $to ) {
			throw new \Exception( __( 'The `from` and `to` URL\'s must be different', 'qazana' ) );
		}

		$is_valid_urls = ( filter_var( $from, FILTER_VALIDATE_URL ) && filter_var( $to, FILTER_VALIDATE_URL ) );
		if ( ! $is_valid_urls ) {
			throw new \Exception( __( 'The `from` and `to` URL\'s must be valid URL\'s', 'qazana' ) );
		}

		global $wpdb;

		// @codingStandardsIgnoreStart cannot use `$wpdb->prepare` because it remove's the backslashes
		$rows_affected = $wpdb->query(
			"UPDATE {$wpdb->postmeta} " .
			"SET `meta_value` = REPLACE(`meta_value`, '" . str_replace( '/', '\\\/', $from ) . "', '" . str_replace( '/', '\\\/', $to ) . "') " .
			"WHERE `meta_key` = '_qazana_data' AND `meta_value` LIKE '[%' ;" ); // meta_value LIKE '[%' are json formatted
		// @codingStandardsIgnoreEnd

		if ( false === $rows_affected ) {
			throw new \Exception( __( 'An error occurred', 'qazana' ) );
		}

		qazana()->files_manager->clear_cache();

		return sprintf(
			/* translators: %d: Number of rows */
			_n( '%d row affected.', '%d rows affected.', $rows_affected, 'qazana' ),
			$rows_affected
		);
	}

	/**
	 * Get exit to dashboard URL.
	 *
	 * Retrieve WordPress preview URL for any given post ID.
	 *
	 * @since 1.9.0
	 * @deprecated 2.0.0 Use `qazana()->documents->get( $post_id )->get_exit_to_dashboard_url()` method instead.
	 *
	 * @access public
	 * @static
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return string Exit to dashboard URL.
	 */
	public static function get_exit_to_dashboard_url( $post_id ) {
		//TODO _deprecated_function( __METHOD__, '2.0.0', 'qazana()->documents->get( $post_id )->get_exit_to_dashboard_url()' );

		return qazana()->documents->get( $post_id )->get_exit_to_dashboard_url();
	}

	/**
	 * Is post supports Qazana.
	 *
	 * Whether the post supports editing with Qazana.
	 *
	 * @since 1.0.0
	 * @access public
	 * @static
	 *
	 * @param int $post_id Optional. Post ID. Default is `0`.
	 *
	 * @return string True if post supports editing with Qazana, false otherwise.
	 */
	public static function is_post_support( $post_id = 0 ) {
		$post_type = get_post_type( $post_id );

		$is_supported = self::is_post_type_support( $post_type );

		/**
		 * Is post type support.
		 *
		 * Filters whether the post type supports editing with Qazana.
		 *
		 * @since 1.0.0
		 * @deprecated 2.2.0 Use `qazana/utils/is_post_support` Instead
		 *
		 * @param bool $is_supported Whether the post type supports editing with Qazana.
		 * @param int $post_id Post ID.
		 * @param string $post_type Post type.
		 */
		$is_supported = apply_filters( 'qazana/utils/is_post_type_support', $is_supported, $post_id, $post_type );

		/**
		 * Is post support.
		 *
		 * Filters whether the post supports editing with Qazana.
		 *
		 * @since 2.0.0
		 *
		 * @param bool $is_supported Whether the post type supports editing with Qazana.
		 * @param int $post_id Post ID.
		 * @param string $post_type Post type.
		 */
		$is_supported = apply_filters( 'qazana/utils/is_post_support', $is_supported, $post_id, $post_type );

		return $is_supported;
	}


	/**
	 * Is post type supports Qazana.
	 *
	 * Whether the post type supports editing with Qazana.
	 *
	 * @since 2.2.0
	 * @access public
	 * @static
	 *
	 * @param string $post_type Post Type.
	 *
	 * @return string True if post type supports editing with Qazana, false otherwise.
	 */
	public static function is_post_type_support( $post_type ) {
		if ( ! post_type_exists( $post_type ) ) {
			return false;
		}

		if ( ! post_type_supports( $post_type, 'qazana' ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Get placeholder image source.
	 *
	 * Retrieve the source of the placeholder image.
	 *
	 * @since 1.0.0
	 * @access public
	 * @static
	 *
	 * @return string The source of the default placeholder image used by Qazana.
	 */
	public static function get_placeholder_image_src() {

		/**
		 * Get placeholder image source.
		 *
		 * Filters the source of the default placeholder image used by Qazana.
		 *
		 * @since 1.0.0
		 *
		 * @param string $placeholder_image The source of the default placeholder image.
		 */
		return apply_filters( 'qazana/utils/get_placeholder_image_src', qazana()->core_assets_url . 'images/placeholder.png' );
	}

	/**
	 * Generate random string.
	 *
	 * Returns a string containing a hexadecimal representation of random number.
	 *
	 * @since 1.0.0
	 * @access public
	 * @static
	 *
	 * @return string Random string.
	 */
	public static function generate_random_string() {
		return dechex( rand() );
	}

	/**
	 * Do not cache.
	 *
	 * Tell WordPress cache plugins not to cache this request.
	 *
	 * @since 1.0.0
	 * @access public
	 * @static
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
	 * Get timezone string.
	 *
	 * Retrieve timezone string from the WordPress database.
	 *
	 * @since 1.0.0
	 * @access public
	 * @static
	 *
	 * @return string Timezone string.
	 */
	public static function get_timezone_string() {
		$current_offset = (float) get_option( 'gmt_offset' );
		$timezone_string = get_option( 'timezone_string' );

		// Create a UTC+- zone if no timezone string exists.
		if ( empty( $timezone_string ) ) {
			if ( $current_offset < 0 ) {
				$timezone_string = 'UTC' . $current_offset;
			} else {
				$timezone_string = 'UTC+' . $current_offset;
			}
		}

		return $timezone_string;
	}

	/**
	 * Do action deprecated.
	 *
	 * Fires functions attached to a deprecated action hook.
	 *
	 * @since 1.0.10
	 * @access public
	 * @static
	 * @deprecated 2.1.0 Use `do_action_deprecated()` instead
	 *
	 * @param string $tag         The name of the action hook.
	 * @param array  $args        Array of additional function arguments to be passed to `do_action()`.
	 * @param string $version     The version of WordPress that deprecated the hook.
	 * @param bool   $replacement Optional. The hook that should have been used.
	 * @param string $message     Optional. A message regarding the change.
	 */
	public static function do_action_deprecated( $tag, $args, $version, $replacement = false, $message = null ) {
		//TODO _deprecated_function( __METHOD__, '2.0.0', 'do_action_deprecated()' );

		do_action_deprecated( $tag, $args, $version, $replacement, $message );
	}

	/**
	 * Do filter deprecated.
	 *
	 * Fires functions attached to a deprecated filter hook.
	 *
	 * @since 1.0.10
	 * @access public
	 * @static
	 * @deprecated 2.1.0 Use `apply_filters_deprecated()` instead
	 *
	 * @param string $tag         The name of the filter hook.
	 * @param array  $args        Array of additional function arguments to be passed to `apply_filters()`.
	 * @param string $version     The version of WordPress that deprecated the hook.
	 * @param bool   $replacement Optional. The hook that should have been used.
	 * @param string $message     Optional. A message regarding the change.
	 *
	 * @return mixed The filtered value after all hooked functions are applied to it.
	 */
	public static function apply_filters_deprecated( $tag, $args, $version, $replacement = false, $message = null ) {
		//TODO _deprecated_function( __METHOD__, '2.0.0', 'apply_filters_deprecated()' );

		return apply_filters_deprecated( $tag, $args, $version, $replacement, $message );
	}

	/**
	 * Get last edited string.
	 *
	 * Retrieve a string saying when the post was saved or the last time it was edited.
	 *
	 * @since 1.9.0
	 * @deprecated 2.0.0 Use `qazana()->documents->get()` method instead.
	 *
	 * @access public
	 * @static
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return string Last edited string.
	 */
	public static function get_last_edited( $post_id ) {
		//TODO _deprecated_function( __METHOD__, '2.0.0', 'qazana()->documents->get()' );

		$document = qazana()->documents->get( $post_id );

		return $document->get_last_edited();
	}

	/**
	 * Get create new post URL.
	 *
	 * Retrieve a custom URL for creating a new post/page using Qazana.
	 *
	 * @since 1.9.0
	 * @access public
	 * @static
	 *
	 * @param string $post_type Optional. Post type slug. Default is 'page'.
	 *
	 * @return string A URL for creating new post using Qazana.
	 */
	public static function get_create_new_post_url( $post_type = 'page' ) {
		$new_post_url = add_query_arg( [
			'action' => 'qazana_new_post',
			'post_type' => $post_type,
		], admin_url( 'edit.php' ) );

		$new_post_url = wp_nonce_url( $new_post_url, 'qazana_action_new_post' );

		return $new_post_url;
	}

	/**
	 * Get post autosave.
	 *
	 * Retrieve an autosave for any given post.
	 *
	 * @since 1.9.2
	 * @access public
	 * @static
	 *
	 * @param int $post_id Post ID.
	 * @param int $user_id Optional. User ID. Default is `0`.
	 *
	 * @return \WP_Post|false Post autosave or false.
	 */
	public static function get_post_autosave( $post_id, $user_id = 0 ) {
		global $wpdb;

		$post = get_post( $post_id );

		$where = $wpdb->prepare( 'post_parent = %d AND post_name LIKE %s AND post_modified_gmt > %s', [ $post_id, "{$post_id}-autosave%", $post->post_modified_gmt ] );

		if ( $user_id ) {
			$where .= $wpdb->prepare( ' AND post_author = %d', $user_id );
		}

		$revision = $wpdb->get_row( "SELECT * FROM $wpdb->posts WHERE $where AND post_type = 'revision'" ); // WPCS: unprepared SQL ok.

		if ( $revision ) {
			$revision = new \WP_Post( $revision );
		} else {
			$revision = false;
		}

		return $revision;
	}

	/**
	 * Is CPT supports custom templates.
	 *
	 * Whether the Custom Post Type supports templates.
	 *
	 * @since 2.0.0
	 * @access public
	 * @static
	 *
	 * @return bool True is templates are supported, False otherwise.
	 */
	public static function is_cpt_custom_templates_supported() {
		require_once ABSPATH . '/wp-admin/includes/theme.php';

		return method_exists( wp_get_theme(), 'get_post_templates' );
	}

	public static function array_inject( $array, $key, $insert ) {
		$length = array_search( $key, array_keys( $array ), true ) + 1;

		return array_slice( $array, 0, $length, true ) +
				$insert +
				array_slice( $array, $length, null, true );
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
	 * Used to overcome core bug when taxonomy is in more then one post type
	 *
	 * @see https://core.trac.wordpress.org/ticket/27918
	 *
	 * @global array $wp_taxonomies The registered taxonomies.
	 *
	 *
	 * @param array $args
	 * @param string $output
	 * @param string $operator
	 *
	 * @return array
	 */
	public static function get_taxonomies( $args = [], $output = 'names', $operator = 'and' ) {
		global $wp_taxonomies;

		$field = ( 'names' === $output ) ? 'name' : false;

		// Handle 'object_type' separately.
		if ( isset( $args['object_type'] ) ) {
			$object_type = (array) $args['object_type'];
			unset( $args['object_type'] );
		}

		$taxonomies = wp_filter_object_list( $wp_taxonomies, $args, $operator );

		if ( isset( $object_type ) ) {
			foreach ( $taxonomies as $tax => $tax_data ) {
				if ( ! array_intersect( $object_type, $tax_data->object_type ) ) {
					unset( $taxonomies[ $tax ] );
				}
			}
		}

		if ( $field ) {
			$taxonomies = wp_list_pluck( $taxonomies, $field );
		}

		return $taxonomies;
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

	public static function get_the_archive_url() {
		$url = '';
		if ( is_category() || is_tag() || is_tax() ) {
			$url = get_term_link( get_queried_object() );
		} elseif ( is_author() ) {
			$url = get_author_posts_url( get_queried_object_id() );
		} elseif ( is_year() ) {
			$url = get_year_link( get_query_var( 'year' ) );
		} elseif ( is_month() ) {
			$url = get_month_link( get_query_var( 'year' ), get_query_var( 'monthnum' ) );
		} elseif ( is_day() ) {
			$url = get_day_link( get_query_var( 'year' ), get_query_var( 'monthnum' ), get_query_var( 'day' ) );
		} elseif ( is_post_type_archive() ) {
			$url = get_post_type_archive_link( get_post_type() );
		}

		return $url;
	}

	public static function get_page_title( $include_context = true ) {
		$title = '';

		if ( is_singular() ) {
			/* translators: %s: Search term. */
			$title = get_the_title();

			if ( $include_context ) {
				$post_type_obj = get_post_type_object( get_post_type() );
				$title = sprintf( '%s: %s', $post_type_obj->labels->singular_name, $title );
			}

		} elseif ( is_home() ) {

			$title = get_the_title( get_option( 'page_for_posts' ) );

		} elseif ( is_search() ) {
			/* translators: %s: Search term. */
			$title = sprintf( __( 'Search Results for: %s', 'qazana' ), get_search_query() );

			if ( get_query_var( 'paged' ) ) {
				/* translators: %s is the page number. */
				$title .= sprintf( __( '&nbsp;&ndash; Page %s', 'qazana' ), get_query_var( 'paged' ) );
			}
		} elseif ( is_category() ) {
			$title = single_cat_title( '', false );

			if ( $include_context ) {
				/* translators: Category archive title. 1: Category name */
				$title = sprintf( __( 'Category: %s', 'qazana' ), $title );
			}
		} elseif ( is_tag() ) {
			$title = single_tag_title( '', false );
			if ( $include_context ) {
				/* translators: Tag archive title. 1: Tag name */
				$title = sprintf( __( 'Tag: %s', 'qazana' ), $title );
			}
		} elseif ( is_author() ) {
			$title = '<span class="vcard">' . get_the_author() . '</span>';

			if ( $include_context ) {
				/* translators: Author archive title. 1: Author name */
				$title = sprintf( __( 'Author: %s', 'qazana' ), $title );
			}
		} elseif ( is_year() ) {
			$title = get_the_date( _x( 'Y', 'yearly archives date format', 'qazana' ) );

			if ( $include_context ) {
				/* translators: Yearly archive title. 1: Year */
				$title = sprintf( __( 'Year: %s', 'qazana' ), $title );
			}
		} elseif ( is_month() ) {
			$title = get_the_date( _x( 'F Y', 'monthly archives date format', 'qazana' ) );

			if ( $include_context ) {
				/* translators: Monthly archive title. 1: Month name and year */
				$title = sprintf( __( 'Month: %s', 'qazana' ), $title );
			}
		} elseif ( is_day() ) {
			$title = get_the_date( _x( 'F j, Y', 'daily archives date format', 'qazana' ) );

			if ( $include_context ) {
				/* translators: Daily archive title. 1: Date */
				$title = sprintf( __( 'Day: %s', 'qazana' ), $title );
			}
		} elseif ( is_tax( 'post_format' ) ) {
			if ( is_tax( 'post_format', 'post-format-aside' ) ) {
				$title = _x( 'Asides', 'post format archive title', 'qazana' );
			} elseif ( is_tax( 'post_format', 'post-format-gallery' ) ) {
				$title = _x( 'Galleries', 'post format archive title', 'qazana' );
			} elseif ( is_tax( 'post_format', 'post-format-image' ) ) {
				$title = _x( 'Images', 'post format archive title', 'qazana' );
			} elseif ( is_tax( 'post_format', 'post-format-video' ) ) {
				$title = _x( 'Videos', 'post format archive title', 'qazana' );
			} elseif ( is_tax( 'post_format', 'post-format-quote' ) ) {
				$title = _x( 'Quotes', 'post format archive title', 'qazana' );
			} elseif ( is_tax( 'post_format', 'post-format-link' ) ) {
				$title = _x( 'Links', 'post format archive title', 'qazana' );
			} elseif ( is_tax( 'post_format', 'post-format-status' ) ) {
				$title = _x( 'Statuses', 'post format archive title', 'qazana' );
			} elseif ( is_tax( 'post_format', 'post-format-audio' ) ) {
				$title = _x( 'Audio', 'post format archive title', 'qazana' );
			} elseif ( is_tax( 'post_format', 'post-format-chat' ) ) {
				$title = _x( 'Chats', 'post format archive title', 'qazana' );
			}
		} elseif ( is_post_type_archive() ) {
			$title = post_type_archive_title( '', false );

			if ( $include_context ) {
				/* translators: Post type archive title. 1: Post type name */
				$title = sprintf( __( 'Archives: %s', 'qazana' ), $title );
			}
		} elseif ( is_tax() ) {
			$title = single_term_title( '', false );

			if ( $include_context ) {
				$tax = get_taxonomy( get_queried_object()->taxonomy );
				/* translators: Taxonomy term archive title. 1: Taxonomy singular name, 2: Current taxonomy term */
				$title = sprintf( __( '%1$s: %2$s', 'qazana' ), $tax->labels->singular_name, $title );
			}
		} // End if().

		/**
		 * The archive title.
		 *
		 * Filters the archive title.
		 *
		 * @since 1.0.0
		 *
		 * @param string $title Archive title to be displayed.
		 */
		$title = apply_filters( 'qazana/utils/get_the_archive_title', $title );

		return $title;
	}

	/**
	 * @deprecated 2.0
	 */
	public static function get_the_archive_title( $include_context = true ) {
		return self::get_page_title();
	}
}
