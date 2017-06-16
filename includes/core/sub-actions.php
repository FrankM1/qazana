<?php

/**
 * Plugin Dependency.
 *
 * The purpose of the following hooks is to mimic the behavior of something
 * called 'plugin dependency'which enables a plugin to have plugins of their
 * own in a safe and reliable way.
 *
 * We do this in Builder by mirroring existing WordPress hooks in many places
 * allowing dependent plugins to hook into the Builder specific ones, thus
 * guaranteeing proper code execution only when Builder is active.
 *
 * The following functions are wrappers for hooks, allowing them to be
 * manually called and/or piggy-backed on top of other hooks if needed.
 *
 * @todo use anonymous functions when PHP minimum requirement allows ( 5.3 )
 */

/** Activation Actions ********************************************************/

/**
 * Runs on Builder activation.
 *
 * @since 1.0.0
 *
 * @uses register_uninstall_hook() To register our own uninstall hook
 * @uses do_action() Calls 'builder_activation'hook
 */
function builder_activation() {
    do_action( __FUNCTION__ );
}

/**
 * Runs on Builder deactivation.
 *
 * @since 1.0.0
 *
 * @uses do_action() Calls 'builder_deactivation'hook
 */
function builder_deactivation()
{
    do_action( __FUNCTION__ );
}

/**
 * Runs when uninstalling Builder.
 *
 * @since 1.0.0
 *
 * @uses do_action() Calls 'builder_uninstall'hook
 */
function builder_uninstall() {
    do_action( __FUNCTION__ );
}

/** Main Actions **************************************************************/

/**
 * Main action responsible for constants, globals, and includes.
 *
 * @since 1.0.0
 *
 * @uses do_action() Calls 'builder_loaded'
 */
function builder_loaded() {
    do_action( __FUNCTION__ );
}

/**
 * Register any objects before anything is initialized.
 *
 * @since 1.0.0
 *
 * @uses do_action() Calls 'builder_register'
 */
function builder_register() {
    do_action( __FUNCTION__ );
}

/**
 * Initialize any code after everything has been loaded.
 *
 * @since 1.0.0
 *
 * @uses do_action() Calls 'builder_init'
 */
function builder_init() {
    do_action( __FUNCTION__ );
}

/**
 * Initialize any code after everything has been loaded.
 *
 * @since 1.0.0
 *
 * @uses do_action() Calls 'builder_init'
 */
function builder_init_classes() {
    do_action( __FUNCTION__ );
}

/** Supplemental Actions ******************************************************/

/**
 * Load translations for current language.
 *
 * @since 1.0.0
 *
 * @uses do_action() Calls 'builder_load_textdomain'
 */
function builder_load_textdomain() {
    do_action( __FUNCTION__ );
}

/**
 * Setup the post types.
 *
 * @since 1.0.0
 *
 * @uses do_action() Calls 'builder_register_post_type'
 */
function builder_register_post_types() {
    do_action( __FUNCTION__ );
}

/**
 * Register the built in Builder taxonomies.
 *
 * @since 1.0.0
 *
 * @uses do_action() Calls 'builder_register_taxonomies'
 */
function builder_register_taxonomies() {
    do_action( __FUNCTION__ );
}

/**
 * Register the default Builder views.
 *
 * @since 1.0.0
 *
 * @uses do_action() Calls 'builder_register_views'
 */
function builder_register_views() {
    do_action( __FUNCTION__ );
}

/**
 * Register the default Builder shortcodes.
 *
 * @since 1.0.0
 *
 * @uses do_action() Calls 'builder_register_shortcodes'
 */
function builder_register_shortcodes() {
    do_action( __FUNCTION__ );
}

/**
 * Enqueue Builder specific CSS and JS.
 *
 * @since 1.0.0
 *
 * @uses do_action() Calls 'builder_enqueue_scripts'
 */
function builder_enqueue_scripts() {
    do_action( __FUNCTION__ );
}

/**
 * The main action used for executing code before the theme has been setup.
 *
 * @since 1.0.0
 *
 * @uses do_action()
 */
function builder_setup_theme() {
    do_action( __FUNCTION__ );
}

/**
 * The main action used for executing code after the theme has been setup.
 *
 * @since 1.0.0
 *
 * @uses do_action()
 */
function builder_after_setup_theme() {
    do_action( __FUNCTION__ );
}

/**
 * The main action used for handling theme-side GET requests.
 *
 * @since 1.0.0
 *
 * @uses do_action()
 */
function builder_get_request() {

    // Bail if not a GET action
    if ( ! builder_is_get_request() ) {
        return;
    }

    // Bail if no action
    if ( empty( $_GET['action'] ) ) {
        return;
    }

    // This dynamic action is probably the one you want to use. It narrows down
    // the scope of the 'action'without needing to check it in your function.
    do_action( 'builder_get_request_' . $_GET['action'] );

    // Use this static action if you don't mind checking the 'action'yourself.
    do_action( __FUNCTION__, $_GET['action'] );
}

/** Filters *******************************************************************/

/**
 * Filter the plugin locale and domain.
 *
 * @since 1.0.0
 *
 * @param string $locale
 * @param string $domain
 */
function builder_plugin_locale( $locale = '', $domain = '') {
    return apply_filters( __FUNCTION__, $locale, $domain );
}

/**
 * Maps video caps to built in WordPress caps.
 *
 * @since 1.0.0
 *
 * @param array  $caps    Capabilities for meta capability
 * @param string $cap     Capability name
 * @param int    $user_id User id
 * @param mixed  $args    Arguments
 */
function builder_map_meta_caps( $caps = array(), $cap = '', $user_id = 0, $args = array() ) {
    return apply_filters( __FUNCTION__, $caps, $cap, $user_id, $args );
}

/** Theme Helpers *************************************************************/

/**
 * The main action used for executing code before the theme has been setup
 *
 * @since bbPress (r3829)
 * @uses do_action()
 */
function builder_register_widget_packages() {
	do_action( __FUNCTION__ );
}
