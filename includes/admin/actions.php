<?php

/**
 * Qazana Admin Actions.
 *
 *
 * @see qazana-core-actions.php
 * @see qazana-core-filters.php
 */

/*
 * Attach Qazana to WordPress
 *
 * Qazana uses its own internal actions to help aid in third-party plugin
 * development, and to limit the amount of potential future code changes when
 * updates to WordPress core occur.
 *
 * These actions exist to create the concept of 'plugin dependencies'. They
 * provide a safe way for plugins to execute code *only* when Qazana is
 * installed and activated, without needing to do complicated guesswork.
 *
 * For more information on how this works, see the 'Plugin Dependency' section
 * near the bottom of this file.
 *
 *           v--WordPress Actions       v--Qazana Sub-actions
 */
add_action( 'admin_menu',              'qazana_admin_menu' );
add_action( 'admin_init',              'qazana_admin_init' );
add_action( 'admin_head',              'qazana_admin_head' );
add_action( 'admin_notices',           'qazana_admin_notices' );

// Initialize the admin area
add_action( 'qazana_init', 'qazana_admin' );

// Hook on to admin_init
add_action( 'qazana_admin_init', 'qazana_setup_updater', 999 );

add_action( 'qazana_admin_init', 'qazana_register_admin_style' );
add_action( 'qazana_admin_init', 'qazana_register_admin_settings' );
add_action( 'qazana_admin_init', 'qazana_do_activation_redirect', 1 );

// Activation
add_action( 'qazana_activation', 'qazana_delete_rewrite_rules' );

// Deactivation
add_action( 'qazana_deactivation', 'qazana_delete_rewrite_rules' );

/** Sub-Actions ***************************************************************/

/**
 * Piggy back admin_init action.
 *
 * @since 1.0.0
 *
 * @uses do_action() Calls 'qazana_admin_init'
 */
function qazana_admin_init() {
    do_action( __FUNCTION__ );
}

/**
 * Piggy back admin_menu action.
 *
 * @since 1.0.0
 *
 * @uses do_action() Calls 'qazana_admin_menu'
 */
function qazana_admin_menu() {
    do_action( __FUNCTION__ );
}

/**
 * Piggy back admin_head action.
 *
 * @since 1.0.0
 *
 * @uses do_action() Calls 'qazana_admin_head'
 */
function qazana_admin_head() {
    do_action( __FUNCTION__ );
}

/**
 * Piggy back admin_notices action.
 *
 * @since 1.0.0
 *
 * @uses do_action() Calls 'qazana_admin_notices'
 */
function qazana_admin_notices() {
    do_action( __FUNCTION__ );
}

/**
 * Dedicated action to register admin styles.
 *
 * @since 1.0.0
 *
 * @uses do_action() Calls 'qazana_admin_notices'
 */
function qazana_register_admin_style() {
    do_action( __FUNCTION__ );
}

/**
 * Dedicated action to register admin settings.
 *
 * @since 1.0.0
 *
 * @uses do_action() Calls 'qazana_register_admin_settings'
 */
function qazana_register_admin_settings() {
    do_action( __FUNCTION__ );
}
