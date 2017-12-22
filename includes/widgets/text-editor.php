<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Text Editor Widget
 */
class Widget_Text_Editor extends Widget_Base {

	/**
	 * Retrieve text editor widget name.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget name.
	 */
	public function get_name() {
		return 'text-editor';
	}

	/**
	 * Retrieve text editor widget title.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget title.
	 */
	public function get_title() {
		return __( 'Text Editor', 'qazana' );
	}

	/**
	 * Retrieve text editor widget icon.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget icon.
	 */
	public function get_icon() {
		return 'eicon-align-left';
	}

	/**
	 * Register text editor widget controls.
	 *
	 * Adds different input fields to allow the user to change and customize the widget settings.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	protected function _register_controls() {
		$this->start_controls_section(
			'section_editor',
			[
				'label' => __( 'Text Editor', 'qazana' ),
			]
		);

		$this->add_control(
			'editor',
			[
				'label'   => '',
				'type'    => Controls_Manager::WYSIWYG,
				'default' => __( 'I am a text block. Click the edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.', 'qazana' ),
			]
		);

		$this->add_control(
			'drop_cap',[
				'label'              => __( 'Drop Cap', 'qazana' ),
				'type'               => Controls_Manager::SWITCHER,
				'label_off'          => __( 'Off', 'qazana' ),
				'label_on'           => __( 'On', 'qazana' ),
				'prefix_class'       => 'qazana-drop-cap-',
				'frontend_available' => true,
			]
        );

        $this->add_responsive_control(
			'max_width',
			[
				'label'      => _x( 'Max width', 'Size Control', 'qazana' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => [ '%', 'px', 'em', 'rem' ],
				'range'      => [
					'px' => [
						'min' => 10,
						'max' => 2000,
					],
				],
				'responsive' => true,
				'selectors'  => [
					'{{WRAPPER}} .qazana-wrapper' => 'max-width: {{SIZE}}{{UNIT}};',
				],
			]
        );
        
        $this->add_responsive_control(
            'bottom_space',
            [
                'label' => __( 'Bottom Spacing', 'qazana' ),
                'type'  => Controls_Manager::SLIDER,
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 100,
                    ],
                ],
                'selectors' => [
                    '{{WRAPPER}} .qazana-wrapper p' => 'margin-bottom: {{SIZE}}{{UNIT}};',
                ],
            ]
        );

		$this->add_responsive_control(
			'align',
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
				'prefix_class' => 'qazana-align-',
				'render_type'  => 'template',
			]
        );

		$this->end_controls_section();

		$this->start_controls_section(
			'section_style',
			[
				'label' => __( 'Text Editor', 'qazana' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'text_color',
			[
				'label'     => __( 'Text Color', 'qazana' ),
				'type'      => Controls_Manager::COLOR,
				'default'   => '',
				'selectors' => [
					'{{WRAPPER}}, {{WRAPPER}} .qazana-wrapper p' => 'color: {{VALUE}};',
				],
				'scheme' => [
					'type'  => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_3,
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography:: get_type(),
			[
				'name'     => 'typography',
				'scheme'   => Scheme_Typography::TYPOGRAPHY_3,
				'selector' => '{{WRAPPER}}, {{WRAPPER}} .qazana-wrapper p'
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_drop_cap',
			[
				'label'     => __( 'Drop Cap', 'qazana' ),
				'tab'       => Controls_Manager::TAB_STYLE,
				'condition' => [
					'drop_cap' => 'yes',
				],
			]
		);

		$this->add_control(
			'drop_cap_view',
			[
				'label'   => __( 'View', 'qazana' ),
				'type'    => Controls_Manager::SELECT,
				'options' => [
					'default' => __( 'Default', 'qazana' ),
					'stacked' => __( 'Stacked', 'qazana' ),
					'framed'  => __( 'Framed', 'qazana' ),
				],
				'default'      => 'default',
				'prefix_class' => 'qazana-drop-cap-view-',
				'condition'    => [
					'drop_cap' => 'yes',
				],
			]
		);

		$this->add_control(
			'drop_cap_primary_color',
			[
				'label'     => __( 'Primary Color', 'qazana' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}}.qazana-drop-cap-view-stacked .qazana-drop-cap'                                                           => 'background-color: {{VALUE}};',
					'{{WRAPPER}}.qazana-drop-cap-view-framed .qazana-drop-cap, {{WRAPPER}}.qazana-drop-cap-view-default .qazana-drop-cap' => 'color: {{VALUE}}; border-color: {{VALUE}};',
				],
				'scheme' => [
					'type'  => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_1,
				],
				'condition' => [
					'drop_cap' => 'yes',
				],
			]
		);

		$this->add_control(
			'drop_cap_secondary_color',
			[
				'label'     => __( 'Secondary Color', 'qazana' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}}.qazana-drop-cap-view-framed .qazana-drop-cap'  => 'background-color: {{VALUE}};',
					'{{WRAPPER}}.qazana-drop-cap-view-stacked .qazana-drop-cap' => 'color: {{VALUE}};',
				],
				'condition' => [
					'drop_cap_view!' => 'default',
				],
			]
		);

		$this->add_control(
			'drop_cap_size',
			[
				'label'   => __( 'Size', 'qazana' ),
				'type'    => Controls_Manager::SLIDER,
				'default' => [
					'size' => 5,
				],
				'range' => [
					'px' => [
						'max' => 30,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-drop-cap' => 'padding: {{SIZE}}{{UNIT}};',
				],
				'condition' => [
					'drop_cap_view!' => 'default',
				],
			]
		);

		$this->add_control(
			'drop_cap_space',
			[
				'label'   => __( 'Space', 'qazana' ),
				'type'    => Controls_Manager::SLIDER,
				'default' => [
					'size' => 10,
				],
				'range' => [
					'px' => [
						'max' => 50,
					],
				],
				'selectors' => [
					'body:not(.rtl) {{WRAPPER}} .qazana-drop-cap' => 'margin-right: {{SIZE}}{{UNIT}};',
					'body.rtl {{WRAPPER}} .qazana-drop-cap'       => 'margin-left: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'drop_cap_border_radius',
			[
				'label'      => __( 'Border Radius', 'qazana' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => [ '%', 'px' ],
				'default'    => [
					'unit' => '%',
				],
				'range' => [
					'%' => [
						'max' => 50,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-drop-cap' => 'border-radius: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'drop_cap_border_width',[
				'label'     => __( 'Border Width', 'qazana' ),
				'type'      => Controls_Manager::DIMENSIONS,
				'selectors' => [
					'{{WRAPPER}} .qazana-drop-cap' => 'border-width: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
				'condition' => [
					'drop_cap_view' => 'framed',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography:: get_type(),
			[
				'name'     => 'drop_cap_typography',
				'selector' => '{{WRAPPER}} .qazana-drop-cap-letter',
				'exclude'  => [
					'letter_spacing',
				],
				'condition' => [
					'drop_cap' => 'yes',
				],
			]
		);

		$this->end_controls_section();
	}

	/**
	 * Render text editor widget output on the frontend.
	 *
	 * Written in PHP and used to generate the final HTML.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	public function render() {
		$editor_content = $this->get_settings( 'editor' );

		$editor_content = $this->parse_text_editor( $editor_content );

		$this->add_render_attribute( 'editor', 'class', [ 'qazana-text-editor', 'qazana-clearfix' ] );

		$this->add_inline_editing_attributes( 'editor', 'advanced' );

		if ( ! empty( $this->get_responsive_settings( 'align' ) ) ) {
			$this->add_render_attribute( 'editor', 'class', 'qazana-align-' . $this->get_responsive_settings( 'align' ) );
		}

		?><div <?php $this->render_attribute_string( 'editor' ); ?>>
			<div class="qazana-wrapper"><?php echo $editor_content; ?></div>
		</div><?php

	}

	/**
	 * Render text editor widget as plain content.
	 *
	 * Override the default behavior by printing the content without rendering it.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function render_plain_content() {
		// In plain mode, render without shortcode
		echo $this->get_settings( 'editor' );
	}

	/**
	 * Render text editor widget output in the editor.
	 *
	 * Written as a Backbone JavaScript template and used to generate the live preview.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	protected function _content_template() {

		?>
		<div class="qazana-text-editor qazana-clearfix qazana-align-{{ settings.align }}">
			<div class="qazana-wrapper qazana-inline-editing" data-qazana-setting-key="editor" data-qazana-inline-editing-toolbar="advanced">{{{ settings.editor }}}</div>
		</div>
		<?php

	}
}
