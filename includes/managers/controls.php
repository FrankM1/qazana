<?php
namespace Builder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Controls_Manager {

	const TAB_CONTENT = 'content';
	const TAB_STYLE = 'style';
	const TAB_ADVANCED = 'advanced';
	const TAB_RESPONSIVE = 'responsive';
	const TAB_LAYOUT = 'layout';

	const TEXT = 'text';
	const NUMBER = 'number';
	const TEXTAREA = 'textarea';
	const SELECT = 'select';
	const CHECKBOX = 'checkbox';
	const RADIO = 'radio';
	const SWITCHER = 'switcher';

	const HIDDEN = 'hidden';
	const HEADING = 'heading';
	const RAW_HTML = 'raw_html';
	const SECTION = 'section';
	const TAB = 'tab';
	const TABS = 'tabs';
	const DIVIDER = 'divider';

	const COLOR = 'color';
	const MEDIA = 'media';
	const SLIDER = 'slider';
	const DIMENSIONS = 'dimensions';
	const CHOOSE = 'choose';
	const WYSIWYG = 'wysiwyg';
	const CODE = 'code';
	const FONT = 'font';
	const IMAGE_DIMENSIONS = 'image_dimensions';

	const WP_WIDGET = 'wp_widget';

	const URL = 'url';
	const REPEATER = 'repeater';
	const ICON = 'icon';
	const GALLERY = 'gallery';
	const STRUCTURE = 'structure';
	const SELECT2 = 'select2';
	const DATE_TIME = 'date_time';
	const BOX_SHADOW = 'box_shadow';
	const ANIMATION_IN = 'animation_in';
	const ANIMATION_OUT = 'animation_out';
	const HOVER_ANIMATION = 'hover_animation';
	const ORDER = 'order';

	/**
	 * @var Control_Base[]
	 */
	private $_controls = [];

	/**
	 * @var Group_Control_Base[]
	 */
	private $_control_groups = [];

	private $_controls_stack = [];

	private static $_available_tabs_controls;

	private static function _get_available_tabs_controls() {
		if ( ! self::$_available_tabs_controls ) {
			self::$_available_tabs_controls = [
				self::TAB_CONTENT => __( 'Content', 'builder' ),
				self::TAB_STYLE => __( 'Style', 'builder' ),
				self::TAB_ADVANCED => __( 'Advanced', 'builder' ),
				self::TAB_RESPONSIVE => __( 'Responsive', 'builder' ),
				self::TAB_LAYOUT => __( 'Layout', 'builder' ),
			];

			self::$_available_tabs_controls = apply_filters( 'builder/controls/get_available_tabs_controls', self::$_available_tabs_controls );
		}

		return self::$_available_tabs_controls;
	}

	/**
	 * @since 1.0.0
	 */
	public function register_controls() {
		require( builder()->includes_dir  . 'editor/controls/base.php' );
		require( builder()->includes_dir  . 'editor/controls/base-multiple.php' );
		require( builder()->includes_dir  . 'editor/controls/base-units.php' );

		$available_controls = [
			self::TEXT,
			self::NUMBER,
			self::TEXTAREA,
			self::SELECT,
			self::CHECKBOX,
			self::RADIO,
			self::SWITCHER,

			self::HIDDEN,
			self::HEADING,
			self::RAW_HTML,
			self::SECTION,
			self::TAB,
			self::TABS,
			self::DIVIDER,

			self::COLOR,
			self::MEDIA,
			self::SLIDER,
			self::DIMENSIONS,
			self::CHOOSE,
			self::WYSIWYG,
			self::CODE,
			self::FONT,
			self::IMAGE_DIMENSIONS,

			self::WP_WIDGET,

			self::URL,
			self::REPEATER,
			self::ICON,
			self::GALLERY,
			self::STRUCTURE,
			self::SELECT2,
			self::DATE_TIME,
			self::BOX_SHADOW,
			self::ANIMATION_IN,
			self::ANIMATION_OUT,
			self::HOVER_ANIMATION,
			self::ORDER,
		];

		foreach ( $available_controls as $control_id ) {
			$control_filename = str_replace( '_', '-', $control_id );
			$control_filename =  builder()->includes_dir . "editor/controls/{$control_filename}.php";
			require( $control_filename );

			$class_name = __NAMESPACE__ . '\Control_' . ucwords( $control_id );
			$this->register_control( $control_id, $class_name );
		}

		// Group Controls
		require( builder()->includes_dir  . 'editor/interfaces/group-control.php' );
		require( builder()->includes_dir  . 'editor/controls/groups/base.php' );

		require( builder()->includes_dir  . 'editor/controls/groups/background.php' );
		require( builder()->includes_dir  . 'editor/controls/groups/border.php' );
		require( builder()->includes_dir  . 'editor/controls/groups/typography.php' );
		require( builder()->includes_dir  . 'editor/controls/groups/image-size.php' );
		require( builder()->includes_dir  . 'editor/controls/groups/box-shadow.php' );
		require( builder()->includes_dir  . 'editor/controls/groups/animations.php' );
		require( builder()->includes_dir  . 'editor/controls/groups/icon.php' );

		$this->_control_groups['background'] = new Group_Control_Background();
		$this->_control_groups['border']     = new Group_Control_Border();
		$this->_control_groups['typography'] = new Group_Control_Typography();
		$this->_control_groups['image-size'] = new Group_Control_Image_Size();
		$this->_control_groups['box-shadow'] = new Group_Control_Box_Shadow();
		$this->_control_groups['animations'] = new Group_Control_Animations();
		$this->_control_groups['icon'] 		 = new Group_Control_Icon();
	}

