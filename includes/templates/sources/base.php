<?php
namespace Qazana\Template_Library;

use Qazana\Plugin;
use Qazana\Utils;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

abstract class Source_Base {

	abstract public function get_id();
	abstract public function get_title();
	abstract public function register_data();
	abstract public function get_items( $args = [] );
	abstract public function get_item( $template_id );
	abstract public function get_data( array $args );
	abstract public function delete_template( $template_id );
	abstract public function save_item( $template_data );
	abstract public function update_item( $new_data );
	abstract public function export_template( $template_id );

	public function __construct() {
		$this->register_data();
	}

	protected function replace_elements_ids( $content ) {
		return qazana()->db->iterate_data( $content, function( $element ) {
			$element['id'] = Utils::generate_random_string();

			return $element;
		} );
	}

	public function get_supported_themes() {

		$supported = apply_filters( 'qazana_templates_add_template_support', array('all') );

		return array_unique( $supported );
	}

	protected function filter_supported_templates( $list, $args ) {

		if ( ! is_array( $list ) ) {
			return array();
		}

		$new_list = array();

		$supported_themes = $this->get_supported_themes();

		foreach ( $list as $key => $value ) {

			if ( ! array_intersect( $supported_themes, $value['supports'] ) ) {
				continue;
			}
			$new_list[] = $value;
		}

		return $new_list;
	}

	/**
	 * @param array $data a set of elements
	 * @param string $method (on_export|on_import)
	 *
	 * @return mixed
	 */
	protected function process_export_import_data( $data, $method ) {

		return qazana()->db->iterate_data( $data, function( $element ) use ( $method ) {

			if ( 'widget' === $element['elType'] ) {
				$element_class = qazana()->widgets_manager->get_widget_types( $element['widgetType'] );
			} else {
				$element_class = qazana()->elements_manager->get_element_types( $element['elType'] );
			}

			// If the widget/element isn't exist, like a plugin that creates a widget but deactivated
			if ( ! $element_class ) {
				return $element;
			}

			if ( method_exists( $element_class, $method ) ) {
				$element = $element_class->{$method}( $element );
			}

			foreach ( $element_class->get_controls() as $control ) {
				$control_class = qazana()->controls_manager->get_control( $control['type'] );

				// If the control isn't exist, like a plugin that creates the control but deactivated
				if ( ! $control_class ) {
					return $element;
				}

				if ( method_exists( $control_class, $method ) && isset($element['settings'][ $control['name'] ] ) ) {
					$element['settings'][ $control['name'] ] = $control_class->{$method}( $element['settings'][ $control['name'] ] );
				}
			}

			return $element;
		} );
	}
}
