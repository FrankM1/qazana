<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Preview {

    private $post_id;

	/**
	 * Initialize the preview mode. Fired by `init` action.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function init() {
		if ( is_admin() || ! $this->is_preview_mode() ) {
			return;
		}

        $this->post_id = get_the_ID();
        
		// Compatibility with Yoast SEO plugin when 'Removes unneeded query variables from the URL' enabled.
		// TODO: Move this code to `includes/compatibility.php`.
		if ( class_exists( 'WPSEO_Frontend' ) ) {
			remove_action( 'template_redirect', [ \WPSEO_Frontend::get_instance(), 'clean_permalink' ], 1 );
		}

		// Disable the WP admin bar in preview mode.
		add_filter( 'show_admin_bar', '__return_false' );

		add_action( 'wp_enqueue_scripts', function() {
			$this->enqueue_styles();
			$this->enqueue_scripts();
		} );

		add_filter( 'the_content', [ $this, 'builder_wrapper' ], 999999 );

		// Tell to WP Cache plugins do not cache this request.
		Utils::do_not_cache();

		do_action( 'qazana/preview/init', $this );
	}

	/**
	 * Retrieve post ID.
	 *
	 * Get the ID of the current post.
	 *
	 * @since 1.0.0
	 * @access public
	 * 
	 * @return int Post ID.
	 */
	public function get_post_id() {
		return $this->post_id;
	}

	/**
	 * Whether preview mode is active.
	 *
	 * Used to determine whether we are in the preview mode (iframe).
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return bool Whether preview mode is active.
	 */
	public function is_preview_mode() {
		if ( ! User::is_current_user_can_edit() ) {
			return false;
		}

		if ( ! isset( $_GET['qazana-preview'] ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Builder wrapper.
	 *
	 * Used to add an empty HTML wrapper for the builder, the javascript will add
	 * the content later.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string HTML wrapper for the builder.
	 */
	public function builder_wrapper() {
		return '<div id="qazana" class="qazana qazana-edit-mode"></div>';
	}

	/**
	 * Enqueue preview styles.
	 *
	 * @since 1.0.0
	 * @access private
	 */
	private function enqueue_styles() {
		// Hold-on all jQuery plugins after all HTML markup render.
		wp_add_inline_script( 'jquery-migrate', 'jQuery.holdReady( true );' );

		qazana()->frontend->enqueue_styles();

		$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

		$direction_suffix = is_rtl() ? '-rtl' : '';

		wp_register_style(
			'editor-preview',
			qazana()->core_assets_url . 'css/editor-preview' . $direction_suffix . $suffix . '.css',
			[],
			qazana_get_version()
		);

		wp_enqueue_style( 'editor-preview' );

		do_action( 'qazana/preview/enqueue_styles' );
	}

	/**
	 * Enqueue preview scripts.
	 *
	 * @since 1.0.0
	 * @access private
	 */
	private function enqueue_scripts() {

        $suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

        wp_enqueue_script(
            'qazana-inline-editor',
            qazana()->core_assets_url . 'lib/inline-editor/js/inline-editor' . $suffix . '.js',
            [],
            '',
            true
        );

		qazana()->frontend->register_scripts();
		qazana()->frontend->enqueue_scripts();
		
		do_action( 'qazana/preview/enqueue_scripts' );
	}

	/**
	 * Preview constructor.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function __construct() {
		add_action( 'template_redirect', [ $this, 'init' ], 0 );
	}
}
