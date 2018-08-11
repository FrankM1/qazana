<?php

namespace Qazana\Extensions;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class ACF_DynamicTags extends DynamicTags {

    const ACF_GROUP = 'acf';

    /**
     * Extension title
     *
     * @return string
     */
    public function get_title() {
        return __( 'ACF Dynamic Tags', 'qazana' );
    }

    /**
	 * Unique extension name
	 *
	 * @return string
	 */
    public function get_name() {
		return 'acf_dynamic_tags';
	}

	/**
	 * @param array $types
	 *
	 * @return array
	 */
	public static function get_control_options( $types ) {
		// ACF >= 5.0.0
		if ( function_exists( 'acf_get_field_groups' ) ) {
			$acf_groups = acf_get_field_groups();
		} else {
			$acf_groups = apply_filters( 'acf/get_field_groups', [] );
		}

		$groups = [];

		foreach ( $acf_groups as $acf_group ) {
			// ACF >= 5.0.0
			if ( function_exists( 'acf_get_fields' ) ) {
				$fields = acf_get_fields( $acf_group['ID'] );
			} else {
				$fields = apply_filters( 'acf/field_group/get_fields', [], $acf_group['id'] );
			}

			$options = [];

			if ( ! is_array( $fields ) ) {
				continue;
			}

			foreach ( $fields as $field ) {
				if ( ! in_array( $field['type'], $types, true ) ) {
					continue;
				}

				// Use group ID for unique keys
				$key = $field['key'] . ':' . $field['name'];
				$options[ $key ] = $field['label'];
			}

			if ( empty( $options ) ) {
				continue;
			}

			$groups[] = [
				'label' => $acf_group['title'],
				'options' => $options,
			];
		}

		return $groups;
	}

	public function get_tag_classes_names() {
		return [
			'ACF_Text',
			'ACF_Image',
			'ACF_URL',
			'ACF_Gallery',
		];
	}

	public function get_groups() {
		return [
			self::ACF_GROUP => [
				'title' => __( 'ACF', 'qazana' ),
			],
		];
    }
    
    /**
	 * Dynamic tags module constructor.
	 *
	 * Initializing Qazana dynamic tags module.
	 *
	 * @since 2.0.0
	 * @access public
	 */
	public function __construct() {
        require 'tags/acf-gallery.php';
        require 'tags/acf-image.php';
        require 'tags/acf-text.php';
        require 'tags/acf-url.php';
		parent::__construct();
	}
}
