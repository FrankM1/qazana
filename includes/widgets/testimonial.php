<?php
namespace Builder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Testimonial extends Widget_Base {

	public function get_name() {
		return 'testimonial';
	}

	public function get_title() {
		return __( 'Testimonial', 'builder' );
	}

	public function get_icon() {
		return 'eicon-testimonial';
	}

	public function get_categories() {
		return [ 'general-elements' ];
	}

	protected function _register_controls() {
		$this->_register_controls_section_testimonial_options();
		$this->_register_controls_section_slider_options();
		$this->_register_controls_section_style_navigation();
	}

	protected function _register_controls_section_testimonial_options() {

		$this->start_controls_section(
			'section_testimonial',
			[
				'label' => __( 'Testimonials', 'builder' ),
			]
		);

		$repeater = new Repeater();

		$repeater->start_controls_tabs( 'testimonial_repeater' );

		$repeater->start_controls_tab( 'content', [ 'label' => __( 'Content', 'builder' ) ] );

		$repeater->add_control(
			'testimonial_name',
			[
				'label' => __( 'Name', 'builder' ),
				'type' => Controls_Manager::TEXT,
				'default' => 'John Doe',
			]
		);

		$repeater->add_control(
			'testimonial_content',
			[
				'label' => __( 'Content', 'builder' ),
				'type' => Controls_Manager::TEXTAREA,
				'rows' => '10',
				'default' => 'Click the edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
			]
		);

		$repeater->add_control(
			'testimonial_image',
			[
				'label' => __( 'Add Image', 'builder' ),
				'type' => Controls_Manager::MEDIA,
				'default' => [
					'url' => Utils::get_placeholder_image_src(),
				],
			]
		);

		$repeater->add_control(
			'testimonial_job',
			[
				'label' => __( 'Job', 'builder' ),
				'type' => Controls_Manager::TEXT,
				'default' => 'Designer',
			]
		);

		$repeater->end_controls_tab();

		$repeater->start_controls_tab( 'style', [ 'label' => __( 'Style', 'builder' ) ] );

		$repeater->add_control(
			'testimonial_image_position',
			[
				'label' => __( 'Image Position', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'aside',
				'options' => [
					'aside' => __( 'Aside', 'builder' ),
					'top' => __( 'Top', 'builder' ),
				],
				'separator' => 'before',
			]
		);

		$repeater->add_control(
			'testimonial_alignment',
			[
				'label' => __( 'Alignment', 'builder' ),
				'type' => Controls_Manager::CHOOSE,
				'default' => 'center',
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
				],
			]
		);

		$repeater->add_control(
			'view',
			[
				'label' => __( 'View', 'builder' ),
				'type' => Controls_Manager::HIDDEN,
				'default' => 'traditional',
			]
		);

		$repeater->end_controls_tab();

		$repeater->end_controls_tabs();

		$this->add_control(
			'testimonials',
			[
				'label' => __( 'Slides', 'builder' ),
				'type' => Controls_Manager::REPEATER,
				'show_label' => true,
				'default' => array (
			       array (
			         'testimonial_name' => 'Maud Boyd',
			         'testimonial_content' => '★ ★ ★ ★ ★<br> "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing."',
			         'testimonial_job' => 'Art Director, Shypogen',
					 'testimonial_alignment' => 'left',
					 'testimonial_image' => array (
			           	'url' => 'https://randomuser.me/api/portraits/men/83.jpg',
			          ),
			       ),
			       array (
			         'testimonial_name' => 'Larry Todd',
			         'testimonial_content' => '★ ★ ★ ★ ★<br> "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing."',
			         'testimonial_job' => 'Manager, Dynomanic',
			         'testimonial_image_position' => 'aside',
			         'testimonial_alignment' => 'left',
					 'testimonial_image' => array (
					   'url' => 'https://randomuser.me/api/portraits/men/83.jpg',
					 ),
			       ),
			       array (
			         'testimonial_name' => 'Larry Todd',
			         'testimonial_content' => '★ ★ ★ ★ ★<br>  "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing."',
			         'testimonial_job' => 'Manager, Dynomanic',
			         'testimonial_image_position' => 'aside',
			         'testimonial_alignment' => 'left',
					 'testimonial_image' => array (
					   'url' => 'https://randomuser.me/api/portraits/men/83.jpg',
					 ),
			       ),
			       array (
			         'testimonial_name' => 'Larry Todd',
			         'testimonial_content' => '★ ★ ★ ★ ★<br> "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing."',
			         'testimonial_job' => 'Manager, Dynomanic',
			         'testimonial_image_position' => 'aside',
			         'testimonial_alignment' => 'left',
					 'testimonial_image' => array (
					   'url' => 'https://randomuser.me/api/portraits/men/83.jpg',
					 ),
			       ),
			       array (
			         'testimonial_name' => 'Larry Todd',
			         'testimonial_content' => '★ ★ ★ ★ ★<br>"Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing."',
			         'testimonial_job' => 'Manager, Dynomanic',
			         'testimonial_image_position' => 'aside',
			         'testimonial_alignment' => 'left',
					 'testimonial_image' => array (
					   'url' => 'https://randomuser.me/api/portraits/men/83.jpg',
					 ),
			       ),
			     ),
				'fields' => array_values( $repeater->get_controls() ),
				'title_field' => '{{{ testimonial_name }}}',
			]
		);

		$this->end_controls_section();

		$this->end_controls_section();

		// Content Wrapper
		$this->start_controls_section(
			'section_style_testimonial_content_wrapper',
			[
				'label' => __( 'Content Wrapper', 'builder' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_group_control(
			Group_Control_Background::get_type(),
			[
				'name' => 'content_wrapper_background',
				'selector' => '{{WRAPPER}} .builder-testimonial-content-wrapper',
			]
		);

		$this->end_controls_section();

		// Content
		$this->start_controls_section(
			'section_style_testimonial_content',
			[
				'label' => __( 'Content', 'builder' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'content_background_color',
			[
				'label' => __( 'Content Background Color', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'default' => '#fff',
				'selectors' => [
					'{{WRAPPER}} .builder-testimonial-content' => 'background-color: {{VALUE}}',
					'{{WRAPPER}} .builder-testimonial-content:after' => 'border-top-color: {{VALUE}}'
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
				'selector' => '{{WRAPPER}} .builder-testimonial-content',
				'defaults' => [
					'border' => 'solid',
					'width' => array(
						'unit' => 'px',
						'top' => '0',
						'right' => '0',
						'bottom' => '0',
						'left' => '0',
						'isLinked' => true,
					),
					'color' => '#ffffff',
					'radius' => array(
						'unit' => 'px',
						'top' => '8',
						'right' => '8',
						'bottom' => '8',
						'left' => '8',
						'isLinked' => true,
					),
				]
			]
		);

		$this->add_control(
			'border_radius',
			[
				'label' => __( 'Border Radius', 'builder' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'selectors' => [
					'{{WRAPPER}} .builder-testimonial-content' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
				'default' => [
					'unit' => 'px',
					'top' => '8',
					'right' => '8',
					'bottom' => '8',
					'left' => '8',
					'isLinked' => true,
				]
			]
		);

		$this->add_group_control(
			Group_Control_Box_Shadow::get_type(),
			[
				'name' => 'content_box_shadow',
				'selector' => '{{WRAPPER}} .builder-testimonial-content',
			]
		);

		$this->add_control(
			'content_padding',
			[
				'label' => __( 'Content Padding', 'builder' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'default' => array (
					'unit' => 'px',
					'top' => '31',
					'right' => '31',
					'bottom' => '31',
					'left' => '31',
					'isLinked' => true,
				),
				'selectors' => [
					'{{WRAPPER}} .builder-testimonial-content' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'content_content_color',
			[
				'label' => __( 'Content Color', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_3,
				],
				'default' => '#848484',
				'selectors' => [
					'{{WRAPPER}} .builder-testimonial-content' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'content_typography',
				'label' => __( 'Typography', 'builder' ),
				'scheme' => Scheme_Typography::TYPOGRAPHY_3,
				'selector' => '{{WRAPPER}} .builder-testimonial-content',
				'defaults' => [
					'typography' => 'custom',
				    'font_size' => array (
				      	'unit' => 'px',
				      	'size' => '14',
				    ),
				]
			]
		);

		$this->add_control(
			'content_align',
			[
				'label' => __( 'Description Align', 'builder' ),
				'type' => Controls_Manager::CHOOSE,
				'label_block' => false,
				'default' => 'left',
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
				'selectors' => [
					 '{{WRAPPER}} .builder-testimonial-content' => 'text-align: {{VALUE}};',
				 ]
			]
		);

		$this->add_control(
			'details_align',
			[
				'label' => __( 'Details Align', 'builder' ),
				'type' => Controls_Manager::CHOOSE,
				'label_block' => false,
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
				'selectors' => [
					 '{{WRAPPER}} .builder-testimonial-details' => 'text-align: {{VALUE}};',
				 ]
			]
		);

		$this->end_controls_section();

		// Image
		$this->start_controls_section(
			'section_style_testimonial_image',
			[
				'label' => __( 'Image', 'builder' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		 $this->add_control(
			'image_size',
			[
				'label' => __( 'Image Size', 'builder' ),
				'type' => Controls_Manager::SLIDER,
				'size_units' => [ 'px' ],
				'range' => [
					'px' => [
						'min' => 20,
						'max' => 200,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .builder-testimonial-wrapper .builder-testimonial-image img' => 'width: {{SIZE}}{{UNIT}};height: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
		   'image_spacing',
		   [
			   'label' => __( 'Image Spacing', 'builder' ),
			   'type' => Controls_Manager::DIMENSIONS,
			   'size_units' => [ 'px' ],
			   'range' => [
				   'px' => [
					   'min' => 20,
					   'max' => 200,
				   ],
			   ],
			   'default' => array(
					'unit' => 'px',
					'top' => '0',
					'right' => '10',
					'bottom' => '0',
					'left' => '0',
					'isLinked' => false,
			   ),
			   'selectors' => [
				   '{{WRAPPER}} .builder-testimonial-wrapper .builder-testimonial-image img' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
			   ],
		   ]
	   );

		$this->add_group_control(
			Group_Control_Border::get_type(),
			[
				'name' => 'image_border',
				'selector' => '{{WRAPPER}} .builder-testimonial-wrapper .builder-testimonial-image img',
			]
		);

		$this->add_control(
			'image_border_radius',
			[
				'label' => __( 'Border Radius', 'builder' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'selectors' => [
					'{{WRAPPER}} .builder-testimonial-wrapper .builder-testimonial-image img' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->end_controls_section();

		// Name
		$this->start_controls_section(
			'section_style_testimonial_name',
			[
				'label' => __( 'Name', 'builder' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'name_text_color',
			[
				'label' => __( 'Text Color', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_1,
				],
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} .builder-testimonial-name' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'name_typography',
				'label' => __( 'Typography', 'builder' ),
				'scheme' => Scheme_Typography::TYPOGRAPHY_1,
				'selector' => '{{WRAPPER}} .builder-testimonial-name',
			]
		);

		$this->end_controls_section();

		// Job
		$this->start_controls_section(
			'section_style_testimonial_job',
			[
				'label' => __( 'Job', 'builder' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'job_text_color',
			[
				'label' => __( 'Text Color', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_2,
				],
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} .builder-testimonial-job' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'job_typography',
				'label' => __( 'Typography', 'builder' ),
				'scheme' => Scheme_Typography::TYPOGRAPHY_2,
				'selector' => '{{WRAPPER}} .builder-testimonial-job',
			]
		);

		$this->end_controls_section();
	}

	protected function _register_controls_section_slider_options() {

		$this->start_controls_section(
			'section_slider_options',
			[
				'label' => __( 'Slider Options', 'builder' ),
				'type' => Controls_Manager::SECTION,
			]
		);

		$slides_to_show = range( 1, 10 );
		$slides_to_show = array_combine( $slides_to_show, $slides_to_show );

		$this->add_control(
			'slides_to_show',
			[
				'label' => __( 'Slides to Show', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'default' => '2',
				'options' => $slides_to_show,
			]
		);

		$this->add_control(
			'slides_to_scroll',
			[
				'label' => __( 'Slides to Scroll', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'default' => '1',
				'options' => $slides_to_show,
				'condition' => [
					'slides_to_show!' => '1',
				],
			]
		);

		$this->add_control(
			'navigation',
			[
				'label' => __( 'Navigation', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'both',
				'options' => [
					'both' => __( 'Arrows and Dots', 'builder' ),
					'arrows' => __( 'Arrows', 'builder' ),
					'dots' => __( 'Dots', 'builder' ),
					'none' => __( 'None', 'builder' ),
				],
			]
		);

		$this->add_control(
			'pause_on_hover',
			[
				'label' => __( 'Pause on Hover', 'builder' ),
				'type' => Controls_Manager::SWITCHER,
				'label_on' => __( 'Yes', 'builder' ),
				'label_off' => __( 'No', 'builder' ),
				'return_value' => 'yes',
				'default' => 'yes',
			]
		);

		$this->add_control(
			'autoplay',
			[
				'label' => __( 'Autoplay', 'builder' ),
				'type' => Controls_Manager::SWITCHER,
				'label_on' => __( 'Yes', 'builder' ),
				'label_off' => __( 'No', 'builder' ),
				'return_value' => 'yes',
				'default' => 'yes',
			]
		);

		$this->add_control(
			'autoplay_speed',
			[
				'label' => __( 'Autoplay Speed (ms)', 'builder' ),
				'type' => Controls_Manager::NUMBER,
				'default' => 5000,
				'condition' => [
					'autoplay' => 'yes',
				],
			]
		);

		$this->add_control(
			'infinite',
			[
				'label' => __( 'Infinite Loop', 'builder' ),
				'type' => Controls_Manager::SWITCHER,
				'label_on' => __( 'Yes', 'builder' ),
				'label_off' => __( 'No', 'builder' ),
				'return_value' => 'yes',
				'default' => 'yes',
			]
		);

		$this->add_control(
			'direction',
			[
				'label' => __( 'Direction', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'ltr',
				'options' => [
					'ltr' => __( 'Left', 'builder' ),
					'rtl' => __( 'Right', 'builder' ),
				],
			]
		);

		$this->add_control(
			'transition',
			[
				'label' => __( 'Transition', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'slide',
				'options' => [
					'slide' => __( 'Slide', 'builder' ),
					'fade' => __( 'Fade', 'builder' ),
				],
			]
		);

		$this->add_control(
			'transition_speed',
			[
				'label' => __( 'Transition Speed (ms)', 'builder' ),
				'type' => Controls_Manager::NUMBER,
				'default' => 500,
			]
		);

		$this->add_control(
			'content_animation',
			[
				'label' => __( 'Content Animation', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'fadeInRight',
				'options' => [
					'' => __( 'None', 'builder' ),
					'fadeInDown' => __( 'Down', 'builder' ),
					'fadeInUp' => __( 'Up', 'builder' ),
					'fadeInRight' => __( 'Right', 'builder' ),
					'fadeInLeft' => __( 'Left', 'builder' ),
					'zoomIn' => __( 'Zoom', 'builder' ),
				],
			]
		);

		$this->end_controls_section();
	}

	protected function _register_controls_section_style_navigation() {

		$this->start_controls_section(
			'section_style_navigation',
			[
				'label' => __( 'Navigation', 'builder' ),
				'tab' => Controls_Manager::TAB_STYLE,
				'condition' => [
					'navigation' => [ 'arrows', 'dots', 'both' ],
				],
			]
		);

		$this->add_control(
			'heading_style_arrows',
			[
				'label' => __( 'Arrows', 'builder' ),
				'type' => Controls_Manager::HEADING,
				'separator' => 'before',
				'condition' => [
					'navigation' => [ 'arrows', 'both' ],
				],
			]
		);

		$this->add_control(
			'arrows_size',
			[
				'label' => __( 'Arrows Size', 'builder' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'min' => 20,
						'max' => 60,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .builder-slides-wrapper .slick-slider .slick-prev:before, {{WRAPPER}} .builder-slides-wrapper .slick-slider .slick-next:before' => 'font-size: {{SIZE}}{{UNIT}};',
				],
				'condition' => [
					'navigation' => [ 'arrows', 'both' ],
				],
			]
		);

		$this->add_control(
			'arrows_color',
			[
				'label' => __( 'Arrows Color', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .builder-slides-wrapper .slick-slider .slick-prev:before, {{WRAPPER}} .builder-slides-wrapper .slick-slider .slick-next:before' => 'color: {{VALUE}};',
				],
				'condition' => [
					'navigation' => [ 'arrows', 'both' ],
				],
			]
		);

		$this->add_control(
			'arrows_position',
			[
				'label' => __( 'Arrows Position', 'builder' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px' ],
				'allowed_dimensions' => 'horizontal',
				'placeholder' => [
					'top' => 'auto',
					'right' => '',
					'bottom' => 'auto',
					'left' => '',
				],
				'default' =>
				array (
				  'unit' => 'px',
				  'top' => 0,
				  'right' => '-40',
				  'bottom' => 0,
				  'left' => '-40',
				  'isLinked' => false,
				),
				'selectors' => [
					'{{WRAPPER}} .builder-slides-wrapper .builder-slides div.slick-navigation a.prev' => 'left: {{LEFT}}{{UNIT}};',
					'{{WRAPPER}} .builder-slides-wrapper .builder-slides div.slick-navigation a.next' => 'right: {{RIGHT}}{{UNIT}};',

				],
				'condition' => [
					'navigation' => [ 'dots', 'both' ],
				],
			]
		);

		$this->add_control(
			'heading_style_dots',
			[
				'label' => __( 'Dots', 'builder' ),
				'type' => Controls_Manager::HEADING,
				'separator' => 'before',
				'condition' => [
					'navigation' => [ 'dots', 'both' ],
				],
			]
		);

		$this->add_control(
			'dots_size',
			[
				'label' => __( 'Dots Size', 'builder' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'min' => 5,
						'max' => 15,
					],
				],
				'default' =>
			    array (
			      'unit' => 'px',
			      'size' => 11,
			    ),
				'selectors' => [
					'{{WRAPPER}} .builder-slides-wrapper .builder-slides .slick-dots li button' => 'width: {{SIZE}}{{UNIT}};',
					'{{WRAPPER}} .builder-slides-wrapper .builder-slides .slick-dots li button' => 'line-height: {{SIZE}}{{UNIT}};',
					'{{WRAPPER}} .builder-slides-wrapper .builder-slides .slick-dots li button:before' => 'width: {{SIZE}}{{UNIT}};',
					'{{WRAPPER}} .builder-slides-wrapper .builder-slides .slick-dots li button:before' => 'height: {{SIZE}}{{UNIT}};',
					'{{WRAPPER}} .builder-slides-wrapper .builder-slides .slick-dots li button:before' => 'line-height: {{SIZE}}{{UNIT}};',
				],
				'condition' => [
					'navigation' => [ 'dots', 'both' ],
				],
			]
		);

		$this->add_control(
			'dots_position_bottom',
			[
				'label' => __( 'Dots Position', 'builder' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'min' => -100,
						'max' => 100,
					],
				],
				'default' => array(
			      'unit' => 'px',
			      'size' => '-20',
			    ),
				'selectors' => [
					'{{WRAPPER}} .builder-slides-wrapper .builder-slides .slick-dots' => 'bottom: {{SIZE}}{{UNIT}};',
				],
				'condition' => [
					'navigation' => [ 'dots', 'both' ],
				],
			]
		);

		$this->add_control(
			'dots_color',
			[
				'label' => __( 'Dots Color', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .builder-slides-wrapper .builder-slides .slick-dots li button' => 'border-color: {{VALUE}};',
					'{{WRAPPER}} .builder-slides-wrapper .builder-slides .slick-dots li button:before' => 'background-color: {{VALUE}};',
				],
				'default' => '#4054b2',
				'condition' => [
					'navigation' => [ 'dots', 'both' ],
				],
			]
		);

		$this->add_control(
			'dots_align',
			[
				'label' => __( 'Dots Align', 'builder' ),
				'type' => Controls_Manager::CHOOSE,
				'label_block' => false,
				'default' => 'center',
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
				'conditions' => [
					'navigation' => [ 'dots', 'both' ],
				],
			]
		);

		$this->end_controls_section();
	}

	protected function render() {
		$settings = $this->get_settings();
		$testimonials = $this->get_settings( 'testimonials' );

		if ( empty( $settings['testimonials'] ) )
			return;

		$is_slideshow = '1' === $settings['slides_to_show'];
		$is_rtl = ( 'rtl' === $settings['direction'] );
		$direction = $is_rtl ? 'rtl' : 'ltr';
		$show_dots = ( in_array( $settings['navigation'], [ 'dots', 'both' ] ) );
		$show_arrows = ( in_array( $settings['navigation'], [ 'arrows', 'both' ] ) );

		$slick_options = [
			'slidesToShow' => absint( $settings['slides_to_show'] ),
			'autoplaySpeed' => absint( $settings['autoplay_speed'] ),
			'autoplay' => ( 'yes' === $settings['autoplay'] ),
			'infinite' => ( 'yes' === $settings['infinite'] ),
			'pauseOnHover' => ( 'yes' === $settings['pause_on_hover'] ),
			'speed' => absint( $settings['transition_speed'] ),
			'arrows' => $show_arrows,
			'dots' => $show_dots,
			'rtl' => $is_rtl,
		];

		if ( 'fade' === $settings['transition'] ) {
			$slick_options['fade'] = true;
		}

		if ( ! $is_slideshow ) {
			$slick_options['slidesToScroll'] = absint( $settings['slides_to_scroll'] );
		} else {
			$slick_options['fade'] = ( 'fade' === $settings['transition'] );
		}

		$carousel_classes = [ 'builder-slides' ];

		$this->add_render_attribute( 'slides', [
			'class' => $carousel_classes,
			'data-slider_options' => wp_json_encode( $slick_options ),
			'data-animation' => $settings['content_animation'],
		] );

		$counter = 1;

		?><div class="builder-testimonials-wrapper">
			<div class="builder-slides-wrapper builder-slick-slider builder-dots-align-<?php echo $settings['dots_align']; ?>" dir="<?php echo $direction; ?>">
				<div <?php echo $this->get_render_attribute_string( 'slides' ); ?>>
					<div class="slick-slideshow-large-container-biggie">
						<div class="slick-slides slick-slides-biggie"><?php
								foreach ( $testimonials as $item ) :

									$has_image = false;
									if ( '' !== $item['testimonial_image']['url'] ) {
										$image_url = builder_maybe_ssl_url( $item['testimonial_image']['url'] );
										$has_image = ' builder-has-image';
									}

									$testimonial_alignment = $item['testimonial_alignment'] ? ' builder-testimonial-text-align-' . $item['testimonial_alignment'] : '';
									$testimonial_image_position = $item['testimonial_image_position'] ? ' builder-testimonial-image-position-' . $item['testimonial_image_position'] : '';

									?><div class="builder-testimonial-wrapper<?php echo $testimonial_alignment; ?>">
										<div class="builder-testimonial-content-wrapper">

											<?php if ( ! empty( $item['testimonial_content'] ) ) : ?>
												<div class="builder-testimonial-content">
													<?php echo $item['testimonial_content']; ?>
												</div>
											<?php endif; ?>

											<div class="builder-testimonial-meta<?php if ( $has_image ) echo $has_image; ?><?php echo $testimonial_image_position; ?>">
												<div class="builder-testimonial-meta-inner">
													<?php if ( isset( $image_url ) ) : ?>
														<div class="builder-testimonial-image">
															<img src="<?php echo esc_attr( $image_url ); ?>" alt="<?php echo esc_attr( Control_Media::get_image_alt( $item['testimonial_image'] ) ); ?>" />
														</div>
													<?php endif; ?>

													<div class="builder-testimonial-details">
														<?php if ( ! empty( $item['testimonial_name'] ) ) : ?>
															<div class="builder-testimonial-name">
																<?php echo $item['testimonial_name']; ?>
															</div>
														<?php endif; ?>

														<?php if ( ! empty( $item['testimonial_job'] ) ) : ?>
															<div class="builder-testimonial-job">
																<?php echo $item['testimonial_job']; ?>
															</div>
														<?php endif; ?>
													</div>
												</div>
											</div>
										</div>
									</div>
								<?php $counter++;

							endforeach;
					?></div>
				</div>
			</div>
		</div>
	</div><?php

	}

	protected function _content_template() { }
}
