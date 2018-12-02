<?php
namespace Qazana\DocumentConditions\Conditions;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class General extends Base {

	public static function get_type() {
		return 'general';
	}

	public function get_name() {
		return 'general';
	}

	public function get_title() {
		return __( 'General', 'qazana' );
	}

	public function get_group_title() {
		return __( 'Entire Site', 'qazana' );
    }

	public function get_sub_conditions() {
		$conditions_templates_types = [
			'archive' => 'archive',
			'singular' => 'single',
		];

		$sub_conditions = [];

		foreach ( $conditions_templates_types as $condition_id => $template_type ) {
			$sub_conditions[] = $condition_id;
		}

		return $sub_conditions;
	}

	public function check( $args ) {
		return true;
	}
}
