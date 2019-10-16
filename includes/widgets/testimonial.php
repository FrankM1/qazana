<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Qazana testimonial widget.
 *
 * Qazana widget that displays customer testimonials that show social proof.
 *
 * @since 1.0.0
 */
class Widget_Testimonial extends Widget_Base {

    /**
	 * Add carousel support.
	 *
	 * Register carousel support in the widget, enables extra controls.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param bool Carousel Support.
	 */
	public $carousel = true;

	/**
	 * Get widget name.
	 *
	 * Retrieve testimonial widget name.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget name.
	 */
	public function get_name() {
		return 'testimonial';
	}

	/**
	 * Get widget title.
	 *
	 * Retrieve testimonial widget title.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget title.
	 */
	public function get_title() {
		return __( 'Testimonial', 'qazana' );
	}

	/**
	 * Get widget icon.
	 *
	 * Retrieve testimonial widget icon.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget icon.
	 */
	public function get_icon() {
		return 'eicon-testimonial-carousel';
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
		return [ 'testimonial', 'blockquote' ];
    }

    /**
	 * Retrieve the list of categories the alert widget belongs to.
	 *
	 * Used to determine where to display the widget in the editor.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return array Widget categories.
	 */
	public function get_categories() {
		return [ 'general' ];
	}

    /**
	 * Add element dependencies
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param return $id  array of script tags.
	 */
	public function add_element_dependencies() {
		$this->add_frontend_stylesheet( 'qazana-slick' );
		$this->add_frontend_script( 'jquery-slick' );
	}

