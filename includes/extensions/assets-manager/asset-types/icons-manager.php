<?php
namespace Qazana\Extensions\Assets_Manager\AssetTypes;

use Qazana\Extensions\Assets_Manager\Classes;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Icons_Manager {

	const CAPABILITY = 'manage_options';

	const CPT = 'qazana_icon';

	const TAXONOMY = 'qazana_icon_type';

	const FONTS_OPTION_NAME = 'qazana_icons_manager_icons';

	const FONTS_NAME_TYPE_OPTION_NAME = 'qazana_icons_manager_icon_types';

	private $post_type_object;

	private $taxonomy_object;

	private $enqueued_icons = [];

	protected $icon_types = [];

	/**
	 * get a icon type object for a given type
	 * @param null $type
	 *
	 * @return array|bool|\Qazana\Extensions\Assets_Manager\Classes\Font_Base
	 */
	public function get_icon_type_object( $type = null ) {
		if ( null === $type ) {
			return $this->icon_types;
		}

		if ( isset( $this->icon_types[ $type ] ) ) {
			return $this->icon_types[ $type ];
		}

		return false;
	}

	/**
	 * Add a icon type to the icon manager
	 *
	 * @param string $icon_type
	 * @param Classes\Font_Base $instance
	 */
	public function add_icon_type( $icon_type, $instance ) {
		$this->icon_types[ $icon_type ] = $instance;
	}

	/**
	 * Register qazana icon custom post type and qazana icon type custom taxonomy
	 */
	public function register_post_type_and_tax() {
		$labels = [
			'name' => _x( 'Custom Icons', 'Qazana Font', 'qazana' ),
			'singular_name' => _x( 'Font', 'Qazana Font', 'qazana' ),
			'add_new' => _x( 'Add New', 'Qazana Font', 'qazana' ),
			'add_new_item' => _x( 'Add New Font', 'Qazana Font', 'qazana' ),
			'edit_item' => _x( 'Edit Font', 'Qazana Font', 'qazana' ),
			'new_item' => _x( 'New Font', 'Qazana Font', 'qazana' ),
			'all_items' => _x( 'All Icons', 'Qazana Font', 'qazana' ),
			'view_item' => _x( 'View Font', 'Qazana Font', 'qazana' ),
			'search_items' => _x( 'Search Font', 'Qazana Font', 'qazana' ),
			'not_found' => _x( 'No Icons found', 'Qazana Font', 'qazana' ),
			'not_found_in_trash' => _x( 'No Font found in Trash', 'Qazana Font', 'qazana' ),
			'parent_item_colon' => '',
			'menu_name' => _x( 'Custom Icons', 'Qazana Font', 'qazana' ),
		];

		$args = [
			'labels' => $labels,
			'public' => false,
			'rewrite' => false,
			'show_ui' => true,
			'show_in_menu' => false,
			'show_in_nav_menus' => false,
			'exclude_from_search' => true,
			'capability_type' => 'post',
			'hierarchical' => false,
			'supports' => [ 'title' ],
		];

		$this->post_type_object = register_post_type( self::CPT, $args );

		$taxonomy_labels = [
			'name' => _x( 'Font Types', 'Font type taxonomy general name', 'qazana' ),
			'singular_name' => _x( 'Font Type', 'Font type singular name', 'qazana' ),
			'search_items' => __( 'Search Font Types', 'qazana' ),
			'popular_items' => __( 'Popular Font Types', 'qazana' ),
			'all_items' => __( 'All Font Types', 'qazana' ),
			'edit_item' => __( 'Edit Font Type', 'qazana' ),
			'update_item' => __( 'Update Font Type', 'qazana' ),
			'add_new_item' => __( 'Add New Font Type', 'qazana' ),
			'new_item_name' => __( 'New Font Type Name', 'qazana' ),
			'separate_items_with_commas' => __( 'Separate Font Types with commas', 'qazana' ),
			'add_or_remove_items' => __( 'Add or remove Font Types', 'qazana' ),
			'choose_from_most_used' => __( 'Choose from the most used Font Types', 'qazana' ),
			'not_found' => __( 'No Font Types found.', 'qazana' ),
			'menu_name' => __( 'Font Types', 'qazana' ),
		];

		$taxonomy_args = [
			'labels' => $taxonomy_labels,
			'hierarchical' => false,
			'show_ui' => true,
			'show_in_nav_menus' => false,
			'query_var' => is_admin(),
			'rewrite' => false,
			'public' => false,
			'meta_box_cb' => [ $this, 'print_taxonomy_metabox' ],
		];

		$this->taxonomy_object = register_taxonomy( self::TAXONOMY, self::CPT, $taxonomy_args );
	}

	public function post_updated_messages( $messages ) {
		$messages[ self::CPT ] = [
			0  => '', // Unused. Messages start at index 1.
			1  => __( 'Font updated.', 'qazana' ),
			2  => __( 'Custom field updated.', 'qazana' ),
			3  => __( 'Custom field deleted.', 'qazana' ),
			4  => __( 'Font updated.', 'qazana' ),
			/* translators: %s: date and time of the revision */
			5  => isset( $_GET['revision'] ) ? sprintf( __( 'Font restored to revision from %s', 'qazana' ), wp_post_revision_title( (int) $_GET['revision'], false ) ) : false,
			6  => __( 'Font saved.', 'qazana' ),
			7  => __( 'Font saved.', 'qazana' ),
			8  => __( 'Font submitted.', 'qazana' ),
			9  => __( 'Font updated.', 'qazana' ),
			10 => __( 'Font draft updated.', 'qazana' ),
		];

		return $messages;
	}

	/**
	 * Print Font Type metabox
	 * @param $post
	 * @param $box
	 */
	public function print_taxonomy_metabox( $post, $box ) {
		wp_nonce_field( self::CPT, self::CPT . '_nonce' );
		$name = self::TAXONOMY;
		?>
		<div id="taxonomy-<?php echo esc_attr( $name ); ?>" class="categorydiv">
			<?php
			$term_obj = wp_get_object_terms( $post->ID, $name );
			$slug = false;
			if ( is_array( $term_obj ) && isset( $term_obj[0] ) ) {
				$slug = $term_obj[0]->slug;
			}
			$options = '';
			foreach ( $this->icon_types as $type => $instance ) {
				$options .= sprintf( '<option value="%s"%s>%s</option>' . "\n", $type, selected( $slug, $type, false ), $instance->get_name() );
			}
			?>
			<select class="widefat" name="<?php echo esc_attr( $name ); ?>"><?php echo $options; ?></select>
		</div>
		<?php
	}

	/**
	 * Add Font manager link to admin menu
	 */
	public function register_admin_menu() {
		$menu_title = _x( 'Icons', 'Qazana Font', 'qazana' );
		add_submenu_page(
			qazana()->slug,
			$menu_title,
			$menu_title,
			self::CAPABILITY,
			'edit.php?post_type=' . self::CPT
		);
	}

	public function redirect_admin_old_page_to_new() {
		if ( ! empty( $_GET['page'] ) && 'qazana_custom_icons' === $_GET['page'] ) {
			wp_safe_redirect( admin_url( 'edit.php?post_type=' . self::CPT ) );
			die;
		}
	}

	/**
	 * Render preview column in icon manager admin listing
	 * @param $column
	 * @param $post_id
	 */
	public function render_columns( $column, $post_id ) {
		if ( 'icon_preview' === $column ) {
			$icon_type = $this->get_icon_type_by_post_id( $post_id, true );

			if ( false === $icon_type ) {
				return;
			}

			$icon_type->render_preview_column( $post_id );
		}
	}

	/**
	 * Handle editor request to embed/link icon CSS per icon type
	 */
	public function assets_manager_panel_action_data() {
		qazana()->editor->verify_ajax_nonce();

		$data = $_POST; // WPCS: CSRF OK.

		if ( empty( $data['type'] ) ) {
			wp_send_json_error( new \WP_Error( 'icon_type_is_required' ) );
		}
		if ( empty( $data['icon'] ) ) {
			wp_send_json_error( new \WP_Error( 'icon_is_required' ) );
		}

		$asset = $this->get_icon_type_object( $data['type'] );

		if ( ! $asset ) {
			wp_send_json_error( new \WP_Error( 'icon_type_not_found' ) );
		}

		try {
			$return_array = $asset->handle_panel_request();

			wp_send_json_success( $return_array );

		} catch ( \Exception $exception ) {
			$return_array = [
				'message' => $exception->getMessage(),
			];

			wp_send_json_error( $return_array );
		}
	}

	/**
	 * Clean up admin Font manager admin listing
	 */
	public function clean_admin_listing_page() {
		global $typenow;

		if ( self::CPT !== $typenow ) {
			return;
		}

		add_filter( 'months_dropdown_results', '__return_empty_array' );
		add_action( 'manage_' . self::CPT . '_posts_custom_column', [ $this, 'render_columns' ], 10, 2 );
		add_filter( 'display_post_states', [ $this, 'display_post_states' ], 10, 2 );
		add_filter( 'screen_options_show_screen', '__return_false' );
	}

	public function update_enter_title_here( $title, $post ) {
		if ( isset( $post->post_type ) && self::CPT === $post->post_type ) {
			return __( 'Enter Font Family', 'qazana' );
		}

		return $title;
	}

	public function post_row_actions( $actions, $post ) {
		if ( self::CPT !== $post->post_type ) {
			return $actions;
		}

		unset( $actions['inline hide-if-no-js'] );

		return $actions;
	}

	public function display_post_states( $post_states, $post ) {
		$icon_type = $this->get_icon_type_by_post_id( $post->ID, true );

		if ( false !== $icon_type ) {
			$icon_type->get_icon_variations_count( $post->ID );
		}

		return $post_states;
	}

	/**
	 * Define which columns to display in icon manager admin listing
	 * @param $columns
	 *
	 * @return array
	 */
	public function manage_columns( $columns ) {
		return [
			'cb' => '<input type="checkbox" />',
			'title' => __( 'Font Family', 'qazana' ),
			'icon_preview' => __( 'Preview', 'qazana' ),
		];
	}

	public function register_icons_in_control( $icons ) {
		$custom_icons = $this->get_icon_types();
		if ( empty( $custom_icons ) ) {
			$this->generate_icons_list();
			$custom_icons = $this->get_icon_types();
		}

		return array_merge( $custom_icons, $icons );
	}

	public function register_icons_groups( $icon_groups ) {
		$new_groups = [];

		foreach ( $this->get_icon_type_object()  as $type => $instance ) {
			$new_groups[ $type ] = $instance->get_name();
		}

		return array_merge( $new_groups, $icon_groups );
	}

	/**
	 * Gets a Font type for any given post id
	 * @param $post_id
	 * @param bool $return_object
	 *
	 * @return array|bool|Classes\Font_Base
	 */
	private function get_icon_type_by_post_id( $post_id, $return_object = false ) {
		$term_obj = get_the_terms( $post_id, self::TAXONOMY );

		if ( is_array( $term_obj ) ) {
			$type_obj = array_shift( $term_obj );

			if ( false === $return_object ) {
				return $type_obj->slug;
			}

			return $this->get_icon_type_object( $type_obj->slug );
		}

		return false;
	}

	/**
	 * Get icon manager icons as icon family => icon type array
	 * @return array
	 */
	private function get_icon_types() {
		static $icon_types = false;

		if ( ! $icon_types ) {
			$icon_types = get_option( self::FONTS_NAME_TYPE_OPTION_NAME, [] );
		}

		return $icon_types;
	}

	/**
	 * Generates a list of all Font Manager icons and stores it in the options table
	 * @return array
	 */
	private function generate_icons_list() {
		add_filter( 'posts_fields', [ $this, 'posts_fields' ] );

		$icons = new \WP_Query([
			'post_type' => self::CPT,
			'posts_per_page' => -1,
		]);

		remove_filter( 'posts_fields', [ $this, 'posts_fields' ] );

		$new_icons = [];
		$icon_types = [];
		foreach ( $icons->posts as $icon ) {
			$icon_type = $this->get_icon_type_by_post_id( $icon->ID, true );
			if ( false === $icon_type ) {
				continue;
			}
			$icon_types = array_merge( $icon_types, $icon_type->get_icon_family_type( $icon->ID, $icon->post_title ) );
			$new_icons = array_merge( $new_icons, $icon_type->get_icon_data( $icon->ID, $icon->post_title ) );
		}

		update_option( self::FONTS_NAME_TYPE_OPTION_NAME, $icon_types );
		update_option( self::FONTS_OPTION_NAME, $new_icons );

		return $new_icons;
	}

	/**
	 * runs on Qazana icon post save and calls the icon type handler save meta method
	 *
	 * @param int $post_id
	 * @param \WP_Post $post
	 * @param bool $update
	 *
	 * @return mixed
	 */
	public function save_post_meta( $post_id, $post, $update ) {
		// If this is an autosave, our form has not been submitted,
		// so we don't want to do anything.
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return $post_id;
		}

		// Check the user's permissions.
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return $post_id;
		}

		// Check if our nonce is set.
		if ( ! isset( $_POST[ self::CPT . '_nonce' ] ) ) {
			return $post_id;
		}

		// Verify that the nonce is valid.
		if ( ! wp_verify_nonce( $_POST[ self::CPT . '_nonce' ], self::CPT ) ) {
			return $post_id;
		}

		// Save icon type
		// only custom for now
		$custom_icon = $this->get_icon_type_object( 'custom' );

		wp_set_object_terms( $post_id, $custom_icon->get_type(), self::TAXONOMY );

		// Let Font type handle saving
		$custom_icon->save_meta( $post_id, $_POST );
	}

	/**
	 * Helper to clean icon list on save/update
	 */
	public function clear_icons_list() {
		delete_option( self::FONTS_OPTION_NAME );
		delete_option( self::FONTS_NAME_TYPE_OPTION_NAME );
	}

	/**
	 * Get icons array form the database or generate a new list if $force is set to true
	 * @param bool $force
	 *
	 * @return array|bool|mixed
	 */
	public function get_icons( $force = false ) {
		static $icons = false;
		if ( false !== $icons && ! $force ) {
			return $icons;
		}

		if ( $force ) {
			$icons = $this->generate_icons_list();
		}
		$icons = get_option( self::FONTS_OPTION_NAME, false );

		return $icons;
	}

	/**
	 * Filter posts fields to return just ID and title
	 * @param $sql
	 *
	 * @return string
	 */
	public function posts_fields( $sql ) {
		global $wpdb;
		return $wpdb->posts . '.ID, ' . $wpdb->posts . '.post_title';
	}

	/**
	 * Enqueue icons css
	 * @param $post_css
	 */
	public function enqueue_icons( $post_css ) {
		$used_icons = $post_css->get_fonts();
		$icon_manager_icons = $this->get_icons();
		$icon_types = $this->get_icon_types();

		foreach ( $used_icons as $icon_family ) {
			if ( ! isset( $icon_types[ $icon_family ] ) || in_array( $icon_family, $this->enqueued_icons ) ) {
				continue;
			}

			$icon_type = $this->get_icon_type_object( $icon_types[ $icon_family ] );
			if ( ! $icon_type ) {
				continue;
			}

			$icon_data = [];
			if ( isset( $icon_manager_icons[ $icon_family ] ) ) {
				$icon_data = $icon_manager_icons[ $icon_family ];
			}
			$icon_type->enqueue_icon( $icon_family, $icon_data, $post_css );

			$this->enqueued_icons[] = $icon_family;
		}
	}

	/**
	 * Register Font Manager action and filter hooks
	 */
	protected function actions() {
		add_action( 'init', [ $this, 'register_post_type_and_tax' ] );

		if ( is_admin() ) {
			add_action( 'init', [ $this, 'redirect_admin_old_page_to_new' ] );
			add_action( 'admin_menu', [ $this, 'register_admin_menu' ], 50 );
			add_action( 'admin_head', [ $this, 'clean_admin_listing_page' ] );
		}

		add_filter( 'post_row_actions', [ $this, 'post_row_actions' ], 10, 2 );
		add_filter( 'manage_' . self::CPT . '_posts_columns', [ $this, 'manage_columns' ], 100 );
		add_action( 'save_post_' . self::CPT, [ $this, 'save_post_meta' ], 10, 3 );
		add_action( 'save_post_' . self::CPT, [ $this, 'clear_icons_list' ], 100 );

		add_filter( 'qazana/icons/groups', [ $this, 'register_icons_groups' ] );
		add_filter( 'qazana/icons/additional_icons', [ $this, 'register_icons_in_control' ] );
		add_action( 'qazana/post-css-file/parse', [ $this, 'enqueue_icons' ] );
		add_action( 'qazana/global-css-file/parse', [ $this, 'enqueue_icons' ] );
		add_filter( 'post_updated_messages', [ $this, 'post_updated_messages' ] );
		add_filter( 'enter_title_here', [ $this, 'update_enter_title_here' ], 10, 2 );

		// Ajax.
		add_action( 'wp_ajax_qazana_assets_manager_panel_action_data', [ $this, 'assets_manager_panel_action_data' ] );

		/**
		 * Qazana icons manager loaded.
		 *
		 * Fires after the icons manager was fully loaded and instantiated.
		 *
		 * @since 2.0.0
		 *
		 * @param Icons_Manager $this An instance of icons manager.
		 */
		do_action( 'qazana/icons_manager_loaded', $this );
	}

	/**
	 * Icons_Manager constructor.
	 */
	public function __construct() {
		$this->actions();
		$this->add_icon_type( 'custom', new Icons\Custom_Icons() );
	}
}
