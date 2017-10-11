<?php
/**
 * Plugin Name: Qazana: A Frontend page builder for WordPress
 * Description: Front-end page builder for WordPress with live drag and drop editing. Build high quality responsive websites and landing pages visually. Any theme, anywhere.
 * Plugin URI: https://qazana.net/
 * Author: RadiumThemes.com
 * Version: 1.2.0
 * Author URI: https://qazana.net/
 *
 * Text Domain: qazana
 *
 * Qazana is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * Qazana is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 */

/**
 * Based on : Elementor plugin version 0.10.2
 * Description: The most advanced frontend drag & drop page builder. Create high-end, pixel perfect websites at record speeds. Any theme, any page, any design.
 * Plugin URI: https://elementor.com/
 * Author: Elementor.com
 * Version: 1.1.1
 * Author URI: https://elementor.com/
 *
 * Elementor is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * Elementor is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
} // Exit if accessed directly

define( 'QAZANA__FILE__', __FILE__ );

if ( ! version_compare( PHP_VERSION, '5.4', '>=' ) ) {
    add_action( 'admin_notices', 'qazana_fail_php_version' );
} else {
    require plugin_dir_path( QAZANA__FILE__ ) . 'includes/plugin.php';
}

/**
 * Show in WP Dashboard notice about the plugin is not activated.
 *
 * @since 1.0.0
 *
 * @return void
 */
function qazana_fail_php_version() {
    $message = esc_html__( 'Qazana requires PHP version 5.4+, plugin is currently NOT ACTIVE.', 'qazana' );
    $html_message = sprintf( '<div class="error">%s</div>', wpautop( $message ) );
    echo wp_kses_post( $html_message );
}

/**
 * Helper function for writing to log file.
 *
 * @since 1.0.0
 *
 * @param log data to log
 * @param type log or export
 */
function qazana_write_log( $log, $type = '1' ) {
    if ( true === WP_DEBUG ) {
        if ( is_array( $log ) || is_object( $log ) ) {
            if ( $type === '1' ) {
                error_log( print_r( $log, true ) );
            } else {
                error_log( var_export( $log, true ) );
            }
        } else {
            error_log( $log );
        }
    }
}

/**
 * The main function responsible for returning the one true Video Central Instance
 * to functions everywhere.
 *
 * Use this function like you would a global variable, except without needing
 * to declare the global.
 *
 * Example: <?php $qazana = qazana(); ?>
 *
 * @since 1.0.0
 *
 * @return The one true Qazana Instance
 */
function qazana() {
    // In tests we run the instance manually.
    if ( ! defined( 'QAZANA_TESTS' ) ) {
        $instance = Qazana\Plugin::instance();

        return $instance;
    }
}

/*
 * Hook Qazana early onto the 'plugins_loaded' action.
 *
 * This gives all other plugins the chance to load before Video Central, to get their
 * actions, filters, and overrides setup without Qazana being in the way.
 */
if ( defined( 'QAZANA_LATE_LOAD' ) ) {
    add_action( 'plugins_loaded', 'qazana', (int) QAZANA_LATE_LOAD );
} else {
    qazana();
}
