<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Qazana icon widget.
 *
 * Qazana widget that displays an icon from over 600+ icons.
 *
 * @since 1.0.0
 */
class Widget_Icon extends Widget_Base {

	/**
	 * Get widget name.
	 *
	 * Retrieve icon widget name.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget name.
	 */
	public function get_name() {
		return 'icon';
	}

	/**
	 * Get widget title.
	 *
	 * Retrieve icon widget title.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget title.
	 */
	public function get_title() {
		return __( 'Icon', 'qazana' );
	}

	/**
	 * Get widget icon.
	 *
	 * Retrieve icon widget icon.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget icon.
	 */
	public function get_icon() {
		return 'eicon-favorite';
	}

	/**
	 * Get widget categories.
	 *
	 * Retrieve the list of categories the icon widget belongs to.
	 *
	 * Used to determine where to display the widget in the editor.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return array Widget categories.
	 */
	public function get_categories() {
		return [ 'general' ];
	}

	/**
	 * Get widget keywords.
	 *
	 * Retrieve the list of keywords the widget belongs to.
	 *
	 * @since 2.1.0
	 * @access public
	 *
	 * @return array Widget keywords.
	 */
	public function get_keywords() {
		return [ 'icon' ];
	}

	/**
	 * Register icon widget controls.
	 *
	 * Adds different input fields to allow the user to change and customize the widget settings.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	protected function _register_controls() {
		$this->start_controls_section(
			'section_icon',
			[
				'label' => __( 'Icon', 'qazana' ),
			]
		);

		$this->add_control(
			'view',
			[
				'label' => __( 'View', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'default' 	=> __( 'Default', 'qazana' ),
					'stacked' => __( 'Stacked', 'qazana' ),
					'framed' => __( 'Framed', 'qazana' ),
				],
				'default' => 'default',
				'prefix_class' => 'qazana-view-',
			]
		);

		$this->add_control(
			'icon_type',
			[
				'label' => __( 'Icon Type', 'qazana' ),
				'type' => Controls_Manager::CHOOSE,
				'label_block' => false,
				'options' => [
					'image' => [
						'title' => __( 'Image', 'qazana' ),
						'icon' => 'fa fa-picture-o',
					],
					'icon' => [
						'title' => __( 'Icon', 'qazana' ),
						'icon' => 'fa fa-star',
					],
				],
				'default' => 'icon',
			]
		);

		$this->add_control(
			'image',
			[
				'label' => __( 'Choose Image', 'qazana' ),
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
				'label' => __( 'Icon', 'qazana' ),
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
				'label' => __( 'Shape', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'circle' => __( 'Circle', 'qazana' ),
					'square' => __( 'Square', 'qazana' ),
				],
				'default' => 'circle',
				'condition' => [
					'view!' => 'default',
				],
				'prefix_class' => 'qazana-shape-',
			]
		);

		$this->add_control(
			'link',
			[
				'label' => __( 'Link', 'qazana' ),
				'type' => Controls_Manager::URL,
				'dynamic' => [
					'active' => true,
				],
				'placeholder' => __( 'https://your-link.com', 'qazana' ),
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
				'default' => 'center',
				'selectors' => [
					'{{WRAPPER}} .qazana-icon-wrapper' => 'text-align: {{VALUE}};',
				],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_svg_style_content',
			[
				'label' => __( 'SVG Icon Style', 'qazana' ),
			]
		);

		$this->add_responsive_control(
			'svg_animation',
			[
				'label' => __( 'Enable animation', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'default' => '',
				'label_on' => __( 'Yes', 'qazana' ),
				'label_off' => __( 'No', 'qazana' ),
				'return_value' => 'true',
				'render_type' => 'template',
				'prefix_class' => 'icon-svg-animation-'
			]
		);

		$this->add_control(
			'svg_animation_delay',
			[
				'label' => __( 'Animation Delay', 'qazana' ),
				'type' => Controls_Manager::TEXT,
				'default' => 200,
				'label_block' => true,
				'condition' => [
                    'svg_animation!' => '',
                ],
			]
		);

		$this->add_control(
			'svg_animation_speed',
			[
				'label' => __( 'Animation Speed', 'qazana' ),
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
				'label' => __( 'Icon', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'icon_color',
			[
				'label' => __( 'Icon Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_1,
				],
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} .qazana-icon' => 'color: {{VALUE}};',
					'{{WRAPPER}} .qazana-icon svg path ' => 'stroke: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'primary_color',
			[
				'label' => __( 'Primary Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'selectors' => [
					'{{WRAPPER}}.qazana-view-stacked .qazana-icon' => 'background-color: {{VALUE}};',
					'{{WRAPPER}}.qazana-view-framed .qazana-icon, {{WRAPPER}}.qazana-view-default .qazana-icon' => 'color: {{VALUE}}; border-color: {{VALUE}};',
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
				'label' => __( 'Secondary Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'condition' => [
					'view!' => 'default',
				],
				'selectors' => [
					'{{WRAPPER}}.qazana-view-framed .qazana-icon' => 'background-color: {{VALUE}};',
					'{{WRAPPER}}.qazana-view-stacked .qazana-icon' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'size',
			[
				'label' => __( 'Size', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'min' => 6,
						'max' => 300,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-icon' => 'font-size: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'icon_padding',
			[
				'label' => __( 'Icon Padding', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'selectors' => [
					'{{WRAPPER}} .qazana-icon' => 'padding: {{SIZE}}{{UNIT}};',
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
				'label' => __( 'Rotate', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => 0,
					'unit' => 'deg',
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-icon' => 'transform: rotate({{SIZE}}{{UNIT}});',
				],
			]
		);

		$this->add_control(
			'border_width',
			[
				'label' => __( 'Border Width', 'qazana' ),
				'type' => Controls_Manager::DIMENSIONS,
				'selectors' => [
					'{{WRAPPER}} .qazana-icon' => 'border-width: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
				'condition' => [
					'view' => 'framed',
				],
			]
		);

		$this->add_control(
			'border_radius',
			[
				'label' => __( 'Border Radius', 'qazana' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'selectors' => [
					'{{WRAPPER}} .qazana-icon' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
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
				'label' => __( 'Icon Hover', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'hover_primary_color',
			[
				'label' => __( 'Primary Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'selectors' => [
					'{{WRAPPER}}.qazana-view-stacked .qazana-icon:hover' => 'background-color: {{VALUE}};',
					'{{WRAPPER}}.qazana-view-framed .qazana-icon:hover, {{WRAPPER}}.qazana-view-default .qazana-icon:hover' => 'color: {{VALUE}}; border-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'hover_secondary_color',
			[
				'label' => __( 'Secondary Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'condition' => [
					'view!' => 'default',
				],
				'selectors' => [
					'{{WRAPPER}}.qazana-view-framed .qazana-icon:hover' => 'background-color: {{VALUE}};',
					'{{WRAPPER}}.qazana-view-stacked .qazana-icon:hover' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Hover_Animations::get_type(),
			[
				'name' => 'hover_animation',
			]
		);

		$this->end_controls_section();
	}

	protected function get_render_icon() {

		$settings = $this->get_settings_for_display();

		if ( $settings['icon_type'] === 'image' ) {
			$filetype = wp_check_filetype( $settings['image']['url'] );
			if ( $filetype['ext'] === 'svg' ) {
				$this->add_render_attribute( 'image', 'class', 'svg-icon-holder svg-baseline' );
				$this->add_render_attribute( 'image', 'data-animation-speed', $settings['svg_animation_speed'] );
				$this->add_render_attribute( 'image', 'data-animation-delay', $settings['svg_animation_delay'] );
				$this->add_render_attribute( 'image', 'data-color', $settings['icon_color'] );
				$this->add_render_attribute( 'image', 'data-icon', qazana_maybe_ssl_url( $settings['image']['url'] ) );
			}
		}

		if ( $settings['icon_type'] === 'image' ) {
			$output = '<span ' . $this->get_render_attribute_string( 'image' ) . '><img src="' . qazana_maybe_ssl_url( $settings['image']['url'] ) . '" alt="icon"/></span>';
		} else {
			$output = '<i ' . $this->get_render_attribute_string( 'i' ) . '></i>';
		}

		return $output;
	}

	/**
	 * Render icon widget output on the frontend.
	 *
	 * Written in PHP and used to generate the final HTML.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	public function render() {

		$settings = $this->get_settings_for_display();

		$this->add_render_attribute( 'wrapper', 'class', 'qazana-icon-wrapper' );

		$this->add_render_attribute( 'icon-wrapper', 'class', 'qazana-icon' );

		if ( ! empty( $settings['hover_animation_type'] ) ) {
			$this->add_render_attribute( 'icon-wrapper', 'class', 'qazana-hover-animation-' . $settings['hover_animation_type'] );
		}

		$icon_tag = 'div';

		if ( ! empty( $settings['link']['url'] ) ) {
			$this->add_render_attribute( 'icon-wrapper', 'href', $settings['link']['url'] );
			$icon_tag = 'a';

			if ( ! empty( $settings['link']['is_external'] ) ) {
				$this->add_render_attribute( 'icon-wrapper', 'target', '_blank' );
			}

			if ( $settings['link']['nofollow'] ) {
				$this->add_render_attribute( 'icon-wrapper', 'rel', 'nofollow' );
			}
		}

		if ( ! empty( $settings['icon'] ) ) {
			$this->add_render_attribute( 'i', 'class', $settings['icon'] );
			$this->add_render_attribute( 'i', 'aria-hidden', 'true' );
		}

		?><div <?php $this->render_attribute_string( 'wrapper' ); ?>>
			<<?php echo $icon_tag . ' ' . $this->get_render_attribute_string( 'icon-wrapper' ); ?>>
				<?php echo $this->get_render_icon(); ?>
			</<?php echo $icon_tag; ?>>
		</div><?php
	}

}
