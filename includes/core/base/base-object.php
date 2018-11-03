<?php

namespace Qazana\Core\Base;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Base_Object {

	private $settings;

	/**
	 * Get the settings.
	 *
	 * Retrieve all the settings or, when requested, a specific setting.
	 *
	 * @since 1.4.0
	 * @access public
	 *
	 * @param string $setting Optional. The requested setting. Default is null.
	 *
	 * @return mixed The settings.
	 */
	final public function get_settings( $setting = null, $default = null ) {
		$this->ensure_settings();

		return self::get_items( $this->settings, $setting, $default );
	}

	/**
	 * Set settings.
	 *
	 * Change or add new settings to an existing control in the stack.
	 *
	 * @access public
	 *
	 * @param string|array $key   Setting name, or an array of key/value.
	 * @param string|null  $value Optional. Setting value. Optional field if
	 *                            `$key` is an array. Default is null.
	 */
	final public function set_settings( $key, $value = null ) {
		$this->ensure_settings();

		if ( is_array( $key ) ) {
			$this->settings = $key;
		} else {
			$this->settings[ $key ] = $value;
		}
	}

	public function delete_setting( $key = null ) {
		if ( $key ) {
			unset( $this->settings[ $key ] );
		} else {
			$this->settings = [];
		}
	}

	/**
	 * Get items.
	 *
	 * Utility method that receives an array with a needle and returns all the
	 * items that match the needle. If needle is not defined the entire haystack
	 * will be returned.
	 *
	 * @access protected
	 * @static
	 *
	 * @param array  $haystack An array of items.
	 * @param string $needle   Optional. Needle. Default is null.
	 * @param mixed  $default  Optional. Default value to return when the needle was
	 *                         not found. Default is null.
	 *
	 * @return mixed The whole haystack or the needle from the haystack when requested.
	 */
	final protected static function get_items( array $haystack, $needle = null, $default = null ) {
		if ( $needle ) {
			return isset( $haystack[ $needle ] ) ? $haystack[ $needle ] : null;
		}

		return $haystack;
	}

	protected function get_init_settings() {
		return [];
	}

	private function ensure_settings() {
		if ( null === $this->settings ) {
			$this->settings = $this->get_init_settings();
		}
	}
}
