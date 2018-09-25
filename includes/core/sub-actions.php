<?php

/**
 * Plugin Dependency.
 *
 * The purpose of the following hooks is to mimic the behavior of something
 * called 'plugin dependency'which enables a plugin to have plugins of their
 * own in a safe and reliable way.
 *
 * We do this in Qazana by mirroring existing WordPress hooks in many places
 * allowing dependent plugins to hook into the Qazana specific ones, thus
 * guaranteeing proper code execution only when Qazana is active.
 *
 * The following functions are wrappers for hooks, allowing them to be
 * manually called and/or piggy-backed on top of other hooks if needed.
 *
 * @todo use anonymous functions when PHP minimum requirement allows ( 5.3 )
 */

/** Activation Actions ********************************************************/

/**
 * Runs on Qazana activation.
 *
 * @since 1.0.0
 *
 * @uses register_uninstall_hook() To register our own uninstall hook
 * @uses do_action() Calls 'qazana_activation'hook
 */
function qazana_activation() {
    do_action( __FUNCTION__ );
}

/**
 * Runs on Qazana deactivation.
 *
 * @since 1.0.0
 *
 * @uses do_action() Calls 'qazana_deactivation'hook
 */
function qazana_deactivation()
{
    do_action( __FUNCTION__ );
}

/**
 * Runs when uninstalling Qazana.
 *
 * @since 1.0.0
 *
 * @uses do_action() Calls 'qazana_uninstall'hook
 */
function qazana_uninstall() {
    do_action( __FUNCTION__ );
}

/** Main Actions **************************************************************/

/**
 * Main action responsible for constants, globals, and includes.
 *
 * @since 1.0.0
 *
 * @uses do_action() Calls 'qazana_loaded'
 */
function qazana_loaded() {
    do_action( __FUNCTION__ );
}

/**
 * Setup constants
 *
 * @since 1.0.0
 * @uses do_action() Calls 'qazana_constants'
 */
function qazana_constants() {
	do_action( __FUNCTION__ );
}

/**
 * Include files
 *
 * @since 1.0.0
 * @uses do_action() Calls 'qazana_includes'
 */
function qazana_includes() {
	do_action( __FUNCTION__ );
}

/**
 * Setup globals AFTER includes
 *
 * @since 1.0.0
 * @uses do_action() Calls 'qazana_setup_globals'
 */
function qazana_setup_globals() {
	do_action( __FUNCTION__ );
}

/**
 * Register any objects before anything is initialized.
 *
 * @since 1.0.0
 *
 * @uses do_action() Calls 'qazana_register'
 */
function qazana_register() {
    do_action( __FUNCTION__ );
}

/**
 * Initialize any code after everything has been loaded.
 *
 * @since 1.0.0
 *
 * @uses do_action() Calls 'qazana_init'
 */
function qazana_init() {
    do_action( __FUNCTION__ );
}

/**
 * Initialize any code after everything has been loaded.
 *
 * @since 1.0.0
 *
 * @uses do_action() Calls 'qazana_init_classes'
 */
function qazana_init_classes() {
    do_action( __FUNCTION__ );
}

/** Supplemental Actions ******************************************************/

/**
 * Load translations for current language.
 *
 * @since 1.0.0
 *
 * @uses do_action() Calls 'qazana_load_textdomain'
 */
function qazana_load_textdomain() {
    do_action( __FUNCTION__ );
}

/**
 * Setup the extensions.
 *
 * @since 1.0.0
 *
 * @uses do_action() Calls 'qazana_register_extensions'
 */
function qazana_register_extensions() {
    do_action( __FUNCTION__ );
}

/**
 * Setup the post types.
 *
 * @since 1.0.0
 *
 * @uses do_action() Calls 'qazana_register_post_type'
 */
function qazana_register_post_types() {
    do_action( __FUNCTION__ );
}

/**
 * Enqueue Qazana specific CSS and JS.
 *
 * @since 1.0.0
 *
 * @uses do_action() Calls 'qazana_enqueue_scripts'
 */
function qazana_enqueue_scripts() {
    do_action( __FUNCTION__ );
}

/**
 * The main action used for executing code before the theme has been setup.
 *
 * @since 1.0.0
 *
 * @uses do_action()
 */
function qazana_setup_theme() {
    do_action( __FUNCTION__ );
}

/**
 * The main action used for executing code after the theme has been setup.
 *
 * @since 1.0.0
 *
 * @uses do_action()
 */
function qazana_after_setup_theme() {
    do_action( __FUNCTION__ );
}
