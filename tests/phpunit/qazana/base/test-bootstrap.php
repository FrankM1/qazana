<?php
namespace Qazana\Testing;

class Qazana_Test_Bootstrap extends Qazana_Test_Base {

	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();
		remove_action( 'admin_init', '_maybe_update_themes' );
		remove_action( 'admin_init', '_maybe_update_core' );
		remove_action( 'admin_init', '_maybe_update_plugins' );

		wp_set_current_user( self::factory()->get_administrator_user()->ID );

		// Make sure the main class is running
		\Qazana\Plugin::instance();

        // Run fake actions
        do_action( 'plugins_loaded' );

        do_action( 'qazana_loaded' );
        do_action( 'qazana/loaded' );

        do_action( 'qazana_after_setup_theme' );

		do_action( 'init' );
        do_action( 'qazana_init' );
        do_action( 'qazana/init' );

        do_action( 'qazana_init_classes' );
        do_action( 'qazana_load_textdomain' );
        do_action( 'qazana_register_extensions' );

        // do_action( 'template_redirect' );
	}

	public function test_plugin_activated() {
		$this->assertTrue( is_plugin_active( PLUGIN_PATH ) );
    }

	public function test_getInstance() {
		$this->assertInstanceOf( '\Qazana\Plugin', \Qazana\Plugin::instance() );
    }

    public function test_pluginVersion_NotNull() {
		$this->assertInternalType( 'string', \Qazana\Plugin::instance()->get_version() );
    }

	/**
	 * @expectedIncorrectUsage __clone
	 */
	public function test_Clone() {
		$obj_cloned = clone \Qazana\Plugin::instance();
	}

	/**
	 * @expectedIncorrectUsage __wakeup
	 */
	public function test_Wakeup() {
		unserialize( serialize( \Qazana\Plugin::instance() ) );
	}
}
