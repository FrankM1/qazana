<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Tooltip extends Widget_Base {

	public function get_name() {
		return 'tooltip';
	}

	public function get_title() {
		return __( 'Tooltip', 'qazana' );
	}

	public function get_icon() {
		return 'eicon-tooltip';
	}

	public function get_categories() {
		return [ 'general-elements' ];
	}

	protected function _register_controls() {

		$this->start_controls_section(
			'section_tooltip',
			[
				'label' => __( 'tooltip', 'qazana' ),
			]
		);

		$this->add_control(
			'tooltip_editor',
			[
				'label' => __( 'Text', 'qazana' ),
				'type' => Controls_Manager::TEXTAREA,
				'default' => __( 'I am a tooltip element. Click the edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'qazana' ),
			]
		);

		$this->add_control(
			'tooltip_position',
			[
				'label' => __( 'Tooltip position', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'east',
				'options' => [
					'east' 			=> __( 'East', 'qazana' ),
					'west'      	=> __( 'West', 'qazana' ),
					'north'       	=> __( 'North', 'qazana' ),
					'north-east' 	=> __( 'North east', 'qazana' ),
					'north-west' 	=> __( 'North west', 'qazana' ),
					'south'       	=> __( 'South', 'qazana' ),
					'south-east' 	=> __( 'South east', 'qazana' ),
					'south-west' 	=> __( 'South west', 'qazana' ),
				],
			]
		);

		$this->add_control(
			'tooltip_accent',
			[
				'label' => __( 'Tooltip Accent', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => '',
				'options' => [
					'red'      	=> __( 'Red', 'qazana' ),
					'green' 	=> __( 'Green', 'qazana' ),
				],
			]
		);

		$this->add_responsive_control(
			'tooltip_icon_size',
			[
				'label' => __( 'Icon Size', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => 20
				],
                'range' => [
					'px' => [
						'max' => 50,
					],
				],
				'condition' => [
					'link_icon!' => '',
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-tooltip-icon svg' => 'font-size: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_tooltip_style',
			[
				'label' => __( 'Style', 'qazana' ),
			]
		);

		$this->end_controls_section();

	}

	protected function render() {

		$settings = $this->get_settings();

		$this->add_render_attribute( 'tooltip-wrapper', 'class', 'qazana-tooltip');
		$this->add_render_attribute( 'tooltip-icon', 'class', 'qazana-tooltip-icon' );

		?><div <?php echo $this->get_render_attribute_string( 'tooltip-wrapper' ); ?>>
			<div <?php echo $this->get_render_attribute_string( 'tooltip-icon' ); ?>>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="-255 347 100 100" width="14" height="14" class="svg-replaced" shape-rendering="geometricPrecision">
					<path d="M-204.8 370.3c-8 0-14.6 6.5-14.6 14.6 0 2.1 1.7 3.7 3.7 3.7s3.7-1.7 3.7-3.7c0-3.9 3.2-7.1 7.1-7.1 4.1 0 7.1 2.9 7.1 6.8v.3c0 2.2-.6 7.4-7.7 8.5-1.8.3-3.2 1.8-3.2 3.7v10.1c0 2.1 1.7 3.7 3.7 3.7s3.7-1.7 3.7-3.7v-7.1c9.4-2.9 10.9-11 10.9-15.5.2-8-6.4-14.3-14.4-14.3zM-204.8 415.4c-2.7 0-4.8 2.2-4.8 4.8s2.2 4.8 4.8 4.8c2.6 0 4.8-2.2 4.8-4.8s-2.2-4.8-4.8-4.8z"></path>
					<path d="M-204.8 348.4c-26.9 0-48.8 21.9-48.8 48.8s21.9 48.8 48.8 48.8 48.8-21.9 48.8-48.8-21.9-48.8-48.8-48.8zm0 90.2c-22.8 0-41.4-18.6-41.4-41.4 0-22.8 18.6-41.4 41.4-41.4s41.4 18.6 41.4 41.4c-.1 22.8-18.6 41.4-41.4 41.4z"></path>
				</svg>
				<div class="qazana-tooltip__content v--<?php echo $this->get_settings('tooltip_position'); ?> v--border-<?php echo $this->get_settings('tooltip_accent'); ?>"><?php echo $this->parse_text_editor( $settings['tooltip_editor'] ); ?></div>
			</div>
		</div><?php

	}

	protected function _content_template() {
		?>
		<a class="qazana-tooltip" href="#">
			<span class="qazana-tooltip-icon">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="-255 347 100 100" width="14" height="14" class="svg-replaced" shape-rendering="geometricPrecision">
					<path d="M-204.8 370.3c-8 0-14.6 6.5-14.6 14.6 0 2.1 1.7 3.7 3.7 3.7s3.7-1.7 3.7-3.7c0-3.9 3.2-7.1 7.1-7.1 4.1 0 7.1 2.9 7.1 6.8v.3c0 2.2-.6 7.4-7.7 8.5-1.8.3-3.2 1.8-3.2 3.7v10.1c0 2.1 1.7 3.7 3.7 3.7s3.7-1.7 3.7-3.7v-7.1c9.4-2.9 10.9-11 10.9-15.5.2-8-6.4-14.3-14.4-14.3zM-204.8 415.4c-2.7 0-4.8 2.2-4.8 4.8s2.2 4.8 4.8 4.8c2.6 0 4.8-2.2 4.8-4.8s-2.2-4.8-4.8-4.8z"></path>
					<path d="M-204.8 348.4c-26.9 0-48.8 21.9-48.8 48.8s21.9 48.8 48.8 48.8 48.8-21.9 48.8-48.8-21.9-48.8-48.8-48.8zm0 90.2c-22.8 0-41.4-18.6-41.4-41.4 0-22.8 18.6-41.4 41.4-41.4s41.4 18.6 41.4 41.4c-.1 22.8-18.6 41.4-41.4 41.4z"></path>
				</svg>
			</span>
			<div class="qazana-tooltip__content v--east">{{ settings.tooltip_editor }}</div>
		</a>
		<?php
	}
}
