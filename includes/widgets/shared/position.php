<?php
namespace Qazana;

class Shared_Position_Controls {

    public function __construct() {
        add_action( 'qazana/element/after_section_end', [ $this, 'register_controls' ], 1, 3 );
        add_action( 'qazana/element/after_section_end', [ $this, 'columns_register_controls' ], 1, 3 );
    }

     /**
      * Column Position controls
      */
    function columns_register_controls( Controls_Stack $element, $section_id, $args ) {

        $required_section_id = '';

        if ( $element instanceof Element_Column ) {
			$required_section_id = 'section_advanced';
		}

		if ( $required_section_id !== $section_id ) {
			return;
		}

        $element->start_injection(
			[
				'of' => 'layout',
			]
		);

        $element->add_control(
            '_inline_element',
            [
                'label' => __( 'Show Widgets Inline', 'qazana' ),
                'type' => Controls_Manager::SWITCHER,
                'prefix_class' => 'qazana-',
                'label_on' => 'On',
                'label_off' => 'Off',
                'style_transfer' => false,
                'return_value' => 'widgets-inline',
            ]
        );

        $element->add_control(
            '_inline_element_align',
            [
                'label' => __( 'Align Widgets', 'qazana' ),
                'type' => Controls_Manager::CHOOSE,
				'options' => [
					'left' => [
						'title' => __( 'Left', 'qazana' ),
						'icon'  => 'eicon-h-align-left',
					],
					'center' => [
						'title' => __( 'Center', 'qazana' ),
						'icon'  => 'eicon-h-align-center',
					],
					'right' => [
						'title' => __( 'Right', 'qazana' ),
						'icon'  => 'eicon-h-align-right',
					],
					'justify' => [
						'title' => __( 'Even Distribution', 'qazana' ),
						'icon' => 'eicon-h-align-stretch',
					],
				],
                'selectors_dictionary' => [
                    'left' => 'flex-start',
                    'justify' => 'space-evenly',
                    'right' => 'flex-end',
                ],
                'selectors' => [
                    '{{WRAPPER}}.qazana-widgets-inline > .qazana-column-wrap > .qazana-widget-wrap' => 'justify-content: {{VALUE}}',
                ],
                'condition' => [
                    '_inline_element!' => ''
                ]
            ]
        );

		$element->end_injection();
    }

    /**
     * Position controls
     */
    function register_controls( Controls_Stack $element, $section_id, $args ) {

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
            '_section_element_position',
            [
                'label' => esc_html__( 'Position', 'qazana' ),
                'tab'   => Controls_Manager::TAB_ADVANCED,
            ]
        );

        $element->add_responsive_control(
            '_element_position',
            [
                'type'    => Controls_Manager::SELECT,
                'label'   => esc_html__( 'Position', 'qazana' ),
                'default' => '',
                'options' => [
                    ''         => esc_html__( 'Default', 'qazana' ),
                    'static'   => esc_html__( 'Static', 'qazana' ),
                    'relative' => esc_html__( 'Relative', 'qazana' ),
                    'absolute' => esc_html__( 'Absolute', 'qazana' ),
                    'fixed'    => esc_html__( 'Fixed', 'qazana' ),
                ],
                'selectors' => [ // You can use the selected value in an auto-generated css rule.
                    '{{WRAPPER}}' => 'position: {{VALUE}}',
                ],
                'style_transfer' => false,
            ]
        );

        $element->add_control(
            '_z_index',
            [
                'label' => __( 'Z Index', 'qazana' ),
                'type' => Controls_Manager::NUMBER,
                'min' => 0,
                'placeholder' => 0,
                'style_transfer' => false,
                'selectors' => [
                    '{{WRAPPER}}' => 'z-index: {{VALUE}};',
                ],
            ]
        );

        $element->add_responsive_control(
            '_element_left',
            [
                'label'   => esc_html__( 'Left', 'qazana' ),
                'type'    => Controls_Manager::SLIDER,
                'style_transfer' => false,
                'default' => [
                    'size' => 0,
                ],
                'range' => [
                    'px' => [
                        'min'  => -1000,
                        'step' => 1,
                    ],
                    '%' => [
                        'min' => -100,
                        'max' => 100,
                    ],
                ],
                'size_units' => [ 'px', '%' ],
                'selectors'  => [
                    '{{WRAPPER}}' => 'left: {{SIZE}}{{UNIT}} !important;',
                ],
                'condition' => [
                    '_element_position!' => array('','static'),
                ],
            ]
        );

        $element->add_responsive_control(
            '_element_top',
            [
                'label'   => esc_html__( 'Top', 'qazana' ),
                'type'    => Controls_Manager::SLIDER,
                'style_transfer' => false,
                'default' => [
                    'size' => 0,
                ],
                'range' => [
                    'px' => [
                        'min'  => -1000,
                        'step' => 1,
                        'max' => 10000,
                    ],
                    '%' => [
                        'min' => -100,
                        'max' => 100,
                    ],
                ],
                'size_units' => [ 'px', '%' ],
                'selectors'  => [
                    '{{WRAPPER}}' => 'top: {{SIZE}}{{UNIT}};',
                ],
                'condition' => [
                    '_element_position!' => array( '','static'),
                ],
            ]
        );

        $element->add_control(
            '_element_rotate',
            [
                'label'        => esc_html__( 'Rotate Item', 'qazana' ),
                'style_transfer' => false,
                'type'         => Controls_Manager::SWITCHER,
                'default'      => '',
                'label_on'     => esc_html__( 'On', 'qazana' ),
                'label_off'    => esc_html__( 'Off', 'qazana' ),
                'return_value' => 'yes',
            ]
        );

        $element->add_control(
            '_element_rotate_degrees',
            [
                'label'   => esc_html__( 'Rotate', 'qazana' ),
                'type'    => Controls_Manager::SLIDER,
                'default' => [
                    'size' => 0,
                ],
                'range' => [
                    'px' => [
                        'min' => -180,
                        'max' => 180,
                    ],
                ],
                'size_units' => [ 'px' ],
                'selectors'  => [
                    '{{WRAPPER}}' => 'transform: rotate({{SIZE}}deg);',
                ],
                'condition' => [
                    '_element_rotate' => 'yes',
                ],
                'style_transfer' => false,
            ]
        );

        $element->add_control(
            '_element_transform_origin',
            [
                'label'     => esc_html__( 'Transform Origin', 'qazana' ),
                'type'      => Controls_Manager::TEXT,
                'default'   => '50% 50%',
                'selectors' => [
                    '{{WRAPPER}}' => 'transform-origin: {{VALUE}};',
                ],
                'condition' => [
                    '_element_rotate' => 'yes',
                ],
                'style_transfer' => false,
            ]
        );

        $element->add_control(
            '_element_overflow',
            [
                'label'   => esc_html__( 'Overflow', 'qazana' ),
                'type'    => Controls_Manager::SELECT,
                'default' => '',
                'options' => [
                ''        => esc_html__( 'Default', 'qazana' ),
                'hidden'  => esc_html__( 'Hidden', 'qazana' ),
                'visible' => esc_html__( 'Visible', 'qazana' ),
                ],
                'selectors' => [
                    '{{WRAPPER}}' => 'overflow: {{VALUE}};',
                    '.qazana-editor-active {{WRAPPER}} ' => 'overflow: visible;',
                ],
                'style_transfer' => false,
            ]
        );

        $element->end_controls_section();
    }
}
