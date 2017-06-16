<?php
namespace Builder\Extensions;

abstract class Base {

	/**
	 * @var Module_Base
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
		_doing_it_wrong( __FUNCTION__, __( 'Cheatin&#8217; huh?', 'builder' ), '1.0.0' );
	}

	/**
	 * Disable unserializing of the class
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function __wakeup() {
		// Unserializing instances of the class is forbidden
		_doing_it_wrong( __FUNCTION__, __( 'Cheatin&#8217; huh?', 'builder' ), '1.0.0' );
	}

	public static function class_name() {
		return get_called_class();
	}

	/**
	 * @return Module_Base
	 */
	public static function instance() {
		if ( empty( static::$_instances[ static::class_name() ] ) ) {
			static::$_instances[ static::class_name() ] = new static();
		}

		return static::$_instances[ static::class_name() ];
	}

    /**
     * extension url helper function
     *
     * @param  [type] $file [description]
     * @return [type]       [description]
     */
	public function extension_url( $file ) {

        $config = $this->get_config();
 
        return builder()->extensions_loader->locate_widget_url( $config['name'] .'/'. $file );
	}

	/**
     * extension url helper function
     *
     * @param  [type] $file [description]
     * @return [type]       [description]
     */
	public function extension_path( $file ) {

        $config = $this->get_config();

        return builder()->extensions_loader->locate_widget( $config['name'] .'/'. $file );
	}

}
