<?php
namespace Qazana;

use Qazana\Core\Responsive\Breakpoints;
use Qazana\Core\Settings\Manager as SettingsManager;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Qazana editor.
 *
 * Qazana editor handler class is responsible for initializing Qazana
 * editor and register all the actions needed to display the editor.
 *
 * @since 1.0.0
 */
class Editor {

	/**
	 * The nonce key for Qazana editor.
	 */
	const EDITING_NONCE_KEY = 'qazana-editing';

	/**
	 * User capability required to access Qazana editor.
	 */
	const EDITING_CAPABILITY = 'edit_posts';

	/**
	 * Post ID.
	 *
	 * Holds the ID of the current post being edited.
	 *
	 * @since 1.0.0
	 * @access private
	 *
	 * @var int Post ID.
	 */
	private $_post_id;

	/**
	 * Whether the edit mode is active.
	 *
	 * Used to determine whether we are in edit mode.
	 *
	 * @since 1.0.0
	 * @access private
	 *
	 * @var bool Whether the edit mode is active.
	 */
	private $_is_edit_mode;

	/**
	 * Editor templates.
	 *
	 * Holds the editor templates used by Marionette.js.
	 *
	 * @since 1.0.0
	 * @access private
	 *
	 * @var array Editor templates.
	 */
	private $_editor_templates = [];

	/**
	 * @var array
	 */
	private $_localize_settings = [];

    	/**
	 * Init.
	 *
	 * Initialize Qazana editor. Registers all needed actions to run Qazana,
	 * removes conflicting actions etc.
	 *
	 * Fired by `admin_action_qazana` action.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param bool $die Optional. Whether to die at the end. Default is `true`.
	 */
	public function init( $die = true ) {
		if ( empty( $_REQUEST['post'] ) ) { // WPCS: CSRF ok.
			return;
		}

		$this->_post_id = absint( $_REQUEST['post'] );

		if ( ! $this->is_edit_mode( $this->_post_id ) ) {
			return;
		}

		// Send MIME Type header like WP admin-header.
		@header( 'Content-Type: ' . get_option( 'html_type' ) . '; charset=' . get_option( 'blog_charset' ) );

		// Use requested id and not the global in order to avoid conflicts with plugins that changes the global post.
		query_posts( [
			'p' => $this->_post_id,
			'post_type' => get_post_type( $this->_post_id ),
		] );

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
		qazana()->db->set_is_qazana_page( $this->_post_id );

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

		$this->print_editor_template();

		// From the action it's an empty string, from tests its `false`
		if ( false !== $die ) {
			die;
		}
	}

	/**
	 * Retrieve post ID.
	 *
	 * Get the ID of the current post.
	 *
	 * @since 1.8.0
	 * @access public
	 *
	 * @return int Post ID.
	 */
	public function get_post_id() {
		return $this->_post_id;
	}

	/**
	 * Redirect to new URL.
	 *
	 * Used as a fallback function for the old URL structure of Qazana page
	 * edit URL.
	 *
	 * Fired by `template_redirect` action.
	 *
	 * @since 1.6.0
	 * @access public
	 */
	public function redirect_to_new_url() {
		if ( ! isset( $_GET['qazana'] ) ) {
			return;
		}

		$post_id = get_the_ID();

		if ( ! User::is_current_user_can_edit( $post_id ) || ! qazana()->db->is_built_with_qazana( $post_id ) ) {
			return;
		}

		wp_redirect( Utils::get_edit_link( $post_id ) );
		die;
	}

