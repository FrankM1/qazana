<?php
namespace Qazana\Extensions;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

final class Manager {

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
    private $instance = null;

    /**
     * __construct
     */
	public function __construct() {

        $this->path = qazana()->extensions_loader->merge_files_stack_locations();

        $this->reflection = new \ReflectionClass( $this );

        if ( $this->path ) {
            foreach ( $this->path as $folder ) {
                $this->_register_extensions( $folder );
            }
        }

        $this->_load_extensions();

        add_action( 'qazana/widgets/widgets_registered', [ $this, '_load_widgets' ] );

        if ( is_admin() ) {
            add_action( 'qazana/admin/settings/after', [ $this, 'register_admin_fields' ], 21 ); // After the base settings
        }
	}

    /**
     * Register Extensions for use
     *
     * @since       1.0.0
     * @access      public
     * @return      void
     */
    private function _register_extensions( $path ) {

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

            $path = trailingslashit( $path );

            if ( $folder === '.' || $folder === '..' || ! is_dir( $path . $folder ) || substr( $folder, 0, 1 ) === '.' || substr( $folder, 0, 1 ) === '@' || substr( $folder, 0, 4 ) === '_vti' ) {
                continue;
            }

            $extension_class = 'Qazana\Extensions\\' . $folder;

            /**
             * filter 'qazana/extension/{folder}'
             *
             * @param        string                    extension class file path
             * @param string $extension_class          extension class name
             */
            $class_file = "$path/$folder/extension_{$folder}.php";

            if ( $file = qazana()->extensions_loader->locate_widget( "$folder/extension_{$folder}.php", true ) && file_exists( $class_file ) ) {

                qazana()->extensions_loader->locate_widget( "$folder/extension_{$folder}.php", true );

                $this->extensions[ $folder ] = new $extension_class ( $this );
            }

        }

        /**
         * action 'qazana/extensions'
         *
         * @param object $this Qazana
         */
        do_action( "qazana/extensions", $this );

    }

    /**
     * Register Extensions for use
     *
     * @since       1.0.0
     * @return      void
     */
    private function _register_widgets( $extension, $widgets ) {

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

            if ( $file = qazana()->extensions_loader->locate_widget( "{$extension}/widgets/{$filename}.php" ) ) {
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
    private function _load_skins( $extension, $skins ) {

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

            if ( $file = qazana()->extensions_loader->locate_widget( "{$extension}/skins/{$filename}.php" ) ) {
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

    /**
     * Load Extensions for use
     *
     * @since       1.0.0
     * @return      void
     */
    private function _load_extensions() {

        if ( empty( $this->extensions ) )
            return;

        foreach ( $this->extensions as $extension_id => $extension_data ) {

			$class_name = str_replace( '-', ' ', $extension_id );
			$class_name = str_replace( ' ', '', ucwords( $class_name ) );
			$class_name = __NAMESPACE__.'\\' . $class_name;

			$instance = $class_name::instance();

            $this->instance[ $extension_id ] = $instance->get_config();
		}
    }

	public function _load_widgets() {

        if ( empty( $this->instance ) )
            return;

		$widget_manager = qazana()->widgets_manager;

        foreach ( $this->instance as $extension => $extension_data ) {

            if ( ! $this->is_extension_active( $extension_data['name'] ) ) {
                continue;
            }

            if ( ! empty( $extension_data['skins'] ) ) {
                $this->_load_skins( $extension_data['name'], $extension_data['skins'] );
            }

            if ( ! empty( $extension_data['widgets'] ) ) {
                $this->_register_widgets( $extension_data['name'], $extension_data['widgets'] );

        		foreach ( $this->get_widgets( $extension_data['name'] ) as $widget ) {
        			$class_name = $this->reflection->getNamespaceName() . '\Widgets\\' . $widget;
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

	private function is_extension_active( $extension_id ) {

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

	private function get_extension_data( $extension_id ) {
		return isset( $this->instance[ $extension_id ] ) ? $this->instance[ $extension_id ] : false;
	}

    public function register_admin_fields() {

        foreach ( $this->extensions as $extension_id => $extension_data ) {

            $extension_data = $this->get_extension_data( $extension_id );
            if ( $extension_data['required'] ) continue;

            $this->_add_extension_settings_section( $extension_id );
		}

    }

    public function _add_extension_settings_section( $extension_id ) {

        $extension_data = $this->get_extension_data( $extension_id ) ;

        $section = 'qazana_extension ' . $extension_id . '_editor_section';

        $controls_class_name = 'Qazana\Settings_Controls';

        add_settings_section(
            $section,
            $extension_data['title'],
            function () {
                //echo $extension_data['description'];
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
                'value' => $extension_data['default_activation'],
            ]
        );

        register_setting( qazana()->slug, $field_id );
    }
}
