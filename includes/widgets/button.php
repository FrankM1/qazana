<?php
namespace Builder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Button extends Widget_Base {

	public function get_name() {
		return 'button';
	}

	public function get_title() {
		return __( 'Button', 'builder' );
	}

	public function get_icon() {
		return 'eicon-button';
	}

	public static function get_button_sizes() {
		return [
			'xs' => __( 'Extra Small', 'builder' ),
			'sm' => __( 'Small', 'builder' ),
			'md' => __( 'Medium', 'builder' ),
			'lg' => __( 'Large', 'builder' ),
			'xl' => __( 'Extra Large', 'builder' ),
		];
	}

	protected function _register_controls() {
		$this->start_controls_section(
			'section_button',
			[
				'label' => __( 'Button', 'builder' ),
			]
		);

		$this->add_control(
			'button_type',
			[
				'label' => __( 'Type', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'default' => '',
				'options' => [
					'' => __( 'Default', 'builder' ),
					'info' => __( 'Info', 'builder' ),
					'success' => __( 'Success', 'builder' ),
					'warning' => __( 'Warning', 'builder' ),
					'danger' => __( 'Danger', 'builder' ),
				],
				'prefix_class' => 'builder-button-',
			]
		);

		$this->add_control(
            'button_weight',
            [
                'label' => __( 'Weight', 'builder' ),
                'type' => Controls_Manager::SELECT,
                'default' => '',
                'options' => [
                    '' => __( 'Default', 'builder' ),
                    'transparent' => __( 'Transparent', 'builder' ),
                    'solid' => __( 'Solid', 'builder' ),
                ],
            ]
        );

		$this->add_control(
			'text',
			[
				'label' => __( 'Text', 'builder' ),
				'type' => Controls_Manager::TEXT,
				'default' => __( 'Click me', 'builder' ),
				'placeholder' => __( 'Click me', 'builder' ),
			]
		);

		$this->add_control(
			'link',
			[
				'label' => __( 'Link', 'builder' ),
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
				'label' => __( 'Alignment', 'builder' ),
				'type' => Controls_Manager::CHOOSE,
				'options' => [
					'left'    => [
						'title' => __( 'Left', 'builder' ),
						'icon' => 'fa fa-align-left',
					],
					'center' => [
						'title' => __( 'Center', 'builder' ),
						'icon' => 'fa fa-align-center',
					],
					'right' => [
						'title' => __( 'Right', 'builder' ),
						'icon' => 'fa fa-align-right',
					],
					'justify' => [
						'title' => __( 'Justified', 'builder' ),
						'icon' => 'fa fa-align-justify',
					],
				],
				'prefix_class' => 'builder%s-align-',
				'default' => '',
			]
		);

		$this->add_control(
			'size',
			[
				'label' => __( 'Size', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'sm',
				'options' => self::get_button_sizes(),
			]
		);

		$this->add_control(
			'icon',
			[
				'label' => __( 'Icon', 'builder' ),
				'type' => Controls_Manager::ICON,
				'label_block' => true,
				'default' => '',
			]
		);
		
		$this->add_control(
			'icon_align',
			[
				'label' => __( 'Icon Position', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'left',
				'options' => [
					'left' => __( 'Before', 'builder' ),
					'right' => __( 'After', 'builder' ),
				],
				'condition' => [
					'icon!' => '',
				],
			]
		);

		$this->add_control(
			'icon_indent',
			[
				'label' => __( 'Icon Spacing', 'builder' ),
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
					'{{WRAPPER}} .builder-button .builder-align-icon-right' => 'margin-left: {{SIZE}}{{UNIT}};',
					'{{WRAPPER}} .builder-button .builder-align-icon-left' => 'margin-right: {{SIZE}}{{UNIT}};',
				],
			]
		);

        $this->add_control(
			'icon_size',
			[
				'label' => __( 'Icon Size', 'builder' ),
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
					'{{WRAPPER}} .builder-button-icon i' => 'font-size: {{SIZE}}{{UNIT}};',
				],
			]
		);

        $this->add_control(
            'view',
            [
                'label' => __( 'View', 'builder' ),
                'type' => Controls_Manager::HIDDEN,
                'default' => 'traditional',
            ]
        );

		$this->end_controls_section();

		$this->start_controls_section(
			'section_style',
			[
				'label' => __( 'Button', 'builder' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'button_text_color',
			[
				'label' => __( 'Text Color', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} .builder-button' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'typography',
				'label' => __( 'Typography', 'builder' ),
				'scheme' => Scheme_Typography::TYPOGRAPHY_4,
				'selector' => '{{WRAPPER}} .builder-button',
			]
		);

		$this->add_control(
			'background_color',
			[
				'label' => __( 'Background Color', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_4,
				],
				'selectors' => [
					'{{WRAPPER}} .builder-button' => 'background-color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Border::get_type(),
			[
				'name' => 'border',
				'label' => __( 'Border', 'builder' ),
				'placeholder' => '1px',
				'default' => '1px',
				'selector' => '{{WRAPPER}} .builder-button',
			]
		);

		$this->add_control(
			'border_radius',
			[
				'label' => __( 'Border Radius', 'builder' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'selectors' => [
					'{{WRAPPER}} .builder-button' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'text_padding',
			[
				'label' => __( 'Text Padding', 'builder' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors' => [
					'{{WRAPPER}} .builder-button' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_hover',
			[
				'label' => __( 'Button Hover', 'builder' ),
				'type' => Controls_Manager::SECTION,
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'hover_color',
			[
				'label' => __( 'Text Color', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .builder-button:hover' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'button_background_hover_color',
			[
				'label' => __( 'Background Color', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .builder-button:hover' => 'background-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'button_hover_border_color',
			[
				'label' => __( 'Border Color', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'condition' => [
					'border_border!' => '',
				],
				'selectors' => [
					'{{WRAPPER}} .builder-button:hover' => 'border-color: {{VALUE}};',
				],
			]
		);

        $this->end_controls_section();
    }

	protected function render() {
		$settings = $this->get_settings();

		$this->add_render_attribute( 'wrapper', 'class', 'builder-button-wrapper' );

		if ( ! empty( $settings['link']['url'] ) ) {
			$this->add_render_attribute( 'button', 'href', $settings['link']['url'] );
			$this->add_render_attribute( 'button', 'class', 'builder-button-link' );

			if ( ! empty( $settings['link']['is_external'] ) ) {
				$this->add_render_attribute( 'button', 'target', '_blank' );
			}
		}

		$this->add_render_attribute( 'button', 'class', 'builder-button' );

		if ( ! empty( $settings['size'] ) ) {
			$this->add_render_attribute( 'button', 'class', 'builder-size-' . $settings['size'] );
		}

        if ( ! empty( $settings['button_weight'] ) ) {
            $this->add_render_attribute( 'button', 'class', 'builder-weight-' . $settings['button_weight'] );
        }

        if ( ! empty( $settings['button_type'] ) ) {
            $this->add_render_attribute( 'button', 'class', 'builder-button-' . $settings['button_type'] );
        }

        $this->add_render_attribute( 'content-wrapper', 'class', 'builder-button-content-wrapper' );
        $this->add_render_attribute( 'icon-align', 'class', 'builder-align-icon-' . $settings['icon_align'] );
        $this->add_render_attribute( 'icon-align', 'class', 'builder-button-icon' );

        ?><div <?php echo $this->get_render_attribute_string( 'wrapper' ); ?>>
            <a <?php echo $this->get_render_attribute_string( 'button' ); ?>>
                <span <?php echo $this->get_render_attribute_string( 'content-wrapper' ); ?>>
                    <?php if ( ! empty( $settings['icon'] ) ) : ?>
                        <span <?php echo $this->get_render_attribute_string( 'icon-align' ); ?>>
                            <i class="<?php echo esc_attr( $settings['icon'] ); ?>"></i>
                        </span>
                    <?php endif; ?>
                    <span class="builder-button-text"><?php echo $settings['text']; ?></span>
                </span>
            </a>
        </div><?php

    }

    protected function _content_template() {
        ?>
        <div class="builder-button-wrapper">
            <a class="builder-button builder-button-{{ settings.button_type }} builder-weight-{{ settings.button_weight }} builder-size-{{ settings.size }} builder-animation-{{ settings.hover_animation }}" href="{{ settings.link.url }}">
                <span class="builder-button-content-wrapper">
                    <# if ( settings.icon ) { #>
                    <span class="builder-button-icon builder-align-icon-{{ settings.icon_align }}">
                        <i class="{{ settings.icon }}"></i>
                    </span>
                    <# } #>
                    <span class="builder-button-text">{{{ settings.text }}}</span>
                </span>
            </a>
        </div>
        <?php
    }
}
