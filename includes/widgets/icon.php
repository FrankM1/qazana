<?php
namespace Builder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Icon extends Widget_Base {

	public function get_name() {
		return 'icon';
	}

	public function get_title() {
		return __( 'Icon', 'builder' );
	}

	public function get_icon() {
		return 'eicon-favorite';
	}

	public function get_categories() {
		return [ 'general-elements' ];
	}

	protected function _register_controls() {
		$this->start_controls_section(
			'section_icon',
			[
				'label' => __( 'Icon', 'builder' ),
			]
		);

		$this->add_control(
			'view',
			[
				'label' => __( 'View', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'default' 	=> __( 'Default', 'builder' ),
					'stacked' => __( 'Stacked', 'builder' ),
					'framed' => __( 'Framed', 'builder' ),
				],
				'default' => 'default',
				'prefix_class' => 'builder-view-',
			]
		);

		$this->add_control(
			'icon_type',
			[
				'label' => __( 'Icon type', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'icon',
				'options' => [
					'icon' => __( 'Icon', 'builder' ),
					'image' => __( 'Image File', 'builder' ),
				],
			]
		);

		$this->add_control(
			'image',
			[
				'label' => __( 'Choose Image', 'builder' ),
				'type' => Controls_Manager::MEDIA,
				'condition' => [
					'icon_type' => 'image',
				],
				'default' => [
					'url' => Utils::get_placeholder_image_src(),
				],
			]
		);

		$this->add_control(
			'icon',
			[
				'label' => __( 'Icon', 'builder' ),
				'type' => Controls_Manager::ICON,
				'label_block' => true,
				'default' => 'fa fa-file-o',
				'condition' => [
					'icon_type' => 'icon',
				],
			]

		);

		$this->add_control(
			'shape',
			[
				'label' => __( 'Shape', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'circle' => __( 'Circle', 'builder' ),
					'square' => __( 'Square', 'builder' ),
				],
				'default' => 'circle',
				'condition' => [
					'view!' => 'default',
				],
				'prefix_class' => 'builder-shape-',
			]
		);

		$this->add_control(
			'link',
			[
				'label' => __( 'Link', 'builder' ),
				'type' => Controls_Manager::URL,
				'placeholder' => 'http://your-link.com',
			]
		);

		$this->add_responsive_control(
			'align',
			[
				'label' => __( 'Alignment', 'builder' ),
				'type' => Controls_Manager::CHOOSE,
				'options' => [
					'left' => [
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
				],
				'default' => 'center',
				'selectors' => [
					'{{WRAPPER}} .builder-icon-wrapper' => 'text-align: {{VALUE}};',
				],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_svg_style_content',
			[
				'label' => __( 'SVG Icon Style', 'builder' ),
			]
		);

		$this->add_control(
			'svg_animation',
			[
				'label' => __( 'Enable animation', 'builder' ),
				'type' => Controls_Manager::SWITCHER,
				'default' => '',
				'label_on' => __( 'Yes', 'builder' ),
				'label_off' => __( 'No', 'builder' ),
				'return_value' => 'true',
			]
		);

		$this->add_control(
            'icon_animation',
            [
                'type' => Controls_Manager::ANIMATION_IN,
                'label' => __( "Css Animation", 'builder'),
                'default' => "FadeIn",
            ]
        );

		$this->add_control(
			'animation_delay',
			[
				'label' => __( 'Animation Delay', 'builder' ),
				'type' => Controls_Manager::TEXT,
				'default' => 200,
				'label_block' => true,
				'condition' => [
                    'svg_animation!' => '',
                ],
			]
		);

		$this->add_control(
			'animation_speed',
			[
				'label' => __( 'Animation Speed', 'builder' ),
				'type' => Controls_Manager::TEXT,
				'default' => 200,
				'label_block' => true,
				'condition' => [
                    'svg_animation!' => '',
                ],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_style_icon',
			[
				'label' => __( 'Icon', 'builder' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'icon_color',
			[
				'label' => __( 'Icon Color', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_1,
				],
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} .builder-icon' => 'color: {{VALUE}};',
					'{{WRAPPER}} .builder-icon svg path ' => 'stroke: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'primary_color',
			[
				'label' => __( 'Primary Color', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'selectors' => [
					'{{WRAPPER}}.builder-view-stacked .builder-icon' => 'background-color: {{VALUE}};',
					'{{WRAPPER}}.builder-view-framed .builder-icon, {{WRAPPER}}.builder-view-default .builder-icon' => 'color: {{VALUE}}; border-color: {{VALUE}};',
				],
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_1,
				],
			]
		);

		$this->add_control(
			'secondary_color',
			[
				'label' => __( 'Secondary Color', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'condition' => [
					'view!' => 'default',
				],
				'selectors' => [
					'{{WRAPPER}}.builder-view-framed .builder-icon' => 'background-color: {{VALUE}};',
					'{{WRAPPER}}.builder-view-stacked .builder-icon' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'size',
			[
				'label' => __( 'Icon Size', 'builder' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'min' => 6,
						'max' => 300,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .builder-icon' => 'font-size: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'icon_padding',
			[
				'label' => __( 'Icon Padding', 'builder' ),
				'type' => Controls_Manager::SLIDER,
				'selectors' => [
					'{{WRAPPER}} .builder-icon' => 'padding: {{SIZE}}{{UNIT}};',
				],
				'range' => [
					'em' => [
						'min' => 0,
						'max' => 5,
					],
				],
				'condition' => [
					'view!' => 'default',
				],
			]
		);

		$this->add_control(
			'rotate',
			[
				'label' => __( 'Icon Rotate', 'builder' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => 0,
					'unit' => 'deg',
				],
				'selectors' => [
					'{{WRAPPER}} .builder-icon' => 'transform: rotate({{SIZE}}{{UNIT}});',
				],
			]
		);

		$this->add_control(
			'border_width',
			[
				'label' => __( 'Border Width', 'builder' ),
				'type' => Controls_Manager::DIMENSIONS,
				'selectors' => [
					'{{WRAPPER}} .builder-icon' => 'border-width: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
				'condition' => [
					'view' => 'framed',
				],
			]
		);

		$this->add_control(
			'border_radius',
			[
				'label' => __( 'Border Radius', 'builder' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'selectors' => [
					'{{WRAPPER}} .builder-icon' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
				'condition' => [
					'view!' => 'default',
				],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_hover',
			[
				'label' => __( 'Icon Hover', 'builder' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'hover_primary_color',
			[
				'label' => __( 'Primary Color', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'selectors' => [
					'{{WRAPPER}}.builder-view-stacked .builder-icon:hover' => 'background-color: {{VALUE}};',
					'{{WRAPPER}}.builder-view-framed .builder-icon:hover, {{WRAPPER}}.builder-view-default .builder-icon:hover' => 'color: {{VALUE}}; border-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'hover_secondary_color',
			[
				'label' => __( 'Secondary Color', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'condition' => [
					'view!' => 'default',
				],
				'selectors' => [
					'{{WRAPPER}}.builder-view-framed .builder-icon:hover' => 'background-color: {{VALUE}};',
					'{{WRAPPER}}.builder-view-stacked .builder-icon:hover' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'hover_animation',
			[
				'label' => __( 'Animation', 'builder' ),
				'type' => Controls_Manager::HOVER_ANIMATION,
			]
		);

		$this->end_controls_section();
	}

	protected function get_render_icon() {

		$settings = $this->get_settings();

		if ( $settings['icon_type'] === 'image' ) {

			$filetype = wp_check_filetype( $settings['image']['url'] );

			if ( $filetype['ext'] === 'svg' ) {
				$this->add_render_attribute( 'image', 'class', 'svg-icon-holder svg-baseline' );
				$this->add_render_attribute( 'image', 'data-animation-speed', $settings['animation_speed'] );
				$this->add_render_attribute( 'image', 'data-animation-delay', $settings['animation_delay'] );
				$this->add_render_attribute( 'image', 'data-color', $settings['icon_color'] );
				$this->add_render_attribute( 'image', 'data-icon',  builder_maybe_ssl_url( $settings['image']['url'] ) );
			}
		}

		if ( $settings['icon_type'] === 'image' ) {
			$output = '<span '. $this->get_render_attribute_string( 'image' ) .'><img src="'. builder_maybe_ssl_url( $settings['image']['url'] ) .'" /></span>';
		} else {
			$output = '<i '. $this->get_render_attribute_string( 'i' ) .'></i>';
		}

		return $output;
	}

	protected function render() {

		$settings = $this->get_settings();

		$this->add_render_attribute( 'wrapper', 'class', 'builder-icon-wrapper' );

		$this->add_render_attribute( 'icon-wrapper', 'class', 'builder-icon' );

		if ( ! empty( $settings['hover_animation'] ) ) {
			$this->add_render_attribute( 'icon-wrapper', 'class', 'builder-animation-' . $settings['hover_animation'] );
		}

		$icon_tag = 'div';

		if ( ! empty( $settings['link']['url'] ) ) {
			$this->add_render_attribute( 'icon-wrapper', 'href', $settings['link']['url'] );
			$icon_tag = 'a';

			if ( ! empty( $settings['link']['is_external'] ) ) {
				$this->add_render_attribute( 'icon-wrapper', 'target', '_blank' );
			}
		}

		if ( ! empty( $settings['icon'] ) ) {
			$this->add_render_attribute( 'i', 'class', $settings['icon'] );
		}

		?><div <?php echo $this->get_render_attribute_string( 'wrapper' ); ?>>
			<<?php echo $icon_tag . ' ' . $this->get_render_attribute_string( 'icon-wrapper' ); ?>>
				<?php echo $this->get_render_icon(); ?>
			</<?php echo $icon_tag; ?>>
		</div><?php
	}

	protected function _content_template() {}

}
