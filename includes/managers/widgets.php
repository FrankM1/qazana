<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Widgets_Manager {

    /**
	 * @var Widget_Base[]
	 */
	private $_widget_types = null;

    /**
	 * @since 1.0.0
	 * @access public
	 */
    public function __construct() {
        add_action( 'qazana/includes', [ $this, 'require_files' ] );
        add_action( 'wp_ajax_qazana_render_widget', [ $this, 'ajax_render_widget' ] );
        add_action( 'wp_ajax_qazana_editor_get_wp_widget_form', [ $this, 'ajax_get_wp_widget_form' ] );
    }

	/**
	 * @since 1.0.0
	 * @access private
	*/
    private function _init_widgets() {

        $this->_widget_types = [];

        $build_widgets_filename = [
            'common',

            'alert',
            'audio',
            'button',
            'divider',
            'heading',
            'html',
			'link',
            'icon-box',
            'icon-list',
            'icon',
            'image-box',
            'image-carousel',
            'image-gallery',
            'image',
            'menu-anchor',
            'progress',
            'shortcode',
            'sidebar',
            'social-icons',
            'spacer',
            'testimonial',
            'text-editor',
            'tooltip',
            'video',
        ];

        /**
         * Allow override of registered widget defaults
         *
         * @since 1.0.0
        *
        * @param array $build_widgets_filename.
        */
        $build_widgets_filename = apply_filters( 'qazana/widgets/widget_filenames', $build_widgets_filename );

        // remove duplicates
        $build_widgets_filename = array_unique( $build_widgets_filename );

        foreach ( $build_widgets_filename as $widget_filename ) {

            if ( ! qazana()->widget_loader->locate_widget( $widget_filename .'.php', false ) ) {
                continue;
            }

            $class_name = str_replace( '-', '_', $widget_filename );
            $class_name = __NAMESPACE__ . '\Widget_' . $class_name;

            $class_name = apply_filters( "qazana/widgets/{$widget_filename}_class_name", $class_name, $widget_filename );

            if ( ! class_exists( $class_name ) ) {
                qazana()->widget_loader->locate_widget( $widget_filename .'.php', true );
            }

            $this->register_widget_type( new $class_name );
        }

        $this->_register_wp_widgets();

		do_action( 'qazana/widgets/widgets_registered', $this );
	}

	/**
	 * @since 1.0.0
	 * @access private
	 */
    private function _register_wp_widgets() {

        global $wp_widget_factory;

        qazana()->widget_loader->locate_widget( 'wordpress.php', true );

		$blacklist = [
			'WP_Widget_Text', //unnecessary since Qazana has a text widget
		];

        /**
         * Allow override of allowed widgets
         *
         * @since 1.0.0
         *
         * @param array $allowed_widgets.
         */
        // Allow themes/plugins to filter out their wordpress widgets
		$black_list = apply_filters( 'qazana/widgets/black_list', $blacklist );

        foreach ( $wp_widget_factory->widgets as $widget_class => $widget_obj ) {
	
    		if ( in_array( $widget_class, $black_list ) ) {
    			continue;
    		}

            $qazana_widget_class = __NAMESPACE__ . '\Widget_WordPress';
            $this->register_widget_type( new $qazana_widget_class( array(), [ 'widget_name' => $widget_class ] ) );
        }
    }

    /**
	 * @since 1.0.0
	 * @access public
	 */
    public function require_files() {

        $default_files = [];

		if ( ! class_exists( 'Qazana\Controls_Stack' ) ) {
            $default_files[] = 'base/controls-stack.php';
        }

        if ( ! class_exists( 'Qazana\Element_Base' ) ) {
            $default_files[] = 'base/element-base.php';
        }

        if ( ! class_exists( 'Qazana\Widget_Base' ) ) {
            $default_files[] = 'base/widget-base.php';
        }

        $files = apply_filters( 'qazana/widgets/require_files', $default_files );

        if ( is_array( $files ) ) {
            foreach ( $files as $file ) {
                qazana()->widget_loader->locate_widget( $file, true );
            }
        }

    }

	/**
	 * @since 1.0.0
	 * @access public
	*/
	public function register_widget_type( Widget_Base $widget ) {
		if ( is_null( $this->_widget_types ) ) {
			$this->_init_widgets();
		}

        $this->_widget_types[ $widget->get_name() ] = $widget;

        $this->_widget_types = apply_filters( 'qazana/widgets/register_widget_type', $this->_widget_types, $this );

		return true;
	}

	/**
	 * @since 1.0.0
	 * @access public
	*/
	public function unregister_widget_type( $name ) {
		if ( ! isset( $this->_widget_types[ $name ] ) ) {
			return false;
		}

		unset( $this->_widget_types[ $name ] );

		return true;
	}

	/**
	 * @since 1.0.0
	 * @access public
	*/
	public function get_widget_types( $widget_name = null ) {
		if ( is_null( $this->_widget_types ) ) {
			$this->_init_widgets();
		}

		//sort alphabetically
		ksort( $this->_widget_types );

		if ( null !== $widget_name ) {
			return isset( $this->_widget_types[ $widget_name ] ) ? $this->_widget_types[ $widget_name ] : null;
		}

		return $this->_widget_types;
	}

	/**
	 * @since 1.0.0
	 * @access public
	*/
	public function get_widget_types_config() {
		$config = [];

		foreach ( $this->get_widget_types() as $widget_key => $widget ) {
			if ( ! $widget->show_in_panel() ) {
				continue;
			}

			$config[ $widget_key ] = $widget->get_config();
		}

		return $config;
	}

	/**
	 * @since 1.0.0
	 * @access public
	*/
	public function ajax_render_widget() {

        if ( ! qazana()->editor->verify_request_nonce() ) {
			wp_send_json_error( new \WP_Error( 'token_expired' ) );
		}

		if ( empty( $_POST['post_id'] ) ) {
			wp_send_json_error( new \WP_Error( 'no_post_id', 'No post_id' ) );
		}

		if ( ! User::is_current_user_can_edit( $_POST['post_id'] ) ) {
			wp_send_json_error( new \WP_Error( 'no_access' ) );
		}

		// Override the global $post for the render.
		query_posts(
			[
				'p' => $_POST['post_id'],
				'post_type' => 'any',
			]
		);

		qazana()->db->switch_to_post( $_POST['post_id'] );

		$data = json_decode( stripslashes( $_POST['data'] ), true );

		// Start buffering
		ob_start();

        /** @var Widget_Base $widget */
		$widget = qazana()->elements_manager->create_element_instance( $data );

		if ( ! $widget ) {
			wp_send_json_error();

			return;
		}

		$widget->render_content();

		$render_html = ob_get_clean();

		wp_send_json_success(
			[
				'render' => $render_html,
			]
		);
	}

	/**
	 * @since 1.0.0
	 * @access public
	*/
	public function ajax_get_wp_widget_form() {

        if ( qazana()->editor->verify_request_nonce() ) {
			die;
		}

		if ( empty( $_POST['widget_type'] ) ) {
			wp_send_json_error();
		}

		if ( empty( $_POST['data'] ) ) {
			$_POST['data'] = [];
		}

		$data = json_decode( stripslashes( $_POST['data'] ), true );

		$element_data = [
			'id' => $_POST['id'],
			'elType' => 'widget',
			'widgetType' => $_POST['widget_type'],
			'settings' => $data,
		];

		/**
		 * @var $widget_obj Widget_WordPress
		 */
		$widget_obj = qazana()->elements_manager->create_element_instance( $element_data );

		if ( ! $widget_obj ) {
			wp_send_json_error();
		}

		wp_send_json_success( $widget_obj->get_form() );
	}

	/**
	 * @since 1.0.0
	 * @access public
	*/
	public function render_widgets_content() {
		foreach ( $this->get_widget_types() as $widget ) {
			$widget->print_template();
		}
	}

	/**
	 * @since 1.3.0
	 * @access public
	*/
	public function get_widgets_frontend_settings_keys() {
		$keys = [];

		foreach ( $this->get_widget_types() as $widget_type_name => $widget_type ) {
			$widget_type_keys = $widget_type->get_frontend_settings_keys();

			if ( $widget_type_keys ) {
				$keys[ $widget_type_name ] = $widget_type_keys;
			}
		}

		return $keys;
    }

    /**
	 * Retrieve inline editing configuration.
	 *
	 * Returns general inline editing configurations like toolbar types etc.
	 *
	 * @access public
	 * @since 1.3.0
	 *
	 * @return array {
	 *     Inline editing configuration.
	 *
	 *     @type array $toolbar {
	 *         Toolbar types and the actions each toolbar includes.
	 *         Note: Wysiwyg controls uses the advanced toolbar, textarea controls
	 *         uses the basic toolbar and text controls has no toolbar.
	 *
	 *         @type array $basic    Basic actions included in the edit tool.
	 *         @type array $advanced Advanced actions included in the edit tool.
	 *     }
	 * }
	 */
	public function get_inline_editing_config() {
		$basic_tools = [
			'bold',
			'underline',
			'italic',
		];

		$advanced_tools = array_merge( $basic_tools, [
			'createlink',
			'unlink',
			'h1' => [
				'h1',
				'h2',
				'h3',
				'h4',
				'h5',
				'h6',
				'p',
				'blockquote',
				'pre',
			],
			'list' => [
				'insertOrderedList',
				'insertUnorderedList',
			],
		] );

		return [
			'toolbar' => [
				'basic' => $basic_tools,
				'advanced' => $advanced_tools,
			],
		];
	}
}
