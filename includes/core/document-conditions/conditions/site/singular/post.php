<?php
namespace Qazana\DocumentConditions\Conditions;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Post extends Base {

	private $post_type;
	private $post_taxonomies;

	public static function get_type() {
		return 'singular';
	}

	public function __construct( $data ) {
		$this->post_type = get_post_type_object( $data['post_type'] );
		$taxonomies = get_object_taxonomies( $data['post_type'], 'objects' );
		$this->post_taxonomies = wp_filter_object_list(
			$taxonomies,
			[
				'public' => true,
				'show_in_nav_menus' => true,
			]
		);

		parent::__construct( $data );
	}

	public function get_name() {
		return $this->post_type->name;
	}

	public function get_title() {
		return $this->post_type->labels->singular_name;
	}

	public function get_group_title() {
		/* translators: %s: Post type label. */
		return sprintf( __( '%s', 'qazana' ), $this->post_type->label );
	}

	public function check( $args ) {
		if ( isset( $args['id'] ) ) {
			$id = (int) $args['id'];
			if ( $id ) {
				return is_singular() && get_queried_object_id() === $id;
			}
		}

		return is_singular( $this->post_type->name );
	}

	public function get_sub_conditions() {
		$sub_conditions = [];

		foreach ( $this->post_taxonomies as $slug => $object ) {
			$condition = new In_Taxonomy( [
				'object' => $object,
			] );
			$this->register_condition_instance( $condition );
			$sub_conditions[] = $condition->get_name();
		}

		if ( $this->post_type->hierarchical ) {
			$condition = new Child_Of();
			$this->register_condition_instance( $condition );
			$sub_conditions[] = $condition->get_name();
		}

		return $sub_conditions;
	}

	protected function _register_controls() {
		$this->add_control(
			'post_id',
			[
				'section' => 'settings',
				'type' => 'query',
				'select2options' => [
					'dropdownCssClass' => 'qazana-conditions-select2-dropdown',
				],
				'filter_type' => 'by_id',
				'object_type' => $this->get_name(),
			]
		);
	}
}
