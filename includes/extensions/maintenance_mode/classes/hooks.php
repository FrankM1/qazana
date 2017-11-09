<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Maintenance {

	/**
	 * @static
	 * @since 1.0.0
	 * @access public
	*/
	public static function activation() {
		wp_clear_scheduled_hook( 'qazana/tracker/send_event' );

		wp_schedule_event( time(), 'daily', 'qazana/tracker/send_event' );
		flush_rewrite_rules();
	}

	/**
	 * @static
	 * @since 1.0.0
	 * @access public
	*/
	public static function uninstall() {
		wp_clear_scheduled_hook( 'qazana/tracker/send_event' );
	}

	/**
	 * @static
	 * @since 1.0.0
	 * @access public
	*/
	public static function init() {
		register_activation_hook( qazana()->basename, [ __CLASS__, 'activation' ] );
		register_uninstall_hook( qazana()->basename, [ __CLASS__, 'uninstall' ] );
	}
}

Maintenance::init();
