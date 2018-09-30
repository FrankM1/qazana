<?php
namespace Qazana\Extensions\Tags;

use Qazana\Core\DynamicTags\Tag;
use Qazana\Extensions\DynamicTags_Site;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Site_Title extends Tag {
	public function get_name() {
		return 'site-title';
	}

	public function get_title() {
		return __( 'Site Title', 'qazana' );
	}

	public function get_group() {
		return DynamicTags_Site::SITE_GROUP;
	}

	public function get_categories() {
		return [ DynamicTags_Site::TEXT_CATEGORY ];
	}

	public function render() {
		echo wp_kses_post( get_bloginfo() );
	}
}
