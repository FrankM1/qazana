<?php
namespace Qazana\Extensions;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

final class Manager {

    /**
     * Extension loader
     *
     * @var array
     */
	public $loader;
    
    /**
     * Extension data
     *
     * @var array
     */
	public $path = array();

	/**
	 * @var \ReflectionClass
	 */
	private $reflection;

    /**
     * Extension data
     *
     * @var array
     */
	private $extensions = null;

    /**
     * Extension instances are stored here
     *
     * @var array
     */
    private $instance = array();

    /**
     * __construct
     */
	public function __construct( $loader ) {

        $this->loader = $loader;
        $this->path = $this->loader->merge_files_stack_locations();

        $this->reflection = new \ReflectionClass( $this );

        if ( $this->path ) {
            foreach ( $this->path as $folder ) {
                $this->register_extensions( $folder );
            }
        }

        $this->load_extensions();

        add_action( 'qazana/widgets/widgets_registered',    [ $this, 'load_widgets' ] );
        add_action( 'qazana/admin/settings/after',          [ $this, 'register_admin_fields' ], 21 ); // After the base settings
	}

    /**
     * Register Extensions for use
     *
     * @since       1.0.0
     * @access      public
     * @return      void
     */
    public function register_extensions( $path ) {

        if ( ! is_dir( $path ) ) {
            return false;
        }

        $folders = scandir( $path, 1 );

        /**
         * action 'qazana/extensions/before'
         *
         * @param object $this Qazana
         */
        do_action( "qazana/extensions/before", $this );

        foreach ( $folders as $folder ) {
            $this->register_extension( $folder, $path );
        }

        /**
         * action 'qazana/extensions'
         *
         * @param object $this Qazana
         */
        do_action( "qazana/extensions", $this );

    }

     /**
      * Register Extension for use
      *
      * @since       1.0.0
      * @access      public
      * @return      void
      */
    public function register_extension( $folder, $path ) {

        $path = trailingslashit( $path );

        if ( $folder === '.' || $folder === '..' || ! is_dir( $path . $folder ) || substr( $folder, 0, 1 ) === '.' || substr( $folder, 0, 1 ) === '@' || substr( $folder, 0, 4 ) === '_vti' ) {
            return;
        }

        $extension_class = 'Qazana\Extensions\\' . $folder;

        /**
         * filter 'qazana/extension/{folder}'
         *
         * @param string                    extension class file path
         * @param string $extension_class   extension class name
         */
        $class_file = "$path/$folder/extension_{$folder}.php";

        if ( $file = $this->loader->locate_widget( "$folder/extension_{$folder}.php", true ) && file_exists( $class_file ) && empty( $this->extensions[ $folder ] ) ) {
            
            if( ! class_exists( $extension_class ) ) {
                return new \WP_Error( __CLASS__ . '::' . $extension_class, 'Extension class not found in `' . $class_file );
            }

            $this->extensions[ $folder ] = new $extension_class ( $this );
        }
    }

    /**
     * Load Extensions for use
     *
     * @since       1.0.0
     * @return      void
     */
    public function load_extensions() {
        
        if ( empty( $this->extensions ) )
            return;

        foreach ( $this->extensions as $extension_id => $extension_data ) {
            $this->instance[ $extension_id ] = $extension_data;
        }
        
    }

    /**
     * Register Extensions for use
     *
     * @since       1.0.0
     * @return      void
     */
    private function register_widgets( $extension, $widgets ) {

        /**
         * action 'qazana/extensions/before'
         *
         * @param object $this Qazana
         */
        do_action( "qazana/extensions/widgets/before", $this );

        if ( empty( $widgets ) )
            return;

        foreach ( $widgets as $widget ) {

            $filename = strtolower(
    			preg_replace(
    				[ '/^' . __NAMESPACE__ . '\\\/', '/([a-z])([A-Z])/', '/_/', '/\\\/' ],
    				[ '', '$1-$2', '-', DIRECTORY_SEPARATOR ],
    				$widget
    			)
    		);

            if ( $file = $this->loader->locate_widget( "{$extension}/widgets/{$filename}.php" ) ) {
                require_once $file;
            }
        }

        /**
         * action 'qazana/extensions'
         *
         * @param object $this Qazana
         */
        do_action( "qazana/extensions/widgets", $this );

    }

