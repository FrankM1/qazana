<?php
namespace Qazana\Extensions;

use Qazana\Extensions\Controls\Group_Control_Posts;
use Qazana\Extensions\Controls\Group_Control_Posts_Filter;
use Qazana\Extensions\Controls\Query;
use WP_Query;
use WP_User_Query;
use WP_Error;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Query_Controls extends Base {

	const QUERY_CONTROL_ID = 'query';

	public function __construct() {

		require wp_normalize_path( dirname( __FILE__ ) . '/controls/group-control-queries.php' );
		require wp_normalize_path( dirname( __FILE__ ) . '/controls/group-control-query-filters.php' );
		require wp_normalize_path( dirname( __FILE__ ) . '/controls/query.php' );

		$this->register_controls();
		$this->add_actions();
	}

	public function register() {
		return [
			'title' => __( 'Query Controls', 'qazana'),
			'name' => 'query-controls',
			'required' => true,
			'default_activation' => true,
		];
	}

	public function ajax_posts_filter_autocomplete() {
		qazana()->get_editor()->verify_ajax_nonce();
		
		if ( empty( $_POST['filter_type'] ) || empty( $_POST['q'] ) ) {
			wp_send_json_error( new WP_Error( 'Bad Request' ) );
		}

		$results = [];

		switch ( $_POST['filter_type'] ) {
			case 'taxonomy':
				$query_params = [
					'taxonomy' => $_POST['object_type'],
					'search' => $_POST['q'],
					'hide_empty' => false,
				];

				$terms = get_terms( $query_params );

				global $wp_taxonomies;

				foreach ( $terms as $term ) {
					if ( ! empty( $_POST['include_type'] ) ) {
						$text = $wp_taxonomies[ $term->taxonomy ]->labels->singular_name . ': ' . $term->name;
					} else {
						$text = $term->name;
					}

					$results[] = [
						'id' => $term->term_id,
						'text' => $text,
					];
				}

				break;

			case 'by_id':
			case 'post':
				$query_params = [
					'post_type' => $_POST['object_type'],
					's' => $_POST['q'],
					'posts_per_page' => -1,
				];

				if ( 'attachment' === $query_params['post_type'] ) {
					$query_params['post_status'] = 'inherit';
				}

				$query = new WP_Query( $query_params );

				foreach ( $query->posts as $post ) {
					if ( ! empty( $_POST['include_type'] ) ) {
						$post_type_obj = get_post_type_object( $post->post_type );
						$text = $post_type_obj->labels->singular_name . ': ' . $post->post_title;
					} else {
						$text = $post->post_title;
					}

					$results[] = [
						'id' => $post->ID,
						'text' => $text,
					];
				}
				break;

			case 'author':
				$query_params = [
					'who' => 'authors',
					'has_published_posts' => true,
					'fields' => [
						'ID',
						'display_name',
					],
					'search' => '*' . $_POST['q'] . '*',
					'search_columns' => [
						'user_login',
						'user_nicename',
					],
				];

				$user_query = new WP_User_Query( $query_params );

				foreach ( $user_query->get_results() as $author ) {
					$results[] = [
						'id' => $author->ID,
						'text' => $author->display_name,
					];
				}
				break;
			default:
				$results = apply_filters( 'qazana/query_control/get_autocomplete/' . $_POST['filter_type'], [] );
		} // End switch().

		wp_send_json_success(
			[
				'results' => $results,
			]
		);
	}

	public function ajax_posts_control_value_titles( $request ) {
		if ( empty( $request ) ) {
			return;
		}

		$ids = (array) $request['id'];

		$results = [];

		if ( 'taxonomy' === $request['filter_type'] ) {

			$terms = get_terms(
				[
					'include' => $ids,
					'hide_empty' => false,
				]
			);

			foreach ( $terms as $term ) {
				$results[ $term->term_id ] = $term->name;
			}
		} elseif ( 'by_id' === $request['filter_type'] || 'post' === $request['filter_type'] ) {
			$query = new WP_Query(
				[
					'post_type' => 'any',
					'post__in' => $ids,
					'posts_per_page' => -1,
				]
			);

			foreach ( $query->posts as $post ) {
				$results[ $post->ID ] = $post->post_title;
			}
		} elseif ( 'author' === $request['filter_type'] ) {
			$query_params = [
				'who' => 'authors',
				'has_published_posts' => true,
				'fields' => [
					'ID',
					'display_name',
				],
				'include' => $ids,
			];

			$user_query = new WP_User_Query( $query_params );

			foreach ( $user_query->get_results() as $author ) {
				$results[ $author->ID ] = $author->display_name;
			}
		} // End if().

		return $results;
	}

	public function register_controls() {
		qazana()->get_controls_manager()->add_group_control( Group_Control_Posts::get_type(), new Group_Control_Posts() );
		qazana()->get_controls_manager()->add_group_control( Group_Control_Posts_Filter::get_type(), new Group_Control_Posts_Filter() );
		qazana()->get_controls_manager()->register_control( self::QUERY_CONTROL_ID, new Query() );
	}

	public static function get_query_args( $control_id, $settings ) {
		$defaults = [
			$control_id . '_post_type' => 'post',
			$control_id . '_posts_ids' => [],
			'orderby' => 'date',
			'order' => 'desc',
			'posts_per_page' => 3,
			'offset' => 0,
		];

		$settings = wp_parse_args( $settings, $defaults );

		$post_type = $settings[ $control_id . '_post_type' ];

		$query_args = [
			'orderby' => $settings['orderby'],
			'order' => $settings['order'],
			'ignore_sticky_posts' => 1,
			'post_status' => 'publish', // Hide drafts/private posts for admins
		];

		if ( 'by_id' === $post_type ) {
			$query_args['post_type'] = 'any';
			$query_args['post__in']  = $settings[ $control_id . '_posts_ids' ];

			if ( empty( $query_args['post__in'] ) ) {
				// If no selection - return an empty query
				$query_args['post__in'] = [ - 1 ];
			}
		} else {
			$query_args['post_type'] = $post_type;
			$query_args['posts_per_page'] = !empty( $settings['posts_per_page'] ) ? $settings['posts_per_page'] : 3;
			$query_args['paged'] = ! empty( $settings['page'] ) ? $settings['page'] : 1;
			$query_args['tax_query'] = [];

			if ( 0 < $settings['offset'] ) {
				/**
				 * Due to a wordpress bug, the offset will be set later, in $this->fix_query_offset()
				 * @see https://codex.wordpress.org/Making_Custom_Queries_using_Offset_and_Pagination
				 */
				$query_args['offset_to_fix'] = $settings['offset'];
			}

			$taxonomies = get_object_taxonomies( $post_type, 'objects' );

			foreach ( $taxonomies as $object ) {
				$setting_key = $control_id . '_' . $object->name . '_ids';

				if ( ! empty( $settings[ $setting_key ] ) ) {
					$query_args['tax_query'][] = [
						'taxonomy' => $object->name,
						'field' => 'terms_ids',
						'terms' => $settings[ $setting_key ],
					];
				}
			}
		}

		if ( ! empty( $settings[ $control_id . '_authors' ] ) ) {
			$query_args['author__in'] = $settings[ $control_id . '_authors' ];
		}

		return $query_args;
	}

	/**
	 * @param WP_Query $query
	 */
	function fix_query_offset( &$query ) {
		if ( ! empty( $query->query_vars['offset_to_fix'] ) ) {
			$query->query_vars['offset'] = $query->query_vars['offset_to_fix'] + ( ( $query->query_vars['paged'] -1 ) * $query->query_vars['posts_per_page'] );
		}
	}

	function fix_query_found_posts( $found_posts, $query ) {
		$offset_to_fix = $query->get( 'fix_pagination_offset' );

		if ( $offset_to_fix ) {
			$found_posts -= $offset_to_fix;
		}

		return $found_posts;
	}

	/**
	 * Add Actions
	 *
	 * @since 1.0.0
	 *
	 * @access public
	 */
	protected function add_actions() {
		add_action( 'wp_ajax_qazana_panel_posts_control_filter_autocomplete', [ $this, 'ajax_posts_filter_autocomplete' ] );
		add_action( 'wp_ajax_qazana_panel_posts_control_value_titles', [ $this, 'ajax_posts_control_value_titles' ] );
		add_action( 'pre_get_posts', [ $this, 'fix_query_offset' ], 1 );
		add_filter( 'found_posts', [ $this, 'fix_query_found_posts' ], 1, 2 );
	}
}
