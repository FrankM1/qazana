<?php
namespace Qazana\Extensions\Tags;

use Qazana\Controls_Manager;
use Qazana\Core\DynamicTags\Tag;
use Qazana\Extensions\DynamicTags_ACF as ACF;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class ACF_Text extends Tag {

	public function get_name() {
		return 'acf-text';
	}

	public function get_title() {
		return sprintf( '%s (%s)', __( 'ACF', 'qazana' ), __( 'Field', 'qazana' ) );
	}

	public function get_group() {
		return ACF::ACF_GROUP;
	}

	public function get_categories() {
		return [
			ACF::TEXT_CATEGORY,
			ACF::POST_META_CATEGORY,
		];
	}

	public function render() {
		$key = $this->get_settings( 'key' );
		if ( empty( $key ) ) {
			return;
		}

		list( $field_key, $meta_key ) = explode( ':', $key );

		if ( 'options' === $field_key ) {
			$field = get_field_object( $meta_key, $field_key );
		} else {
			$field = get_field_object( $field_key );
		}

		if ( $field && ! empty( $field['type'] ) ) {
			$value = $field['value'];

			switch ( $field['type'] ) {
				case 'radio':
					if ( isset( $field['choices'][ $value ] ) ) {
						$value = $field['choices'][ $value ];
					}
					break;
				case 'select':
					// Usa as array for `multiple=true` or `return_format=array`.
					$values = (array) $value;

					foreach ( $values as $key => $item ) {
						if ( isset( $field['choices'][ $item ] ) ) {
							$values[ $key ] = $field['choices'][ $item ];
						}
					}

					$value = implode( ', ', $values );

					break;
				case 'checkbox':
					$values = [];
					foreach ( $value as $item ) {
						if ( isset( $field['choices'][ $item ] ) ) {
							$values[] = $field['choices'][ $item ];
						} else {
							$values[] = $item;
						}
					}

					$value = implode( ', ', $values );

					break;
				case 'oembed':
					// Get from db without formatting.
					$value = get_post_meta( get_the_ID(), $meta_key, true );
					break;
				case 'google_map':
					$meta = get_post_meta( get_the_ID(), $meta_key, true );
					$value = isset( $meta['address'] ) ? $meta['address'] : '';
					break;
			} // End switch().
		} else {
			// Field settings has been deleted or not available.
			$value = get_field( $meta_key );
		} // End if().

		echo wp_kses_post( $value );
	}

	public function get_panel_template_setting_key() {
		return 'key';
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
			'text',
			'textarea',
			'number',
			'email',
			'password',
			'wysiwyg',
			'select',
			'checkbox',
			'radio',
			'true_false',
			'oembed',
			'google_map',
			'date_picker',
			'time_picker',
			'color_picker',
		];
	}
}
