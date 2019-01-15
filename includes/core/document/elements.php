<?php
namespace Qazana\Document;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

use Qazana\Element_Base;

/**
 * Qazana document elements.
 *
 * Qazana elements manager handler class is responsible for registering and
 * initializing all the supported elements.
 *
 * @since 1.0.0
 */
class Elements {

	/**
	 * Element types.
	 *
	 * Holds the list of all the element types.
	 *
	 * @access private
	 *
	 * @var Element_Base[]
	 */
	private $_element_types;

	/**
	 * Elements constructor.
	 *
	 * Initializing Qazana elements manager.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function __construct( $document ) {
		$this->document = $document;
		$this->require_files();
	}

	/**
	 * Register element type.
	 *
	 * Add new type to the list of registered types.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param Element_Base $element Element instance.
	 *
	 * @return bool Whether the element type was registered.
	 */
	public function register_element_type( Element_Base $element ) {
		$this->_element_types[ $element->get_name() ] = $element;

		return true;
	}

	/**
	 * Unregister element type.
	 *
	 * Remove element type from the list of registered types.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param string $name Element name.
	 *
	 * @return bool Whether the element type was unregister, or not.
	 */
	public function unregister_element_type( $name ) {
		if ( ! isset( $this->_element_types[ $name ] ) ) {
			return false;
		}

		unset( $this->_element_types[ $name ] );

		return true;
	}

	/**
	 * Get element types.
	 *
	 * Retrieve the list of all the element types, or if a specific element name
	 * was provided retrieve his element types.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param string $element_name Optional. Element name. Default is null.
	 *
	 * @return null|Element_Base|Element_Base[] Element types, or a list of all the element
	 *                             types, or null if element does not exist.
	 */
	public function get_element_types( $element_name = null ) {
		if ( is_null( $this->_element_types ) ) {
			$this->init_elements();
		}

		if ( null !== $element_name ) {
			return isset( $this->_element_types[ $element_name ] ) ? $this->_element_types[ $element_name ] : null;
		}

		return $this->_element_types;
	}

	/**
	 * Get element types config.
	 *
	 * Retrieve the config of all the element types.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return array Element types config.
	 */
	public function get_element_types_config() {
		$config = [];

		foreach ( $this->get_element_types() as $element ) {
			$config[ $element->get_name() ] = $element->get_config();
		}

		return $config;
	}

	/**
	 * Render elements content.
	 *
	 * Used to generate the elements templates on the editor.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function render_elements_content() {
		foreach ( $this->get_element_types() as $element_type ) {
			$element_type->print_template();
		}
	}

	/**
	 * Init elements.
	 *
	 * Initialize Qazana elements by registering the supported elements.
	 * Qazana supports by default `section` element and `column` element.
	 *
	 * @since 1.0.0
	 * @access private
	 */
	private function init_elements() {
		$this->_element_types = [];

		foreach ( [ 'section', 'column' ] as $element_name ) {
			$class_name = 'Qazana\Element_' . $element_name;

			$this->register_element_type( new $class_name() );
		}

		/**
		 * After elements registered.
		 *
		 * Fires after Qazana elements are registered.
		 *
		 * @since 1.0.0
		 */
		do_action( 'qazana/elements/elements_registered' );
	}

	/**
	 * Require files.
	 *
	 * Require Qazana element base class and column, section and repeater
	 * elements.
	 *
	 * @since 1.0.0
	 * @access private
	 */
	public function require_files() {

		$default_files = array(
			'base/element-base.php',
			'elements/column.php',
			'elements/section.php',
			'elements/repeater.php',
		);

		$files = apply_filters( 'qazana\elements\require_files', $default_files );

		if ( is_array( $files ) ) {
			foreach ( $files as $file ) {
				qazana()->get_widgets_manager()->loader->locate_widget( $file, true );
			}
		}
	}
}
