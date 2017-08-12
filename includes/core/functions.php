<?php

/**
 * Qazana Core Functions.
 */

/** Versions ******************************************************************/

/**
 * Output the Qazana version.
 *
 * @since 1.0.0
 *
 * @uses qazana_get_version() To get the Qazana version
 */
function qazana_version() {
    echo qazana_get_version();
}
    /**
     * Return the Qazana version.
     *
     * @since 1.0.0
     * @retrun string The Qazana version
     */
    function qazana_get_version() {
        return qazana()->get_version();
    }

/**
 * Output the Qazana database version.
 *
 * @since 1.0.0
 *
 * @uses qazana_get_version() To get the Qazana version
 */
function qazana_db_version() {
    echo qazana_get_db_version();
}
    /**
     * Return the Qazana database version.
     *
     * @since 1.0.0
     * @retrun string The Qazana version
     */
    function qazana_get_db_version() {
        return qazana()->get_db_version;
    }

/**
 * Output the Qazana database version directly from the database.
 *
 * @since 1.0.0
 *
 * @uses qazana_get_version() To get the current Qazana version
 */
function qazana_db_version_raw() {
    echo qazana_get_db_version_raw();
}
    /**
     * Return the Qazana database version directly from the database.
     *
     * @since 1.0.0
     * @retrun string The current Qazana version
     */
    function qazana_get_db_version_raw() {
        return get_option( '_qazana_db_version', '' );
    }

/** Errors ********************************************************************/

/**
 * Adds an error message to later be output in the theme.
 *
 * @since 1.0.0
 * @see WP_Error()
 *
 * @uses WP_Error::add();
 *
 * @param string $code    Unique code for the error message
 * @param string $message Translated error message
 * @param string $data    Any additional data passed with the error message
 */
function qazana_add_error($code = '', $message = '', $data = '') {
    qazana()->errors->add($code, $message, $data);
}

/**
 * Check if error messages exist in queue.
 *
 * @since 1.0.0
 * @see WP_Error()
 *
 * @uses is_wp_error()
 * @usese WP_Error::get_error_codes()
 */
function qazana_has_errors() {
    $has_errors = qazana()->errors->get_error_codes() ? true : false;

    return apply_filters(__FUNCTION__, $has_errors, qazana()->errors);
}

/** Rewrite Extras ************************************************************/

/**
 * Delete a blogs rewrite rules, so that they are automatically rebuilt on
 * the subsequent page load.
 *
 * @since 1.0.0
 */
function qazana_delete_rewrite_rules() {
    delete_option('rewrite_rules');
}

/** Requests ******************************************************************/

/**
 * Return true|false if this is a POST request.
 *
 * @since 1.0.0
 *
 * @return bool
 */
function qazana_is_post_request() {
    return (bool) ('POST' === strtoupper($_SERVER['REQUEST_METHOD']));
}

/**
 * Return true|false if this is a GET request.
 *
 * @since 1.0.0
 *
 * @return bool
 */
function qazana_is_get_request() {
    return (bool) ('GET' === strtoupper($_SERVER['REQUEST_METHOD']));
}

/**
 * Return the Qazana plugin path.
 *
 * @since 1.0.0
 * @retrun string The Qazana plugin path
 */
function qazana_get_dir() {
    return qazana()->plugin_dir;
}

/**
 * Return the Qazana site width.
 *
 * @since 1.0.0
 * @retrun string site width
 */
function qazana_get_site_container_width( $default_value = 1355 ) {
    return apply_filters( __FUNCTION__, get_option( 'site_container_width', $default_value ) );
}
