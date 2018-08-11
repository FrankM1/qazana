<?php
namespace Qazana\Extensions\ThemeBuilder\Conditions;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Date extends Condition_Base {

	public static function get_type() {
		return 'archive';
	}

	public function get_name() {
		return 'date';
	}

	public function get_label() {
		return __( 'Date Archive', 'qazana' );
	}

	public function check( $args ) {
		return is_date();
	}
}
