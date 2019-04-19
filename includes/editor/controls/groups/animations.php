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
        ];

        return $fields;

        $animation_types = [
            'inview' => __( 'In View', 'qazana' ),
            'exit' => __( 'Exit', 'qazana' ),
            'hover' => __( 'Hover', 'qazana' ),
        ];

        $fields['trigger'] = [
            'label' => __( 'Animation', 'qazana' ),
            'frontend_available' => true,
            'type' => Controls_Manager::SELECT2,
            'multiple' => true,
            'default' => [ 'inview', 'exit', 'hover' ],
            'options' => $animation_types,
        ];

        foreach ( $animation_types as $type => $label ) {

            $fields[ $type . '_heading' ] = [
                'label' => $label,
                'type' => Controls_Manager::HEADING,
                'separator' => 'before',
            ];

            switch ($type) {

                case 'inview':

                    $fields[ $type . '_in' ] = [
                        'label' => __( 'Entrance Animation', 'qazana' ),
                        'type'        => Controls_Manager::SELECT2,
                        'default' => 'fadeInUp',
                        'options' => [
                            [
                                'label' => 'Fade',
                                'options' => [
                                    'fadeIn' => 'Fade In',
                                    'fadeInDown' => 'Fade In Down',
                                    'fadeInLeft' => 'Fade In Left',
                                    'fadeInRight' => 'Fade In Right',
                                ]
                            ],
                            [
                                'label' => 'Reveal',
                                'options' => [
                                    'revealLeft' => 'revealLeft',
                                ],
                            ],
                            [
                                'label' => 'Move',
                                'options' => [
                                    'moveLeft' => 'Move Left',
                                ]
                            ]
                        ],
                        'label_block' => true,
                        'frontend_available' => true,
                        'render_type' => 'template',
                        'condition' => [
                            'trigger' => $type,
                        ],
                    ];
                    break;

                case 'exit':

                    $fields[ $type . '_out' ] = [
                        'label' => $label .' '. __( 'Animation', 'qazana' ),
                        'type' => Controls_Manager::ANIMATION_OUT,
                        'default' => 'fadeOutDown',
                        'label_block' => true,
                        'frontend_available' => true,
                        'render_type' => 'template',
                        'condition' => [
                            'trigger' => $type,
                        ],
                    ];
                    break;

                default:
                    $fields[ $type . '_hover' ] = [
                        'label' => $label .' '. __( 'Animation', 'qazana' ),
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
                        ],
                        'label_block' => true,
                        'frontend_available' => true,
                        'render_type' => 'template',
                        'condition' => [
                            'trigger' => $type,
                        ],
                    ];
                    break;
            }

            $fields[$type . '_delay'] = [
                'label' => __( 'Animation Delay', 'qazana' ),
                'type' => Controls_Manager::NUMBER,
                'default' => '',
                'frontend_available' => true,
                'condition' => [
                    'trigger' => $type,
                ],
            ];

            $fields[$type . '_duration'] = [
                'label' => __( 'Animation Duration', 'qazana' ),
                'type' => Controls_Manager::SELECT,
                'default' => '',
                'options' => [
                    'slow' => __( 'Slow', 'qazana' ),
                    '' => __( 'Normal', 'qazana' ),
                    'fast' => __( 'Fast', 'qazana' ),
                ],
                'frontend_available' => true,
                'condition' => [
                    'trigger' => $type,
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
