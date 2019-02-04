<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Qazana preview.
 *
 * Qazana preview handler class is responsible for initializing Qazana in
 * preview mode.
 *
 * @since 1.0.0
 */
class Preview {

	/**
	 * Post ID.
	 *
	 * Holds the ID of the current post being previewed.
	 *
	 * @since 1.0.0
	 * @access private
	 *
	 * @var int Post ID.
	 */
	private $post_id;

	/**
	 * Init.
	 *
	 * Initialize Qazana preview mode.
	 *
	 * Fired by `template_redirect` action.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function init() {
		if ( is_admin() || ! $this->is_preview_mode() ) {
			return;
		}
	
		$this->post_id = get_the_ID();

		// Don't redirect to permalink.
		remove_action( 'template_redirect', 'redirect_canonical' );

		// Disable the WP admin bar in preview mode.
		add_filter( 'show_admin_bar', '__return_false' );

		add_action(
			'wp_enqueue_scripts',
			function() {
				$this->enqueue_styles();
				$this->enqueue_scripts();
			}
		);

		add_filter( 'the_content', [ $this, 'builder_wrapper' ], 999999 );

		add_action( 'wp_footer', [ $this, 'wp_footer' ] );

		// Tell to WP Cache plugins do not cache this request.
		Utils::do_not_cache();

		/**
		 * Preview init.
		 *
		 * Fires on Qazana preview init, after Qazana preview has finished
		 * loading but before any headers are sent.
		 *
		 * @since 1.0.0
		 *
		 * @param Preview $this The current preview.
		 */
		do_action( 'qazana/preview/init', $this );
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
	 * @param int $post_id Optional. Post ID. Default is `0`.
	 *
	 * @return bool Whether preview mode is active.
	 */
	public function is_preview_mode( $post_id = 0 ) {
		if ( empty( $post_id ) ) {
			$post_id = get_the_ID();
		}

		if ( ! User::is_current_user_can_edit( $post_id ) ) {
			return false;
		}

		if ( ! isset( $_GET['qazana-preview'] ) || $post_id !== (int) $_GET['qazana-preview'] ) {
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
	 * @param string $content The content of the builder.
	 *
	 * @return string HTML wrapper for the builder.
	 */
	public function builder_wrapper( $content ) {
		if ( get_the_ID() === $this->post_id ) {
			$classes = 'qazana-edit-mode';

			$document = qazana()->get_documents()->get( $this->post_id );

			if ( $document ) {
				$classes .= ' ' . $document->get_container_classes();
			}

			$content = '<div id="qazana" class="' . $classes . '"></div>';
		}

		return $content;
	}

	/**
	 * Enqueue preview styles.
	 *
	 * Registers all the preview styles and enqueues them.
	 *
	 * Fired by `wp_enqueue_scripts` action.
	 *
	 * @since 1.0.0
	 * @access private
	 */
	private function enqueue_styles() {
		// Hold-on all jQuery plugins after all HTML markup render.
		wp_add_inline_script( 'jquery-migrate', 'jQuery.holdReady( true );' );

		qazana()->get_frontend()->enqueue_styles();

		$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

		$direction_suffix = is_rtl() ? '-rtl' : '';

		wp_register_style(
			'qazana-select2',
			qazana()->core_assets_url . 'lib/e-select2/css/e-select2' . $suffix . '.css',
			[],
			'4.0.6-rc.1'
		);

		wp_register_style(
			'editor-preview',
			qazana()->core_assets_url . 'css/editor-preview' . $direction_suffix . $suffix . '.css',
			[ 'qazana-select2' ],
			qazana_get_version()
		);

		wp_enqueue_style( 'editor-preview' );

		/**
		 * Preview enqueue styles.
		 *
		 * Fires after Qazana preview styles are enqueued.
		 *
		 * @since 1.0.0
		 */
		do_action( 'qazana/preview/enqueue_styles' );
	}

	/**
	 * Enqueue preview scripts.
	 *
	 * Registers all the preview scripts and enqueues them.
	 *
	 * Fired by `wp_enqueue_scripts` action.
	 *
	 * @since 1.0.0
	 * @access private
	 */
	private function enqueue_scripts() {
		qazana()->get_frontend()->register_scripts();

		$suffix = Utils::is_script_debug() ? '' : '.min';

		wp_enqueue_script(
			'qazana-inline-editor',
			qazana()->core_assets_url . 'lib/inline-editor/js/inline-editor' . $suffix . '.js',
			[],
			qazana_get_version(),
			true
		);

		/**
		 * Preview enqueue scripts.
		 *
		 * Fires after Qazana preview scripts are enqueued.
		 *
		 * @since 1.5.4
		 */
		do_action( 'qazana/preview/enqueue_scripts' );
	}

	/**
	 * Qazana Preview footer scripts and styles.
	 *
	 * Handle styles and scripts from frontend.
	 *
	 * Fired by `wp_footer` action.
	 *
	 * @since 2.0.9
	 * @access public
	 */
	public function wp_footer() {
		$frontend = qazana()->get_frontend();
		if ( $frontend->has_qazana_in_page() ) {
			// Has header/footer/widget-template - enqueue all style/scripts/fonts.
			$frontend->wp_footer();
		} else {
			// Enqueue only scripts.
			$frontend->enqueue_scripts();
		}
	}

	public function filter_post_terms_taxonomy_arg( $taxonomy_args ) {
		$current_post_id = get_the_ID();
		$document = qazana()->get_documents()->get( $current_post_id );

		if ( $document ) {
			// Show all taxonomies
			unset( $taxonomy_args['object_type'] );
		}

		return $taxonomy_args;
	}

	/**
	 * @access public
	 */
	public function switch_to_preview_query() {
		$current_post_id = get_the_ID();
		$document = qazana()->get_documents()->get_doc_or_auto_save( $current_post_id );

		if ( ! $document ) {
			return;
		}

		$new_query_vars = $document->get_preview_as_query_args();

		qazana()->get_db()->switch_to_query( $new_query_vars );
	}

	/**
	 * @access public
	 */
	public function restore_current_query() {
		qazana()->get_db()->restore_current_query();
	}

	/**
	 * Preview constructor.
	 *
	 * Initializing Qazana preview.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function __construct() {
		add_action( 'template_redirect', [ $this, 'init' ], 0 );
		add_filter( 'qazana/dynamic_tags/post_terms/taxonomy_args', [ $this, 'filter_post_terms_taxonomy_arg' ] );
		add_action( 'qazana/template-library/before_get_source_data', [ $this, 'switch_to_preview_query' ] );
		add_action( 'qazana/dynamic_tags/before_render', [ $this, 'switch_to_preview_query' ] );
		add_action( 'qazana/dynamic_tags/after_render', [ $this, 'restore_current_query' ] );
	}
}
