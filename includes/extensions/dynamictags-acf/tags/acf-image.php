<?php
namespace Qazana\Extensions\Tags;

use Qazana\Controls_Manager;
use Qazana\Core\DynamicTags\Data_Tag;
use Qazana\Extensions\DynamicTags_ACF as ACF;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class ACF_Image extends Data_Tag {

	public function get_name() {
		return 'acf-image';
	}

	public function get_title() {
		return sprintf( '%s (%s)', __( 'ACF Field', 'qazana' ), __( 'Beta', 'qazana' ) );
	}

	public function get_group() {
		return ACF::ACF_GROUP;
	}

	public function get_categories() {
		return [ ACF::IMAGE_CATEGORY ];
	}

	public function get_panel_template_setting_key() {
		return 'key';
	}

	public function get_value( array $options = [] ) {
		$key = $this->get_settings( 'key' );

		$image_data = [
			'id' => null,
			'url' => '',
		];

		if ( ! empty( $key ) ) {

			list( $field_key, $meta_key ) = explode( ':', $key );

			$field = get_field_object( $field_key );

			if ( $field && ! empty( $field['save_format'] ) ) {
				switch ( $field['save_format'] ) {
					case 'object':
						$value = $field['value'];
						break;
					case 'url':
						$value = [
							'id' => 0,
							'url' => $field['value'],
						];
						break;
					case 'id':
						$src = wp_get_attachment_image_src( $field['value'], $field['preview_size'] );
						$value = [
							'id' => $field['value'],
							'url' => $src[0],
						];
						break;
				}
			}

			if ( ! isset( $value ) ) {
				// Field settings has been deleted or not available.
				$value = get_field( $meta_key );
			}

			if ( empty( $value ) && $this->get_settings( 'fallback' ) ) {
				$value = $this->get_settings( 'fallback' );
			}

			if ( ! empty( $value ) ) {
				$image_data['id'] = $value['id'];
				$image_data['url'] = $value['url'];
			}
		} // End if().

		return $image_data;
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

		$this->add_control(
			'fallback',
			[
				'label' => __( 'Fallback', 'qazana' ),
				'type' => Controls_Manager::MEDIA,
			]
		);
	}

	protected function get_supported_fields() {
		return [
			'image',
		];
	}
}
