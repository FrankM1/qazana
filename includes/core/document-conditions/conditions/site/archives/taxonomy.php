<?php
namespace Qazana\DocumentConditions\Conditions;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Taxonomy extends Base {

	private $taxonomy;

	public static function get_type() {
		return 'archive';
	}

	public function __construct( $data ) {
		parent::__construct();

		$this->taxonomy = $data['object'];
	}

	public function get_name() {
		return $this->taxonomy->name;
	}

	public function get_title() {
		return $this->taxonomy->label;
	}

	public function check( $args ) {
		$taxonomy = $this->get_name();
		$id = (int) $args['id'];

		if ( 'category' === $taxonomy ) {
			return is_category( $id );
		}

		if ( 'post_tag' === $taxonomy ) {
			return is_tag( $id );
		}

		return is_tax( $taxonomy, $id );
	}

	protected function _register_controls() {
		$this->add_control(
			'taxonomy',
			[
				'section' => 'settings',
				'type' => 'query',
				'options' => [
					'' => __( 'All', 'qazana' ),
				],
				'filter_type' => 'taxonomy',
				'object_type' => $this->get_name(),
			]
		);
	}
}
