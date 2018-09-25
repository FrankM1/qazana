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
        return qazana()->get_db_version();
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
 * Return the Qazana plugin path.
 *
 * @since 1.0.0
 * @retrun string The Qazana plugin path
 */
function qazana_get_dir() {
    return qazana()->plugin_dir;
}

/**
 * Return the Qazana plugin url.
 *
 * @since 2.0.0
 * @retrun string The Qazana plugin url
 */
function qazana_get_url() {
    return qazana()->plugin_url;
}