<?php
namespace Qazana\Extensions\Controls;

use Qazana\Control_Select2;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Query extends Control_Select2 {

	public function get_type() {
		return 'query';
	}
}
