<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

abstract class Skin_Base {

	/**
	 * @var Widget_Base|null
	 */
	protected $_parent = null;

	/**
	 * Skin_Base constructor.
	 *
	 * @param Widget_Base $parent
	 */
	public function __construct( Widget_Base $parent ) {
		$this->_parent = $parent;

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
		return $this->get_parent()->get_settings( $control_id );
	}

	public function get_responsive_instance_value( $control_base_id ) {
		$control_id = $this->get_control_id( $control_base_id );
		return $this->get_parent()->get_responsive_settings( $control_id );
	}

	public function start_controls_section( $id, $args ) {
		$args['condition']['_skin'] = $this->get_id();
		$this->get_parent()->start_controls_section( $this->get_control_id( $id ), $args );
	}

	public function end_controls_section() {
		$this->get_parent()->end_controls_section();
	}

	public function add_control( $id, $args ) {
		$args['condition']['_skin'] = $this->get_id();
		return $this->get_parent()->add_control( $this->get_control_id( $id ), $args );
	}

    /**
	 * Update skin control.
	 *
	 * Change the value of an existing skin control.
	 *
	 * @since 1.2.0
	 * @since 1.3.0 New `$options` parameter added.
	 *
	 * @access public
	 *
	 * @param string $id      Control ID.
	 * @param array  $args    Control arguments. Only the new fields you want to update.
	 * @param array  $options Optional. Some additional options.
	 */
	public function update_control( $id, $args, array $options = [] ) {
		$args['condition']['_skin'] = $this->get_id();
		$this->get_parent()->update_control( $this->get_control_id( $id ), $args, $options );
	}

	public function remove_control( $id ) {
		$this->get_parent()->remove_control( $this->get_control_id( $id ) );
	}

	public function add_responsive_control( $id, $args ) {
		$args['condition']['_skin'] = $this->get_id();
		$this->get_parent()->add_responsive_control( $this->get_control_id( $id ), $args );
	}

	public function update_responsive_control( $id, $args ) {
		$this->get_parent()->update_responsive_control( $this->get_control_id( $id ), $args );
	}

	public function remove_responsive_control( $id ) {
		$this->get_parent()->remove_responsive_control( $this->get_control_id( $id ) );
	}

	public function start_controls_tab( $id, $args ) {
		$args['condition']['_skin'] = $this->get_id();
		$this->get_parent()->start_controls_tab( $this->get_control_id( $id ), $args );
	}

	public function end_controls_tab() {
		$this->get_parent()->end_controls_tab();
	}

	public function start_controls_tabs( $id ) {
		$args['condition']['_skin'] = $this->get_id();
		$this->get_parent()->start_controls_tabs( $this->get_control_id( $id ) );
	}

	public function end_controls_tabs() {
		$this->get_parent()->end_controls_tabs();
	}

	final public function add_group_control( $group_name, $args = [] ) {
		$args['name'] = $this->get_control_id( $args['name'] );
		$args['condition']['_skin'] = $this->get_id();
		$this->get_parent()->add_group_control( $group_name, $args );
	}

	public function add_render_attributes () {
		$this->_add_render_attributes();
	}

	protected function _add_render_attributes () { }

	public function add_render_attribute( $element, $key = null, $value = null, $overwrite = false ) {
		return $this->get_parent()->add_render_attribute( $element, $key, $value, $overwrite );
	}

	public function get_render_attribute_string( $element ) {
		return $this->get_parent()->get_render_attribute_string( $element );
	}

	public function before_render() {}

	public function after_render() {}

	public function is_bool( $value ) {
		return $this->get_parent()->is_bool( $value );
	}

	public function add_element_dependencies() { }

	public function add_frontend_script( $value ) {
		return $this->get_parent()->add_frontend_script( $value );
	}

	public function add_frontend_style( $value ) {
		return $this->get_parent()->add_frontend_style( $value );
	}

	public function set_parent( $parent ) {
		$this->_parent = $parent;
	}

	public function get_parent() {
		return $this->_parent;
	}

	public function get_presets() {}

    public function register_presets() {

        $presets = $this->get_presets();

        if ( ! is_array( $presets ) || empty( $presets ) ) return;

        $controls_data = $this->get_parent()->get_controls();

        // Modify controls and add defaults
        foreach ( $this->get_parent()->get_controls() as $name => $control ) {

            if ( $control['type'] === 'section' || $name === '_skin' || empty( $presets[ $control_id ] ) ) continue;

            $controls_data[ $name ]['default'] = $presets[ $control_id ];
        }

        qazana()->controls_manager->set_element_stack_controls( $this->get_parent(), $controls_data );
    }

}
