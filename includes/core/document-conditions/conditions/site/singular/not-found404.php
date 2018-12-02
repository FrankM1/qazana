<?php
namespace Qazana\DocumentConditions\Conditions;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Not_Found404 extends Base {

	public static function get_type() {
		return 'singular';
	}

	public function get_name() {
		return 'not_found404';
	}

	public function get_title() {
		return __( '404 Page', 'qazana' );
    }

	public function check( $args ) {
		return is_404();
	}
}
