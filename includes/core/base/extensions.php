<?php

namespace Qazana\Extensions;

abstract class Base {
    /**
     * Is the extension required
     *
     * @return array
     */
    public $required = false;

    /**
     * Activate extension by default
     *
     * @return array
     */
    public $default_activation = true;

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
     * Add extension details
     *
     * @return array config
     */
    public function add_config() {
        // _deprecated_function( __METHOD__, '2.0.0', '$this->register' );
        return [];
    }

    /**
     * Get extension config
     *
     * @return array
     */
    public function get_config() {
        return array_merge( $this->_get_initial_config(), $this->add_config() );
    }

    /**
     * Unique extension name
     *
     * @return string
     */
    public function get_name() {
    }

    /**
     * Extension title
     *
     * @return string
     */
    public function get_title() {
    }

    /**
     * Extension dependencies
     *
     * Reliably have an extension as child of another.
     *
     * @since 1.3.0
     *
     * @return array of names of parent extensions
     */
    public function get_dependencies() {
        return [];
    }

    /**
     * Extension widgets
     *
     * @return array
     */
    public function get_widgets() {
        return [];
    }

    /**
     * Widgets skins to load
     *
     * @return array
     */
    public function get_skins() {
        return [];
    }

    /**
     * Check if extensions is required.
     * Required extensions can not be disabled
     *
     * @return array
     */
    public function get_required() {
        return $this->required;
    }

    /**
     * Check if extensions is enabled by default
     *
     * @return array
     */
    public function get_default_activation() {
        return $this->default_activation;
    }

    /**
     * @var Extension_Base
     */
    protected static $_instances = [];

    /**
     * Throw error on object clone
     *
     * The whole idea of the singleton design pattern is that there is a single
     * object therefore, we don't want the object to be cloned.
     *
     * @since 1.0.0
     * @return void
     */
    public function __clone() {
        // Cloning instances of the class is forbidden
        _doing_it_wrong( __FUNCTION__, __( 'Cheatin&#8217; huh?', 'qazana' ), '1.0.0' );
    }

    /**
     * Disable unserializing of the class
     *
     * @since 1.0.0
     * @return void
     */
    public function __wakeup() {
        // Unserializing instances of the class is forbidden
        _doing_it_wrong( __FUNCTION__, __( 'Cheatin&#8217; huh?', 'qazana' ), '1.0.0' );
    }

    /**
     * Get class name
     *
     * @since 2.0.0
     * @return string
     */
    final public static function class_name() {
        return get_called_class();
    }

    /**
     * @return Extension_Base
     */
    public static function instance() {
        if ( empty( static::$_instances[ static::class_name() ] ) ) {
            static::$_instances[ static::class_name() ] = new static();
        }

        return static::$_instances[ static::class_name() ];
    }

    /**
     * Get initial config.
     *
     * Retrieve the current extension initial configuration.
     *
     * Adds more configuration on top of the controls list and the tabs assigned
     * to the control. This method also adds extension name, type, icon and more.
     *
     * @since 2.0.0
     * @access protected
     *
     * @return array The initial config.
     */
    protected function _get_initial_config() {
        return [
			'title' => $this->get_title(),
			'name' => $this->get_name(),
			'required' => $this->get_required(),
			'default_activation' => $this->get_default_activation(),
			'widgets' => $this->get_widgets(),
			'skins' => $this->get_skins(),
			'dependencies' => $this->get_dependencies(),
		];
    }

    /**
     * Extension url helper function
     *
     * @param  string $file  name of file
     * @return string       full url
     */
    public function extension_url( $file ) {
        return qazana()->extensions_manager->loader->locate_widget_url( $this->get_config()['name'] . '/' . $file );
    }

    /**
     * Extension dir helper function
     *
     * @param  string $file  name of file
     * @return string       full path
     */
    public function extension_dir( $file ) {
        return qazana()->extensions_manager->loader->locate_widget( $this->get_config()['name'] . '/' . $file );
    }

    /**
     * Check if plugin is active
     *
     * @return bool
     */
    public function is_active() {
        return get_option( 'qazana_extension_' . $this->get_config()['name'] );
    }
}
