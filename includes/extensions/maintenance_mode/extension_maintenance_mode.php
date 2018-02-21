<?php
namespace Qazana\Extensions;

use Qazana\Utils;
use Qazana\Template_Library\Source_Local;
use Qazana\Admin\Settings\Panel;
use Qazana\Admin\Settings\Tools;

class Maintenance_Mode extends Base {
    
    const OPTION_PREFIX = 'qazana_maintenance_mode_';
    const MODE_MAINTENANCE = 'maintenance';
    const MODE_COMING_SOON = 'coming_soon';

    /**
     * @since 1.3.0
     * @access public
     */
    public function __construct() {

        require( 'classes/hooks.php' );

        $is_enabled = (bool) self::get( 'mode' ) && (bool) self::get( 'template_id' );

        if ( is_admin() ) {
            add_action( 'qazana/admin/after_create_settings/' . qazana()->slug, [ $this, 'register_settings_fields' ] );
        }

        if ( ! $is_enabled ) {
           return;
        }

        add_action( 'admin_bar_menu', [ $this, 'add_menu_in_admin_bar' ], 300 );
        add_action( 'admin_head', [ $this, 'print_style' ] );
        add_action( 'wp_head', [ $this, 'print_style' ] );

        $user = wp_get_current_user();

        $exclude_mode = self::get( 'exclude_mode', [] );

        if ( 'logged_in' === $exclude_mode && is_user_logged_in() ) {
            return;
        }

        if ( 'custom' === $exclude_mode ) {
            $exclude_roles = self::get( 'exclude_roles', [] );

            $compare_roles = array_intersect( $user->roles, $exclude_roles );

            if ( ! empty( $compare_roles ) ) {
                return;
            }
        }

        do_action( 'qazana/maintenance/template_redirect' );

        add_filter( 'body_class', [$this, 'body_class'] );
        add_action( 'template_redirect', [$this, 'template_redirect'], 1 );
    }

    /**
	 * Unique extension name
	 *
	 * @return string
	 */
    public function get_name() {
        return 'maintenance_mode';
    }

    /**
     * Extension title
     *
     * @return string
     */
    public function get_title() {
        return __( 'Maintenance Mode', 'qazana' );
    }

    /**
     * @static
     * @since 1.3.0
     * @access public
    */
    public static function get( $option, $default = false ) {
        return get_option( self::OPTION_PREFIX . $option, $default );
    }

    /**
     * @static
     * @since 1.3.0
     * @access public
    */
    public static function set( $option, $value ) {
        return update_option( self::OPTION_PREFIX . $option, $value );
    }

    /**
     * @since 1.3.0
     * @access public
    */
    public function body_class( $classes ) {
        $classes[] = 'qazana-maintenance-mode';

        return $classes;
    }

    /**
     * @since 1.3.0
     * @access public
    */
    public function template_redirect() {
        if ( qazana()->preview->is_preview_mode() ) {
            return;
        }

        // Setup global post for Qazana\frontend so `_has_qazana_in_page = true`.
        $GLOBALS['post'] = get_post( self::get( 'template_id' ) );

        add_filter( 'template_include', [ $this, 'template_include'], 1 );
    }

    /**
     * @since 1.3.0
     * @access public
    */
    public function template_include( $template ) {
        // Set the template as `$wp_query->current_object` for `wp_title` and etc.
        query_posts( [
            'p' => self::get( 'template_id' ),
            'post_type' => Source_Local::CPT,
        ] );

        if ( 'maintenance' === self::get( 'mode' ) ) {
            $protocol = wp_get_server_protocol();
            header( "$protocol 503 Service Unavailable", true, 503 );
            header( 'Content-Type: text/html; charset=utf-8' );
            header( 'Retry-After: 600' );
        }

        return $template;
    }

