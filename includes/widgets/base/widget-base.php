<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Widget Base.
 *
 * An abstract class to register new Qazana widgets. It extended the
 * `Element_Base` class to inherit its properties.
 *
 * This abstract class must be extended in order to register new widgets.
 *
 * @since 1.0.0
 * @abstract
 */
abstract class Widget_Base extends Element_Base {

	/**
	 * Whether the widget has content.
	 *
	 * Used in cases where the widget has no content. When widgets uses only
	 * skins to display dynamic content generated on the server. For example the
	 * posts widget. Default is true, the widget has content
	 * template.
	 *
	 * @access protected
	 *
	 * @var bool
	 */
    protected $_has_template_content = true;

	/**
	 * Retrieve element type.
	 *
	 * Get the element type, in this case `widget`.
	 *
	 * @since 1.0.0
	 * @access public
	 * @static
	 *
	 * @return string The type.
	 */
	public static function get_type() {
		return 'widget';
	}

	/**
	 * Get widget icon.
	 *
	 * Retrieve the widget icon.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget icon.
	 */
	public function get_icon() {
		return 'eicon-apps';
	}

	/**
	 * Get widget keywords.
	 *
	 * Retrieve the widget keywords.
	 *
	 * @since 1.0.10
	 * @access public
	 *
	 * @return array Widget keywords.
	 */
	public function get_keywords() {
		return [];
	}

	/**
	 * Get widget categories.
	 *
	 * Retrieve the widget categories.
	 *
	 * @since 1.0.10
	 * @access public
	 *
	 * @return array Widget categories.
	 */
	public function get_categories() {
		return [ 'general' ];
	}

    /**
	 * Get animation targets.
	 *
	 * Retrieve the animation targets.
	 *
	 * @since 2.1.0
	 * @access public
	 *
	 * @return array Widget keywords.
	 */
	public function get_animation_config() {
		return [
            'inView' => [
                '.qazana-inner-wrapper, img',
            ],
            'splitText' => [
                'h1, h2, h3, h4, h5, h6, p' => [
                    'options' => [
                        'type' => 'lines',
                    ],
                ],
            ],
            'svg' => [
                '.svg-icon-holder' => [
                    'options' => [
                        'animated' => true,
                        'triggerHandler' => 'inview',
                        'duration' => $this->get_settings('svg_animation_speed'),
                        'delay' => $this->get_settings('svg_animation_delay'),
                        'resetOnHover' => true,
                        'type' => 'sync',
                        'customColorApplied' => true,
                        'color' => '#f42958',
                        'hoverColor' => '#fff',
                        'gradientColor' => [ '#f42958', '#000' ],
                        'hoverGradientColor' => [ '#B22222', '#00008B' ],
                    ],
                ],
            ],
            'parallax' => [
                '.qazana-inner-wrapper',
            ],
        ];
    }

	/**
	 * Get widget supported documents.
	 *
	 * Retrieve the widget documents.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return array Widget documents.
	 */
	public function get_documents() {
		return [ 'post' ];
	}

	/**
	 * Widget base constructor.
	 *
	 * Initializing the widget base class.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @throws \Exception If arguments are missing when initializing a full widget
	 *                   instance.
	 *
	 * @param array      $data Widget data. Default is an empty array.
	 * @param array|null $args Optional. Widget default arguments. Default is null.
	 */
	public function __construct( $data = [], $args = null ) {
		parent::__construct( $data, $args );

		$is_type_instance = $this->is_type_instance();

		if ( ! $is_type_instance && null === $args ) {
			throw new \Exception( '`$args` argument is required when initializing a full widget instance.' );
		}

		if ( $is_type_instance ) {
			$this->_register_skins();

			$widget_name = $this->get_name();

			/**
			 * Widget skin init.
			 *
			 * Fires when Qazana widget is being initialized.
			 *
			 * The dynamic portion of the hook name, `$widget_name`, refers to the widget name.
			 *
			 * @since 1.0.0
			 *
			 * @param Widget_Base $this The current widget.
			 */
			do_action( "qazana/widget/{$widget_name}/skins_init", $this );
		}

		$this->add_actions();
	}