	/**
	 * Register testimonial widget controls.
	 *
	 * Adds different input fields to allow the user to change and customize the widget settings.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	protected function _register_controls() {

		$this->start_controls_section(
			'section_testimonial',
			[
				'label' => __( 'Testimonial', 'qazana' ),
			]
		);

		$repeater = new Repeater();

		$repeater->start_controls_tabs( 'testimonial_repeater' );

		$repeater->start_controls_tab( 'content', [ 'label' => __( 'Content', 'qazana' ) ] );

		$repeater->add_control(
			'testimonial_name',
			[
				'label' => __( 'Name', 'qazana' ),
				'type' => Controls_Manager::TEXT,
				'default' => 'John Doe',
			]
		);

		$repeater->add_control(
			'testimonial_content',
			[
				'label' => __( 'Content', 'qazana' ),
				'type' => Controls_Manager::TEXTAREA,
				'dynamic' => [
					'active' => true,
				],
				'rows' => '10',
				'default' => 'Click the edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
			]
		);

		$repeater->add_control(
			'testimonial_image',
			[
				'label' => __( 'Add Image', 'qazana' ),
				'type' => Controls_Manager::MEDIA,
				'default' => [
					'url' => Utils::get_placeholder_image_src(),
				],
			]
		);

		$repeater->add_control(
			'testimonial_job',
			[
				'label' => __( 'Job', 'qazana' ),
				'type' => Controls_Manager::TEXT,
				'dynamic' => [
					'active' => true,
				],
				'default' => 'Designer',
			]
		);

		$repeater->end_controls_tab();

		$repeater->start_controls_tab( 'style', [ 'label' => __( 'Style', 'qazana' ) ] );

		$repeater->add_responsive_control(
			'testimonial_image_position',
			[
				'label' => __( 'Image Position', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'aside',
				'options' => [
					'aside' => __( 'Aside', 'qazana' ),
					'top' => __( 'Top', 'qazana' ),
				],
				'condition' => [
					'testimonial_image[url]!' => '',
				],
				'separator' => 'before',
			]
		);

		$repeater->add_responsive_control(
			'testimonial_alignment',
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
				],
			]
		);

		$repeater->end_controls_tab();

		$repeater->end_controls_tabs();

		$this->add_control(
			'testimonials',
			[
				'label' => __( 'Slides', 'qazana' ),
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

        $this->add_responsive_control(
			'carousel',
			[
				'label'        => __( 'Enable carousel', 'qazana' ),
				'type'         => Controls_Manager::SWITCHER,
				'default'      => true,
				'return_value' => 'true',
				'render_type'  => 'template',
				'prefix_class' => 'qazana-testimonial-carousel-'
			]
        );

		$this->end_controls_section();

		$this->end_controls_section();

		$this->start_controls_section(
			'section_carousel_settings',
			[
                'label' => __( 'Carousel Settings', 'qazana' ),
                'condition' => [
                    'carousel!' => ''
                ]
			]
		);

		$this->end_controls_section();

		// Content Wrapper
		$this->start_controls_section(
			'section_style_testimonial_content_wrapper',
			[
				'label' => __( 'Content Wrapper', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_group_control(
			Group_Control_Background::get_type(),
			[
				'name' => 'content_wrapper_background',
				'selector' => '{{WRAPPER}} .qazana-testimonial__content-wrapper',
			]
		);

		$this->end_controls_section();

		// Content
		$this->start_controls_section(
			'section_style_testimonial_content',
			[
				'label' => __( 'Content', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'content_background_color',
			[
				'label' => __( 'Content Background Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'default' => '#fff',
				'selectors' => [
					'{{WRAPPER}} .qazana-testimonial__content' => 'background-color: {{VALUE}}',
					'{{WRAPPER}} .qazana-testimonial__content:after' => 'border-top-color: {{VALUE}}'
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
				'selector' => '{{WRAPPER}} .qazana-testimonial__content',
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
				'label' => __( 'Border Radius', 'qazana' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'selectors' => [
					'{{WRAPPER}} .qazana-testimonial__content' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
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
				'selector' => '{{WRAPPER}} .qazana-testimonial__content',
			]
		);

		$this->add_responsive_control(
			'content_padding',
			[
				'label' => __( 'Content Padding', 'qazana' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'default' => array (
					'unit' => 'px',
					'top' => '30',
					'right' => '30',
					'bottom' => '30',
					'left' => '30',
					'isLinked' => true,
				),
				'selectors' => [
					'{{WRAPPER}} .qazana-testimonial__content' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'content_content_color',
			[
				'label' => __( 'Content Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_3,
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-testimonial__content' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'content_typography',
				'label' => __( 'Typography', 'qazana' ),
				'scheme' => Scheme_Typography::TYPOGRAPHY_3,
				'selector' => '{{WRAPPER}} .qazana-testimonial__content',
				'defaults' => [
					'typography' => 'custom',
				    'font_size' => array (
				      	'unit' => 'px',
				      	'size' => '14',
				    ),
				]
			]
		);

		$this->add_responsive_control(
			'content_align',
			[
				'label' => __( 'Description Align', 'qazana' ),
				'type' => Controls_Manager::CHOOSE,
				'label_block' => false,
				'default' => 'left',
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
				'selectors' => [
					 '{{WRAPPER}} .qazana-testimonial__content' => 'text-align: {{VALUE}};',
				 ]
			]
		);

		$this->add_responsive_control(
			'details_align',
			[
				'label' => __( 'Details Align', 'qazana' ),
				'type' => Controls_Manager::CHOOSE,
				'label_block' => false,
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
				'selectors' => [
					 '{{WRAPPER}} .qazana-testimonial__details' => 'text-align: {{VALUE}};',
				 ]
			]
		);

		$this->end_controls_section();

		// Image
		$this->start_controls_section(
			'section_style_testimonial_image',
			[
				'label' => __( 'Image', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		 $this->add_responsive_control(
			'image_size',
			[
				'label' => __( 'Image Size', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'size_units' => [ 'px' ],
				'range' => [
					'px' => [
						'min' => 20,
						'max' => 200,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-testimonial__wrapper .qazana-testimonial__image img' => 'width: {{SIZE}}{{UNIT}};height: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_responsive_control(
		   'image_spacing',
		   [
			   'label' => __( 'Image Spacing', 'qazana' ),
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
				   '{{WRAPPER}} .qazana-testimonial__wrapper .qazana-testimonial__image img' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
			   ],
		   ]
	   );

		$this->add_group_control(
			Group_Control_Border::get_type(),
			[
				'name' => 'image_border',
				'selector' => '{{WRAPPER}} .qazana-testimonial__wrapper .qazana-testimonial__image img',
				'separator' => 'before',
			]
		);

		$this->add_control(
			'image_border_radius',
			[
				'label' => __( 'Border Radius', 'qazana' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'selectors' => [
					'{{WRAPPER}} .qazana-testimonial__wrapper .qazana-testimonial__image img' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->end_controls_section();

		// Name.
		$this->start_controls_section(
			'section_style_testimonial_name',
			[
				'label' => __( 'Name', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'name_text_color',
			[
				'label' => __( 'Text Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_1,
				],
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} .qazana-testimonial__name' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'name_typography',
				'scheme' => Scheme_Typography::TYPOGRAPHY_1,
				'selector' => '{{WRAPPER}} .qazana-testimonial__name',
			]
		);

		$this->end_controls_section();

		// Job.
		$this->start_controls_section(
			'section_style_testimonial_job',
			[
				'label' => __( 'Job', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'job_text_color',
			[
				'label' => __( 'Text Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_2,
				],
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} .qazana-testimonial__job' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'job_typography',
				'scheme' => Scheme_Typography::TYPOGRAPHY_2,
				'selector' => '{{WRAPPER}} .qazana-testimonial__job',
			]
		);

		$this->end_controls_section();
	}

    /**
	 * Render testimonial widget output on the frontend.
	 *
	 * Written in PHP and used to generate the final HTML.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function render() {

		if ( ! $this->get_settings( 'testimonials' ) ) {
            return;
        }

        if ( $this->get_settings( 'carousel' ) ) {

            $this->add_render_attribute( 'slides-wrapper', [
                'class' => [ 'qazana-slides-wrapper', 'qazana-slick-slider', 'qazana-dots-align-' . $this->get_settings_for_display( 'dots_align' ) ],
                'dir' => ( 'rtl' === $this->get_settings_for_display('direction') ) ? 'rtl' : 'ltr',
            ] );

            $this->add_render_attribute( 'slides', [
                'class' => [ 'qazana-slides', esc_attr( $this->get_settings_for_display( 'carousel_class' ) ) ],
                'data-animation' => $this->get_settings_for_display('content_animation'),
                'data-animation-delay' => $this->get_settings_for_display('content_animation_delay'),
            ] );

        }

        ?><div class="qazana-testimonials__wrapper"><?php

            if ( $this->get_settings( 'carousel' ) ) { ?>
                <div <?php $this->render_attribute_string( 'slides-wrapper' ); ?>>
                    <div <?php $this->render_attribute_string( 'slides' ); ?>>
                        <div class="slick-slideshow-large-container-biggie">
                            <div class="slick-slides slick-slides-biggie"><?php
                }

                            foreach ( $this->get_settings( 'testimonials' ) as $item ) :
                                $has_image = false;

                                if ( '' !== $item['testimonial_image']['url'] ) {
                                    $image_url = qazana_maybe_ssl_url( $item['testimonial_image']['url'] );
                                    $has_image = ' qazana-has-image';
                                }

                                ?><div class="qazana-testimonial__wrapper qazana-testimonial__text-align-<?php echo $this->get_item_responsive_settings( 'testimonial_alignment', $item ); ?>">
                                    <div class="qazana-testimonial__content-wrapper">

                                        <?php if ( ! empty( $item['testimonial_content'] ) ) : ?>
                                            <p class="qazana-testimonial__content">
                                                <?php echo $item['testimonial_content']; ?>
                                            </p>
                                        <?php endif; ?>

                                        <div class="qazana-testimonial__meta<?php if ( $has_image ) echo $has_image; ?><?php echo $this->get_item_responsive_settings( 'testimonial_image_position', $item ); ?>">
                                            <div class="qazana-testimonial__meta-inner">
                                                <?php if ( isset( $image_url ) ) : ?>
                                                    <div class="qazana-testimonial__image">
                                                        <img src="<?php echo esc_attr( $image_url ); ?>" alt="<?php echo esc_attr( Control_Media::get_image_alt( $item['testimonial_image'] ) ); ?>" />
                                                    </div>
                                                <?php endif; ?>

                                                <div class="qazana-testimonial__details">
                                                    <?php if ( ! empty( $item['testimonial_name'] ) ) : ?>
                                                        <div class="qazana-testimonial__name">
                                                            <?php echo $item['testimonial_name']; ?>
                                                        </div>
                                                    <?php endif; ?>

                                                    <?php if ( ! empty( $item['testimonial_job'] ) ) : ?>
                                                        <div class="qazana-testimonial__job">
                                                            <?php echo $item['testimonial_job']; ?>
                                                        </div>
                                                    <?php endif; ?>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <?php

                            endforeach;

                            if ( $this->get_settings( 'carousel' ) ) { ?>
					    </div>
				    </div>
			    </div>
            </div>
        <?php } ?>
        </div><?php

	}
}
