<?php
namespace Qazana\DocumentConditions\Conditions;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Front_Page extends Base {

	public static function get_type() {
		return 'singular';
	}

	public function get_name() {
		return 'front_page';
	}

	public function get_title() {
		return __( 'Front Page', 'qazana' );
    }

	public function check( $args ) {
		return is_front_page();
	}
}
