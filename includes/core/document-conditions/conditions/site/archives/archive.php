<?php
namespace Qazana\DocumentConditions\Conditions;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

use Qazana\Utils;

class Archive extends Base {

	public static function get_type() {
		return 'archive';
	}

	public function get_name() {
		return 'archive';
	}

	public function get_title() {
		return __( 'Archives', 'qazana' );
	}

	public function get_group_title() {
		return __( 'All Archives', 'qazana' );
	}

	public function get_sub_conditions() {
		$sub_conditions = [
			'author',
			'date',
			'search',
		];

		$post_types = Utils::get_post_types();
		unset( $post_types['product'] );

		foreach ( $post_types as $post_type => $label ) {
			if ( ! get_post_type_archive_link( $post_type ) ) {
				continue;
			}
		
            $condition = new Post_Type_Archive( [
                'post_type' => $post_type,
            ] );

            $this->register_condition_instance( $condition );

		 	$sub_conditions[] = $condition->get_name();
		 }

		return $sub_conditions;
	}

	public function check( $args ) {
		return is_archive() || is_home() || is_search();
	}
}
