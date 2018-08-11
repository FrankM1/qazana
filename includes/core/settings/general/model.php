<?php
namespace Qazana\Core\Settings\General;

use Qazana\Controls_Manager;
use Qazana\Core\Settings\Base\Model as BaseModel;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Qazana global settings model.
 *
 * Qazana global settings model handler class is responsible for registering
 * and managing Qazana global settings models.
 *
 * @since 1.6.0
 */
class Model extends BaseModel {

	/**
	 * Get model name.
	 *
	 * Retrieve global settings model name.
	 *
	 * @since 1.6.0
	 * @access public
	 *
	 * @return string Model name.
	 */
	public function get_name() {
		return 'global-settings';
	}

	/**
	 * Get CSS wrapper selector.
	 *
	 * Retrieve the wrapper selector for the global settings model.
	 *
	 * @since 1.6.0
	 * @access public
	 *
	 * @return string CSS wrapper selector.
	 */

	public function get_css_wrapper_selector() {
		return '';
	}

	/**
	 * Get panel page settings.
	 *
	 * Retrieve the panel setting for the global settings model.
	 *
	 * @since 1.6.0
	 * @access public
	 *
	 * @return array {
	 *    Panel settings.
	 *
	 *    @type string $title The panel title.
	 *    @type array  $menu  The panel menu.
	 * }
	 */
	public function get_panel_page_settings() {
		return [
			'title' => __( 'Global Settings', 'qazana' ),
			'menu' => [
				'icon' => 'fa fa-cogs',
				'beforeItem' => 'qazana-settings',
			],
		];
	}

	/**
	 * Get controls list.
	 *
	 * Retrieve the global settings model controls list.
	 *
	 * @since 1.6.0
	 * @access public
	 * @static
	 *
	 * @return array Controls list.
	 */
	public static function get_controls_list() {
		return [
			Controls_Manager::TAB_STYLE => [
				'style' => [
					'label' => __( 'Style', 'qazana' ),
					'controls' => [
						'qazana_default_generic_fonts' => [
							'label' => __( 'Default Generic Fonts', 'qazana' ),
							'type' => Controls_Manager::TEXT,
							'default' => 'Sans-serif',
							'description' => __( 'The list of fonts used if the chosen font is not available.', 'qazana' ),
							'label_block' => true,
						],
						'qazana_container_width' => [
							'label' => __( 'Content Width', 'qazana' ) . ' (px)',
							'type' => Controls_Manager::NUMBER,
							'min' => 0,
							'description' => __( 'Sets the default width of the content area (Default: 1140)', 'qazana' ),
							'selectors' => [
								'.qazana-section.qazana-section-boxed > .qazana-container' => 'max-width: {{VALUE}}px',
							],
						],
						'qazana_space_between_widgets' => [
							'label' => __( 'Widgets Space', 'qazana' ) . ' (px)',
							'type' => Controls_Manager::NUMBER,
							'min' => 0,
							'placeholder' => '20',
							'description' => __( 'Sets the default space between widgets (Default: 20)', 'qazana' ),
							'selectors' => [
								'.qazana-widget:not(:last-child)' => 'margin-bottom: {{VALUE}}px',
							],
						],
						'qazana_stretched_section_container' => [
							'label' => __( 'Stretched Section Fit To', 'qazana' ),
							'type' => Controls_Manager::TEXT,
							'placeholder' => 'body',
							'description' => __( 'Enter parent element selector to which stretched sections will fit to (e.g. #primary / .wrapper / main etc). Leave blank to fit to page width.', 'qazana' ),
							'label_block' => true,
							'frontend_available' => true,
						],
						'qazana_page_title_selector' => [
							'label' => __( 'Page Title Selector', 'qazana' ),
							'type' => Controls_Manager::TEXT,
							'placeholder' => 'h1.entry-title',
							'description' => __( 'Qazana lets you hide the page title. This works for themes that have "h1.entry-title" selector. If your theme\'s selector is different, please enter it above.', 'qazana' ),
							'label_block' => true,
						],
					],
				],
			],
			Manager::PANEL_TAB_LIGHTBOX => [
				'lightbox' => [
					'label' => __( 'Lightbox', 'qazana' ),
					'controls' => [
						'qazana_global_image_lightbox' => [
							'label' => __( 'Image Lightbox', 'qazana' ),
							'type' => Controls_Manager::SWITCHER,
							'default' => 'yes',
							'description' => __( 'Open all image links in a lightbox popup window. The lightbox will automatically work on any link that leads to an image file.', 'qazana' ),
							'frontend_available' => true,
						],
						'qazana_enable_lightbox_in_editor' => [
							'label' => __( 'Enable In Editor', 'qazana' ),
							'type' => Controls_Manager::SWITCHER,
							'default' => 'yes',
							'frontend_available' => true,
						],
						'qazana_lightbox_color' => [
							'label' => __( 'Background Color', 'qazana' ),
							'type' => Controls_Manager::COLOR,
							'selectors' => [
								'.qazana-lightbox' => 'background-color: {{VALUE}}',
							],
						],
						'qazana_lightbox_ui_color' => [
							'label' => __( 'UI Color', 'qazana' ),
							'type' => Controls_Manager::COLOR,
							'selectors' => [
								'.qazana-lightbox .dialog-lightbox-close-button, .qazana-lightbox .qazana-swiper-button' => 'color: {{VALUE}}',
							],
						],
						'qazana_lightbox_ui_color_hover' => [
							'label' => __( 'UI Hover Color', 'qazana' ),
							'type' => Controls_Manager::COLOR,
							'selectors' => [
								'.qazana-lightbox .dialog-lightbox-close-button:hover, .qazana-lightbox .qazana-swiper-button:hover' => 'color: {{VALUE}}',
							],
						],
					],
				],
			],
		];
	}

	/**
	 * Register model controls.
	 *
	 * Used to add new controls to the global settings model.
	 *
	 * @since 1.6.0
	 * @access protected
	 */
	protected function _register_controls() {
		$controls_list = self::get_controls_list();

		foreach ( $controls_list as $tab_name => $sections ) {

			foreach ( $sections as $section_name => $section_data ) {

				$this->start_controls_section(
					$section_name, [
						'label' => $section_data['label'],
						'tab' => $tab_name,
					]
				);

				foreach ( $section_data['controls'] as $control_name => $control_data ) {
					$this->add_control( $control_name, $control_data );
				}

				$this->end_controls_section();
			}
		}
	}
}
