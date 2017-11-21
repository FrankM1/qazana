<?php
namespace Qazana\Extensions\Widgets;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

use Qazana\Controls_Manager;
use Qazana\Scheme_Typography;
use Qazana\Scheme_Color;
use Qazana\Group_Control_Typography;

use Qazana\Widget_Base as Widget_Base;

class Counter extends Widget_Base {

	public function get_name() {
		return 'counter';
	}

	public function get_title() {
		return __( 'Number Counter', 'qazana' );
	}

	public function get_icon() {
		return 'eicon-counter';
	}

	public function get_categories() {
		return [ 'general-elements' ];
	}

	public function add_element_dependencies() {
		$this->add_frontend_script('odometer');
		$this->add_frontend_stylesheet('qazana-extension-counter');
    }

	protected function _register_controls() {
		$this->start_controls_section(
			'section_counter',
			[
				'label' => __( 'Counter', 'qazana' ),
			]
		);

		$this->add_control(
			'animation_type',
			[
				'label' => __( 'Animation Type', 'qazana' ),
				'type' => Controls_Manager::CHOOSE,
				'options' => [
					'count' => [
						'title' => __( 'Count', 'qazana' ),
					],
					'odometer' => [
						'title' => __( 'Odometer', 'qazana' ),
					],
					'none' => [
						'title' => __( 'No Animation', 'qazana' ),
					],
				],
				'prefix_class' => 'qazana-counter-animation-type-',
				'default' => 'odometer',
			]
		);

		$this->add_control(
			'starting_number',
			[
				'label' => __( 'Starting Number', 'qazana' ),
				'label_block' => true,
				'type' => Controls_Manager::NUMBER,
				'default' => 0,
			]
		);

		$this->add_control(
			'ending_number',
			[
				'label' => __( 'Ending Number', 'qazana' ),
				'label_block' => true,
				'type' => Controls_Manager::NUMBER,
				'default' => 100,
			]
		);

		$this->add_control(
			'prefix',
			[
				'label' => __( 'Number Prefix', 'qazana' ),
				'label_block' => true,
				'type' => Controls_Manager::TEXT,
				'default' => '',
				'placeholder' => 1,
			]
		);

		$this->add_control(
			'suffix',
			[
				'label' => __( 'Number Suffix', 'qazana' ),
				'label_block' => true,
				'type' => Controls_Manager::TEXT,
				'default' => '',
				'placeholder' => __( 'Plus', 'qazana' ),
			]
		);

		$this->add_control(
			'duration',
			[
				'label' => __( 'Animation Duration', 'qazana' ),
				'label_block' => true,
				'type' => Controls_Manager::NUMBER,
				'default' => 2000,
				'min' => 100,
				'step' => 100,
			]
		);

		$this->add_control(
			'title',
			[
				'label' => __( 'Title', 'qazana' ),
				'type' => Controls_Manager::TEXT,
				'label_block' => true,
				'default' => __( 'Cool Number Title', 'qazana' ),
				'placeholder' => __( 'Cool Number Title', 'qazana' ),
			]
		);

		$this->add_control(
			'subtitle',
			[
				'label' => __( 'Sub Title', 'qazana' ),
				'type' => Controls_Manager::TEXT,
				'label_block' => true,
				'default' => __( 'Cool number subtitle', 'qazana' ),
				'placeholder' => __( 'Cool number subtitle', 'qazana' ),
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_number',
			[
				'label' => __( 'Number', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'number_color',
			[
				'label' => __( 'Text Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_1,
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-counter-number-wrapper' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'typography_number',
				'scheme' => Scheme_Typography::TYPOGRAPHY_1,
				'selector' => '{{WRAPPER}} .qazana-counter-number-wrapper',
			]
		);

		$this->add_control(
			'number_spacing',
			[
				'label' => __( 'Spacing', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'min' => 0,
						'max' => 100,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-counter-number-wrapper' => 'margin-bottom: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_title',
			[
				'label' => __( 'Title', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'title_color',
			[
				'label' => __( 'Title Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_2,
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-counter-title' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'title_spacing',
			[
				'label' => __( 'Title Spacing', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'min' => 0,
						'max' => 100,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-counter-title' => 'margin-bottom: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'typography_title',
				'scheme' => Scheme_Typography::TYPOGRAPHY_2,
				'selector' => '{{WRAPPER}} .qazana-counter-title',
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_subtitle',
			[
				'label' => __( 'Sub Title', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'subtitle_color',
			[
				'label' => __( 'Sub Title Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_3,
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-counter-subtitle' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'typography_subtitle',
				'scheme' => Scheme_Typography::TYPOGRAPHY_2,
				'selector' => '{{WRAPPER}} .qazana-counter-subtitle',
			]
		);

		$this->add_control(
			'subtitle_spacing',
			[
				'label' => __( 'Sub Title Spacing', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'min' => 0,
						'max' => 100,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-counter-subtitle' => 'margin-bottom: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_prefix_style',
			[
				'label' => __( 'Prefix Style', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'prefix_color',
			[
				'label' => __( 'Prefix Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_3,
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-counter-number-prefix' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'typography_prefix',
				'scheme' => Scheme_Typography::TYPOGRAPHY_2,
				'selector' => '{{WRAPPER}} .qazana-counter-number-prefix',
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_suffix_style',
			[
				'label' => __( 'Suffix Style', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'suffix_color',
			[
				'label' => __( 'Suffix Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_3,
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-counter-number-suffix' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'typography_suffix',
				'scheme' => Scheme_Typography::TYPOGRAPHY_2,
				'selector' => '{{WRAPPER}} .qazana-counter-number-suffix',
			]
		);

		$this->end_controls_section();

	}

	public function style_1() {

		$settings = $this->get_settings();

		?>
		<div class="qazana-counter">
			<div class="qazana-counter-number-wrapper">
				<span class="qazana-counter-number-prefix"><?php echo $settings['prefix']; ?></span>
				<span <?php $this->render_attribute_string( 'counter' ); ?>><?php echo $settings['starting_number']; ?></span>
				<span class="qazana-counter-number-suffix"><?php echo $settings['suffix']; ?></span>
			</div>
			<?php if ( $settings['title'] ) : ?>
				<div class="qazana-counter-title"><?php echo $settings['title']; ?></div>
			<?php endif; ?>

			<?php if ( $settings['subtitle'] ) : ?>
				<div class="qazana-counter-subtitle"><?php echo $settings['subtitle']; ?></div>
			<?php endif; ?>
		</div>
		<?php

	}

	public function render() {
		$settings = $this->get_settings();

		$this->add_render_attribute( 'counter', [
			'class' => 'qazana-counter-number',
			'data-animation-type' => $settings['animation_type'],
			'data-duration' => $settings['duration'],
			'data-to-value' => $settings['ending_number'],
		] );

		$this->style_1();

	}

	protected function _content_template() {
		?>
		<div class="qazana-counter">
			<div class="qazana-counter-number-wrapper">
				<span class="qazana-counter-number-prefix">{{{ settings.prefix }}}</span>
				<span class="qazana-counter-number" data-animation-type="{{ settings.animation_type }}" data-duration="{{ settings.duration }}" data-to-value="{{ settings.ending_number }}">{{{ settings.starting_number }}}</span>
				<span class="qazana-counter-number-suffix">{{{ settings.suffix }}}</span>
			</div>
			<# if ( settings.title ) {
				#><div class="qazana-counter-title">{{{ settings.title }}}</div><#
			} #>
			<# if ( settings.subtitle ) {
				#><div class="qazana-counter-subtitle">{{{ settings.subtitle }}}</div><#
			} #>
		</div>
		<?php
	}


}
