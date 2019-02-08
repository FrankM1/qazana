<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
} // Exit if accessed directly

class Custom_Css {

	public function __construct() {
		$this->add_actions();
	}

	public function get_name() {
		return 'custom-css';
	}

	/**
	 * @param $element    Widget_Base
	 * @param $section_id string
	 * @param $args       array
	 */
	public function register_controls( Controls_Stack $element, $section_id, $args ) {
		$required_section_id = '';

		if ( $element instanceof Element_Section || $element instanceof Widget_Base ) {
			$required_section_id = '_section_responsive';
		} elseif ( $element instanceof Element_Column ) {
			$required_section_id = 'section_advanced';
		}

		if ( $required_section_id !== $section_id ) {
			return;
		}

		$element->start_controls_section(
			'section_custom_css',
			[
				'label' => __( 'Custom CSS', 'qazana' ),
				'tab'   => Controls_Manager::TAB_ADVANCED,
			]
		);

		$element->add_control(
			'custom_css',
			[
				'type'      => Controls_Manager::CODE,
				'label'     => __( 'Add your own custom CSS here', 'qazana' ),
				'language'  => 'css',
				'selectors' => [
					'' => '',
				], // Hack to define it as a styleControl. @FIXME
			]
		);

		$element->add_control(
			'custom_css_description',
			[
				'raw'     => __( 'Use "selector" to target wrapper element. Examples:<br>selector {color: red;} // For main element<br>selector .child-element {margin: 10px;} // For child element<br>.my-class {text-align: center;} // Or use any custom selector', 'qazana' ),
				'type'    => Controls_Manager::RAW_HTML,
				'classes' => 'qazana-descriptor',
			]
		);

		$element->end_controls_section();
	}

	private function make_unique_selectors( $selectors, $unique_prefix ) {
		$to_replace = [ 'selector', "\n", "\r" ];

		foreach ( $selectors as & $selector ) {
			$selector = $unique_prefix . ' ' . str_replace( $to_replace, '', $selector );

			// Remove the space before pseudo selectors like :hove :before and etc.
			$selector = str_replace( $unique_prefix . ' :', $unique_prefix . ':', $selector );
		}

		return $selectors;
	}

	/**
	 * @param $post_css Post_CSS_File
	 * @param $element  Element_Base
	 */
	public function add_post_css( $post_css, $element ) {
		$element_settings = $element->get_settings();

		if ( empty( $element_settings['custom_css'] ) ) {
			return;
		}

		$unique_selector = $post_css->get_element_unique_selector( $element );

		preg_match_all( '/([^{]*)\s*\{\s*([^}]*)\s*}/i', $element_settings['custom_css'], $matches );

		$stylesheet = $post_css->get_stylesheet();

		foreach ( $matches[1] as $index => $selector ) {
			$rules = $matches[2][ $index ];

			$selectors = $this->make_unique_selectors( explode( ',', $selector ), $unique_selector );

			$stylesheet->add_rules( implode( ',', $selectors ), $rules );
		}
	}

	/**
	 * Load template css
	 *
	 * @since 1.0.0
	 * @access public
	 */
	protected function get_css() {

		$css_file = new Post_CSS( $this->get_instance_value( 'template_id' ) );

		ob_start();

		$css_file->enqueue();

		if ( ! empty( $css_file ) ) {
			$css_file->print_css();
		}

		$content = ob_get_clean();

		return $content;
	}

	protected function add_actions() {
		add_action( 'qazana/element/after_section_end', [ $this, 'register_controls' ], 10, 3 );
		add_action( 'qazana/element/parse_css', [ $this, 'add_post_css' ], 10, 2 );
	}
}
