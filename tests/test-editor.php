<?php

class Qazana_Test_Editor extends WP_UnitTestCase {

	public function setUp() {
		parent::setUp();

		wp_set_current_user( $this->factory->user->create( [ 'role' => 'administrator' ] ) );

		$GLOBALS['post'] = $this->factory->post->create_and_get();
	}

	public function test_getInstance() {
		$this->assertInstanceOf( '\Qazana\Editor', qazana()->editor );
	}

	public function test_enqueueScripts() {
		ini_set( 'memory_limit', '85M' );

		ob_start();
		qazana()->editor->enqueue_scripts();
		ob_end_clean();

		$scripts = [
			'jquery-ui-sortable',
			'jquery-ui-resizable',
			'backbone-marionette',
			'backbone-radio',
			'perfect-scrollbar',
			'nprogress',
			'tipsy',
			'imagesloaded',
			'heartbeat',
			'qazana-dialog',

			'qazana-editor',
		];

		foreach ( $scripts as $script ) {
			$this->assertTrue( wp_script_is( $script ) );
		}
	}

	public function test_enqueueStyles() {
		qazana()->editor->enqueue_styles();

		$styles = [
			'font-awesome',
			'select2',
			'qazana-icons',
			'wp-auth-check',
			'google-font-roboto',

			'qazana-editor',
		];

		foreach ( $styles as $style ) {
			$this->assertTrue( wp_style_is( $style ) );
		}
	}

	public function test_renderFooter() {
		ob_start();
		qazana()->editor->wp_footer();
		$buffer = ob_get_clean();

		$this->assertNotEmpty( $buffer );
	}
}