    /**
     * @since 1.3.0
     * @access public
    */
    public function register_settings_fields( Panel $tools ) {
        $templates = qazana()->templates_manager->get_source( 'local' )->get_items( ['type' => 'page'] );

        $templates_options = [];

        foreach ( $templates as $template ) {
            $templates_options[ $template['template_id'] ] = $template['title'];
        }

        $template_description = sprintf( ' <a target="_blank" class="qazana-edit-template" style="display: none" href="%s">%s</a>', Utils::get_edit_link( self::get( 'template_id' ) ), __( 'Edit Template', 'qazana' ) );

        $template_description .= '<span class="qazana-maintenance-mode-error" style="display: none">' .
                                    __( 'To enable maintenance mode you have to set a template for the maintenance mode page.', 'qazana' ) .
                                    '<br>' .
                                    sprintf( __( 'Select one or go ahead and <a target="_blank" href="%s">create one</a> now.', 'qazana' ), admin_url( 'post-new.php?post_type=' . Source_Local::CPT ) ) .
                                    '</span>';

        $tools->add_tab(
            'maintenance_mode', [
                'label' => __( 'Maintenance Mode', 'qazana' ),
                'sections' => [
                    'maintenance_mode' => [
                        'callback' => function() {
                            echo '<div>' . __( 'Set your entire website as MAINTENANCE MODE, meaning the site is offline temporarily for maintenance, or set it as COMING SOON mode, meaning the site is offline until it is ready to be launched.', 'qazana' ) . '</div>';
                        },
                        'fields' => [
                            'maintenance_mode_mode' => [
                                'label' => __( 'Choose Mode', 'qazana' ),
                                'field_args' => [
                                    'type' => 'select',
                                    'options' => [
                                        '' => __( 'Disabled', 'qazana' ),
                                        self::MODE_COMING_SOON => __( 'Coming Soon', 'qazana' ),
                                        self::MODE_MAINTENANCE => __( 'Maintenance', 'qazana' ),
                                    ],
                                    'desc' => '<div class="qazana-maintenance-mode-description" data-value="" style="display: none">' .
                                                __( 'Choose between Coming Soon mode (returning HTTP status code 200) or Maintenance Mode (returning HTTP status code 503).', 'qazana' ) .
                                                '</div>' .
                                                '<div class="qazana-maintenance-mode-description" data-value="maintenance" style="display: none">' .
                                                __( 'Maintenance Mode returns HTTP 503 code, so search engines know to come back a short time later. It is not recommended to use this mode for more than a couple of days.', 'qazana' ) .
                                                '</div>' .
                                                '<div class="qazana-maintenance-mode-description" data-value="coming_soon" style="display: none">' .
                                                __( 'Coming Soon returns HTTP 200 code, meaning the site is ready to be indexed.', 'qazana' ) .
                                                '</div>',
                                ],
                            ],
                            'maintenance_mode_exclude_mode' => [
                                'label' => __( 'Who Can Access', 'qazana' ),
                                'field_args' => [
                                    'class' => 'qazana-default-hide',
                                    'type' => 'select',
                                    'std' => 'logged_in',
                                    'options' => [
                                        'logged_in' => __( 'Logged In', 'qazana' ),
                                        'custom' => __( 'Custom', 'qazana' ),
                                    ],
                                ],
                            ],
                            'maintenance_mode_exclude_roles' => [
                                'label' => __( 'Roles', 'qazana' ),
                                'field_args' => [
                                    'class' => 'qazana-default-hide',
                                    'type' => 'checkbox_list_roles',
                                ],
                                'setting_args' => ['Qazana\Admin\Settings\Validations', 'checkbox_list'],
                            ],
                            'maintenance_mode_template_id' => [
                                'label' => __( 'Choose Template', 'qazana' ),
                                'field_args' => [
                                    'class' => 'qazana-default-hide',
                                    'type' => 'select',
                                    'show_select' => true,
                                    'options' => $templates_options,
                                    'desc' => $template_description,
                                ],
                            ],
                        ],
                    ],
                ],
            ]
        );
    }

    /**
     * @since 1.3.0
     * @access public
    */
    public function add_menu_in_admin_bar( \WP_Admin_Bar $wp_admin_bar ) {
        $wp_admin_bar->add_node( [
            'id' => 'qazana-maintenance-on',
            'title' => __( 'Maintenance Mode ON', 'qazana' ),
            'href' => admin_url( 'admin.php?page=' . qazana()->slug ) . '#tab-maintenance_mode',
        ] );

        $wp_admin_bar->add_node( [
            'id' => 'qazana-maintenance-edit',
            'parent' => 'qazana-maintenance-on',
            'title' => __( 'Edit Template', 'qazana' ),
            'href' => Utils::get_edit_link( self::get( 'template_id' ) ),
        ] );
    }

    /**
     * @since 1.3.0
     * @access public
    */
    public function print_style() {
        ?>
        <style>#wp-admin-bar-qazana-maintenance-on > a { background-color: #dc3232; }
            #wp-admin-bar-qazana-maintenance-on > .ab-item:before { content: "\f160"; top: 2px; }</style>
        <?php
    }
}
