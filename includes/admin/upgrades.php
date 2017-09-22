<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Upgrades {

    public static function add_actions() {
        add_action( 'init', [ __CLASS__, 'init' ], 20 );
    }

    public static function init() {
        $qazana_version = get_option( 'qazana_version' );

        if ( ! $qazana_version ) {
            // 1.0.0 is the first version to use this option so we must add it
            $qazana_version = '1.0.0';
            update_option( 'qazana_version', $qazana_version );
        }
    }
}

Upgrades::add_actions();
