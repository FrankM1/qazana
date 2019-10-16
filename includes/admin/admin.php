<?php

/**
 * Main Qazana Admin Class.
 */
namespace Qazana\Admin;

use Qazana\System\Info;
use Qazana\Utils;
use Qazana\Admin\Tracker;
use Qazana\Admin\System\Info\Classes\Debug;
use Qazana\WordPress_Widgets_Manager;
use Qazana\Heartbeat;

/**
 * Loads Qazana plugin admin area.
 *
 * @since 1.0.0
 */
class Run {

    /** Directory *************************************************************/

    /**
     * @var string Path to the Qazana admin directory
     */
    public $admin_dir = '';

    /** URLs ******************************************************************/

    /**
     * @var string URL to the Qazana admin directory
     */
    public $admin_url = '';

    /**
     * @var string URL to the Qazana images directory
     */
    public $images_url = '';

    /**
     * @var string URL to the Qazana admin styles directory
     */
    public $styles_url = '';

    /**
     * @var string URL to the Qazana admin css directory
     */
    public $css_url = '';

    /**
     * @var string URL to the Qazana admin js directory
     */
    public $js_url = '';

    /** Capability ************************************************************/

    /**
     * @var bool Minimum capability to access Tools and Settings
     */
    public $minimum_capability = 'manage_options'; // 'keep_gate'; //patch till user management is fully functional

    /** Separator *************************************************************/

    /**
     * @var bool Whether or not to add an extra top level menu separator
     */
    public $show_separator = false;

    /** Admin Settings ************************************************************/

    /**
     * @var string Settings page slug
     */
    private $general_settings_key = '';

    /**
     * @var array Settings tabs
     */
    private $plugin_settings_tabs = array();

    /** Functions *************************************************************/

    /**
     * The main Qazana admin loader.
     *
     * @since 1.0.0
     *
     * @uses Qazana_Admin::setup_globals() Setup the globals needed
     * @uses Qazana_Admin::includes() Include the required files
     * @uses Qazana_Admin::setup_actions() Setup the hooks and actions
     */
    public function __construct() {
        $this->setup_globals();
        $this->includes();
        $this->setup_actions();
    }

    /**
     * Admin globals.
     *
     * @since 1.0.0
     */
    private function setup_globals() {
        $qazana = qazana();

        $this->admin_dir    = trailingslashit( $qazana->includes_dir . 'admin' ); // Admin path
        $this->admin_url    = trailingslashit( $qazana->core_assets_url ); // Admin url
        $this->images_url   = trailingslashit( $this->admin_url . 'images' ); // Admin images URL
        $this->styles_url   = trailingslashit( $this->admin_url . 'styles' ); // Admin styles URL
        $this->css_url      = trailingslashit( $this->admin_url . 'css' ); // Admin css URL
        $this->js_url       = trailingslashit( $this->admin_url . 'js' ); // Admin js URL

    }

    /**
     * Include required files.
     *
     * @since 1.0.0
     */
    private function includes() {

        if ( Utils::is_ajax() ) {
            require_once( qazana()->includes_dir . 'managers/image.php' );
        }
    }

    /**
     * Setup the admin hooks, actions and filters.
     *
     * @since 1.0.0
     *
     * @uses add_action() To add various actions
     * @uses add_filter() To add various filters
     */
    private function setup_actions() {

        // Bail to prevent interfering with the deactivation process
        if ( qazana_is_deactivation() ) {
            return;
        }

        /* General Actions ***************************************************/

        add_action( 'qazana_admin_menu',              array( $this, 'admin_menus' ) ); // Add menu item to settings menu
        add_action( 'qazana_admin_notices',           array( $this, 'activation_notice' ) ); // Add notice if not using a Qazana theme
        add_action( 'qazana_activation',              array( $this, 'new_install' ) ); // Add menu item to settings menu

        add_action( 'admin_enqueue_scripts',                    array( $this, 'enqueue_styles' ) ); // Add enqueued CSS
        add_action( 'admin_enqueue_scripts',                    array( $this, 'enqueue_scripts' ) ); // Add enqueued JS

        add_action( 'wp_dashboard_setup',                       array( $this, 'dashboard_widget_right_now' ) ); // Qazana 'Right now' Dashboard widget
        add_action( 'admin_bar_menu',                           array( $this, 'admin_bar_about_link' ), 15 ); // Add a link to Qazana about page to the admin bar

        add_action( 'admin_notices', [ $this, 'admin_notices' ] );
        add_filter( 'admin_footer_text', [ $this, 'admin_footer_text' ] );

        // Ajax
        add_action( 'wp_ajax_qazana_deactivate_feedback', [ $this, 'ajax_qazana_deactivate_feedback' ] );

        /* Filters ***********************************************************/

        // Modify Qazana's admin links
        add_filter( 'plugin_action_links_' . qazana()->basename, array( $this, 'modify_plugin_action_links' ) );

        /* Network Admin *****************************************************/

        // Add menu item to settings menu
        add_action( 'network_admin_menu',  array( $this, 'network_admin_menus' ) );

        /* Dependencies ******************************************************/
       add_action( 'qazana_admin_loaded',  array( $this, 'init_classes' ) );

        // Allow plugins to modify these actions
        do_action_ref_array( 'qazana_admin_loaded', array( &$this ) );
    }

