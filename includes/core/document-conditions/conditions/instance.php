<?php
namespace Qazana\Core\DocumentConditions\Conditions;

use Qazana\Extensions\Documents\DocumentConditions as Document;
use Qazana\Core\DocumentConditions;
use Qazana\Core\Utils\Exceptions;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Instance {

	private $components = [];

	public function add_component( $id, $instance ) {
		$this->components[ $id ] = $instance;
	}

	public function get_component( $id ) {
		if ( isset( $this->components[ $id ] ) ) {
			return $this->components[ $id ];
		}
		return false;
	}

	/**
	 * Load extension files
	 */
	public function __construct( $type ) {
		$this->type = $type;
		$this->register_component();
	}

	function register_component() {
		$this->add_component( 'conditions_db', new DB( $this->type ) );
		$this->add_component( 'conditions_control', new Controls() );
		$this->add_component( 'conditions_manager', new Manager( $this->type ) );
	}

	/**
	 * @return Classes\Conditions/Manager
	 */
	public function get_conditions_control() {
		return $this->get_component( 'conditions_control' );
	}

	/**
	 * @return Classes\Conditions/Manager
	 */
	public function get_conditions_manager() {
		return $this->get_component( 'conditions_manager' );
	}

	/**
	 * @return Classes\Conditions/DB
	 */
	public function get_conditions_db() {
		return $this->get_component( 'conditions_db' );
	}

	/**
	 * @return Classes\Templates_Types/Manager
	 */
	public function get_types_manager() {
		return $this->get_component( 'templates-types' );
	}
}