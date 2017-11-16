<?php

/**
 * Qazana Updater.
 */

/**
 * If there is no raw DB version, this is the first installation.
 *
 * @since 1.0.0
 *
 * @uses get_option()
 * @uses qazana_get_db_version() To get Qazana's database version
 *
 * @return bool True if update, False if not
 */
function qazana_is_install() {
    return ! qazana_get_db_version_raw();
}

/**
 * Compare the Qazana version to the DB version to determine if updating.
 *
 * @since 1.0.0
 *
 * @uses get_option()
 * @uses qazana_get_db_version() To get Qazana's database version
 *
 * @return bool True if update, False if not
 */
function qazana_is_update() {

    $raw = ( int ) qazana_get_db_version_raw();
    $cur = ( int ) qazana_get_db_version();
    $retval = ( bool ) ( $raw < $cur );

    return $retval;
}

/**
 * Determine if Qazana is being activated.
 *
 * Note that this function currently is not used in Qazana core and is here
 * for third party plugins to use to check for Qazana activation.
 *
 * @since 1.0.0
 *
 * @return bool True if activating Qazana, false if not
 */
function qazana_is_activation( $basename = '' ) {

    global $pagenow;

    $qazana = qazana();
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
    if ( empty( $basename ) && ! empty( $qazana->basename ) ) {
        $basename = $qazana->basename;
    }

    // Bail if no basename
    if ( empty( $basename ) ) {
        return false;
    }

    // Is Qazana being activated?
    return in_array( $basename, $plugins );
}

/**
 * Determine if Qazana is being deactivated.
 *
 * @since 1.0.0
 *
 * @return bool True if deactivating Qazana, false if not
 */
function qazana_is_deactivation( $basename = '' ) {

    global $pagenow;

    $qazana = qazana();
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
    if ( empty( $basename ) && !empty( $qazana->basename ) ) {
        $basename = $qazana->basename;
    }

    // Bail if no basename
    if ( empty( $basename ) ) {
        return false;
    }

    // Is Qazana being deactivated?
    return in_array( $basename, $plugins );
}

/**
 * Update the DB to the latest version.
 *
 * @since 1.0.0s
 *
 * @uses update_option()
 * @uses qazana_get_db_version() To get Qazana's database version
 */
function qazana_version_bump() {
    update_option( '_qazana_db_version', qazana_get_db_version() );
}

//add_action( 'wpmu_upgrade_site', 'qazana_network_upgrade_site' );
/**
 * Run silent upgrade on each site in the network during a network upgrade.
 *
 * Update Qazana database settings for all sites in a network during network upgrade process.
 *
 * @since 1.0.0
 *
 * @param int $blog_id Blog ID.
 */
function qazana_network_upgrade_site( $blog_id ) {

    switch_to_blog( $blog_id );
    $upgrade_url = add_query_arg( array( 'action' => 'qazana-silent-upgrade' ), admin_url( 'admin-ajax.php' ) );
    restore_current_blog();

    wp_remote_get( $upgrade_url );

}

add_action( 'wp_ajax_no_priv_qazana-silent-upgrade', 'qazana_silent_upgrade' );
/**
 * Qazana settings upgrade. Silent upgrade ( no redirect ).
 *
 * Meant to be called via ajax request during network upgrade process.
 *
 * @since 1.0.0
 *
 * @uses qazana_upgrade() Update Qazana to the latest version.
 */
function qazana_silent_upgrade() {

    qazana_setup_updater();
    exit( 0 );

}

/**
 * Setup the Qazana updater.
 *
 * @since 1.0.0
 *
 * @uses qazana_version_updater()
 * @uses qazana_version_bump()
 * @uses flush_rewrite_rules()
 */
function qazana_setup_updater() {

    // Bail if no update needed
    if ( qazana_is_deactivation( qazana()->basename ) ) {
        return;
    }

    // Bail if no update needed
    if ( ! qazana_is_update() ) {
        return;
    }

    // Call the automated updater
    qazana_version_updater();
}

/**
 * Qazana's version updater looks at what the current database version is, and
 * runs whatever other code is needed.
 *
 * This is most-often used when the data schema changes, but should also be used
 * to correct issues with Qazana meta-data silently on software update.
 *
 * @since 1.0.0
 */
function qazana_version_updater() {

    // Get the raw database version
    $raw_db_version = ( int ) qazana_get_db_version_raw();

    // upgrade

    /** 1.0.1 Branch ************************************************************/

    // 1.0.1
    //if ( $raw_db_version < 101 ) {
        // upgrade routine function ges here sample();
    //}

    // Bump the version
    qazana_version_bump();

    // Delete rewrite rules to force a flush
    qazana_delete_rewrite_rules();
}

/**
 * Redirect user to Qazana's What's New page on activation.
 *
 * @since 1.0.0
 *
 * @internal Used internally to redirect Qazana to the about page on activation
 *
 * @uses is_network_admin() To bail if being network activated
 * @uses set_transient() To drop the activation transient for 30 seconds
 *
 * @return null If network admin or bulk activation
 */
function qazana_add_activation_redirect() {

    // Bail if activating from network, or bulk
    if ( is_network_admin() || isset( $_GET['activate-multi'] ) ) {
        return;
    }

    // Add the transient to redirect
    set_transient( '_qazana_activation_redirect', true, 30 );
}
