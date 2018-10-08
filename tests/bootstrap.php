<?php

/**
 * Tips: https://codesymphony.co/writing-wordpress-plugin-unit-tests
 */
$_tests_dir = getenv( 'WP_TESTS_DIR' );
if ( ! $_tests_dir ) {
	$_tests_dir = '/tmp/wordpress-tests-lib';
}

define( 'QAZANA_TESTS', true );

/**
 * change PLUGIN_FILE env in phpunit.xml
 */
define( 'PLUGIN_FILE', getenv( 'PLUGIN_FILE' ) );
define( 'PLUGIN_FOLDER', basename( dirname( __DIR__ ) ) );
define( 'PLUGIN_PATH', PLUGIN_FOLDER . '/' . PLUGIN_FILE );

// Activates this plugin in WordPress so it can be tested.
$GLOBALS['wp_tests_options'] = [
	'active_plugins' => [ PLUGIN_PATH ],
	'template' => 'twentysixteen',
	'stylesheet' => 'twentysixteen',
];

require_once $_tests_dir . '/includes/functions.php';

tests_add_filter(
	'muplugins_loaded',
	function() {
		// Manually load plugin
		require dirname( __DIR__ ) . '/' . PLUGIN_FILE;
	}
);

// Removes all sql tables on shutdown
// Do this action last
tests_add_filter( 'shutdown', 'drop_tables', 999999 );

function fix_qunit_html_urls( $html ) {
	// fix wp assets url
	$html = str_replace( home_url( '/wp-includes' ), 'file://' . ABSPATH . 'wp-includes', $html );
	$html = str_replace( home_url( '/wp-admin' ), 'file://' . ABSPATH . 'wp-admin', $html );
	$html = str_replace( home_url( '/wp-content' ), 'file://' . ABSPATH . 'wp-content', $html );

	// fix qazana assets url
	$html = str_replace( home_url() . 'file:', 'file:', $html );

    // For local tests in browser
	$html = str_replace( 'file:///srv/www/wordpress-develop/public_html/src/', 'http://global-wp-content.test/', $html );
    $html = str_replace( 'http://global-wp-content.test/wp-includes', 'http://qazana.test/wp-includes', $html );
    $html = str_replace( 'http://global-wp-content.test/wp-admin', 'http://qazana.test/wp-admin', $html );
    $html = str_replace( 'file:///wp-admin/admin-ajax.php', 'http://qazana.test/wp-admin/admin-ajax.php', $html );
	$html = str_replace( 'http://global-wp-content.test/wp-content/plugins/srv/www/global-wp-content/public_html/', 'http://global-wp-content.test/', $html );
    
	return $html;
}

require $_tests_dir . '/includes/bootstrap.php';

require dirname( __FILE__ ) . '/phpunit/local-factory.php';
require dirname( __FILE__ ) . '/phpunit/trait-test-base.php';
require dirname( __FILE__ ) . '/phpunit/base-class.php';
require dirname( __FILE__ ) . '/phpunit/ajax-class.php';
require dirname( __FILE__ ) . '/phpunit/manager.php';

\Qazana\Testing\Manager::instance();
