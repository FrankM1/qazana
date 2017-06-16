<?php
namespace Builder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Settings_Panel {

    public static function get_url() {
        return admin_url( 'admin.php?page=' . builder()->slug );
    }

    public function register_settings_fields() {

        $controls_class_name = __NAMESPACE__ . '\Settings_Controls';
        $validations_class_name = __NAMESPACE__ . '\Settings_Validations';

        do_action( 'builder/admin/settings/before', builder()->slug );

        // Register the main section
        $main_section = 'builder_general_section';

        add_settings_section(
            $main_section,
            __( 'General Settings', 'builder' ),
            '__return_empty_string', // No need intro text for this section right now
            builder()->slug
        );

        $field_id = 'builder_cpt_support';
        add_settings_field(
            $field_id,
            __( 'Post Types', 'builder' ),
            [ $controls_class_name, 'render' ],
            builder()->slug,
            $main_section,
            [
                'id' => $field_id,
                'type' => 'checkbox_list_cpt',
                'std' => [ 'page', 'post' ],
                'exclude' => [ 'attachment', 'builder_library' ],
            ]
        );

        register_setting( builder()->slug, $field_id, [ $validations_class_name, 'checkbox_list' ] );

        $field_id = 'builder_exclude_user_roles';
        add_settings_field(
            $field_id,
            __( 'Exclude Roles', 'builder' ),
            [ $controls_class_name, 'render' ],
            builder()->slug,
            $main_section,
            [
                'id' => $field_id,
                'type' => 'checkbox_list_roles',
                'exclude' => [ 'administrator' ],
            ]
        );

        register_setting( builder()->slug, $field_id, [ $validations_class_name, 'checkbox_list' ] );

        // Style section
        $style_section = 'builder_style_section';

        add_settings_section(
            $style_section,
            __( 'Style Settings', 'builder' ),
            '__return_empty_string', // No need intro text for this section right now
            builder()->slug
        );

        $field_id = 'builder_disable_color_schemes';
        add_settings_field(
            $field_id,
            __( 'Disable Color Palettes', 'builder' ),
            [ $controls_class_name, 'render' ],
            builder()->slug,
            $style_section,
            [
                'id' => $field_id,
                'type' => 'checkbox',
                'value' => 'yes',
                'sub_desc' => __( 'Color Palettes let you change the default colors that appear under the various widgets. If you prefer to inherit the colors from your theme, you can disable this feature.', 'builder' ),
            ]
        );

        register_setting( builder()->slug, $field_id );

        $field_id = 'builder_disable_typography_schemes';
        add_settings_field(
            $field_id,
            __( 'Disable Default Fonts', 'builder' ),
            [ $controls_class_name, 'render' ],
            builder()->slug,
            $style_section,
            [
                'id' => $field_id,
                'type' => 'checkbox',
                'value' => 'yes',
                'sub_desc' => __( 'Default Fonts let you change the fonts that appear on Builder from one place. If you prefer to inherit the fonts from your theme, you can disable this feature here.', 'builder' ),
            ]
        );

        register_setting( builder()->slug, $field_id );

        $field_id = 'builder_default_generic_fonts';
        add_settings_field(
            $field_id,
            __( 'Default Generic Fonts', 'builder' ),
            [ $controls_class_name, 'render' ],
            builder()->slug,
            $style_section,
            [
                'id' => $field_id,
                'type' => 'text',
                'std' => 'Sans-serif',
                'classes' => [ 'medium-text' ],
                'desc' => __( 'The list of fonts used if the chosen font is not available.', 'builder' ),
            ]
        );

        register_setting( builder()->slug, $field_id );

        $field_id = 'builder_container_width';
        add_settings_field(
            $field_id,
            __( 'Content Width', 'builder' ),
            [ $controls_class_name, 'render' ],
            builder()->slug,
            $style_section,
            [
                'id' => $field_id,
                'type' => 'text',
                'placeholder' => '1140',
                'sub_desc' => 'px',
                'classes' => [ 'medium-text' ],
                'desc' => __( 'Sets the default width of the content area (Default: 1140)', 'builder' ),
            ]
        );

        register_setting( builder()->slug, $field_id );

        $field_id = 'builder_stretched_section_container';
        add_settings_field(
            $field_id,
            __( 'Stretched Section Fit To', 'builder' ),
            [ $controls_class_name, 'render' ],
            builder()->slug,
            $style_section,
            [
                'id' => $field_id,
                'type' => 'text',
                'placeholder' => 'body',
                'classes' => [ 'medium-text' ],
                'desc' => __( 'Enter parent element selector to which stretched sections will fit to (e.g. #primary / .wrapper / main etc). Leave blank to fit to page width.', 'builder' ),
            ]
        );

        register_setting( builder()->slug, $field_id );

        // Tools section
        $tools_section = 'builder_tools_section';
        add_settings_section(
            $tools_section,
            __( 'Tools', 'builder' ),
            '__return_empty_string', // No need intro text for this section right now
            builder()->slug
        );

        $field_id = 'builder_clear_css_cache';
        add_settings_field(
            $field_id,
            __( 'Regenerate CSS', 'builder' ),
            [ $controls_class_name, 'render' ],
            builder()->slug,
            $tools_section,
            [
                'id' => $field_id,
                'type' => 'raw_html',
                'html' => sprintf( '<button data-nonce="%s" class="button builder-button-spinner" id="builder-clear-css-cache-button">%s</button>', wp_create_nonce( 'builder_clear_css_cache' ), __( 'Regenerate Files', 'builder' ) ),
                'desc' => __( 'Styles set in Builder are saved in CSS files in the uploads folder. Recreate those files, according to the most recent settings.', 'builder' ),
            ]
        );

        $field_id = 'builder_raw_reset_api_data';
        add_settings_field(
            $field_id,
            __( 'Sync Library', 'builder' ),
            [ $controls_class_name, 'render' ],
            builder()->slug,
            $tools_section,
            [
                'id' => $field_id,
                'type' => 'raw_html',
                'html' => sprintf( '<button data-nonce="%s" class="button builder-button-spinner" id="builder-library-sync-button">%s</button>', wp_create_nonce( 'builder_reset_library' ), __( 'Sync Library', 'builder' ) ),
                'desc' => __( 'Builder Library automatically updates on a daily basis. You can also manually update it by clicking on the sync button.', 'builder' ),
            ]
        );

        $field_id = 'builder_replace_url';
		add_settings_field(
			$field_id,
			__( 'Update Site Address (URL)', 'builder' ),
			[ $controls_class_name, 'render' ],
            builder()->slug,
			$tools_section,
			[
				'id' => $field_id,
				'type' => 'raw_html',
				'html' => sprintf( '<input type="text" name="from" placeholder="http://old-url.com" class="medium-text"><input type="text" name="to" placeholder="http://new-url.com" class="medium-text"><button data-nonce="%s" class="button builder-button-spinner" id="builder-replace-url-button">%s</button>', wp_create_nonce( 'builder_replace_url' ), __( 'Replace URL', 'builder' ) ),
				'desc' => __( 'Enter your old and new URLs for your WordPress installation, to update all Builder data (Relevant for domain transfers or move to \'HTTPS\').', 'builder' ),
			]
		);

        // Widgets section
        $tools_section = 'builder_widgets_section';
        add_settings_section(
            $tools_section,
            __( 'Widgets', 'builder' ),
            '__return_empty_string', // No need intro text for this section right now
            builder()->slug
        );

        $field_id = 'builder_google_maps_api_key';
        add_settings_field(
            $field_id,
            __( 'Google Maps API Key', 'builder' ),
            [ $controls_class_name, 'render' ],
            builder()->slug,
            $tools_section,
            [
                'id' => $field_id,
                'type' => 'text',
                'std' => '',
                'classes' => [ 'medium-text' ],
                'desc' => __( 'The google maps api used by the maps widget.', 'builder' ),
            ]
        );
        register_setting( builder()->slug, $field_id );

        /* $field_id = 'builder_allow_tracking';
        add_settings_field(
            $field_id,
            __( 'Usage Data Tracking', 'builder' ),
            [ $controls_class_name, 'render' ],
            builder()->slug,
            $tools_section,
            [
                'id' => $field_id,
                'type' => 'checkbox',
                'value' => 'yes',
                'default' => '',
                'sub_desc' => __( 'Opt-in to our anonymous plugin data collection and to updates. We guarantee no sensitive data is collected.', 'builder' ) . sprintf( ' <a href="%s" target="_blank">%s</a>', 'https://radiumthemes.com/plugins/builder/builder-usage-data/', __( 'Learn more.', 'builder' ) ),
            ]
        ); */

        //register_setting( builder()->slug, $field_id, [ __NAMESPACE__ . '\Tracker', 'check_for_settings_optin' ] );

        do_action( 'builder/admin/settings/after', builder()->slug );

    }

