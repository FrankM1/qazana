<?php
namespace Qazana\Extensions\Widgets;

use Qazana\Controls_Manager;
use Qazana\Extensions\QueryControl as QueryControlModule;
use Qazana\Extensions\Theme_Elements as Module;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Post_Comments extends Theme_Elements_Widget_Base {

	public function get_name() {
		return 'post-comments';
	}

	public function get_title() {
		return __( 'Post Comments', 'qazana' );
	}

	public function get_icon() {
		return 'eicon-comments';
	}

	protected function _register_controls() {
		$this->start_controls_section(
			'section_content',
			[
				'label' => __( 'Comments', 'qazana' ),
			]
		);

		$this->add_control(
			'_skin',
			[
				'type' => Controls_Manager::HIDDEN,
			]
		);

		$this->add_control(
			'skin_temp',
			[
				'label' => __( 'Skin', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'' => __( 'Theme Comments', 'qazana' ),
				],
				'description' => __( 'The Theme Comments skin uses the currently active theme comments design and layout to display the comment form and comments.', 'qazana' ),
			]
		);

		$this->add_control(
			'source_type',
			[
				'label' => __( 'Source', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					Module::SOURCE_TYPE_CURRENT_POST => __( 'Current Post', 'qazana' ),
					Module::SOURCE_TYPE_CUSTOM => __( 'Custom', 'qazana' ),
				],
				'default' => Module::SOURCE_TYPE_CURRENT_POST,
				'separator' => 'before',
			]
		);

		// $this->add_control(
		// 	'source_custom',
		// 	[
		// 		'label' => __( 'Search & Select', 'elementor-pro' ),
		// 		'type' => QueryControlModule::QUERY_CONTROL_ID,
		// 		'label_block' => true,
		// 		'filter_type' => 'by_id',
		// 		'condition' => [
		// 			'source_type' => Module::SOURCE_TYPE_CUSTOM,
		// 		],
		// 	]
		// );

		$this->end_controls_section();
	}

	public function render() {
		$settings = $this->get_settings();

		if ( Module::SOURCE_TYPE_CUSTOM === $settings['source_type'] ) {
			$post_id = (int) $settings['source_custom'];
			qazana()->db->switch_to_post( $post_id );
		}

		if ( ! comments_open() && ( qazana()->preview->is_preview_mode() || qazana()->editor->is_edit_mode() ) ) :
			?>
			<div class="elementor-alert elementor-alert-danger" role="alert">
				<span class="elementor-alert-title">
					<?php esc_html_e( 'Comments Are Closed!', 'qazana' ); ?>
				</span>
				<span class="elementor-alert-description">
					<?php esc_html_e( 'Switch on comments from either the discussion box on the WordPress post edit screen or from the WordPress discussion settings.', 'qazana' ); ?>
				</span>
			</div>
		<?php
		else :
			comments_template();
		endif;

		if ( Module::SOURCE_TYPE_CUSTOM === $settings['source_type'] ) {
			qazana()->db->restore_current_post();
		}
	}
}
