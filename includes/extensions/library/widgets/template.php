<?php
namespace Qazana\Extensions\Widgets;

use Qazana\Controls_Manager;
use Qazana\Widget_Base as Widget_Base;
use Qazana\Extensions\Library;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Template extends Widget_Base {

	public function get_name() {
		return 'template';
	}

	public function get_title() {
		return __( 'Qazana Template', 'qazana' );
	}

	public function get_icon() {
		return 'eicon-document-file';
	}

	public function get_categories() {
		return [ 'general' ];
	}

	public function is_reload_preview_required() {
		return false;
	}

	protected function _register_controls() {
		$this->start_controls_section(
			'section_template',
			[
				'label' => __( 'Qazana Template', 'qazana' ),
			]
		);

		$templates = Library::get_templates();

		if ( empty( $templates ) ) {

			$this->add_control(
				'no_templates',
				[
					'label' => false,
					'type' => Controls_Manager::RAW_HTML,
					'raw' => Library::empty_templates_message(),
				]
			);

			return;
		}

		$options = [
			'0' => '- ' . __( 'Select', 'qazana' ) . ' -',
		];

		$types = [];

		foreach ( $templates as $template ) {
			$options[ $template['template_id'] ] = $template['title'] . ' (' . $template['type'] . ')';
			$types[ $template['template_id'] ] = $template['type'];
		}

		$this->add_control(
			'template_id',
			[
				'label' => __( 'Choose Template', 'qazana' ),
				'type' => Controls_Manager::SELECT2,
				'default' => '0',
				'options' => $options,
				'types' => $types,
				'label_block'  => 'true',
			]
		);

		$this->end_controls_section();
	}

	public function render() {

		$template_id = $this->get_settings( 'template_id' );

		?><div class="qazana-template">
            <?php 

            echo qazana()->get_frontend()->get_builder_content_for_display( $template_id );

            if ( User::is_current_user_can_edit() ) {
                echo '<a target="_blank" class="qazana-edit-template" href="'. add_query_arg( 'qazana', '', get_permalink( $template_id ) ) .'"><i class="fa fa-pencil"></i> '. __( 'Edit Template', 'qazana' ) .'</a>';
            }
            ?>
		</div><?php

	}

	public function render_plain_content() {}
}