    public function register_admin_menu() {
        add_menu_page(
            __( 'Builder', 'builder' ),
            __( 'Builder', 'builder' ),
            'manage_options',
            builder()->slug,
            [ $this, 'display_settings_page' ],
            '',
            99
        );
    }

    public function admin_menu_change_name() {
        global $submenu;

        if ( isset( $submenu['builder'] ) )
            $submenu['builder'][0][0] = __( 'Settings', 'builder' );
    }

    public function display_settings_page() {
        ?>
        <div class="wrap">
            <h2><?php _e( 'Builder', 'builder' ); ?></h2>
            <form method="post" action="options.php">
                <?php
                settings_fields( builder()->slug );
                do_settings_sections( builder()->slug );

                submit_button();
                ?>
            </form>
        </div><!-- /.wrap -->
        <?php
    }

    public function ajax_builder_clear_css_cache() {
		check_ajax_referer( 'builder_clear_css_cache', '_nonce' );

		builder()->posts_css_manager->clear_cache();

		wp_send_json_success();
	}

	public function ajax_builder_replace_url() {
		check_ajax_referer( 'builder_replace_url', '_nonce' );

		$from = ! empty( $_POST['from'] ) ? trim( $_POST['from'] ) : '';
		$to = ! empty( $_POST['to'] ) ? trim( $_POST['to'] ) : '';

		$is_valid_urls = ( filter_var( $from, FILTER_VALIDATE_URL ) && filter_var( $to, FILTER_VALIDATE_URL ) );
		if ( ! $is_valid_urls ) {
			wp_send_json_error( __( 'The `from` and `to` URL\'s must be a valid URL', 'builder' ) );
		}

		if ( $from === $to ) {
			wp_send_json_error( __( 'The `from` and `to` URL\'s must be different', 'builder' ) );
		}

		global $wpdb;

		// @codingStandardsIgnoreStart cannot use `$wpdb->prepare` because it remove's the backslashes
		$rows_affected = $wpdb->query(
			"UPDATE {$wpdb->postmeta} " .
			"SET `meta_value` = REPLACE(`meta_value`, '" . str_replace( '/', '\/', $from ) . "', '" . str_replace( '/', '\/', $to ) . "') " .
			"WHERE `meta_key` = '_builder_data' AND `meta_value` LIKE '[%' ;" ); // meta_value LIKE '[%' are json formatted
		// @codingStandardsIgnoreEnd

		if ( false === $rows_affected ) {
			wp_send_json_error( __( 'An error occurred', 'builder' ) );
		} else {
            builder()->posts_css_manager->clear_cache();
			wp_send_json_success( sprintf( __( '%d Rows Affected', 'builder' ), $rows_affected ) );
		}
	}

    public function __construct() {
        include( builder()->includes_dir . 'admin/settings/controls.php' );
        include( builder()->includes_dir . 'admin/settings/validations.php' );

        add_action( 'admin_init', [ $this, 'register_settings_fields' ], 20 );
        add_action( 'admin_menu', [ $this, 'register_admin_menu' ], 20 );
        add_action( 'admin_menu', [ $this, 'admin_menu_change_name' ], 200 );

        if ( ! empty( $_POST ) ) {
			add_action( 'wp_ajax_builder_clear_css_cache', [ $this, 'ajax_builder_clear_css_cache' ] );
			add_action( 'wp_ajax_builder_replace_url', [ $this, 'ajax_builder_replace_url' ] );
		}
    }
}
