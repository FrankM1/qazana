<?php
namespace Builder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Progress extends Widget_Base {

	public function get_name() {
		return 'progress';
	}

	public function get_title() {
		return __( 'Progress Bar', 'builder' );
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
				'label' => __( 'Progress Bar', 'builder' ),
			]
		);

		$this->add_control(
			'title',
			[
				'label' => __( 'Title', 'builder' ),
				'type' => Controls_Manager::TEXT,
				'placeholder' => __( 'Enter your title', 'builder' ),
				'default' => __( 'My Skill', 'builder' ),
				'label_block' => true,
			]
		);

		$this->add_control(
			'progress_type',
			[
				'label' => __( 'Type', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'default' => '',
				'options' => [
					'' => __( 'Default', 'builder' ),
					'info' => __( 'Info', 'builder' ),
					'success' => __( 'Success', 'builder' ),
					'warning' => __( 'Warning', 'builder' ),
					'danger' => __( 'Danger', 'builder' ),
				],
			]
		);

		$this->add_control(
			'percent',
			[
				'label' => __( 'Percentage', 'builder' ),
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
				'label' => __( 'Height', 'builder' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => 4,
					'unit' => 'px',
				],
				'label_block' => true,
				'selectors' => [
					'{{WRAPPER}} .builder-progress-wrapper' => 'height: {{SIZE}}{{UNIT}};',
				],
			]
		);

	    $this->add_control(
	        'display_percentage',
	        [
	            'label' => __( 'Display Percentage', 'builder' ),
	            'type' => Controls_Manager::SELECT,
	            'default' => 'show',
	            'options' => [
	                'show' => __( 'Show', 'builder' ),
	                'hide' => __( 'Hide', 'builder' ),
	            ],
	        ]
	    );

		$this->add_control(
			'inner_text',
			[
				'label' => __( 'Inner Text', 'builder' ),
				'type' => Controls_Manager::TEXT,
				'placeholder' => __( 'e.g. Web Designer', 'builder' ),
				'default' => __( 'Web Designer', 'builder' ),
				'label_block' => true,
			]
		);

		$this->add_control(
			'view',
			[
				'label' => __( 'View', 'builder' ),
				'type' => Controls_Manager::HIDDEN,
				'default' => 'traditional',
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_progress_style',
			[
				'label' => __( 'Progress Bar', 'builder' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'bar_color',
			[
				'label' => __( 'Color', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_4,
				],
				'selectors' => [
					'{{WRAPPER}} .builder-progress-wrapper .builder-progress-bar' => 'background-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'bar_bg_color',
			[
				'label' => __( 'Background Color', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .builder-progress-wrapper' => 'background-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'bar_inline_color',
			[
				'label' => __( 'Inner Text Color', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .builder-progress-bar' => 'color: {{VALUE}};',
				],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_title',
			[
				'label' => __( 'Title Style', 'builder' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'title_color',
			[
				'label' => __( 'Text Color', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .builder-title' => 'color: {{VALUE}};',
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
				'selector' => '{{WRAPPER}} .builder-title',
				'scheme' => Scheme_Typography::TYPOGRAPHY_3,
			]
		);

		$this->end_controls_section();
	}

	protected function render() {
		$settings = $this->get_settings();

		$this->add_render_attribute( 'wrapper', 'class', 'builder-progress-wrapper' );

		if ( ! empty( $settings['progress_type'] ) ) {
			$this->add_render_attribute( 'wrapper', 'class', 'progress-' . $settings['progress_type'] );
		}

		$this->add_render_attribute( 'progress-bar', [
			'class' => 'builder-progress-bar',
			'data-max' => $settings['percent']['size'],
		] );

		if ( ! empty( $settings['title'] ) ) { ?>
			<span class="builder-title"><?php echo $settings['title']; ?></span>
			<span class="builder-progress-text"><?php echo $settings['inner_text']; ?></span>
		<?php } ?>

		<?php if ( 'hide' !== $settings['display_percentage'] ) { ?>
			<span class="builder-progress-percentage"><?php echo $settings['percent']['size']; ?>%</span>
		<?php } ?>

		<div <?php echo $this->get_render_attribute_string( 'wrapper' ); ?> role="timer">
			<div <?php echo $this->get_render_attribute_string( 'progress-bar' ); ?>>
			</div>
		</div>
	<?php }

	protected function _content_template() {
		?>
		<# if ( settings.title ) { #>
		<span class="builder-title">{{{ settings.title }}}</span><#
		} #>
		<span class="builder-progress-text">{{{ settings.inner_text }}}</span>
		<# if ( 'hide' !== settings.display_percentage ) { #>
			<span class="builder-progress-percentage">{{{ settings.percent.size }}}%</span>
		<# } #>
		<div class="builder-progress-wrapper progress-{{ settings.progress_type }}" role="timer">
			<div class="builder-progress-bar" data-max="{{ settings.percent.size }}">
			</div>
		</div>
		<?php
	}
}
