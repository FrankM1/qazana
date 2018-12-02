<?php
namespace Qazana\DocumentConditions\Conditions;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Search extends Base {

	public static function get_type() {
		return 'archive';
	}

	public function get_name() {
		return 'search';
	}

	public function get_title() {
		return __( 'Search Results', 'qazana' );
	}

	public function check( $args ) {
		return is_search();
	}
}