	/**
	 * Whether the edit mode is active.
	 *
	 * Used to determine whether we are in the edit mode.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param int $post_id Optional. Post ID. Default is `null`, the current
	 *                     post ID.
	 *
	 * @return bool Whether the edit mode is active.
	 */
	public function is_edit_mode( $post_id = null ) {
		if ( null !== $this->_is_edit_mode ) {
			return $this->_is_edit_mode;
		}

		if ( empty( $post_id ) ) {
			$post_id = $this->_post_id;
		}

		if ( ! User::is_current_user_can_edit( $post_id ) ) {
			return false;
		}

		// Ajax request as Editor mode
		$actions = [
			'qazana',

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
	 * Lock post.
	 *
	 * Mark the post as currently being edited by the current user.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param int $post_id The ID of the post being edited.
	 */
	public function lock_post( $post_id ) {
		if ( ! function_exists( 'wp_set_post_lock' ) ) {
			require_once( ABSPATH . 'wp-admin/includes/post.php' );
		}

		wp_set_post_lock( $post_id );
	}

	/**
	 * Get locked user.
	 *
	 * Check what user is currently editing the post.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param int $post_id The ID of the post being edited.
	 *
	 * @return \WP_User|false User information or false if the post is not locked.
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

	/**
	 * Print panel HTML.
	 *
	 * Include the wrapper template of the editor.
	 *
	 * @since 1.0.0
	 * @deprecated 2.2.0 Use `Editor::print_editor_template` instead
	 * @access public
	 */
	public function print_panel_html() {
		_deprecated_function( __METHOD__, '2.2.0', 'Editor::print_editor_template' );

		$this->print_editor_template();
	}

	/**
	 * Print Editor Template.
	 *
	 * Include the wrapper template of the editor.
	 *
	 * @since 2.0.0
	 * @access public
	 */
	public function print_editor_template() {
		include( 'editor-templates/editor-wrapper.php' );
	}

	/**
	 * Enqueue scripts.
	 *
	 * Registers all the editor scripts and enqueues them.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function enqueue_scripts() {
		remove_action( 'wp_enqueue_scripts', [ $this, __FUNCTION__ ], 999999 );

		// Set the global data like $post, $authordata and etc
		setup_postdata( $this->_post_id );

		global $wp_styles, $wp_scripts;

		// Reset global variable
		$wp_styles = new \WP_Styles(); // WPCS: override ok.
		$wp_scripts = new \WP_Scripts(); // WPCS: override ok.

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
			'jquery-qazana-select2',
			qazana()->core_assets_url . 'lib/e-select2/js/e-select2.full' . $suffix . '.js',
			[
				'jquery',
			],
			'4.0.6-rc.1',
			true
        );
        
        wp_register_script(
			'flatpickr',
			qazana()->core_assets_url . 'lib/flatpickr/flatpickr' . $suffix . '.js',
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
			'ace-language-tools',
			'https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.5/ext-language_tools.js',
			[
				'ace',
			],
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
                'nprogress',
                'tipsy',
                'imagesloaded',
                'heartbeat',
                'jquery-qazana-select2',
                'flatpickr',
		        'qazana-dialog',
                'ace',
                'ace-language-tools',
                'jquery-easing',
                'hoverIntent',
		        'jquery-fonticonpicker',
            ],
            qazana_get_version(),
            true
        );

		/**
		 * Before editor enqueue scripts.
		 *
		 * Fires before Qazana editor scripts are enqueued.
		 *
		 * @since 1.0.0
		 */
		do_action( 'qazana/editor/before_enqueue_scripts' );

		$document = qazana()->documents->get_doc_or_auto_save( $this->_post_id );

		// Get document data *after* the scripts hook - so plugins can run compatibility before get data, but *before* enqueue the editor script - so elements can enqueue their own scripts that depended in editor script.
		$editor_data = $document->get_elements_raw_data( null, true );

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

		$post_type_object = get_post_type_object( $document->get_main_post()->post_type );
		$current_user_can_publish = current_user_can( $post_type_object->cap->publish_posts );


        $localize_settings = [
			'version' => qazana_get_version(),
			'ajaxurl' => admin_url( 'admin-ajax.php' ),
			'home_url' => home_url(),
			'nonce' => $this->create_nonce( get_post_type() ),
			'data' => $editor_data,
			// @TODO: `post_id` is bc since 2.0.0
			'post_id' => $this->_post_id,
			'document' => $document->get_config(),
			'autosave_interval' => AUTOSAVE_INTERVAL,
			'current_user_can_publish' => $current_user_can_publish,
			'controls'            => qazana()->controls_manager->get_controls_data(),
			'preview_link'        => Utils::get_preview_url( $this->_post_id ),
			'elements'            => qazana()->elements_manager->get_element_types_config(),
			'widgets'             => qazana()->widgets_manager->get_widget_types_config(),
			'default_schemes'     => qazana()->schemes_manager->get_schemes_defaults(),
			'system_schemes'      => qazana()->schemes_manager->get_system_schemes(),
			'schemes'             => [
                'items'           => qazana()->schemes_manager->get_registered_schemes_data(),
                'enabled_schemes' => Schemes_Manager::get_enabled_schemes(),
            ],
			'wp_editor'              => $this->get_wp_editor_config(),
			'settings'               => SettingsManager::get_settings_managers_config(),
			'settings_page_link'     => admin_url( 'admin.php?page=' . qazana()->slug ),
			'qazana_site'            => 'https://qazana.net/plugins/qazana',
			'help_the_content_url'   => 'https://qazana.net/plugins/qazana/the-content-missing/',
			'assets_url'             => qazana()->core_assets_url,
			'data'                   => $editor_data,
			'locked_user'            => $locked_user,
            'user' => [
				'restrictions' => qazana()->role_manager->get_user_restrictions_array(),
				'is_administrator' => current_user_can( 'manage_options' ),
			],
			'is_rtl'                 => is_rtl(),
			'locale'                 => get_locale(),
			'rich_editing_enabled'   => filter_var( get_user_meta( get_current_user_id(), 'rich_editing', true ), FILTER_VALIDATE_BOOLEAN ),
			'page_title_selector'    => $page_title_selector,
			'tinymceHasCustomConfig' => class_exists( 'Tinymce_Advanced' ),
			'inlineEditing'          => qazana()->widgets_manager->get_inline_editing_config(),
			'dynamicTags' => qazana()->dynamic_tags->get_config(),
			'i18n'                   => [
				'qazana' => __( 'Qazana', 'qazana' ),
				'delete' => __( 'Delete', 'qazana' ),
				'cancel' => __( 'Cancel', 'qazana' ),
				/* translators: %s: Element name. */
				'edit_element' => __( 'Edit %s', 'qazana' ),

				// Menu.
				'about_qazana' => __( 'About Qazana', 'qazana' ),
				'color_picker' => __( 'Color Picker', 'qazana' ),
				'qazana_settings' => __( 'Dashboard Settings', 'qazana' ),
				'global_colors' => __( 'Default Colors', 'qazana' ),
				'global_fonts' => __( 'Default Fonts', 'qazana' ),
				'global_style' => __( 'Style', 'qazana' ),
				'settings' => __( 'Settings', 'qazana' ),

				// Elements.
				'inner_section' => __( 'Columns', 'qazana' ),

				// Control Order.
				'asc' => __( 'Ascending order', 'qazana' ),
				'desc' => __( 'Descending order', 'qazana' ),

				// Clear Page.
				'clear_page' => __( 'Delete All Content', 'qazana' ),
				'dialog_confirm_clear_page' => __( 'Attention: We are going to DELETE ALL CONTENT from this page. Are you sure you want to do that?', 'qazana' ),

				// Panel Preview Mode.
				'back_to_editor' => __( 'Show Panel', 'qazana' ),
				'preview' => __( 'Hide Panel', 'qazana' ),

				// Inline Editing.
				'type_here' => __( 'Type Here', 'qazana' ),

				// Library.
				'an_error_occurred' => __( 'An error occurred', 'qazana' ),
				'category' => __( 'Category', 'qazana' ),
				'delete_template' => __( 'Delete Template', 'qazana' ),
				'delete_template_confirm' => __( 'Are you sure you want to delete this template?', 'qazana' ),
				'import_template_dialog_header' => __( 'Import Document Settings', 'qazana' ),
				'import_template_dialog_message' => __( 'Do you want to also import the document settings of the template?', 'qazana' ),
				'import_template_dialog_message_attention' => __( 'Attention: Importing may override previous settings.', 'qazana' ),
				'library' => __( 'Library', 'qazana' ),
				'no' => __( 'No', 'qazana' ),
				'page' => __( 'Page', 'qazana' ),
				/* translators: %s: Template type. */
				'save_your_template' => __( 'Save Your %s to Library', 'qazana' ),
				'save_your_template_description' => __( 'Your designs will be available for export and reuse on any page or website', 'qazana' ),
				'section' => __( 'Section', 'qazana' ),
				'templates_empty_message' => __( 'This is where your templates should be. Design it. Save it. Reuse it.', 'qazana' ),
				'templates_empty_title' => __( 'Haven’t Saved Templates Yet?', 'qazana' ),
				'templates_no_favorites_message' => __( 'You can mark any pre-designed template as a favorite.', 'qazana' ),
				'templates_no_favorites_title' => __( 'No Favorite Templates', 'qazana' ),
				'templates_no_results_message' => __( 'Please make sure your search is spelled correctly or try a different words.', 'qazana' ),
				'templates_no_results_title' => __( 'No Results Found', 'qazana' ),
				'templates_request_error' => __( 'The following error(s) occurred while processing the request:', 'qazana' ),
				'yes' => __( 'Yes', 'qazana' ),

				// Incompatible Device.
				'device_incompatible_header' => __( 'Your browser isn\'t compatible', 'qazana' ),
				'device_incompatible_message' => __( 'Your browser isn\'t compatible with all of Qazana\'s editing features. We recommend you switch to another browser like Chrome or Firefox.', 'qazana' ),
				'proceed_anyway' => __( 'Proceed Anyway', 'qazana' ),

				// Preview not loaded.
				'learn_more' => __( 'Learn More', 'qazana' ),
				'preview_el_not_found_header' => __( 'Sorry, the content area was not found in your page.', 'qazana' ),
				'preview_el_not_found_message' => __( 'You must call \'the_content\' function in the current template, in order for Qazana to work on this page.', 'qazana' ),
				'preview_not_loading_header' => __( 'The preview could not be loaded', 'qazana' ),
				'preview_not_loading_message' => __( 'We\'re sorry, but something went wrong. Click on \'Learn more\' and follow each of the steps to quickly solve it.', 'qazana' ),

				// Gallery.
				'delete_gallery' => __( 'Reset Gallery', 'qazana' ),
				'dialog_confirm_gallery_delete' => __( 'Are you sure you want to reset this gallery?', 'qazana' ),
				/* translators: %s: The number of images. */
				'gallery_images_selected' => __( '%s Images Selected', 'qazana' ),
				'gallery_no_images_selected' => __( 'No Images Selected', 'qazana' ),
				'insert_media' => __( 'Insert Media', 'qazana' ),

				// Take Over.
				/* translators: %s: User name. */
				'dialog_user_taken_over' => __( '%s has taken over and is currently editing. Do you want to take over this page editing?', 'qazana' ),
				'go_back' => __( 'Go Back', 'qazana' ),
				'take_over' => __( 'Take Over', 'qazana' ),

				// Revisions.
				/* translators: %s: Element type. */
				'delete_element' => __( 'Delete %s', 'qazana' ),
				/* translators: %s: Template type. */
				'dialog_confirm_delete' => __( 'Are you sure you want to remove this %s?', 'qazana' ),

				// Saver.
				'before_unload_alert' => __( 'Please note: All unsaved changes will be lost.', 'qazana' ),
				'published' => __( 'Published', 'qazana' ),
				'publish' => __( 'Publish', 'qazana' ),
				'save' => __( 'Save', 'qazana' ),
				'saved' => __( 'Saved', 'qazana' ),
				'update' => __( 'Update', 'qazana' ),
				'submit' => __( 'Submit', 'qazana' ),
				'working_on_draft_notification' => __( 'This is just a draft. Play around and when you\'re done - click update.', 'qazana' ),
				'keep_editing' => __( 'Keep Editing', 'qazana' ),
				'have_a_look' => __( 'Have a look', 'qazana' ),
				'view_all_revisions' => __( 'View All Revisions', 'qazana' ),
				'dismiss' => __( 'Dismiss', 'qazana' ),
				'saving_disabled' => __( 'Saving has been disabled until you’re reconnected.', 'qazana' ),

				// Ajax
				'server_error' => __( 'Server Error', 'qazana' ),
				'server_connection_lost' => __( 'Connection Lost', 'qazana' ),
				'unknown_error' => __( 'Unknown Error', 'qazana' ),

				// Context Menu
				'duplicate' => __( 'Duplicate', 'qazana' ),
				'copy' => __( 'Copy', 'qazana' ),
				'paste' => __( 'Paste', 'qazana' ),
				'copy_style' => __( 'Copy Style', 'qazana' ),
				'paste_style' => __( 'Paste Style', 'qazana' ),
				'reset_style' => __( 'Reset Style', 'qazana' ),
				'save_as_global' => __( 'Save as a Global', 'qazana' ),
				'save_as_block' => __( 'Save as Template', 'qazana' ),
				'new_column' => __( 'Add New Column', 'qazana' ),
				'copy_all_content' => __( 'Copy All Content', 'qazana' ),
				'delete_all_content' => __( 'Delete All Content', 'qazana' ),
                'navigator' => __( 'Navigator', 'qazana' ),  

				// Right Click Introduction
				'meet_right_click_header' => __( 'Meet Right Click', 'qazana' ),
				'meet_right_click_message' => __( 'Now you can access all editing actions using right click.', 'qazana' ),
				'got_it' => __( 'Got It', 'qazana' ),

				// TODO: Remove.
				'autosave' => __( 'Autosave', 'qazana' ),
				'qazana_docs' => __( 'Documentation', 'qazana' ),
				'reload_page' => __( 'Reload Page', 'qazana' ),
				'session_expired_header' => __( 'Timeout', 'qazana' ),
				'session_expired_message' => __( 'Your session has expired. Please reload the page to continue editing.', 'qazana' ),
				'soon' => __( 'Soon', 'qazana' ),
				'unknown_value' => __( 'Unknown Value', 'qazana' ),
			],
		];

		/**
		 * Localize editor settings.
		 *
		 * Filters the editor localized settings.
		 *
		 * @since 1.0.0
		 *
		 * @param array $localized_settings Localized settings.
		 * @param int   $post_id            The ID of the current post being edited.
		 */
	    	$localize_settings = apply_filters( 'qazana/editor/localize_settings', $localize_settings, $this->_post_id );

	    $this->add_localize_settings( $localize_settings );

	    // Very important that this be loaded before 'qazana-editor' - for use by extensions
        wp_localize_script( 'backbone-marionette', 'QazanaConfig', $this->get_localize_settings() );

        qazana()->controls_manager->enqueue_control_scripts();

		/**
		 * After editor enqueue scripts.
		 *
		 * Fires after Qazana editor scripts are enqueued.
		 *
		 * @since 1.0.0
		 */
		do_action( 'qazana/editor/after_enqueue_scripts' );
	}

	/**
	 * Enqueue styles.
	 *
	 * Registers all the editor styles and enqueues them.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function enqueue_styles() {
		/**
		 * Before editor enqueue styles.
		 *
		 * Fires before Qazana editor styles are enqueued.
		 *
		 * @since 1.0.0
		 */
		do_action( 'qazana/editor/before_enqueue_styles' );

		$suffix = Utils::is_script_debug() ? '' : '.min';

		$direction_suffix = is_rtl() ? '-rtl' : '';
     
        wp_register_style(
			'qazana-select2',
			qazana()->core_assets_url . 'lib/e-select2/css/e-select2' . $suffix . '.css',
			[],
			'4.0.6-rc.1'
        );
        
        wp_register_style(
			'flatpickr',
			qazana()->core_assets_url . 'lib/flatpickr/flatpickr' . $suffix . '.css',
			[],
			'1.12.0'
		);

        wp_register_style(
            'qazana-icons',
            qazana()->core_assets_url . 'lib/eicons/css/icons' . $suffix . '.css',
            [],
            qazana_get_version()
        );

        wp_register_style(
			'font-awesome',
			qazana()->core_assets_url . 'lib/font-awesome/css/font-awesome' . $suffix . '.css',
			[],
			'4.7.0'
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
                'qazana-select2',
                'qazana-icons',
                'wp-auth-check',
                'jquery-fonticonpicker',
                'jquery-fonticonpicker-grey',
                'font-awesome',
                'flatpickr',
            ],
            qazana_get_version()
        );