	/**
	 * Get stack.
	 *
	 * Retrieve the widget stack of controls.
	 *
	 * @since 1.3.1
	 * @access public
	 *
	 * @param bool $with_common_controls Optional. Whether to include the common controls. Default is true.
	 *
	 * @return array Widget stack of controls.
	 */
	public function get_stack( $with_common_controls = true ) {
		$stack = parent::get_stack();

		if ( $with_common_controls && 'common' !== $this->get_unique_name() ) {
			/** @var Widget_Common $common_widget */
			$common_widget = qazana()->get_widgets_manager()->get_widget_types( 'common' );

			$stack['controls'] = array_merge( $stack['controls'], $common_widget->get_controls() );

			$stack['tabs'] = array_merge( $stack['tabs'], $common_widget->get_tabs_controls() );
		}

		return $stack;
	}

	/**
	 * Get widget controls pointer index.
	 *
	 * Retrieve widget pointer index where the next control should be added.
	 *
	 * While using injection point, it will return the injection point index. Otherwise index of the last control of the
	 * current widget itself without the common controls, plus one.
	 *
	 * @since 1.3.1
	 * @access public
	 *
	 * @return int Widget controls pointer index.
	 */
	public function get_pointer_index() {
		$injection_point = $this->get_injection_point();

		if ( null !== $injection_point ) {
			return $injection_point['index'];
		}

		return count( $this->get_stack( false )['controls'] );
	}

	public function add_actions() {}

	/**
	 * Show in panel.
	 *
	 * Whether to show the widget in the panel or not. By default returns true.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return bool Whether to show the widget in the panel or not.
	 */
	public function show_in_panel() {
		return true;
	}

    /**
	 * Show loading indicator.
	 *
	 * Whether to show the widget's loading indicator or not. By default returns false.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return bool Whether to show the widget's loading indicator or not.
	 */
	public function show_loading_indicator() {
		return false;
    }

	/**
	 * Start widget controls section.
	 *
	 * Used to add a new section of controls to the widget. Regular controls and
	 * skin controls.
	 *
	 * Note that when you add new controls to widgets they must be wrapped by
	 * `start_controls_section()` and `end_controls_section()`.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param string $section_id Section ID.
	 * @param array  $args       Section arguments.
	 */
	public function start_controls_section( $section_id, array $args ) {
		parent::start_controls_section( $section_id, $args );

		static $is_first_section = true;

		if ( $is_first_section ) {
			$this->_register_skin_control();

			$is_first_section = false;
		}
	}

	/**
	 * Register the Skin Control if the widget has skins.
	 *
	 * An internal method that is used to add a skin control to the widget.
	 * Added at the top of the controls section.
	 *
	 * @since 1.0.0
	 * @access private
	 */
	private function _register_skin_control() {
		$skins = $this->get_skins();
		if ( ! empty( $skins ) ) {
			$skin_options = [];

			if ( $this->_has_template_content ) {
				$skin_options[''] = __( 'Default', 'qazana' );
			}

            $skin_control = Controls_Manager::SELECT;

			foreach ( $skins as $skin_id => $skin ) {
                if ( method_exists( $skin, 'get_icon' ) && $skin->get_icon() ) {
                    $skin_control = Controls_Manager::CHOOSE;
                    $skin_options[ $skin_id ]['label'] = $skin->get_title();
                    $skin_options[ $skin_id ]['icon'] = $skin->get_icon();
                } else {
                    $skin_options[ $skin_id ] = $skin->get_title();
                }
			}

            // Get the first item for default value
            $default_value = array_keys( $skin_options );
            $default_value = array_shift( $default_value );

			if ( 1 >= count( $skin_options ) ) {
				$this->add_control(
					'_skin',
					[
						'label'   => __( 'Skin', 'qazana' ),
						'type'    => Controls_Manager::HIDDEN,
						'default' => $default_value,
					]
				);
			} else {
                $args = [
                    'label' => __( 'Skin', 'qazana' ),
                    'type' => $skin_control,
                    'default' => $default_value,
                    'options' => $skin_options,
                ];

				$this->add_control( '_skin', $args );
			}
		}
    }

