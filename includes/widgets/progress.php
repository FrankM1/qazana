<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Qazana progress widget.
 *
 * Qazana widget that displays an escalating progress bar.
 *
 * @since 1.0.0
 */
class Widget_Progress extends Widget_Base {

	/**
	 * Get widget name.
	 *
	 * Retrieve progress widget name.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget name.
	 */
	public function get_name() {
		return 'progress';
	}

	/**
	 * Get widget title.
	 *
	 * Retrieve progress widget title.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget title.
	 */
	public function get_title() {
		return __( 'Progress Bar', 'qazana' );
	}

	/**
	 * Get widget icon.
	 *
	 * Retrieve progress widget icon.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget icon.
	 */
	public function get_icon() {
		return 'eicon-skill-bar';
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
		return [ 'progress', 'bar' ];
	}

	/**
	 * Register progress widget controls.
	 *
	 * Adds different input fields to allow the user to change and customize the widget settings.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	protected function _register_controls() {
		$this->start_controls_section(
			'section_progress',
			[
				'label' => __( 'Progress Bar', 'qazana' ),
			]
		);

		$this->add_control(
			'title',
			[
				'label' => __( 'Title', 'qazana' ),
				'type' => Controls_Manager::TEXT,
				'dynamic' => [
					'active' => true,
				],
				'placeholder' => __( 'Enter your title', 'qazana' ),
				'default' => __( 'My Skill', 'qazana' ),
				'label_block' => true,
			]
		);

		$this->add_control(
			'progress_type',
			[
				'label' => __( 'Type', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => '',
				'options' => [
					'' => __( 'Default', 'qazana' ),
					'info' => __( 'Info', 'qazana' ),
					'success' => __( 'Success', 'qazana' ),
					'warning' => __( 'Warning', 'qazana' ),
					'danger' => __( 'Danger', 'qazana' ),
				],
			]
		);

		$this->add_control(
			'percent',
			[
				'label' => __( 'Percentage', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => 50,
					'unit' => '%',
				],
				'label_block' => true,
			]
		);

		$this->add_control(
			'height',
			[
				'label' => __( 'Height', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => 4,
					'unit' => 'px',
				],
				'label_block' => true,
				'selectors' => [
					'{{WRAPPER}} .qazana-progress-wrapper' => 'height: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'display_percentage',
			[
				'label' => __( 'Display Percentage', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'default' => 'true',
				'return_value' => 'true',
			]
		);

		$this->add_control(
			'inner_text',
			[
				'label' => __( 'Inner Text', 'qazana' ),
				'type' => Controls_Manager::TEXT,
				'dynamic' => [
					'active' => true,
				],
				'placeholder' => __( 'e.g. Web Designer', 'qazana' ),
				'default' => __( 'Web Designer', 'qazana' ),
				'label_block' => true,
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_progress_style',
			[
				'label' => __( 'Progress Bar', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'bar_color',
			[
				'label' => __( 'Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_4,
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-progress-wrapper .qazana-progress-bar' => 'background-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'bar_bg_color',
			[
				'label' => __( 'Background Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .qazana-progress-wrapper' => 'background-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'bar_inline_color',
			[
				'label' => __( 'Inner Text Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .qazana-progress-bar' => 'color: {{VALUE}};',
				],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_title',
			[
				'label' => __( 'Title Style', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'title_color',
			[
				'label' => __( 'Text Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .qazana-title' => 'color: {{VALUE}};',
				],
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_1,
				],
			]
        );

        $this->add_control(
			'percentage_color',
			[
				'label' => __( 'Percentage Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .qazana-progress-percentage' => 'color: {{VALUE}};',
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
				'name' => 'typography',
				'selector' => '{{WRAPPER}} .qazana-title, {{WRAPPER}} .qazana-progress-percentage',
				'scheme' => Scheme_Typography::TYPOGRAPHY_3,
			]
        );

        $this->add_responsive_control( 'title_spacing', [
            'type'        => Controls_Manager::SLIDER,
            'label'       => esc_html__( 'Bottom spacing', 'qazana' ),
            'description' => esc_html__( 'Space below title.', 'qazana' ),
            'range'       => [
                'px' => [
                    'min' => 0,
                    'max' => 100,
                ],
            ],
            'selectors'          => [
                '{{WRAPPER}} .qazana-progress-wrapper' => 'margin-top: {{SIZE}}px',
            ],
        ]);

        $this->end_controls_section();

        $this->start_controls_section(
			'section_description',
			[
				'label' => __( 'Description', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
        );

		$this->add_control(
			'description_color',
			[
				'label' => __( 'Text Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .qazana-progress-description, {{WRAPPER}} .qazana-progress-percentage' => 'color: {{VALUE}};',
				],
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_2,
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'description_typography',
				'selector' => '{{WRAPPER}} .qazana-progress-description, {{WRAPPER}} .qazana-progress-percentage',
				'scheme' => Scheme_Typography::TYPOGRAPHY_3,
			]
        );

		$this->end_controls_section();
	}

	/**
	 * Render progress widget output on the frontend.
	 *
	 * Written in PHP and used to generate the final HTML.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	public function render() {
		$settings = $this->get_settings_for_display();

		$this->add_render_attribute( 'wrapper', [
			'class' => 'qazana-progress-wrapper',
			'role' => 'progressbar',
			'aria-valuemin' => '0',
			'aria-valuemax' => '100',
			'aria-valuenow' => $settings['percent']['size'],
			'aria-valuetext' => $settings['inner_text'],
        ] );

		if ( ! empty( $settings['progress_type'] ) ) {
			$this->add_render_attribute( 'wrapper', 'class', 'progress-' . $settings['progress_type'] );
		}

		$this->add_render_attribute( 'progress-bar', [
			'class' => 'qazana-progress-bar',
			'data-max' => $settings['percent']['size'],
		] );

		if ( ! empty( $settings['title'] ) ) { ?>
			<span class="qazana-title"><?php echo $settings['title']; ?></span>
			<span class="qazana-progress-description"><?php echo $settings['inner_text']; ?></span>
		<?php } ?>

		<?php if ( 'true' === $settings['display_percentage'] ) { ?>
			<span class="qazana-progress-percentage"><?php echo $settings['percent']['size']; ?>%</span>
		<?php } ?>

		<div <?php $this->render_attribute_string( 'wrapper' ); ?> role="timer">
			<div <?php $this->render_attribute_string( 'progress-bar' ); ?>></div>
		</div>
	<?php
	}

	/**
	 * Render progress widget output in the editor.
	 *
	 * Written as a Backbone JavaScript template and used to generate the live preview.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	protected function _content_template() {
		?>
		<#
		view.addRenderAttribute( 'progressWrapper', {
			'class': [ 'qazana-progress-wrapper', 'progress-' + settings.progress_type ],
			'role': 'progressbar',
			'aria-valuemin': '0',
			'aria-valuemax': '100',
			'aria-valuenow': settings.percent.size,
			'aria-valuetext': settings.inner_text
		} );
		view.addInlineEditingAttributes( 'progressWrapper' );
		#>
		<# if ( settings.title ) { #>
		<span class="qazana-title">{{{ settings.title }}}</span><#
		} #>
		<span class="qazana-progress-description">{{{ settings.inner_text }}}</span>
		<# if ( 'true' === settings.display_percentage ) { #>
			<span class="qazana-progress-percentage">{{{ settings.percent.size }}}%</span>
		<# } #>
		<div class="qazana-progress-wrapper progress-{{ settings.progress_type }}" role="timer">
			<div class="qazana-progress-bar" data-max="{{ settings.percent.size }}"></div>
		</div>
		<?php
	}
}
