<?php
namespace Qazana;

add_action( 'qazana/element/after_section_start', '\Qazana\register_controls_section_carousel_settings', 10, 3);
/**
 * Undocumented function
 *
 * @param [type] $element
 * @param [type] $section_id
 * @param [type] $args
 * @return void
 */
function register_controls_section_carousel_settings( Controls_Stack $element, string $section_id, array $args ) {

    if ( empty( $element->carousel ) || ! $element->carousel || $section_id !== 'section_carousel_settings' ) {
        return;
    }

    $slides_to_show = range( 1, 10 );
    $slides_to_show = array_combine( $slides_to_show, $slides_to_show );
    $slides_to_show[''] = __( 'Default', 'qazana' );
    array_unshift( $slides_to_show, '' );

    $element->add_responsive_control(
        'slidesToShow',
        [
            'label'              => __( 'Slides to Show', 'qazana' ),
            'type'               => Controls_Manager::SELECT,
            'default'            => 2,
            'options'            => $slides_to_show,
            'frontend_available' => true,
        ]
    );

    $element->add_responsive_control(
        'slidesToScroll',
        [
            'label'     => __( 'Slides to Scroll', 'qazana' ),
            'type'      => Controls_Manager::SELECT,
            'default'   => 1,
            'options'   => $slides_to_show,
            'condition' => [
                'slidesToShow!' => '1',
            ],
            'frontend_available' => true,
        ]
    );

    $element->add_responsive_control(
        'autoplay',
        [
            'label'              => __( 'Autoplay', 'qazana' ),
            'type'               => Controls_Manager::SWITCHER,
            'label_on'           => __( 'Yes', 'qazana' ),
            'label_off'          => __( 'No', 'qazana' ),
            'return_value'       => 'yes',
            'default'            => 'yes',
            'frontend_available' => true,
        ]
    );

    $element->add_control(
        'autoplaySpeed',
        [
            'label'              => __( 'Autoplay Speed (ms)', 'qazana' ),
            'type'               => Controls_Manager::NUMBER,
            'default'            => 5000,
            'frontend_available' => true,
            'condition'          => [
                'autoplay!' => '',
            ],
        ]
    );

    $element->add_control(
        'pauseOnHover',
        [
            'label'              => __( 'Pause on Hover', 'qazana' ),
            'type'               => Controls_Manager::SWITCHER,
            'label_on'           => __( 'Yes', 'qazana' ),
            'label_off'          => __( 'No', 'qazana' ),
            'return_value'       => 'yes',
            'default'            => 'yes',
            'frontend_available' => true,
            'condition'          => [
                'autoplay!' => '',
            ],
        ]
    );

    $element->add_control(
        'infinite',
        [
            'label'              => __( 'Infinite Loop', 'qazana' ),
            'type'               => Controls_Manager::SWITCHER,
            'label_on'           => __( 'Yes', 'qazana' ),
            'label_off'          => __( 'No', 'qazana' ),
            'return_value'       => 'yes',
            'default'            => 'yes',
            'frontend_available' => true,
        ]
    );

    $element->add_control(
        'effect',
        [
            'label'              => __( 'Transition', 'qazana' ),
            'type'               => Controls_Manager::SELECT,
            'default'            => 'slide',
            'frontend_available' => true,
            'options'            => [
                'slide' => __( 'Slide', 'qazana' ),
                'fade'  => __( 'Fade', 'qazana' ),
            ],
        ]
    );

    $element->add_control(
        'direction',
        [
            'label'              => __( 'Direction', 'qazana' ),
            'type'               => Controls_Manager::SELECT,
            'default'            => 'ltr',
            'frontend_available' => true,
            'options'            => [
                'ltr' => __( 'Left', 'qazana' ),
                'rtl' => __( 'Right', 'qazana' ),
            ],
        ]
    );

    $element->add_control(
        'speed',
        [
            'label'              => __( 'Transition Speed (ms)', 'qazana' ),
            'type'               => Controls_Manager::NUMBER,
            'default'            => 500,
            'frontend_available' => true,
        ]
    );

    $element->add_responsive_control(
        'navigation',
        [
            'label'   => __( 'Navigation', 'qazana' ),
            'type'    => Controls_Manager::SELECT,
            'default' => 'both',
            'options' => [
                ''       => __( 'Default', 'qazana' ),
                'both'   => __( 'Arrows and Dots', 'qazana' ),
                'arrows' => __( 'Arrows', 'qazana' ),
                'dots'   => __( 'Dots', 'qazana' ),
                'none'   => __( 'None', 'qazana' ),
            ],
            'frontend_available' => true,
        ]
    );

    $element->add_control(
        'content_animation',
        [
            'label'   => __( 'Content Animation', 'qazana' ),
            'type'    => Controls_Manager::SELECT,
            'default' => 'fadeInUp',
            'options' => [
                ''            => __( 'None', 'qazana' ),
                'fadeInDown'  => __( 'Down', 'qazana' ),
                'fadeInUp'    => __( 'Up', 'qazana' ),
                'fadeInRight' => __( 'Right', 'qazana' ),
                'fadeInLeft'  => __( 'Left', 'qazana' ),
                'zoomIn'      => __( 'Zoom', 'qazana' ),
            ],
        ]
    );

    $element->add_control(
        'content_animation_delay',
        [
            'label'   => __( 'Content Animation Delay', 'qazana' ),
            'type'    => Controls_Manager::TEXT,
            'default' => '200',
        ]
    );

    $element->add_control(
        'carousel_class',
        [
            'label'       => esc_html__( 'Carousel Class', 'qazana' ),
            'type'        => Controls_Manager::TEXT,
            'default'     => '',
            'description' => esc_html__( 'Class added to the carousel item (e.g., ".my-nav-carousel")', 'qazana' ),
        ]
    );

    $element->add_control(
        'asNavFor',
        [
            'label'       => esc_html__( 'Sync With', 'qazana' ),
            'type'        => Controls_Manager::TEXT,
            'default'     => '',
            'description' => esc_html__( 'Selector of another carousel to sync with (e.g., ".my-other-nav-carousel")', 'qazana' ),
        ]
    );
    
}

