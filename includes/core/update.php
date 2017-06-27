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
    if ( $raw_db_version < 106 ) {
      //qazana_migrate_builder_content_to_qazana();
    }

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
 * @return If network admin or bulk activation
 */
function qazana_add_activation_redirect() {

    // Bail if activating from network, or bulk
    if ( is_network_admin() || isset( $_GET['activate-multi'] ) ) {
        return;
    }

    // Add the transient to redirect
    set_transient( '_qazana_activation_redirect', true, 30 );
}

/*
 * Converts Old Content
 */
function qazana_migrate_builder_content_to_qazana(){

    qazana_write_log('migration_start');

    $all_posts = get_posts( array(
        'numberposts' => -1,
        'post_type' => array( 'any' ),
    ) );


    foreach( $all_posts as $post ) : setup_postdata($post);

    $version = $data = $version = $global_widgets = $source_image_hash = $global_widget_included_posts = $template_widget_type = $css = $template_type =  $revisions_posts = null;

        if ( get_post_type( $post ) === 'builder_library' ) {
            set_post_type( $post->ID, 'qazana_library' );
        }

        /*$revisions_posts = wp_get_post_revisions( $post->ID );

        foreach( $revisions_posts as $post ) : setup_postdata($post);

            qazana_write_log( $post->ID );

        endforeach;

        wp_reset_postdata();*/

        // get old meta
        $data = get_post_meta($post->ID, '_builder_data', true );

        if ( $data ) {

            // update new meta
            update_post_meta( $post->ID,'_qazana_data', $data );

            // delete old meta
            delete_post_meta($post->ID, '_builder_data');
        }


        // get old meta
        $draft_data = get_post_meta($post->ID, '_builder_draft_data', true );

        /*if ( $post->ID == 4 ) {
            qazana_write_log( $post->ID );
            qazana_write_log( $draft_data );

            if ( empty( $data ) ) {
                $draft_data = get_post_meta($post->ID, '_qazana_draft_data', true );
                qazana_write_log( $draft_data );
            }

        }*/

        if ( $draft_data ) {

            // update new meta
            update_post_meta( $post->ID,'_qazana_draft_data', $draft_data );

            // delete old meta
            delete_post_meta($post->ID, '_builder_draft_data');
        }



        /////
        // get old meta
        $version = get_post_meta($post->ID, '_builder_version', true );

        if ( $version ) {
            // update new meta
            update_post_meta( $post->ID,'_qazana_version', $version );

            // delete old meta
            delete_post_meta($post->ID, '_builder_version');
        }

        /////
        // get old meta
        $builder_edit_mode = get_post_meta($post->ID, '_builder_edit_mode', true );

        if ( $builder_edit_mode == 'builder' ) {
            // update new meta
            update_post_meta( $post->ID, '_qazana_edit_mode', 'qazana' );

            // delete old meta
            delete_post_meta($post->ID, '_builder_edit_mode');
        }

        /////
        // get old meta
        $global_widgets = get_post_meta($post->ID, '_builder_global_widgets', true );

        if ( $global_widgets ) {

            // update new meta
            update_post_meta( $post->ID,'_qazana_global_widgets', $global_widgets );

            // delete old meta
            delete_post_meta($post->ID, '_builder_global_widgets');
        }

        /////
        // get old meta
        $source_image_hash = get_post_meta($post->ID, '_builder_source_image_hash', true );

        if ( $source_image_hash ) {

            // update new meta
            update_post_meta( $post->ID,'_qazana_source_image_hash', $source_image_hash );

            // delete old meta
            delete_post_meta($post->ID, '_builder_source_image_hash');
        }

        /////
        // get old meta
        $global_widget_included_posts = get_post_meta($post->ID, '_builder_global_widget_included_posts', true );

        if ( $global_widget_included_posts ) {

            // update new meta
            update_post_meta( $post->ID,'_qazana_global_widget_included_posts', $global_widget_included_posts );

            // delete old meta
            delete_post_meta($post->ID, '_builder_global_widget_included_posts');
        }

        /////
        // get old meta
        $template_widget_type = get_post_meta($post->ID, '_builder_template_widget_type', true );

        if ( $template_widget_type ) {

            // update new meta
            update_post_meta( $post->ID,'_qazana_template_widget_type', $template_widget_type );

            // delete old meta
            delete_post_meta($post->ID, '_builder_template_widget_type');
        }

        /////
        // get old meta
        $css = get_post_meta($post->ID, '_builder_css', true );

        if ( $css ) {

            // update new meta
            update_post_meta( $post->ID,'_qazana_css', $css );

            // delete old meta
            delete_post_meta($post->ID, '_builder_css');

        }

        /////
        // get old meta
        $template_type = get_post_meta($post->ID, '_builder_template_type', true );

        if ( $css ) {

            // update new meta
            update_post_meta( $post->ID,'_qazana_template_type', $template_type );

            // delete old meta
            delete_post_meta($post->ID, '_builder_template_type');
        }

    endforeach;

    wp_reset_postdata();

    ///
    $google_maps_api = get_option( 'builder_google_maps_api_key' );

    update_option( 'qazana_google_maps_api_key', $google_maps_api );

    delete_option( 'builder_google_maps_api_key' );

    ///
    $builder_cpt_support = get_option( 'builder_cpt_support' );

    update_option( 'qazana_cpt_support', $builder_cpt_support );

    delete_option( 'builder_cpt_support' );
    ///

    $builder_scheme_color = get_option( 'builder_scheme_color' );

    update_option( 'qazana_scheme_color', $builder_scheme_color );

    delete_option( 'builder_scheme_color' );

    ///
    $builder_scheme_typography = get_option( 'builder_scheme_typography' );

    update_option( 'qazana_scheme_typography', $builder_scheme_typography );

    delete_option( 'builder_scheme_typography' );
    ///

    $builder_scheme_color_picker = get_option( 'builder_scheme_color-picker' );

    update_option( 'qazana_scheme_color-picker', $builder_scheme_color_picker );

    delete_option( 'builder_scheme_color-picker' );

    qazana()->posts_css_manager->clear_cache();

    qazana_write_log('migration_complete');
}

/**
*
* run Once class
* http://en.bainternet.info/2011/wordpress-run-once-only
*/
class Qazana_Run_Once{

    function run($key){

        $test_case = get_option( 'qazana_run_once' );

        if ( isset( $test_case[$key] ) && $test_case[$key] ){
            return false;
        } else {

            $test_case[$key] = true;
            update_option( 'qazana_run_once', $test_case );

            return true;
        }
    }

    function clear($key){

        $test_case = get_option('qazana_run_once');

        if ( isset( $test_case[$key] ) ) {
            unset( $test_case[$key] );
        }
    }
}

/*
 * convert the content exactly 1 time
 */
//$run_once = new Qazana_Run_Once;
//if ( $run_once->run( 'qazana_migrate_builder_content_to_qazana23' ) ) {
//add_action('init','qazana_migrate_builder_content_to_qazana');
//}
