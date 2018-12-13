<?php
namespace Qazana\Extensions\Tags;

use Qazana\Controls_Manager;
use Qazana\Core\DynamicTags\Tag;
use Qazana\Extensions\DynamicTags_Site;
use Qazana\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Post_Terms extends Tag {
	public function get_name() {
		return 'post-terms';
	}

	public function get_title() {
		return __( 'Post Terms', 'qazana' );
	}

	public function get_group() {
		return DynamicTags_Site::POST_GROUP;
	}

	public function get_categories() {
		return [ DynamicTags_Site::TEXT_CATEGORY ];
	}

	protected function _register_controls() {
		$taxonomy_filter_args = [
			'show_in_nav_menus' => true,
			'object_type' => [ get_post_type() ],
		];

		/**
		 * Dynamic tags taxonomy args.
		 *
		 * Filters the taxonomy arguments used to retrieve the registered taxonomies
		 * displayed in the taxonomy dynamic tag.
		 *
		 * @since 2.0.0
		 *
		 * @param array $taxonomy_filter_args An array of `key => value` arguments to
		 *                                    match against the taxonomy objects inside
		 *                                    the `get_taxonomies()` function.
		 */
		$taxonomy_filter_args = apply_filters( 'qazana/dynamic_tags/post_terms/taxonomy_args', $taxonomy_filter_args );

		$taxonomies = Utils::get_taxonomies( $taxonomy_filter_args, 'objects' );

		$options = [];

		foreach ( $taxonomies as $taxonomy => $object ) {
			$options[ $taxonomy ] = $object->label;
		}

		$this->add_control(
			'taxonomy',
			[
				'label'   => __( 'Taxonomy', 'qazana' ),
				'type'    => Controls_Manager::SELECT,
				'options' => $options,
				'default' => 'post_tag',
			]
		);

		$this->add_control(
			'limit',
			[
				'label'   => __( 'Limit', 'qazana' ),
				'type'    => Controls_Manager::NUMBER,
			]
		);

		$this->add_control(
			'separator',
			[
				'label'   => __( 'Separator', 'qazana' ),
				'type'    => Controls_Manager::TEXT,
				'default' => ', ',
			]
		);
	}

	/**
	 * Limit terms
	 */
	function limit_terms( $terms ) {
		$settings = $this->get_settings();
		$length = intval( $settings['limit'] );

		if ( ! $length ) {
			return $terms;
		}

		// Slice the terms array
		if ( is_array( $terms ) && count( $terms ) > $length ) {
			$terms = array_slice( $terms, $offset = 0, $length );
		}

		return $terms;
	}


	public function render() {
		$settings = $this->get_settings();

		// Add filter
		add_filter( 'get_the_terms', [ $this, 'limit_terms' ] );

		$value = get_the_term_list( get_the_ID(), $settings['taxonomy'], '', $settings['separator'] );

		// Remove filter
		remove_filter( 'get_the_terms', [ $this, 'limit_terms' ] );

		echo wp_kses_post( $value );
	}
}
