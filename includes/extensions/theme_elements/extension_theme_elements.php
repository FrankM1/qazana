<?php
namespace Qazana\Extensions;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Theme_Elements extends Base {

	const SOURCE_TYPE_CURRENT_POST = 'current_post';
	const SOURCE_TYPE_CUSTOM = 'custom';

	public function get_name() {
		return 'theme-elements';
	}

	public function get_widgets() {
		$widgets = [
			'Search_Form',
			'Author_Box',
			'Post_Comments',
			'Post_Navigation',
			'Post_Info',
		];

		if ( $this->is_yoast_seo_active() ) {
			$widgets[] = 'Breadcrumbs';
		}

		return $widgets;
	}

	public function is_yoast_seo_active() {
		return function_exists( 'yoast_breadcrumb' );
    }
    

	public function __construct() {
		require __DIR__ . '/classes/base.php';
	}
}
