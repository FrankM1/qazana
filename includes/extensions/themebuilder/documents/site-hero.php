<?php
namespace Qazana\Extensions\ThemeBuilder\Documents;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Site_Hero extends Theme_Section_Document {

	public static function get_properties() {
		$properties = parent::get_properties();

		$properties['location'] = 'site-hero';

		return $properties;
	}

	public function get_name() {
		return 'site-hero';
	}

	public static function get_title() {
		return __('Site Hero', 'qazana' );
	}
}

