<?php
namespace Qazana\WP_CLI;

use WP_CLI;
use WP_CLI_Command;

use Qazana\Template_Library\Template_Api as Api;
use Qazana\Template_Library\Source_Local;
use Qazana\Utils;

/**
* WP ClI Commands for Qazana
*/
class Commands extends WP_CLI_Command {

	/**
	 * Regenerate the Qazana Page Builder CSS.
	 *
	 * [--network]
	 *      Regenerate CSS of for all the sites in the network.
	 * 
	 * ## EXAMPLES
	 *
	 *  1. wp qazana css-regenerate
	 *      - This will regenerate the CSS files for qazana page builder.
	 * 
	 *  2. wp qazana css-regenerate --network
	 *  	- This will regenerate the CSS files for qazana page builder on all the sites in network.
	 * 
	 * @alias css-regenerate
	 *
	*/
	public function css_regenerate( $args, $assoc_args ) {

		$network = false;

		if ( isset( $assoc_args['network'] ) && $assoc_args['network'] == true && is_multisite() ) {
			$network = true;
		}

		if ( true == $network ) {

			if ( function_exists( 'get_sites' ) ) {
				$blogs = get_sites();
			} else {
				$blogs = wp_get_sites();
			}

			foreach ( $blogs as $keys => $blog ) {

				// Cast $blog as an array instead of WP_Site object
				if ( is_object( $blog ) ) {
					$blog = (array) $blog;
				}

				$blog_id = $blog['blog_id'];

				switch_to_blog( $blog_id );

				qazana()->files_manager->clear_cache();

				WP_CLI::success( 'Regenerated the Qazana CSS for site - ' . get_option( 'home' ) );

				restore_current_blog();
			}
			
		} else {

			qazana()->files_manager->clear_cache();
			WP_CLI::success( 'Regenerated the Qazana CSS' );
		}
    }
    
    /**
	 * Replace old URLs with new URLs in all Qazana pages.
	 *
	 * ## EXAMPLES
	 *
	 *  1. wp qazana search-replace <old> <new>
	 *      - This will replace all <old> URLs with the <new> URL.
	 *
	 * @alias replace-urls
	 */

	public function replace_urls( $args, $assoc_args ) {
		if ( empty( $args[0] ) ) {
			\WP_CLI::error( 'Please set the `old` URL' );
		}

		if ( empty( $args[1] ) ) {
			\WP_CLI::error( 'Please set the `new` URL' );
		}

		try {
			$results = Utils::replace_urls( $args[0], $args[1] );
			\WP_CLI::success( $results );
		} catch ( \Exception $e ) {
			\WP_CLI::error( $e->getMessage() );
		}
	}

	/**
	 * Sync Qazana Library.
	 *
	 * ## EXAMPLES
	 *
	 *  1. wp qazana sync-library
	 *      - This will sync the library with Qazana cloud library.
	 *
	 * @alias sync-library
	 */
	public function sync_library( $args, $assoc_args ) {
		$data = Api::_get_info_data( true );

		if ( empty( $data ) ) {
			\WP_CLI::error( 'Cannot sync library.' );
		}

		\WP_CLI::success( 'Library has been synced.' );
	}

	/**
	 * Import template files to the Library.
	 *
	 * ## EXAMPLES
	 *
	 *  1. wp qazana import-library <file-path>
	 *      - This will import a file or a zip of multiple files to the library.
	 *
	 * @alias import-library
	 */
	public function import_library( $args, $assoc_args ) {
		if ( empty( $args[0] ) ) {
			\WP_CLI::error( 'Please set file path.' );
		}

		if ( ! is_readable( $args[0] ) ) {
			\WP_CLI::error( 'Cannot read file.' );
		}
		/** @var Source_Local $source */
		$source = qazana()->get_templates_manager()->get_source( 'local' );

		$imported_items = $source->import_template( basename( $args[0] ), $args[0] );

		if ( empty( $imported_items ) ) {
			\WP_CLI::error( 'Cannot import.' );
		}

		\WP_CLI::success( count( $imported_items ) . ' item(s) has been imported.' );
	}
}

WP_CLI::add_command( 'qazana', '\Qazana\WP_CLI\Commands' );