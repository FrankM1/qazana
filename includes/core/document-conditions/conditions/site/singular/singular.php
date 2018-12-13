<?php
namespace Qazana\DocumentConditions\Conditions;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

use Qazana\Utils;

class Singular extends Base {

	public static function get_type() {
		return 'singular';
	}

	public function get_name() {
		return 'singular';
	}

	public function get_title() {
		return __( 'Singular', 'qazana' );
	}

	public function get_group_title() {
		return __( 'Singular', 'qazana' );
    }

	public function get_sub_conditions() {
		$sub_conditions = [
			'front_page',
		];

		$post_types = Utils::get_post_types();
		$post_types['attachment'] = get_post_type_object( 'attachment' )->label;
        unset( $post_types['product'] );

		foreach ( $post_types as $post_type => $label ) {
			$condition = new Post( [
				'post_type' => $post_type,
			] );
		    $this->register_condition_instance( $condition );
			$sub_conditions[] = $condition->get_name();
		}

		$sub_conditions[] = 'not_found404';

		return $sub_conditions;
	}

	public function check( $args ) {
		return is_singular() || is_404();
	}
}
