<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Group_Control_Animations extends Group_Control_Base {

    protected static $fields;

	public static function get_type() {
		return 'animations';
	}

    protected function init_fields() {
		$fields = [];

        $fields['animated'] = [
            'label' => _x( 'Animated', 'Typography Control', 'qazana' ),
            'type' => Controls_Manager::SWITCHER,
            'default' => '',
            'label_on' => __( 'On', 'qazana' ),
			'label_off' => __( 'Off', 'qazana' ),
			'frontend_available' => true,
			'return_value' => 'animated',
			'prefix_class' => 'qazana-element-',
			'render_type' => 'template'
        ];

        $fields['in'] = [
        	'label' => __( 'Entrance Animation', 'qazana' ),
        	'type' => Controls_Manager::ANIMATION_IN,
        	'default' => 'fadeInUp',
			'label_block' => true,
			'frontend_available' => true,
			'render_type' => 'template',
            'condition' => [
        		'animated' => 'animated',
        	],
		];

		$fields['delay'] = [
        	'label' => __( 'Animation Delay', 'qazana' ),
        	'type' => Controls_Manager::NUMBER,
        	'default' => '',
			'frontend_available' => true,
        	'condition' => [
                'animated' => 'animated',
        	],
        ];

        $fields['duration'] = [
        	'label' => __( 'Animation Duration', 'qazana' ),
        	'type' => Controls_Manager::SELECT,
        	'default' => '',
        	'options' => [
        		'slow' => __( 'Slow', 'qazana' ),
        		'' => __( 'Normal', 'qazana' ),
        		'fast' => __( 'Fast', 'qazana' ),
        	],
			'prefix_class' => 'animated-',
			'frontend_available' => true,
        	'condition' => [
                'animated' => 'animated',
        	],
        ];

		return $fields;
    }

    protected function get_default_options() {
		return [
			'popover' => [
				'starter_name' => 'animations',
				'starter_title' => _x( 'Animations', 'Animations Control', 'qazana' ),
			],
		];
	}

}
