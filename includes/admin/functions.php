<?php

/**
 * Builder Admin Functions.
 */

 /**
  * Setup Builder Admin.
  *
  * @since 1.0.0
  *
  * @uses Builder_Admin
  */
 function builder_admin() {
     builder()->admin = new Builder\Admin();
 }

/**
 * Redirect user to Builder's What's New page on activation.
 *
 * @since 1.0.0
 *
 * @internal Used internally to redirect Builder to the about page on activation
 *
 * @uses get_transient( ) To see if transient to redirect exists
 * @uses delete_transient( ) To delete the transient if it exists
 * @uses is_network_admin( ) To bail if being network activated
 * @uses wp_safe_redirect( ) To redirect
 * @uses add_query_arg( ) To help build the URL to redirect to
 * @uses admin_url( ) To get the admin URL to index.php
 *
 * @return If no transient, or in network admin, or is bulk activation
 */
function builder_do_activation_redirect() {

    // Bail if no activation redirect
    if ( ! get_transient( '_builder_activation_redirect' ) ) {
        return;
    }

    // Delete the redirect transient
    delete_transient( '_builder_activation_redirect' );

    // Bail if activating from network, or bulk
    if ( is_network_admin( ) || isset( $_GET['activate-multi'] ) ) {
        return;
    }

    // Bail if the current user cannot see the about page
    if ( ! current_user_can( 'builder_about_page' ) ) {
        return;
    }

    // Redirect to Builder about page
    wp_safe_redirect( add_query_arg( array( 'page' => 'builder-about' ), admin_url( 'index.php' ) ) );
}
