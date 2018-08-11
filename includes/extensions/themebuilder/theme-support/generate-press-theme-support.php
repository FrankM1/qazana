<?php

namespace Qazana\Extensions\ThemeBuilder\ThemeSupport;

use Qazana\Template_Library\Source_Local;
use Qazana\Extensions\ThemeBuilder\Classes\Locations_Manager;
use Qazana\Extensions\ThemeBuilder as Module;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class GeneratePress_Theme_Support {

	/**
	 * @param Locations_Manager $manager
	 */
	public function register_locations( $manager ) {
		$manager->register_core_location( 'header' );
		$manager->register_core_location( 'footer' );
	}

	public function metabox_capability( $capability ) {
		if ( Source_Local::CPT === get_post_type() ) {
			$capability = 'do_not_allow';
		}
		return $capability;
	}

	public function do_header() {
		$did_location = Module::instance()->get_locations_manager()->do_location( 'header' );
		if ( $did_location ) {
			remove_action( 'generate_header','generate_construct_header' );
			remove_action( 'generate_after_header', 'generate_add_navigation_after_header', 5 );
		}
	}

	public function do_footer() {
		$did_location = Module::instance()->get_locations_manager()->do_location( 'footer' );
		if ( $did_location ) {
			remove_action( 'generate_footer','generate_construct_footer' );
			remove_action( 'generate_footer','generate_construct_footer_widgets', 5 );
		}
	}

	public function __construct() {
		add_action( 'qazana/theme/register_locations', [ $this, 'register_locations' ] );
		add_filter( 'generate_metabox_capability', [ $this, 'metabox_capability' ] );

		add_action( 'generate_header', [ $this, 'do_header' ], 0 );
		add_action( 'generate_footer', [ $this, 'do_footer' ], 0 );
	}
}
