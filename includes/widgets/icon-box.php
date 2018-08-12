<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * Qazana icon box widget.
 *
 * Qazana widget that displays an icon, a headline and a text.
 *
 * @since 1.0.0
 */
class Widget_Icon_Box extends Widget_Base {

	/**
	 * Get widget name.
	 *
	 * Retrieve icon box widget name.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget name.
	 */
	public function get_name() {
		return 'icon-box';
	}

	/**
	 * Get widget title.
	 *
	 * Retrieve icon box widget title.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget title.
	 */
	public function get_title() {
		return __( 'Icon Box', 'qazana' );
	}

	/**
	 * Get widget icon.
	 *
	 * Retrieve icon box widget icon.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget icon.
	 */
	public function get_icon() {
		return 'eicon-icon-box';
	}

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
		return [ 'icon box', 'icon' ];
	}

	/**
	 * Register icon box widget controls.
	 *
	 * Adds different input fields to allow the user to change and customize the widget settings.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	protected function _register_controls() {
		$this->_register_section_icon_controls();
		$this->_register_section_style_content_controls();
		$this->_register_section_style_icon_controls();
		$this->_register_section_svg_style_content_controls();
	}

	public function _register_section_icon_controls() {

		$this->start_controls_section(
			'section_icon',
			[
				'label' => __( 'Icon Box', 'qazana' ),
			]
		);

		$this->add_control(
			'view',
			[
				'label'   => __( 'View', 'qazana' ),
				'type'    => Controls_Manager::SELECT,
				'options' => [
					'default'    => __( 'Default', 'qazana' ),
					'align-left' => __( 'Icon Left', 'qazana' ),
					'stacked'    => __( 'Stacked', 'qazana' ),
					'framed'     => __( 'Framed', 'qazana' ),
					'animated-1' => __( 'Animated 1', 'qazana' ),
				],
				'default'      => 'default',
				'prefix_class' => 'qazana-view-',
			]
		);

		$this->add_control(
			'icon_type',
			[
				'label'       => __( 'Icon Type', 'qazana' ),
				'type'        => Controls_Manager::CHOOSE,
				'label_block' => false,
				'options'     => [
					'image' => [
						'title' => __( 'Image', 'qazana' ),
						'icon'  => 'fa fa-picture-o',
					],
					'icon' => [
						'title' => __( 'Icon', 'qazana' ),
						'icon'  => 'fa fa-star',
					],
				],
				'default' => 'icon',
			]
		);

        $this->add_control(
			'image',
			[
				'label'     => __( 'Choose Image', 'qazana' ),
				'type'      => Controls_Manager::MEDIA,
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
				'label'       => __( 'Choose Icon', 'qazana' ),
				'type'        => Controls_Manager::ICON,
				'label_block' => true,
				'default'     => 'fa fa-file-o',
				'condition'   => [
					'icon_type' => 'icon',
				],
			]
		);

		$this->add_control(
			'shape',
			[
				'label'   => __( 'Shape', 'qazana' ),
				'type'    => Controls_Manager::SELECT,
				'options' => [
					'circle' => __( 'Circle', 'qazana' ),
					'square' => __( 'Square', 'qazana' ),
				],
				'default'   => 'circle',
				'condition' => [
					'view!' => 'default',
				],
				'prefix_class' => 'qazana-shape-',
			]
		);

		$this->add_control(
			'title_text',
			[
				'label'       => __( 'Title & Description', 'qazana' ),
				'type'        => Controls_Manager::TEXT,
				'default'     => __( 'This is the heading', 'qazana' ),
				'placeholder' => __( 'Your Title', 'qazana' ),
				'label_block' => true,
			]
		);

		$this->add_control(
			'description_text',
			[
				'label'       => '',
				'type'        => Controls_Manager::TEXTAREA,
				'default'     => __( 'Click the edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.', 'qazana' ),
				'placeholder' => __( 'Your Description', 'qazana' ),
				'title'       => __( 'Input icon text here', 'qazana' ),
				'rows'        => 10,
				'separator'   => 'none',
				'show_label'  => false,
			]
		);

		$this->add_control(
			'link',
			[
				'label'       => __( 'Link to', 'qazana' ),
				'type'        => Controls_Manager::URL,
				'placeholder' => __( 'http://your-link.com', 'qazana' ),
				'separator'   => 'before',
			]
		);

		$this->add_responsive_control(
			'position',
			[
				'label'   => __( 'Icon Position', 'qazana' ),
				'type'    => Controls_Manager::CHOOSE,
				'default' => 'top',
				'options' => [
					'left' => [
						'title' => __( 'Left', 'qazana' ),
						'icon'  => 'eicon-h-align-left',
					],
					'top' => [
						'title' => __( 'Top', 'qazana' ),
						'icon'  => 'eicon-v-align-top',
					],
					'right' => [
						'title' => __( 'Right', 'qazana' ),
						'icon'  => 'eicon-h-align-right',
					],
				],
				'prefix_class' => 'qazana-position-',
                'toggle'       => false,
                'condition' => [
					'view!' => 'align-left',
				],
			]
		);

		$this->add_control(
			'title_size',
			[
				'label'   => __( 'Title HTML Tag', 'qazana' ),
				'type'    => Controls_Manager::SELECT,
				'options' => [
					'h1'   => __( 'H1', 'qazana' ),
					'h2'   => __( 'H2', 'qazana' ),
					'h3'   => __( 'H3', 'qazana' ),
					'h4'   => __( 'H4', 'qazana' ),
					'h5'   => __( 'H5', 'qazana' ),
					'h6'   => __( 'H6', 'qazana' ),
					'div'  => __( 'div', 'qazana' ),
					'span' => __( 'span', 'qazana' ),
					'p'    => __( 'p', 'qazana' ),
				],
				'default' => 'h3',
			]
		);

		$this->end_controls_section();
	}

	public function _register_section_svg_style_content_controls() {

		$this->start_controls_section(
			'section_svg_style_content',
			[
				'label' => __( 'SVG Icon Style', 'qazana' ),
			]
		);

		$this->add_responsive_control(
			'svg_animation',
			[
				'label'        => __( 'Enable animation', 'qazana' ),
				'type'         => Controls_Manager::SWITCHER,
				'default'      => '',
				'label_on'     => __( 'Yes', 'qazana' ),
				'label_off'    => __( 'No', 'qazana' ),
				'return_value' => 'true',
				'render_type'  => 'template',
				'prefix_class' => 'icon-svg-animation-'
			]
		);

		$this->add_control(
			'svg_animation_delay',
			[
				'label'       => __( 'Animation Delay', 'qazana' ),
				'type'        => Controls_Manager::TEXT,
				'default'     => 200,
				'label_block' => true,
				'condition'   => [
                    'svg_animation!' => '',
                ],
			]
		);

		$this->add_control(
			'svg_animation_speed',
			[
				'label'       => __( 'Animation Speed', 'qazana' ),
				'type'        => Controls_Manager::TEXT,
				'default'     => 200,
				'label_block' => true,
				'condition'   => [
                    'svg_animation!' => '',
                ],
			]
		);

		$this->end_controls_section();
	}

	public function _register_section_style_icon_controls() {

		$this->start_controls_section(
			'section_style_icon',
			[
				'label' => __( 'Icon', 'qazana' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			]
        );
 
        $this->start_controls_tabs( 'tabs_icon_style' );

        $this->start_controls_tab(
            'section_icon_style',
            [
                'label' => __( 'Icon', 'qazana' ),
            ]
        );

		$this->add_control(
			'icon_color',
			[
				'label'  => __( 'Icon Color', 'qazana' ),
				'type'   => Controls_Manager::COLOR,
				'scheme' => [
					'type'  => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_1,
				],
				'default'   => '',
				'selectors' => [
					'{{WRAPPER}} .qazana-icon'           => 'color: {{VALUE}};',
					'{{WRAPPER}} .qazana-icon svg path ' => 'stroke: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'primary_color',
			[
				'label'  => __( 'Primary Color', 'qazana' ),
				'type'   => Controls_Manager::COLOR,
				'scheme' => [
					'type'  => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_1,
				],
				'default'   => '',
				'condition' => [
					'view' => ['stacked', 'framed'],
				],
				'selectors' => [
					'{{WRAPPER}}.qazana-view-stacked .qazana-icon'                                              => 'background-color: {{VALUE}};',
					'{{WRAPPER}}.qazana-view-framed .qazana-icon, {{WRAPPER}}.qazana-view-default .qazana-icon' => 'color: {{VALUE}}; border-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'secondary_color',
			[
				'label'     => __( 'Secondary Color', 'qazana' ),
				'type'      => Controls_Manager::COLOR,
				'default'   => '',
				'condition' => [
					'view' => ['stacked', 'framed'],
				],
				'selectors' => [
					'{{WRAPPER}}.qazana-view-framed .qazana-icon'  => 'background-color: {{VALUE}};',
					'{{WRAPPER}}.qazana-view-stacked .qazana-icon' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_responsive_control(
			'icon_space',
			[
				'label'   => __( 'Spacing', 'qazana' ),
				'type'    => Controls_Manager::SLIDER,
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
					'{{WRAPPER}}.qazana-position-right .qazana-icon-box-icon'     => 'margin-left: {{SIZE}}{{UNIT}};',
					'{{WRAPPER}}.qazana-position-left .qazana-icon-box-icon'      => 'margin-right: {{SIZE}}{{UNIT}};',
					'{{WRAPPER}}.qazana-position-top .qazana-icon-box-icon'       => 'margin-bottom: {{SIZE}}{{UNIT}};',
					'{{WRAPPER}}.qazana-view-align-left .qazana-icon-box-content' => 'margin-left: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_responsive_control(
			'icon_size',
			[
				'label' => __( 'Size', 'qazana' ),
				'type'  => Controls_Manager::SLIDER,
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

		$this->add_responsive_control(
			'icon_padding',
			[
				'label'     => __( 'Padding', 'qazana' ),
				'type'      => Controls_Manager::DIMENSIONS,
				'selectors' => [
					'{{WRAPPER}} .qazana-icon' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_responsive_control(
			'icon_margin',
			[
				'label'     => __( 'Margin', 'qazana' ),
				'type'      => Controls_Manager::DIMENSIONS,
				'selectors' => [
					'{{WRAPPER}} .qazana-icon' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'rotate',
			[
				'label'   => __( 'Rotate', 'qazana' ),
				'type'    => Controls_Manager::SLIDER,
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
				'label'     => __( 'Border Width', 'qazana' ),
				'type'      => Controls_Manager::DIMENSIONS,
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
				'label'      => __( 'Border Radius', 'qazana' ),
				'type'       => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'selectors'  => [
					'{{WRAPPER}} .qazana-icon' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
				'condition' => [
					'view!' => 'default',
				],
			]
		);

        $this->end_controls_tab();
        
        $this->start_controls_tab(
            'section_icon_hover',
            [
                'label' => __( 'Hover', 'qazana' ),
            ]
        );

		$this->add_control(
			'hover_primary_color',
			[
				'label'     => __( 'Primary Color', 'qazana' ),
				'type'      => Controls_Manager::COLOR,
				'default'   => '',
				'selectors' => [
					'{{WRAPPER}}.qazana-view-stacked .qazana-icon:hover'                                                    => 'background-color: {{VALUE}};',
					'{{WRAPPER}}.qazana-view-framed .qazana-icon:hover, {{WRAPPER}}.qazana-view-default .qazana-icon:hover' => 'color: {{VALUE}}; border-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'hover_secondary_color',
			[
				'label'     => __( 'Secondary Color', 'qazana' ),
				'type'      => Controls_Manager::COLOR,
				'default'   => '',
				'condition' => [
					'view!' => 'default',
				],
				'selectors' => [
					'{{WRAPPER}}.qazana-view-framed .qazana-icon:hover'  => 'background-color: {{VALUE}};',
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
        
        $this->end_controls_tab();
        
        $this->end_controls_tabs();

		$this->end_controls_section();
	}

	public function _register_section_style_content_controls() {

		$this->start_controls_section(
			'section_style_content',
			[
				'label' => __( 'Content', 'qazana' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_responsive_control(
			'text_align',
			[
				'label'   => __( 'Alignment', 'qazana' ),
				'type'    => Controls_Manager::CHOOSE,
				'options' => [
					'left' => [
						'title' => __( 'Left', 'qazana' ),
						'icon'  => 'fa fa-align-left',
					],
					'center' => [
						'title' => __( 'Center', 'qazana' ),
						'icon'  => 'fa fa-align-center',
					],
					'right' => [
						'title' => __( 'Right', 'qazana' ),
						'icon'  => 'fa fa-align-right',
					],
					'justify' => [
						'title' => __( 'Justified', 'qazana' ),
						'icon'  => 'fa fa-align-justify',
					],
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-icon-box-wrapper' => 'text-align: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'content_vertical_alignment',
			[
				'label'   => __( 'Vertical Alignment', 'qazana' ),
				'type'    => Controls_Manager::SELECT,
				'options' => [
					'top'    => __( 'Top', 'qazana' ),
					'middle' => __( 'Middle', 'qazana' ),
					'bottom' => __( 'Bottom', 'qazana' ),
				],
				'default'      => 'top',
                'prefix_class' => 'qazana-vertical-align-',
                'condition' => [
					'position' => [
                        'left',
                        'right'
                    ]
				],
			]
        );

        $this->end_controls_section();

		$this->start_controls_section(
			'section_style_heading',
			[
				'label'     => __( 'Title', 'qazana' ),
				'type'      => Controls_Manager::HEADING,
				'tab'   => Controls_Manager::TAB_STYLE,
            ]
		);

		$this->add_responsive_control(
			'title_bottom_space',
			[
				'label' => __( 'Spacing', 'qazana' ),
				'type'  => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'min' => 0,
						'max' => 100,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-icon-box-title' => 'margin-bottom: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'title_color',
			[
				'label'     => __( 'Color', 'qazana' ),
				'type'      => Controls_Manager::COLOR,
				'default'   => '',
				'selectors' => [
					'{{WRAPPER}} .qazana-icon-box-title' => 'color: {{VALUE}};',
				],
				'scheme' => [
					'type'  => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_1,
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name'     => 'title_typography',
				'selector' => '{{WRAPPER}} .qazana-icon-box-title',
				'scheme'   => Scheme_Typography::TYPOGRAPHY_1,
			]
        );

        $this->end_controls_section();

		$this->start_controls_section(
			'section_style_description',
			[
				'label'     => __( 'Description', 'qazana' ),
				'type'      => Controls_Manager::HEADING,
				'tab'   => Controls_Manager::TAB_STYLE,
            ]
		);

		$this->add_control(
			'description_color',
			[
				'label'     => __( 'Color', 'qazana' ),
				'type'      => Controls_Manager::COLOR,
				'default'   => '',
				'selectors' => [
					'{{WRAPPER}} .qazana-icon-box-description' => 'color: {{VALUE}};',
				],
				'scheme' => [
					'type'  => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_3,
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name'     => 'description_typography',
				'selector' => '{{WRAPPER}} .qazana-icon-box-description',
				'scheme'   => Scheme_Typography::TYPOGRAPHY_3,
			]
		);

		$this->end_controls_section();
	}

	public function before_render() {

		$settings = $this->get_settings();

	    $this->_add_render_attributes();

        if ( ! empty( $settings['link']['url'] ) ) {
            $this->add_render_attribute( 'link', 'href', $settings['link']['url'] );
            $this->icon_tag = 'a';

            if ( ! empty( $settings['link']['is_external'] ) ) {
                $this->add_render_attribute( 'link', 'target', '_blank' );
            }
        }

		if ( $settings['icon_type'] === 'image' ) {

			$filetype = wp_check_filetype( $settings['image']['url'] );

			if ( $filetype['ext'] === 'svg' ) {
				$this->add_render_attribute( 'image', 'class', 'svg-icon-holder svg-baseline' );
				$this->add_render_attribute( 'image', 'data-animation-speed', $settings['svg_animation_speed'] );
				$this->add_render_attribute( 'image', 'data-size', $settings['icon_size']['size'] );
				$this->add_render_attribute( 'image', 'data-animation-delay', $settings['svg_animation_delay'] );
				$this->add_render_attribute( 'image', 'data-color', $settings['icon_color'] );
				$this->add_render_attribute( 'image', 'data-icon', qazana_maybe_ssl_url( $settings['image']['url'] ) );
			}
		}

		?><div <?php $this->render_attribute_string( '_wrapper' ); ?>><?php
	}

	protected function get_render_icon() {

		$settings = $this->get_settings();

		$output = null;

		$this->add_render_attribute( 'icon', 'class', [ 'qazana-icon' ] );

		$icon_attributes = $this->get_render_attribute_string( 'icon' );
		$link_attributes = $this->get_render_attribute_string( 'link' );

		if ( ! empty( $settings['icon'] ) ) {

            if ( 'a' === $this->icon_tag ) {
                $output .= '<'. implode( ' ', [ $this->icon_tag, $icon_attributes, $link_attributes ] ) .'>';
            } else {
                $output .= '<'. $this->icon_tag .' '. $icon_attributes .'>';
            }

			if ( $settings['icon_type'] === 'image' ) {
				$output .= '<span '. $this->get_render_attribute_string( 'image' ) .'><img src="'. qazana_maybe_ssl_url( $settings['image']['url'] ) .'" alt="icon" /></span>';
			} else {
				$output .= '<i '. $this->get_render_attribute_string( 'i' ) .'></i>';
			}

			$output .= '</'. $this->icon_tag .'>';

		}

		return $output;
	}

	protected function get_render_description() {

		$settings = $this->get_settings();

		$output = null;

		$output .= '<'. $settings['title_size'] .' class="qazana-icon-box-title">';
            $output .= '<span>'. $settings['title_text'] .'</span>';
		$output .= '</'. $settings['title_size'].' >';
		$output .= '<p class="qazana-icon-box-description">'. $settings['description_text'] .' </p>';

		return $output;

	}

	protected function render_style_1() {

        $settings = $this->get_settings();

		if ( ! empty( $settings['icon'] ) ) {

		    ?><div class="qazana-icon-box-icon">
				<?php echo $this->get_render_icon(); ?>
		    </div><?php

		}

		?><div class="qazana-icon-box-content">
			<?php echo $this->get_render_description(); ?>
	    </div><?php
    }

    protected function render_style_2() {

        $settings = $this->get_settings();

		$this->add_render_attribute( 'icon', 'class', [ 'qazana-icon', 'qazana-hover-animation-' . $settings['hover_animation_type'] ] );

	    ?><div class="qazana-icon-box-icon front">
	        <div class="front-inner-wrap">

				<?php echo $this->get_render_icon(); ?>

		        <<?php echo $settings['title_size']; ?> class="qazana-icon-box-title">
		            <span><?php echo $settings['title_text']; ?></span>
		        </<?php echo $settings['title_size']; ?>>

	        </div>
	    </div>
	    <div class="qazana-icon-box-content back">
	        <p class="qazana-icon-box-description"><?php echo $settings['description_text']; ?></p>
	    </div><?php

    }

	protected function render_style_3() {

        $settings = $this->get_settings();

		$this->add_render_attribute( 'icon', 'class', [ 'qazana-icon' ] );

        $this->icon_tag = 'span';

        $link_attributes = $this->get_render_attribute_string( 'link' );

	    ?><div class="qazana-icon-box">
			<?php echo $this->get_render_icon(); ?>
			 <div class="qazana-icon-box-content">
				 <?php echo $this->get_render_description(); ?>
		    </div>
		</div><?php

    }

	/**
	 * Render icon box widget output on the frontend.
	 *
	 * Written in PHP and used to generate the final HTML.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	public function render() {
		$settings = $this->get_settings();

		$this->icon_tag = 'span';

		if ( ! empty( $settings['link']['url'] ) ) {
			$this->add_render_attribute( 'link', 'href', $settings['link']['url'] );
			$this->icon_tag = 'a';

			if ( ! empty( $settings['link']['is_external'] ) ) {
				$this->add_render_attribute( 'link', 'target', '_blank' );
			}

			if ( $settings['link']['nofollow'] ) {
				$this->add_render_attribute( 'link', 'rel', 'nofollow' );
			}
		}

		$this->add_render_attribute( 'i', 'class', $settings['icon'] );

		?><div class="qazana-icon-box-wrapper">
            <div class="height-adjust"></div>
            <div class="qazana-icon-box-inner"><?php

                if ( $settings['view'] === 'animated-1' ) {
                    $this->render_style_2();
                } elseif( $settings['view'] === 'align-left' ) {
                    $this->render_style_3();
                } else {
                    $this->render_style_1();
                }

            ?></div>
		</div><?php
	}

	/**
	 * Render icon box widget output in the editor.
	 *
	 * Written as a Backbone JavaScript template and used to generate the live preview.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	protected function _content_template() {}
}
