<?php
namespace Qazana\Testing;

class Qazana_Test_AJAX extends \WP_Ajax_UnitTestCase {

	use Qazana_Test;

	protected function getSelf() {
		return $this;
	}

	public function _handleAjaxAndDecode( $action ) {
		try {
			$this->_handleAjax( $action );
		} catch ( \WPAjaxDieContinueException $e ) {
			unset( $e );
		}

		return json_decode( $this->_last_response, true );
	}
}
