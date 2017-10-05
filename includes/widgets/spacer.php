<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Spacer extends Widget_Base {

	public function get_name() {
		return 'spacer';
	}

	public function get_title() {
		return __( 'Spacer', 'qazana' );
	}

	public function get_icon() {
		return 'eicon-spacer';
	}

	public function get_categories() {
		return [ 'basic' ];
	}

	protected function _register_controls() {
		$this->start_controls_section(
			'section_spacer',
			[
				'label' => __( 'Spacer', 'qazana' ),
			]
		);

		$this->add_responsive_control(
			'space',
			[
				'label' => __( 'Space', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => 50,
				],
				'range' => [
					'px' => [
						'min' => 10,
						'max' => 600,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-spacer-inner' => 'height: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->end_controls_section();
	}

	protected function render() {
		?>
		<div class="qazana-spacer">
			<div class="qazana-spacer-inner"></div>
		</div>
		<?php
	}

	protected function _content_template() {
		?>
		<div class="qazana-spacer">
			<div class="qazana-spacer-inner"></div>
		</div>
		<?php
	}
}
