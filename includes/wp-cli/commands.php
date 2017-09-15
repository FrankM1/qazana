<?php
namespace Qazana\WP_CLI;

use WP_CLI;
use WP_CLI_Command;

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

				qazana()->posts_css_manager->clear_cache();

				WP_CLI::success( 'Regenerated the Qazana CSS for site - ' . get_option( 'home' ) );

				restore_current_blog();
			}
			
		} else {

			qazana()->posts_css_manager->clear_cache();
			WP_CLI::success( 'Regenerated the Qazana CSS' );
		}
	}
}

WP_CLI::add_command( 'qazana', '\Qazana\WP_CLI\Commands' );