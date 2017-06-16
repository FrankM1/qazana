<?php
namespace Builder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Icon_Box extends Widget_Base {

	public function get_name() {
		return 'icon-box';
	}

	public function get_title() {
		return __( 'Icon Box', 'builder' );
	}

	public function get_icon() {
		return 'eicon-icon-box';
	}

	public function get_categories() {
		return [ 'general-elements' ];
	}

	protected function _register_controls() {
		$this->start_controls_section(
			'section_icon',
			[
				'label' => __( 'Icon Box', 'builder' ),
			]
		);

		$this->add_control(
			'view',
			[
				'label' => __( 'View', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'default' 	=> __( 'Default', 'builder' ),
					'align-left' => __( 'Icon Left', 'builder' ),
					'stacked' => __( 'Stacked', 'builder' ),
					'framed' => __( 'Framed', 'builder' ),
					'animated-1' => __( 'Animated 1', 'builder' ),
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
				'label' => __( 'Choose Icon', 'builder' ),
				'type' => Controls_Manager::ICON,
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
			'title_text',
			[
				'label' => __( 'Title & Description', 'builder' ),
				'type' => Controls_Manager::TEXT,
				'default' => __( 'This is the heading', 'builder' ),
				'placeholder' => __( 'Your Title', 'builder' ),
				'label_block' => true,
			]
		);

		$this->add_control(
			'description_text',
			[
				'label' => '',
				'type' => Controls_Manager::TEXTAREA,
				'default' => __( 'Click the edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.', 'builder' ),
				'placeholder' => __( 'Your Description', 'builder' ),
				'title' => __( 'Input icon text here', 'builder' ),
				'rows' => 10,
				'separator' => 'none',
				'show_label' => false,
			]
		);

		$this->add_control(
			'link',
			[
				'label' => __( 'Link to', 'builder' ),
				'type' => Controls_Manager::URL,
				'placeholder' => __( 'http://your-link.com', 'builder' ),
				'separator' => 'before',
			]
		);

		$this->add_control(
			'position',
			[
				'label' => __( 'Icon Position', 'builder' ),
				'type' => Controls_Manager::CHOOSE,
				'default' => 'top',
				'options' => [
					'left' => [
						'title' => __( 'Left', 'builder' ),
						'icon' => 'fa fa-align-left',
					],
					'top' => [
						'title' => __( 'Top', 'builder' ),
						'icon' => 'fa fa-align-center',
					],
					'right' => [
						'title' => __( 'Right', 'builder' ),
						'icon' => 'fa fa-align-right',
					],
				],
				'prefix_class' => 'builder-position-',
				'toggle' => false,
			]
		);

		$this->add_control(
			'title_size',
			[
				'label' => __( 'Title HTML Tag', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'h1' => __( 'H1', 'builder' ),
					'h2' => __( 'H2', 'builder' ),
					'h3' => __( 'H3', 'builder' ),
					'h4' => __( 'H4', 'builder' ),
					'h5' => __( 'H5', 'builder' ),
					'h6' => __( 'H6', 'builder' ),
					'div' => __( 'div', 'builder' ),
					'span' => __( 'span', 'builder' ),
					'p' => __( 'p', 'builder' ),
				],
				'default' => 'h3',
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
				'tab'   => Controls_Manager::TAB_STYLE,
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
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_1,
				],
				'default' => '',
				'condition' => [
					'view' => ['stacked', 'framed'],
				],
				'selectors' => [
					'{{WRAPPER}}.builder-view-stacked .builder-icon' => 'background-color: {{VALUE}};',
					'{{WRAPPER}}.builder-view-framed .builder-icon, {{WRAPPER}}.builder-view-default .builder-icon' => 'color: {{VALUE}}; border-color: {{VALUE}};',
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
					'view' => ['stacked', 'framed'],
				],
				'selectors' => [
					'{{WRAPPER}}.builder-view-framed .builder-icon' => 'background-color: {{VALUE}};',
					'{{WRAPPER}}.builder-view-stacked .builder-icon' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'icon_space',
			[
				'label' => __( 'Icon Spacing', 'builder' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => 15,
				],
				'range' => [
					'px' => [
						'min' => 0,
						'max' => 200,
					],
				],
				'selectors' => [
					'{{WRAPPER}}.builder-position-right .builder-icon-box-icon' => 'margin-left: {{SIZE}}{{UNIT}};',
					'{{WRAPPER}}.builder-position-left .builder-icon-box-icon' => 'margin-right: {{SIZE}}{{UNIT}};',
					'{{WRAPPER}}.builder-position-top .builder-icon-box-icon' => 'margin-bottom: {{SIZE}}{{UNIT}};',
					'{{WRAPPER}}.builder-view-align-left .builder-icon-box-content' => 'margin-left: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'icon_size',
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
				'type' => Controls_Manager::DIMENSIONS,
				'selectors' => [
					'{{WRAPPER}} .builder-icon' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
				'condition' => [
					'view!' => 'default',
				],
			]
		);

		$this->add_control(
			'icon_margin',
			[
				'label' => __( 'Icon Margin', 'builder' ),
				'type' => Controls_Manager::DIMENSIONS,
				'selectors' => [
					'{{WRAPPER}} .builder-icon' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
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

		$this->start_controls_section(
			'section_style_content',
			[
				'label' => __( 'Content', 'builder' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_responsive_control(
			'text_align',
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
					'justify' => [
						'title' => __( 'Justified', 'builder' ),
						'icon' => 'fa fa-align-justify',
					],
				],
				'selectors' => [
					'{{WRAPPER}} .builder-icon-box-wrapper' => 'text-align: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'content_vertical_alignment',
			[
				'label' => __( 'Vertical Alignment', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'top' => __( 'Top', 'builder' ),
					'middle' => __( 'Middle', 'builder' ),
					'bottom' => __( 'Bottom', 'builder' ),
				],
				'default' => 'top',
				'prefix_class' => 'builder-vertical-align-',
			]
		);

		$this->add_control(
			'heading_title',
			[
				'label' => __( 'Title', 'builder' ),
				'type' => Controls_Manager::HEADING,
				'separator' => 'before',
			]
		);

		$this->add_responsive_control(
			'title_bottom_space',
			[
				'label' => __( 'Title Spacing', 'builder' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'min' => 0,
						'max' => 100,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .builder-icon-box-title' => 'margin-bottom: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'title_color',
			[
				'label' => __( 'Title Color', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} .builder-icon-box-title' => 'color: {{VALUE}};',
				],
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_1,
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'title_typography',
				'selector' => '{{WRAPPER}} .builder-icon-box-title',
				'scheme' => Scheme_Typography::TYPOGRAPHY_1,
			]
		);

		$this->add_control(
			'heading_description',
			[
				'label' => __( 'Description', 'builder' ),
				'type' => Controls_Manager::HEADING,
				'separator' => 'before',
			]
		);

		$this->add_control(
			'description_color',
			[
				'label' => __( 'Description Color', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} .builder-icon-box-content .builder-icon-box-description' => 'color: {{VALUE}};',
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
				'name' => 'description_typography',
				'selector' => '{{WRAPPER}} .builder-icon-box-content .builder-icon-box-description',
				'scheme' => Scheme_Typography::TYPOGRAPHY_3,
			]
		);

		$this->end_controls_section();
	}

	public function before_render() {

		$settings = $this->get_settings();

	    $this->_add_render_attributes();

        if ( ! empty( $settings['link']['url'] ) ) {
            $this->add_render_attribute( 'link', 'href', $settings['link']['url'] );
            $icon_tag = 'a';

            if ( ! empty( $settings['link']['is_external'] ) ) {
                $this->add_render_attribute( 'link', 'target', '_blank' );
            }
        }


		if ( $settings['icon_type'] === 'image' ) {

			$filetype = wp_check_filetype( $settings['image']['url'] );

			if ( $filetype['ext'] === 'svg' ) {
				$this->add_render_attribute( 'image', 'class', 'svg-icon-holder svg-baseline' );
				$this->add_render_attribute( 'image', 'data-animation-speed', $settings['animation_speed'] );
				$this->add_render_attribute( 'image', 'data-size', $settings['icon_size']['size'] );
				$this->add_render_attribute( 'image', 'data-animation-delay', $settings['animation_delay'] );
				$this->add_render_attribute( 'image', 'data-color', $settings['icon_color'] );
				$this->add_render_attribute( 'image', 'data-icon', builder_maybe_ssl_url( $settings['image']['url'] ) );
			}
		}

		?><div <?php echo $this->get_render_attribute_string( '_wrapper' ); ?>><?php
	}

	protected function get_render_icon() {

		$settings = $this->get_settings();

		$output = null;

		$icon_tag = 'span';

		$this->add_render_attribute( 'icon', 'class', [ 'builder-icon' ] );

		$icon_attributes = $this->get_render_attribute_string( 'icon' );
		$link_attributes = $this->get_render_attribute_string( 'link' );

		if ( ! empty( $settings['icon'] ) ) {

			$output .= '<'. implode( ' ', [ $icon_tag, $icon_attributes, $link_attributes ] ) .'>';

			if ( $settings['icon_type'] === 'image' ) {
				$output .= '<span '. $this->get_render_attribute_string( 'image' ) .'><img src="'. builder_maybe_ssl_url( $settings['image']['url'] ) .'" /></span>';
			} else {
				$output .= '<i '. $this->get_render_attribute_string( 'i' ) .'></i>';
			}

			$output .= '</'. $icon_tag .'>';

		}

		return $output;
	}

	protected function get_render_description() {

		$settings = $this->get_settings();

		$output = null;

		$icon_tag = 'span';

		$link_attributes = $this->get_render_attribute_string( 'link' );

		$output .= '<'. $settings['title_size'] .' class="builder-icon-box-title">';
			$output .= '<'. implode( ' ', [ $icon_tag, $link_attributes ] ) .'>'. $settings['title_text'] .' </'. $icon_tag.'>';
		$output .= '</'. $settings['title_size'].' >';
		$output .= '<p class="builder-icon-box-description">'. $settings['description_text'] .' </p>';

		return $output;

	}

	protected function render_style_1() {

        $settings = $this->get_settings();

        $icon_tag = 'span';

        $link_attributes = $this->get_render_attribute_string( 'link' );

		if ( ! empty( $settings['icon'] ) ) {

		    ?><div class="builder-icon-box-icon">
				<?php echo $this->get_render_icon(); ?>
		    </div><?php

		}

		?><div class="builder-icon-box-content">
			<?php echo $this->get_render_description(); ?>
	    </div><?php
    }

    protected function render_style_2() {

        $settings = $this->get_settings();

        $icon_tag = 'span';

		$this->add_render_attribute( 'icon', 'class', [ 'builder-icon', 'builder-animation-' . $settings['hover_animation'] ] );

        $link_attributes = $this->get_render_attribute_string( 'link' );

	    ?><div class="builder-icon-box-icon front">
	        <div class="front-inner-wrap">

				<?php echo $this->get_render_icon(); ?>

		        <<?php echo $settings['title_size']; ?> class="builder-icon-box-title">
		            <<?php echo implode( ' ', [ $icon_tag, $link_attributes ] ); ?>><?php echo $settings['title_text']; ?></<?php echo $icon_tag; ?>>
		        </<?php echo $settings['title_size']; ?>>

	        </div>
	    </div>
	    <div class="builder-icon-box-content back">
	        <p class="builder-icon-box-description"><?php echo $settings['description_text']; ?></p>
	    </div><?php

    }

	protected function render_style_3() {

        $settings = $this->get_settings();

		$this->add_render_attribute( 'icon', 'class', [ 'builder-icon' ] );

        $icon_tag = 'span';

        $link_attributes = $this->get_render_attribute_string( 'link' );

	    ?><div class="builder-icon-box">
			<?php echo $this->get_render_icon(); ?>
			 <div class="builder-icon-box-content">
				 <?php echo $this->get_render_description(); ?>
		    </div>
		</div><?php

    }

	protected function render() {
		$settings = $this->get_settings();

		$icon_tag = 'span';

		if ( ! empty( $settings['link']['url'] ) ) {
			$this->add_render_attribute( 'link', 'href', $settings['link']['url'] );
			$icon_tag = 'a';

			if ( ! empty( $settings['link']['is_external'] ) ) {
				$this->add_render_attribute( 'link', 'target', '_blank' );
			}
		}

		$this->add_render_attribute( 'i', 'class', $settings['icon'] );

		?>
		<div class="builder-icon-box-wrapper">
            <div class="height-adjust"></div>
            <div class="builder-icon-box-inner">

            <?php

            if( $settings['view'] === 'animated-1' ) {
                $this->render_style_2();
			} elseif( $settings['view'] === 'align-left' ) {
                $this->render_style_3();
            } else {
                $this->render_style_1();
            }

            ?>
            </div>
		</div>
		<?php
	}

	protected function _content_template() { }
}