	/**
	 * Get default edit tools.
	 *
	 * Retrieve the element default edit tools. Used to set initial tools.
	 * By default the element has no edit tools.
	 *
	 * @since 1.0.0
	 * @access protected
	 * @static
	 *
	 * @return array Default edit tools.
	 */
	protected static function get_default_edit_tools() {
		$widget_label = __( 'Widget', 'qazana' );

		$edit_tools = [
			'edit' => [
				'title' => __( 'Edit', 'qazana' ),
				'icon' => 'edit',
			],
		];

		if ( self::is_edit_buttons_enabled() ) {
			$edit_tools += [
				'duplicate' => [
					/* translators: %s: Widget label */
					'title' => sprintf( __( 'Duplicate %s', 'qazana' ), $widget_label ),
					'icon' => 'clone',
				],
				'remove' => [
					/* translators: %s: Widget label */
					'title' => sprintf( __( 'Remove %s', 'qazana' ), $widget_label ),
					'icon' => 'close',
				],
			];
		}

		return $edit_tools;
    }

    /**
	 * Get loading indicator.
	 *
	 * @since 1.0.0
	 * @access protected
	 *
	 * @return array Default edit tools.
	 */
	protected function get_default_loading_indicator() {
        $html = '<div class="qazana-loading-indicator">';
            $html .= '<span class="qazana-loading-indicator__color-spinner"><span class="qazana-loading-indicator__spinner"></span></span>';
        $html .= '</div>';

		return $html;
	}

	/**
	 * Register widget skins.
	 *
	 * This method is activated while initializing the widget base class. It is
	 * used to assign skins to widgets with `add_skin()` method.
	 *
	 * Usage:
	 *
	 *    protected function _register_skins() {
	 *        $this->add_skin( new Skin_Classic( $this ) );
	 *    }
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	protected function _register_skins() {}

	/**
	 * Get initial config.
	 *
	 * Retrieve the current widget initial configuration.
	 *
	 * Adds more configuration on top of the controls list, the tabs assigned to
	 * the control, element name, type, icon and more. This method also adds
	 * widget type, keywords and categories.
	 *
	 * @since 1.0.0
	 * @access protected
	 *
	 * @return array The initial widget config.
	 */
	protected function _get_initial_config() {
		$config = [
			'widget_type' => $this->get_name(),
			'keywords' => $this->get_keywords(),
			'categories' => $this->get_categories(),
			'documents' => $this->get_documents(),
			'html_wrapper_class' => $this->get_html_wrapper_class(),
			'show_in_panel' => $this->show_in_panel(),
		];

		return array_merge( parent::_get_initial_config(), $config );
	}

	/**
	 * Print widget content template.
	 *
	 * Used to generate the widget content template on the editor, using a
	 * Backbone JavaScript template.
	 *
	 * @since 2.0.0
	 * @access protected
	 *
	 * @param string $template_content Template content.
	 */
	protected function print_template_content( $template_content ) {
		$this->render_edit_tools();
		?>
		<div class="qazana-widget-container">
			<?php
			echo $template_content; // XSS ok.
			?>
		</div>
		<?php
	}

	/**
	 * Parse text editor.
	 *
	 * Parses the content from rich text editor with shortcodes, oEmbed and
	 * filtered data.
	 *
	 * @since 1.0.0
	 * @access protected
	 *
	 * @param string $content Text editor content.
	 *
	 * @return string Parsed content.
	 */
	protected function parse_text_editor( $content ) {
		/** This filter is documented in wp-includes/widgets/class-wp-widget-text.php */
		$content = apply_filters( 'widget_text', $content, $this->get_settings() );

		$content = shortcode_unautop( $content );
		$content = do_shortcode( $content );
		$content = wptexturize( $content );

		if ( $GLOBALS['wp_embed'] instanceof \WP_Embed ) {
			$content = $GLOBALS['wp_embed']->autoembed( $content );
		}

		return $content;
	}

	/**
	 * Get HTML wrapper class.
	 *
	 * Retrieve the widget container class. Can be used to override the
	 * container class for specific widgets.
	 *
	 * @since 2.0.0
	 * @access protected
	 */
	protected function get_html_wrapper_class() {
		return 'qazana-widget-' . $this->get_name();
	}

	/**
	 * Render widget output on the frontend.
	 *
	 * Used to generate the final HTML displayed on the frontend.
	 *
	 * Note that if skin is selected, it will be rendered by the skin itself,
	 * not the widget.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function render_content() {
		/**
		 * Before widget render content.
		 *
		 * Fires before Qazana widget is being rendered.
		 *
		 * @since 1.0.0
		 *
		 * @param Widget_Base $this The current widget.
		 */
		do_action( 'qazana/widget/before_render_content', $this );

