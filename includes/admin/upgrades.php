<?php
namespace Builder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Upgrades {

    public static function add_actions() {
        add_action( 'init', [ __CLASS__, 'init' ], 20 );
    }

    public static function init() {
        $builder_version = get_option( 'builder_version' );

        if ( ! $builder_version ) {
            // 0.3.1 is the first version to use this option so we must add it
            $builder_version = '1.0.0';
            update_option( 'builder_version', $builder_version );
        }
    }
}

Upgrades::add_actions();