	/**
	 * @since 1.0.0
	 * @param $control_id
	 * @param $class_name
	 *
	 * @return bool|\WP_Error
	 */
	public function register_control( $control_id, $class_name ) {
		if ( ! class_exists( $class_name ) ) {
			return new \WP_Error( 'element_class_name_not_exists' );
		}
		$instance_control = new $class_name();

		if ( ! $instance_control instanceof Control_Base ) {
			return new \WP_Error( 'wrong_instance_control' );
		}
		$this->_controls[ $control_id ] = $instance_control;

		return true;
	}

	/**
	 * @param $control_id
	 *
	 * @since 1.0.0
	 * @return bool
	 */
	public function unregister_control( $control_id ) {
		if ( ! isset( $this->_controls[ $control_id ] ) ) {
			return false;
		}
		unset( $this->_controls[ $control_id ] );
		return true;
	}

	/**
	 * @since 1.0.0
	 * @return Control_Base[]
	 */
	public function get_controls() {
		return $this->_controls;
	}

	/**
	 * @since 1.0.0
	 * @param $control_id
	 *
	 * @return bool|\Builder\Control_Base
	 */
	public function get_control( $control_id ) {
		$controls = $this->get_controls();

		return isset( $controls[ $control_id ] ) ? $controls[ $control_id ] : false;
	}

	/**
	 * @since 1.0.0
	 * @return array
	 */
	public function get_controls_data() {
		$controls_data = [];

		foreach ( $this->get_controls() as $name => $control ) {
			$controls_data[ $name ] = $control->get_settings();
			$controls_data[ $name ]['default_value'] = $control->get_default_value();
		}

		return $controls_data;
	}

	/**
	 * @since 1.0.0
	 * @return void
	 */
	public function render_controls() {
		foreach ( $this->get_controls() as $control ) {
			$control->print_template();
		}
	}

	/**
	 * @since 1.0.0
	 *
	 * @param string $id
	 *
	 * @return Group_Control_Base|Group_Control_Base[]
	 */
	public function get_control_groups( $id = null ) {
		if ( $id ) {
			return isset( $this->_control_groups[ $id ] ) ? $this->_control_groups[ $id ] : null;
		}

		return $this->_control_groups;
	}

	/**
	 * @since 1.0.0
	 *
	 * @param $id
	 * @param $instance
	 *
	 * @return Group_Control_Base[]
	 */
	public function add_group_control( $id, $instance ) {
		$this->_control_groups[ $id ] = $instance;

		return $instance;
	}

	/**
	 * @since 1.0.0
	 * @return void
	 */
	public function enqueue_control_scripts() {
		foreach ( $this->get_controls() as $control ) {
			$control->enqueue();
		}
	}

	public function open_stack( Element_Base $element ) {
		$stack_id = $element->get_name();

		$this->_controls_stack[ $stack_id ] = [
			'tabs' => [],
			'controls' => [],
		];
	}

