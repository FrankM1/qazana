<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Text_Editor extends Widget_Base {

	public function get_name() {
		return 'text-editor';
	}

	public function get_title() {
		return __( 'Text Editor', 'qazana' );
	}

	public function get_icon() {
		return 'eicon-align-left';
	}

	protected function _register_controls() {
		$this->start_controls_section(
			'section_editor',
			[
				'label' => __( 'Text Editor', 'qazana' ),
			]
		);

		$this->add_control(
			'editor',
			[
				'label' => '',
				'type' => Controls_Manager::WYSIWYG,
				'default' => __( 'I am a text block. Click the edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.', 'qazana' ),
			]
		);

		$this->add_control(
			'drop_cap',[
				'label' => __( 'Drop Cap', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'label_off' => __( 'Off', 'qazana' ),
				'label_on' => __( 'On', 'qazana' ),
				'prefix_class' => 'qazana-drop-cap-',
				'frontend_available' => true,
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_style',
			[
				'label' => __( 'Text Editor', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_responsive_control(
			'max_width',
			[
				'label' => _x( 'Max width', 'Size Control', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'size_units' => [ 'px', 'em', 'rem' ],
				'range' => [
					'px' => [
						'min' => 10,
						'max' => 2000,
					],
				],
				'responsive' => true,
				'selectors' => [
					'{{WRAPPER}} .qazana-wrapper' => 'max-width: {{SIZE}}{{UNIT}};',
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
					'justify' => [
						'title' => __( 'Justified', 'qazana' ),
						'icon' => 'fa fa-align-justify',
					],
				],
				'prefix_class' => 'qazana-align-',
				'render_type' => 'template',
			]
		);

		$this->add_control(
			'text_color',
			[
				'label' => __( 'Text Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'selectors' => [
					'{{WRAPPER}}, {{WRAPPER}} .qazana-wrapper p' => 'color: {{VALUE}};',
				],
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_3,
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'typography',
				'scheme' => Scheme_Typography::TYPOGRAPHY_3,
				'selector' => '{{WRAPPER}}, {{WRAPPER}} .qazana-wrapper p'
			]
		);

		$this->add_responsive_control(
            'bottom_space',
            [
                'label' => __( 'Bottom Spacing', 'qazana' ),
                'type' => Controls_Manager::SLIDER,
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 100,
                    ],
                ],
                'selectors' => [
                    '{{WRAPPER}} .qazana-wrapper p' => 'margin-bottom: {{SIZE}}{{UNIT}};',
                ],
            ]
        );

		$this->end_controls_section();

		$this->start_controls_section(
			'section_drop_cap',
			[
				'label' => __( 'Drop Cap', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
				'condition' => [
					'drop_cap' => 'yes',
				],
			]
		);

		$this->add_control(
			'drop_cap_view',
			[
				'label' => __( 'View', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'default' => __( 'Default', 'qazana' ),
					'stacked' => __( 'Stacked', 'qazana' ),
					'framed' => __( 'Framed', 'qazana' ),
				],
				'default' => 'default',
				'prefix_class' => 'qazana-drop-cap-view-',
				'condition' => [
					'drop_cap' => 'yes',
				],
			]
		);

		$this->add_control(
			'drop_cap_primary_color',
			[
				'label' => __( 'Primary Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}}.qazana-drop-cap-view-stacked .qazana-drop-cap' => 'background-color: {{VALUE}};',
					'{{WRAPPER}}.qazana-drop-cap-view-framed .qazana-drop-cap, {{WRAPPER}}.qazana-drop-cap-view-default .qazana-drop-cap' => 'color: {{VALUE}}; border-color: {{VALUE}};',
				],
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_1,
				],
				'condition' => [
					'drop_cap' => 'yes',
				],
			]
		);

		$this->add_control(
			'drop_cap_secondary_color',
			[
				'label' => __( 'Secondary Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}}.qazana-drop-cap-view-framed .qazana-drop-cap' => 'background-color: {{VALUE}};',
					'{{WRAPPER}}.qazana-drop-cap-view-stacked .qazana-drop-cap' => 'color: {{VALUE}};',
				],
				'condition' => [
					'drop_cap_view!' => 'default',
				],
			]
		);

		$this->add_control(
			'drop_cap_size',
			[
				'label' => __( 'Size', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => 5,
				],
				'range' => [
					'px' => [
						'max' => 30,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-drop-cap' => 'padding: {{SIZE}}{{UNIT}};',
				],
				'condition' => [
					'drop_cap_view!' => 'default',
				],
			]
		);

		$this->add_control(
			'drop_cap_space',
			[
				'label' => __( 'Space', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => 10,
				],
				'range' => [
					'px' => [
						'max' => 50,
					],
				],
				'selectors' => [
					'body:not(.rtl) {{WRAPPER}} .qazana-drop-cap' => 'margin-right: {{SIZE}}{{UNIT}};',
					'body.rtl {{WRAPPER}} .qazana-drop-cap' => 'margin-left: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'drop_cap_border_radius',
			[
				'label' => __( 'Border Radius', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'size_units' => [ '%', 'px' ],
				'default' => [
					'unit' => '%',
				],
				'range' => [
					'%' => [
						'max' => 50,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-drop-cap' => 'border-radius: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'drop_cap_border_width',[
				'label' => __( 'Border Width', 'qazana' ),
				'type' => Controls_Manager::DIMENSIONS,
				'selectors' => [
					'{{WRAPPER}} .qazana-drop-cap' => 'border-width: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
				'condition' => [
					'drop_cap_view' => 'framed',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'drop_cap_typography',
				'selector' => '{{WRAPPER}} .qazana-drop-cap-letter',
				'exclude' => [
					'letter_spacing',
				],
				'condition' => [
					'drop_cap' => 'yes',
				],
			]
		);

		$this->end_controls_section();
	}

	protected function render() {

        $settings = $this->get_settings();

        $this->add_render_attribute( 'text-editor', 'class', 'qazana-text-editor qazana-clearfix' );

		if ( ! empty( $this->get_responsive_settings('align') ) ) {
			$this->add_render_attribute( 'text-editor', 'class', 'qazana-align-' . $this->get_responsive_settings('align') );
		}

		?><div <?php echo $this->get_render_attribute_string( 'text-editor' ); ?>>
			<div class="qazana-wrapper"><?php echo $this->parse_text_editor( $settings['editor'] ); ?></div>
		</div><?php

	}

	public function render_plain_content() {
		// In plain mode, render without shortcode
		echo $this->get_settings( 'editor' );
	}

	protected function _content_template() {

		?>
		<div class="qazana-text-editor qazana-clearfix qazana-align-{{ settings.align }}">
			<div class="qazana-wrapper">{{{ settings.editor }}}</div>
		</div>
		<?php

	}
}
