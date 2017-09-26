<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Preview {

	/**
	 * Initialize the preview mode. Fired by `init` action.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function init() {
		if ( is_admin() || ! $this->is_preview_mode() ) {
			return;
		}

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

        	add_action( 'radium_after_loop', [ $this, 'preview_grid' ] );
		add_filter( 'the_content', [ $this, 'builder_wrapper' ], 999999 );

		// Tell to WP Cache plugins do not cache this request.
		Utils::do_not_cache();
	}

	/**
	 * Method detect if we are in the preview mode (iFrame).
	 *
	 * @since 1.0.0
	 * @return bool
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
	 * Do not show the content from the page. Just print empty start HTML.
	 * The Javascript will add the content later.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function builder_wrapper() {
		return '<div id="qazana" class="qazana qazana-edit-mode"></div>';
	}

	/**
	 * Enqueue preview scripts and styles.
	 *
	 * @since 1.0.0
	 * @return void
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

	private function enqueue_scripts() {

		qazana()->frontend->register_scripts();
		qazana()->frontend->enqueue_scripts();
		
		do_action( 'qazana/preview/enqueue_scripts' );
	}

    public function preview_grid() {

        echo '<div id="grid">
            <div class="qazana-container">
                <div class="qazana-row">
                    <div class="qazana-column" data-col="12"><div class="shadow"></div></div>
                    <div class="qazana-column" data-col="12"><div class="shadow"></div></div>
                    <div class="qazana-column" data-col="12"><div class="shadow"></div></div>
                    <div class="qazana-column" data-col="12"><div class="shadow"></div></div>
                    <div class="qazana-column" data-col="12"><div class="shadow"></div></div>
                    <div class="qazana-column" data-col="12"><div class="shadow"></div></div>
                    <div class="qazana-column" data-col="12"><div class="shadow"></div></div>
                    <div class="qazana-column" data-col="12"><div class="shadow"></div></div>
                    <div class="qazana-column" data-col="12"><div class="shadow"></div></div>
                    <div class="qazana-column" data-col="12"><div class="shadow"></div></div>
                    <div class="qazana-column" data-col="12"><div class="shadow"></div></div>
                    <div class="qazana-column" data-col="12"><div class="shadow"></div></div>
                </div>
            </div>
        </div>';
    }

    /**
     * Preview constructor.
     *
     * @since 1.0.0
     */
    public function __construct() {
        add_action( 'template_redirect', [ $this, 'init' ] );
    }
}
