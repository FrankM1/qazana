<?php

class Elementor_Test_Base extends WP_UnitTestCase {

	public function setUp() {
		parent::setUp();

		wp_set_current_user( $this->factory->user->create( [ 'role' => 'administrator' ] ) );

		// Make sure the main class is running
		qazana();

		// Run fake actions
		do_action( 'init' );
		do_action( 'plugins_loaded' );
	}

	public function test_plugin_activated() {
		$this->assertTrue( is_plugin_active( PLUGIN_PATH ) );
	}

	public function test_getInstance() {
		$this->assertInstanceOf( '\Qazana\Plugin', qazana() );
	}

	/**
	 * @expectedIncorrectUsage __clone
	 */
	public function test_Clone() {
		$obj_cloned = clone qazana();
	}

	/**
	 * @expectedIncorrectUsage __wakeup
	 */
	public function test_Wakeup() {
		unserialize( serialize( qazana() ) );
	}
}
