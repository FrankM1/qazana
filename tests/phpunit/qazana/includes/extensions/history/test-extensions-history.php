<?php

namespace Qazana\Testing\Modules\History;

use Qazana\Extensions\History;
use Qazana\Testing\Qazana_Test_Base;

class Qazana_Test_Manager extends Qazana_Test_Base {

	public function test_should_get_name() {
		$Extension = new History();

		$this->assertEquals( $Extension->get_name(), 'history' );
	}
}
