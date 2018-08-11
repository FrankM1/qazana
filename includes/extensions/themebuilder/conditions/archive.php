<?php
namespace Qazana\Extensions\ThemeBuilder\Conditions;

use Qazana\Extensions\ThemeBuilder\Classes\Utils;
use Qazana\Extensions\ThemeBuilder as Module;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Archive extends Condition_Base {

	public static function get_type() {
		return 'archive';
	}

	public function get_name() {
		return 'archive';
	}

	public function get_label() {
		return __( 'Archives', 'qazana' );
	}

	public function get_all_label() {
		return __( 'All Archives', 'qazana' );
	}

	public function get_sub_conditions() {
		$sub_conditions = [
			'author',
			'date',
			'search',
		];

		$conditions_manager = Module::instance()->get_conditions_manager();

		$post_types = Utils::get_post_types();
		unset( $post_types['product'] );

		foreach ( $post_types as $post_type => $label ) {
			if ( ! get_post_type_archive_link( $post_type ) ) {
				continue;
			}

			$condition = new Post_Type_Archive( [
				'post_type' => $post_type,
			] );
			$conditions_manager->register_condition_instance( $condition );
			$sub_conditions[] = $condition->get_name();
		}

		return $sub_conditions;
	}

	public function check( $args ) {
		return is_archive() || is_home() || is_search();
	}
}
