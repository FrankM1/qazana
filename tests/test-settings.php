<?php

class Qazana_Test_Settings extends WP_UnitTestCase {

	public function test_validationsCheckboxList() {
		$this->assertEquals( [], \Qazana\Admin\Settings\Validations::checkbox_list( null ) );
		$this->assertEquals( [ 'a', 'b' ], \Qazana\Admin\Settings\Validations::checkbox_list( [ 'a', 'b' ] ) );
	}
}
