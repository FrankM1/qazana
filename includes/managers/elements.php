<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

use Qazana\Core\Base\Document as Document_Base;

/**
 * Qazana elements manager.
 *
 * Qazana elements manager handler class is responsible for registering and
 * initializing all the supported elements.
 *
 * @since 1.0.0
 */
class Elements_Manager {

	/**
	 * Element categories.
	 *
	 * Holds the list of all the element categories.
	 *
	 * @access private
	 *
	 * @var categories
	 */
	private $categories;

	/**
	 * Elements constructor.
	 *
	 * Initializing Qazana elements manager.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function __construct() {
		$this->require_files();
	}

	/**
	 * Get element categories.
	 *
	 * Retrieve the list of categories the element belongs to.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return array Element categories.
	 */
	public function get_categories() {
		if ( null === $this->categories ) {
			$this->init_categories();
		}

		return $this->categories;
	}

	/**
	 * Add element category.
	 *
	 * Register new category for the element.
	 *
	 * @since 1.7.12
	 * @since 2.0.0 The third parameter was deprecated.
	 * @access public
	 *
	 * @param string $category_name       Category name.
	 * @param array  $category_properties Category properties.
	 */
	public function add_category( $category_name, $category_properties ) {
		if ( null === $this->categories ) {
			$this->get_categories();
		}

		if ( ! isset( $this->categories[ $category_name ] ) ) {
			$this->categories[ $category_name ] = $category_properties;
		}
	}

	/**
	 * Init categories.
	 *
	 * Initialize the element categories.
	 *
	 * @since 1.0.0
	 * @access private
	 */
	private function init_categories() {
		$categories = [
			'basic' => [
				'title' => __( 'Basic', 'qazana' ),
				'icon' => 'eicon-font',
			],
			'general' => [
				'title' => __( 'General', 'qazana' ),
				'icon' => 'eicon-font',
			],
		];

		/**
		 * When categories are registered.
		 *
		 * Fires after basic categories are registered, before WordPress
		 * category have been registered.
		 *
		 * This is where categories registered by external developers are
		 * added.
		 *
		 * @since 2.0.0
		 *
		 * @param Elements_Manager $this Elements manager instance.
		 */
		do_action( 'qazana/elements/categories_registered', $this );

		$this->categories = apply_filters( 'qazana/elements/categories', $categories );

		$this->categories['wordpress'] = [
			'title' => __( 'WordPress', 'qazana' ),
			'icon' => 'eicon-wordpress',
			'active' => false,
		];
	}

	/**
	 * Create element instance.
	 *
	 * This method creates a new element instance for any given element.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param array        $element_data Element data.
	 * @param array        $element_args Optional. Element arguments. Default is
	 *                                   an empty array.
	 * @param Element_Base $element_type Optional. Element type. Default is null.
	 *
	 * @return Element_Base|null Element instance if element created, or null
	 *                           otherwise.
	 */
	public function create_element_instance( Document_Base $document, array $element_data, array $element_args = [], Element_Base $element_type = null ) {
		if ( null === $element_type ) {
			if ( 'widget' === $element_data['elType'] ) {
				$element_type = $document->get_widgets()->get_widget_types( $element_data['widgetType'] );
			} else {
				$element_type = $document->get_elements()->get_element_types( $element_data['elType'] );
			}
		}

		if ( ! $element_type ) {
			return null;
		}

		$args = array_merge( $element_type->get_default_args(), $element_args );

		$element_data['documentType'] = $document->get_name();

		$element_class = $element_type->get_class_name();

		try {
			$element = new $element_class( $element_data, $args );
		} catch ( \Exception $e ) {
			return null;
		}

		return $element;
	}

	public function add_element_instance( Element_Base $element ) {
		$this->_element_instance[ $element->get_id() ] = $element;

		return true;
	}

	/**
	 * Get element instance by id
	 *
	 * @method get_element_instance
	 *
	 * @param string $element_id  unique element id
	 * @return object element object class Element_Base
	 */
	public function get_element_instance( $element_id = null ) {
		if ( null !== $element_id ) {
			return $this->_element_instance[ $element_id ];
		}

		return $this->_element_instance;
	}

	/**
	 * Ajax discard changes.
	 *
	 * Ajax handler for Qazana discard_changes. Handles the discarded changes
	 * in the builder by deleting auto-saved revisions.
	 *
	 * Fired by `wp_ajax_qazana_discard_changes` action.
	 *
	 * @since 1.9.0
	 * @deprecated 2.0.0 Use `qazana()->get_documents()->ajax_discard_changes()` method instead.
	 * @access public
	 *
	 * @param $request
	 *
	 * @return bool
	 */
	public function ajax_discard_changes( $request ) {
		//TODO _deprecated_function( __METHOD__, '2.0.0', 'qazana()->get_documents()->ajax_discard_changes()' );

		return qazana()->get_documents()->ajax_discard_changes( $request );
	}

	/**
	 * Ajax save builder.
	 *
	 * Ajax handler for Qazana save_builder. Handles the saved data returned
	 * by the builder.
	 *
	 * Fired by `wp_ajax_qazana_save_builder` action.
	 *
	 * @since 1.0.0
	 * @deprecated 2.0.0 Use `qazana()->get_documents()->ajax_save()` method instead.
	 * @access public
	 *
	 * @param array $request
	 *
	 * @return mixed
	 */
	public function ajax_save_builder( $request ) {
		//TODO _deprecated_function( __METHOD__, '2.0.0', 'qazana()->get_documents()->ajax_save()' );

		$return_data = qazana()->get_documents()->ajax_save( $request );

		/**
		 * Returned ajax data.
		 *
		 * Filters the ajax data returned when saving the post on the builder.
		 *
		 * @since 1.0.0
		 * @deprecated 2.0.0 Use `qazana/documents/ajax_save/return_data` filter instead.
		 *
		 * @param array $return_data The returned data. Default is an empty array.
		 */
		$return_data = apply_filters_deprecated( 'qazana/ajax_save_builder/return_data', [ $return_data, $request['editor_post_id'] ], '2.0.0', 'qazana/documents/ajax_save/return_data' );

		return $return_data;
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
