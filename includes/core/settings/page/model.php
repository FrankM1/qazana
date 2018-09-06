<?php
namespace Qazana\Core\Settings\Page;

use Qazana\Controls_Manager;
use Qazana\Core\Settings\Base\Model as BaseModel;
use Qazana\Group_Control_Background;
use Qazana\Core\Settings\Manager as SettingsManager;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Model extends BaseModel {

	/**
	 * @var \WP_Post
	 */
	private $post;

	public function __construct( array $data = [] ) {
		$this->post = get_post( $data['id'] );

		if ( ! $this->post ) {
			$this->post = new \WP_Post( (object) [] );
		}

		parent::__construct( $data );
	}

	public function get_name() {
		return 'page-settings';
	}

	public function get_unique_name() {
		return $this->get_name() . '-' . $this->post->ID;
	}

	public function get_css_wrapper_selector() {
        return apply_filters( 'qazana/core/settings/'. $this->get_name() . '/selector', 'body.qazana-page-' . $this->get_id(), $this );
	}

	public function get_panel_page_settings() {
		return [
			'title' => __( 'Page Settings', 'qazana' ),
			'menu'  => [
				'icon'       => 'fa fa-cog',
				'beforeItem' => 'clear-page',
			],
		];
	}

	public function on_export( $element_data ) {
		if ( ! empty( $element_data['settings']['template'] ) && Manager::TEMPLATE_CANVAS !== $element_data['settings']['template'] ) {
			unset( $element_data['settings']['template'] );
		}

		return $element_data;
	}

	protected function _register_controls() {

		do_action( 'qazana/core/settings/before/'. $this->get_name(), $this );

		$this->start_controls_section(
			'section_page_settings',
			[
				'label' => __( 'Page Settings', 'qazana' ),
				'tab'   => Controls_Manager::TAB_SETTINGS,
			]
		);

		$this->add_control(
			'post_title',
			[
				'label'       => __( 'Title', 'qazana' ),
				'type'        => Controls_Manager::TEXT,
				'default'     => $this->post->post_title,
				'label_block' => true,
				'separator'   => 'none',
			]
		);

		$page_title_selector = SettingsManager::get_settings_managers( 'general' )->get_model()->get_settings( 'qazana_page_title_selector' );

		if ( ! $page_title_selector ) {
			$page_title_selector = 'h1.entry-title';
		}

		$this->add_control(
			'hide_title',
			[
				'label'     => __( 'Hide Title', 'qazana' ),
				'type'      => Controls_Manager::SWITCHER,
				'label_off' => __( 'No', 'qazana' ),
				'label_on'  => __( 'Yes', 'qazana' ),
				// translators: %s: Setting Page link
				'description' => sprintf( __( 'Not working? You can set a different selector for the title in the <a href="%s" target="_blank">Settings page</a>.', 'qazana' ), admin_url( 'admin.php?page=' . qazana()->slug ) ),
				'selectors'   => [
					'{{WRAPPER}} ' . $page_title_selector => 'display: none',
				],
				'export' => '__return_true',
			]
		);

		if ( Manager::is_cpt_custom_templates_supported() ) {
			require_once ABSPATH . '/wp-admin/includes/template.php';

			$options = [
				'default' => __( 'Default', 'qazana' ),
			];

			$options += array_flip( get_page_templates( null, $this->post->post_type ) );

			$this->add_control(
				'template',
				[
					'label'   => __( 'Template', 'qazana' ),
					'type'    => Controls_Manager::SELECT,
					'default' => 'default',
					'options' => $options,
					'export'  => function( $value ) {
						return Manager::TEMPLATE_CANVAS === $value;
					},
				]
			);
		}

		$post_type_object = get_post_type_object( $this->post->post_type );

		$can_publish = current_user_can( $post_type_object->cap->publish_posts );

		if ( 'publish' === $this->post->post_status || 'private' === $this->post->post_status || $can_publish ) {
			$this->add_control(
				'post_status',
				[
					'label'   => __( 'Status', 'qazana' ),
					'type'    => Controls_Manager::SELECT,
					'default' => $this->post->post_status,
					'options' => get_post_statuses(),
				]
			);
		}

		$this->end_controls_section();

		$this->start_controls_section(
			'section_page_style',
			[
				'label' => __( 'Page Style', 'qazana' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_group_control(
			Group_Control_Background::get_type(),
			[
				'name'           => 'background',
				'label'          => __( 'Background', 'qazana' ),
				'fields_options' => [
					'__all' => [
						'export' => '__return_true',
					],
				],
			]
		);

		$this->add_responsive_control(
			'padding',
			[
				'label'      => __( 'Padding', 'qazana' ),
				'type'       => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors'  => [
					'{{WRAPPER}}' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}}',
				],
				'export' => '__return_true',
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'_section_custom_css',
			[
				'label' => __( 'Custom CSS', 'qazana' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'custom_css',
			[
				'type'        => Controls_Manager::CODE,
				'label'       => __( 'Add your own custom CSS here', 'qazana' ),
				'language'    => 'css',
				'render_type' => 'ui',
			]
		);

		$this->add_control(
			'_custom_css_description',
			[
				'raw'             => __( 'Use "selector" to target wrapper element. Examples:<br>selector {color: red;} // For main element<br>selector .child-element {margin: 10px;} // For child element<br>.my-class {text-align: center;} // Or use any custom selector', 'qazana' ),
				'type'            => Controls_Manager::RAW_HTML,
				'content_classes' => 'qazana-descriptor',
			]
		);

		$this->end_controls_section();

		do_action( 'qazana/core/settings/after/'. $this->get_name(), $this );
	}
}
