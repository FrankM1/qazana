<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Group_Control_Animations extends Group_Control_Base {

    /**
	 * Fields.
	 *
	 * Holds all the animation control fields.
	 *
	 * @since 1.2.2
	 * @access protected
	 * @static
	 *
	 * @var array animation control fields.
	 */
    protected static $fields;

    /**
	 * Get animation control type.
	 *
	 * Retrieve the control type, in this case `animation`.
	 *
	 * @since 1.0.0
	 * @access public
	 * @static
	 *
	 * @return string Control type.
	 */
	public static function get_type() {
		return 'animations';
    }

	/**
	 * Init fields.
	 *
	 * Initialize animation control fields.
	 *
	 * @since 1.2.2
	 * @access public
	 *
	 * @return array Control fields.
	 */
    protected function init_fields() {
        $fields = [];
        $args = $this->get_args();

        $fields['enable'] = [
            'label'        => __( 'Enable animations', 'qazana' ),
            'type'         => Controls_Manager::SWITCHER,
            'frontend_available' => true,
            'return_value' => 'true',
        ];

        $fields['target'] = [
            'label' => __( 'Target', 'qazana' ),
            'type' => Controls_Manager::SELECT2,
            'default' => 'this',
            'options' => [
                'this' => __( 'This Element', 'qazana' ),
                'all-children' => __( 'Inner Children', 'qazana' ),
            ],
            'condition' => [
                'enable!' => '',
            ],
        ];

        $animation_types = [
            'inView' => __( 'In View', 'qazana' ),
            'exit' => __( 'Exit', 'qazana' ),
            'hover' => __( 'Hover', 'qazana' ),
            'svg' => __( 'SVG Paths', 'qazana' ),
        ];

        $fields['trigger'] = [
            'label' => __( 'Animation', 'qazana' ),
            'frontend_available' => true,
            'type' => Controls_Manager::SELECT2,
            'multiple' => true,
            'default' => [ 'inView' ],
            'options' => $animation_types,
            'condition' => [
                'enable!' => '',
            ],
        ];

        $options = [];

        foreach ( $animation_types as $type => $label ) {

            $fields[ $type . '_heading' ] = [
                'label' => $label,
                'type' => Controls_Manager::HEADING,
                'separator' => 'before',
                'condition' => [
                    'trigger' => $type,
                    'enable!' => '',
                ],
            ];

            $fields[$type . '_type'] = [
                'label' => __( 'Type', 'qazana' ),
                'type' => Controls_Manager::ANIMATION_IN,
                'condition' => [
                    'trigger' => $type,
                    'enable!' => '',
                ],
            ];

            $fields[$type . '_start_delay'] = [
                'label' => __( 'Start Delay', 'qazana' ),
                'type' => Controls_Manager::NUMBER,
                'default' => 0,
                'condition' => [
                    'trigger' => $type,
                    'enable!' => '',
                ],
            ];

            $fields[$type . '_delay'] = [
                'label' => __( 'Delay', 'qazana' ),
                'type' => Controls_Manager::NUMBER,
                'default' => 100,
                'condition' => [
                    'trigger' => $type,
                    'enable!' => '',
                ],
            ];

            $fields[$type . '_duration'] = [
                'label' => __( 'Duration', 'qazana' ),
                'type' => Controls_Manager::NUMBER,
                'default' => 1000,
                'condition' => [
                    'trigger' => $type,
                    'enable!' => '',
                ],
            ];
        }

		return $fields;
    }

	/**
	 * Get default options.
	 *
	 * Retrieve the default options of the animation control. Used to return the
	 * default options while initializing the animation control.
	 *
	 * @since 1.9.0
	 * @access protected
	 *
	 * @return array Default animation control options.
	 */
    protected function get_default_options() {
		return [
			'popover' => false,
		];
	}
}
