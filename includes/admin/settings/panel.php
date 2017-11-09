<?php
namespace Qazana\Admin\Settings;

if ( !defined( 'ABSPATH' ) ) {
    exit;
} // Exit if accessed directly

class Panel extends Base {

    const TAB_GENERAL = 'general';
	const TAB_STYLE = 'style';
	const TAB_INTEGRATIONS = 'integrations';
    const TAB_ADVANCED = 'advanced';

    const UPDATE_TIME_FIELD = '_qazana_settings_update_time';

    public static function qazana() {
        return admin_url( 'admin.php?page=' . qazana()->slug );
    }

    /**
	 * @since 1.3.0
	 * @access protected
	*/
	protected function create_tabs() {
		$validations_class_name = __NAMESPACE__ . '\Validations';

		return [
			self::TAB_GENERAL => [
				'label' => __( 'General', 'qazana' ),
				'sections' => [
					'general' => [
						'fields' => [
							self::UPDATE_TIME_FIELD => [
								'full_field_id' => self::UPDATE_TIME_FIELD,
								'field_args' => [
									'type' => 'hidden',
								],
								'setting_args' => [
									'sanitize_callback' => 'time',
								],
							],
							'cpt_support' => [
								'label' => __( 'Post Types', 'qazana' ),
								'field_args' => [
									'type' => 'checkbox_list_cpt',
									'std' => [ 'page', 'post' ],
									'exclude' => [ 'attachment', 'qazana_library' ],
								],
								'setting_args' => [ $validations_class_name, 'checkbox_list' ],
							],
							'exclude_user_roles' => [
								'label' => __( 'Exclude Roles', 'qazana' ),
								'field_args' => [
									'type' => 'checkbox_list_roles',
									'exclude' => [ 'administrator' ],
								],
								'setting_args' => [ $validations_class_name, 'checkbox_list' ],
							],
							'disable_color_schemes' => [
								'label' => __( 'Disable Default Colors', 'qazana' ),
								'field_args' => [
									'type' => 'checkbox',
									'value' => 'yes',
									'sub_desc' => __( 'Checking this box will disable Qazana\'s Default Colors, and make Qazana inherit the colors from your theme.', 'qazana' ),
								],
							],
							'disable_typography_schemes' => [
								'label' => __( 'Disable Default Fonts', 'qazana' ),
								'field_args' => [
									'type' => 'checkbox',
									'value' => 'yes',
									'sub_desc' => __( 'Checking this box will disable Qazana\'s Default Fonts, and make Qazana inherit the fonts from your theme.', 'qazana' ),
								],
							],
						],
					],
					'usage' => [
						'label' => __( 'Improve Qazana', 'qazana' ),
						'fields' => [
							'allow_tracking' => [
								'label' => __( 'Usage Data Tracking', 'qazana' ),
								'field_args' => [
									'type' => 'checkbox',
									'value' => 'yes',
									'default' => '',
									'sub_desc' => __( 'Opt-in to our anonymous plugin data collection and to updates. We guarantee no sensitive data is collected.', 'qazana' ) . sprintf( ' <a href="%s" target="_blank">%s</a>', 'https://qazana.net/usage-data-tracking/', __( 'Learn more.', 'qazana' ) ),
								],
								'setting_args' => [ __NAMESPACE__ . '\Tracker', 'check_for_settings_optin' ],
							],
						],
					],
				],
			],
			self::TAB_STYLE => [
				'label' => __( 'Style', 'qazana' ),
				'sections' => [
					'style' => [
						'fields' => [
							'default_generic_fonts' => [
								'label' => __( 'Default Generic Fonts', 'qazana' ),
								'field_args' => [
									'type' => 'text',
									'std' => 'Sans-serif',
									'class' => 'medium-text',
									'desc' => __( 'The list of fonts used if the chosen font is not available.', 'qazana' ),
								],
							],
							'container_width' => [
								'label' => __( 'Content Width', 'qazana' ),
								'field_args' => [
									'type' => 'text',
									'placeholder' => '1140',
									'sub_desc' => 'px',
									'class' => 'medium-text',
									'desc' => __( 'Sets the default width of the content area (Default: 1140)', 'qazana' ),
								],
							],
							'space_between_widgets' => [
								'label' => __( 'Space Between Widgets', 'qazana' ),
								'field_args' => [
									'type' => 'text',
									'placeholder' => '20',
									'sub_desc' => 'px',
									'class' => 'medium-text',
									'desc' => __( 'Sets the default space between widgets (Default: 20)', 'qazana' ),
								],
							],
							'stretched_section_container' => [
								'label' => __( 'Stretched Section Fit To', 'qazana' ),
								'field_args' => [
									'type' => 'text',
									'placeholder' => 'body',
									'class' => 'medium-text',
									'desc' => __( 'Enter parent element selector to which stretched sections will fit to (e.g. #primary / .wrapper / main etc). Leave blank to fit to page width.', 'qazana' ),
								],
							],
							'page_title_selector' => [
								'label' => __( 'Page Title Selector', 'qazana' ),
								'field_args' => [
									'type' => 'text',
									'placeholder' => 'h1.entry-title',
									'class' => 'medium-text',
									'desc' => __( 'Qazana lets you hide the page title. This works for themes that have "h1.entry-title" selector. If your theme\'s selector is different, please enter it above.', 'qazana' ),
								],
							],
							'global_image_lightbox' => [
								'label' => __( 'Image Lightbox', 'qazana' ),
								'field_args' => [
									'type' => 'checkbox',
									'value' => 'yes',
									'std' => 'yes',
									'sub_desc' => __( 'Open all image links in a lightbox popup window. The lightbox will automatically work on any link that leads to an image file.', 'qazana' ),
									'desc' => __( 'You can customize the lightbox design by going to: Top-left hamburger icon > Global Settings > Lightbox.', 'qazana' ),
								],
							],
						],
					],
				],
			],
			self::TAB_INTEGRATIONS => [
				'label' => __( 'Integrations', 'qazana' ),
				'sections' => [],
			],
			self::TAB_ADVANCED => [
				'label' => __( 'Advanced', 'qazana' ),
				'sections' => [
					'advanced' => [
						'fields' => [
							'css_print_method' => [
								'label' => __( 'CSS Print Method', 'qazana' ),
								'field_args' => [
									'class' => 'qazana_css_print_method',
									'type' => 'select',
									'options' => [
										'external' => __( 'External File', 'qazana' ),
										'internal' => __( 'Internal Embedding', 'qazana' ),
									],
									'desc' => '<div class="qazana-css-print-method-description" data-value="external" style="display: none">' .
											  __( 'Use external CSS files for all generated stylesheets. Choose this setting for better performance (recommended).', 'qazana' ) .
											  '</div>' .
											  '<div class="qazana-css-print-method-description" data-value="internal" style="display: none">' .
											  __( 'Use internal CSS that is embedded in the head of the page. For troubleshooting server configuration conflicts and managing development environments.', 'qazana' ) .
											  '</div>',
								],
							],
							'editor_break_lines' => [
								'label' => __( 'Switch Editor Loader Method', 'qazana' ),
								'field_args' => [
									'type' => 'select',
									'options' => [
										'' => __( 'Disable', 'qazana' ),
										1 => __( 'Enable', 'qazana' ),
									],
									'desc' => __( 'For troubleshooting server configuration conflicts.', 'qazana' ),
								],
							],
						],
					],
				],
			],
		];
	}

