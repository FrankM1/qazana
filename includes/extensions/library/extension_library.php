<?php
namespace Qazana\Extensions;

use Qazana\Extensions\Library\Documents\Page;
use Qazana\Extensions\Library\Documents\Section;
use Qazana\Extensions\Library\Classes\Shortcode;

if ( ! defined( 'ABSPATH' ) ) {	exit; } // Exit if accessed directly

class Library extends Base {

	public function __construct() {
        require( 'documents/library.php' );
        require( 'documents/library-page.php' );
        require( 'documents/library-section.php' );
        require( 'shortcodes/shortcode.php' );
		require( 'wp-widgets/qazana-library.php' );

        qazana()->get_documents()
			->register_document_type( 'page', Page::get_class_full_name() )
			->register_document_type( 'section', Section::get_class_full_name() )
			->register_group( 'blocks', [
				'label' => __( 'Blocks', 'qazana' ),
			] )->register_group( 'pages', [
				'label' => __( 'Pages', 'qazana' ),
			] );

    
		$this->add_filters();
		$this->add_actions();

		new Shortcode();
	}

    public function register() {
        return [
        	'title' => __( 'Library', 'qazana' ),
            'name' => 'library',
        	'required' => true,
        	'default_activation' => true,
            'widgets' => [
    			'Template',
    		]
        ];
    }

	public function get_name() {
		return 'library';
	}

	public function register_wp_widgets() {
		register_widget( 'Qazana\Extensions\Library\WP_Widgets\Qazana_Library' );
	}

	public function localize_settings() {
		qazana()->editor->add_localize_settings( 'i18n', [
			'home_url'      => home_url(),
			'edit_template' => __( 'Edit Template', 'qazana' ),
		] );
	}

	public function add_actions() {
		if ( current_user_can( 'edit_theme_options' ) ) {
			add_action( 'init', [ $this, 'localize_settings' ] ); // Use the `init` hook because the translations are needed in Admin Widgets, WordPress Customizer, and the Qazana Panel
		}

		add_action( 'widgets_init', [ $this, 'register_wp_widgets' ] );
	}

	public function add_filters() {
		add_filter( 'qazana/widgets/black_list', function ( $black_list ) {
			$black_list[] = 'Qazana\Extensions\Library\WP_Widgets\Qazana_Template';
			return $black_list;
		} );
	}

	public static function get_templates() {
		$source = qazana()->templates_manager->get_source( 'local' );

		return $source->get_items();
	}

	public static function empty_templates_message() {
		return '<div id="qazana-widget-template-empty-templates">
				<div class="qazana-widget-template-empty-templates-icon"><i class="eicon-nerd"></i></div>
				<div class="qazana-widget-template-empty-templates-title">' . __( 'You Haven\'t Saved Templates Yet.', 'qazana' ) . '</div>
				<div class="qazana-widget-template-empty-templates-footer">' . __( 'What is Library?', 'qazana' ) . ' <a class="qazana-widget-template-empty-templates-footer-url" href="https://qazana.net/qazana/docs/library/" target="_blank">' . __( 'Read our tutorial on using Library templates.', 'qazana' ) . '</a>
				</div>
				</div>';
	}
}
