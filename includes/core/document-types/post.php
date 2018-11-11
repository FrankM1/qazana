<?php
namespace Qazana\Core\DocumentTypes;

use Qazana\Controls_Manager;
use Qazana\Core\Base\Document;
use Qazana\Group_Control_Background;
use Qazana\Admin\Settings\Panel;
use Qazana\Core\Settings\Manager as SettingsManager;
use Qazana\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Post extends Document {

	public static function get_properties() {
		$properties = parent::get_properties();

		$properties['support_wp_page_templates'] = true;

		return $properties;
	}

	protected static function get_editor_panel_categories() {
		return Utils::array_inject(
			parent::get_editor_panel_categories(),
			'theme-elements',
			[
				'theme-elements-single' => [
					'title' => __( 'Single', 'qazana' ),
					'active' => false,
				],
			]
		);
	}

	/**
	 * @since 2.0.0
	 * @access public
	 */
	public function get_name() {
		return 'post';
	}

	/**
	 * @since 2.0.0
	 * @access public
	 * @static
	 */
	public static function get_title() {
		return __( 'Page', 'qazana' );
	}

	/**
	 * @since 2.0.0
	 * @access public
	 */
	public function get_css_wrapper_selector() {
		return 'body.qazana-page-' . $this->get_main_id();
	}

	/**
	 * @since 2.0.0
	 * @access protected
	 */
	protected function _register_controls() {

		parent::_register_controls();

		self::register_hide_title_control( $this );

		self::register_post_fields_control( $this );

		self::register_style_controls( $this );

		self::register_post_css( $this );

	}

	/**
	 * @since 2.0.0
	 * @access public
	 * @static
	 * @param Document $document
	 */
	public static function register_hide_title_control( $document ) {
		$page_title_selector = SettingsManager::get_settings_managers( 'general' )->get_model()->get_settings( 'qazana_page_title_selector' );

		if ( ! $page_title_selector ) {
			$page_title_selector = 'h1.entry-title';
		}

		$page_title_selector .= ', .qazana-page-title';

		$document->start_injection(
			[
				'of' => 'post_status',
				'fallback' => [
					'of' => 'post_title',
				],
			]
		);

		$document->add_control(
			'hide_title',
			[
				'label' => __( 'Hide Title', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'description' => sprintf(
					/* translators: %s: Setting page link */
					__( 'Not working? You can set a different selector for the title in the <a href="%s" target="_blank">Settings page</a>.', 'qazana' ),
					Panel::get_url() . '#tab-style'
				),
				'selectors' => [
					'{{WRAPPER}} ' . $page_title_selector => 'display: none',
				],
			]
		);

		$document->end_injection();
	}

	/**
	 * @since 2.0.0
	 * @access public
	 * @static
	 * @param Document $document
	 */
	public static function register_style_controls( $document ) {
		$document->start_controls_section(
			'section_page_style',
			[
				'label' => __( 'Body Style', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$document->add_group_control(
			Group_Control_Background::get_type(),
			[
				'name'  => 'background',
				'fields_options' => [
					'image' => [
						// Currently isn't supported.
						'dynamic' => [
							'active' => false,
						],
					],
				],
			]
		);

		$document->add_responsive_control(
			'padding',
			[
				'label' => __( 'Padding', 'qazana' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors' => [
					'{{WRAPPER}}' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}}',
				],
			]
		);

		$document->end_controls_section();
	}

	/**
	 * @since 2.0.0
	 * @access public
	 * @static
	 * @param Document $document
	 */
	public static function register_post_fields_control( $document ) {

		$document->start_injection(
			[
				'of' => 'post_status',
				'fallback' => [
					'of' => 'post_title',
				],
			]
		);

		if ( post_type_supports( $document->post->post_type, 'excerpt' ) ) {
			$document->add_control(
				'post_excerpt',
				[
					'label' => __( 'Excerpt', 'qazana' ),
					'type' => Controls_Manager::TEXTAREA,
					'default' => $document->post->post_excerpt,
					'label_block' => true,
				]
			);
		}

		if ( current_theme_supports( 'post-thumbnails' ) && post_type_supports( $document->post->post_type, 'thumbnail' ) ) {
			$document->add_control(
				'post_featured_image',
				[
					'label' => __( 'Featured Image', 'qazana' ),
					'type' => Controls_Manager::MEDIA,
					'default' => [
						'id' => get_post_thumbnail_id(),
						'url' => get_the_post_thumbnail_url( $document->post->ID ),
					],
				]
			);
		}

		$document->end_injection();
	}

	/**
	 * @since 2.0.0
	 * @access public
	 * @static
	 * @param Document $document
	 */
	public static function register_post_css( $document ) {

		$document->start_controls_section(
			'_section_custom_css',
			[
				'label' => __( 'Custom CSS', 'qazana' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			]
		);

		$document->add_control(
			'custom_css',
			[
				'type'        => Controls_Manager::CODE,
				'label'       => __( 'Add your own custom CSS here', 'qazana' ),
				'language'    => 'css',
				'render_type' => 'ui',
			]
		);

		$document->add_control(
			'_custom_css_description',
			[
				'raw'             => __( 'Use "selector" to target wrapper element. Examples:<br>selector {color: red;} // For main element<br>selector .child-element {margin: 10px;} // For child element<br>.my-class {text-align: center;} // Or use any custom selector', 'qazana' ),
				'type'            => Controls_Manager::RAW_HTML,
				'content_classes' => 'qazana-descriptor',
			]
		);

		$document->end_controls_section();
	}

	/**
	 * @since 2.0.0
	 * @access public
	 *
	 * @param array $data
	 */
	public function __construct( array $data = [] ) {
		if ( $data ) {
			$template = get_post_meta( $data['post_id'], '_wp_page_template', true );
			if ( empty( $template ) ) {
				$template = 'default';
			}
			$data['settings']['template'] = $template;
		}

		parent::__construct( $data );
	}
}
