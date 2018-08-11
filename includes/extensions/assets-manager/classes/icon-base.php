<?php
namespace Qazana\Extensions\Assets_Manager\Classes;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}


class Icon_Base extends Assets_Base {

	const FONTS_OPTION_NAME = 'qazana_icons_manager_icons';

	protected $icon_preview_phrase = '';

	protected function actions() {}

	public function __construct() {
		parent::__construct();

		$this->icon_preview_phrase = __( 'Qazana Is Making the Web Beautiful!!!', 'qazana' );
	}

	public function get_name() {
		return '';
	}

	public function get_type() {
		return '';
	}

	public function handle_panel_request() {
		return [];
	}

	public function get_icons( $force = false ) {}

	public function enqueue_icon( $icon_family, $icon_data, $post_css ) {}

	public function get_icon_family_type( $post_id, $post_title ) {}

	public function get_icon_data( $post_id, $post_title ) {}

	public function render_preview_column( $post_id ) {}

	public function get_icon_variations_count( $post_id ) {}

	public function save_meta( $post_id, $data ) {}
}
