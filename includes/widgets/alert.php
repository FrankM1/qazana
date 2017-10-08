<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Alert extends Widget_Base {

	public function get_name() {
		return 'alert';
	}

	public function get_title() {
		return __( 'Alert', 'qazana' );
	}

	public function get_icon() {
		return 'eicon-alert';
	}

	public function get_categories() {
		return [ 'general-elements' ];
	}

	protected function _register_controls() {
		$this->start_controls_section(
			'section_alert',
			[
				'label' => __( 'Alert', 'qazana' ),
			]
		);

		$this->add_control(
			'alert_type',
			[
				'label' => __( 'Type', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'info',
				'options' => [
					'info' => __( 'Info', 'qazana' ),
					'success' => __( 'Success', 'qazana' ),
					'warning' => __( 'Warning', 'qazana' ),
					'danger' => __( 'Danger', 'qazana' ),
				],
			]
		);

		$this->add_control(
			'alert_title',
			[
				'label' => __( 'Title & Description', 'qazana' ),
				'type' => Controls_Manager::TEXT,
				'placeholder' => __( 'Your Title', 'qazana' ),
				'default' => __( 'This is Alert', 'qazana' ),
				'label_block' => true,
			]
		);

		$this->add_control(
			'alert_description',
			[
				'label' => __( 'Content', 'qazana' ),
				'type' => Controls_Manager::TEXTAREA,
				'placeholder' => __( 'Your Description', 'qazana' ),
				'default' => __( 'I am description. Click the edit button to change this text.', 'qazana' ),
				'separator' => 'none',
				'show_label' => false,
			]
		);

		$this->add_control(
			'show_dismiss',
			[
				'label' => __( 'Dismiss Button', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'show',
				'options' => [
					'show' => __( 'Show', 'qazana' ),
					'hide' => __( 'Hide', 'qazana' ),
				],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_type',
			[
				'label' => __( 'Alert Type', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'background',
			[
				'label' => __( 'Background Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .qazana-alert' => 'background-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'border_color',
			[
				'label' => __( 'Border Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .qazana-alert' => 'border-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'border_left-width',
			[
				'label' => __( 'Left Border Width', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'min' => 0,
						'max' => 100,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-alert' => 'border-left-width: {{SIZE}}{{UNIT}};',
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
				'label' => __( 'Text Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .qazana-alert-title' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'alert_title',
				'selector' => '{{WRAPPER}} .qazana-alert-title',
				'scheme' => Scheme_Typography::TYPOGRAPHY_1,
			]
		);

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
					'{{WRAPPER}} .qazana-alert-description' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'alert_description',
				'selector' => '{{WRAPPER}} .qazana-alert-description',
				'scheme' => Scheme_Typography::TYPOGRAPHY_3,
			]
		);

		$this->end_controls_section();

	}

	public function render() {
		$settings = $this->get_settings();

		if ( empty( $settings['alert_title'] ) ) {
			return;
		}

		if ( ! empty( $settings['alert_type'] ) ) {
			$this->add_render_attribute( 'wrapper', 'class', 'qazana-alert qazana-alert-' . $settings['alert_type'] );
		}

		echo '<div ' . $this->get_render_attribute_string( 'wrapper' ) . ' role="alert">';
		$html = sprintf( '<span class="qazana-alert-title">%1$s</span>', $settings['alert_title'] );

		if ( ! empty( $settings['alert_description'] ) ) {
			$html .= sprintf( '<span class="qazana-alert-description">%s</span>', $settings['alert_description'] );
		}

		if ( ! empty( $settings['show_dismiss'] ) && 'show' === $settings['show_dismiss'] ) {
			$html .= '<button type="button" class="qazana-alert-dismiss">X</button>';
		}

		echo $html;

		echo '</div>';
	}

	protected function _content_template() {
		?>
		<#
		var html = '<div class="qazana-alert qazana-alert-' + settings.alert_type + '" role="alert">';
		if ( '' !== settings.title ) {
			html += '<span class="qazana-alert-title">' + settings.alert_title + '</span>';

			if ( '' !== settings.description ) {
				html += '<span class="qazana-alert-description">' + settings.alert_description + '</span>';
			}

			if ( 'show' === settings.show_dismiss ) {
				html += '<button type="button" class="qazana-alert-dismiss">X</button>';
			}

			html += '</div>';
		
			print( html );
		}
		#>
		<?php
	}
}
