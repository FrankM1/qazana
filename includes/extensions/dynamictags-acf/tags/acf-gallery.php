<?php

namespace Qazana\Extensions\Tags;

use Qazana\Controls_Manager;
use Qazana\Core\DynamicTags\Data_Tag;
use Qazana\Extensions\DynamicTags_ACF as ACF;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class ACF_Gallery extends Data_Tag {

	public function get_name() {
		return 'acf-gallery';
	}

	public function get_title() {
		return sprintf( '%s (%s)', __( 'ACF Field', 'qazana' ), __( 'Beta', 'qazana' ) );
	}

	public function get_categories() {
		return [ ACF::GALLERY_CATEGORY ];
	}

	public function get_group() {
		return ACF::ACF_GROUP;
	}

	public function get_panel_template_setting_key() {
		return 'key';
	}

	public function get_value( array $options = [] ) {
		$key = $this->get_settings( 'key' );

		$images = [];

		if ( ! empty( $key ) ) {

			list( $field_key, $meta_key ) = explode( ':', $key );

			$field = get_field_object( $field_key );

			if ( $field ) {
				$value = $field['value'];
			} else {
				// Field settings has been deleted or not available.
				$value = get_field( $meta_key );
			}

			if ( is_array( $value ) && ! empty( $value ) ) {
				foreach ( $value as $image ) {
					$images[] = [
						'id' => $image['ID'],
					];
				}
			}
		}

		return $images;
	}

	protected function _register_controls() {
		$this->add_control(
			'key',
			[
				'label'   => __( 'Key', 'qazana' ),
				'type'    => Controls_Manager::SELECT,
				'groups' => ACF::get_control_options( $this->get_supported_fields() ),
			]
		);
	}

	protected function get_supported_fields() {
		return [
			'gallery',
		];
	}
}
