<?php
namespace Qazana\Extensions\ThemeBuilder\Conditions;

use Qazana\Controls_Stack;
use Qazana\Core\Utils\Exceptions;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

abstract class Condition_Base extends Controls_Stack {

	abstract public function get_label();

	public function get_unique_name() {
		return 'condition_' . $this->get_name();
	}

	public static function get_type() {
		throw new \Exception( 'Please overwrite the method', Exceptions::INTERNAL_SERVER_ERROR );
	}

	public function check( $args ) {
		return false;
	}

	public function get_sub_conditions() {
		return [];
	}

	public function get_all_label() {
		return $this->get_label();
	}

	public function get_condition_config() {
		$config = parent::get_config();
		$config['label'] = $this->get_label();
		$config['sub_conditions'] = $this->get_sub_conditions();
		$config['all_label'] = $this->get_all_label();
		return $config;
	}

	public function __construct( array $data = [] ) {
		parent::__construct( $data );

		// Register Sub conditions
		$this->get_sub_conditions();
	}
}
