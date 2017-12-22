<?php
namespace Qazana\Extensions;

abstract class Base {

	/**
	 * Is the extension required
	 *
	 * @return array
	 */
	private $required = false;

	/**
	 * Activate extension by default
	 *
	 * @return array
	 */
	private $default_activation = true;

	/**
	 * Unique extension name
	 *
	 * @return string
	 */
	public function get_name() {}

	/**
	 * Extension title
	 *
	 * @return string
	 */
    public function get_title() {}

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

	public static function class_name() {
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
	 * Get extension config
	 *
	 * @return array
	 */
	public function get_config() {
		return [
			'title' => $this->get_title(),
			'name' => $this->get_name(),
			'required' => $this->required,
			'default_activation' => $this->default_activation,
			'widgets' => $this->get_widgets(),
            'skins' => $this->get_skins(),
            'dependencies' => $this->get_dependencies(),
		];
	}

    /**
     * Extension url helper function
     *
     * @param  [type] $file [description]
     * @return [type]       [description]
     */
	public function extension_url( $file ) {

        $config = $this->get_config();

        return qazana()->extensions_loader->locate_widget_url( $config['name'] . '/' . $file );
	}

	/**
     * Extension dir helper function
     *
     * @param  [type] $file [description]
     * @return [type]       [description]
     */
	public function extension_dir( $file ) {

        $config = $this->get_config();

        return qazana()->extensions_loader->locate_widget( $config['name'] . '/' . $file );
	}
}
