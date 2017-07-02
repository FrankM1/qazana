<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Common extends Widget_Base {

	public function get_name() {
		return 'common';
	}

	public function show_in_panel() {
		return false;
	}

	protected function _register_controls() {
		$this->start_controls_section(
			'_section_style',
			[
				'label' => __( 'Element Style', 'qazana' ),
				'tab' => Controls_Manager::TAB_ADVANCED,
			]
		);

		$this->add_responsive_control(
			'_margin',
			[
				'label' => __( 'Margin', 'qazana' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'selectors' => [
					'{{WRAPPER}} .qazana-widget-container' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_responsive_control(
			'_padding',
			[
				'label' => __( 'Padding', 'qazana' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors' => [
					'{{WRAPPER}} .qazana-widget-container' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Animations::get_type(),
			[
				'name' => '_animation',
			]
		);

		$this->add_control(
			'_element_id',
			[
				'label' => __( 'CSS ID', 'qazana' ),
				'type' => Controls_Manager::TEXT,
				'default' => '',
				'label_block' => true,
				'title' => __( 'Add your custom id WITHOUT the Pound key. e.g: my-id', 'qazana' ),
			]
		);

		$this->add_control(
			'_css_classes',
			[
				'label' => __( 'CSS Classes', 'qazana' ),
				'type' => Controls_Manager::TEXT,
				'default' => '',
				'prefix_class' => '',
				'label_block' => true,
				'title' => __( 'Add your custom class WITHOUT the dot. e.g: my-class', 'qazana' ),
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'_section_background',
			[
				'label' => __( 'Background & Border', 'qazana' ),
				'tab' => Controls_Manager::TAB_ADVANCED,
			]
		);

		$this->add_group_control(
			Group_Control_Background::get_type(),
			[
				'name' => '_background',
				'selector' => '{{WRAPPER}} .qazana-widget-container',
			]
		);

		$this->add_group_control(
			Group_Control_Border::get_type(),
			[
				'name' => '_border',
				'selector' => '{{WRAPPER}} .qazana-widget-container',
			]
		);

		$this->add_control(
			'_border_radius',
			[
				'label' => __( 'Border Radius', 'qazana' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'selectors' => [
					'{{WRAPPER}} .qazana-widget-container' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}}; overflow: hidden;',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Box_Shadow::get_type(),
			[
				'name' => '_box_shadow',
				'selector' => '{{WRAPPER}} .qazana-widget-container',
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'_section_responsive',
			[
				'label' => __( 'Responsive', 'qazana' ),
				'tab' => Controls_Manager::TAB_ADVANCED,
			]
		);

		$this->add_control(
			'responsive_description',
			[
				'raw' => __( 'Attention: The display settings (show/hide for mobile, tablet or desktop) will only take effect once you are on the preview or live page, and not while you\'re in editing mode in Qazana.', 'qazana' ),
				'type' => Controls_Manager::RAW_HTML,
				'classes' => 'qazana-descriptor',
			]
		);

		$this->add_control(
			'hide_desktop',
			[
				'label' => __( 'Hide On Desktop', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'default' => '',
				'prefix_class' => 'qazana-',
				'label_on' => 'Hide',
				'label_off' => 'Show',
				'return_value' => 'hidden-desktop',
			]
		);

		$this->add_control(
			'hide_tablet',
			[
				'label' => __( 'Hide On Tablet', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'default' => '',
				'prefix_class' => 'qazana-',
				'label_on' => 'Hide',
				'label_off' => 'Show',
				'return_value' => 'hidden-tablet',
			]
		);

		$this->add_control(
			'hide_mobile',
			[
				'label' => __( 'Hide On Mobile', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'default' => '',
				'prefix_class' => 'qazana-',
				'label_on' => 'Hide',
				'label_off' => 'Show',
				'return_value' => 'hidden-phone',
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_common_hover',
			[
				'label' => __( 'Element Hover', 'qazana' ),
				'type' => Controls_Manager::SECTION,
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'_hover_animation',
			[
				'label' => __( 'Animation', 'qazana' ),
				'type' => Controls_Manager::HOVER_ANIMATION,
			]
		);

		$this->end_controls_section();
	}
}
