<?php

/**
 * Builder Core Functions.
 */

/** Versions ******************************************************************/

/**
 * Output the Builder version.
 *
 * @since 1.0.0
 *
 * @uses builder_get_version() To get the Builder version
 */
function builder_version() {
    echo builder_get_version();
}
    /**
     * Return the Builder version.
     *
     * @since 1.0.0
     * @retrun string The Builder version
     */
    function builder_get_version() {
        return builder()->version;
    }

/**
 * Output the Builder database version.
 *
 * @since 1.0.0
 *
 * @uses builder_get_version() To get the Builder version
 */
function builder_db_version() {
    echo builder_get_db_version();
}
    /**
     * Return the Builder database version.
     *
     * @since 1.0.0
     * @retrun string The Builder version
     */
    function builder_get_db_version() {
        return builder()->db_version;
    }

/**
 * Output the Builder database version directly from the database.
 *
 * @since 1.0.0
 *
 * @uses builder_get_version() To get the current Builder version
 */
function builder_db_version_raw() {
    echo builder_get_db_version_raw();
}
    /**
     * Return the Builder database version directly from the database.
     *
     * @since 1.0.0
     * @retrun string The current Builder version
     */
    function builder_get_db_version_raw() {
        return get_option( '_builder_db_version', '' );
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
function builder_add_error($code = '', $message = '', $data = '') {
    builder()->errors->add($code, $message, $data);
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
function builder_has_errors() {
    $has_errors = builder()->errors->get_error_codes() ? true : false;

    return apply_filters(__FUNCTION__, $has_errors, builder()->errors);
}

/** Rewrite Extras ************************************************************/

/**
 * Delete a blogs rewrite rules, so that they are automatically rebuilt on
 * the subsequent page load.
 *
 * @since 1.0.0
 */
function builder_delete_rewrite_rules() {
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
function builder_is_post_request() {
    return (bool) ('POST' === strtoupper($_SERVER['REQUEST_METHOD']));
}

/**
 * Return true|false if this is a GET request.
 *
 * @since 1.0.0
 *
 * @return bool
 */
function builder_is_get_request() {
    return (bool) ('GET' === strtoupper($_SERVER['REQUEST_METHOD']));
}

/**
 * Return the Builder plugin path.
 *
 * @since 1.0.0
 * @retrun string The Builder plugin path
 */
function builder_get_dir() {
    return builder()->plugin_dir;
}

/**
 * Return the Builder site width.
 *
 * @since 1.0.0
 * @retrun string site width
 */
function builder_get_site_container_width( $default_value = 1355 ) {
    return apply_filters( __FUNCTION__, get_option( 'site_container_width', $default_value ) );
}
