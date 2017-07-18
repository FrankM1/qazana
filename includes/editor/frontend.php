<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Frontend {

	private $_enqueue_google_fonts = [];
	private $_enqueue_google_early_access_fonts = [];

	private $_is_frontend_mode = false;
	private $_has_qazana_in_page = false;

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

	public function init() {
		if ( qazana()->editor->is_edit_mode() || qazana()->preview->is_preview_mode() ) {
			return;
		}

		$this->_is_frontend_mode = true;
		$this->_has_qazana_in_page = qazana()->db->has_qazana_in_post( get_the_ID() );

		$this->get_dependencies();
		$this->_init_stylesheet();

		add_action( 'wp_head', [ $this, 'print_css' ] );
		add_filter( 'body_class', [ $this, 'body_class' ] );

		if ( $this->_has_qazana_in_page ) {
			add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_styles' ], 999 );
			add_action( 'wp_enqueue_scripts', [ $this, 'load_widget_scripts' ], 999 );
			add_action( 'wp_enqueue_scripts', [ $this, 'load_widget_stylesheets' ], 999 );
		}

		add_action( 'wp_footer', [ $this, 'wp_footer' ] );

		// Add Edit with the Qazana in Admin Bar
		add_action( 'admin_bar_menu', [ $this, 'add_menu_in_admin_bar' ], 200 );
	}

	/**
	 * @param array $data a set of elements
	 * @param string $method (on_export|on_import)
	 *
	 * @return mixed
	 */
	protected function get_dependencies() {

		$data = qazana()->db->get_plain_editor( get_the_ID() );
		$data = apply_filters( 'qazana/frontend/qazana_content_data', $data, get_the_ID() );

		qazana()->db->iterate_data( $data, function( $element ) {

			$element_instance = qazana()->elements_manager->create_element_instance( $element );

			// If the widget/element isn't exist, like a plugin that creates a widget but deactivated
			if ( ! $element_instance ) {
				return $element;
			}

			$element_instance->add_element_dependencies();

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
		} );

	}

	public function load_widget_scripts() {
		if ( ! empty( $this->element_scripts ) && is_array( $this->element_scripts ) ) {
			foreach ( $this->element_scripts as $key ) {
				wp_enqueue_script( $key );
			}
		}
	}

	public function load_widget_stylesheets() {
		if ( ! empty( $this->element_stylesheets ) && is_array( $this->element_stylesheets ) ) {
			foreach ( $this->element_stylesheets as $key ) {
				wp_enqueue_style( $key );
			}
		}
	}

	private function _init_stylesheet() {
		$this->stylesheet = new Stylesheet();

		$breakpoints = Responsive::get_breakpoints();

		$this->stylesheet
			->add_device( 'mobile', $breakpoints['md'] - 1 )
			->add_device( 'tablet', $breakpoints['lg'] - 1 );


	}

	protected function _print_elements( $elements_data ) {
		foreach ( $elements_data as $element_data ) {
			$element = qazana()->elements_manager->create_element_instance( $element_data );
			$element->print_element();
		}
	}

	public function body_class( $classes = [] ) {
		if ( is_singular() && 'qazana' === qazana()->db->get_edit_mode( get_the_ID() ) ) {
			$classes[] = 'qazana-page';
		}
		return $classes;
	}

    public function enqueue_scripts() {

		do_action( 'qazana/frontend/before_enqueue_scripts' );

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
            'odometer',
            qazana()->core_assets_url . 'lib/odometer/odometer' . $suffix . '.js',
            [],
            '0.4.8',
            true
        );

		wp_register_script(
            'jquery-circle-progress',
            qazana()->core_assets_url . 'lib/jquery-circle-progress/circle-progress' . $suffix . '.js',
            [],
            '1.2.2',
            true
        );

        wp_register_script(
            'jquery-slick',
            qazana()->core_assets_url . 'lib/slick/slick' . $suffix . '.js',
            [
                'jquery',
            ],
            '1.6.0',
            true
        );

        wp_register_script(
            'qazana-frontend',
            qazana()->core_assets_url . 'js/frontend' . $suffix . '.js',
            [
				'waypoints',
            ],
            qazana()->get_version(),
            true
        );

        wp_enqueue_script( 'qazana-frontend' );

		$qazana_frontend_config = [
			'ajaxurl' => admin_url( 'admin-ajax.php' ),
            'home_url' => home_url(),
			'isEditMode' => qazana()->editor->is_edit_mode(),
			'stretchedSectionContainer' => get_option( 'qazana_stretched_section_container', '' ),
			'google_api_key' => get_option( 'qazana_google_maps_api_key', '' ),
			'is_rtl' => is_rtl(),
			'assets_url' => qazana()->core_assets_url,
			'nonce' => wp_create_nonce( 'qazana-frontend' ),
		];

		$elements_manager = qazana()->elements_manager;

		$elements_frontend_keys = [
			'section' => $elements_manager->get_element_types( 'section' )->get_frontend_settings_keys(),
			'column' => $elements_manager->get_element_types( 'column' )->get_frontend_settings_keys(),
		];

		$elements_frontend_keys += qazana()->widgets_manager->get_widgets_frontend_settings_keys();

		if ( qazana()->editor->is_edit_mode() ) {
			$qazana_frontend_config['elements'] = [
				'data' => (object) [],
				'keys' => $elements_frontend_keys,
			];
		}

		$qazana_frontend_config = apply_filters( 'qazana/frontend/localize_settings', $qazana_frontend_config );

		wp_localize_script( 'qazana-frontend', 'qazanaFrontendConfig', $qazana_frontend_config );

		do_action( 'qazana/frontend/after_enqueue_scripts' );

    }

    public function enqueue_styles() {
        $suffix = Utils::is_script_debug() ? '' : '.min';

        $direction_suffix = is_rtl() ? '-rtl' : '';

        wp_register_style(
            'odometer-theme-default',
            qazana()->core_assets_url . 'lib/odometer/themes/odometer-theme-default' . $suffix . '.css',
            [],
            qazana()->get_version()
        );

		wp_register_style(
            'qazana-icons',
            qazana()->core_assets_url . 'lib/eicons/css/icons' . $suffix . '.css',
            [],
            qazana()->get_version()
        );

        wp_register_style(
            'qazana-frontend',
            qazana()->core_assets_url . 'css/frontend' . $direction_suffix . $suffix . '.css',
            [
                'qazana-icons',
                'font-awesome',
            ],
            qazana()->get_version()
        );

		wp_enqueue_style( 'qazana-frontend' );

		$css_file = new Post_CSS_File( get_the_ID() );
		$css_file->enqueue();

		do_action( 'qazana/frontend/after_enqueue_styles' );

	}

	public function print_css() {
		$container_width = absint( get_option( 'qazana_container_width' ) );

		if ( ! empty( $container_width ) ) {
			$this->stylesheet->add_rules( '.qazana-section.qazana-section-boxed > .qazana-container', 'max-width:' . $container_width . 'px' );
		}

		$this->_parse_schemes_css_code();

		$css_code = $this->stylesheet;

		if ( empty( $css_code ) )
			return;

		?>
		<style id="qazana-frontend-stylesheet"><?php echo $css_code; ?></style>
		<?php

		$this->print_google_fonts();
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

		// TODO: add JS to append the css to the `head` tag
		$this->print_google_fonts();
	}

	public function print_google_fonts() {
		// Enqueue used fonts
		if ( ! empty( $this->_enqueue_google_fonts ) ) {
			foreach ( $this->_enqueue_google_fonts as &$font ) {
				$font = str_replace( ' ', '+', $font ) . ':100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic';
			}

			$fonts_url = sprintf( 'https://fonts.googleapis.com/css?family=%s', implode( '|', $this->_enqueue_google_fonts ) );

			$subsets = [
				'ru_RU' => 'cyrillic',
				'bg_BG' => 'cyrillic',
				'he_IL' => 'hebrew',
				'el' => 'greek',
				'vi' => 'vietnamese',
				'uk' => 'cyrillic',
			];
			$locale = get_locale();

			if ( isset( $subsets[ $locale ] ) ) {
				$fonts_url .= '&subset=' . $subsets[ $locale ];
			}

			echo '<link rel="stylesheet" type="text/css" href="' . $fonts_url . '">';
			$this->_enqueue_google_fonts = [];
		}

		if ( ! empty( $this->_enqueue_google_early_access_fonts ) ) {
			foreach ( $this->_enqueue_google_early_access_fonts as $current_font ) {
				printf( '<link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/earlyaccess/%s.css">', strtolower( str_replace( ' ', '', $current_font ) ) );
			}
			$this->_enqueue_google_early_access_fonts = [];
		}
	}
	public function add_enqueue_font( $font ) {
		switch ( Fonts::get_font_type( $font ) ) {
			case Fonts::GOOGLE :
				if ( ! in_array( $font, $this->_enqueue_google_fonts ) )
					$this->_enqueue_google_fonts[] = $font;
				break;

			case Fonts::EARLYACCESS :
				if ( ! in_array( $font, $this->_enqueue_google_early_access_fonts ) )
					$this->_enqueue_google_early_access_fonts[] = $font;
				break;
		}
	}

	protected function _parse_schemes_css_code() {
		foreach ( qazana()->widgets_manager->get_widget_types() as $widget ) {
			$scheme_controls = $widget->get_scheme_controls();

			foreach ( $scheme_controls as $control ) {
				Post_CSS_File::add_control_rules( $this->stylesheet, $control, $widget->get_controls(), function ( $control ) {
					$scheme_value = qazana()->schemes_manager->get_scheme_value( $control['scheme']['type'], $control['scheme']['value'] );

					if ( empty( $scheme_value ) ) {
						return null;
					}

					if ( ! empty( $control['scheme']['key'] ) ) {
						$scheme_value = $scheme_value[ $control['scheme']['key'] ];
					}

					if ( empty( $scheme_value ) ) {
						return null;
					}

					$control_obj = qazana()->controls_manager->get_control( $control['type'] );

					if ( Controls_Manager::FONT === $control_obj->get_type() ) {
						$this->add_enqueue_font( $scheme_value );
					}

					return $scheme_value;
				}, [ '{{WRAPPER}}' ], [ '.qazana-widget-' . $widget->get_name() ] );
			}
		}
	}

	public function apply_qazana_in_content( $content ) {
		// Remove the filter itself in order to allow other `the_content` in the elements
		remove_filter( 'the_content', [ $this, 'apply_qazana_in_content' ] );

		if ( ! $this->_is_frontend_mode )
			return $content;

		$post_id = get_the_ID();
		$qazana_content = $this->get_qazana_content( $post_id );

		if ( ! empty( $qazana_content ) ) {
			$content = $qazana_content;
		}

		// Add the filter again for other `the_content` calls
		add_filter( 'the_content', [ $this, 'apply_qazana_in_content' ] );

		return $content;
	}

	public function get_qazana_content( $post_id, $with_css = false ) {
		if ( post_password_required( $post_id ) ) {
			return '';
		}

		$edit_mode = qazana()->db->get_edit_mode( $post_id );
		if ( 'qazana' !== $edit_mode ) {
			return '';
		}

		$data = qazana()->db->get_plain_editor( $post_id );
		$data = apply_filters( 'qazana/frontend/qazana_content_data', $data, $post_id );

		if ( empty( $data ) ) {
			return '';
		}

		$css_file = new Post_CSS_File( $post_id );
		$css_file->enqueue();

		ob_start();

		// Handle JS and Customizer requests, with css inline
		if ( is_customize_preview() || Utils::is_ajax() ) {
			$with_css = true;
		}

		if ( $with_css ) {
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
		return apply_filters( 'qazana/frontend/the_content', ob_get_clean() );
	}

	function add_menu_in_admin_bar( \WP_Admin_Bar $wp_admin_bar ) {
		$post_id = get_the_ID();
		$is_not_qazana_mode = ! is_singular() || ! User::is_current_user_can_edit( $post_id ) || 'qazana' !== qazana()->db->get_edit_mode( $post_id );

		if ( $is_not_qazana_mode ) {
			return;
		}

		$wp_admin_bar->add_node( [
			'id' => 'qazana_edit_page',
			'title' => __( 'Edit with Qazana', 'qazana' ),
			'href' => Utils::get_edit_link( $post_id ),
		] );
	}

	public function get_qazana_content_for_display( $post_id ) {
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

		// Set edit mode as false, so don't render settings and etc. use the $is_edit_mode to indicate if we need the css inline
		$is_edit_mode = qazana()->editor->is_edit_mode();
		qazana()->editor->set_edit_mode( false );

		// Change the global post to current library post, so widgets can use `get_the_ID` and other post data
		if ( isset( $GLOBALS['post'] ) ) {
			$global_post = $GLOBALS['post'];
		}

		$GLOBALS['post'] = get_post( $post_id );

		$content = $this->get_qazana_content( $post_id, $is_edit_mode );

		if ( ! empty( $content ) ) {
			$this->_has_qazana_in_page = true;
		}

		// Restore global post
		if ( isset( $global_post ) ) {
			$GLOBALS['post'] = $global_post;
		} else {
			unset( $GLOBALS['post'] );
		}

		// Restore edit mode state
		qazana()->editor->set_edit_mode( $is_edit_mode );

		return $content;
	}

	public function __construct() {
		// We don't need this class in admin side, but in AJAX requests
		if ( is_admin() && ! ( defined( 'DOING_AJAX' ) && DOING_AJAX ) ) {
			return;
		}

		add_action( 'template_redirect', [ $this, 'init' ] );
		add_filter( 'the_content', [ $this, 'apply_qazana_in_content' ] );
	}
}
