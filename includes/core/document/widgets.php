<?php
namespace Qazana\Document;

use Qazana\Core\Ajax_Manager;
use Qazana\Core\Utils\Exceptions;
use Qazana\Loader;
use Qazana\Widget_Base;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Qazana document widgets.
 *
 * Qazana widgets manager handler class is responsible for registering and
 * initializing all the supported Qazana widgets.
 *
 * @since 1.0.0
 */
class Widgets {

	/**
	 * Widget types.
	 *
	 * Holds the list of all the widget types.
	 *
	 * @since 1.0.0
	 * @access private
	 *
	 * @var Widget_Base[]
	 */
	private $_widget_types = null;

	/**
	 * Init widgets.
	 *
	 * Initialize Qazana widgets manager. Include all the the widgets files
	 * and register each Qazana and WordPress widget.
	 *
	 * @since 1.0.0
	 * @access private
	*/
	public function __construct() {

		add_action( 'qazana/widgets/loader/after', [ $this, 'require_files' ] ); // Load these immediately for use by extensions.
		add_action( 'qazana/ajax/register_actions', [ $this, 'register_ajax_actions' ] );

		$this->loader = new Loader();

		do_action( 'qazana/widgets/loader/before', $this->loader );

		$this->loader->add_stack( qazana()->theme_paths_child, qazana()->theme_widget_locations );
		$this->loader->add_stack( qazana()->theme_paths, qazana()->theme_widget_locations );

		do_action( 'qazana/widgets/loader', $this->loader ); // plugins can intercept the stack here. Themes will always take precedence.

		$this->loader->add_stack(
			[
				'path' => qazana_get_dir(),
				'uri'  => qazana_get_dir(),
			],
			qazana()->plugin_widget_locations
		);

		do_action( 'qazana/widgets/loader/after', $this->loader );
	}

	/**
	 * @since 1.0.0
	 * @access private
	*/
	private function init_widgets() {

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

		if ( ! class_exists( 'Qazana\Widget_Base' ) ) {
			return;
		}

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

			if ( ! $this->loader->locate_widget( $widget_filename . '.php', false ) ) {
				continue;
			}

			$class_name = str_replace( '-', '_', $widget_filename );

			$class_name =  'Qazana\Widget_' . $class_name;

			$class_name = apply_filters( "qazana/widgets/{$widget_filename}_class_name", $class_name, $widget_filename );

			if ( ! class_exists( $class_name ) ) {
				$this->loader->locate_widget( $widget_filename . '.php', true );
			}

			$this->register_widget_type( new $class_name() );
		}

		$this->register_wp_widgets();

