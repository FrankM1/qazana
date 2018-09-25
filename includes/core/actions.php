<?php

/**
 * Qazana Actions.
 *
 *
 * @see /core/filters.php
 */

/*
 * Attach Qazana to WordPress
 *
 * Qazana uses its own internal actions to help aid in third-party plugin
 * development, and to limit the amount of potential future code changes when
 * updates to WordPress core occur.
 *
 * These actions exist to create the concept of 'plugin dependencies'. They
 * provide a safe way for plugins to execute code *only* when Qazana is
 * installed and activated, without needing to do complicated guesswork.
 *
 * For more information on how this works, see the 'Plugin Dependency' section
 * near the bottom of this file.
 *
 *           v--WordPress Actions        v--Qazana Sub-actions
 */
add_action( 'plugins_loaded',           'qazana_loaded',                 10 );
add_action( 'init',                     'qazana_init',                   0 ); // Early for qazana_register
add_action( 'wp_enqueue_scripts',       'qazana_enqueue_scripts',        10 );
add_action( 'setup_theme',              'qazana_setup_theme',            11 );
add_action( 'setup_theme',              'qazana_register_extensions',    9 );
add_action( 'after_setup_theme',        'qazana_init_classes',           10 );
add_action( 'after_setup_theme',        'qazana_after_setup_theme',      10 );

/**
 * qazana_loaded - Attached to 'plugins_loaded' above
 *
 * Attach various loader actions to the qazana_loaded action.
 * The load order helps to execute code at the correct time.
 *                                                         v---Load order
 */
add_action( 'qazana_loaded', 'qazana_constants',                 2  );
add_action( 'qazana_loaded', 'qazana_includes',                  6  );
add_action( 'qazana_loaded', 'qazana_setup_globals',             8  );

/*
 * qazana_init - Attached to 'init' above
 *
 * Attach various initialization actions to the init action.
 * The load order helps to execute code at the correct time.
 *                                               v---Load order
 */
add_action( 'qazana_init', 'qazana_register',               0 );
add_action( 'qazana_init', 'qazana_load_textdomain',        0 );
add_action( 'qazana_init', 'qazana_register_post_types',    2 );

add_action( 'qazana_activation',    'qazana_add_activation_redirect' );
