<?php
namespace Qazana\Template_Library;

use Qazana\DB;
use Qazana\PageSettings\Manager as PageSettingsManager;
use Qazana\PageSettings\Page;
use Qazana\Plugin;
use Qazana\User;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Source_Local extends Source_Base {

	const CPT = 'qazana_library';

	const TAXONOMY_TYPE_SLUG = 'qazana_library_type';

	const TAXONOMY_TAG_SLUG = 'qazana_library_tag';

	const TYPE_META_KEY = '_qazana_template_type';

	const TEMP_FILES_DIR = 'qazana/tmp';

	const BULK_EXPORT_ACTION = 'qazana_export_multiple_templates';

	private static $_template_types = [ 'page', 'section' ];

	public static function get_template_type( $template_id ) {
		return get_post_meta( $template_id, self::TYPE_META_KEY, true );
	}

	public static function is_base_templates_screen() {
		global $current_screen;

		if ( ! $current_screen ) {
			return false;
		}

		return 'edit' === $current_screen->base && self::CPT === $current_screen->post_type;
	}

	public static function add_template_type( $type ) {
		self::$_template_types[] = $type;
	}

	public function get_id() {
		return 'local';
	}

	public function get_title() {
		return __( 'Local', 'qazana' );
	}

	public function register_data() {
		$labels = [
			'name' => _x( 'My Library', 'Template Library', 'qazana' ),
			'singular_name' => _x( 'Template', 'Template Library', 'qazana' ),
			'add_new' => _x( 'Add New', 'Template Library', 'qazana' ),
			'add_new_item' => _x( 'Add New Template', 'Template Library', 'qazana' ),
			'edit_item' => _x( 'Edit Template', 'Template Library', 'qazana' ),
			'new_item' => _x( 'New Template', 'Template Library', 'qazana' ),
			'all_items' => _x( 'All Templates', 'Template Library', 'qazana' ),
			'view_item' => _x( 'View Template', 'Template Library', 'qazana' ),
			'search_items' => _x( 'Search Template', 'Template Library', 'qazana' ),
			'not_found' => _x( 'No Templates found', 'Template Library', 'qazana' ),
			'not_found_in_trash' => _x( 'No Templates found in Trash', 'Template Library', 'qazana' ),
			'parent_item_colon' => '',
			'menu_name' => _x( 'My Library', 'Template Library', 'qazana' ),
		];

		$args = [
			'labels' => $labels,
			'public' => true,
			'rewrite' => false,
			'show_ui' => true,
			'show_in_menu' => false,
			'show_in_nav_menus' => false,
			'exclude_from_search' => true,
			'capability_type' => 'post',
			'hierarchical' => false,
			'supports' => [ 'title', 'thumbnail', 'author', 'qazana' ],
		];

		register_post_type(
			self::CPT,
			apply_filters( 'qazana/template_library/sources/local/register_post_type_args', $args )
		);

		$args = [
			'hierarchical' => false,
			'show_ui' => false,
			'show_in_nav_menus' => false,
			'show_admin_column' => true,
			'query_var' => is_admin(),
			'rewrite' => false,
			'public' => false,
			'label' => _x( 'Type', 'Template Library', 'qazana' ),
		];

		register_taxonomy(
			self::TAXONOMY_TYPE_SLUG,
			self::CPT,
			apply_filters( 'qazana/template_library/sources/local/register_type_taxonomy_args', $args )
		);

		$args = [
			'hierarchical' => false,
			'show_ui' => true,
			'show_in_nav_menus' => false,
			'show_admin_column' => true,
			'query_var' => is_admin(),
			'rewrite' => false,
			'public' => false,
			'label' => _x( 'Tags', 'Template Library Tags', 'qazana' ),
		];

		register_taxonomy(
			self::TAXONOMY_TAG_SLUG,
			self::CPT,
			apply_filters( 'qazana/template_library/sources/local/register_tag_taxonomy_args', $args )
		);
	}

	public function register_admin_menu() {
		add_submenu_page(
			qazana()->slug,
			__( 'My Library', 'qazana' ),
			__( 'My Library', 'qazana' ),
			'edit_pages',
			'edit.php?post_type=' . self::CPT
		);
	}

	public function get_items( $args = [] ) {
		$templates_query = new \WP_Query(
			[
				'post_type' => self::CPT,
				'post_status' => 'publish',
				'posts_per_page' => -1,
				'orderby' => 'title',
				'order' => 'ASC',
				'meta_query' => [
					[
						'key' => self::TYPE_META_KEY,
						'value' => self::$_template_types,
					],
				],
			]
		);

		$templates = [];

		if ( $templates_query->have_posts() ) {
			foreach ( $templates_query->get_posts() as $post ) {
				$templates[] = $this->get_item( $post->ID );
			}
		}

		if ( ! empty( $args ) ) {
			$templates = wp_list_filter( $templates, $args );
		}

		return $templates;
	}

	public function save_item( $template_data ) {
	    if ( ! in_array( $template_data['type'], self::$_template_types ) ) {
			return new \WP_Error( 'save_error', 'Invalid template type `' . $template_data['type'] . '`' );
		}

		$template_id = wp_insert_post( [
			'post_title' => ! empty( $template_data['title'] ) ? $template_data['title'] : __( '(no title)', 'qazana' ),
			'post_status' => 'publish',
			'post_type' => self::CPT,
		] );

		if ( is_wp_error( $template_id ) ) {
			return $template_id;
		}

		qazana()->db->set_is_builder_page( $template_id );

		qazana()->db->save_editor( $template_id, $template_data['data'] );

		$this->save_item_type( $template_id, $template_data['type'] );

		if ( ! empty( $template_data['page_settings'] ) ) {
			PageSettingsManager::save_page_settings( $template_id, $template_data['page_settings'] );
		}

		do_action( 'qazana/template-library/after_save_template', $template_id, $template_data );
		do_action( 'qazana/template-library/after_update_template', $template_id, $template_data );

		return $template_id;
	}

	public function update_item( $new_data ) {
		qazana()->db->save_editor( $new_data['id'], $new_data['data'] );

		do_action( 'qazana/template-library/after_update_template', $new_data['id'], $new_data );

		return true;
	}

	/**
	 * @param int $template_id
	 *
	 * @return array
	 */
	public function get_item( $item_id ) {
		$post = get_post( $item_id );

		$user = get_user_by( 'id', $post->post_author );

		$page_settings = get_post_meta( $post->ID, PageSettingsManager::META_KEY, true );

		$data = [
			'template_id' => $post->ID,
			'source' => $this->get_id(),
			'type' => self::get_template_type( $post->ID ),
			'title' => $post->post_title,
			'thumbnail' => get_the_post_thumbnail_url( $post ),
			'date' => mysql2date( get_option( 'date_format' ), $post->post_date ),
			'author' => $user->display_name,
			'hasPageSettings' => ! empty( $page_settings ),
			'categories' => [],
			'tags' => [],
			'keywords' => [],
			'export_link' => $this->_get_export_link( $item_id ),
			'url' => get_permalink( $post->ID ),
		];

		return apply_filters( 'qazana/template-library/get_template', $data );
	}

	public function get_data( array $args, $context = 'display' ) {
		$db = qazana()->db;

		$template_id = $args['template_id'];

		// TODO: Validate the data (in JS too!).
		if ( 'display' === $context ) {
			$content = $db->get_builder( $template_id );
		} else {
			$content = $db->get_plain_editor( $template_id );
		}

		$data = [
			'data' => $this->replace_elements_ids( $content ),
		];

		if ( ! empty( $args['page_settings'] ) ) {
			$page = PageSettingsManager::get_page( $args['template_id'] );
			$data['page_settings'] = $page->get_data( 'settings' );
		}

		return $data;
	}

	public function delete_template( $item_id ) {
		wp_delete_post( $item_id, true );
	}

	public function export_template( $template_id ) {
		$file_data = $this->prepare_template_export( $template_id );

		if ( is_wp_error( $file_data ) ) {
			return $file_data;
		}

		$this->send_file_headers( $file_data['name'], strlen( $file_data['data'] ) );

		// Clear buffering just in case.
		@ob_end_clean();

		flush();

		// Output file contents.
		echo $file_data['data'];

		die;
	}

	public function export_multiple_templates( array $template_ids ) {

		global $wp_filesystem;

		if ( empty( $wp_filesystem ) ) {
			require_once( ABSPATH . '/wp-admin/includes/file.php' );
			WP_Filesystem();
		}

		$files = [];

		$wp_upload_dir = wp_upload_dir();

		$temp_path = $wp_upload_dir['basedir'] . '/' . self::TEMP_FILES_DIR;

		/*
		 * Create temp path if it doesn't exist
		 */
		wp_mkdir_p( $temp_path );

		/*
		 * Create all json files
		 */
		foreach ( $template_ids as $template_id ) {
			$file_data = $this->prepare_template_export( $template_id );

			if ( is_wp_error( $file_data ) ) {
				continue;
			}

			$complete_path = $temp_path . '/' . $file_data['name'];

			$put_contents = file_put_contents( $complete_path, $file_data['data'] );

			if ( ! $put_contents ) {
				return new \WP_Error( '404', 'Cannot create file ' . $file_data['name'] );
			}

			$files[] = [
				'path' => $complete_path,
				'name' => $file_data['name'],
			];
		}

		/*
		 * Create temporary .zip file
		 */
		$zip_archive_filename = 'qazana-templates-' . date( 'Y-m-d' ) . '.zip';

		$zip_archive = new \ZipArchive();

		$zip_complete_path = $temp_path . '/' . $zip_archive_filename;

		$zip_archive->open( $zip_complete_path, \ZipArchive::CREATE );

		foreach ( $files as $file ) {
			$zip_archive->addFile( $file['path'], $file['name'] );
		}

		$zip_archive->close();

		$this->send_file_headers( $zip_archive_filename, filesize( $zip_complete_path ) );

		@ob_end_flush();

		@readfile( $zip_complete_path );

		unlink( $zip_complete_path );
		$wp_filesystem->delete( $zip_complete_path, true );

		die;
	}

	function recursive_get_files($path) {

		$Directory = new \RecursiveDirectoryIterator($path);

		$Directory->setFlags(\RecursiveDirectoryIterator::SKIP_DOTS);

 		$Iterator = new \RecursiveIteratorIterator($Directory);

		$data = array();

		foreach( $Iterator as $name => $object ) {
		   $data[] = $name;
		}

	    return $data;
	}

	public function import_template() {

		global $wp_filesystem;

        if ( empty( $wp_filesystem ) ) {
            require_once( ABSPATH . '/wp-admin/includes/file.php' );
            WP_Filesystem();
        }

		$import_file = $_FILES['file']['tmp_name'];

		if ( empty( $import_file ) ) {
			return new \WP_Error( 'file_error', 'Please upload a file to import' );
		}

		$items = [];

		$zip = new \ZipArchive();

		/*
		 * Check if file is a json or a .zip archive
		 */
		if ( true === $zip->open( $import_file ) ) {
			$wp_upload_dir = wp_upload_dir();

			$temp_path = $wp_upload_dir['basedir'] . '/' . self::TEMP_FILES_DIR . '/' . uniqid();

			$zip->extractTo( $temp_path );

			$zip->close();

			$found_files = array();

			$found_files = $this->recursive_get_files( $temp_path );

			foreach ( $found_files as $file ) {
				$items[] = $this->import_single_template( $file );
			}

			$wp_filesystem->delete( $temp_path, true );

		} else {
			$items[] = $this->import_single_template( $import_file );
		}

		return $items;
	}

	public function post_row_actions( $actions, \WP_Post $post ) {
		if ( self::is_base_templates_screen() ) {
			if ( $this->is_template_supports_export( $post->ID ) ) {
				$actions['export-template'] = sprintf( '<a href="%s">%s</a>', $this->_get_export_link( $post->ID ), __( 'Export Template', 'qazana' ) );
			}

			unset( $actions['inline hide-if-no-js'] );
		}

		return $actions;
	}

	public function admin_import_template_form() {
		if ( ! self::is_base_templates_screen() ) {
			return;
		}
		?>
		<div id="qazana-hidden-area">
			<a id="qazana-import-template-trigger" class="page-title-action"><?php _e( 'Import Templates', 'qazana' ); ?></a>
			<div id="qazana-import-template-area">
				<div id="qazana-import-template-title"><?php _e( 'Choose a Qazana template JSON file or a .zip archive of Qazana templates, and add them to the list of templates available in your library.', 'qazana' ); ?></div>
				<form id="qazana-import-template-form" method="post" action="<?php echo admin_url( 'admin-ajax.php' ); ?>" enctype="multipart/form-data">
					<input type="hidden" name="action" value="qazana_import_template">
					<fieldset id="qazana-import-template-form-inputs">
						<input type="file" name="file" accept=".json, .zip" required>
						<input type="submit" class="button" value="<?php _e( 'Import Now', 'qazana' ); ?>">
					</fieldset>
				</form>
			</div>
		</div>
		<?php
	}

	public function block_template_frontend() {
		if ( is_singular( self::CPT ) && ! User::is_current_user_can_edit() ) {
			wp_redirect( site_url(), 301 );
			die;
		}
	}

	public function is_template_supports_export( $template_id ) {
		return apply_filters( 'qazana/template_library/is_template_supports_export', true, $template_id );
	}

	private function _get_export_link( $item_id ) {
		return add_query_arg(
			[
				'action' => 'qazana_export_template',
				'source' => $this->get_id(),
				'template_id' => $item_id,
			],
			admin_url( 'admin-ajax.php' )
		);
	}

	public function on_save_post( $post_id, $post ) {
		if ( self::CPT !== $post->post_type ) {
			return;
		}

		if ( self::get_template_type( $post_id ) ) { // It's already with a type
			return;
		}

		$this->save_item_type( $post_id, 'page' );
	}

	private function save_item_type( $post_id, $type ) {
		update_post_meta( $post_id, self::TYPE_META_KEY, $type );

		wp_set_object_terms( $post_id, $type, self::TAXONOMY_TYPE_SLUG );
	}

	/**
	 * @param $query \WP_Query
	 */
	public function admin_query_filter_types( $query ) {
		if ( ! function_exists( 'get_current_screen' ) ) {
			return;
		}

		$library_screen_id = 'edit-' . self::CPT;
		$current_screen = get_current_screen();

		if ( ! isset( $current_screen->id ) || $library_screen_id !== $current_screen->id ) {
			return;
		}

		$query->query_vars['meta_key'] = self::TYPE_META_KEY;
		$query->query_vars['meta_value'] = self::$_template_types;
	}

	public function admin_add_bulk_export_action( $actions ) {
		$actions[ self::BULK_EXPORT_ACTION ] = __( 'Export', 'qazana' );

		return $actions;
	}

	public function admin_export_multiple_templates( $redirect_to, $action, $post_ids ) {
		if ( self::BULK_EXPORT_ACTION === $action ) {
			$this->export_multiple_templates( $post_ids );
		}

		return $redirect_to;
	}

	private function import_single_template( $file_name ) {

		global $wp_filesystem;

        if ( empty( $wp_filesystem ) ) {
            require_once( ABSPATH . '/wp-admin/includes/file.php' );
            WP_Filesystem();
        }

		$data = json_decode( $wp_filesystem->get_contents( $file_name ), true );

		if ( empty( $data ) ) {
			return new \WP_Error( 'file_error', 'Invalid File' );
		}

		if ( ! is_array( $data['data'] ) ) {
			return new \WP_Error( 'file_error', 'Invalid File' );
		}

		$content = $this->process_export_import_content( $data['data'], 'on_import' );

		$page_settings = [];

		if ( ! empty( $data['page_settings'] ) ) {
			$page = new Model( [
				'id' => 0,
				'settings' => $data['page_settings'],
			] );

			$page_settings_data = $this->process_element_export_import_content( $page, 'on_import' );

			if ( ! empty( $page_settings_data['settings'] ) ) {
				$page_settings = $page_settings_data['settings'];
			}
		}

		$template_id = $this->save_item( [
			'data' => $content,
			'title' => $data['title'],
			'type' => $data['type'],
			'page_settings' => $page_settings,
		] );

		if ( is_wp_error( $template_id ) ) {
			return $template_id;
		}

		return $this->get_item( $template_id );
	}

	private function prepare_template_export( $template_id ) {
		$template_data = $this->get_data( [
			'template_id' => $template_id,
		], 'raw' );

		if ( empty( $template_data['data'] ) ) {
			return new \WP_Error( '404', 'The template does not exist' );
		}

		// TODO: since 1.5.0 to content container named `content` instead of `data`.
		$template_data['data'] = $this->process_export_import_content( $template_data['data'], 'on_export' );

		$template_type = self::get_template_type( $template_id );

		if ( 'page' === $template_type ) {
			$page = PageSettingsManager::get_page( $template_id );

			$page_settings_data = $this->process_element_export_import_content( $page, 'on_export' );

			if ( ! empty( $page_settings_data['settings'] ) ) {
				$template_data['page_settings'] = $page_settings_data['settings'];
			}
		}

		$export_data = [
			'version' => qazana_db_version(),
			'title' => get_the_title( $template_id ),
			'type' => self::get_template_type( $template_id ),
		];

		$export_data += $template_data;

		return [
			'name' => 'qazana-' . $template_id . '-' . date( 'Y-m-d' ) . '.json',
			'data' => wp_json_encode( $export_data ),
		];
	}

	private function send_file_headers( $file_name, $file_size ) {
		header( 'Content-Type: application/octet-stream' );
		header( 'Content-Disposition: attachment; filename=' . $file_name );
		header( 'Expires: 0' );
		header( 'Cache-Control: must-revalidate' );
		header( 'Pragma: public' );
		header( 'Content-Length: ' . $file_size );
	}

	private function _add_actions() {

		if ( is_admin() ) {
			
			add_action( 'admin_menu', [ $this, 'register_admin_menu' ], 50 );
			add_filter( 'post_row_actions', [ $this, 'post_row_actions' ], 10, 2 );
			add_action( 'admin_footer', [ $this, 'admin_import_template_form' ] );
			add_action( 'save_post', [ $this, 'on_save_post' ], 10, 2 );
			add_action( 'parse_query', [ $this, 'admin_query_filter_types' ] );

			// template library bulk actions.
			add_filter( 'bulk_actions-edit-qazana_library', [ $this, 'admin_add_bulk_export_action' ] );
			add_filter( 'handle_bulk_actions-edit-qazana_library', [ $this, 'admin_export_multiple_templates' ], 10, 3 );
		}

		add_action( 'template_redirect', [ $this, 'block_template_frontend' ] );
	}

	public function __construct() {
		parent::__construct();
		$this->_add_actions();
	}
}
