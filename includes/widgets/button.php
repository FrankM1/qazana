<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Button extends Widget_Base {

	public function get_name() {
		return 'button';
	}

	public function get_title() {
		return __( 'Button', 'qazana' );
	}

	public function get_icon() {
		return 'eicon-button';
	}

	public static function get_button_sizes() {
		return [
			'xs' => __( 'Extra Small', 'qazana' ),
			'sm' => __( 'Small', 'qazana' ),
			'md' => __( 'Medium', 'qazana' ),
			'lg' => __( 'Large', 'qazana' ),
			'xl' => __( 'Extra Large', 'qazana' ),
		];
	}

	protected function _register_controls() {
		$this->start_controls_section(
			'section_button',
			[
				'label' => __( 'Button', 'qazana' ),
			]
		);

		$this->add_control(
			'button_type',
			[
				'label' => __( 'Type', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => '',
				'options' => [
					'' => __( 'Default', 'qazana' ),
					'info' => __( 'Info', 'qazana' ),
					'success' => __( 'Success', 'qazana' ),
					'warning' => __( 'Warning', 'qazana' ),
					'danger' => __( 'Danger', 'qazana' ),
				],
				'prefix_class' => 'qazana-button-',
			]
		);

		$this->add_control(
            'button_weight',
            [
                'label' => __( 'Weight', 'qazana' ),
                'type' => Controls_Manager::SELECT,
                'default' => '',
                'options' => [
                    '' => __( 'Default', 'qazana' ),
                    'transparent' => __( 'Transparent', 'qazana' ),
                    'solid' => __( 'Solid', 'qazana' ),
                ],
            ]
        );

		$this->add_control(
			'text',
			[
				'label' => __( 'Text', 'qazana' ),
				'type' => Controls_Manager::TEXT,
				'default' => __( 'Click me', 'qazana' ),
				'placeholder' => __( 'Click me', 'qazana' ),
			]
		);

		$this->add_control(
			'link',
			[
				'label' => __( 'Link', 'qazana' ),
				'type' => Controls_Manager::URL,
				'placeholder' => 'http://your-link.com',
				'default' => [
					'url' => '#',
				],
			]
		);

		$this->add_responsive_control(
			'align',
			[
				'label' => __( 'Alignment', 'qazana' ),
				'type' => Controls_Manager::CHOOSE,
				'options' => [
					'left'    => [
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
				'prefix_class' => 'qazana%s-align-',
				'default' => '',
			]
		);

		$this->add_control(
			'size',
			[
				'label' => __( 'Size', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'sm',
				'options' => self::get_button_sizes(),
			]
		);

		$this->add_control(
			'icon',
			[
				'label' => __( 'Icon', 'qazana' ),
				'type' => Controls_Manager::ICON,
				'label_block' => true,
				'default' => '',
			]
		);

		$this->add_control(
			'icon_align',
			[
				'label' => __( 'Icon Position', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'left',
				'options' => [
					'left' => __( 'Before', 'qazana' ),
					'right' => __( 'After', 'qazana' ),
				],
				'condition' => [
					'icon!' => '',
				],
			]
		);

		$this->add_control(
			'icon_indent',
			[
				'label' => __( 'Icon Spacing', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'max' => 50,
					],
				],
				'condition' => [
					'icon!' => '',
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-button .qazana-align-icon-right' => 'margin-left: {{SIZE}}{{UNIT}};',
					'{{WRAPPER}} .qazana-button .qazana-align-icon-left' => 'margin-right: {{SIZE}}{{UNIT}};',
				],
			]
		);

        $this->add_control(
			'icon_size',
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
					'icon!' => '',
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-button-icon i' => 'font-size: {{SIZE}}{{UNIT}};',
				],
			]
		);

        $this->add_control(
            'view',
            [
                'label' => __( 'View', 'qazana' ),
                'type' => Controls_Manager::HIDDEN,
                'default' => 'traditional',
            ]
        );

		$this->end_controls_section();

		$this->start_controls_section(
			'section_style',
			[
				'label' => __( 'Button', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'button_text_color',
			[
				'label' => __( 'Text Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} .qazana-button' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'typography',
				'label' => __( 'Typography', 'qazana' ),
				'scheme' => Scheme_Typography::TYPOGRAPHY_4,
				'selector' => '{{WRAPPER}} .qazana-button',
			]
		);

		$this->add_control(
			'background_color',
			[
				'label' => __( 'Background Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_4,
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-button' => 'background-color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Border::get_type(),
			[
				'name' => 'border',
				'label' => __( 'Border', 'qazana' ),
				'placeholder' => '1px',
				'default' => '1px',
				'selector' => '{{WRAPPER}} .qazana-button',
			]
		);

		$this->add_control(
			'border_radius',
			[
				'label' => __( 'Border Radius', 'qazana' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'selectors' => [
					'{{WRAPPER}} .qazana-button' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'text_padding',
			[
				'label' => __( 'Text Padding', 'qazana' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors' => [
					'{{WRAPPER}} .qazana-button' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_hover',
			[
				'label' => __( 'Button Hover', 'qazana' ),
				'type' => Controls_Manager::SECTION,
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'hover_color',
			[
				'label' => __( 'Text Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .qazana-button:hover' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'button_background_hover_color',
			[
				'label' => __( 'Background Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .qazana-button:hover' => 'background-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'button_hover_border_color',
			[
				'label' => __( 'Border Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'condition' => [
					'border_border!' => '',
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-button:hover' => 'border-color: {{VALUE}};',
				],
			]
		);

        $this->end_controls_section();
    }

	protected function render() {
		$settings = $this->get_settings();

		$this->add_render_attribute( 'wrapper', 'class', 'qazana-button-wrapper' );

		if ( ! empty( $settings['link']['url'] ) ) {
			$this->add_render_attribute( 'button', 'href', $settings['link']['url'] );
			$this->add_render_attribute( 'button', 'class', 'qazana-button-link' );

			if ( ! empty( $settings['link']['is_external'] ) ) {
				$this->add_render_attribute( 'button', 'target', '_blank' );
			}
		}

		$this->add_render_attribute( 'button', 'class', 'qazana-button' );

		if ( ! empty( $settings['size'] ) ) {
			$this->add_render_attribute( 'button', 'class', 'qazana-size-' . $settings['size'] );
		}

        if ( ! empty( $settings['button_weight'] ) ) {
            $this->add_render_attribute( 'button', 'class', 'qazana-weight-' . $settings['button_weight'] );
        }

        if ( ! empty( $settings['button_type'] ) ) {
            $this->add_render_attribute( 'button', 'class', 'qazana-button-' . $settings['button_type'] );
        }

        $this->add_render_attribute( 'content-wrapper', 'class', 'qazana-button-content-wrapper' );
        $this->add_render_attribute( 'icon-align', 'class', 'qazana-align-icon-' . $settings['icon_align'] );
        $this->add_render_attribute( 'icon-align', 'class', 'qazana-button-icon' );

        ?><div <?php echo $this->get_render_attribute_string( 'wrapper' ); ?>>
            <a <?php echo $this->get_render_attribute_string( 'button' ); ?>>
                <span <?php echo $this->get_render_attribute_string( 'content-wrapper' ); ?>>
                    <?php if ( ! empty( $settings['icon'] ) ) : ?>
                        <span <?php echo $this->get_render_attribute_string( 'icon-align' ); ?>>
                            <i class="<?php echo esc_attr( $settings['icon'] ); ?>"></i>
                        </span>
                    <?php endif; ?>
                    <span class="qazana-button-text"><?php echo $settings['text']; ?></span>
                </span>
            </a>
        </div><?php

    }

    protected function _content_template() {
        ?>
        <div class="qazana-button-wrapper">
            <a class="qazana-button qazana-button-{{ settings.button_type }} qazana-weight-{{ settings.button_weight }} qazana-size-{{ settings.size }} qazana-hover-animation-{{ settings.hover_animation }}" href="{{ settings.link.url }}">
                <span class="qazana-button-content-wrapper">
                    <# if ( settings.icon ) { #>
                    <span class="qazana-button-icon qazana-align-icon-{{ settings.icon_align }}">
                        <i class="{{ settings.icon }}"></i>
                    </span>
                    <# } #>
                    <span class="qazana-button-text">{{{ settings.text }}}</span>
                </span>
            </a>
        </div>
        <?php
    }
}
