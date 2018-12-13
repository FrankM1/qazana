<?php

namespace Qazana\Extensions;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class DynamicTags_ACF extends DynamicTags {

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
		return 'dynamictags-acf';
	}

	/**
	 * @param array $types
	 *
	 * @return array
	 */
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

		$options_page_groups_ids = [];

		if ( function_exists( 'acf_options_page' ) ) {
			$pages = acf_options_page()->get_pages();
			foreach ( $pages as $slug => $page ) {
				$options_page_groups = acf_get_field_groups( [
					'options_page' => $slug,
				] );

				foreach ( $options_page_groups as $options_page_group ) {
					$options_page_groups_ids[] = $options_page_group['ID'];
				}
			}
		}

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

			$has_option_page_location = in_array( $acf_group['ID'], $options_page_groups_ids, true );
			$is_only_options_page = $has_option_page_location && 1 === count( $acf_group['location'] );

			foreach ( $fields as $field ) {
				if ( ! in_array( $field['type'], $types, true ) ) {
					continue;
				}

				// Use group ID for unique keys
				if ( $has_option_page_location ) {
					$key = 'options:' . $field['name'];
					$options[ $key ] = __( 'Options', 'qazana' ) . ':' . $field['label'];
					if ( $is_only_options_page ) {
						continue;
					}
				}

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
		} // End foreach().

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
