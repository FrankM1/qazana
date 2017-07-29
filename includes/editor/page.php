<?php
namespace Qazana\PageSettings;

use Qazana\Controls_Manager;
use Qazana\Controls_Stack;
use Qazana\Group_Control_Background;
use Qazana\Settings;
use Qazana\PageSettings\Manager as PageSettingsManager;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Page extends Controls_Stack {

	/**
	 * @var \WP_Post
	 */
	private $post;

	public function __construct( array $data = [] ) {

		$this->post = get_post( $data['id'] );

		add_action( 'qazana/element/parse_css', [ $this, 'add_post_css' ], 10, 2 );
		add_action( 'qazana/post-css-file/parse', [ $this, 'add_page_settings_css' ] );

		parent::__construct( $data );
	}

	public function get_name() {
		return 'page-settings-' . $this->post->ID;
	}

	public function on_export( $element_data ) {
		if ( ! empty( $element_data['settings']['template'] ) && Manager::TEMPLATE_CANVAS !== $element_data['settings']['template'] ) {
			unset( $element_data['settings']['template'] );
		}

		return $element_data;
	}

	protected function _register_controls() {

		$this->start_controls_section(
			'section_page_settings',
			[
				'label' => __( 'Page Settings', 'qazana' ),
				'tab' => Controls_Manager::TAB_SETTINGS,
			]
		);

		$this->add_control(
			'post_title',
			[
				'label' => __( 'Title', 'qazana' ),
				'type' => Controls_Manager::TEXT,
				'default' => $this->post->post_title,
				'label_block' => true,
				'separator' => 'none',
			]
		);

		$page_title_selector = get_option( 'qazana_page_title_selector' );

		if ( empty( $page_title_selector ) ) {
			$page_title_selector = 'h1.entry-title';
		}

		$this->add_control(
			'hide_title',
			[
				'label' => __( 'Hide Title', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'label_off' => __( 'No', 'qazana' ),
				'label_on' => __( 'Yes', 'qazana' ),
				'description' => sprintf( __( 'Not working? You can set a different selector for the title in the <a href="%s" target="_blank">Settings page</a>.', 'qazana' ), admin_url( 'admin.php?page=' . qazana()->slug ) ),
				'selectors' => [
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

			$saved_template = get_post_meta( $this->post->ID, '_wp_page_template', true );

			if ( ! $saved_template ) {
				$saved_template = 'default';
			}

			unset($options['blog']);

			$this->add_control(
				'template',
				[
					'label' => __( 'Template', 'qazana' ),
					'type' => Controls_Manager::SELECT,
					'default' => $saved_template,
					'options' => $options,
					'export' => function( $value ) {
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
					'label' => __( 'Status', 'qazana' ),
					'type' => Controls_Manager::SELECT,
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
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_group_control(
			Group_Control_Background::get_type(),
			[
				'name' => 'background',
				'label' => __( 'Background', 'qazana' ),
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
				'label' => __( 'Padding', 'qazana' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors' => [
					'{{WRAPPER}}' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}}',
				],
				'export' => '__return_true',
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_custom_css',
			[
				'label' => __( 'Custom CSS', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'custom_css',
			[
				'type' => Controls_Manager::CODE,
				'label' => __( 'Add your own custom CSS here', 'qazana' ),
				'language' => 'css',
				'render_type' => 'ui',
			]
		);

		$this->add_control(
			'custom_css_description',
			[
				'raw' => __( 'Use "selector" to target wrapper element. Examples:<br>selector {color: red;} // For main element<br>selector .child-element {margin: 10px;} // For child element<br>.my-class {text-align: center;} // Or use any custom selector', 'qazana' ),
				'type' => Controls_Manager::RAW_HTML,
				'content_classes' => 'qazana-descriptor',
			]
		);

		$this->end_controls_section();
	}

	/**
	 * @param $post_css Post_CSS_File
	 * @param $element Element_Base
	 */
	public function add_post_css( $post_css, $element ) {
		$element_settings = $element->get_settings();

		if ( empty( $element_settings['custom_css'] ) ) {
			return;
		}

		$css = trim( $element_settings['custom_css'] );

		if ( empty( $css ) ) {
			return;
		}
		$css = str_replace( 'selector', $post_css->get_element_unique_selector( $element ), $css );

		// Add a css comment
		$css = sprintf( '/* Start custom CSS for %s, class: %s */', $element->get_name(), $element->get_unique_selector() ) . $css . '/* End custom CSS */';

		$post_css->get_stylesheet()->add_raw_css( $css );
	}

	/**
	 * @param $post_css Post_CSS_File
	 */
	public function add_page_settings_css( $post_css ) {
		$page_settings_instance = PageSettingsManager::get_page( $post_css->get_post_id() );
		$custom_css = $page_settings_instance->get_settings( 'custom_css' );

		$custom_css = trim( $custom_css );

		if ( empty( $custom_css ) ) {
			return;
		}

		$custom_css = str_replace( 'selector', 'body.qazana-page-' . $post_css->get_post_id(), $custom_css );

		// Add a css comment
		$custom_css = '/* Start custom CSS for page-settings */' . $custom_css . '/* End custom CSS */';

		$post_css->get_stylesheet()->add_raw_css( $custom_css );
	}

}
