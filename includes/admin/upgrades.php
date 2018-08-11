<?php
namespace Qazana\Admin;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * Qazana upgrades.
 *
 * Qazana upgrades handler class is responsible for updating different
 * Qazana versions.
 *
 * @since 1.0.0
 */
class Upgrades {

	/**
	 * Add actions.
	 *
	 * Hook into WordPress actions and launch Qazana upgrades.
	 *
	 * @static
	 * @since 1.0.0
	 * @access public
	 */
	public static function add_actions() {
		add_action( 'init', [ __CLASS__, 'init' ], 20 );
	}

	/**
	 * Init.
	 *
	 * Initialize Qazana upgrades.
	 *
	 * Fired by `init` action.
	 *
	 * @static
	 * @since 1.0.0
	 * @access public
	 */
	public static function init() {
		$qazana_version = get_option( 'qazana_version' );

        if ( ! $qazana_version ) {
            // 1.0.0 is the first version to use this option so we must add it
            $qazana_version = '1.0.0';
            update_option( 'qazana_version', $qazana_version );
        }
    }
}