add_action( 'qazana/element/after_section_end', '\Qazana\register_controls_section_style_arrows_navigation', 10, 3);
/**
 * Undocumented function
 *
 * @param [type] $element
 * @param [type] $section_id
 * @param [type] $args
 * @return void
 */
function register_controls_section_style_arrows_navigation( Controls_Stack $element, $section_id, $args ) {

    if ( empty( $element->carousel ) || ! $element->carousel || $section_id !== 'section_carousel_settings' ) {
        return;
    }

    $element->start_controls_section(
        'section_style_navigation_arrows',
        [
            'label'     => __( 'Navigation Arrows', 'qazana' ),
            'tab'       => Controls_Manager::TAB_STYLE,
            'condition' => [
                'navigation!' => 'none',
            ],
        ]
    );

    $element->start_controls_tabs( 'tabs_arrows_navigation' );

    $element->start_controls_tab(
        'tab_arrows_navigation_default',
        [
            'label' => __( 'Default', 'qazana' ),
        ]
    );

    $element->add_control(
        'arrows_size',
        [
            'label' => __( 'Size', 'qazana' ),
            'type'  => Controls_Manager::SLIDER,
            'range' => [
                'px' => [
                    'min' => 20,
                    'max' => 60,
                ],
            ],
            'selectors' => [
                '{{WRAPPER}} div.slick-navigation .prev, {{WRAPPER}} div.slick-navigation .next' => 'font-size: {{SIZE}}{{UNIT}};',
            ],
            'condition' => [
                'navigation' => [ 'arrows', 'both' ],
            ],
        ]
    );

    $element->add_control(
        'arrows_color',
        [
            'label'     => __( 'Color', 'qazana' ),
            'type'      => Controls_Manager::COLOR,
            'selectors' => [
                '{{WRAPPER}} div.slick-navigation .prev, {{WRAPPER}} div.slick-navigation .next' => 'color: {{VALUE}}; border-color: {{VALUE}};',
            ],
            'condition' => [
                'navigation' => [ 'arrows', 'both' ],
            ],
        ]
    );

    $element->add_group_control(
        Group_Control_Border::get_type(),
        [
            'name' => 'arrows_border',
            'selector' => '{{WRAPPER}} div.slick-navigation .prev, {{WRAPPER}} div.slick-navigation .next',
        ]
    );

    $element->add_control(
        'arrows_border_radius',
        [
            'label'      => __( 'Border Radius', 'qazana' ),
            'type'       => Controls_Manager::DIMENSIONS,
            'size_units' => [ 'px', '%' ],
            'selectors'  => [
                '{{WRAPPER}} div.slick-navigation .prev, {{WRAPPER}} div.slick-navigation .next' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
            ],
        ]
    );

    $element->add_control(
        'arrows_position',
        [
            'label'              => __( 'Position', 'qazana' ),
            'type'               => Controls_Manager::DIMENSIONS,
            'size_units'         => [ 'px' ],
            'allowed_dimensions' => 'horizontal',
            'placeholder'        => [
                'top'    => 'auto',
                'right'  => '',
                'bottom' => 'auto',
                'left'   => '',
            ],
            'default' => array(
                'unit'     => 'px',
                'top'      => 0,
                'right'    => '-60',
                'bottom'   => 0,
                'left'     => '-60',
                'isLinked' => false,
            ),
            'selectors' => [
                '{{WRAPPER}} div.slick-navigation a.prev' => 'left: {{LEFT}}{{UNIT}};',
                '{{WRAPPER}} div.slick-navigation a.next' => 'right: {{RIGHT}}{{UNIT}};',

            ],
            'condition' => [
                'navigation' => [ 'arrows', 'both' ],
            ],
        ]
    );

    $element->add_control(
        'arrows_v_position',
        [
            'label' => __( 'Vertical Position', 'qazana' ),
            'type'  => Controls_Manager::SLIDER,
            'range' => [
                '%' => [
                    'min' => -150,
                    'max' => 150,
                ],
            ],
            'size_units' => [ '%', 'px' ],
            'default' => array(
                'unit' => '%',
                'size' => '50',
            ),
            'selectors' => [
                '{{WRAPPER}} div.slick-navigation a.prev, {{WRAPPER}} div.slick-navigation a.next' => 'top: {{SIZE}}{{UNIT}};',
            ],
            'condition' => [
                'navigation' => [ 'arrows', 'both' ],
            ],
        ]
    );

    $element->end_controls_tab();

    $element->start_controls_tab(
        'tab_arrows_hover',
        [
            'label' => __( 'Hover', 'qazana' ),
        ]
    );

    $element->add_control(
        'arrows_hover_color',
        [
            'label'     => __( 'Color', 'qazana' ),
            'type'      => Controls_Manager::COLOR,
            'selectors' => [
                '{{WRAPPER}} div.slick-navigation .prev:hover, {{WRAPPER}} div.slick-navigation .next:hover' => 'color: {{VALUE}};',
            ],
            'condition' => [
                'navigation' => [ 'arrows', 'both' ],
            ],
        ]
    );

    $element->add_control(
        'arrows_hover_background_color',
        [
            'label'     => __( 'Background Color', 'qazana' ),
            'type'      => Controls_Manager::COLOR,
            'selectors' => [
                '{{WRAPPER}} div.slick-navigation .prev:hover, {{WRAPPER}} div.slick-navigation .next:hover' => 'background-color: {{VALUE}};',
            ],
            'condition' => [
                'navigation' => [ 'arrows', 'both' ],
            ],
        ]
    );

    $element->add_control(
        'arrows_hover_border_color',
        [
            'label'     => __( 'Border Color', 'qazana' ),
            'type'      => Controls_Manager::COLOR,
            'selectors' => [
                '{{WRAPPER}} div.slick-navigation .prev:hover, {{WRAPPER}} div.slick-navigation .next:hover' => 'border-color: {{VALUE}};',
            ],
            'condition' => [
                'navigation' => [ 'arrows', 'both' ],
            ],
        ]
    );

    $element->end_controls_tab();

    $element->end_controls_tabs();

    $element->end_controls_section();
}

