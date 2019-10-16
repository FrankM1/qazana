<?php
namespace Qazana\Testing;

class Qazana_Test_Editor extends Qazana_Test_Base {

	public function setUp() {
		parent::setUp();

		wp_set_current_user( $this->factory()->get_administrator_user()->ID );

		$GLOBALS['post'] = $this->factory()->create_and_get_default_post()->IDs;
	}

	public function test_getInstance() {
		$this->assertInstanceOf( '\Qazana\Editor', $this->qazana()->get_editor() );
	}

	// public function test_enqueueScripts() {
	// 	ini_set( 'memory_limit', '85M' );

	// 	ob_start();
	// 	$this->qazana()->get_editor()->enqueue_scripts();
	// 	ob_end_clean();

	// 	$scripts = [
	// 		'wp-auth-check',
    //         'jquery-ui-sortable',
    //         'jquery-ui-resizable',
    //         'backbone-marionette',
    //         'backbone-radio',
    //         'perfect-scrollbar',
    //         'nprogress',
    //         'tipsy',
    //         'imagesloaded',
    //         'heartbeat',
    //         'jquery-qazana-select2',
    //         'flatpickr',
    //         'qazana-dialog',
    //         'ace',
    //         'ace-language-tools',
    //         'jquery-easing',
    //         'hoverIntent',
    //         'jquery-fonticonpicker',
	// 	];

	// 	foreach ( $scripts as $script ) {
	// 		$this->assertTrue( wp_script_is( $script ) );
	// 	}
	// }

	public function test_enqueueStyles() {
		$this->qazana()->get_editor()->enqueue_styles();

		$styles = [
			'qazana-select2',
            'qazana-icons',
            'wp-auth-check',
            'jquery-fonticonpicker',
            'jquery-fonticonpicker-grey',
            'font-awesome',
            'flatpickr',
		];

		foreach ( $styles as $style ) {
			$this->assertTrue( wp_style_is( $style ) );
		}
	}

	// public function test_renderFooter() {
	// 	ob_start();
	// 	$this->qazana()->get_editor()->wp_footer();
	// 	$buffer = ob_get_clean();

	// 	$this->assertNotEmpty( $buffer );
	// }
}
