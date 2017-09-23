<?php
namespace Qazana;

use Qazana\Core\Settings\Manager as SettingsManager;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Editor {

	private $_post_id;

	private $_is_edit_mode;

	private $_editor_templates = [];

	/**
	 * @var array
	 */
	private $_localize_settings = [];

	private function init_editor_templates() {
		// It can be filled from plugins
		$this->_editor_templates = array_merge( $this->_editor_templates, [
		 	__DIR__ . '/editor-templates/global.php',
			__DIR__ . '/editor-templates/panel.php',
			__DIR__ . '/editor-templates/panel-elements.php',
			__DIR__ . '/editor-templates/repeater.php',
			__DIR__ . '/editor-templates/templates.php',
		] );

		do_action( 'qazana/editor/editor_templates' );
	}

	public function __construct() {
		add_action( 'admin_action_qazana', [ $this, 'init' ] );
		add_action( 'template_redirect', [ $this, 'redirect_to_new_url' ] );
	}

    public function get_localize_settings() {
        return $this->_localize_settings;
    }

    public function add_localize_settings( $setting_key, $setting_value = null ) {
        if ( is_array( $setting_key ) ) {
            $this->_localize_settings = array_replace_recursive( $this->_localize_settings, $setting_key );
            return;
        }

        if ( ! is_array( $setting_value ) || ! isset( $this->_localize_settings[ $setting_key ] ) || ! is_array( $this->_localize_settings[ $setting_key ] ) ) {
            $this->_localize_settings[ $setting_key ] = $setting_value;
            return;
        }

        $this->_localize_settings[ $setting_key ] = array_replace_recursive( $this->_localize_settings[ $setting_key ], $setting_value );
    }

	public function init( $die = true ) {
		if ( empty( $_REQUEST['post'] ) ) { // WPCS: CSRF ok.
			return;
		}

		$this->_post_id = absint( $_REQUEST['post'] );

		if ( ! $this->is_edit_mode( $this->_post_id ) ) {
			return;
		}

		$this->init_editor_templates();

		// Send MIME Type header like WP admin-header.
		@header( 'Content-Type: ' . get_option( 'html_type' ) . '; charset=' . get_option( 'blog_charset' ) );

		query_posts( [ 'p' => $this->_post_id, 'post_type' => get_post_type( $this->_post_id ) ] );

		qazana()->db->switch_to_post( $this->_post_id );

		add_filter( 'show_admin_bar', '__return_false' );

		// Remove all WordPress actions
		remove_all_actions( 'wp_head' );
		remove_all_actions( 'wp_print_styles' );
		remove_all_actions( 'wp_print_head_scripts' );
		remove_all_actions( 'wp_footer' );

		// Handle `wp_head`
		add_action( 'wp_head', 'wp_enqueue_scripts', 1 );
		add_action( 'wp_head', 'wp_print_styles', 8 );
		add_action( 'wp_head', 'wp_print_head_scripts', 9 );
		add_action( 'wp_head', 'wp_site_icon' );
		add_action( 'wp_head', [ $this, 'editor_head_trigger' ], 30 );

		// Handle `wp_footer`
		add_action( 'wp_footer', 'wp_print_footer_scripts', 20 );
		add_action( 'wp_footer', 'wp_auth_check_html', 30 );
		add_action( 'wp_footer', [ $this, 'wp_footer' ] );

		// Handle `wp_enqueue_scripts`
		remove_all_actions( 'wp_enqueue_scripts' );

		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_scripts' ], 999999 );
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_styles' ], 999999 );

		// Change mode to Builder
		qazana()->db->set_is_builder_page( $this->_post_id );

		// Post Lock
		if ( ! $this->get_locked_user( $this->_post_id ) ) {
			$this->lock_post( $this->_post_id );
		}

		// Setup default heartbeat options
		add_filter( 'heartbeat_settings', function( $settings ) {
			$settings['interval'] = 15;
			return $settings;
		} );

		// Tell to WP Cache plugins do not cache this request.
		Utils::do_not_cache();

		// Print the panel
		$this->print_panel_html();

		// From the action it's an empty string, from tests its `false`
		if ( false !== $die ) {
			die;
		}
	}

	public function redirect_to_new_url() {
		if ( ! isset( $_REQUEST['qazana'] ) ) {
			return;
		}

		$post_id = get_the_ID();

		if ( ! User::is_current_user_can_edit( $post_id ) || ! qazana()->db->is_built_with_qazana( $post_id ) ) {
			return;
		}

		wp_redirect( Utils::get_edit_link( $post_id ) );
		die;
	}

	public function is_edit_mode( $post_id = null ) {
		if ( null !== $this->_is_edit_mode ) {
			return $this->_is_edit_mode;
		}

		if ( ! User::is_current_user_can_edit( $post_id ) ) {
			return false;
		}

		// Ajax request as Editor mode
		$actions = [
			'qazana',
			'qazana_render_widget',

			// Templates
			'qazana_get_templates',
			'qazana_save_template',
			'qazana_get_template',
			'qazana_delete_template',
			'qazana_export_template',
			'qazana_import_template',
		];

		if ( isset( $_REQUEST['action'] ) && in_array( $_REQUEST['action'], $actions ) ) {
			return true;
		}

		return false;
	}

	/**
	 * @param $post_id
	 */
	public function lock_post( $post_id ) {
		if ( ! function_exists( 'wp_set_post_lock' ) ) {
			require_once( ABSPATH . 'wp-admin/includes/post.php' );
		}

		wp_set_post_lock( $post_id );
	}

	/**
	 * @param $post_id
	 *
	 * @return bool|\WP_User
	 */
	public function get_locked_user( $post_id ) {
		if ( ! function_exists( 'wp_check_post_lock' ) ) {
			require_once( ABSPATH . 'wp-admin/includes/post.php' );
		}

		$locked_user = wp_check_post_lock( $post_id );
		if ( ! $locked_user ) {
			return false;
		}

		return get_user_by( 'id', $locked_user );
	}

	public function print_panel_html() {
		include( 'editor-templates/editor-wrapper.php' );
	}

	public function enqueue_scripts() {
		remove_action( 'wp_enqueue_scripts', [ $this, __FUNCTION__ ], 999999 );

		global $wp_styles, $wp_scripts;

		// Set the global data like $authordata and etc
		setup_postdata( $this->_post_id );

        $editor_data = qazana()->db->get_builder( $this->_post_id, DB::STATUS_DRAFT );

        // Reset global variable
        $wp_styles = new \WP_Styles();
        $wp_scripts = new \WP_Scripts();

        $suffix = Utils::is_script_debug() ? '' : '.min';

		// Hack for waypoint with editor mode.
		wp_register_script(
			'waypoints',
			qazana()->core_assets_url . 'lib/waypoints/waypoints-for-editor.js',
			[
				'jquery',
			],
			'4.0.1',
			true
		);


        wp_register_script(
            'backbone-marionette',
            qazana()->core_assets_url . 'lib/backbone/backbone.marionette' . $suffix . '.js',
            [
                'backbone',
            ],
            '2.4.5',
            true
        );

        wp_register_script(
            'backbone-radio',
            qazana()->core_assets_url . 'lib/backbone/backbone.radio' . $suffix . '.js',
            [
                'backbone',
            ],
            '1.0.4',
            true
        );

        wp_register_script(
            'perfect-scrollbar',
            qazana()->core_assets_url . 'lib/perfect-scrollbar/perfect-scrollbar.jquery' . $suffix . '.js',
            [
                'jquery',
            ],
            '0.6.12',
            true
        );

        wp_register_script(
            'jquery-easing',
            qazana()->core_assets_url . 'lib/jquery-easing/jquery-easing' . $suffix . '.js',
            [
                'jquery',
            ],
            '1.3.2',
            true
        );

        wp_register_script(
            'nprogress',
            qazana()->core_assets_url . 'lib/nprogress/nprogress' . $suffix . '.js',
            [],
            '0.2.0',
            true
        );

        wp_register_script(
            'tipsy',
            qazana()->core_assets_url . 'lib/tipsy/tipsy' . $suffix . '.js',
            [
                'jquery',
            ],
            '1.0.0',
            true
        );

        wp_register_script(
            'imagesloaded',
            qazana()->core_assets_url . 'lib/imagesloaded/imagesloaded' . $suffix . '.js',
            [
                'jquery',
            ],
            '4.1.0',
            true
        );

        wp_register_script(
            'qazana-dialog',
            qazana()->core_assets_url . 'lib/dialog/dialog' . $suffix . '.js',
            [
                'jquery-ui-position',
            ],
            '3.0.0',
            true
        );

        wp_register_script(
            'jquery-select2',
            qazana()->core_assets_url . 'lib/select2/js/select2' . $suffix . '.js',
            [
                'jquery',
            ],
            '4.0.2',
            true
        );

		wp_register_script(
			'jquery-simple-dtpicker',
			qazana()->core_assets_url . 'lib/jquery-simple-dtpicker/jquery.simple-dtpicker' . $suffix . '.js',
			[
				'jquery',
			],
			'1.12.0',
			true
    	);


		wp_register_script(
			'ace',
			'https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.5/ace.js',
			[],
			'1.2.5',
			true
		);

		wp_register_script(
			'jquery-fonticonpicker',
			qazana()->core_assets_url . 'lib/fonticonpicker/jquery.fonticonpicker' . $suffix . '.js',
			[
				'jquery',
			],
            '2.0.0',
			true
    	);

        wp_register_script(
            'qazana-editor',
            qazana()->core_assets_url . 'js/editor' . $suffix . '.js',
            [
                'wp-auth-check',
                'jquery-ui-sortable',
                'jquery-ui-resizable',
                'backbone-marionette',
                'backbone-radio',
                'perfect-scrollbar',
                'jquery-easing',
                'nprogress',
                'tipsy',
                'imagesloaded',
                'heartbeat',
                'qazana-dialog',
                'jquery-select2',
                'hoverIntent',
                'jquery-simple-dtpicker',
				'ace',
				'jquery-fonticonpicker'
            ],
            qazana_get_version(),
            true
        );

		do_action( 'qazana/editor/before_enqueue_scripts' );

		// Remove all TinyMCE plugins.
		remove_all_filters( 'mce_buttons', 10 );
		remove_all_filters( 'mce_external_plugins', 10 );

		wp_enqueue_script( 'qazana-editor' );

		// Tweak for WP Admin menu icons
		wp_print_styles( 'editor-buttons' );

		$locked_user = $this->get_locked_user( $this->_post_id );

		if ( $locked_user ) {
			$locked_user = $locked_user->display_name;
		}

		$page_title_selector = get_option( 'qazana_page_title_selector' );

		if ( empty( $page_title_selector ) ) {
			$page_title_selector = 'h1.entry-title';
		}

        $this->add_localize_settings( [
			'version' => qazana_get_version(),
            'ajaxurl' => admin_url( 'admin-ajax.php' ),
            'home_url' => home_url(),
            'nonce' => wp_create_nonce( 'qazana-editing' ),
            'preview_link' => Utils::get_preview_url( $this->_post_id ),
            'elements_categories' => qazana()->elements_manager->get_categories(),
            'controls' => qazana()->controls_manager->get_controls_data(),
            'elements' => qazana()->elements_manager->get_element_types_config(),
            'widgets' => qazana()->widgets_manager->get_widget_types_config(),
            'schemes' => [
                'items' => qazana()->schemes_manager->get_registered_schemes_data(),
                'enabled_schemes' => Schemes_Manager::get_enabled_schemes(),
            ],
            'default_schemes' => qazana()->schemes_manager->get_schemes_defaults(),
	     	'settings' => SettingsManager::get_settings_managers_config(),
            'system_schemes' => qazana()->schemes_manager->get_system_schemes(),
            'wp_editor' => $this->_get_wp_editor_config(),
            'post_id' => $this->_post_id,
            'settings_page_link' => admin_url( 'admin.php?page=' . qazana()->slug ),
            'qazana_site' => 'https://radiumthemes.com/plugins/qazana',
            'help_the_content_url' => 'https://radiumthemes.com/plugins/qazana/the-content-missing/',
            'assets_url' => qazana()->core_assets_url,
            'data' => $editor_data,
            'locked_user' => $locked_user,
            'is_rtl' => is_rtl(),
            'locale' => get_locale(),
            'viewportBreakpoints' => Responsive::get_breakpoints(),
			'rich_editing_enabled' => filter_var( get_user_meta( get_current_user_id(), 'rich_editing', true ), FILTER_VALIDATE_BOOLEAN ),
			'page_title_selector' => $page_title_selector,
			'tinymceHasCustomConfig' => class_exists( 'Tinymce_Advanced' ),
			'revisions' => Revisions_Manager::get_revisions(),
			'revisions_enabled' => ( $this->_post_id && wp_revisions_enabled( get_post() ) ),
            'i18n' => [
                'qazana' => __( 'Qazana', 'qazana' ),
                'dialog_confirm_delete' => __( 'Are you sure you want to remove this {0}?', 'qazana' ),
                'dialog_user_taken_over' => __( '{0} has taken over and is currently editing. Do you want to take over this page editing?', 'qazana' ),
                'delete' => __( 'Delete', 'qazana' ),
                'cancel' => __( 'Cancel', 'qazana' ),
                'delete_element' => __( 'Delete {0}', 'qazana' ),
                'take_over' => __( 'Take Over', 'qazana' ),
                'go_back' => __( 'Go Back', 'qazana' ),
                'saved' => __( 'Saved', 'qazana' ),
                'before_unload_alert' => __( 'Please note: All unsaved changes will be lost.', 'qazana' ),
                'edit_element' => __( 'Edit {0}', 'qazana' ),
                'global_colors' => __( 'Global Colors', 'qazana' ),
                'global_fonts' => __( 'Global Fonts', 'qazana' ),
                'qazana_settings' => __( 'Qazana Settings', 'qazana' ),
                'soon' => __( 'Soon', 'qazana' ),
                'about_qazana' => __( 'About Qazana', 'qazana' ),
                'inner_section' => __( 'Columns', 'qazana' ),
                'dialog_confirm_gallery_delete' => __( 'Are you sure you want to reset this gallery?', 'qazana' ),
                'delete_gallery' => __( 'Reset Gallery', 'qazana' ),
                'gallery_images_selected' => __( '{0} Images Selected', 'qazana' ),
                'insert_media' => __( 'Insert Media', 'qazana' ),
                'preview_el_not_found_header' => __( 'Sorry, the content area was not found in your page.', 'qazana' ),
                'preview_el_not_found_message' => __( 'You must call \'the_content\' function in the current template, in order for Qazana to work on this page.', 'qazana' ),
                'learn_more' => __( 'Learn More', 'qazana' ),
                'an_error_occurred' => __( 'An error occurred', 'qazana' ),
                'templates_request_error' => __( 'The following error(s) occurred while processing the request:', 'qazana' ),
                'save_your_template' => __( 'Save Your {0} to Library', 'qazana' ),
        		'save_your_template_description' => __( 'Your designs will be available for export and reuse on any page or website', 'qazana' ),
                'page' => __( 'Page', 'qazana' ),
                'section' => __( 'Section', 'qazana' ),
                'delete_template' => __( 'Delete Template', 'qazana' ),
                'delete_template_confirm' => __( 'Are you sure you want to delete this template?', 'qazana' ),
                'color_picker' => __( 'Color Picker', 'qazana' ),
                'clear_page' => __( 'Delete All Content', 'qazana' ),
                'dialog_confirm_clear_page' => __( 'Attention! We are going to DELETE ALL CONTENT from this page. Are you sure you want to do that?', 'qazana' ),
                'asc' => __( 'Ascending order', 'qazana' ),
                'desc' => __( 'Descending order', 'qazana' ),
				'autosave' => __( 'Autosave', 'qazana' ),
				'preview' => __( 'Preview', 'qazana' ),
				'back_to_editor' => __( 'Back to Editor', 'qazana' ),
				'import_template_dialog_header' => __( 'Import Page Settings', 'qazana' ),
				'import_template_dialog_message' => __( 'Do you want to also import the page settings of the template?', 'qazana' ),
				'import_template_dialog_message_attention' => __( 'Attention! Importing may override previous settings.', 'qazana' ),
				'no' => __( 'No', 'qazana' ),
				'yes' => __( 'Yes', 'qazana' ),
				'revision_history' => __( 'Revision History', 'qazana' ),
				'no_revisions_1' => __( 'Revision history lets you save your previous versions of your work, and restore them any time.', 'qazana' ),
				'no_revisions_2' => __( 'Start designing your page and you\'ll be able to see the entire revision history here.', 'qazana' ),
				'revisions_disabled_1' => __( 'It looks like the post revision feature is unavailable in your website.', 'qazana' ),
				'revisions_disabled_2' => sprintf( __( 'Learn more about <a targe="_blank" href="%s">WordPress revisions</a>', 'qazana' ), 'https://codex.wordpress.org/Revisions#Revision_Options)' ),
				'revision' => __( 'Revision', 'qazana' ),
            ]
        ]);

		// Very important that this be loaded before 'qazana-editor' - for use by extensions
        wp_localize_script( 'backbone-marionette', 'QazanaConfig', $this->get_localize_settings() );

        qazana()->controls_manager->enqueue_control_scripts();

        do_action( 'qazana/editor/after_enqueue_scripts' );
    }

    public function enqueue_styles() {

		do_action( 'qazana/editor/before_enqueue_styles' );

        $suffix = Utils::is_script_debug() ? '' : '.min';

        $direction_suffix = is_rtl() ? '-rtl' : '';

        wp_register_style(
            'select2',
            qazana()->core_assets_url . 'lib/select2/css/select2' . $suffix . '.css',
            [],
            '4.0.2'
        );

        wp_register_style(
            'qazana-icons',
            qazana()->core_assets_url . 'lib/eicons/css/icons' . $suffix . '.css',
            [],
            qazana_get_version()
        );

		wp_register_style(
			'google-font-noto-sans',
			'https://fonts.googleapis.com/css?family=Noto+Sans:400,400i,700,700i',
			[],
			qazana_get_version()
		);

        wp_register_style(
			'jquery-simple-dtpicker',
			qazana()->core_assets_url . 'lib/jquery-simple-dtpicker/jquery.simple-dtpicker' . $suffix . '.css',
			[],
			'1.12.0'
    	);

		wp_register_style(
			'jquery-fonticonpicker',
			qazana()->core_assets_url . 'lib/fonticonpicker/css/jquery.fonticonpicker' . $suffix . '.css',
			[],
			'2.0.0'
    	);

        wp_register_style(
            'jquery-fonticonpicker-grey',
            qazana()->core_assets_url . 'lib/fonticonpicker/themes/grey-theme/jquery.fonticonpicker.grey' . $suffix . '.css',
            ['jquery-fonticonpicker'],
            '2.0.0'
        );

        wp_register_style(
            'qazana-editor',
            qazana()->core_assets_url . 'css/editor' . $direction_suffix . $suffix . '.css',
            [
                'select2',
                'qazana-icons',
                'wp-auth-check',
                'google-font-noto-sans',
                'jquery-simple-dtpicker',
                'jquery-fonticonpicker',
                'jquery-fonticonpicker-grey',
                'font-awesome',
            ],
            qazana_get_version()
        );

        wp_enqueue_style( 'qazana-editor' );

		do_action( 'qazana/editor/after_enqueue_styles' );
    }

	protected function _get_wp_editor_config() {
		ob_start();
		wp_editor(
			'%%EDITORCONTENT%%',
			'qazanawpeditor',
			[
				'editor_class' => 'qazana-wp-editor',
				'editor_height' => 250,
				'drag_drop_upload' => true,
			]
		);
		return ob_get_clean();
	}

	public function editor_head_trigger() {
		do_action( 'qazana/editor/wp_head' );
	}

	/**
	 * @param string $template_path - Can be either a link to template file or template HTML content
	 */
	public function add_editor_template( $template_path ) {
		$this->_editor_templates[] = $template_path;
	}

	public function wp_footer() {

		qazana()->controls_manager->render_controls();
		qazana()->widgets_manager->render_widgets_content();
		qazana()->elements_manager->render_elements_content();

		qazana()->schemes_manager->print_schemes_templates();

		foreach ( $this->_editor_templates as $editor_template ) {
			if ( file_exists( $editor_template ) ) {
				include $editor_template;
			} else {
				echo $editor_template;
			}
		}

		do_action( 'qazana/editor/footer' );
	}

	/**
	 * @param bool $edit_mode
	 */
	public function set_edit_mode( $edit_mode ) {
		$this->_is_edit_mode = $edit_mode;
	}

}
