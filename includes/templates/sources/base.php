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

	/**
	 * @param array  $content a set of elements.
	 * @param string $method  (on_export|on_import).
	 *
	 * @return mixed
	 */
	public function process_export_import_content( $content, $method ) {
		return qazana()->db->iterate_data(
			$content, function( $element_data ) use ( $method ) {
				$element = qazana()->elements_manager->create_element_instance( $element_data );

				// If the widget/element isn't exist, like a plugin that creates a widget but deactivated
				if ( ! $element ) {
					return null;
				}

				return $this->process_element_export_import_content( $element, $method );
			}
		);
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
	 * @param \Qazana\Controls_Stack $element
	 * @param string                    $method
	 *
	 * @return array
	 */
	public function process_element_export_import_content( $element, $method ) {
		$element_data = $element->get_data();

		if ( method_exists( $element, $method ) ) {
			// TODO: Use the internal element data without parameters.
			$element_data = $element->{$method}( $element_data );
		}

		foreach ( $element->get_controls() as $control ) {
			$control_class = qazana()->controls_manager->get_control( $control['type'] );

			// If the control isn't exist, like a plugin that creates the control but deactivated.
			if ( ! $control_class ) {
				return $element_data;
			}

			if ( method_exists( $control_class, $method ) ) {
				$element_data['settings'][ $control['name'] ] = $control_class->{$method}( $element->get_settings( $control['name'] ), $control );
			}
		}

		return $element_data;
	}
}