    /**
     * Load classes
     *
     * @since 1.0.0
     *
     * @return [type] [description]
     */
    public function init_classes() {
        $this->editor_admin   = new Post\Editor();

        $this->settings_panel = new Settings\Panel();
        $this->settings_tools = new Settings\Tools();
        $this->settings_extensions = new Settings\Extensions();

        $this->admin_api      = new Api();
        $this->admin_tracker  = new Tracker();
        $this->system_info    = new System\Info\Main();
        $this->debug = new Debug();
        $this->heartbeat = new Heartbeat();
        $this->wordpress_widgets_manager = new WordPress_Widgets_Manager();

        Upgrades::add_actions();

        if ( Utils::is_ajax() ) {
            new \Qazana\Images_Manager();
        }
    }

    /**
     * Add the admin menus.
     *
     * @since 1.0.0
     *
     * @uses add_management_page() To add the Recount page in Tools section
     * @uses add_options_page() To add the Qazana settings page in Settings
     *                           section
     */
    public function admin_menus() {

        // Are settings enabled?
        add_menu_page(
            __( 'Qazana',  'qazana' ),
            __( 'Qazana',  'qazana' ),
            $this->minimum_capability,
            'qazana',
            array( &$this, 'plugin_options_page' )
        );

        // These are later removed in admin_head
        // About
        add_dashboard_page(
            __( 'Welcome to Qazana',  'qazana' ),
            __( 'Welcome to Qazana',  'qazana' ),
            $this->minimum_capability,
            'qazana-about',
            array( $this, 'about_screen' )
        );

        // Bail if plugin is not network activated
        if ( ! is_plugin_active_for_network( qazana()->basename ) ) {
            return;
        }

        add_submenu_page(
            'index.php',
            __( 'Update Qazana', 'qazana' ),
            __( 'Update Qazana', 'qazana' ),
            'manage_network',
            'qazana-update',
            array( $this, 'update_screen' )
        );
    }

    /**
     * Add the network admin menus.
     *
     * @since 1.0.0
     *
     * @uses add_submenu_page() To add the Update Qazana page in Updates
     */
    public function network_admin_menus() {

        // Bail if plugin is not network activated
        if ( ! is_plugin_active_for_network( qazana()->basename ) ) {
            return;
        }

        add_submenu_page( 'upgrade.php', __( 'Update Qazana', 'qazana' ), __( 'Update Qazana', 'qazana' ), 'manage_network', 'qazana-update', array( $this, 'network_update_screen' ) );
    }

    /**
     * If this is a new installation, create some initial qazana content.
     *
     * @since 1.0.0
     *
     * @return type
     */
    public static function new_install() {

        if ( ! qazana_is_install() ) {
            return;
        }

        qazana_create_initial_content();
    }

    /**
     * Admin area activation notice.
     *
     * Shows a nag message in admin area about the theme not supporting Qazana
     *
     * @since 1.0.0
     *
     * @uses current_user_can() To check notice should be displayed.
     */
    public function activation_notice() { }

    /**
     * Add Settings link to plugins area.
     *
     * @since 1.0.0
     *
     * @param array  $links Links array in which we would prepend our link
     * @param string $file  Current plugin basename
     *
     * @return array Processed links
     */
    public static function modify_plugin_action_links( $links  ) {

        // New links to merge into existing links
        $new_links = array();

        // Settings page link
        $new_links['settings'] = '<a href="'. esc_url( add_query_arg( array( 'page' => 'qazana' ), admin_url( 'options-general.php' ) ) ).'">'.esc_html__( 'Settings', 'qazana' ).'</a>';

        // About page link
        $new_links['about'] = '<a href="'. esc_url( add_query_arg( array( 'page' => 'qazana-about' ), admin_url( 'index.php' ) ) ).'">'.esc_html__( 'About',    'qazana' ).'</a>';

        // Add a few links to the existing links array
        return array_merge( $links, $new_links );
    }

