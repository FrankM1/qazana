<?php
namespace Qazana\Extensions\ThemeBuilder\Conditions;

use Qazana\Extensions\Queries_Group_Controls as QueryModule;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Child_Of extends Condition_Base {

	public static function get_type() {
		return 'singular';
	}

	public function get_name() {
		return 'child_of';
	}

	public function get_label() {
		return __( 'Child Of', 'qazana' );
	}

	public function check( $args ) {
		$id = (int) $args['id'];
		$parent_id = wp_get_post_parent_id( get_the_ID() );

		return is_singular() && ( ( ! $id && 0 < $parent_id ) || ( $parent_id === $id ) );
	}

	protected function _register_controls() {
		$this->add_control(
			'parent_id',
			[
				'section' => 'settings',
				'type' => QueryModule::QUERY_CONTROL_ID,
				'select2options' => [
					'dropdownCssClass' => 'qazana-conditions-select2-dropdown',
				],
				'filter_type' => 'post',
				'object_type' => 'page',
			]
		);
	}
}
