<?php
namespace Qazana\Extensions\ThemeBuilder\Conditions;

use Qazana\Extensions\Queries_Group_Controls as QueryModule;
use Qazana\Extensions\ThemeBuilder as Module;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Post extends Condition_Base {

	private $post_type;
	private $post_taxonomies;

	public static function get_type() {
		return 'singular';
	}

	public function __construct( $data ) {
		$this->post_type = get_post_type_object( $data['post_type'] );
		$taxonomies = get_object_taxonomies( $data['post_type'], 'objects' );
		$this->post_taxonomies = wp_filter_object_list( $taxonomies, [
			'public' => true,
			'show_in_nav_menus' => true,
		] );

		parent::__construct();
	}

	public function get_name() {
		return $this->post_type->name;
	}

	public function get_label() {
		return $this->post_type->labels->singular_name;
	}

	public function get_all_label() {
		/* translators: %s: Post type label. */
		return sprintf( __( 'All %s', 'qazana' ), $this->post_type->label );
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

		$conditions_manager = Module::instance()->get_conditions_manager();

		foreach ( $this->post_taxonomies as $slug => $object ) {
			$condition = new In_Taxonomy( [
				'object' => $object,
			] );
			$conditions_manager->register_condition_instance( $condition );
			$sub_conditions[] = $condition->get_name();
		}

		if ( $this->post_type->hierarchical ) {
			$condition = new Child_Of();
			$conditions_manager->register_condition_instance( $condition );
			$sub_conditions[] = $condition->get_name();
		}

		return $sub_conditions;
	}

	protected function _register_controls() {
		$this->add_control(
			'post_id',
			[
				'section' => 'settings',
				'type' => QueryModule::QUERY_CONTROL_ID,
				'select2options' => [
					'dropdownCssClass' => 'qazana-conditions-select2-dropdown',
				],
				'filter_type' => 'post',
				'object_type' => $this->get_name(),
			]
		);
	}
}
