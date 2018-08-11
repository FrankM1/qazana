<?php

namespace Qazana\Extensions\ThemeBuilder\Classes;

use Qazana\Extensions\ThemeBuilder as Module;
use Qazana\Extensions\ThemeBuilder\ThemeSupport\GeneratePress_Theme_Support;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Theme_Support {

	public function __construct() {
		add_action( 'init', [ $this, 'init' ] );
	}

	public function init() {
		$theme = wp_get_theme();

		switch ( $theme->get_template() ) {
			case 'generatepress':
				new GeneratePress_Theme_Support();
				break;
		}

		add_action( 'qazana/theme/register_locations', [ $this, 'after_register_locations' ], 99 );
	}

	/**
	 * @param Locations_Manager $location_manager
	 */
	public function after_register_locations( $location_manager ) {
		$core_locations = $location_manager->get_core_locations();
		$overwrite_header_location = false;
		$overwrite_footer_location = false;

		foreach ( $core_locations as $location => $settings ) {
			if ( ! $location_manager->get_locations( $location ) ) {
				if ( 'header' === $location ) {
					$overwrite_header_location = true;
				} elseif ( 'footer' === $location ) {
					$overwrite_footer_location = true;
				}
				$location_manager->register_core_location( $location, [
					'overwrite' => true,
				] );
			}
		}

		if ( $overwrite_header_location || $overwrite_footer_location ) {
			$conditions_manager = Module::instance()->get_conditions_manager();
			$headers = $conditions_manager->get_documents_for_location( 'header' );
			$footers = $conditions_manager->get_documents_for_location( 'footer' );

			if ( ! empty( $headers ) || ! empty( $footers ) ) {
				add_action( 'get_header', [ $this, 'get_header' ] );
				add_action( 'get_footer', [ $this, 'get_footer' ] );
			}
		}
	}

	public function get_header( $name ) {
		require __DIR__ . '/../views/theme-support-header.php';

		$templates = array();
		$name = (string) $name;
		if ( '' !== $name ) {
			$templates[] = "header-{$name}.php";
		}

		$templates[] = 'header.php';

		// Avoid running wp_head hooks again
		remove_all_actions( 'wp_head' );
		ob_start();
		// It cause a `require_once` so, in the get_header it self it will not be required again.
		locate_template( $templates, true );
		ob_get_clean();
	}

	public function get_footer( $name ) {
		require __DIR__ . '/../views/theme-support-footer.php';

		$templates = array();
		$name = (string) $name;
		if ( '' !== $name ) {
			$templates[] = "footer-{$name}.php";
		}

		$templates[] = 'footer.php';

		ob_start();
		// It cause a `require_once` so, in the get_header it self it will not be required again.
		locate_template( $templates, true );
		ob_get_clean();
	}
}