    /**
     * Register Extensions for use
     *
     * @since       1.0.0
     * @return      void
     */
    private function load_skins( $extension, $skins ) {

        /**
         * action 'qazana/extensions/before'
         *
         * @param object $this Qazana
         */
        do_action( "qazana/extensions/skins/before", $this );

        if ( empty( $skins ) )
            return;

        foreach ( $skins as $skin ) {

            $filename = strtolower(
    			preg_replace(
    				[ '/^' . __NAMESPACE__ . '\\\/', '/([a-z])([A-Z])/', '/_/', '/\\\/' ],
    				[ '', '$1-$2', '-', DIRECTORY_SEPARATOR ],
    				$skin
    			)
    		);

            $class_name = $this->reflection->getNamespaceName() .'\Widgets\\' . ucfirst($extension) . '\Skins\Skin_' . ucfirst($skin);

            if ( class_exists( $class_name ) ) {
                continue;
            }

            if ( $file = $this->loader->locate_widget( "{$extension}/skins/{$filename}.php" ) ) {
                require_once $file;
            }
        }

        /**
         * action 'qazana/extensions'
         *
         * @param object $this Qazana
         */
        do_action( "qazana/extensions/skins", $this );

    }

	public function load_widgets() {

        if ( empty( $this->instance ) )
            return;

		$widget_manager = qazana()->widgets_manager;

        foreach ( $this->instance as $extension => $extension_object ) {

			$extension_data = $extension_object->get_config();

            if ( ! $this->is_extension_active( $extension_data['name'] ) ) {
                continue;
            }

            if ( ! empty( $extension_data['skins'] ) ) {
                $this->load_skins( $extension_data['name'], $extension_data['skins'] );
            }

            if ( ! empty( $extension_data['widgets'] ) ) {
                $this->register_widgets( $extension_data['name'], $extension_data['widgets'] );

        		foreach ( $this->get_widgets( $extension_data['name'] ) as $widget ) {
                    
                    $class_name = $this->reflection->getNamespaceName() . '\Widgets\\' . $widget;
                    
                    if( ! class_exists( $class_name ) ) {
                        return new \WP_Error( __CLASS__ . '::' . $class_name, 'Widget class not found in `' . $extension_data['name'] );
                    }

                    $widget_manager->register_widget_type( new $class_name() );
        		}
            }
        }
	}

	public function get_widgets( $extension_id ) {

        $extension_data = $this->get_extension_data( $extension_id );

        if ( $extension_data['widgets'] ) {
			return $extension_data['widgets'];
		}

		return $this->extensions;
	}

    public function get_skins( $extension_id ) {

        $extension_data = $this->get_extension_data( $extension_id );

        if ( $extension_data['widgets'] ) {
			return $extension_data['widgets'];
		}

		return $this->extensions;
	}

	public function is_extension_active( $extension_id ) {

        $extension_data = $this->get_extension_data( $extension_id );

        if ( $extension_data['required'] ) {
			return true;
		}

		$options = get_option( 'qazana_extension_' . $extension_data['name'] );

        if ( ! isset( $options[ $extension_id ] ) ) {
			return $extension_data['default_activation'];
		}

		return 'true' === $options[ $extension_id ];
	}

	public function get_extensions( $extension_id = null ) {
		return isset( $this->instance[ $extension_id ] ) ? $this->instance[ $extension_id ] : $this->instance;
	}

	public function get_extension_data( $extension_id ) {
		return isset( $this->instance[ $extension_id ] ) ? $this->instance[ $extension_id ]->get_config() : false;
	}

    public function register_admin_fields() {

        foreach ( $this->extensions as $extension_id => $extension_data ) {

            $extension_data = $this->get_extension_data( $extension_id );
 
            if ( $extension_data['required'] ) {
                continue;
            }

            //$this->add_extension_settings_section( $extension_id );
		}

    }

    public function add_extension_settings_section( $extension_id ) {

        $extension_data = $this->get_extension_data( $extension_id );

        $section = 'qazana_extension ' . $extension_id . '_editor_section';

        $controls_class_name = 'Qazana\Settings_Controls';

        add_settings_section(
            $section,
            $extension_data['title'],
            function () {
                // echo $extension_data['description'];
            },
            qazana()->slug
        );

        $field_id = 'qazana_extension_' . $extension_data['name'];

        add_settings_field(
            $field_id,
            __( 'Enable Extension', 'qazana' ),
            [ $controls_class_name, 'render' ],
            qazana()->slug,
            $section,
            [
                'id' => $field_id,
                'type' => 'checkbox',
                'value' => true,
                'std' => $extension_data['default_activation'],
            ]
        );

        register_setting( qazana()->slug, $field_id );
    }
}
