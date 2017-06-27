<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

abstract class Skin_Base {

	/**
	 * @var Widget_Base|null
	 */
	protected $parent = null;

	/**
	 * Skin_Base constructor.
	 *
	 * @param Widget_Base $parent
	 */
	public function __construct( Widget_Base $parent ) {
		$this->parent = $parent;

		$this->_register_controls_actions();
	}

	abstract public function get_id();

	abstract public function get_title();

	abstract public function render();

	public function _content_template() {}

	protected function _register_controls_actions() {}

	protected function get_control_id( $control_base_id ) {
		$skin_id = str_replace( '-', '_', $this->get_id() );
		return $skin_id . '_' . $control_base_id;
	}

	public function get_instance_value( $control_base_id ) {
		$control_id = $this->get_control_id( $control_base_id );
		return $this->parent->get_settings( $control_id );
	}

	public function add_control( $id, $args ) {
		return $this->parent->add_control( $this->get_control_id( $id ), $args );
	}

	public function start_controls_section( $id, $args ) {
		return $this->parent->start_controls_section( $this->get_control_id( $id ), $args );
	}

	public function end_controls_section() {
		return $this->parent->end_controls_section();
	}

	public function add_responsive_control( $id, $args ) {
		$this->parent->add_responsive_control( $this->get_control_id( $id ), $args );
	}

	public final function add_group_control( $group_name, $args = [] ) {
		$args['name'] = $this->get_control_id( $args['name'] );

		$this->parent->add_group_control( $group_name, $args );
	}

	public function add_render_attribute( $element, $key = null, $value = null, $overwrite = false ) {
		return $this->parent->add_render_attribute( $element, $key, $value, $overwrite );
	}

	public function get_render_attribute_string( $element ) {
		return $this->parent->get_render_attribute_string( $element );
	}

	public function bool( $value ) {
		return $this->parent->bool( $value );
	}

	public function set_parent( $parent ) {
		$this->parent = $parent;
	}

	public function get_presets() {}

    public function register_presets( ) {

        $presets = $this->get_presets();

        if ( ! is_array( $presets ) || empty( $presets ) ) return;

        $controls_data = $this->parent->get_controls();

		/* Modify controls and add defaults
		$presets_filtered = array();

        foreach ( $presets as $name => $control ) {

			if ( 0 === strpos( $name, '_' ) ||  0 === strpos( $name, str_replace( '-', '_', $this->get_id() ) ) ) {
				$control_id = $name;
			} else {
				$control_id = $this->get_control_id( $name );
			}

			$presets_filtered[ $control_id ] = $control;

		} */


        // Modify controls and add defaults
        foreach ( $this->parent->get_controls() as $name => $control ) {

            if ( $control['type'] === 'section' || $name === '_skin' || empty( $presets[ $control_id ] ) ) continue;

            $controls_data[ $name ]['default'] = $presets[ $control_id ];
        }

        qazana()->controls_manager->set_element_stack_controls( $this->parent, $controls_data );
    }

}
