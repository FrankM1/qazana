<?php
namespace Qazana\Extensions;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

use Qazana\Utils;
use Qazana\Admin\Settings\Panel;
use Qazana\Template_Library\Source_Local;
use Qazana\Extensions\Documents\Site_Page_Not_Found as Document;

class Site_Page_Not_Found extends Base {

	const OPTION_PREFIX = 'qazana_not_found_page_';

    private $docs_types = [];

	public function get_types_config() {
		$config = [];

		foreach ( $this->docs_types as $type => $class_name ) {
			$config[ $type ] = call_user_func( [ $class_name, 'get_properties' ] );
		}

		return $config;
	}

	public function register_documents() {
		$this->docs_types = [
			'site-page-not-found' => Document::get_class_full_name(),
		];

		foreach ( $this->docs_types as $type => $class_name ) {
			qazana()->get_documents()->register_document_type( $type, $class_name );
		}
    }

    /**
     * @since 1.0.0
     * @access public
     */
    public function __construct() {
        require_once 'documents/site-page-not-found.php';

        add_action( 'qazana/documents/register', [ $this, 'register_documents' ] );

        if ( is_admin() ) {
            add_action( 'qazana/admin/after_create_settings/' . qazana()->slug, [ $this, 'register_settings_fields' ] );
        }

        $is_enabled = (bool) self::get( 'mode' ) && (bool) self::get( 'template_id' );

        if ( ! $is_enabled ) {
            return;
        }

        add_action( 'wp', [ $this, 'init' ] );
    }

    public function init() {

        if ( ! is_404() ) {
            return;
        }

        add_action( 'admin_bar_menu', [ $this, 'add_menu_in_admin_bar' ], 300 );
        add_action( 'admin_head', [ $this, 'print_style' ] );
        add_action( 'wp_head', [ $this, 'print_style' ] );

        add_filter( 'body_class', [ $this, 'body_class' ] );
        add_action( 'template_redirect', [ $this, 'template_redirect' ], 1 );
    }

    /**
	 * Unique extension name
	 *
	 * @return string
	 */
    public function get_name() {
        return 'not-found-page';
    }

    /**
     * Extension title
     *
     * @return string
     */
    public function get_title() {
        return __( 'Page not found ', 'energia' );
    }

    /**
     * @static
     * @since 1.0.0
     * @access public
    */
    public static function get( $option, $default = false ) {
        return get_option( self::OPTION_PREFIX . $option, $default );
    }

    /**
     * @static
     * @since 1.0.0
     * @access public
    */
    public static function set( $option, $value ) {
        return update_option( self::OPTION_PREFIX . $option, $value );
    }

    /**
     * @since 1.0.0
     * @access public
    */
    public function body_class( $classes ) {
        $classes[] = 'qazana-is-404-mode';
        return $classes;
    }

    /**
     * @since 1.0.0
     * @access public
    */
    public function template_redirect() {
        if ( qazana()->get_preview()->is_preview_mode() ) {
            return;
        }

        // Setup global post for Qazana\frontend so `_has_qazana_in_page = true`.
        $GLOBALS['post'] = get_post( self::get( 'template_id' ) );

        add_filter( 'template_include', [$this, 'template_include'], 1 );
    }

    /**
     * @since 1.0.0
     * @access public
    */
    public function template_include( $template ) {
        // Set the template as `$wp_query->current_object` for `wp_title` and etc.
        query_posts( [
            'p'         => self::get( 'template_id' ),
            'post_type' => Source_Local::CPT,
        ] );

        return $this->extension_dir( 'template/404.php' );
    }

    /**
     * @since 1.0.0
     * @access public
    */
    public function register_settings_fields( Panel $tools ) {
        $templates = qazana()->get_templates_manager()->get_source( 'local' )->get_items( ['type' => 'site-page-not-found'] );

        $templates_options = [];

        foreach ( $templates as $template ) {
            $templates_options[ $template['template_id'] ] = $template['title'];
        }

        $template_description = sprintf( ' <a target="_blank" class="qazana-edit-template" style="display: none" href="%s">%s</a>', Utils::get_edit_link( self::get( 'template_id' ) ), __( 'Edit Template', 'energia' ) );

        $template_description .= '<span class="qazana-is-404-mode-error" style="display: none">' . __( 'To set a template for the 404 page.', 'energia' ) . '<br>' . sprintf( __( 'Select one or go ahead and <a target="_blank" href="%s">create one</a> now.', 'energia' ), admin_url( 'post-new.php?post_type=' . Source_Local::CPT ) ) .'</span>';

        $tools->add_tab(
            'not_found_page', [
                'label'    => __( 'Page not found ', 'energia' ),
                'sections' => [
                    'not_found_page' => [
                        'callback' => function() {
                            echo '<div>' . __( 'Set a template to use on the 404 page.', 'energia' ) . '</div>';
                        },
                        'fields' => [
                            'not_found_page_mode' => [
                                'label'      => __( 'Custom 404 page', 'energia' ),
                                'field_args' => [
                                    'type'  => 'checkbox',
                                    'value' => 1,
                                    'std'   => 0,
                                    'desc'  => '',
                                ],
                            ],
                            'not_found_page_template_id' => [
                                'label'      => __( 'Choose Template', 'energia' ),
                                'field_args' => [
                                    'class'       => 'qazana-default-hide',
                                    'type'        => 'select',
                                    'show_select' => true,
                                    'options'     => $templates_options,
                                    'desc'        => $template_description,
                                ],
                            ],
                        ],
                    ],
                ],
            ]
        );
    }

    /**
     * @since 1.0.0
     * @access public
    */
    public function add_menu_in_admin_bar( \WP_Admin_Bar $wp_admin_bar ) {
        $wp_admin_bar->add_node( [
            'id'    => 'qazana-is-404',
            'title' => __( '404 Page', 'energia' ),
            'href'  => admin_url( 'admin.php?page=' . qazana()->slug ) . '#tab-not_found_page',
        ] );

        $wp_admin_bar->add_node( [
            'id'     => 'qazana-is-404-edit',
            'parent' => 'qazana-is-404',
            'title'  => __( 'Edit Template', 'energia' ),
            'href'   => Utils::get_edit_link( self::get( 'template_id' ) ),
        ] );
    }

    /**
     * @since 1.0.0
     * @access public
    */
    public function print_style() {
        ?><style>#wp-admin-bar-qazana-is-404 > a { background-color: #dc3232; } #wp-admin-bar-qazana-is-404 > .ab-item: before { content: "\f160"; top: 2px; }</style><?php
    }

	public function register() {
		return [
			'title'              => esc_attr__( 'Site 404 Pageq', 'energia' ),
			'name'               => 'site-page-not-found',
			'required'           => true,
			'default_activation' => true,
		];
	}
}
