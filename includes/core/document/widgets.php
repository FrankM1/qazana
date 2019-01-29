<?php
namespace Qazana\Document;

use Qazana\Core\Ajax_Manager;
use Qazana\Core\Utils\Exceptions;
use Qazana\Loader;
use Qazana\Widget_Base;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Qazana document widgets.
 *
 * Qazana widgets manager handler class is responsible for registering and
 * initializing all the supported Qazana widgets.
 *
 * @since 1.0.0
 */
class Widgets {

	/**
	 * Init widgets.
	 *
	 * Initialize Qazana widgets manager. Include all the the widgets files
	 * and register each Qazana and WordPress widget.
	 *
	 * @since 1.0.0
	 * @access public
	*/
	public function __construct( $document ) {
		$this->document = $document;
	}

	/**
	 * Get widget types config.
	 *
	 * Retrieve all the registered widgets with config for each widgets.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return array Registered widget types with each widget config.
	*/
	public function get_widget_types_config() {
		$config = [];

		foreach ( $this->get_widget_types() as $widget_key => $widget ) {
			$config[ $widget_key ] = $widget->get_config();
		}

		return $config;
	}

	/**
	 * Get widget types.
	 *
	 * Retrieve the registered widget types list.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param string $widget_name Optional. Widget name. Default is null.
	 *
	 * @return Widget_Base|Widget_Base[]|null Registered widget types.
	*/
	public function get_widget_types( $widget_name = null ) {
		$document_widgets = [];
		$widget_types = qazana()->get_widgets_manager()->get_widget_types();

		foreach ( $widget_types as $widget_id => $widget ) {

			if ( ! count( array_intersect( $this->document->get_widget_groups(), $widget->get_documents() ) )  ) {
				continue;
			}

			$document_widgets[$widget_id] = $widget;
		}

		if ( null !== $widget_name ) {
			return isset( $document_widgets[ $widget_name ] ) ? $document_widgets[ $widget_name ] : null;
		}

		return $document_widgets;
	}

	/**
	 * Get widgets frontend settings keys.
	 *
	 * Retrieve frontend controls settings keys for all the registered widget
	 * types.
	 *
	 * @since 1.3.0
	 * @access public
	 *
	 * @return array Registered widget types with settings keys for each widget.
	*/
	public function get_widgets_frontend_settings_keys() {
		$keys = [];

		foreach ( $this->get_widget_types() as $widget_type_name => $widget_type ) {
			$widget_type_keys = $widget_type->get_frontend_settings_keys();

			if ( $widget_type_keys ) {
				$keys[ $widget_type_name ] = $widget_type_keys;
			}
		}

		return $keys;
	}

	/**
	 * Render widgets content.
	 *
	 * Used to generate the widget templates on the editor using Underscore JS
	 * template, for all the registered widget types.
	 *
	 * @since 1.0.0
	 * @access public
	*/
	public function render_widgets_content() {
		foreach ( $this->get_widget_types() as $widget ) {
			$widget->print_template();
		}
	}

}