		wp_enqueue_style( 'qazana-editor' );

		if ( Breakpoints::has_custom_breakpoints() ) {
			$breakpoints = Breakpoints::get_breakpoints();

			wp_add_inline_style( 'qazana-editor', '.qazana-device-tablet #qazana-preview-responsive-wrapper { width: ' . $breakpoints['md'] . 'px; }' );
		}

		/**
		 * After editor enqueue styles.
		 *
		 * Fires after Qazana editor styles are enqueued.
		 *
		 * @since 1.0.0
		 */
		do_action( 'qazana/editor/after_enqueue_styles' );
	}

	/**
	 * Get WordPress editor config.
	 *
	 * Config the default WordPress editor with custom settings for Qazana use.
	 *
	 * @since 1.0.0
	 * @access private
	 */
	private function get_wp_editor_config() {
		// Remove all TinyMCE plugins.
		remove_all_filters( 'mce_buttons', 10 );
		remove_all_filters( 'mce_external_plugins', 10 );

		if ( ! class_exists( '\_WP_Editors', false ) ) {
			require( ABSPATH . WPINC . '/class-wp-editor.php' );
		}

		// WordPress 4.8 and higher
		if ( method_exists( '\_WP_Editors', 'print_tinymce_scripts' ) ) {
			\_WP_Editors::print_default_editor_scripts();
			\_WP_Editors::print_tinymce_scripts();
		}
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

		$config = ob_get_clean();

		// Don't call \_WP_Editors methods again
		remove_action( 'admin_print_footer_scripts', [ '_WP_Editors', 'editor_js' ], 50 );
		remove_action( 'admin_print_footer_scripts', [ '_WP_Editors', 'print_default_editor_scripts' ], 45 );

		\_WP_Editors::editor_js();

		return $config;
	}

	/**
	 * Editor head trigger.
	 *
	 * Fires the 'qazana/editor/wp_head' action in the head tag in Qazana
	 * editor.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function editor_head_trigger() {
		/**
		 * Qazana editor head.
		 *
		 * Fires on Qazana editor head tag.
		 *
		 * Used to prints scripts or any other data in the head tag.
		 *
		 * @since 1.0.0
		 */
		do_action( 'qazana/editor/wp_head' );
	}

	/**
	 * Add editor template.
	 *
	 * Registers new editor templates.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param string $template Can be either a link to template file or template
	 *                         HTML content.
	 * @param string $type     Optional. Whether to handle the template as path
	 *                         or text. Default is `path`.
	 */
	public function add_editor_template( $template, $type = 'path' ) {
		if ( 'path' === $type ) {
			ob_start();

			include $template;

			$template = ob_get_clean();
		}

		$this->_editor_templates[] = $template;
	}

	/**
	 * WP footer.
	 *
	 * Prints Qazana editor with all the editor templates, and render controls,
	 * widgets and content elements.
	 *
	 * Fired by `wp_footer` action.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function wp_footer() {
		$plugin = qazana();

		$plugin->controls_manager->render_controls();
		$plugin->widgets_manager->render_widgets_content();
		$plugin->elements_manager->render_elements_content();

		$plugin->schemes_manager->print_schemes_templates();

		$plugin->dynamic_tags->print_templates();

		$this->init_editor_templates();

		foreach ( $this->_editor_templates as $editor_template ) {
			echo $editor_template;
		}

		/**
		 * Qazana editor footer.
		 *
		 * Fires on Qazana editor before closing the body tag.
		 *
		 * Used to prints scripts or any other HTML before closing the body tag.
		 *
		 * @since 1.0.0
		 */
		do_action( 'qazana/editor/footer' );
	}

	/**
	 * Set edit mode.
	 *
	 * Used to update the edit mode.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param bool $edit_mode Whether the edit mode is active.
	 */
	public function set_edit_mode( $edit_mode ) {
		$this->_is_edit_mode = $edit_mode;
	}

	/**
	 * Editor constructor.
	 *
	 * Initializing Qazana editor and redirect from old URL structure of
	 * Qazana editor.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function __construct() {
		add_action( 'admin_action_qazana', [ $this, 'init' ] );
		add_action( 'template_redirect', [ $this, 'redirect_to_new_url' ] );
		add_filter( 'wp_link_query', [ $this, 'filter_wp_link_query' ] );
	}

	public function filter_wp_link_query( $results ) {
		if ( isset( $_POST['editor'] ) && 'qazana' === $_POST['editor'] ) {
			$post_type_object = get_post_type_object( 'post' );
			$post_label = $post_type_object->labels->singular_name;

			foreach ( $results as & $result ) {
				if ( 'post' === get_post_type( $result['ID'] ) ) {
					$result['info'] = $post_label;
				}
			}
		}

		return $results;
	}

	/**
	 * Create nonce.
	 *
	 * If the user has edit capabilities, it creates a cryptographic token to
	 * give him access to Qazana editor.
	 *
	 * @since 1.8.1
	 * @since 1.8.7 The `$post_type` parameter was introduces.
	 * @access public
	 *
	 * @param string $post_type The post type to check capabilities.
	 *
	 * @return null|string The nonce token, or `null` if the user has no edit
	 *                     capabilities.
	 */
	public function create_nonce( $post_type ) {
		$post_type_object = get_post_type_object( $post_type );
		$capability = $post_type_object->cap->{self::EDITING_CAPABILITY};

		if ( ! current_user_can( $capability ) ) {
			return null;
		}

		return wp_create_nonce( self::EDITING_NONCE_KEY );
	}

	/**
	 * Verify nonce.
	 *
	 * The user is given an amount of time to use the token, so therefore, since
	 * the user ID and `$action` remain the same, the independent variable is
	 * the time.
	 *
	 * @since 1.8.1
	 * @access public
	 *
	 * @param string $nonce Nonce that was used in the form to verify.
	 *
	 * @return false|int If the nonce is invalid it returns `false`. If the
	 *                   nonce is valid and generated between 0-12 hours ago it
	 *                   returns `1`. If the nonce is valid and generated
	 *                   between 12-24 hours ago it returns `2`.
	 */
	public function verify_nonce( $nonce ) {
		return wp_verify_nonce( $nonce, self::EDITING_NONCE_KEY );
	}

	/**
	 * Verify request nonce.
	 *
	 * Whether the request nonce verified or not.
	 *
	 * @since 1.8.1
	 * @access public
	 *
	 * @return bool True if request nonce verified, False otherwise.
	 */
	public function verify_request_nonce() {
		return ! empty( $_REQUEST['_nonce'] ) && $this->verify_nonce( $_REQUEST['_nonce'] );
	}

	/**
	 * Verify ajax nonce.
	 *
	 * Verify request nonce and send a JSON request, if not verified returns an
	 * error.
	 *
	 * @since 1.9.0
	 * @access public
	 */
	public function verify_ajax_nonce() {
		if ( ! $this->verify_request_nonce() ) {
			wp_send_json_error( new \WP_Error( 'token_expired', 'Nonce token expired.' ) );
		}
	}

	/**
	 * Init editor templates.
	 *
	 * Initialize default qazana templates used in the editor panel.
	 *
	 * @since 1.7.0
	 * @access private
	 */
	private function init_editor_templates() {
		$template_names = [
			'global',
			'panel',
			'panel-elements',
			'repeater',
            'templates',
            'navigator',
		];

		foreach ( $template_names as $template_name ) {
			$this->add_editor_template( __DIR__ . "/editor-templates/$template_name.php" );
		}
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

}