add_action( 'qazana/element/after_section_end', '\Qazana\register_controls_section_style_bullets_navigation', 10, 3);
/**
 * Undocumented function
 *
 * @param [type] $element
 * @param [type] $section_id
 * @param [type] $args
 * @return void
 */
function register_controls_section_style_bullets_navigation( Controls_Stack $element, $section_id, $args ) {

    if ( empty( $element->carousel ) || ! $element->carousel || $section_id !== 'section_carousel_settings' ) {
        return;
    }

    $element->start_controls_section(
        'section_style_bullet_navigation',
        [
            'label'     => __( 'Bullet Navigation Style', 'qazana' ),
            'tab'       => Controls_Manager::TAB_STYLE,
            'condition' => [
                'navigation!' => 'none',
            ],
        ]
    );

    $element->start_controls_tabs( 'tabs_bullet_navigation' );

    $element->start_controls_tab(
        'tab_bullet_navigation_default',
        [
            'label' => __( 'Default', 'qazana' ),
        ]
    );

    $element->add_control(
        'dots_size',
        [
            'label' => __( 'Size', 'qazana' ),
            'type'  => Controls_Manager::SLIDER,
            'range' => [
                'px' => [
                    'step' => 2,
                    'min'  => 2,
                    'max'  => 30,
                ],
            ],
            'selectors' => [
                '{{WRAPPER}} ul.slick-dots li button' => 'width: {{SIZE}}{{UNIT}}; height: {{SIZE}}{{UNIT}};',
            ],
            'condition' => [
                'navigation' => [ 'dots', 'both' ],
            ],
        ]
    );

    $element->add_control(
        'dots_spacing',
        [
            'label' => __( 'Spacing', 'qazana' ),
            'type'  => Controls_Manager::SLIDER,
            'range' => [
                'px' => [
                    'step' => 1,
                    'min'  => 0,
                    'max'  => 30,
                ],
            ],
            'selectors' => [
                '{{WRAPPER}} ul.slick-dots li' => 'margin:0 {{SIZE}}{{UNIT}};',
            ],
            'condition' => [
                'navigation' => [ 'dots', 'both' ],
            ],
        ]
    );

    $element->add_control(
        'dots_h_position',
        [
            'label' => __( 'Horizontal Position', 'qazana' ),
            'type'  => Controls_Manager::SLIDER,
            'range' => [
                '%' => [
                    'min' => -150,
                    'max' => 150,
                ],
            ],
            'size_units' => [ '%', 'px' ],
            'selectors' => [
                '{{WRAPPER}} .slick-dots' => 'left: {{SIZE}}{{UNIT}};',
            ],
            'condition' => [
                'navigation' => [ 'dots', 'both' ],
            ],
        ]
    );

    $element->add_control(
        'dots_position_bottom',
        [
            'label' => __( 'Vertical Position', 'qazana' ),
            'type'  => Controls_Manager::SLIDER,
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
                '{{WRAPPER}} .slick-dots' => 'bottom: {{SIZE}}{{UNIT}};',
            ],
            'condition' => [
                'navigation' => [ 'dots', 'both' ],
            ],
        ]
    );

    $element->add_control(
        'dots_color',
        [
            'label'     => __( 'Color', 'qazana' ),
            'type'      => Controls_Manager::COLOR,
            'selectors' => [
                '{{WRAPPER}} .slick-dots li button'        => 'border-color: {{VALUE}};',
                '{{WRAPPER}} .slick-dots li button:before' => 'background-color: {{VALUE}};',
            ],
            'condition' => [
                'navigation' => [ 'dots', 'both' ],
            ],
        ]
    );

    $element->add_control(
        'dots_align',
        [
            'label'       => __( 'Align', 'qazana' ),
            'type'        => Controls_Manager::CHOOSE,
            'label_block' => false,
            'default'     => 'center',
            'options'     => [
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
            ],
            'condition' => [
                'navigation' => [ 'dots', 'both' ],
            ],
        ]
    );

    $element->end_controls_tab();

    $element->start_controls_tab(
        'tab_bullets_active',
        [
            'label' => __( 'Active', 'qazana' ),
        ]
    );

    $element->add_control(
        'active_dots_color',
        [
            'label'     => __( 'Color', 'qazana' ),
            'type'      => Controls_Manager::COLOR,
            'selectors' => [
                '{{WRAPPER}} .slick-dots li.slick-active button'        => 'border-color: {{VALUE}};',
                '{{WRAPPER}} .slick-dots li.slick-active button:before' => 'background-color: {{VALUE}};',
            ],
            'condition' => [
                'navigation' => [ 'dots', 'both' ],
            ],
        ]
    );

    $element->add_control(
        'active_dots_size',
        [
            'label' => __( 'Size', 'qazana' ),
            'type'  => Controls_Manager::SLIDER,
            'range' => [
                'px' => [
                    'step' => 2,
                    'min'  => 2,
                    'max'  => 30,
                ],
            ],
            'selectors' => [
                '{{WRAPPER}} .slick-dots li.slick-active button' => 'width: {{SIZE}}{{UNIT}}; height: {{SIZE}}{{UNIT}};',
            ],
            'condition' => [
                'navigation' => [ 'dots', 'both' ],
            ],
        ]
    );

    $element->end_controls_tab();

    $element->end_controls_tabs();

    $element->end_controls_section();
}