		if ( qazana()->get_editor()->is_edit_mode() ) {
			$this->render_edit_tools();
		}

		?>
		<div class="qazana-widget-container">
			<?php
			ob_start();

			$skin = $this->get_current_skin();
			if ( $skin ) {
				$skin->set_parent( $this );
				$skin->before_render();
				$skin->render();
				$skin->after_render();
			} else {
				$this->render();
			}

			$widget_content = ob_get_clean();

			/**
			 * Render widget content.
			 *
			 * Filters the widget content before it's rendered.
			 *
			 * @since 1.0.0
			 *
			 * @param string      $widget_content The content of the widget.
			 * @param Widget_Base $this           The widget.
			 */
			$widget_content = apply_filters( 'qazana/widget/render_content', $widget_content, $this );

			echo $widget_content; // XSS ok.
			?>
		</div>
		<?php
	}

	/**
	 * Render widget plain content.
	 *
	 * Qazana saves the page content in a unique way, but it's not the way
	 * WordPress saves data. This method is used to save generated HTML to the
	 * database as plain content the WordPress way.
	 *
	 * When rendering plain content, it allows other WordPress plugins to
	 * interact with the content - to search, check SEO and other purposes. It
	 * also allows the site to keep working even if Qazana is deactivated.
	 *
	 * Note that if the widget uses shortcodes to display the data, the best
	 * practice is to return the shortcode itself.
	 *
	 * Also note that if the widget don't display any content it should return
	 * an empty string. For example Qazana Form Widget uses this method
	 * to return an empty string because there is no content to return. This way
	 * if Qazana will be deactivated there won't be any form to display.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function render_plain_content() {
		$this->render_content();
    }

    public function parse_animation_attributes( $type, $args ) {
        $animationType = $this->get_settings_for_display( "_animation_{$type}_type" );
        $config = qazana()->animations_manager->get_animation( $animationType );

        $defaults = [
            'duration' => $this->get_settings_for_display( "_animation_{$type}_duration" ),
            'startDelay' => $this->get_settings_for_display( "_animation_{$type}_start_delay" ),
            'delay' => $this->get_settings_for_display( "_animation_{$type}_delay" ),
            'direction' => 'forward',
            'easing' => $config['easing'],
            'initValues' => $config['animation']['out'],
            'finalValues' => $config['animation']['in'],
        ];

        return wp_parse_args( $args, $defaults );
    }

    protected function _add_animation_attributes() {
        if ( $this->get_settings_for_display( '_animation_enable' ) ) {
            $this->add_render_attribute( '_wrapper', 'data-custom-animations', 'true' );
        }

        $options = [];

        foreach ( $this->get_animation_config() as $type => $target ) {
            if ( count( $target ) !== count( $target, COUNT_RECURSIVE ) ) {
                foreach ( $target as $selector => $selector_options ) {
                    switch ( $type ) {
                        case 'svg':
                            $options[$type][] = [
                                'target' => $selector,
                            ];
                        break;

                        case 'splitText':
                            $options[$type][] = [
                                'target' => $selector,
                                'type' => $selector_options['options']['type'],
                            ];
                        break;

                        case 'hover':
                            $options[$type][] = $this->parse_animation_attributes( 'hover', [
                                'target' => $selector
                            ] );
                        break;
                        case 'inView':
                            $options[$type][] = $this->parse_animation_attributes( 'inView', [
                                'target' => $selector
                            ] );
                            break;
                    }
                }
            } else {
                foreach ( $target as $selector ) {

                    switch ( $type ) {
                        case 'svg':
                            $options[$type][] = [
                                'target' => $selector,
                            ];
                        break;

                        case 'splitText':
                            $options[$type][] = [
                                'target' => $selector,
                            ];
                        break;

                        case 'hover':
                            $options[$type][] = $this->parse_animation_attributes( 'hover', [
                                'target' => $selector
                            ] );
                        break;
                        case 'inView':
                            $options[$type][] = $this->parse_animation_attributes( 'inView', [
                                'target' => $selector
                            ] );
                            break;
                    }

                }
            }
        }

        $this->add_render_attribute( '_wrapper', 'data-animations', json_encode( $options ) );
    }

	/**
	 * Add render attributes.
	 *
	 * Used to add several attributes to current widget `_wrapper` element.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	protected function _add_render_attributes() {
		parent::_add_render_attributes();

		$this->add_render_attribute(
			'_wrapper',
			'class',
			[
				'qazana-widget',
				'qazana-element',
				'qazana-element-' . $this->get_id(),
				'qazana-widget-' . $this->get_name(),
			]
		);

		$this->_add_animation_attributes();

        $settings = $this->get_settings_for_display();

		foreach ( self::get_class_controls() as $control ) {
			if ( empty( $settings[ $control['name'] ] ) ) {
				continue;
			}

			if ( ! $this->is_control_visible( $control ) ) {
				continue;
			}

			$this->add_render_attribute( '_wrapper', 'class', $control['prefix_class'] . $settings[ $control['name'] ] );
		}

		$skin_type = ! empty( $settings['_skin'] ) ? $settings['_skin'] : 'default';

		$this->add_render_attribute( '_wrapper', 'class', $this->get_name() . '-skin-' . $skin_type );
        $this->add_render_attribute( '_wrapper', 'data-element_type', $this->get_name() . '.' . $skin_type );


        if ( $this->show_loading_indicator() ) {
			$this->add_render_attribute( '_wrapper', 'class', 'qazana-has-loading-indicator' );
		}

		$skin = $this->get_current_skin();
		if ( $skin ) {
			$skin->set_parent( $this );
			$skin->add_render_attributes();
		}

	}

	/**
	 * Before widget rendering.
	 *
	 * Used to add stuff before the widget `_wrapper` element.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function before_render() {

        $this->_add_render_attributes();

        ?><div <?php $this->render_attribute_string( '_wrapper' ); ?>><?php

        if ( $this->show_loading_indicator() ) {
            echo $this->get_default_loading_indicator();
        }
	}

	/**
	 * After widget rendering.
	 *
	 * Used to add stuff after the widget `_wrapper` element.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function after_render() {
		?></div><?php
	}

	/**
	 * Get the element raw data.
	 *
	 * Retrieve the raw element data, including the id, type, settings, child
	 * elements and whether it is an inner element.
	 *
	 * The data with the HTML used always to display the data, but the Qazana
	 * editor uses the raw data without the HTML in order not to render the data
	 * again.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param bool $with_html_content Optional. Whether to return the data with
	 *                                HTML content or without. Used for caching.
	 *                                Default is false, without HTML.
	 *
	 * @return array Element raw data.
	 */
	public function get_raw_data( $with_html_content = false ) {
		$data = parent::get_raw_data( $with_html_content );

		unset( $data['isInner'] );

		$data['widgetType'] = $this->get_data( 'widgetType' );

		if ( $with_html_content ) {
			ob_start();

			$this->render_content();

			$data['htmlCache'] = ob_get_clean();
		}

		return $data;
	}

	/**
	 * Print widget content.
	 *
	 * Output the widget final HTML on the frontend.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	protected function _print_content() {
		$this->render_content();
	}

	/**
	 * Get default data.
	 *
	 * Retrieve the default widget data. Used to reset the data on initialization.
	 *
	 * @since 1.0.0
	 * @access protected
	 *
	 * @return array Default data.
	 */
	protected function get_default_data() {
		$data = parent::get_default_data();

		$data['widgetType'] = '';

		return $data;
	}

	/**
	 * Get default child type.
	 *
	 * Retrieve the widget child type based on element data.
	 *
	 * @since 1.0.0
	 * @access protected
	 *
	 * @param array $element_data Widget ID.
	 *
	 * @return array|false Child type or false if it's not a valid widget.
	 */
	protected function _get_default_child_type( array $element_data ) {
		return $this->get_parent_document()->get_elements()->get_element_types( 'section' );
	}

	/**
	 * Get repeater setting key.
	 *
	 * Retrieve the unique setting key for the current repeater item. Used to connect the current element in the
	 * repeater to it's settings model and it's control in the panel.
	 *
	 * PHP usage (inside `Widget_Base::render()` method):
	 *
	 *    $tabs = $this->get_settings( 'tabs' );
	 *    foreach ( $tabs as $index => $item ) {
	 *        $tab_title_setting_key = $this->get_repeater_setting_key( 'tab_title', 'tabs', $index );
	 *        $this->add_inline_editing_attributes( $tab_title_setting_key, 'none' );
	 *        echo '<div ' . $this->get_render_attribute_string( $tab_title_setting_key ) . '>' . $item['tab_title'] . '</div>';
	 *    }
	 *
	 * @since 1.3.0
	 * @access protected
	 *
	 * @param string $setting_key      The current setting key inside the repeater item (e.g. `tab_title`).
	 * @param string $repeater_key     The repeater key containing the array of all the items in the repeater (e.g. `tabs`).
	 * @param int $repeater_item_index The current item index in the repeater array (e.g. `3`).
	 *
	 * @return string The repeater setting key (e.g. `tabs.3.tab_title`).
	 */
	protected function get_repeater_setting_key( $setting_key, $repeater_key, $repeater_item_index ) {
		return implode( '.', [ $repeater_key, $repeater_item_index, $setting_key ] );
	}

	/**
	 * Add inline editing attributes.
	 *
	 * Define specific area in the element to be editable inline. The element can have several areas, with this method
	 * you can set the area inside the element that can be edited inline. You can also define the type of toolbar the
	 * user will see, whether it will be a basic toolbar or an advanced one.
	 *
	 * Note: When you use wysiwyg control use the advanced toolbar, with textarea control use the basic toolbar. Text
	 * control should not have toolbar.
	 *
	 * PHP usage (inside `Widget_Base::render()` method):
	 *
	 *    $this->add_inline_editing_attributes( 'text', 'advanced' );
	 *    echo '<div ' . $this->get_render_attribute_string( 'text' ) . '>' . $this->get_settings( 'text' ) . '</div>';
	 *
	 * @since 1.3.0
	 * @access protected
	 *
	 * @param string $key     Element key.
	 * @param string $toolbar Optional. Toolbar type. Accepted values are `advanced`, `basic` or `none`. Default is
	 *                        `basic`.
	 */
	protected function add_inline_editing_attributes( $key, $toolbar = 'basic' ) {
		if ( ! qazana()->get_editor()->is_edit_mode() ) {
			return;
		}

		$this->add_render_attribute(
			$key,
			[
				'class' => 'qazana-inline-editing',
				'data-qazana-setting-key' => $key,
			]
		);

		if ( 'basic' !== $toolbar ) {
			$this->add_render_attribute(
				$key,
				[
					'data-qazana-inline-editing-toolbar' => $toolbar,
				]
			);
		}
	}

	/**
	 * Add new skin.
	 *
	 * Register new widget skin to allow the user to set custom designs. Must be
	 * called inside the `_register_skins()` method.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param Skin_Base $skin Skin instance.
	 */
	public function add_skin( Skin_Base $skin ) {
		qazana()->get_skins_manager()->add_skin( $this, $skin );
	}

	/**
	 * Get single skin.
	 *
	 * Retrieve a single skin based on skin ID, from all the skin assigned to
	 * the widget. If the skin does not exist or not assigned to the widget,
	 * return false.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param string $skin_id Skin ID.
	 *
	 * @return string|false Single skin, or false.
	 */
	public function get_skin( $skin_id ) {
		$skins = $this->get_skins();
		if ( isset( $skins[ $skin_id ] ) ) {
			return $skins[ $skin_id ];
		}

		return false;
	}

	/**
	 * Get current skin ID.
	 *
	 * Retrieve the ID of the current skin.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Current skin.
	 */
	public function get_current_skin_id() {
		return $this->get_settings( '_skin' );
	}

	/**
	 * Get current skin.
	 *
	 * Retrieve the current skin, or if non exist return false.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return Skin_Base|false Current skin or false.
	 */
	public function get_current_skin() {
		return $this->get_skin( $this->get_current_skin_id() );
	}

	/**
	 * Remove widget skin.
	 *
	 * Unregister an existing skin and remove it from the widget.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param string $skin_id Skin ID.
	 *
	 * @return \WP_Error|true Whether the skin was removed successfully from the widget.
	 */
	public function remove_skin( $skin_id ) {
		return qazana()->get_skins_manager()->remove_skin( $this, $skin_id );
	}

	/**
	 * Get widget skins.
	 *
	 * Retrieve all the skin assigned to the widget.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return Skin_Base[]
	 */
	public function get_skins() {
		return qazana()->get_skins_manager()->get_skins( $this );
    }
}
