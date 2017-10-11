<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Element_Section_Tabs extends Element_Section {

	public function get_name() {
		return 'section_tabs';
	}

	public function get_title() {
		return __( 'Section Tab Wrapper', 'qazana' );
	}

}
