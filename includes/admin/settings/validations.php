<?php
namespace Qazana\Admin\Settings;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Validations {

	/**
	 * @static
	 * @since 1.0.0
	 * @access public
	*/
	public static function html( $input ) {
		return stripslashes( wp_filter_post_kses( addslashes( $input ) ) );
	}

	/**
	 * @static
	 * @since 1.0.0
	 * @access public
	*/
	public static function checkbox_list( $input ) {
		if ( empty( $input ) ) {
			$input = [];
		}

		return $input;
	}

	/**
	 * @static
	 * @since 1.0.0
	 * @access public
	*/
	public static function clear_cache( $input ) {
		qazana()->files_manager->clear_cache();

		return $input;
	}
}
