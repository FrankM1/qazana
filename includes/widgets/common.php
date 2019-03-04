<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Qazana common widget.
 *
 * Qazana base widget that gives you all the advanced options of the basic
 * widget.
 *
 * @since 1.0.0
 */
class Widget_Common extends Widget_Base {

	/**
	 * Get widget name.
	 *
	 * Retrieve common widget name.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget name.
	 */
	public function get_name() {
		return 'common';
	}

	/**
	 * Show in panel.
	 *
	 * Whether to show the common widget in the panel or not.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return bool Whether to show the widget in the panel.
	 */
	public function show_in_panel() {
		return false;
	}

	/**
	 * Register common widget controls.
	 *
	 * Adds different input fields to allow the user to change and customize the widget settings.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	protected function _register_controls() {
		$this->start_controls_section(
			'_section_style',
			[
				'label' => __( 'Advanced', 'qazana' ),
				'tab' => Controls_Manager::TAB_ADVANCED,
			]
		);

		$this->add_control(
			'_title',
			[
				'label' => __( 'Title', 'qazana' ),
				'type' => Controls_Manager::HIDDEN,
				'render_type' => 'none',
			]
		);

		$this->add_responsive_control(
			'_margin',
			[
				'label' => __( 'Margin', 'qazana' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'selectors' => [
					'{{WRAPPER}} > .qazana-widget-container' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
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
					'{{WRAPPER}} > .qazana-widget-container' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
        );

		$this->add_control(
			'_element_id',
			[
				'label' => __( 'CSS ID', 'qazana' ),
				'type' => Controls_Manager::TEXT,
				'title' => __( 'Add your custom id WITHOUT the Pound key. e.g: my-id', 'qazana' ),
				'style_transfer' => false,
			]
		);

		$this->add_control(
			'_css_classes',
			[
				'label' => __( 'CSS Classes', 'qazana' ),
				'type' => Controls_Manager::TEXT,
				'title' => __( 'Add your custom class WITHOUT the dot. e.g: my-class', 'qazana' ),
			]
		);

		$this->end_controls_section();

        $this->start_controls_section(
			'_section_effects',
			[
				'label' => __( 'Effects', 'qazana' ),
				'tab' => Controls_Manager::TAB_ADVANCED,
			]
        );

		$this->add_group_control(
			Group_Control_Animations::get_type(),
			[
				'name' => '_animation',
			]
		);

        $this->end_controls_section();

		$this->start_controls_section(
			'_section_background',
			[
				'label' => __( 'Background', 'qazana' ),
				'tab' => Controls_Manager::TAB_ADVANCED,
			]
		);

		$this->start_controls_tabs( '_tabs_background' );

		$this->start_controls_tab(
			'_tab_background_normal',
			[
				'label' => __( 'Normal', 'qazana' ),
			]
		);

		$this->add_group_control(
			Group_Control_Background::get_type(),
			[
				'name' => '_background',
				'selector' => '{{WRAPPER}} > .qazana-widget-container',
			]
		);

		$this->end_controls_tab();

		$this->start_controls_tab(
			'_tab_background_hover',
			[
				'label' => __( 'Hover', 'qazana' ),
			]
		);

		$this->add_group_control(
			Group_Control_Background::get_type(),
			[
				'name' => '_background_hover',
				'selector' => '{{WRAPPER}}:hover .qazana-widget-container',
			]
		);

		$this->add_control(
			'_background_hover_transition',
			[
				'label' => __( 'Transition Duration', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => 0.3,
				],
				'range' => [
					'px' => [
						'max' => 3,
						'step' => 0.1,
					],
				],
				'render_type' => 'ui',
				'separator' => 'before',
			]
		);

		$this->end_controls_tab();

		$this->end_controls_tabs();

		$this->end_controls_section();

		$this->start_controls_section(
			'_section_border',
			[
				'label' => __( 'Border', 'qazana' ),
				'tab' => Controls_Manager::TAB_ADVANCED,
			]
		);

		$this->start_controls_tabs( '_tabs_border' );

		$this->start_controls_tab(
			'_tab_border_normal',
			[
				'label' => __( 'Normal', 'qazana' ),
			]
		);

		$this->add_group_control(
			Group_Control_Border::get_type(),
			[
				'name' => '_border',
				'selector' => '{{WRAPPER}} > .qazana-widget-container',
			]
		);

		$this->add_control(
			'_border_radius',
			[
				'label' => __( 'Border Radius', 'qazana' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'selectors' => [
					'{{WRAPPER}} > .qazana-widget-container' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Box_Shadow::get_type(),
			[
				'name' => '_box_shadow',
				'selector' => '{{WRAPPER}} > .qazana-widget-container',
			]
		);

		$this->end_controls_tab();

		$this->start_controls_tab(
			'_tab_border_hover',
			[
				'label' => __( 'Hover', 'qazana' ),
			]
		);

		$this->add_group_control(
			Group_Control_Border::get_type(),
			[
				'name' => '_border_hover',
				'selector' => '{{WRAPPER}}:hover .qazana-widget-container',
			]
		);

		$this->add_control(
			'_border_radius_hover',
			[
				'label' => __( 'Border Radius', 'qazana' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'selectors' => [
					'{{WRAPPER}}:hover > .qazana-widget-container' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Box_Shadow::get_type(),
			[
				'name' => '_box_shadow_hover',
				'selector' => '{{WRAPPER}}:hover .qazana-widget-container',
			]
		);

		$this->add_control(
			'_border_hover_transition',
			[
				'label' => __( 'Transition Duration', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'separator' => 'before',
				'default' => [
					'size' => 0.3,
				],
				'range' => [
					'px' => [
						'max' => 3,
						'step' => 0.1,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-widget-container' => 'transition: background {{_background_hover_transition.SIZE}}s, border {{SIZE}}s, border-radius {{SIZE}}s, box-shadow {{SIZE}}s',
				],
			]
		);

		$this->end_controls_tab();

		$this->end_controls_tabs();

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
				'content_classes' => 'qazana-descriptor',
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

	}
}
