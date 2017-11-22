<?php
namespace Qazana;

use Qazana\Core\Settings\Manager as SettingsManager;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Frontend {

	const THE_CONTENT_FILTER_PRIORITY = 9;

	private $google_fonts = [];
	private $registered_fonts = [];
	private $google_early_access_fonts = [];

	private $_is_frontend_mode = false;
	private $_has_qazana_in_page = false;
	private $_is_excerpt = false;
	private $content_removed_filters = [];

	/**
	 * [$scripts description]
	 * @var array
	 */
	private $element_stylesheets = array();

	/**
	 * [$scripts description]
	 * @var array
	 */
	private $element_scripts = array();

	/**
	 * @var Stylesheet
	 */
	private $stylesheet;

	/**
	 * Initialize
	 *
	 * @method init
	 *
	 * @return void
	 */
	public function init() {
		if ( qazana()->editor->is_edit_mode() ) {
			return;
		}

		add_filter( 'body_class', [ $this, 'body_class' ] );
		if ( qazana()->preview->is_preview_mode() ) {
			return;
		}

		$this->_is_frontend_mode = true;
		$this->_has_qazana_in_page = is_singular() && qazana()->db->is_built_with_qazana( get_the_ID() );

		// Add element script and css dependencies
		$this->get_dependencies( get_the_ID() );

		if ( $this->_has_qazana_in_page ) {
			add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_styles' ] );
			add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_widget_scripts' ], 999 );
			add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_widget_styles' ], 999 );
		}

		add_action( 'wp_head', [ $this, 'print_google_fonts' ] );
		add_action( 'wp_footer', [ $this, 'wp_footer' ] );

		// Add Edit with Qazana in Admin Bar
		add_action( 'admin_bar_menu', [ $this, 'add_menu_in_admin_bar' ], 200 );
	}

	/**
	 * @param array $data a set of elements
	 * @param string $method (on_export|on_import)
	 *
	 * @return mixed
	 */
	protected function get_dependencies( $post_id ) {

		if ( $this->_is_excerpt ) {
			return;
		}

		$data = qazana()->db->get_plain_editor( $post_id );
		$data = apply_filters( 'qazana/frontend/builder_content_data', $data, $post_id );

		qazana()->db->iterate_data( $data, function( $element ) {

			$element_instance = qazana()->elements_manager->create_element_instance( $element );

			// Exit if the element doesn't exist
			if ( ! $element_instance ) {
				return $element;
			}

			$element_instance->add_element_dependencies();

			// Add skin dependencies.
			if ( 'widget' === $element['elType'] && $skin = $element_instance->get_current_skin() ) {

				$skin->set_parent( $element_instance ); // Match skins scope
				$skin->add_element_dependencies();

				if ( ! empty( $skin->get_parent()->_element_stylesheets ) && is_array( $skin->get_parent()->_element_stylesheets ) ) {
					foreach ( $skin->get_parent()->_element_stylesheets as $key ) {
						$this->element_stylesheets[] = $key;
					}
				}

				if ( ! empty( $skin->get_parent()->_element_scripts ) && is_array( $skin->get_parent()->_element_scripts ) ) {
					foreach ( $skin->get_parent()->_element_scripts as $key ) {
						$this->element_scripts[] = $key;
					}
				}
			}

			// Add normal widget dependencies.
			if ( ! empty( $element_instance->_element_stylesheets ) && is_array( $element_instance->_element_stylesheets ) ) {
				foreach ( $element_instance->_element_stylesheets as $key ) {
					$this->element_stylesheets[] = $key;
				}
			}

			if ( ! empty( $element_instance->_element_scripts ) && is_array( $element_instance->_element_scripts ) ) {
				foreach ( $element_instance->_element_scripts as $key ) {
					$this->element_scripts[] = $key;
				}
			}

			return $element;
		});

	}

	/**
	 * @param array $data a set of elements
	 *
	 * @return mixed
	 */
	public function generate_element_instances( $post_id = null ) {

		$post_id = $post_id ? $post_id : get_the_id();

		$data = qazana()->db->get_plain_editor( $post_id );
		$data = apply_filters( 'qazana/frontend/builder_content_data', $data, $post_id );

		qazana()->db->iterate_data( $data, function( $element ) {

	        $element_instance = qazana()->elements_manager->create_element_instance( $element );

	        // Exit if the element doesn't exist
	        if ( ! $element_instance ) {
	            return $element;
	        }

	        qazana()->elements_manager->add_element_instance( $element_instance );

	        return $element;
	    });

	}

	public function enqueue_widget_scripts() {

		if ( ! empty( $this->element_scripts ) && is_array( $this->element_scripts ) ) {
			foreach ( $this->element_scripts as $key ) {
				wp_enqueue_script( $key );
			}
		}
	}

	public function enqueue_widget_styles() {
		if ( ! empty( $this->element_stylesheets ) && is_array( $this->element_stylesheets ) ) {
			foreach ( $this->element_stylesheets as $key ) {
				wp_enqueue_style( $key );
			}
		}
	}

	protected function _print_elements( $elements_data ) {
		foreach ( $elements_data as $element_data ) {
			$element = qazana()->elements_manager->create_element_instance( $element_data );

			if ( ! $element ) {
				continue;
			}

			$element->print_element();
		}
	}

	public function body_class( $classes = [] ) {
		$classes[] = 'qazana-default';

		$id = get_the_ID();

		if ( is_singular() && qazana()->db->is_built_with_qazana( $id ) ) {
			$classes[] = 'qazana-page qazana-page-' . $id;
		}

		return $classes;
	}

    /**
	 * Add content filter.
	 *
	 * Remove plain content and render the content generated by Qazana.
	 *
	 * @since 1.3.0
	 * @access public
	 */
	public function add_content_filter() {
		add_filter( 'the_content', [ $this, 'apply_builder_in_content' ], self::THE_CONTENT_FILTER_PRIORITY );
	}

	/**
	 * Remove content filter.
	 *
	 * When the Qazana generated content rendered, we remove the filter to prevent multiple accuracies. This way we
	 * make sure Qazana renders the content only once.
	 *
	 * @since 1.3.0
	 * @access public
	 */
	public function remove_content_filter() {
		remove_filter( 'the_content', [ $this, 'apply_builder_in_content' ], self::THE_CONTENT_FILTER_PRIORITY );
    }
  
    public function register_scripts() {

		do_action( 'qazana/frontend/before_register_scripts' );

		$suffix = Utils::is_script_debug() ? '' : '.min';

        wp_register_script(
            'waypoints',
            qazana()->core_assets_url . 'lib/waypoints/waypoints' . $suffix . '.js',
            [
                'jquery',
            ],
            '2.0.2',
            true
        );

        wp_register_script(
            'qazana-frontend',
            qazana()->core_assets_url . 'js/frontend' . $suffix . '.js',
            [
				'waypoints',
            ],
            qazana_get_version(),
            true
        );

		do_action( 'qazana/frontend/after_register_scripts' );
	}

	public function enqueue_scripts() {

		do_action( 'qazana/frontend/before_enqueue_scripts' );

		wp_enqueue_script( 'qazana-frontend' );

		$post = get_post();

		$qazana_frontend_config = [
			'ajaxurl'        => admin_url( 'admin-ajax.php' ),
			'home_url'       => home_url(),
			'google_api_key' => get_option( 'qazana_google_maps_api_key', '' ),
			'assets_url'     => qazana()->core_assets_url,
			'nonce'          => wp_create_nonce( 'qazana-frontend' ),
			'isEditMode'     => qazana()->preview->is_preview_mode(),
			'settings'       => SettingsManager::get_settings_frontend_config(),
			'is_rtl'         => is_rtl(),
			'post'           => [
				'id'      => $post->ID,
				'title'   => $post->post_title,
				'excerpt' => $post->post_excerpt,
			],
			'urls' => [
				'assets' => qazana()->core_assets_url,
			],
		];

		if ( qazana()->preview->is_preview_mode() ) {
			$elements_manager = qazana()->elements_manager;

			$elements_frontend_keys = [
				'section' => $elements_manager->get_element_types( 'section' )->get_frontend_settings_keys(),
				'column' => $elements_manager->get_element_types( 'column' )->get_frontend_settings_keys(),
			];

			$elements_frontend_keys += qazana()->widgets_manager->get_widgets_frontend_settings_keys();

			$qazana_frontend_config['elements'] = [
				'data' => (object) [],
				'editSettings' => (object) [],
				'keys' => $elements_frontend_keys,
			];
		}

		$qazana_frontend_config = apply_filters( 'qazana/frontend/localize_settings', $qazana_frontend_config );

		wp_localize_script( 'qazana-frontend', 'qazanaFrontendConfig', $qazana_frontend_config );

		do_action( 'qazana/frontend/after_enqueue_scripts' );
	}

	public function register_widget_scripts() {

		do_action( 'qazana/frontend/before_register_widget_scripts' );

		$suffix = Utils::is_script_debug() ? '' : '.min';

        wp_register_script(
            'jquery-slick',
            qazana()->core_assets_url . 'lib/slick/slick' . $suffix . '.js',
            [
                'jquery',
            ],
            '1.6.0',
            true
        );

		do_action( 'qazana/frontend/after_register_widget_scripts' );

	}

    public function register_styles() {

		do_action( 'qazana/frontend/before_register_styles' );

        $suffix = Utils::is_script_debug() ? '' : '.min';

        $direction_suffix = is_rtl() ? '-rtl' : '';

		wp_register_style(
            'qazana-icons',
            qazana()->core_assets_url . 'lib/eicons/css/icons' . $suffix . '.css',
            [],
            qazana_get_version()
        );

        wp_register_style(
            'qazana-frontend',
            qazana()->core_assets_url . 'css/frontend' . $direction_suffix . $suffix . '.css',
            [
                'qazana-icons',
                'font-awesome',
            ],
            qazana_get_version()
        );

		do_action( 'qazana/frontend/after_register_styles' );
	}

	public function enqueue_styles() {
		do_action( 'qazana/frontend/before_enqueue_styles' );

		wp_enqueue_style( 'qazana-icons' );
		wp_enqueue_style( 'qazana-frontend' );

		if ( ! qazana()->preview->is_preview_mode() ) {
			$this->parse_global_css_code();

			$css_file = new Post_CSS_File( get_the_ID() );
			$css_file->enqueue();
		}

		do_action( 'qazana/frontend/after_enqueue_styles' );
	}

	/**
	 * Handle style that are not printed in the header
	 */
	public function wp_footer() {
		if ( ! $this->_has_qazana_in_page ) {
			return;
		}

		$this->enqueue_styles();
		$this->enqueue_scripts();

		$this->print_google_fonts();
	}

    /**
     * TODO // Optimize, load with wp_enqueue, add to wp_resource_hints, load only used weights
     *
     * @return void
     */
	public function print_google_fonts() {
		if ( ! apply_filters( 'qazana/frontend/print_google_fonts', true ) ) {
			return;
		}

		// Print used fonts
		if ( ! empty( $this->google_fonts ) ) {
			foreach ( $this->google_fonts as &$font ) {
				$font = str_replace( ' ', '+', $font ) . ':100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic';
			}

			$fonts_url = sprintf( 'https://fonts.googleapis.com/css?family=%s', implode( '|', $this->google_fonts ) );

			$subsets = [
				'ru_RU' => 'cyrillic',
				'bg_BG' => 'cyrillic',
				'he_IL' => 'hebrew',
				'el' => 'greek',
				'vi' => 'vietnamese',
				'uk' => 'cyrillic',
				'cs_CZ' => 'latin-ext',
				'ro_RO' => 'latin-ext',
				'pl_PL' => 'latin-ext',
			];
			$locale = get_locale();

			if ( isset( $subsets[ $locale ] ) ) {
				$fonts_url .= '&subset=' . $subsets[ $locale ];
			}

			echo '<link rel="stylesheet" type="text/css" href="' . $fonts_url . '">';
			$this->google_fonts = [];
		}

		if ( ! empty( $this->google_early_access_fonts ) ) {
			foreach ( $this->google_early_access_fonts as $current_font ) {
				printf( '<link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/earlyaccess/%s.css">', strtolower( str_replace( ' ', '', $current_font ) ) );
			}
			$this->google_early_access_fonts = [];
		}
	}

	public function enqueue_font( $font ) {
		$font_type = Fonts::get_font_type( $font );
		$cache_id = $font_type . $font;

		if ( in_array( $cache_id, $this->registered_fonts ) ) {
			return;
		}

		switch ( $font_type ) {
			case Fonts::GOOGLE:
				if ( ! in_array( $font, $this->google_fonts ) ) {
					$this->google_fonts[] = $font;
				}
				break;

			case Fonts::EARLYACCESS:
				if ( ! in_array( $font, $this->google_early_access_fonts ) ) {
					$this->google_early_access_fonts[] = $font;
				}
				break;
		}

		$this->registered_fonts[] = $cache_id;
	}

	protected function parse_global_css_code() {
		$scheme_css_file = new Global_CSS_File();

		$scheme_css_file->enqueue();
	}

	public function apply_builder_in_content( $content ) {
		$this->restore_content_filters();

		if ( ! $this->_is_frontend_mode || $this->_is_excerpt ) {
			return $content;
		}

		// Remove the filter itself in order to allow other `the_content` in the elements
		$this->remove_content_filter();
 
		$post_id = get_the_ID();
		$builder_content = $this->get_builder_content( $post_id );

		if ( ! empty( $builder_content ) ) {
			$content = $builder_content;
			$this->remove_content_filters();
		}

		// Add the filter again for other `the_content` calls
		$this->add_content_filter();

		return $content;
	}

	public function get_builder_content( $post_id, $with_css = false ) {
		if ( post_password_required( $post_id ) ) {
			return '';
		}

		if ( ! qazana()->db->is_built_with_qazana( $post_id ) ) {
			return '';
		}

		$data = qazana()->db->get_plain_editor( $post_id );
		$data = apply_filters( 'qazana/frontend/builder_content_data', $data, $post_id );

		if ( empty( $data ) ) {
			return '';
		}

		if ( ! $this->_is_excerpt ) {
			$css_file = new Post_CSS_File( $post_id );
			$css_file->enqueue();
		}

		ob_start();

		// Handle JS and Customizer requests, with css inline.
		if ( is_customize_preview() || Utils::is_ajax() ) {
			$with_css = true;
		}

		if ( ! empty( $css_file ) && $with_css ) {
			echo '<style>' . $css_file->get_css() . '</style>';
		}

		?>
		<div class="qazana qazana-<?php echo $post_id; ?>">
			<div class="qazana-inner">
				<div class="qazana-section-wrap">
					<?php $this->_print_elements( $data ); ?>
				</div>
			</div>
		</div>
		<?php
		$content = apply_filters( 'qazana/frontend/the_content', ob_get_clean() );

		if ( ! empty( $content ) ) {
			$this->_has_qazana_in_page = true;
		}

		return $content;
	}

	public function add_menu_in_admin_bar( \WP_Admin_Bar $wp_admin_bar ) {
		$post_id = get_the_ID();

		$is_builder_mode = is_singular() && User::is_current_user_can_edit( $post_id ) && qazana()->db->is_built_with_qazana( $post_id );

		if ( ! $is_builder_mode ) {
			return;
		}

		$wp_admin_bar->add_node( [
			'id' => 'qazana_edit_page',
			'title' => __( 'Edit with Qazana', 'qazana' ),
			'href' => Utils::get_edit_link( $post_id ),
		] );
	}

	public function get_builder_content_for_display( $post_id ) {
		if ( ! get_post( $post_id ) ) {
			return '';
		}

		// Avoid recursion
		if ( get_the_ID() === (int) $post_id ) {
			$content = '';
			if ( qazana()->editor->is_edit_mode() ) {
				$content = '<div class="qazana-alert qazana-alert-danger">' . __( 'Invalid Data: The Template ID cannot be the same as the currently edited template. Please choose a different one.', 'qazana' ) . '</div>';
			}

			return $content;
		}

		// Add element script and css dependencies.
        $this->get_dependencies( $post_id );
        $this->enqueue_widget_scripts();
        $this->enqueue_widget_styles();

		// Set edit mode as false, so don't render settings and etc. use the $is_edit_mode to indicate if we need the css inline.
		$is_edit_mode = qazana()->editor->is_edit_mode();
		qazana()->editor->set_edit_mode( false );

		// Change the global post to current library post, so widgets can use `get_the_ID` and other post data.
		qazana()->db->switch_to_post( $post_id );

		$content = $this->get_builder_content( $post_id, $is_edit_mode );

		qazana()->db->restore_current_post();

		// Restore edit mode state.
        qazana()->editor->set_edit_mode( $is_edit_mode );

		return $content;
	}

	public function start_excerpt_flag( $excerpt ) {
		$this->_is_excerpt = true;
		return $excerpt;
	}

	public function end_excerpt_flag( $excerpt ) {
		$this->_is_excerpt = false;
		return $excerpt;
	}

	/**
	 * Remove WordPress default filters that conflicted with Qazana
	 */
	public function remove_content_filters() {
		$filters = [
			'wpautop',
			'shortcode_unautop',
			'wptexturize',
		];

		foreach ( $filters as $filter ) {
			// Check if another plugin/theme do not already removed the filter
			if ( has_filter( 'the_content', $filter ) ) {
				remove_filter( 'the_content', $filter );
				$this->content_removed_filters[] = $filter;
			}
		}
	}

	private function restore_content_filters() {
		foreach ( $this->content_removed_filters as $filter ) {
			add_filter( 'the_content', $filter );
		}
		$this->content_removed_filters = [];
	}

	public function __construct() {
		// We don't need this class in admin side, but in AJAX requests.
		if ( is_admin() && ! Utils::is_ajax() ) {
			return;
		}

		add_action( 'template_redirect', [ $this, 'init' ] );
		add_action( 'wp_enqueue_scripts', [ $this, 'register_scripts' ], 5 );
		add_action( 'wp_enqueue_scripts', [ $this, 'register_styles' ], 5 );
		add_filter( 'the_content', [ $this, 'apply_builder_in_content' ], self::THE_CONTENT_FILTER_PRIORITY );

		// Hack to avoid enqueue post css while it's a `the_excerpt` call.
		add_filter( 'get_the_excerpt', [ $this, 'start_excerpt_flag' ], 1 );
		add_filter( 'get_the_excerpt', [ $this, 'end_excerpt_flag' ], 20 );
	}
}
