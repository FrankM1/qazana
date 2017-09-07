<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Divider extends Widget_Base {

	public function get_name() {
		return 'divider';
	}

	public function get_title() {
		return __( 'Divider', 'qazana' );
	}

	public function get_icon() {
		return 'eicon-divider';
	}

	protected function _register_controls() {
		$this->start_controls_section(
			'section_divider',
			[
				'label' => __( 'Divider', 'qazana' ),
			]
		);

		$this->add_control(
			'style',
			[
				'label' => __( 'Style', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'solid' => __( 'Solid', 'qazana' ),
					'double' => __( 'Double', 'qazana' ),
					'dotted' => __( 'Dotted', 'qazana' ),
					'dashed' => __( 'Dashed', 'qazana' ),
				],
				'default' => 'solid',
				'selectors' => [
					'{{WRAPPER}} .qazana-divider-separator' => 'border-top-style: {{VALUE}};',
				],
			]
		);

		$this->add_responsive_control(
			'vertical', [
				'label' => _x( 'Vertical.', 'Animation Control', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'default' => 'yes',
				'label_on' => __( 'On', 'qazana' ),
				'label_off' => __( 'Off', 'qazana' ),
				'prefix_class' => 'qazana-divider-vertical-',
			]
		);

		$this->add_control(
			'weight',
			[
				'label' => __( 'Weight', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => 1,
				],
				'range' => [
					'px' => [
						'min' => 1,
						'max' => 10,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-divider-separator' => 'border-top-width: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'color',
			[
				'label' => __( 'Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_3,
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-divider-separator' => 'border-top-color: {{VALUE}};',
				],
			]
		);

		$this->add_responsive_control(
			'width',
			[
				'label' => __( 'Length', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'size_units' => [ '%', 'px' ],
				'range' => [
					'px' => [
						'max' => 1000,
					],
				],
				'default' => [
					'size' => 100,
					'unit' => '%',
				],
				'tablet_default' => [
					'unit' => '%',
				],
				'mobile_default' => [
					'unit' => '%',
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-divider-separator' => 'width: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_responsive_control(
			'align',
			[
				'label' => __( 'Alignment', 'qazana' ),
				'type' => Controls_Manager::CHOOSE,
				'options' => [
					'left' => [
						'title' => __( 'Left', 'qazana' ),
						'icon' => 'fa fa-align-left',
					],
					'center' => [
						'title' => __( 'Center', 'qazana' ),
						'icon' => 'fa fa-align-center',
					],
					'right' => [
						'title' => __( 'Right', 'qazana' ),
						'icon' => 'fa fa-align-right',
					],
				],
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} .qazana-divider' => 'text-align: {{VALUE}};',
				],
			]
		);

		$this->add_responsive_control(
			'gap',
			[
				'label' => __( 'Gap', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => 15,
				],
				'range' => [
					'px' => [
						'min' => 2,
						'max' => 50,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-divider' => 'padding-top: {{SIZE}}{{UNIT}}; padding-bottom: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->end_controls_section();
	}

	protected function render() {
		?>
		<div class="qazana-divider">
			<span class="qazana-divider-separator"></span>
		</div>
		<?php
	}

	protected function _content_template() {
		?>
		<div class="qazana-divider">
			<span class="qazana-divider-separator"></span>
		</div>
		<?php
	}
}
