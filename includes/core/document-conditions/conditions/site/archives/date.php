<?php
namespace Qazana\DocumentConditions\Conditions;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Date extends Base {

	public static function get_type() {
		return 'archive';
	}

	public function get_name() {
		return 'date';
	}

	public function get_title() {
		return __( 'Date Archive', 'qazana' );
	}

	public function check( $args ) {
		return is_date();
	}
}
