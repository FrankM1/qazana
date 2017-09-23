<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Settings_Validations {

	public static function html( $input ) {
		return stripslashes( wp_filter_post_kses( addslashes( $input ) ) );
	}

	public static function checkbox_list( $input ) {
		if ( empty( $input ) ) {
			$input = [];
		}

		return $input;
	}

	public static function clear_cache( $input ) {
		qazana()->posts_css_manager->clear_cache();

		return $input;
	}
}
