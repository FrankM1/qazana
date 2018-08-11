<?php
namespace Qazana\Extensions\Site_Hero;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

use Qazana\Extensions\ThemeBuilder\Documents\Theme_Section_Document;

class Document extends Theme_Section_Document {

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

