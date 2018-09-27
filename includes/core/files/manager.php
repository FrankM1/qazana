<?php
namespace Qazana\Core\Files;

use Qazana\Core\Files\CSS\Global_CSS;
use Qazana\Core\Files\CSS\Post;
use Qazana\Core\Responsive\Files\Frontend;
use Qazana\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Qazana files manager.
 *
 * Qazana files manager handler class is responsible for creating files.
 *
 * @since 1.2.0
 */
class Manager {

	/**
	 * Files manager constructor.
	 *
	 * Initializing the Qazana files manager.
	 *
	 * @since 1.2.0
	 * @access public
	 */
	public function __construct() {
		$this->register_actions();
	}

	/**
	 * On post delete.
	 *
	 * Delete post CSS immediately after a post is deleted from the database.
	 *
	 * Fired by `deleted_post` action.
	 *
	 * @since 1.2.0
	 * @access public
	 *
	 * @param string $post_id Post ID.
	 */
	public function on_delete_post( $post_id ) {
		if ( ! Utils::is_post_type_support( $post_id ) ) {
			return;
		}

		$css_file = new Post( $post_id );

		$css_file->delete();
	}

	/**
	 * On export post meta.
	 *
	 * When exporting data using WXR, skip post CSS file meta key. This way the
	 * export won't contain the post CSS file data used by Qazana.
	 *
	 * Fired by `wxr_export_skip_postmeta` filter.
	 *
	 * @since 1.2.0
	 * @access public
	 *
	 * @param bool   $skip     Whether to skip the current post meta.
	 * @param string $meta_key Current meta key.
	 *
	 * @return bool Whether to skip the post CSS meta.
	 */
	public function on_export_post_meta( $skip, $meta_key ) {
		if ( Post::META_KEY === $meta_key ) {
			$skip = true;
		}

		return $skip;
	}

	/**
	 * Clear cache.
	 *
	 * Delete all meta containing files data. And delete the actual
	 * files from the upload directory.
	 *
	 * @since 1.2.0
	 * @access public
	 */
	public function clear_cache() {
		// Delete post meta.
		global $wpdb;

		$wpdb->delete(
			$wpdb->postmeta, [
				'meta_key' => Post::META_KEY,
			]
		);

		$wpdb->delete(
			$wpdb->options, [
				'option_name' => Global_CSS::META_KEY,
			]
		);

		delete_option( Frontend::META_KEY );

		// Delete files.
		$path = Base::get_base_uploads_dir() . Base::DEFAULT_FILES_DIR . '*';

		foreach ( glob( $path ) as $file_path ) {
			unlink( $file_path );
		}

		/**
		 * Qazana clear files.
		 *
		 * Fires after Qazana clears files
		 *
		 * @since 2.0.0
		 * @deprecated 2.0.0 Use `qazana/core/files/clear_cache` instead
		 */
		do_action_deprecated( 'qazana/css-file/clear_cache', [], '2.0.0', 'qazana/core/files/clear_cache' );

		/**
		 * Qazana clear files.
		 *
		 * Fires after Qazana clears files
		 *
		 * @since 2.0.0
		 */
		do_action( 'qazana/core/files/clear_cache' );
	}

	/**
	 * Register actions.
	 *
	 * Register filters and actions for the files manager.
	 *
	 * @since 1.2.0
	 * @access private
	 */
	private function register_actions() {
		add_action( 'deleted_post', [ $this, 'on_delete_post' ] );
		add_filter( 'wxr_export_skip_postmeta', [ $this, 'on_export_post_meta' ], 10, 2 );
	}
}
