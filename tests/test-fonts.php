<?php

class Qazana_Test_Fonts extends WP_UnitTestCase {

	public function test_getAllFonts() {
		$this->assertNotEmpty( \Qazana\Fonts::get_fonts() );
	}

	public function test_getFontType() {
		$this->assertEquals( 'system', \Qazana\Fonts::get_font_type( 'Arial' ) );
		$this->assertFalse( \Qazana\Fonts::get_font_type( 'NotFoundThisFont' ) );
	}

	public function test_getFontByGroups() {
		$this->assertArrayHasKey( 'Arial', \Qazana\Fonts::get_fonts_by_groups( [ 'system' ] ) );
		$this->assertArrayNotHasKey( 'Arial', \Qazana\Fonts::get_fonts_by_groups( [ 'googlefonts' ] ) );
	}
}
