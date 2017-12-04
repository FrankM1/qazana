<?php
namespace Qazana\Extensions;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

use Qazana\Admin\Settings\Panel;

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
     * Extension instances are stored here
     *
     * @var array
     */
	private $extensions = array();

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

        add_action( 'qazana/widgets/widgets_registered',    [ $this, 'load_all_widgets' ] );

        if ( is_admin() ) {
			// add_action( 'qazana/admin/after_create_settings/' . qazana()->slug, [ $this, 'register_admin_fields' ] );
        }
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
         * Action 'qazana/extensions/before'
         *
         * @param object $this Qazana
         */
        do_action( 'qazana/extensions/before', $this );

        foreach ( $folders as $folder ) {
            $this->register_extension( $folder, $path );
        }

        /**
         * Action 'qazana/extensions'
         *
         * @param object $this Qazana
         */
        do_action( 'qazana/extensions', $this );

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
         * Filter 'qazana/extension/{folder}'
         *
         * @param string                    extension class file path
         * @param string $extension_class   extension class name
         */
        $class_file = "$path$folder/extension_{$folder}.php";

        if ( $file = $this->loader->locate_widget( "$folder/extension_{$folder}.php", true ) && file_exists( $class_file ) && empty( $this->extensions[ $folder ] ) ) {

            if ( ! class_exists( $extension_class ) ) {
                return new \WP_Error( __CLASS__ . '::' . $extension_class, 'Extension class not found in `' . $class_file );
            }

            $this->extensions[ $folder ] = new $extension_class( $this );
        }
    }

    /**
     * Load Extensions for use
     *
     * @since       1.0.0
     * @return      void
     */
    public function load_extensions() {

        if ( empty( $this->extensions ) ) {
            return;
        }

        foreach ( $this->extensions as $extension_id => $extension_instance ) {

            if ( ! empty( $extension_instance->get_config()['dependencies'] ) ) {
                $dependencies = $extension_instance->get_config()['dependencies'];
                foreach ( $dependencies as $dependency ) {
                    $this->load_extension( $dependency );
                }
            }
        }
    }

    /**
     * Load a single Extension for use - bypasses activation settings
     *
     * @since       1.3.0
     * @return      void
     */
    public function load_extension( $extension_id ) {

        if ( ! is_object( $this->get_extensions( $extension_id ) ) ) {
            foreach ( $this->path as $folder ) {
                $this->register_extension( $extension_id, $folder );
            }
        }
        // $this->load_extension_widgets( $extension_id );
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

        if ( empty( $widgets ) ) {
            return;
        }

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

        if ( empty( $skins ) ) {
            return;
        }

        foreach ( $skins as $skin ) {

            $filename = strtolower(
    			preg_replace(
    				[ '/^' . __NAMESPACE__ . '\\\/', '/([a-z])([A-Z])/', '/_/', '/\\\/' ],
    				[ '', '$1-$2', '-', DIRECTORY_SEPARATOR ],
    				$skin
    			)
    		);

            $class_name = $this->reflection->getNamespaceName() . '\Widgets\\' . ucfirst( $extension ) . '\Skins\Skin_' . ucfirst( $skin );

            if ( class_exists( $class_name ) ) {
                continue;
            }

            if ( $file = $this->loader->locate_widget( "{$extension}/skins/{$filename}.php" ) ) {
                qazana_write_log( $file ); 
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

	public function load_all_widgets() {

        if ( empty( $this->extensions ) ) {
            return;
        }

        foreach ( $this->extensions as $extension_id => $extension_object ) {

			$extension_data = $extension_object->get_config();

            if ( ! $this->is_extension_active( $extension_id ) ) {
                continue;
            }

            $this->load_extension_widgets( $extension_id );
        }
    }

    /**
     * Load a single Extension's widgets
     *
     * @since       1.3.0
     * @return      void
     */
    public function load_extension_widgets( $extension_id ) {

        $widget_manager = qazana()->widgets_manager;

        if ( ! empty( $this->get_skins( $extension_id ) ) ) {
            $this->load_skins( $extension_id, $this->get_skins( $extension_id ) );
        }

        if ( ! empty( $this->get_widgets( $extension_id ) ) ) {
            $this->register_widgets( $extension_id, $this->get_widgets( $extension_id ) );

            foreach ( $this->get_widgets( $extension_id ) as $widget ) {

                $class_name = $this->reflection->getNamespaceName() . '\Widgets\\' . $widget;

                if ( ! class_exists( $class_name ) ) {
                    return new \WP_Error( __CLASS__ . '::' . $class_name, 'Widget class not found in `' . $this->get_name( $extension_id ) );
                }

                $widget_manager->register_widget_type( new $class_name() );
            }
        }
    }

    public function get_name( $extension_id ) {

        $extension_data = $this->get_extension_data( $extension_id );

        if ( $extension_data['name'] ) {
			return $extension_data['name'];
		}

		return false;
	}

	public function get_widgets( $extension_id ) {

        $extension_data = $this->get_extension_data( $extension_id );

        if ( ! empty( $extension_data['widgets'] ) ) {
			return $extension_data['widgets'];
		}

		return false;
	}

    public function get_skins( $extension_id ) {

        $extension_data = $this->get_extension_data( $extension_id );

        if ( ! empty( $extension_data['skins'] ) ) {
			return $extension_data['skins'];
		}

		return false;
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
		return isset( $this->extensions[ $extension_id ] ) ? $this->extensions[ $extension_id ] : $this->extensions;
	}

	public function get_extension_data( $extension_id ) {
		return isset( $this->extensions[ $extension_id ] ) ? $this->extensions[ $extension_id ]->get_config() : false;
	}

    public function register_admin_fields( Panel $settings ) {

        foreach ( $this->extensions as $extension_id => $extension_data ) {

            $extension_data = $this->get_extension_data( $extension_id );

            if ( $extension_data['required'] ) {
                continue;
            }

            $extension_data = $this->get_extension_data( $extension_id );

            $section    = 'qazana_extension ' . $extension_id . '_editor_section';
            $field_id   = 'qazana_extension_' . $extension_data['name'];

            $settings->add_section( Panel::TAB_INTEGRATIONS, $section, [
                'callback' => function() use ($extension_data) { },
                'fields' => [
                    $field_id => [
                        'label' => $extension_data['title'],
                        'field_args' => [
                            'type' => 'checkbox',
                            'sub_desc' => __( 'Enable Extension', 'qazana' ),
                            'std' => $extension_data['default_activation'],
                            'value' => true,
                        ],
                    ],
                ],
            ] );
		}
    }

}
