<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Settings_Panel {

    public static function get_url() {
        return admin_url( 'admin.php?page=' . qazana()->slug );
    }

    public function register_settings_fields() {

        $controls_class_name = __NAMESPACE__ . '\Settings_Controls';
        $validations_class_name = __NAMESPACE__ . '\Settings_Validations';

        do_action( 'qazana/admin/settings/before', qazana()->slug );

        // Register the main section
        $main_section = 'qazana_general_section';

        add_settings_section(
            $main_section,
            __( 'General Settings', 'qazana' ),
            '__return_empty_string', // No need intro text for this section right now
            qazana()->slug
        );

        $field_id = 'qazana_settings_update_time';
        add_settings_field(
            $field_id,
            __( 'Post Types', 'qazana' ),
            [ $controls_class_name, 'render' ],
            qazana()->slug,
            $main_section,
            [
                'id' => $field_id,
                'type' => 'hidden',
                'sanitize_callback' => 'time',
            ]
        );

        $field_id = 'qazana_cpt_support';
        add_settings_field(
            $field_id,
            __( 'Post Types', 'qazana' ),
            [ $controls_class_name, 'render' ],
            qazana()->slug,
            $main_section,
            [
                'id' => $field_id,
                'type' => 'checkbox_list_cpt',
                'std' => [ 'page', 'post' ],
                'exclude' => [ 'attachment', 'qazana_library' ],
            ]
        );

        register_setting( qazana()->slug, $field_id, [ $validations_class_name, 'checkbox_list' ] );

        $field_id = 'qazana_exclude_user_roles';
        add_settings_field(
            $field_id,
            __( 'Exclude Roles', 'qazana' ),
            [ $controls_class_name, 'render' ],
            qazana()->slug,
            $main_section,
            [
                'id' => $field_id,
                'type' => 'checkbox_list_roles',
                'exclude' => [ 'administrator' ],
            ]
        );

        register_setting( qazana()->slug, $field_id, [ $validations_class_name, 'checkbox_list' ] );

        // Style section
        $style_section = 'qazana_style_section';

        add_settings_section(
            $style_section,
            __( 'Style Settings', 'qazana' ),
            '__return_empty_string', // No need intro text for this section right now
            qazana()->slug
        );

        $field_id = 'qazana_disable_color_schemes';
        add_settings_field(
            $field_id,
            __( 'Disable Color Palettes', 'qazana' ),
            [ $controls_class_name, 'render' ],
            qazana()->slug,
            $style_section,
            [
                'id' => $field_id,
                'type' => 'checkbox',
                'value' => 'yes',
                'sub_desc' => __( 'Color Palettes let you change the default colors that appear under the various widgets. If you prefer to inherit the colors from your theme, you can disable this feature.', 'qazana' ),
            ]
        );

        register_setting( qazana()->slug, $field_id );

        $field_id = 'qazana_disable_typography_schemes';
        add_settings_field(
            $field_id,
            __( 'Disable Default Fonts', 'qazana' ),
            [ $controls_class_name, 'render' ],
            qazana()->slug,
            $style_section,
            [
                'id' => $field_id,
                'type' => 'checkbox',
                'value' => 'yes',
                'sub_desc' => __( 'Default Fonts let you change the fonts that appear on Qazana from one place. If you prefer to inherit the fonts from your theme, you can disable this feature here.', 'qazana' ),
            ]
        );

        register_setting( qazana()->slug, $field_id );

        $field_id = 'qazana_default_generic_fonts';
        add_settings_field(
            $field_id,
            __( 'Default Generic Fonts', 'qazana' ),
            [ $controls_class_name, 'render' ],
            qazana()->slug,
            $style_section,
            [
                'id' => $field_id,
                'type' => 'text',
                'std' => 'Sans-serif',
                'classes' => [ 'medium-text' ],
                'desc' => __( 'The list of fonts used if the chosen font is not available.', 'qazana' ),
            ]
        );

        register_setting( qazana()->slug, $field_id );

        $field_id = 'qazana_container_width';
        add_settings_field(
            $field_id,
            __( 'Content Width', 'qazana' ),
            [ $controls_class_name, 'render' ],
            qazana()->slug,
            $style_section,
            [
                'id' => $field_id,
                'type' => 'text',
                'placeholder' => '1140',
                'sub_desc' => 'px',
                'classes' => [ 'medium-text' ],
                'desc' => __( 'Sets the default width of the content area (Default: 1140)', 'qazana' ),
            ]
        );

        register_setting( qazana()->slug, $field_id );

        $field_id = 'qazana_stretched_section_container';
        add_settings_field(
            $field_id,
            __( 'Stretched Section Fit To', 'qazana' ),
            [ $controls_class_name, 'render' ],
            qazana()->slug,
            $style_section,
            [
                'id' => $field_id,
                'type' => 'text',
                'placeholder' => 'body',
                'classes' => [ 'medium-text' ],
                'desc' => __( 'Enter parent element selector to which stretched sections will fit to (e.g. #primary / .wrapper / main etc). Leave blank to fit to page width.', 'qazana' ),
            ]
        );

        register_setting( qazana()->slug, $field_id );

        // Tools section
        $tools_section = 'qazana_tools_section';
        add_settings_section(
            $tools_section,
            __( 'Tools', 'qazana' ),
            '__return_empty_string', // No need intro text for this section right now
            qazana()->slug
        );

        $field_id = 'qazana_clear_css_cache';
        add_settings_field(
            $field_id,
            __( 'Regenerate CSS', 'qazana' ),
            [ $controls_class_name, 'render' ],
            qazana()->slug,
            $tools_section,
            [
                'id' => $field_id,
                'type' => 'raw_html',
                'html' => sprintf( '<button data-nonce="%s" class="button qazana-button-spinner" id="qazana-clear-css-cache-button">%s</button>', wp_create_nonce( 'qazana_clear_css_cache' ), __( 'Regenerate Files', 'qazana' ) ),
                'desc' => __( 'Styles set in Qazana are saved in CSS files in the uploads folder. Recreate those files, according to the most recent settings.', 'qazana' ),
            ]
        );

        $field_id = 'qazana_raw_reset_api_data';
        add_settings_field(
            $field_id,
            __( 'Sync Library', 'qazana' ),
            [ $controls_class_name, 'render' ],
            qazana()->slug,
            $tools_section,
            [
                'id' => $field_id,
                'type' => 'raw_html',
                'html' => sprintf( '<button data-nonce="%s" class="button qazana-button-spinner" id="qazana-library-sync-button">%s</button>', wp_create_nonce( 'qazana_reset_library' ), __( 'Sync Library', 'qazana' ) ),
                'desc' => __( 'Qazana Library automatically updates on a daily basis. You can also manually update it by clicking on the sync button.', 'qazana' ),
            ]
        );

        $field_id = 'qazana_replace_url';
		add_settings_field(
			$field_id,
			__( 'Update Site Address (URL)', 'qazana' ),
			[ $controls_class_name, 'render' ],
            qazana()->slug,
			$tools_section,
			[
				'id' => $field_id,
				'type' => 'raw_html',
				'html' => sprintf( '<input type="text" name="from" placeholder="http://old-url.com" class="medium-text"><input type="text" name="to" placeholder="http://new-url.com" class="medium-text"><button data-nonce="%s" class="button qazana-button-spinner" id="qazana-replace-url-button">%s</button>', wp_create_nonce( 'qazana_replace_url' ), __( 'Replace URL', 'qazana' ) ),
				'desc' => __( 'Enter your old and new URLs for your WordPress installation, to update all Qazana data (Relevant for domain transfers or move to \'HTTPS\').', 'qazana' ),
			]
		);

        // Widgets section
        $tools_section = 'qazana_widgets_section';
        add_settings_section(
            $tools_section,
            __( 'Widgets', 'qazana' ),
            '__return_empty_string', // No need intro text for this section right now
            qazana()->slug
        );

        $field_id = 'qazana_google_maps_api_key';
        add_settings_field(
            $field_id,
            __( 'Google Maps API Key', 'qazana' ),
            [ $controls_class_name, 'render' ],
            qazana()->slug,
            $tools_section,
            [
                'id' => $field_id,
                'type' => 'text',
                'std' => '',
                'classes' => [ 'medium-text' ],
                'desc' => __( 'The google maps api used by the maps widget.', 'qazana' ),
            ]
        );
        register_setting( qazana()->slug, $field_id );

        /* $field_id = 'qazana_allow_tracking';
        add_settings_field(
            $field_id,
            __( 'Usage Data Tracking', 'qazana' ),
            [ $controls_class_name, 'render' ],
            qazana()->slug,
            $tools_section,
            [
                'id' => $field_id,
                'type' => 'checkbox',
                'value' => 'yes',
                'default' => '',
                'sub_desc' => __( 'Opt-in to our anonymous plugin data collection and to updates. We guarantee no sensitive data is collected.', 'qazana' ) . sprintf( ' <a href="%s" target="_blank">%s</a>', 'https://radiumthemes.com/plugins/qazana/qazana-usage-data/', __( 'Learn more.', 'qazana' ) ),
            ]
        ); */

        //register_setting( qazana()->slug, $field_id, [ __NAMESPACE__ . '\Tracker', 'check_for_settings_optin' ] );

        do_action( 'qazana/admin/settings/after', qazana()->slug );

    }

    public function register_admin_menu() {
        add_menu_page(
            __( 'Qazana', 'qazana' ),
            __( 'Qazana', 'qazana' ),
            'manage_options',
            qazana()->slug,
            [ $this, 'display_settings_page' ],
            '',
            99
        );
    }

    public function admin_menu_change_name() {
        global $submenu;

        if ( isset( $submenu['qazana'] ) )
            $submenu['qazana'][0][0] = __( 'Settings', 'qazana' );
    }

    public function display_settings_page() {
        ?>
        <div class="wrap">
            <h2><?php _e( 'Qazana', 'qazana' ); ?></h2>
            <form method="post" action="options.php">
                <?php
                settings_fields( qazana()->slug );
                do_settings_sections( qazana()->slug );

                submit_button();
                ?>
            </form>
        </div><!-- /.wrap -->
        <?php
    }

    public function ajax_qazana_clear_css_cache() {
		check_ajax_referer( 'qazana_clear_css_cache', '_nonce' );

		qazana()->posts_css_manager->clear_cache();

		wp_send_json_success();
	}

	public function ajax_qazana_replace_url() {
		check_ajax_referer( 'qazana_replace_url', '_nonce' );

		$from = ! empty( $_POST['from'] ) ? trim( $_POST['from'] ) : '';
		$to = ! empty( $_POST['to'] ) ? trim( $_POST['to'] ) : '';

		$is_valid_urls = ( filter_var( $from, FILTER_VALIDATE_URL ) && filter_var( $to, FILTER_VALIDATE_URL ) );
		if ( ! $is_valid_urls ) {
			wp_send_json_error( __( 'The `from` and `to` URL\'s must be a valid URL', 'qazana' ) );
		}

		if ( $from === $to ) {
			wp_send_json_error( __( 'The `from` and `to` URL\'s must be different', 'qazana' ) );
		}

		global $wpdb;

		// @codingStandardsIgnoreStart cannot use `$wpdb->prepare` because it remove's the backslashes
		$rows_affected = $wpdb->query(
			"UPDATE {$wpdb->postmeta} " .
			"SET `meta_value` = REPLACE(`meta_value`, '" . str_replace( '/', '\/', $from ) . "', '" . str_replace( '/', '\/', $to ) . "') " .
			"WHERE `meta_key` = '_qazana_data' AND `meta_value` LIKE '[%' ;" ); // meta_value LIKE '[%' are json formatted
		// @codingStandardsIgnoreEnd

		if ( false === $rows_affected ) {
			wp_send_json_error( __( 'An error occurred', 'qazana' ) );
		} else {
            qazana()->posts_css_manager->clear_cache();
			wp_send_json_success( sprintf( __( '%d Rows Affected', 'qazana' ), $rows_affected ) );
		}
	}

    public function __construct() {
        include( qazana()->includes_dir . 'admin/settings/controls.php' );
        include( qazana()->includes_dir . 'admin/settings/validations.php' );

        add_action( 'admin_init', [ $this, 'register_settings_fields' ], 20 );
        add_action( 'admin_menu', [ $this, 'register_admin_menu' ], 20 );
        add_action( 'admin_menu', [ $this, 'admin_menu_change_name' ], 200 );

        if ( ! empty( $_POST ) ) {
			add_action( 'wp_ajax_qazana_clear_css_cache', [ $this, 'ajax_qazana_clear_css_cache' ] );
			add_action( 'wp_ajax_qazana_replace_url', [ $this, 'ajax_qazana_replace_url' ] );
		}
    }
}