    /**
     * Add the 'Right now in Qazana' dashboard widget.
     *
     * @since 1.0.0
     *
     * @uses wp_add_dashboard_widget() To add the dashboard widget
     */
    public static function dashboard_widget_right_now() {
        //wp_add_dashboard_widget( 'qazana-dashboard-right-now', __( 'Right Now in Qazana', 'qazana' ), 'qazana_dashboard_widget_right_now' );
    }

    /**
     * Add a link to Qazana about page to the admin bar.
     *
     * @since 1.0.0
     *
     * @param WP_Admin_Bar $wp_admin_bar
     */
    public function admin_bar_about_link( $wp_admin_bar ) {

        if ( is_user_logged_in() ) {

            $wp_admin_bar->add_menu( array(
                'parent' => 'wp-logo',
                'id' => 'qazana-about',
                'title' => esc_html__( 'About Qazana', 'qazana' ),
                'href' => add_query_arg( array( 'page' => 'qazana-about' ), admin_url( 'index.php' ) ),
            ) );

        }
    }

    /**
     * Enqueue any admin scripts we might need.
     *
     * @since 1.0.0
     */
    public function enqueue_scripts() {
        // Get the version to use for JS
        $version = qazana_get_version();

        if ( in_array( get_current_screen()->id, [ 'plugins', 'plugins-network' ] ) ) {
            add_action( 'admin_footer', [ $this, 'print_deactivate_feedback_dialog' ] );
            $this->enqueue_feedback_dialog_scripts();
        }

        $suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

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
			'qazana-dialog',
			qazana()->core_assets_url . 'lib/dialog/dialog' . $suffix . '.js',
			[
				'jquery-ui-position',
			],
			'4.5.0',
			true
		);

		wp_register_script(
			'qazana-admin-app',
			qazana()->core_assets_url . 'js/admin' . $suffix . '.js',
			[
				'jquery', 'backbone-marionette', 'qazana-dialog',
			],
			qazana_get_version(),
			true
		);

        wp_localize_script(
			'qazana-admin-app',
			'QazanaAdminConfig',
			[
				'home_url' => home_url(),
				'i18n' => [
					'rollback_confirm' => __( 'Are you sure you want to reinstall previous version?', 'qazana' ),
					'rollback_to_previous_version' => __( 'Rollback to Previous Version', 'qazana' ),
					'yes' => __( 'Yes', 'qazana' ),
					'cancel' => __( 'Cancel', 'qazana' ),
					'new_template' => __( 'New Template', 'qazana' ),
				],
			]
        );

