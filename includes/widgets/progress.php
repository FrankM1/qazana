<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Progress extends Widget_Base {

	public function get_name() {
		return 'progress';
	}

	public function get_title() {
		return __( 'Progress Bar', 'qazana' );
	}

	public function get_icon() {
		return 'eicon-skill-bar';
	}

	public function get_categories() {
		return [ 'general-elements' ];
	}

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
	            'type' => Controls_Manager::SELECT,
	            'default' => 'show',
	            'options' => [
	                'show' => __( 'Show', 'qazana' ),
	                'hide' => __( 'Hide', 'qazana' ),
	            ],
	        ]
	    );

		$this->add_control(
			'inner_text',
			[
				'label' => __( 'Inner Text', 'qazana' ),
				'type' => Controls_Manager::TEXT,
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

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'typography',
				'selector' => '{{WRAPPER}} .qazana-title',
				'scheme' => Scheme_Typography::TYPOGRAPHY_3,
			]
		);

		$this->end_controls_section();
	}

	public function render() {
		$settings = $this->get_settings();

		$this->add_render_attribute( 'wrapper', 'class', 'qazana-progress-wrapper' );

		if ( ! empty( $settings['progress_type'] ) ) {
			$this->add_render_attribute( 'wrapper', 'class', 'progress-' . $settings['progress_type'] );
		}

		$this->add_render_attribute( 'progress-bar', [
			'class' => 'qazana-progress-bar',
			'data-max' => $settings['percent']['size'],
		] );

		if ( ! empty( $settings['title'] ) ) { ?>
			<span class="qazana-title"><?php echo $settings['title']; ?></span>
			<span class="qazana-progress-text"><?php echo $settings['inner_text']; ?></span>
		<?php } ?>

		<?php if ( 'hide' !== $settings['display_percentage'] ) { ?>
			<span class="qazana-progress-percentage"><?php echo $settings['percent']['size']; ?>%</span>
		<?php } ?>

		<div <?php $this->render_attribute_string( 'wrapper' ); ?> role="timer">
			<div <?php $this->render_attribute_string( 'progress-bar' ); ?>>
			</div>
		</div>
	<?php }

	protected function _content_template() {
		?>
		<# if ( settings.title ) { #>
		<span class="qazana-title">{{{ settings.title }}}</span><#
		} #>
		<span class="qazana-progress-text">{{{ settings.inner_text }}}</span>
		<# if ( 'hide' !== settings.display_percentage ) { #>
			<span class="qazana-progress-percentage">{{{ settings.percent.size }}}%</span>
		<# } #>
		<div class="qazana-progress-wrapper progress-{{ settings.progress_type }}" role="timer">
			<div class="qazana-progress-bar" data-max="{{ settings.percent.size }}">
			</div>
		</div>
		<?php
	}
}
