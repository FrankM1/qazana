<?php
namespace Qazana;

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Qazana alert widget.
 *
 * Qazana widget that displays a collapsible display of content in an toggle
 * style, allowing the user to open multiple items.
 *
 * @since 1.0.0
 */
class Widget_Tooltip extends Widget_Base {

    /**
     * Get widget name.
     *
     * Retrieve alert widget name.
     *
     * @since 1.0.0
     * @access public
     *
     * @return string Widget name.
     */
	public function get_name() {
		return 'tooltip';
	}

    /**
     * Get widget title.
     *
     * Retrieve alert widget title.
     *
     * @since 1.0.0
     * @access public
     *
     * @return string Widget title.
     */
	public function get_title() {
		return __( 'Tooltip', 'qazana' );
	}

    /**
     * Get widget icon.
     *
     * Retrieve alert widget icon.
     *
     * @since 1.0.0
     * @access public
     *
     * @return string Widget icon.
     */
	public function get_icon() {
		return 'fa fa-question-circle-o';
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
        return ['tip', 'hover', 'message'];
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
     * Register alert widget controls.
     *
     * Adds different input fields to allow the user to change and customize the widget settings.
     *
     * @since 1.0.0
     * @access protected
     */
	protected function _register_controls() {

		$this->start_controls_section(
			'section_tooltip',
			[
				'label' => __( 'Tooltip', 'qazana' ),
			]
		);

		$this->add_control(
			'tooltip_editor',
			[
				'label'   => __( 'Text', 'qazana' ),
				'type'    => Controls_Manager::TEXTAREA,
				'default' => __( 'I am a tooltip element. Click the edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'qazana' ),
			]
		);

		$this->add_control(
			'tooltip_state',
			[
				'label'        => __( 'Open tooltip', 'qazana' ),
				'type'         => Controls_Manager::SWITCHER,
				'label_on'     => __( 'Yes', 'qazana' ),
				'label_off'    => __( 'No', 'qazana' ),
				'return_value' => 'show',
				'description'  => __( 'Open tooltip by default.', 'qazana' ),
			]
		);

		$this->add_control(
			'tooltip_position',
			[
				'label'   => __( 'Tooltip position', 'qazana' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'east',
				'options' => [
					'east'       => __( 'East', 'qazana' ),
					'west'       => __( 'West', 'qazana' ),
					'north'      => __( 'North', 'qazana' ),
					'north-east' => __( 'North east', 'qazana' ),
					'north-west' => __( 'North west', 'qazana' ),
					'south'      => __( 'South', 'qazana' ),
					'south-east' => __( 'South east', 'qazana' ),
					'south-west' => __( 'South west', 'qazana' ),
				],
			]
		);

		$this->add_control(
			'tooltip_style',
			[
				'label'   => __( 'Tooltip Accent', 'qazana' ),
				'type'    => Controls_Manager::SELECT,
				'default' => '',
				'options' => [
                    ''       => __( 'Default', 'qazana' ),
					'red'    => __( 'Red', 'qazana' ),
					'green'  => __( 'Green', 'qazana' ),
					'custom' => __( 'Custom', 'qazana' ),
				],
			]
		);

		$this->add_responsive_control(
			'tooltip_icon_size',
			[
				'label'   => __( 'Icon Size', 'qazana' ),
				'type'    => Controls_Manager::SLIDER,
				'default' => [
					'size' => 20
				],
                'range' => [
					'px' => [
						'max' => 50,
					],
				],
				'condition' => [
					'link_icon!' => '',
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-tooltip-icon svg' => 'font-size: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_responsive_control(
			'tooltip_align',
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
				],
				'default'   => 'center',
				'selectors' => [
					'{{WRAPPER}}' => 'text-align: {{VALUE}};',
				],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_tooltip_style',
			[
				'label'     => __( 'Style', 'qazana' ),
				'tab'       => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_group_control(
			Group_Control_Typography:: get_type(),
			[
				'name'     => 'typography',
				'scheme'   => Scheme_Typography::TYPOGRAPHY_3,
				'selector' => '{{WRAPPER}} .qazana-tooltip__content'
			]
		);

		$this->add_control(
            'tooltip_icon_color',
            [
                'label'   => __( 'Icon Color', 'qazana' ),
                'type'    => Controls_Manager::COLOR,
                'default' => '',
                'scheme'  => [
                    'type'  => Scheme_Color::get_type(),
                    'value' => Scheme_Color::COLOR_4,
                ],
                'selectors' => [
                    '{{WRAPPER}} .qazana-tooltip-icon svg path' => 'fill: {{VALUE}};',
                ],
            ]
        );

		$this->add_control(
            'tooltip_text_color',
            [
                'label'     => __( 'Text Color', 'qazana' ),
                'type'      => Controls_Manager::COLOR,
                'default'   => '',
                'selectors' => [
                    '{{WRAPPER}} .qazana-tooltip__content' => 'color: {{VALUE}};',
                ],
            ]
        );

        $this->add_control(
            'tooltip_background_color',
            [
                'label'     => __( 'Background Color', 'qazana' ),
                'type'      => Controls_Manager::COLOR,
                'default'   => '',
                'selectors' => [
                    '{{WRAPPER}} .qazana-tooltip__content'                                                                                                                                    => 'background-color: {{VALUE}};',
                    '{{WRAPPER}} .qazana-tooltip__content.v--north:after, {{WRAPPER}} .qazana-tooltip__content.v--north-east:after, {{WRAPPER}} .qazana-tooltip__content.v--north-west:after' => 'border-top-color: {{VALUE}};',
                    '{{WRAPPER}} .qazana-tooltip__content.v--west:after'                                                                                                                      => 'border-left-color: {{VALUE}};',
                    '{{WRAPPER}} .qazana-tooltip__content.v--south:after, {{WRAPPER}} .qazana-tooltip__content.v--south-east:after, {{WRAPPER}} .qazana-tooltip__content.v--south-west:after' => 'border-bottom-color: {{VALUE}};',
                    '{{WRAPPER}} .qazana-tooltip__content.v--east:after'                                                                                                                      => 'border-color: transparent {{VALUE}} transparent transparent;',
                ],
            ]
        );

        $this->add_control(
            'tooltip_style_color',
            [
                'label'   => __( 'Accent Color', 'qazana' ),
                'type'    => Controls_Manager::COLOR,
                'default' => '',
                'scheme'  => [
                    'type'  => Scheme_Color::get_type(),
                    'value' => Scheme_Color::COLOR_4,
                ],
                'selectors' => [
                    '{{WRAPPER}} .qazana-tooltip__content.v--north, {{WRAPPER}} .qazana-tooltip__content.v--north-east, {{WRAPPER}} .qazana-tooltip__content.v--north-west' => 'border-top-color: {{VALUE}};',
                    '{{WRAPPER}} .qazana-tooltip__content.v--west'                                                                                                                      => 'border-left-color: {{VALUE}};',
                    '{{WRAPPER}} .qazana-tooltip__content.v--south, {{WRAPPER}} .qazana-tooltip__content.v--south-east, {{WRAPPER}} .qazana-tooltip__content.v--south-west' => 'border-bottom-color: {{VALUE}};',
                    '{{WRAPPER}} .qazana-tooltip__content.v--east'                                                                                                                      => 'border-color: transparent {{VALUE}} transparent transparent;',
                ],
            ]
        );

        $this->add_group_control(
            Group_Control_Border:: get_type(),
            [
                'name'      => 'button',
                'label'     => __( 'Border', 'qazana' ),
                'selector'  => '{{WRAPPER}} .qazana-tooltip__content',
                'seperator' => 'before',
            ]
        );

        $this->add_control(
            'button_border_radius',
            [
                'label'      => __( 'Border Radius', 'qazana' ),
                'type'       => Controls_Manager::DIMENSIONS,
                'size_units' => [ 'px', '%' ],
                'selectors'  => [
                    '{{WRAPPER}} .qazana-tooltip__content' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                ],
            ]
        );

        $this->add_group_control(
			Group_Control_Box_Shadow:: get_type(),
			[
				'name'     => 'button',
				'selector' => '{{WRAPPER}} .qazana-tooltip__content',
			]
		);

		$this->end_controls_section();
	}

    /**
     * Render alert widget output on the frontend.
     *
     * Written in PHP and used to generate the final HTML.
     *
     * @since 1.0.0
     * @access protected
     */
	public function render() {

		$settings = $this->get_settings_for_display();

		$this->add_render_attribute( 'tooltip-wrapper', 'class', 'qazana-tooltip');
		$this->add_render_attribute( 'tooltip-icon', 'class', 'qazana-tooltip-icon' );

		if ( $this->get_settings('tooltip_state')  ) {
			$this->add_render_attribute( 'tooltip-wrapper', 'class', 'v--show');
		}

		?><div <?php $this->render_attribute_string( 'tooltip-wrapper' ); ?>>
			<div <?php $this->render_attribute_string( 'tooltip-icon' ); ?>>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="-255 347 100 100" width="14" height="14" class="svg-replaced" shape-rendering="geometricPrecision">
					<path d="M-204.8 370.3c-8 0-14.6 6.5-14.6 14.6 0 2.1 1.7 3.7 3.7 3.7s3.7-1.7 3.7-3.7c0-3.9 3.2-7.1 7.1-7.1 4.1 0 7.1 2.9 7.1 6.8v.3c0 2.2-.6 7.4-7.7 8.5-1.8.3-3.2 1.8-3.2 3.7v10.1c0 2.1 1.7 3.7 3.7 3.7s3.7-1.7 3.7-3.7v-7.1c9.4-2.9 10.9-11 10.9-15.5.2-8-6.4-14.3-14.4-14.3zM-204.8 415.4c-2.7 0-4.8 2.2-4.8 4.8s2.2 4.8 4.8 4.8c2.6 0 4.8-2.2 4.8-4.8s-2.2-4.8-4.8-4.8z"></path>
					<path d="M-204.8 348.4c-26.9 0-48.8 21.9-48.8 48.8s21.9 48.8 48.8 48.8 48.8-21.9 48.8-48.8-21.9-48.8-48.8-48.8zm0 90.2c-22.8 0-41.4-18.6-41.4-41.4 0-22.8 18.6-41.4 41.4-41.4s41.4 18.6 41.4 41.4c-.1 22.8-18.6 41.4-41.4 41.4z"></path>
				</svg>
				<div class="qazana-tooltip__content v--<?php echo $this->get_settings('tooltip_position'); ?> v--border-<?php echo $this->get_settings('tooltip_style'); ?>"><?php echo $this->parse_text_editor( $settings['tooltip_editor'] ); ?></div>
			</div>
		</div><?php

	}

    /**
     * Render alert widget output in the editor.
     *
     * Written as a Backbone JavaScript template and used to generate the live preview.
     *
     * @since 1.0.0
     * @access protected
     */
	protected function _content_template() {
        ?>
        <#
			view.addInlineEditingAttributes( 'tooltip_text', 'none' );
		#>
		<div class="qazana-tooltip v--{{{ settings.tooltip_state }}}">
			<span class="qazana-tooltip-icon">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="-255 347 100 100" width="14" height="14" class="svg-replaced" shape-rendering="geometricPrecision">
					<path d="M-204.8 370.3c-8 0-14.6 6.5-14.6 14.6 0 2.1 1.7 3.7 3.7 3.7s3.7-1.7 3.7-3.7c0-3.9 3.2-7.1 7.1-7.1 4.1 0 7.1 2.9 7.1 6.8v.3c0 2.2-.6 7.4-7.7 8.5-1.8.3-3.2 1.8-3.2 3.7v10.1c0 2.1 1.7 3.7 3.7 3.7s3.7-1.7 3.7-3.7v-7.1c9.4-2.9 10.9-11 10.9-15.5.2-8-6.4-14.3-14.4-14.3zM-204.8 415.4c-2.7 0-4.8 2.2-4.8 4.8s2.2 4.8 4.8 4.8c2.6 0 4.8-2.2 4.8-4.8s-2.2-4.8-4.8-4.8z"></path>
					<path d="M-204.8 348.4c-26.9 0-48.8 21.9-48.8 48.8s21.9 48.8 48.8 48.8 48.8-21.9 48.8-48.8-21.9-48.8-48.8-48.8zm0 90.2c-22.8 0-41.4-18.6-41.4-41.4 0-22.8 18.6-41.4 41.4-41.4s41.4 18.6 41.4 41.4c-.1 22.8-18.6 41.4-41.4 41.4z"></path>
				</svg>
			</span>
			<div class="qazana-tooltip__content v--{{{ settings.tooltip_position }}} v--border-{{{ settings.tooltip_position }}}" {{{ view.getRenderAttributeString( 'tooltip_text' ) }}}>{{ settings.tooltip_editor }}</div>
		</div>
		<?php
	}
}