	/**
	 * @since 1.3.0
	 * @access protected
	*/
	protected function get_page_title() {
		return __( 'Qazana', 'qazana' );
    }

    /**
	 * @since 1.3.0
	 * @access public
	*/
	public function display_settings_page() {
		$tabs = $this->get_tabs();
		?>
		<div class="wrap">
			<h1><?php echo $this->get_page_title(); ?></h1>
			<div id="qazana-settings-tabs-wrapper" class="nav-tab-wrapper">
				<?php
				foreach ( $tabs as $tab_id => $tab ) {
					if ( empty( $tab['sections'] ) ) {
						continue;
					}

					$active_class = '';

					if ( 'general' === $tab_id ) {
						$active_class = ' nav-tab-active';
					}

					echo "<a id='qazana-settings-tab-$tab_id' class='nav-tab$active_class' href='#tab-$tab_id'>$tab[label]</a>";
				}
				?>
			</div>
			<form id="qazana-settings-form" method="post" action="options.php">
				<?php
				settings_fields( qazana()->slug );

				foreach ( $tabs as $tab_id => $tab ) {
					if ( empty( $tab['sections'] ) ) {
						continue;
					}

					$active_class = '';

					if ( 'general' === $tab_id ) {
						$active_class = ' qazana-active';
					}

					echo "<div id='tab-$tab_id' class='qazana-settings-form-page$active_class'>";

					foreach ( $tab['sections'] as $section_id => $section ) {
						$full_section_id = 'qazana_' . $section_id . '_section';

						if ( ! empty( $section['label'] ) ) {
							echo "<h2>$section[label]</h2>";
						}

						if ( ! empty( $section['callback'] ) ) {
							$section['callback']();
						}

						echo '<table class="form-table">';

						do_settings_fields( qazana()->slug, $full_section_id );

						echo '</table>';
					}

					echo '</div>';
				}

				submit_button();
				?>
			</form>
		</div><!-- /.wrap -->
		<?php
    }
    
    public function admin_menu_change_name() {
        global $submenu;

        if ( isset( $submenu['qazana'] ) ) {
            $submenu['qazana'][0][0] = __( 'Settings', 'qazana' );
        }
    }

    public function ajax_qazana_clear_css_cache() {
        check_ajax_referer( 'qazana_clear_css_cache', '_nonce' );

        qazana()->posts_css_manager->clear_cache();

        wp_send_json_success();
    }

    /**
	 * @since 1.3.0
	 * @access public
	*/
	public function update_css_print_method() {
		qazana()->posts_css_manager->clear_cache();
	}

    public function ajax_qazana_replace_url() {
        check_ajax_referer( 'qazana_replace_url', '_nonce' );

        $from = !empty( $_POST['from'] ) ? trim( $_POST['from'] ) : '';
        $to = !empty( $_POST['to'] ) ? trim( $_POST['to'] ) : '';

        $is_valid_urls = ( filter_var( $from, FILTER_VALIDATE_URL ) && filter_var( $to, FILTER_VALIDATE_URL ) );
        if ( !$is_valid_urls ) {
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
        parent::__construct();

        add_action( 'admin_menu', [$this, 'admin_menu_change_name'], 200 );

		// Clear CSS Meta after change print method.
		add_action( 'add_option_qazana_css_print_method', [ $this, 'update_css_print_method' ] );
		add_action( 'update_option_qazana_css_print_method', [ $this, 'update_css_print_method' ] );
    }
}
