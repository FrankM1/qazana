<?php

/**
 * Builder Admin Actions.
 *
 *
 * @see builder-core-actions.php
 * @see builder-core-filters.php
 */

/*
 * Attach Builder to WordPress
 *
 * Builder uses its own internal actions to help aid in third-party plugin
 * development, and to limit the amount of potential future code changes when
 * updates to WordPress core occur.
 *
 * These actions exist to create the concept of 'plugin dependencies'. They
 * provide a safe way for plugins to execute code *only* when Builder is
 * installed and activated, without needing to do complicated guesswork.
 *
 * For more information on how this works, see the 'Plugin Dependency' section
 * near the bottom of this file.
 *
 *           v--WordPress Actions       v--Builder Sub-actions
 */
add_action( 'admin_menu',              'builder_admin_menu' );
add_action( 'admin_init',              'builder_admin_init' );
add_action( 'admin_head',              'builder_admin_head' );
add_action( 'admin_notices',           'builder_admin_notices' );

// Hook on to admin_init
add_action( 'builder_admin_init', 'builder_setup_updater', 999 );

add_action( 'builder_admin_init', 'builder_register_admin_style' );
add_action( 'builder_admin_init', 'builder_register_admin_settings' );
add_action( 'builder_admin_init', 'builder_do_activation_redirect', 1 );

// Initialize the admin area
add_action( 'builder_init', 'builder_admin' );

// Activation
add_action( 'builder_activation', 'builder_delete_rewrite_rules' );

// Deactivation
add_action( 'builder_deactivation', 'builder_delete_rewrite_rules' );

/** Sub-Actions ***************************************************************/

/**
 * Piggy back admin_init action.
 *
 * @since 1.0.0
 *
 * @uses do_action() Calls 'builder_admin_init'
 */
function builder_admin_init() {
    do_action( __FUNCTION__ );
}

/**
 * Piggy back admin_menu action.
 *
 * @since 1.0.0
 *
 * @uses do_action() Calls 'builder_admin_menu'
 */
function builder_admin_menu() {
    do_action( __FUNCTION__ );
}

/**
 * Piggy back admin_head action.
 *
 * @since 1.0.0
 *
 * @uses do_action() Calls 'builder_admin_head'
 */
function builder_admin_head() {
    do_action( __FUNCTION__ );
}

/**
 * Piggy back admin_notices action.
 *
 * @since 1.0.0
 *
 * @uses do_action() Calls 'builder_admin_notices'
 */
function builder_admin_notices() {
    do_action( __FUNCTION__ );
}

/**
 * Dedicated action to register admin styles.
 *
 * @since 1.0.0
 *
 * @uses do_action() Calls 'builder_admin_notices'
 */
function builder_register_admin_style() {
    do_action( __FUNCTION__ );
}

/**
 * Dedicated action to register admin settings.
 *
 * @since 1.0.0
 *
 * @uses do_action() Calls 'builder_register_admin_settings'
 */
function builder_register_admin_settings() {
    do_action( __FUNCTION__ );
}
