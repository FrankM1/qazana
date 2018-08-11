<?php
namespace Qazana\Extensions\Widgets;

use Qazana\Controls_Manager;
use Qazana\Extensions\Widgets\Posts;
use Qazana\Extensions\ThemeBuilder\Skins;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Posts
 */
class Archive_Posts extends Posts {

	public function get_name() {
		return 'archive-posts';
	}

	public function get_title() {
		return __( 'Archive Posts', 'qazana' );
	}

	public function get_icon() {
		return 'eicon-archive-posts';
	}

	public function get_categories() {
		return [ 'theme-elements' ];
	}

	protected function _register_skins() {
		$this->add_skin( new Skins\Posts_Archive_Skin_Classic( $this ) );
		$this->add_skin( new Skins\Posts_Archive_Skin_Cards( $this ) );
	}

	protected function _register_controls() {
		parent::_register_controls();

		// $this->register_pagination_section_controls();

		// $this->register_advanced_section_controls();

		// $this->update_control(
		// 	'pagination_type',
		// 	[
		// 		'default' => 'numbers',
		// 	]
		// );
	}

	public function register_advanced_section_controls() {
		$this->start_controls_section(
			'section_advanced',
			[
				'label' => __( 'Advanced', 'qazana' ),
			]
		);

		$this->add_control(
			'nothing_found_message',
			[
				'label' => __( 'Nothing Found Message', 'qazana' ),
				'type' => Controls_Manager::TEXTAREA,
				'default' => __( 'It seems we can\'t find what you\'re looking for.', 'qazana' ),
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_nothing_found_style',
			[
				'tab'   => Controls_Manager::TAB_STYLE,
				'label' => __( 'Nothing Found Message', 'qazana' ),
				'condition' => [
					'nothing_found_message!'  => '',
				],
			]
		);

		$this->add_control(
			'nothing_found_color',
			[
				'label' => __( 'Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_3,
				],
				'selectors' => [
					'{{WRAPPER}} .elementor-posts-nothing-found' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'nothing_found_typography',
				'scheme' => Scheme_Typography::TYPOGRAPHY_3,
				'selector' => '{{WRAPPER}} .elementor-posts-nothing-found',
			]
		);

		$this->end_controls_section();
	}

	public function query_posts() {
		global $wp_query;

		$query_vars = $wp_query->query_vars;

		/**
		 * Posts archive query vars.
		 *
		 * Filters the post query variables when the theme loads the posts archive page.
		 *
		 * @since 2.0.0
		 *
		 * @param array $query_vars The query variables for the `WP_Query`.
		 */
		$query_vars = apply_filters( 'qazana/theme/posts_archive/query_posts/query_vars', $query_vars );

		if ( $query_vars !== $wp_query->query_vars ) {
			$this->query = new \WP_Query( $query_vars );
		} else {
			$this->query = $wp_query;
		}
	}
}
