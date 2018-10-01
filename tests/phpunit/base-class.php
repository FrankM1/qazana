<?php
namespace Qazana\Testing;

class Qazana_Test_Base extends \WP_UnitTestCase {

	use Qazana_Test;

	protected function getSelf() {
		return $this;
	}
}