        wp_enqueue_script( 'qazana-admin-app' );
    }

    /**
     * Enqueue any admin scripts we might need.
     *
     * @since 1.0.0
     */
    public function enqueue_styles() {
        $suffix = Utils::is_script_debug() ? '' : '.min';

        wp_register_style(
            'qazana-icons',
            qazana()->core_assets_url . 'lib/eicons/css/icons' . $suffix . '.css',
            [],
            qazana_get_version()
        );

        wp_enqueue_style(
            'qazana-admin-app',
            $this->css_url . 'admin'. $suffix .'.css',
            array( 'dashicons', 'qazana-icons' ),
            qazana_get_version()
        );

    }

    /** About *****************************************************************/

    /**
     * Output the about screen.
     *
     * @since 1.0.0
     */
    public function about_screen() {

        list( $display_version ) = explode( '-', qazana_get_version() ); ?>

        <div class="wrap about-wrap">
            <h1><?php printf( esc_html__( 'Welcome to Qazana %s', 'qazana' ), $display_version ); ?></h1>
            <div class="about-text"><?php printf( esc_html__( 'Thank you for updating.', 'qazana' ), $display_version ); ?></div>

            <h2 class="nav-tab-wrapper">
                <a class="nav-tab nav-tab-active" href="<?php echo esc_url( admin_url( add_query_arg( array( 'page' => 'qazana-about' ), 'index.php' ) ) ); ?>">
                    <?php esc_html_e( 'What&#8217;s New', 'qazana' ); ?>
                </a><a class="nav-tab" href="<?php echo esc_url( admin_url( add_query_arg( array( 'page' => 'qazana-credits' ), 'index.php' ) ) ); ?>">
                    <?php esc_html_e( 'Credits', 'qazana' ); ?>
                </a>
            </h2>

            <div class="return-to-dashboard">
                <a href="<?php echo esc_url( admin_url( add_query_arg( array( 'page' => 'qazana' ), 'options-general.php' ) ) ); ?>"><?php esc_html_e( 'Go to qazana Settings', 'qazana' ); ?></a>
            </div>

        </div>

        <?php
    }

    /** Updaters **************************************************************/

    /**
     * Update all Qazana Qazana across all sites.
     *
     * @since 1.0.0
     *
     * @global WPDB $wpdb
     *
     * @uses get_blog_option()
     * @uses wp_remote_get()
     */
    public static function update_screen() {
    }

    /**
     * Update all Qazana Qazana across all sites.
     *
     * @since 1.0.0
     *
     * @global WPDB $wpdb
     *
     * @uses get_blog_option()
     * @uses wp_remote_get()
     */
    public static function network_update_screen() {
    }

    /** Admin Settings UI **************************************************************/

    /**
	 * @since 1.3.0
	 * @access public
	*/
	public function plugin_options_page() {
        $this->settings_panel->display_settings_page();
	}

    public function admin_notices() {
        $upgrade_notice = $this->admin_api->get_upgrade_notice();
        if ( empty( $upgrade_notice ) )
            return;

        if ( ! current_user_can( 'update_plugins' ) )
            return;

        if ( ! in_array( get_current_screen()->id, [ 'toplevel_page_qazana', 'edit-qazana_library', 'qazana_page_qazana-system-info', 'dashboard' ] ) ) {
            return;
        }

        // Check if have any upgrades
        $update_plugins = get_site_transient( 'update_plugins' );
        if ( empty( $update_plugins ) || empty( $update_plugins->response[ qazana()->basename ] ) || empty( $update_plugins->response[ qazana()->basename ]->package ) ) {
            return;
        }
        $product = $update_plugins->response[ qazana()->basename ];

        // Check if have upgrade notices to show
        if ( version_compare( qazana_get_version(), $upgrade_notice['version'], '>=' ) )
            return;

        $notice_id = 'upgrade_notice_' . $upgrade_notice['version'];
        if ( User::is_user_notice_viewed( $notice_id ) )
            return;

        $details_url = self_admin_url( 'plugin-install.php?tab=plugin-information&plugin=' . $product->slug . '&section=changelog&TB_iframe=true&width=600&height=800' );
        $upgrade_url = wp_nonce_url( self_admin_url( 'update.php?action=upgrade-plugin&plugin=' . qazana()->basename ), 'upgrade-plugin_' . qazana()->basename );
        ?>
        <div class="notice updated is-dismissible qazana-message qazana-message-dismissed" data-notice_id="<?php echo esc_attr( $notice_id ); ?>">
            <div class="qazana-message-inner">
                <div class="qazana-message-icon">
                    <i class="eicon-qazana-square"></i>
                </div>
                <div class="qazana-message-content">
                    <h3><?php _e( 'New in Qazana', 'qazana' ); ?></h3>
                    <p><?php
                        printf(
                            /* translators: 1: details URL, 2: accessibility text, 3: version number, 4: update URL, 5: accessibility text */
                            __( 'There is a new version of Qazana Page Qazana available. <a href="%1$s" class="thickbox open-plugin-details-modal" aria-label="%2$s">View version %3$s details</a> or <a href="%4$s" class="update-link" aria-label="%5$s">update now</a>.', 'qazana' ),
                            esc_url( $details_url ),
                            esc_attr(
                                sprintf(
                                    /* translators: %s: version number */
                                    __( 'View Qazana version %s details', 'qazana' ),
                                    $product->new_version
                                )
                            ),
                            $product->new_version,
                            esc_url( $upgrade_url ),
                            esc_attr( __( 'Update Now', 'qazana' ) )
                        );
                        ?></p>
                </div>
                <div class="qazana-update-now">
                    <a class="button qazana-button" href="<?php echo $upgrade_url; ?>"><i class="dashicons dashicons-update"></i><?php _e( 'Update Now', 'qazana' ); ?></a>
                </div>
            </div>
        </div>
        <?php
    }

    public function admin_footer_text( $footer_text ) {
        $current_screen = get_current_screen();
        $is_qazana_screen = ( $current_screen && false !== strpos( $current_screen->base, 'qazana' ) );

        if ( $is_qazana_screen ) {
            $footer_text = sprintf(
                /* translators: %s: link to plugin review */
                __( 'Enjoyed <strong>Qazana</strong>? Please leave us a %s rating. We really appreciate your support!', 'qazana' ),
                '<a href="https://wordpress.org/support/view/plugin-reviews/qazana?filter=5#postform" target="_blank">&#9733;&#9733;&#9733;&#9733;&#9733;</a>'
            );
        }

        return $footer_text;
    }

    public function enqueue_feedback_dialog_scripts() {
        $suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

        wp_register_script(
            'qazana-dialog',
            qazana()->core_assets_url . 'lib/dialog/dialog' . $suffix . '.js',
            [
                'jquery-ui-position',
            ],
			'4.4.1',
            true
        );

        wp_register_script(
            'qazana-admin-feedback',
            qazana()->core_assets_url . 'js/admin-feedback' . $suffix . '.js',
            [
                'underscore',
                'qazana-dialog',
            ],
            qazana_get_version(),
            true
        );

        wp_enqueue_script( 'qazana-admin-feedback' );

        wp_localize_script(
            'qazana-admin-feedback',
            'QazanaAdminFeedbackArgs',
            [
                'is_tracker_opted_in' => Tracker::is_allow_track(),
                'i18n' => [
                    'submit_n_deactivate' => __( 'Submit & Deactivate', 'qazana' ),
                    'skip_n_deactivate' => __( 'Skip & Deactivate', 'qazana' ),
                ],
            ]
        );
    }

    public function print_deactivate_feedback_dialog() {
        $deactivate_reasons = [
            'no_longer_needed' => [
                'title' => __( 'I no longer need the plugin', 'qazana' ),
                'input_placeholder' => '',
            ],
            'found_a_better_plugin' => [
                'title' => __( 'I found a better plugin', 'qazana' ),
                'input_placeholder' => __( 'Please share which plugin', 'qazana' ),
            ],
            'couldnt_get_the_plugin_to_work' => [
                'title' => __( 'I couldn\'t get the plugin to work', 'qazana' ),
                'input_placeholder' => '',
            ],
            'temporary_deactivation' => [
                'title' => __( 'It\'s a temporary deactivation', 'qazana' ),
                'input_placeholder' => '',
            ],
            'other' => [
                'title' => __( 'Other', 'qazana' ),
                'input_placeholder' => __( 'Please share the reason', 'qazana' ),
            ],
        ];

        ?>
        <div id="qazana-deactivate-feedback-dialog-wrapper">
            <div id="qazana-deactivate-feedback-dialog-header">
                <i class="eicon-qazana-square"></i>
                <span id="qazana-deactivate-feedback-dialog-header-title"><?php _e( 'Quick Feedback', 'qazana' ); ?></span>
            </div>
            <form id="qazana-deactivate-feedback-dialog-form" method="post">
                <?php
                wp_nonce_field( '_qazana_deactivate_feedback_nonce' );
                ?>
                <input type="hidden" name="action" value="qazana_deactivate_feedback" />

                <div id="qazana-deactivate-feedback-dialog-form-caption"><?php _e( 'If you have a moment, please share why you are deactivating Qazana:', 'qazana' ); ?></div>
                <div id="qazana-deactivate-feedback-dialog-form-body">
                    <?php foreach ( $deactivate_reasons as $reason_key => $reason ) : ?>
                        <div class="qazana-deactivate-feedback-dialog-input-wrapper">
                            <input id="qazana-deactivate-feedback-<?php echo esc_attr( $reason_key ); ?>" class="qazana-deactivate-feedback-dialog-input" type="radio" name="reason_key" value="<?php echo esc_attr( $reason_key ); ?>" />
                            <label for="qazana-deactivate-feedback-<?php echo esc_attr( $reason_key ); ?>" class="qazana-deactivate-feedback-dialog-label"><?php echo $reason['title']; ?></label>
                            <?php if ( ! empty( $reason['input_placeholder'] ) ) : ?>
                                <input class="qazana-feedback-text" type="text" name="reason_<?php echo esc_attr( $reason_key ); ?>" placeholder="<?php echo esc_attr( $reason['input_placeholder'] ); ?>" />
                            <?php endif; ?>
                        </div>
                    <?php endforeach; ?>
                </div>
            </form>
        </div>
        <?php
    }

    public function ajax_qazana_deactivate_feedback() {
        if ( ! isset( $_POST['_wpnonce'] ) || ! wp_verify_nonce( $_POST['_wpnonce'], '_qazana_deactivate_feedback_nonce' ) ) {
            wp_send_json_error();
        }

        $reason_text = $reason_key = '';

        if ( ! empty( $_POST['reason_key'] ) )
            $reason_key = $_POST['reason_key'];

        if ( ! empty( $_POST[ "reason_{$reason_key}" ] ) )
            $reason_text = $_POST[ "reason_{$reason_key}" ];

        $this->admin_api->send_feedback( $reason_key, $reason_text );

        wp_send_json_success();
    }

}
