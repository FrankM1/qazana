<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Group_Control_Border extends Group_Base_Control {

	protected static $fields;

	public static function get_type() {
		return 'border';
	}

	protected function init_fields() {
		$fields = [];

		$fields['border'] = [
			'label' => _x( 'Border Type', 'Border Control', 'qazana' ),
			'type' => Controls_Manager::SELECT,
			'options' => [
				'' => __( 'None', 'qazana' ),
				'solid' => _x( 'Solid', 'Border Control', 'qazana' ),
				'double' => _x( 'Double', 'Border Control', 'qazana' ),
				'dotted' => _x( 'Dotted', 'Border Control', 'qazana' ),
				'dashed' => _x( 'Dashed', 'Border Control', 'qazana' ),
			],
			'selectors' => [
				'{{SELECTOR}}' => 'border-style: {{VALUE}};',
			],
			'separator' => 'before',
		];

		$fields['width'] = [
			'label' => _x( 'Width', 'Border Control', 'qazana' ),
			'type' => Controls_Manager::DIMENSIONS,
			'selectors' => [
				'{{SELECTOR}}' => 'border-width: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
			],
			'condition' => [
				'border!' => '',
			],
		];

		$fields['color'] = [
			'label' => _x( 'Color', 'Border Control', 'qazana' ),
			'type' => Controls_Manager::COLOR,
			'default' => '',
			'selectors' => [
				'{{SELECTOR}}' => 'border-color: {{VALUE}};',
			],
			'condition' => [
				'border!' => '',
			],
		];

		return $fields;
	}
}
