<?php
namespace Qazana\DocumentConditions\Conditions;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Post_Type_Archive extends Base {

	private $post_type;
	private $post_taxonomies;

	public static function get_type() {
		return 'archive';
	}

	public function __construct( $data ) {
		$this->post_type = get_post_type_object( $data['post_type'] );
		$this->post_taxonomies = wp_filter_object_list(
			get_object_taxonomies( $data['post_type'], 'objects' ),
			[
				'public' => true,
				'show_in_nav_menus' => true,
			]
		);

		parent::__construct( $data );
	}

	public function get_name() {
		return $this->post_type->name . '_archive';
	}

	public function get_title() {
		return sprintf( __( '%s Archive', 'qazana' ), $this->post_type->label );
	}

	public function get_group_title() {
		return sprintf( __( '%s Archive', 'qazana' ), $this->post_type->label );
	}

	public function get_sub_conditions() {
		$sub_conditions = [];

        foreach ( $this->post_taxonomies as $slug => $object ) {
            $condition = new Taxonomy( [
                'object' => $object,
			] );

            $this->register_condition_instance( $condition );
            $sub_conditions[] = $condition->get_name();
		}

		return $sub_conditions;
	}

	public function check( $args ) {
		return is_post_type_archive( $this->post_type->name ) || ( 'post' === $this->post_type->name && is_home() );
	}
}
