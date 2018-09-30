<?php
namespace Qazana\Extensions\Tags;

use Qazana\Core\DynamicTags\Tag;
use Qazana\Extensions\DynamicTags_Site;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Archive_Meta extends Tag {

	public function get_name() {
		return 'archive-meta';
	}

	public function get_title() {
		return __( 'Archive Meta', 'qazana' );
	}

	public function get_group() {
		return DynamicTags_Site::ARCHIVE_GROUP;
	}

	public function get_categories() {
		return [ DynamicTags_Site::TEXT_CATEGORY ];
	}

	public function get_panel_template() {
		return ' ({{{ key }}})';
	}

	public function render() {
		$key = $this->get_settings( 'key' );

		if ( empty( $key ) ) {
			return;
		}

		$value = '';

		if ( is_category() || is_tax() || is_tax() ) {
			$value = get_term_meta( get_queried_object_id(), $key, true );
		} elseif ( is_author() ) {
			$value = get_user_meta( get_queried_object_id(), $key, true );
		}

		echo wp_kses_post( $value );
	}

	public function get_panel_template_setting_key() {
		return 'key';
	}

	protected function _register_controls() {
		$this->add_control(
			'key',
			[
				'label'   => __( 'Meta Key', 'qazana' ),
			]
		);
	}
}
