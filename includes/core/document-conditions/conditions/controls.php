<?php
namespace Qazana\Core\DocumentConditions\Conditions;

use Qazana\Controls_Stack;
use Qazana\Controls_Manager;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Controls extends Controls_Stack {

	public function get_name() {
		return 'conditions';
	}

	protected function _register_controls() {
		parent::_register_controls();

		$this->add_control(
			'conditions',
			[
				'section' => 'settings',
                'type' => 'conditions_repeater',
                'features' => [],
                'is_repeater' => true,
			    'render_type' => 'none',
                'fields' => [
                    [
                        'name' => 'type',
                        'type' => Controls_Manager::SELECT,
                        'default' => 'include',
                        'options' => [
                            'include' => __( 'Include', 'qazana' ),
                            'exclude' => __( 'Exclude', 'qazana' ),
                        ],
                    ],
                    [
                        'name' => 'name',
                        'type' => Controls_Manager::SELECT,
                        'default' => 'general',
                        'groups' => [
                            [
                                'label' => __( 'General', 'qazana' ),
                                'options' => [],
                            ],
                        ],
                    ],
                    [
                        'name' => 'sub_name',
                        'type' => Controls_Manager::SELECT,
                        'options' => [
                            '' => __( 'All', 'qazana' ),
                        ],
                        'conditions' => [
                            'terms' => [
                                [
                                    'name' => 'name',
                                    'operator' => '!==',
                                    'value' => '',
                                ],
                            ],
                        ],
                    ],
                    [
                        'name' => 'sub_id',
                        'type' => Controls_Manager::SELECT,
                        'options' => [
                            '' => __( 'All', 'qazana' ),
                        ],
                        'conditions' => [
                            'terms' => [
                                [
                                    'name' => 'sub_name',
                                    'operator' => '!==',
                                    'value' => '',
                                ],
                            ],
                        ],
                    ],
                ],
            ]
        );
	}
}