	public function add_control_to_stack( Element_Base $element, $control_id, $control_data, $overwrite = false ) {
		$default_args = [
			'type' => self::TEXT,
			'tab' => self::TAB_CONTENT,
		];

		$control_data['name'] = $control_id;

		$control_data = array_merge( $default_args, $control_data );

		$control_type_instance = $this->get_control( $control_data['type'] );

		if ( ! $control_type_instance ) {
			_doing_it_wrong( __CLASS__ . '::' . __FUNCTION__, 'Control type `' . $control_data['type'] . '` not found`', '1.0.0' );
			return false;
		}

		$control_default_value = $control_type_instance->get_default_value();

		if ( is_array( $control_default_value ) && ! empty( $control_data['default'] ) && is_array( $control_data['default'] ) ) {
			$control_data['default'] = isset( $control_data['default'] ) ? array_merge( $control_default_value, $control_data['default'] ) : $control_default_value;
		} else {
			$control_data['default'] = isset( $control_data['default'] ) ? $control_data['default'] : $control_default_value;
		}

		$stack_id = $element->get_name();

		if ( ! $overwrite && isset( $this->_controls_stack[ $stack_id ]['controls'][ $control_id ] ) ) {
			_doing_it_wrong( __CLASS__ . '::' . __FUNCTION__, 'Cannot redeclare control with same name. - ' . $control_id, '1.0.0' );
			return false;
		}

		$available_tabs = self::_get_available_tabs_controls();

		if ( ! isset( $available_tabs[ $control_data['tab'] ] ) ) {
			$control_data['tab'] = $default_args['tab'];
		}

		$this->_controls_stack[ $stack_id ]['tabs'][ $control_data['tab'] ] = $available_tabs[ $control_data['tab'] ];

		$this->_controls_stack[ $stack_id ]['controls'][ $control_id ] = $control_data;

		return true;
	}

	public function remove_control_from_stack( $stack_id, $control_id ) {
		if ( is_array( $control_id ) ) {
			foreach ( $control_id as $id ) {
				$this->remove_control_from_stack( $stack_id, $id );
			}

			return true;
		}

		if ( empty( $this->_controls_stack[ $stack_id ]['controls'][ $control_id ] ) ) {
			return new \WP_Error( 'Cannot remove not-exists control.' );
		}

		unset( $this->_controls_stack[ $stack_id ]['controls'][ $control_id ] );

		return true;
	}

	public function get_control_from_stack( $stack_id, $control_id ) {
		if ( empty( $this->_controls_stack[ $stack_id ]['controls'][ $control_id ] ) ) {
			return new \WP_Error( 'Cannot get a not-exists control.' );
		}

		return $this->_controls_stack[ $stack_id ]['controls'][ $control_id ];
	}

	public function update_control_in_stack( Element_Base $element, $control_id, $control_data ) {
		$old_control_data = $this->get_control_from_stack( $element->get_name(), $control_id );
		if ( is_wp_error( $old_control_data ) ) {
			return false;
		}

		$control_data = array_merge( $old_control_data, $control_data );

		return $this->add_control_to_stack( $element, $control_id, $control_data, true );
	}

	public function get_element_stack( Element_Base $element ) {
		$stack_id = $element->get_name();

		if ( ! isset( $this->_controls_stack[ $stack_id ] ) ) {
			return null;
		}

		$stack = $this->_controls_stack[ $stack_id ];

		if ( 'widget' === $element->get_type() && 'common' !== $stack_id ) {
			$common_widget = builder()->widgets_manager->get_widget_types( 'common' );

			$stack['controls'] = array_merge( $stack['controls'], $common_widget->get_controls() );

			$stack['tabs'] = array_merge( $stack['tabs'], $common_widget->get_tabs_controls() );
		}

		return $stack;
	}

	public function set_element_stack_controls( Element_Base $element, $controls) {
		$stack_id = $element->get_name();

		if ( empty( $controls ) ) {
			return null;
		}

		if ( 'widget' === $element->get_type() && 'common' !== $stack_id ) {
			$this->_controls_stack[ $stack_id ]['controls'] = $controls;
		}

		return true;
	}

	/**
	 * Controls_Manager constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$this->register_controls();
	}
}
