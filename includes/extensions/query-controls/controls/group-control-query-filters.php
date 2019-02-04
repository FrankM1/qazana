<?php
namespace Qazana\Extensions\Controls;

use Qazana\Controls_Manager;
use Qazana\Group_Control_Base;
use Qazana\Utils;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Group_Control_Posts_Filter extends Group_Control_Base {

	const INLINE_MAX_RESULTS = 15;

	public static function get_type() {
		return 'posts-filter';
	}

	public static function on_export_remove_setting_from_element( $element, $control_id ) {
		unset( $element['settings'][ $control_id . '_posts_ids' ] );
		unset( $element['settings'][ $control_id . '_authors' ] );

		foreach ( Utils::get_post_types() as $post_type => $label ) {
			$taxonomy_filter_args = [
				'show_in_nav_menus' => true,
				'object_type' => [ $post_type ],
			];

			$taxonomies = get_taxonomies( $taxonomy_filter_args, 'objects' );

			foreach ( $taxonomies as $taxonomy => $object ) {
				unset( $element['settings'][ $control_id . '_' . $taxonomy . '_ids' ] );
			}
		}

		return $element;
    }
    
    protected function init_fields() { }
    
	protected function _get_controls( $args ) {
		$defaults = [
			// Available controls: taxonomies | authors | popularity | random
			'include_filters' => [],
			'exclude_controls' => [],
		];

		$args = wp_parse_args( $args, $defaults );

		$controls = [];

        // custom filter types
        $controls['group'] = [
            'type'          => Controls_Manager::SELECT2,
            'options' => array(
				'single' => esc_html__( 'Single filter', 'qazana' ),
                'multiple' => esc_html__( 'Multiple filters', 'qazana' ),
            ),
            'default' => 'single',
            'label'       => esc_html__( 'Filter group:','qazana' ),
            'description'   => esc_html__( 'Select the type of filter.', 'qazana' ),
        ];

		// custom filter types
		$controls['by'] = [
            'type'          => Controls_Manager::SELECT2,
            'options' 		=> $args['include_filters'],
            'label'       	=> esc_html__( 'Filter by:','qazana' ),
            'description'   => esc_html__( 'Select the filter to use', 'qazana' ),
			'condition'    => array(
				'group' => 'single',
			),
        ];

		if ( ! in_array( 'taxonomies', $args['exclude_controls'] ) ) {
			$taxonomy_filter_args = [
				'show_in_nav_menus' => true,
			];

			if ( ! empty( $args['post_type'] ) ) {
				$taxonomy_filter_args['object_type'] = [ $args['post_type'] ];
			}

			$taxonomies = get_taxonomies( $taxonomy_filter_args, 'objects' );

			foreach ( $taxonomies as $taxonomy => $object ) {

				$controls['multiple_' . $object->name ] = [
		            'condition'    => array(
		                'group' => 'multiple',
		            ),
		            'type'          => Controls_Manager::SWITCHER,
		            'label_on' => __( 'Yes', 'qazana' ),
		            'label_off' => __( 'No', 'qazana' ),
		            'label'       => $object->label,
		            'description'   => esc_html__( 'display taxonomy filter', 'qazana' ),
		        ];

				$taxonomy_args = [
					'label' => $object->label,
					'type' => 'query',
					'label_block' => true,
					'multiple' => true,
					'object_type' => $taxonomy,
					'options' => [],
					'description' => esc_html__( 'Leave empty to filter by all taxonomies', 'qazana' ),
				];

				$count = wp_count_terms( $taxonomy );

				$options = [];

				// For large websites, use Ajax to search
				if ( $count > self::INLINE_MAX_RESULTS ) {
					$taxonomy_args['type'] = 'query';
				} else {
					$taxonomy_args['type'] = Controls_Manager::SELECT2;

					$terms = get_terms( $taxonomy );

					foreach ( $terms as $term ) {
						$options[ $term->term_id ] = $term->name;
					}

					$taxonomy_args['options'] = $options;
				}

				$taxonomy_args['frontend_available'] = true;

				$controls[ $taxonomy . '_ids' ] = $taxonomy_args;

				$controls['by']['options'][$object->name] = $object->label . ' ' . esc_html__( 'Filter', 'qazana' );

			}
		}

		if ( ! in_array( 'authors', $args['exclude_controls'] ) ) {

	        $controls['multiple_authors'] = [
	            'condition'    => array(
	                'group' => 'multiple',
	            ),
	            'type'          => Controls_Manager::SWITCHER,
	            'label_on' => __( 'Yes', 'qazana' ),
	            'label_off' => __( 'No', 'qazana' ),
	            'label'       => esc_html__( 'Authors', 'qazana' ),
	            'description'   => esc_html__( 'display authors filter', 'qazana' ),
			];

			$author_args = [
				'label' 		=> _x( 'Author', 'Posts Query Control', 'qazana' ),
				'label_block' 	=> true,
				'multiple' 		=> true,
				'default' 		=> [],
				'options' 		=> [],
				'description' => esc_html__( 'Leave empty to filter by all authors', 'qazana' ),
				'frontend_available' => true,
			];

			$user_query = new \WP_User_Query( [ 'role' => 'Author', 'fields' => 'ID' ] );

			// For large websites, use Ajax to search
			if ( $user_query->get_total() > self::INLINE_MAX_RESULTS ) {
				$author_args['type'] = 'query';

				$author_args['type'] = 'author';
			} else {
				$author_args['type'] = Controls_Manager::SELECT2;

				$author_args['options'] = $this->get_authors();
			}

			$author_args['frontend_available'] = true;

			$controls['authors'] = $author_args;
			$controls['by']['options']['author'] = esc_html__( 'Authors filters', 'qazana' );
		}

        // custom filters
		foreach ( $args['include_filters'] as $filters => $value ) {

	        $controls['multiple_' . $value] = [
	            'condition'    => array(
	                'group' => 'multiple',
	            ),
	            'type'          => Controls_Manager::SWITCHER,
	            'label_on' => __( 'Yes', 'qazana' ),
	            'label_off' => __( 'No', 'qazana' ),
	            'label'       => $value,
	            'description'   => esc_html__( 'display custom filter', 'qazana' ),
			];

		}

        $controls['multiple_filter_ids'] = [
            'condition'    => array(
                'group' => 'multiple_filter_ids',
            ),
            'type'          => Controls_Manager::TEXT,
            'label'       => esc_html__( 'Custom filter ids', 'qazana' ),
            'description'   => esc_html__( 'display customized filters. Example: categories|tags|authors|date', 'qazana' ),
		];

        // default pull down text
		$controls['default_txt'] = [
            'type'          => Controls_Manager::TEXT,
            'label'       => esc_html__( 'Ajax Filter default text', 'qazana' ),
            'description'   => esc_html__( 'The default text for the first item on filter links. The first item shows the default query set in the Query Settings Tab.', 'qazana' ),
            'default'   => esc_html__( 'All', 'qazana' ),
		];

		return $controls;
	}

	private function get_authors() {
		$user_query = new \WP_User_Query(
			[
				'who' => 'authors',
				'has_published_posts' => true,
				'fields' => [
					'ID',
					'display_name',
				],
			]
		);

		$authors = [];

		foreach ( $user_query->get_results() as $result ) {
			$authors[ $result->ID ] = $result->display_name;
		}

		return $authors;
	}
}
