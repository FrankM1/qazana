<?php

/**
 * Builder Updater.
 */

/**
 * If there is no raw DB version, this is the first installation.
 *
 * @since 1.0.0
 *
 * @uses get_option()
 * @uses builder_get_db_version() To get Builder's database version
 *
 * @return bool True if update, False if not
 */
function builder_is_install() {
    return ! builder_get_db_version_raw();
}

/**
 * Compare the Builder version to the DB version to determine if updating.
 *
 * @since 1.0.0
 *
 * @uses get_option()
 * @uses builder_get_db_version() To get Builder's database version
 *
 * @return bool True if update, False if not
 */
function builder_is_update() {

    $raw = ( int ) builder_get_db_version_raw();
    $cur = ( int ) builder_get_db_version();
    $retval = ( bool ) ( $raw < $cur );

    return $retval;
}

/**
 * Determine if Builder is being activated.
 *
 * Note that this function currently is not used in Builder core and is here
 * for third party plugins to use to check for Builder activation.
 *
 * @since 1.0.0
 *
 * @return bool True if activating Builder, false if not
 */
function builder_is_activation( $basename = '' ) {

    global $pagenow;

    $builder = builder();
    $action = false;

    // Bail if not in admin/plugins
    if ( ! ( is_admin() && ( 'plugins.php' === $pagenow ) ) ) {
        return false;
    }

    if ( !empty( $_REQUEST['action'] ) && ( '-1' !== $_REQUEST['action'] ) ) {
        $action = $_REQUEST['action'];
    } elseif ( !empty( $_REQUEST['action2'] ) && ( '-1' !== $_REQUEST['action2'] ) ) {
        $action = $_REQUEST['action2'];
    }

    // Bail if not activating
    if ( empty( $action ) || !in_array( $action, array( 'activate', 'activate-selected' ) ) ) {
        return false;
    }

    // The plugin( s ) being activated
    if ( $action === 'activate' ) {
        $plugins = isset( $_GET['plugin'] ) ? array( $_GET['plugin'] ) : array();
    } else {
        $plugins = isset( $_POST['checked'] ) ? ( array ) $_POST['checked'] : array();
    }

    // Set basename if empty
    if ( empty( $basename ) && ! empty( $builder->basename ) ) {
        $basename = $builder->basename;
    }

    // Bail if no basename
    if ( empty( $basename ) ) {
        return false;
    }

    // Is Builder being activated?
    return in_array( $basename, $plugins );
}

/**
 * Determine if Builder is being deactivated.
 *
 * @since 1.0.0
 *
 * @return bool True if deactivating Builder, false if not
 */
function builder_is_deactivation( $basename = '' ) {

    global $pagenow;

    $builder = builder();
    $action = false;

    // Bail if not in admin/plugins
    if ( !( is_admin() && ( 'plugins.php' === $pagenow ) ) ) {
        return false;
    }

    if ( ! empty( $_REQUEST['action'] ) && ( '-1' !== $_REQUEST['action'] ) ) {
        $action = $_REQUEST['action'];
    } elseif ( !empty( $_REQUEST['action2'] ) && ( '-1' !== $_REQUEST['action2'] ) ) {
        $action = $_REQUEST['action2'];
    }

    // Bail if not deactivating
    if ( empty( $action ) || !in_array( $action, array( 'deactivate', 'deactivate-selected' ) ) ) {
        return false;
    }

    // The plugin( s ) being deactivated
    if ( $action === 'deactivate' ) {
        $plugins = isset( $_GET['plugin'] ) ? array( $_GET['plugin'] ) : array();
    } else {
        $plugins = isset( $_POST['checked'] ) ? ( array ) $_POST['checked'] : array();
    }

    // Set basename if empty
    if ( empty( $basename ) && !empty( $builder->basename ) ) {
        $basename = $builder->basename;
    }

    // Bail if no basename
    if ( empty( $basename ) ) {
        return false;
    }

    // Is Builder being deactivated?
    return in_array( $basename, $plugins );
}

/**
 * Update the DB to the latest version.
 *
 * @since 1.0.0s
 *
 * @uses update_option()
 * @uses builder_get_db_version() To get Builder's database version
 */
function builder_version_bump() {
    update_option( '_builder_db_version', builder_get_db_version() );
}

/**
 * Setup the Builder updater.
 *
 * @since 1.0.0
 *
 * @uses builder_version_updater()
 * @uses builder_version_bump()
 * @uses flush_rewrite_rules()
 */
function builder_setup_updater() {

    // Bail if no update needed
    if ( builder_is_deactivation( builder()->basename ) ) {
        return;
    }

    // Bail if no update needed
    if ( ! builder_is_update() ) {
        return;
    }

    // Call the automated updater
    builder_version_updater();
}

/**
 * Builder's version updater looks at what the current database version is, and
 * runs whatever other code is needed.
 *
 * This is most-often used when the data schema changes, but should also be used
 * to correct issues with Builder meta-data silently on software update.
 *
 * @since 1.0.0
 */
function builder_version_updater() {

    // Get the raw database version
    $raw_db_version = ( int ) builder_get_db_version_raw();

    // upgrade

    /** 1.0.1 Branch ************************************************************/

    // 1.0.1
    //if ( $raw_db_version < 101 ) {
     // builder_upgrade_v101();
    //}

    // Bump the version
    builder_version_bump();

    // Delete rewrite rules to force a flush
    builder_delete_rewrite_rules();
}

/**
 * Redirect user to Builder's What's New page on activation.
 *
 * @since 1.0.0
 *
 * @internal Used internally to redirect Builder to the about page on activation
 *
 * @uses is_network_admin() To bail if being network activated
 * @uses set_transient() To drop the activation transient for 30 seconds
 *
 * @return If network admin or bulk activation
 */
function builder_add_activation_redirect() {

    // Bail if activating from network, or bulk
    if ( is_network_admin() || isset( $_GET['activate-multi'] ) ) {
        return;
    }

    // Add the transient to redirect
    set_transient( '_builder_activation_redirect', true, 30 );
}
