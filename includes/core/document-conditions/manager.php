<?php
namespace Qazana\Core\DocumentConditions;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

use Qazana\Core\DocumentConditions\Conditions;

class Manager {

	public $documents_support = [];
	public $conditions_instance = [];

	/**
	 * Add document support
	 */
	public function add_document_support( $type ) {
		$this->documents_support[] = $type;
	}

	/**
	 * Generate condition
	 */
	public function generate_conditions() {
		foreach ( $this->documents_support as $document_name ) {
			$this->conditions_instance[$document_name] = new Conditions\Instance( $document_name );
		}
	}

	/**
	 * Document support
	 */
	public function get_document_support( $type ) {
		return $this->conditions_instance[$type];
	}

	/**
	 * Load extension files
	 */
	public function __construct() {
		add_action( 'qazana/init', [ $this, 'generate_conditions' ] );
	}

	public function is_registered_document( $post_id ) {

		$document = qazana()->documents->get( $post_id );

		if ( in_array( $document->get_name(), $this->documents_support ) ) {
			return $document instanceof Document;
		}

		return false;
	}

	public function get_document_instance( $post_id ) {
		$document = qazana()->documents->get( $post_id );
		return $this->documents_support[ $document->get_name() ];
	}
}