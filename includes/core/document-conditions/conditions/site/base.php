<?php
namespace Qazana\DocumentConditions\Conditions;

use Qazana\Controls_Stack;
use Qazana\Core\Utils\Exceptions;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

use Qazana\Core\DocumentConditions;

/**
 * Define Base class
 */
abstract class Base extends Controls_Stack {

	public $parent_name; 

	public function __construct( array $data = [] ) {
		$data['id'] = 0;
		parent::__construct( $data );
	}

	public function get_conditions_manager() {

		if ( ! $this->parent_name ) {
			return false;
		}

		return qazana()->document_conditions->get_document_support( $this->parent_name )->get_conditions_manager();
	}

	public function register_condition_instance( $condition ) {
		$this->get_conditions_manager()->register_condition_instance( $condition );
	}

	public function get_group_title() {
		return $this->get_title();
	}

	/**
	 * Condition check callback
	 *
	 * @return bool
	 */
	abstract public function check( $args );

	public function get_condition_controls() {
		return [];
	}

	public function get_sub_conditions() {
		return [];
	}

  	public function get_condition_config() {
		$config                   = parent::get_config();
		$config['label']          = $this->get_title();
		$config['sub_conditions'] = $this->get_sub_conditions();
		$config['all_label']      = $this->get_group_title();
		return $config;
    }

    public static function get_post_types( $args = [] ) {
		$post_type_args = [
			'show_in_nav_menus' => true,
		];

		if ( ! empty( $args['post_type'] ) ) {
			$post_type_args['name'] = $args['post_type'];
		}

		$_post_types = get_post_types( $post_type_args , 'objects' );

		$post_types  = [];

		foreach ( $_post_types as $post_type => $object ) {
			$post_types[ $post_type ] = $object->label;
		}

		return $post_types;
	}

}
