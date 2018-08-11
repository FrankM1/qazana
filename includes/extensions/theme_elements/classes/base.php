<?php
namespace Qazana\Extensions\Widgets;

use Qazana\Widget_Base;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

abstract class Theme_Elements_Widget_Base extends Widget_Base {

	public function get_categories() {
		return [ 'theme-elements' ];
	}

	public function render_plain_content() {}
}
