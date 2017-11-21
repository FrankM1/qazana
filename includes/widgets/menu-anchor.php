<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Menu_Anchor extends Widget_Base {

	public function get_name() {
		return 'menu-anchor';
	}

	public function get_title() {
		return __( 'Menu Anchor', 'qazana' );
	}

	public function get_icon() {
		return 'eicon-anchor';
	}

	public function get_categories() {
		return [ 'general-elements' ];
	}

	protected function _register_controls() {
		$this->start_controls_section(
			'section_anchor',
			[
				'label' => __( 'Anchor', 'qazana' ),
			]
		);

		$this->add_control(
			'anchor_description',
			[
				'raw' => __( 'This ID will be the CSS ID you will have to use in your own page, Without #.', 'qazana' ),
				'type' => Controls_Manager::RAW_HTML,
				'content_classes' => 'qazana-descriptor',
			]
		);

		$this->add_control(
			'anchor',
			[
				'label' => __( 'The ID of Menu Anchor.', 'qazana' ),
				'type' => Controls_Manager::TEXT,
				'placeholder' => __( 'For Example: About', 'qazana' ),
				'label_block' => true,
			]
		);

		$this->end_controls_section();
	}

	public function render() {
		$anchor = $this->get_settings( 'anchor' );

		if ( ! empty( $anchor ) ) {
			$this->add_render_attribute( 'inner', 'id', $anchor );
		}

		$this->add_render_attribute( 'inner', 'class', 'qazana-menu-anchor' );
		?>
		<div <?php $this->render_attribute_string( 'inner' ); ?>></div>
		<?php
	}

	protected function _content_template() {
		?>
		<div class="qazana-menu-anchor"{{{ settings.anchor ? ' id="' + settings.anchor + '"' : '' }}}></div>
		<?php
	}
}
