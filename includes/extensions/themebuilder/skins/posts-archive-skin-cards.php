<?php

namespace Qazana\Extensions\ThemeBuilder\Skins;

use Qazana\Extensions\Widgets\Posts\Skins\Skin_Posts_Base as Skin_Cards;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Posts_Archive_Skin_Cards extends Skin_Cards {

	protected function _register_controls_actions() {
		// add_action( 'qazana/element/archive-posts/section_layout/before_section_end', [ $this, 'register_controls' ] );
		// add_action( 'qazana/element/archive-posts/section_layout/after_section_end', [ $this, 'register_style_sections' ] );
		// add_action( 'qazana/element/archive-posts/archive_cards_section_design_image/before_section_end', [ $this, 'register_additional_design_image_controls' ] );
	}

	public function get_id() {
		return 'archive_cards';
	}

	public function get_title() {
		return __( 'Cards', 'qazana' );
	}

	public function render() {
		$this->parent->query_posts();

		$wp_query = $this->parent->get_query();

		if ( ! $wp_query->found_posts ) {
			$this->render_loop_header();

			echo '<div class="qazana-posts-nothing-found">' . esc_html( $this->parent->get_settings( 'nothing_found_message' ) ) . '</div>';

			$this->render_loop_footer();

			return;
		}

		parent::render();
	}

	public function get_container_class() {
		// Use parent class and parent css.
		return 'qazana-posts--skin-cards';
	}

	/* Remove `posts_per_page` control */
	protected function register_post_count_control(){}
}
