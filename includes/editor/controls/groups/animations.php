<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Group_Control_Animations extends Group_Base_Control {

    protected static $fields;

	public static function get_type() {
		return 'animations';
	}

    protected function init_fields() {
		$fields = [];

        $fields['in'] = [
        	'label' => __( 'Entrance Animation', 'qazana' ),
        	'type' => Controls_Manager::ANIMATION_IN,
        	'default' => 'fadeInUp',
        	'label_block' => true,
            'condition' => [
        		'animated!' => '',
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
        	'condition' => [
        		'in!' => '',
                'out!' => '',
        	],
        ];

		return $fields;
	}

    protected function prepare_fields( $fields ) {

        array_walk( $fields, function ( &$field, $field_name ) {
            $fields['condition'] = [
                'animated' => [ 'animated' ],
            ];
        } );

        $animation_control = [
            'animated' => [
                'label' => _x( 'Animated', 'Typography Control', 'qazana' ),
                'type' => Controls_Manager::SWITCHER,
                'default' => '',
                'label_on' => __( 'On', 'qazana' ),
                'label_off' => __( 'Off', 'qazana' ),
                'return_value' => 'animated',
            ],
        ];

        $fields = $animation_control + $fields;

        return parent::prepare_fields( $fields );
    }
}
