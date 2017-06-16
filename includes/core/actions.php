<?php

/**
 * Builder Actions.
 *
 *
 * @see /core/filters.php
 */

/*
 * Attach Builder to WordPress
 *
 * Builder uses its own internal actions to help aid in third-party plugin
 * development, and to limit the amount of potential future code changes when
 * updates to WordPress core occur.
 *
 * These actions exist to create the concept of 'plugin dependencies'. They
 * provide a safe way for plugins to execute code *only* when Builder is
 * installed and activated, without needing to do complicated guesswork.
 *
 * For more information on how this works, see the 'Plugin Dependency' section
 * near the bottom of this file.
 *
 *           v--WordPress Actions        v--Builder Sub-actions
 */
add_action( 'plugins_loaded',           'builder_loaded',                 10 );
add_action( 'init',                     'builder_init',                   0 ); // Early for builder_register
add_action( 'wp_enqueue_scripts',       'builder_enqueue_scripts',        10 );
add_action( 'setup_theme',              'builder_init_classes',           10 );
add_action( 'setup_theme',              'builder_setup_theme',            11 );
add_action( 'after_setup_theme',        'builder_after_setup_theme',      10 );

/*
 * builder_init - Attached to 'init' above
 *
 * Attach various initialization actions to the init action.
 * The load order helps to execute code at the correct time.
 *                                               v---Load order
 */
add_action( 'builder_init', 'builder_load_textdomain',   0 );

add_action( 'builder_activation',    'builder_add_activation_redirect' );
