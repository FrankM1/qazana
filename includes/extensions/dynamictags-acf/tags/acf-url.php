<?php
namespace Qazana\Extensions\Tags;

use Qazana\Controls_Manager;
use Qazana\Core\DynamicTags\Data_Tag;
use Qazana\Extensions\DynamicTags_ACF as ACF;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class ACF_URL extends Data_Tag {

	public function get_name() {
		return 'acf-url';
	}

	public function get_title() {
		return sprintf( '%s (%s)', __( 'ACF', 'qazana' ), __( 'URL Field', 'qazana' ) );
	}

	public function get_group() {
		return ACF::ACF_GROUP;
	}

	public function get_categories() {
		return [ ACF::URL_CATEGORY ];
	}

	public function get_panel_template_setting_key() {
		return 'key';
	}

	public function get_value( array $options = [] ) {
		$key = $this->get_settings( 'key' );
		if ( empty( $key ) ) {
			return '';
		}

		list( $field_key, $meta_key ) = explode( ':', $key );

		if ( 'options' === $field_key ) {
			$field = get_field_object( $meta_key, $field_key );
		} else {
			$field = get_field_object( $field_key );
		}

		if ( $field ) {
			$value = $field['value'];

			if ( is_array( $value ) ) {
				$value = $value[0];
			}

			if ( $value ) {
				switch ( $field['type'] ) {
					case 'email':
						if ( $value ) {
							$value = 'mailto:' . $value;
						}
						break;
					case 'image':
					case 'file':
						switch ( $field['save_format'] ) {
							case 'object':
								$value = $value['url'];
								break;
							case 'id':
								if ( 'image' === $field['type'] ) {
									$src = wp_get_attachment_image_src( $value, 'full' );
									$value = $src[0];
								} else {
									$value = wp_get_attachment_url( $value );
								}
								break;
						}
						break;
					case 'post_object':
					case 'relationship':
						$value = get_permalink( $value );
						break;
					case 'taxonomy':
						$value = get_term_link( $value, $field['taxonomy'] );
						break;
				} // End switch().
			}
		} else {
			// Field settings has been deleted or not available.
			$value = get_field( $meta_key );
		} // End if().

		if ( empty( $value ) && $this->get_settings( 'fallback' ) ) {
			$value = $this->get_settings( 'fallback' );
		}

		return wp_kses_post( $value );
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
				'label'   => __( 'Fallback', 'qazana' ),
			]
		);
	}

	protected function get_supported_fields() {
		return [
			'text',
			'email',
			'image',
			'file',
			'page_link',
			'post_object',
			'relationship',
			'taxonomy',
			'url',
		];
	}
}