		/**
		 * After widgets registered.
		 *
		 * Fires after Qazana widgets are registered.
		 *
		 * @since 1.0.0
		 *
		 * @param Widgets_Manager $this The widgets manager.
		 */
		do_action( 'qazana/widgets/widgets_registered', $this );
	}

	/**
	 * Register WordPress widgets.
	 *
	 * Add native WordPress widget to the list of registered widget types.
	 *
	 * Exclude the widgets that are in Qazana widgets black list. Theme and
	 * plugin authors can filter the black list.
	 *
	 * @since 1.0.0
	 * @access private
	 */
	private function register_wp_widgets() {

		global $wp_widget_factory;

		$this->loader->locate_widget( 'wordpress.php', true );

		$blacklist = [
			'WP_Widget_Text', //unnecessary since Qazana has a text widget
		];

		/**
		 * Qazana widgets black list.
		 *
		 * Filters the widgets black list that won't be displayed in the panel.
		 *
		 * @since 1.0.0
		 *
		 * @param array $black_list A black list of widgets. Default is an empty array.
		 */
		$black_list = apply_filters( 'qazana/widgets/black_list', $blacklist );

		$widgets = apply_filters( 'qazana/widgets_manager/widgets', $wp_widget_factory->widgets );

		foreach ( $widgets as $widget_class => $widget_obj ) {

			if ( in_array( $widget_class, $black_list ) ) {
				continue;
			}

			$qazana_widget_class = 'Qazana\Widget_WordPress';
			$this->register_widget_type( new $qazana_widget_class( array(), [ 'widget_name' => $widget_class ] ) );
		}
	}

	/**
	 * Require files.
	 *
	 * Require Qazana widget base class.
	 *
	 * @since 2.0.0
	 * @access private
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

		foreach ( (array) $files as $file ) {
			$this->loader->locate_widget( $file, true );
		}
	}

	/**
	 * Register widget type.
	 *
	 * Add a new widget type to the list of registered widget types.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param Widget_Base $widget Qazana widget.
	 *
	 * @return true True if the widget was registered.
	*/
	public function register_widget_type( Widget_Base $widget ) {
		if ( is_null( $this->_widget_types ) ) {
			$this->init_widgets();
		}

		$this->_widget_types[ $widget->get_name() ] = $widget;
		$this->_widget_types = apply_filters( 'qazana/widgets/register_widget_type', $this->_widget_types, $this );

		return true;
	}

	/**
	 * Unregister widget type.
	 *
	 * Removes widget type from the list of registered widget types.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param string $name Widget name.
	 *
	 * @return true True if the widget was unregistered, False otherwise.
	*/
	public function unregister_widget_type( $name ) {
		if ( ! isset( $this->_widget_types[ $name ] ) ) {
			return false;
		}

		unset( $this->_widget_types[ $name ] );

		return true;
	}

	/**
	 * Get widget types.
	 *
	 * Retrieve the registered widget types list.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param string $widget_name Optional. Widget name. Default is null.
	 *
	 * @return Widget_Base|Widget_Base[]|null Registered widget types.
	*/
	public function get_widget_types( $widget_name = null ) {
		if ( is_null( $this->_widget_types ) ) {
			$this->init_widgets();
		}

		// sort alphabetically
		ksort( $this->_widget_types );

		if ( null !== $widget_name ) {
			return isset( $this->_widget_types[ $widget_name ] ) ? $this->_widget_types[ $widget_name ] : null;
		}

		return $this->_widget_types;
	}

	/**
	 * Get widget types config.
	 *
	 * Retrieve all the registered widgets with config for each widgets.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return array Registered widget types with each widget config.
	*/
	public function get_widget_types_config() {
		$config = [];

		foreach ( $this->get_widget_types() as $widget_key => $widget ) {
			$config[ $widget_key ] = $widget->get_config();
		}

		return $config;
	}

	/**
	 * Ajax render widget.
	 *
	 * Ajax handler for Qazana render_widget.
	 *
	 * Fired by `wp_ajax_qazana_render_widget` action.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @throws \Exception If current user don't have permissions to edit the post.
	 *
	 * @param array $request Ajax request.
	 *
	 * @return array {
	 *     Rendered widget.
	 *
	 *     @type string $render The rendered HTML.
	 * }
	 */
	public function ajax_render_widget( $request ) {
		$document = qazana()->get_documents()->get( $request['editor_post_id'] );

		if ( ! $document->is_editable_by_current_user() ) {
			throw new \Exception( 'Access denied.', Exceptions::FORBIDDEN );
		}

		// Override the global $post for the render.
		query_posts(
			[
				'p' => $request['editor_post_id'],
				'post_type' => 'any',
			]
		);

		$editor = qazana()->get_editor();
		$is_edit_mode = $editor->is_edit_mode();
		$editor->set_edit_mode( true );

		qazana()->get_documents()->switch_to_document( $document );

		$render_html = $document->render_element( $request['data'] );

		$editor->set_edit_mode( $is_edit_mode );

		return [
			'render' => $render_html,
		];
	}

	/**
	 * Ajax get WordPress widget form.
	 *
	 * Ajax handler for Qazana editor get_wp_widget_form.
	 *
	 * Fired by `wp_ajax_qazana_editor_get_wp_widget_form` action.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param array $request Ajax request.
	 *
	 * @return bool|string Rendered widget form.
	 */
	public function ajax_get_wp_widget_form( $request ) {
		if ( empty( $request['widget_type'] ) ) {
			return false;
		}

		if ( empty( $request['data'] ) ) {
			$request['data'] = [];
		}

		$data = [
			'id' => $request['id'],
			'elType' => 'widget',
			'widgetType' => $request['widget_type'],
			'settings' => $request['data'],
		];

		/**
		 * @var $widget_obj Widget_WordPress
		 */
		$widget_obj = qazana()->get_elements_manager()->create_element_instance( $document, $data );

		if ( ! $widget_obj ) {
			return false;
		}

		return $widget_obj->get_form();
	}

	/**
	 * Render widgets content.
	 *
	 * Used to generate the widget templates on the editor using Underscore JS
	 * template, for all the registered widget types.
	 *
	 * @since 1.0.0
	 * @access public
	*/
	public function render_widgets_content() {
		foreach ( $this->get_widget_types() as $widget ) {
			$widget->print_template();
		}
	}

	/**
	 * Get widgets frontend settings keys.
	 *
	 * Retrieve frontend controls settings keys for all the registered widget
	 * types.
	 *
	 * @since 1.3.0
	 * @access public
	 *
	 * @return array Registered widget types with settings keys for each widget.
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

		$advanced_tools = array_merge(
			$basic_tools,
			[
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
			]
		);

		return [
			'toolbar' => [
				'basic' => $basic_tools,
				'advanced' => $advanced_tools,
			],
		];
	}
	/**
	 * Register ajax actions.
	 *
	 * Add new actions to handle data after an ajax requests returned.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @param Ajax_Manager $ajax_manager
	 */
	public function register_ajax_actions( $ajax_manager ) {
		$ajax_manager->register_ajax_action( 'render_widget', [ $this, 'ajax_render_widget' ] );
		$ajax_manager->register_ajax_action( 'editor_get_wp_widget_form', [ $this, 'ajax_get_wp_widget_form' ] );
	}
}
