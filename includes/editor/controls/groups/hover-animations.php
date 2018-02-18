<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Group_Control_Hover_Animations extends Group_Control_Base {

    protected static $fields;

	public function __construct() {
		$this->add_actions();
	}

	public static function get_type() {
		return 'hover-animations';
	}

    protected function init_fields() {
		$fields = [];

        $fields['type'] = [
        	'label'       => __( 'Hover Animation', 'qazana' ),
        	'type'        => Controls_Manager::SELECT2,
        	'default'     => 'shadow-bottom',
        	'label_block' => true,
        	'options'     => [
				'none'                   => __( 'None', 'qazana'),
				'custom'                 => __( 'Custom', 'qazana'),
				'grow'                   => __( 'Grow', 'qazana'),
				'shadow-bottom'          => __( 'Shadow Bottom', 'qazana'),
				'no-shadow'              => __( 'Remove Shadow', 'qazana'),
				'shrink'                 => __( 'Shrink', 'qazana'),
				'pulse'                  => __( 'Pulse', 'qazana'),
				'pulse-grow'             => __( 'Pulse Grow', 'qazana'),
				'pulse-shrink'           => __( 'Pulse Shrink', 'qazana'),
				'push'                   => __( 'Push', 'qazana'),
				'pop'                    => __( 'Pop', 'qazana'),
				'bounce-in'              => __( 'Bounce In', 'qazana'),
				'bounce-out'             => __( 'Bounce Out', 'qazana'),
				'rotate'                 => __( 'Rotate', 'qazana'),
				'grow-rotate'            => __( 'Grow Rotate', 'qazana'),
				'float'                  => __( 'Float', 'qazana'),
				'sink'                   => __( 'Sink', 'qazana'),
				'bob'                    => __( 'Bob', 'qazana'),
				'hang'                   => __( 'Hang', 'qazana'),
				'skew'                   => __( 'Skew', 'qazana'),
				'skew-forward'           => __( 'Skew Forward', 'qazana'),
				'skew-backward'          => __( 'Skew Backward', 'qazana'),
				'wobble-vertical'        => __( 'Wobble Vertical', 'qazana'),
				'wobble-horizontal'      => __( 'Wobble Horizontal', 'qazana'),
				'wobble-to-bottom-right' => __( 'Wobble To Bottom Right', 'qazana'),
				'wobble-to-top-right'    => __( 'Wobble To Top Right', 'qazana'),
				'wobble-top'             => __( 'Wobble Top', 'qazana'),
				'wobble-bottom'          => __( 'Wobble Bottom', 'qazana'),
				'wobble-skew'            => __( 'Wobble Skew', 'qazana'),
				'buzz'                   => __( 'Buzz', 'qazana'),
				'buzz-out'               => __( 'Buzz Out', 'qazana'),
			]
		];

		$fields['hover_css'] = [
			'label'       => __( 'Add your own custom animation CSS here', 'qazana' ),
			'type'        => Controls_Manager::CODE,
			'label_block' => true,
			'language'    => 'css',
			'selectors'   => [
				'' => '',
			], // Hack to define it as a styleControl. @FIXME
			'condition' => [
				'type' => 'custom'
			]
		];

		$fields['hover_css_description'] = [
			'raw'       => __( 'Use "selector" to target wrapper element. Examples:<br>selector:hover {color: red;} // For main element<br>selector:hover .child-element {margin: 10px;} // For child element<br>.my-class {text-align: center;} // Or use any custom selector', 'qazana' ),
			'type'      => Controls_Manager::RAW_HTML,
			'classes'   => 'qazana-descriptor',
			'condition' => [
				'type' => 'custom'
			]
		];

		return $fields;
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
		$controls_prefix = $this->get_controls_prefix();

		if ( empty( $element_settings[$controls_prefix . 'hover_css'] ) ) {
			return;
		}

		$unique_selector = $post_css->get_element_unique_selector( $element );

		preg_match_all( '/([^{]*)\s*\{\s*([^}]*)\s*}/i', $element_settings[$controls_prefix . 'hover_css'], $matches );

		$stylesheet = $post_css->get_stylesheet();

		foreach ( $matches[1] as $index => $selector ) {
			$rules = $matches[2][ $index ];

			$selectors = $this->make_unique_selectors( explode( ',', $selector ), $unique_selector );

			$stylesheet->add_rules( implode( ',', $selectors ), $rules );
		}
	}

	protected function add_actions() {
		add_action( 'qazana/element/parse_css', [ $this, 'add_post_css' ], 10, 2 );
	}

}
