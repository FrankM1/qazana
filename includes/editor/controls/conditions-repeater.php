<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Qazana repeater control.
 *
 * A base control for creating repeater control. Repeater control allows you to
 * build repeatable blocks of fields. You can create, for example, a set of
 * fields that will contain a title and a WYSIWYG text - the user will then be
 * able to add "rows", and each row will contain a title and a text. The data
 * can be wrapper in custom HTML tags, designed using CSS, and interact using JS
 * or external libraries.
 *
 * @since 1.0.0
 */
class Control_Conditions_Repeater extends Control_Repeater {

	/**
	 * Get conditions repeater control type.
	 *
	 * Retrieve the control type, in this case `conditions-repeater`.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Control type.
	 */
	public function get_type() {
		return 'conditions_repeater';
	}
 
}
