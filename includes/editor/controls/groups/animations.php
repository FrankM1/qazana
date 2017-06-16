<?php
namespace Builder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Group_Control_Animations extends Group_Base_Control {

    protected static $fields;

	public static function get_type() {
		return 'animations';
	}

    protected function init_fields() {
		$fields = [];

        $fields['in'] = [
        	'label' => __( 'Entrance Animation', 'builder' ),
        	'type' => Controls_Manager::ANIMATION_IN,
        	'default' => '',
        	'label_block' => true,
        ];

        /*$fields['out'] = [
        	'label' => __( 'Exit Animation', 'builder' ),
        	'type' => Controls_Manager::ANIMATION_OUT,
        	'default' => '',
        	'label_block' => true,
        ];*/

        $fields['duration'] = [
        	'label' => __( 'Animation Duration', 'builder' ),
        	'type' => Controls_Manager::SELECT,
        	'default' => '',
        	'options' => [
        		'slow' => __( 'Slow', 'builder' ),
        		'' => __( 'Normal', 'builder' ),
        		'fast' => __( 'Fast', 'builder' ),
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
                'label' => _x( 'Animated', 'Typography Control', 'builder' ),
                'type' => Controls_Manager::SWITCHER,
                'default' => '',
                'label_on' => __( 'On', 'builder' ),
                'label_off' => __( 'Off', 'builder' ),
                'return_value' => 'animated',
            ],
        ];

        $fields = $animation_control + $fields;

        return parent::prepare_fields( $fields );
    }
}
