<?php
namespace Qazana\Core\Base;

use Qazana\Core\Files\CSS\Post as Post_CSS;
use Qazana\Core\Utils\Exceptions;
use Qazana\DB;
use Qazana\Controls_Manager;
use Qazana\Controls_Stack;
use Qazana\User;
use Qazana\Core\Settings\Manager as SettingsManager;
use Qazana\Utils;
use Qazana\Widget_Base;
use Qazana\Document\Widgets;
use Qazana\Document\Elements;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Qazana document.
 *
 * An abstract class that provides the needed properties and methods to
 * manage and handle documents in inheriting classes.
 *
 * @since 2.0.0
 * @abstract
 */
abstract class Document extends Controls_Stack {

	/**
	 * Document location.
	 */
	const LOCATION_META_KEY = '_qazana_location';

	/**
	 * Document type meta key.
	 */
	const TYPE_META_KEY = '_qazana_template_type';

	/**
	 * Document sub type meta key.
	 */
	const SUB_TYPE_META_KEY = '_qazana_template_sub_type';

	/**
	 * The taxonomy type slug for the library document.
	 */
    const TAXONOMY_TYPE_SLUG = 'qazana_library_type';

	/**
	 * Document properties
	 *
	 * @var array
	 */
	private static $properties = [];

	/**
	 * Store element stylesheets
	 *
	 * @var array
	 */
	private $element_stylesheets = array();

	/**
	 * Store element scripts
	 *
	 * @var array
	 */
	private $element_scripts = array();

	/**
	 * Document post data.
	 *
	 * Holds the document post data.
	 *
	 * @since 2.0.0
	 * @access protected
	 *
	 * @var \WP_Post WordPress post data.
	 */
	protected $post;

	protected static function get_editor_panel_categories() {
		return qazana()->get_elements_manager()->get_categories();
	}

	/**
	 * Get properties.
	 *
	 * Retrieve the document properties.
	 *
	 * @since 2.0.0
	 * @access public
	 * @static
	 *
	 * @return array Document properties.
	 */
	public static function get_properties() {
		return [
			'is_editable' => true,
		];
	}

	public static function get_editor_panel_config() {
		return [
			'elements_categories' => static::get_editor_panel_categories(),
			'messages' => [
				/* translators: %s: the document title. */
				'publish_notification' => sprintf( __( 'Your %s is now live.', 'qazana' ), self::get_title() ),
			],
		];
	}

	/**
	 * Get element title.
	 *
	 * Retrieve the element title.
	 *
	 * @since 2.0.0
	 * @access public
	 * @static
	 *
	 * @return string Element title.
	 */
	public static function get_title() {
		return __( 'Document', 'qazana' );
	}

	/**
	 * Get property.
	 *
	 * Retrieve the document property.
	 *
	 * @since 2.0.0
	 * @access public
	 * @static
	 *
	 * @param string $key The property key.
	 *
	 * @return mixed The property value.
	 */
	public static function get_property( $key ) {
		$id = static::get_class_full_name();
		if ( ! isset( self::$properties[ $id ] ) ) {
			self::$properties[ $id ] = static::get_properties();
		}

		return self::get_items( self::$properties[ $id ], $key );
	}

	/**
	 * @since 2.0.0
	 * @access public
	 * @static
	 */
	public static function get_class_full_name() {
		return get_called_class();
	}

	/**
	 * @since 2.0.0
	 * @access public
	 */
	public function get_unique_name() {
		return $this->get_name() . '-' . $this->post->ID;
	}

	public function get_post_type_title() {
		$post_type_object = get_post_type_object( $this->post->post_type );

		return $post_type_object->labels->singular_name;
	}

	public function get_remote_library_type() {
		return $this->get_name();
	}

	/**
	 * @since 2.0.0
	 * @access public
	 */
	public function get_main_id() {
		$post_id = $this->post->ID;
		$parent_post_id = wp_is_post_revision( $post_id );
		if ( $parent_post_id ) {
			$post_id = $parent_post_id;
		}

		return $post_id;
	}

	/**
	 * @since 2.0.0
	 * @access public
	 *
	 * @param $data
	 *
	 * @throws \Exception If the widget was not found.
	 *
	 * @return string
	 */
	public function render_element( $data ) {
		// Start buffering
		ob_start();

		/** @var Widget_Base $widget */
		$widget = qazana()->get_elements_manager()->create_element_instance( $this, $data );

		if ( ! $widget ) {
			throw new \Exception( 'Widget not found.' );
		}

		$widget->render_content();

		$render_html = ob_get_clean();

		return $render_html;
	}

	/**
	 * @since 2.0.0
	 * @access public
	 */
	public function get_main_post() {
		return get_post( $this->get_main_id() );
	}

	/**
	 * @since 2.0.6
	 * @access public
	 */
	public function get_container_classes() {
		return 'qazana qazana-' . $this->get_main_id();
	}

	/**
	 * @since 2.0.0
	 * @access public
	 */
	public function get_wp_preview_url() {
		$preview_id = (int) $this->get_settings( 'preview_id' );
		$post_id = $this->get_main_id();

		list( $preview_category, $preview_object_type ) = array_pad( explode( '/',  $this->get_settings( 'preview_type' ) ), 2,'' );

		switch ( $preview_category ) {
			case 'archive':
				switch ( $preview_object_type ) {
					case 'author':
						if ( empty( $preview_id ) ) {
							$preview_id = get_current_user_id();
						}
						$preview_url = get_author_posts_url( $preview_id );
						break;
					case 'date':
						$preview_url = add_query_arg( 'year', date( 'Y' ), home_url() );
						break;
				}
				break;
			case 'search':
				$preview_url = add_query_arg( 's', $this->get_settings( 'preview_search_term' ), home_url() );
				break;
			case 'taxonomy':
				$term = get_term( $preview_id );

				if ( $term && ! is_wp_error( $term ) ) {
					$preview_url = get_term_link( $preview_id );
				}

				break;
			case 'page':
				switch ( $preview_object_type ) {
					case 'home':
						$preview_url = get_post_type_archive_link( 'post' );
						break;
					case 'front':
						$preview_url = home_url();
						break;
					case '404':
						$preview_url = add_query_arg( 'p', '0', home_url() );
						break;
				}
				break;
			case 'post_type_archive':
				$post_type = $preview_object_type;
				if ( post_type_exists( $post_type ) ) {
					$preview_url = get_post_type_archive_link( $post_type );
				}
				break;
			case 'single':
				$post = get_post( $preview_id );
				if ( $post ) {
					$preview_url = get_permalink( $post );
				}
				break;
		} // End switch().

		if ( empty( $preview_url ) ) {
			$preview_url = $this->get_permalink();
		}

		$query_args = [
			'preview' => true,
			'preview_nonce' => wp_create_nonce( 'post_preview_' . $post_id ),
			'template_id' => $post_id,
		];

		$preview_url = set_url_scheme( add_query_arg( $query_args, $preview_url ) );

		/**
		 * Document "WordPress preview" URL.
		 *
		 * Filters the WordPress preview URL.
		 *
		 * @since 2.0.0
		 *
		 * @param Document $this An instance of the theme document.
		 */
		$preview_url = apply_filters( 'qazana/document/wp_preview_url', $preview_url, $this );

		return $preview_url;
	}

	public function get_preview_as_query_args() {
		$preview_id = (int) $this->get_settings( 'preview_id' );

		list( $preview_category, $preview_object_type ) = array_pad( explode( '/', $this->get_settings( 'preview_type' ) ), 2, '' );

		switch ( $preview_category ) {
			case 'singular':
				switch ( $preview_object_type ) {
					case 'author':
						if ( empty( $preview_id ) ) {
							$preview_id = get_current_user_id();
						}

						$query_args = [
							'author' => $preview_id,
						];
						break;
					case 'date':
						$query_args = [
							'year' => date( 'Y' ),
						];
						break;
					case 'recent_posts':
						$query_args = [
							'post_type' => 'post',
						];
						break;
				}
				break;
			case 'search':
				$query_args = [
					's' => $this->get_settings( 'preview_search_term' ),
				];
				break;
			case 'taxonomy':
				$term = get_term( $preview_id );

				if ( $term && ! is_wp_error( $term ) ) {
					$query_args = [
						'tax_query' => [
							[
								'taxonomy' => $term->taxonomy,
								'terms' => [ $preview_id ],
								'field' => 'id',
							],
						],
					];
				}
				break;
			case 'page':
				switch ( $preview_object_type ) {
					case 'home':
						$query_args = [];
						break;
					case 'front':
						$query_args = [
							'p' => get_option( 'page_on_front' ),
							'post_type' => 'page',
						];
						break;
					case '404':
						$query_args = [
							'p' => 0,
						];
						break;
				}
				break;
			case 'post_type_singular':
				$post_type = $preview_object_type;
				if ( post_type_exists( $post_type ) ) {
					$query_args = [
						'post_type' => $post_type,
					];
				}
				break;
			case 'single':
				$post = get_post( $preview_id );
				if ( ! $post ) {
					break;
				}

				$query_args = [
					'p' => $post->ID,
					'post_type' => $post->post_type,
				];
		} // End switch().

		if ( empty( $query_args ) ) {
			$query_args = [
				'p' => $this->get_main_id(),
				'post_type' => $this->get_main_post()->post_type,
			];
		}

		return $query_args;
	}

	/**
	 * @since 2.0.0
	 * @access public
	 */
	public function get_exit_to_dashboard_url() {
		$url = get_edit_post_link( $this->get_main_id(), 'raw' );

		/**
		 * Document "exit to dashboard" URL.
		 *
		 * Filters the "Exit To Dashboard" URL.
		 *
		 * @since 2.0.0
		 *
		 * @param string   $url  The exit URL
		 * @param Document $this The document instance.
		 */
		$url = apply_filters( 'qazana/document/urls/exit_to_dashboard', $url, $this );

		return $url;
	}

	/**
	 * Get auto-saved post revision.
	 *
	 * Retrieve the auto-saved post revision that is newer than current post.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 *
	 * @return bool|Document
	 */

	public function get_newer_autosave() {
		$autosave = $this->get_autosave();

		// Detect if there exists an autosave newer than the post.
		if ( $autosave && mysql2date( 'U', $autosave->get_post()->post_modified_gmt, false ) > mysql2date( 'U', $this->post->post_modified_gmt, false ) ) {
			return $autosave;
		}

		return false;
	}

	/**
	 * @since 2.0.0
	 * @access public
	 */
	public function is_autosave() {
		return wp_is_post_autosave( $this->post->ID );
	}

	/**
	 * @since 2.0.0
	 * @access public
	 *
	 * @param int  $user_id
	 * @param bool $create
	 *
	 * @return bool|Document
	 */
	public function get_autosave( $user_id = 0, $create = false ) {
		if ( ! $user_id ) {
			$user_id = get_current_user_id();
		}

		$autosave_id = $this->get_autosave_id( $user_id );

		if ( $autosave_id ) {
			$document = qazana()->get_documents()->get( $autosave_id );
		} elseif ( $create ) {
			$autosave_id = wp_create_post_autosave(
				[
					'post_ID' => $this->post->ID,
					'post_type' => $this->post->post_type,
					'post_title' => $this->post->post_title,
					'post_excerpt' => $this->post->post_excerpt,
					// Hack to cause $autosave_is_different=true in `wp_create_post_autosave`.
					'post_content' => '<!-- Created With Qazana -->',
					'post_modified' => current_time( 'mysql' ),
				]
			);

			qazana()->get_db()->copy_qazana_meta( $this->post->ID, $autosave_id );

			$document = qazana()->get_documents()->get( $autosave_id );
			$document->save_type();
		} else {
			$document = false;
		}

		return $document;
	}

	/**
	 * @since 2.0.0
	 * @access public
	 */
	public function is_editable_by_current_user() {
		return User::is_current_user_can_edit( $this->get_main_id() );
	}

	/**
	 * @since 2.0.0
	 * @access protected
	 */
	protected function _get_initial_config() {
		return [
			'id' => $this->get_main_id(),
			'title' => get_the_title( $this->get_main_id() ),
			'type' => $this->get_name(),
			'remote_type' => $this->get_remote_library_type(),
			'last_edited' => $this->get_last_edited(),
			'panel' => static::get_editor_panel_config(),
			'urls' => [
				'exit_to_dashboard' => $this->get_exit_to_dashboard_url(),
				'preview' => $this->get_preview_url(),
				'wp_preview' => $this->get_wp_preview_url(),
				'permalink' => $this->get_permalink(),
			],
		];
	}

	/**
	 * @since 2.0.0
	 * @access protected
	 */
	protected function _register_controls() {
		$this->start_controls_section(
			'document_settings',
			[
				'label' => __( 'General Settings', 'qazana' ),
				'tab' => Controls_Manager::TAB_SETTINGS,
			]
		);

		$this->add_control(
			'post_title',
			[
				'label' => __( 'Title', 'qazana' ),
				'type' => Controls_Manager::TEXT,
				'default' => $this->post->post_title,
				'label_block' => true,
				'separator' => 'none',
			]
		);

		$post_type_object = get_post_type_object( $this->post->post_type );

		$can_publish = $post_type_object && current_user_can( $post_type_object->cap->publish_posts );
		$is_published = DB::STATUS_PUBLISH === $this->post->post_status || DB::STATUS_PRIVATE === $this->post->post_status;

		if ( $is_published || $can_publish || ! qazana()->get_editor()->is_edit_mode() ) {

			$this->add_control(
				'post_status',
				[
					'label' => __( 'Status', 'qazana' ),
					'type' => Controls_Manager::SELECT,
					'default' => $this->get_main_post()->post_status,
					'options' => get_post_statuses(),
				]
			);
		}

		$this->end_controls_section();

		/**
		 * Register document controls.
		 *
		 * Fires after Qazana registers the document controls.
		 *
		 * @since 2.0.0
		 *
		 * @param Document $this The document instance.
		 */
		do_action( 'qazana/documents/register_controls', $this );
	}

	/**
	 * @since 2.0.0
	 * @access public
	 *
	 * @param $data
	 *
	 * @return bool
	 */
	public function save( $data ) {
		if ( ! $this->is_editable_by_current_user() ) {
			return false;
		}

		if ( DB::STATUS_AUTOSAVE === $data['settings']['post_status'] ) {
			if ( ! defined( 'DOING_AUTOSAVE' ) ) {
				define( 'DOING_AUTOSAVE', true );
			}
		}

		if ( ! empty( $data['settings'] ) ) {
			$this->save_settings( $data['settings'] );
		}

		// Refresh post after save settings.
		$this->post = get_post( $this->post->ID );

		// TODO: refresh settings.
		$this->save_elements( $data['elements'] );

		// Remove Post CSS
		$post_css = new Post_CSS( $this->post->ID );

		$post_css->delete();

		return true;
	}

	/**
	 * Is built with Qazana.
	 *
	 * Check whether the post was built with Qazana.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return bool Whether the post was built with Qazana.
	 */
	public function is_built_with_qazana() {
		return ! ! get_post_meta( $this->post->ID, '_qazana_edit_mode', true );
	}

	/**
	 * @since 2.0.0
	 * @access public
	 * @static
	 *
	 * @return mixed
	 */
	public function get_edit_url() {
		$url = add_query_arg(
			[
				'post' => $this->get_main_id(),
				'action' => 'qazana',
			],
			admin_url( 'post.php' )
		);

		/**
		 * Document edit url.
		 *
		 * Filters the document edit url.
		 *
		 * @since 2.0.0
		 *
		 * @param string   $url  The edit url.
		 * @param Document $this The document instance.
		 */
		$url = apply_filters( 'qazana/document/urls/edit', $url, $this );

		return $url;
	}

	/**
	 * @since 2.0.0
	 * @access public
	 */
	public function get_preview_url() {
		/**
		 * Use a static var - to avoid change the `ver` parameter on every call.
		 */
		static $url;

		if ( empty( $url ) ) {

			add_filter( 'pre_option_permalink_structure', '__return_empty_string' );

			$url = set_url_scheme(
				add_query_arg(
					[
						'qazana-preview' => $this->get_main_id(),
						'ver' => time(),
					],
					$this->get_permalink()
				)
			);

			remove_filter( 'pre_option_permalink_structure', '__return_empty_string' );

			/**
			 * Document preview URL.
			 *
			 * Filters the document preview URL.
			 *
			 * @since 2.0.0
			 *
			 * @param string   $url  The preview URL.
			 * @param Document $this The document instance.
			 */
			$url = apply_filters( 'qazana/document/urls/preview', $url, $this );
		}

		return $url;
	}

	/**
	 * @since 2.0.0
	 * @access public
	 *
	 * @param string $key
	 *
	 * @return array
	 */
	public function get_json_meta( $key ) {
		$meta = get_post_meta( $this->post->ID, $key, true );

		if ( is_string( $meta ) && ! empty( $meta ) ) {
			$meta = json_decode( $meta, true );
		}

		if ( empty( $meta ) ) {
			$meta = [];
		}

		return $meta;
	}

	/**
	 * @since 2.0.0
	 * @access public
	 *
	 * @param null $data
	 * @param bool $with_html_content
	 *
	 * @return array
	 */
	public function get_elements_raw_data( $data = null, $with_html_content = false ) {
		if ( is_null( $data ) ) {
			$data = $this->get_elements_data();
		}

		// Change the current documents, so widgets can use `documents->get_current` and other post data
		qazana()->get_documents()->switch_to_document( $this );

		$editor_data = [];

		foreach ( $data as $element_data ) {
			$element = qazana()->get_elements_manager()->create_element_instance( $this, $element_data );

			if ( ! $element ) {
				continue;
			}

			$editor_data[] = $element->get_raw_data( $with_html_content );
		} // End foreach().

		qazana()->get_documents()->restore_document();

		return $editor_data;
	}

	/**
	 * @since 2.0.0
	 * @access public
	 *
	 * @param string $status
	 *
	 * @return array
	 */
	public function get_elements_data( $status = DB::STATUS_PUBLISH ) {
		$elements = $this->get_json_meta( '_qazana_data' );

		if ( DB::STATUS_DRAFT === $status ) {
			$autosave = $this->get_newer_autosave();

			if ( is_object( $autosave ) ) {
				$autosave_elements = qazana()->get_documents()
					->get( $autosave->get_post()->ID )
					->get_json_meta( '_qazana_data' );
			}
		}

		if ( qazana()->get_editor()->is_edit_mode() ) {
			if ( empty( $elements ) && empty( $autosave_elements ) ) {
				// Convert to Qazana.
				$elements = qazana()->get_db()->get_new_editor_from_wp_editor( $this->post->ID );
				if ( $this->is_autosave() ) {
					qazana()->get_db()->copy_qazana_meta( $this->post->post_parent, $this->post->ID );
				}
			}
		}

		if ( ! empty( $autosave_elements ) ) {
			$elements = $autosave_elements;
		}

		return $elements;
	}

	public function print_elements_with_wrapper( $elements_data = null ) {
		if ( ! $elements_data ) {
			$elements_data = $this->get_elements_data();
		}

		?>
		<div class="<?php echo esc_attr( $this->get_container_classes() ); ?>" data-id="<?php echo esc_attr( $this->post->ID ); ?>" data-settings='<?php echo wp_json_encode( $this->get_frontend_settings() ); ?>'>
			<div class="qazana-inner">
				<div class="qazana-section-wrap">
					<?php $this->print_elements( $elements_data ); ?>
				</div>
			</div>
		</div>
		<?php
	}

	/**
	 * @since 2.0.0
	 * @access public
	 */
	public function get_css_wrapper_selector() {
		return '';
	}

	/**
	 * @since 2.0.0
	 * @access public
	 */
	public function get_panel_page_settings() {
		return [
			/* translators: %s: Document title */
			'title' => sprintf( __( '%s Settings', 'qazana' ), self::get_title() ),
		];
	}

	/**
	 * @since 2.0.0
	 * @access public
	 */
	public function get_post() {
		return $this->post;
	}

	/**
	 * @since 2.0.0
	 * @access public
	 */
	public function get_permalink() {
		return get_permalink( $this->get_main_id() );
	}

	public function get_content( $with_css = false ) {
		return qazana()->get_frontend()->get_builder_content( $this->post->ID, $with_css );
	}

	/**
	 * @since 2.0.0
	 * @access public
	 */
	public function delete() {
		if ( 'revision' === $this->post->post_type ) {
			$deleted = wp_delete_post_revision( $this->post );
		} else {
			$deleted = wp_delete_post( $this->post->ID );
		}

		return $deleted && ! is_wp_error( $deleted );
	}

	/**
	 * Save editor elements.
	 *
	 * Save data from the editor to the database.
	 *
	 * @since 2.0.0
	 * @access protected
	 *
	 * @param array $elements
	 */
	protected function save_elements( $elements ) {
		$editor_data = $this->get_elements_raw_data( $elements );

		// We need the `wp_slash` in order to avoid the unslashing during the `update_post_meta`
		$json_value = wp_slash( wp_json_encode( $editor_data ) );

		// Don't use `update_post_meta` that can't handle `revision` post type
		$is_meta_updated = update_metadata( 'post', $this->post->ID, '_qazana_data', $json_value );

		/**
		 * Before saving data.
		 *
		 * Fires before Qazana saves data to the database.
		 *
		 * @since 1.0.0
		 *
		 * @param string   $status          Post status.
		 * @param int|bool $is_meta_updated Meta ID if the key didn't exist, true on successful update, false on failure.
		 */
		do_action( 'qazana/db/before_save', $this->post->post_status, $is_meta_updated );

		qazana()->get_db()->save_plain_text( $this->post->ID );

		update_metadata( 'post', $this->post->ID, '_qazana_version', DB::DB_VERSION );

		/**
		 * After saving data.
		 *
		 * Fires after Qazana saves data to the database.
		 *
		 * @since 1.0.0
		 *
		 * @param int   $post_id     The ID of the post.
		 * @param array $editor_data Sanitize posted data.
		 */
		do_action( 'qazana/editor/after_save', $this->post->ID, $editor_data );
	}

	/**
	 * @since 2.0.0
	 * @access public
	 *
	 * @param int $user_id Optional. User ID. Default value is `0`.
	 *
	 * @return bool|int
	 */
	public function get_autosave_id( $user_id = 0 ) {
		if ( ! $user_id ) {
			$user_id = get_current_user_id();
		}

		$autosave = Utils::get_post_autosave( $this->post->ID, $user_id );
		if ( $autosave ) {
			return $autosave->ID;
		}

		return false;
	}

	/**
	 * @since 2.0.0
	 * @access public
	 */
	public function save_type() {
		update_post_meta( $this->post->ID, self::TYPE_META_KEY, $this->get_name() );
	}

	/**
	 * @since 2.0.0
	 * @access public
	 *
	 * @param string $key Meta data key.
	 *
	 * @return mixed
	 */
	public function get_main_meta( $key ) {
		return get_post_meta( $this->get_main_id(), $key, true );
	}

	/**
	 * @since 2.0.4
	 * @access public
	 *
	 * @param string $key   Meta data key.
	 * @param string $value Meta data value.
	 *
	 * @return bool|int
	 */
	public function update_main_meta( $key, $value ) {
		return update_post_meta( $this->get_main_id(), $key, $value );
	}

	/**
	 * @since 2.0.4
	 * @access public
	 *
	 * @param string $key   Meta data key.
	 * @param string $value Optional. Meta data value. Default is an empty string.
	 *
	 * @return bool
	 */
	public function delete_main_meta( $key, $value = '' ) {
		return delete_post_meta( $this->get_main_id(), $key, $value );
	}

	/**
	 * @since 2.0.0
	 * @access public
	 *
	 * @param string $key Meta data key.
	 *
	 * @return mixed
	 */
	public function get_meta( $key ) {
		return get_post_meta( $this->post->ID, $key, true );
	}

	/**
	 * @since 2.0.0
	 * @access public
	 *
	 * @param string $key   Meta data key.
	 * @param mixed  $value Meta data value.
	 *
	 * @return bool|int
	 */
	public function update_meta( $key, $value ) {
		// Use `update_metadata` in order to work also with revisions.
		return update_metadata( 'post', $this->post->ID, $key, $value );
	}

	/**
	 * @since 2.0.3
	 * @access public
	 *
	 * @param string $key   Meta data key.
	 * @param string $value Meta data value.
	 *
	 * @return bool
	 */
	public function delete_meta( $key, $value = '' ) {
		// Use `delete_metadata` in order to work also with revisions.
		return delete_metadata( 'post', $this->post->ID, $key, $value );
	}

	/**
	 * @since 2.0.0
	 * @access public
	 */
	public function get_last_edited() {
		$post = $this->post;
		$autosave_post = $this->get_autosave();

		if ( $autosave_post ) {
			$post = $autosave_post->get_post();
		}

		$date = date_i18n( _x( 'M j, H:i', 'revision date format', 'qazana' ), strtotime( $post->post_modified ) );
		$display_name = get_the_author_meta( 'display_name', $post->post_author );

		if ( $autosave_post || 'revision' === $post->post_type ) {
			/* translators: 1: Saving date, 2: Author display name */
			$last_edited = sprintf( __( 'Draft saved on %1$s by %2$s', 'qazana' ), '<time>' . $date . '</time>', $display_name );
		} else {
			/* translators: 1: Editing date, 2: Author display name */
			$last_edited = sprintf( __( 'Last edited on %1$s by %2$s', 'qazana' ), '<time>' . $date . '</time>', $display_name );
		}

		return $last_edited;
	}

	/**
	 * Get widgets
	 *
	 * @return object
	 */
	public function get_widgets() {
		return new Widgets( $this );
	}

	/**
	 * Get elements
	 *
	 * @return object
	 */
	public function get_elements() {
		return new Elements( $this );
	}

	/**
	 * Get widget group to use
	 *
	 * Use this to specify widgets by document types.
	 *
	 * @return array
	 */
	public function get_widget_groups() {
		return [ 'post' ];
	}

	/**
	 * Get document location manager
	 *
	 * Use this to get the document location
	 *
 	 * @return Locations/Manager
	 */
	public function get_locations_manager() {
		return false;
	}

	/**
	 * Get document location
	 */
	public function get_location() {
		$value = self::get_property( 'location' );
		if ( ! $value ) {
			$value = $this->get_main_meta( self::LOCATION_META_KEY );
		}

		return $value;
	}

	public function get_location_label() {
		$location = $this->get_location();
		$locations_settings = $this->get_locations_manager()->get_locations( $location );
		$label = '';
		$is_section_doc_type = 'section' === $this->get_name();

		if ( $location ) {
			if ( $is_section_doc_type ) {
				$label .= isset( $locations_settings['label'] ) ? $locations_settings['label'] : $location;
			}
		}

		$supported = true;

		if ( $is_section_doc_type ) {
			if ( $location && ! $locations_settings ) {
				$supported = false;
			}
		} elseif ( ! $location || ! $locations_settings ) {
			$supported = false;
		}

		if ( ! $supported ) {
			$label .= ' (' . __( 'Unsupported', 'qazana' ) . ')';
		}

		return $label;
	}


	/**
	 * @since 2.0.0
	 * @access public
	 *
	 * @param array $data
	 *
	 * @throws \Exception If the post does not exist.
	 */
	public function __construct( array $data = [] ) {
		if ( $data ) {
			if ( empty( $data['post_id'] ) ) {
				$this->post = new \WP_Post( (object) [] );
			} else {
				$this->post = get_post( $data['post_id'] );

				if ( ! $this->post ) {
					throw new \Exception( sprintf( 'Post ID #%s does not exist.', $data['post_id'] ), Exceptions::NOT_FOUND );
				}
			}

			// Each Control_Stack is based on a unique ID.
			$data['id'] = $data['post_id'];

			if ( ! isset( $data['settings'] ) ) {
				$data['settings'] = [];
			}

			$saved_settings = get_post_meta( $this->post->ID, '_qazana_page_settings', true );
			if ( ! empty( $saved_settings ) && is_array( $saved_settings ) ) {
				$data['settings'] += $saved_settings;
			}
		}

		parent::__construct( $data );
	}

	/**
	 * @since 2.0.0
	 * @access protected
	 *
	 * @param $settings
	 */
	protected function save_settings( $settings ) {
		$page_settings_manager = SettingsManager::get_settings_managers( 'page' );
		$page_settings_manager->ajax_before_save_settings( $settings, $this->post->ID );
		$page_settings_manager->save_settings( $settings, $this->post->ID );
	}

	protected function print_elements( $elements_data ) {
		foreach ( $elements_data as $element_data ) {
			$element = qazana()->get_elements_manager()->create_element_instance( $this, $element_data );

			if ( ! $element ) {
				continue;
			}

			$element->print_element();
		}
	}

	/**
	 * Load the document element scripts
	 *
	 * @param array $data a set of elements
	 */
	public function enqueue() {
		$this->get_dependencies();
		$this->enqueue_dependencies();
	}

	/**
	 * Get all registered element scripts and stylesheets
	 *
	 * @param array $data a set of elements
	 */
	public function get_dependencies( $elements_data = null ) {

		if ( ! $elements_data ) {
			$elements_data = $this->get_elements_data();
		}

		qazana()->get_db()->iterate_data(
			$elements_data,
			function( $element ) {

				$element_instance = qazana()->get_elements_manager()->create_element_instance( $this, $element );

				// Exit if the element doesn't exist
				if ( ! $element_instance ) {
					return $element;
				}

				$element_instance->add_element_dependencies();

				// Add skin dependencies.
				if ( 'widget' === $element['elType'] && $element_instance->get_current_skin() ) {

					$skin = $element_instance->get_current_skin();

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
			}
		);
	}

	/**
	 * Enqueue scripts and stylesheets
	 *
	 * @param array $data a set of elements
	 */
	public function enqueue_dependencies() {

		if ( ! empty( $this->element_scripts ) && is_array( $this->element_scripts ) ) {
			foreach ( $this->element_scripts as $key ) {
				wp_enqueue_script( $key );
			}
		}

		if ( ! empty( $this->element_stylesheets ) && is_array( $this->element_stylesheets ) ) {
			foreach ( $this->element_stylesheets as $key ) {
				wp_enqueue_style( $key );
			}
		}
	}

	/**
	 * Preview as options
	 */
	public static function get_archive_preview_as_options() {
		$post_type_archives = [];
		$taxonomies = [];
		$post_types = Utils::get_post_types();
		unset( $post_types['product'] );

		foreach ( $post_types as $post_type => $label ) {
			$post_type_object = get_post_type_object( $post_type );

			if ( $post_type_object->has_archive ) {
				$post_type_archives[ 'post_type_archive/' . $post_type ] = sprintf( __( '%s Archive', 'qazana' ), $post_type_object->label );
			}

			$post_type_taxonomies = get_object_taxonomies( $post_type, 'objects' );

			$post_type_taxonomies = wp_filter_object_list(
				$post_type_taxonomies,
				[
					'public' => true,
					'show_in_nav_menus' => true,
				]
			);

			foreach ( $post_type_taxonomies as $slug => $object ) {
				$taxonomies[ 'taxonomy/' . $slug ] = sprintf( __( '%s Archive', 'qazana' ), $object->label );
			}
		}

		return [
			'archive' => [
				'label' => __( 'Archive', 'qazana' ),
				'options' => [
					'archive/recent_posts' => __( 'Recent Posts', 'qazana' ),
					'archive/date' => __( 'Date Archive', 'qazana' ),
					'archive/author' => __( 'Author Archive', 'qazana' ),
					'search' => __( 'Search Results', 'qazana' ),
				] + $taxonomies + $post_type_archives,
			],
		];
	}

	/**
	 * Preview as options
	 */
	public static function get_single_preview_as_options() {
		$post_types = Utils::get_post_types();
		$post_types['attachment'] = get_post_type_object( 'attachment' )->label;
		unset( $post_types['product'] );

		$post_types_options = [];

		foreach ( $post_types as $post_type => $label ) {
			$post_types_options[ 'single/' . $post_type ] = get_post_type_object( $post_type )->labels->singular_name;
		}

		return [
			'single' => [
				'label' => __( 'Single', 'qazana' ),
				'options' => $post_types_options,
			],
			'page/404' => __( '404', 'qazana' ),
		];
	}

	public static function get_preview_as_options() {
		return array_merge(
			[
				'' => __( 'Select...', 'qazana' ),
			],
			self::get_archive_preview_as_options(),
			self::get_single_preview_as_options()
		);
	}

	public function _register_preview_controls() {

		$this->start_controls_section(
			'preview_settings',
			[
				'label' => __( 'Preview Settings', 'qazana' ),
				'tab' => Controls_Manager::TAB_SETTINGS,
			]
		);

		$this->add_control(
			'preview_type',
			[
				'label' => __( 'Preview Dynamic Content as', 'qazana' ),
				'label_block' => true,
				'type' => Controls_Manager::SELECT,
				'default' => $this::get_preview_as_default(),
				'groups' => $this::get_preview_as_options(),
				'export' => false,
			]
		);

		$this->add_control(
			'preview_id',
			[
				'type' => 'query',
				'label_block' => true,
				'filter_type' => '',
				'object_type' => '',
				'separator' => 'none',
				'export' => false,
				'condition' => [
					'preview_type!' => [
						'',
						'search',
					],
				],
			]
		);

		$this->add_control(
			'preview_search_term',
			[
				'label' => __( 'Search Term', 'qazana' ),
				'export' => false,
				'condition' => [
					'preview_type' => 'search',
				],
			]
		);

		$this->add_control(
			'apply_preview',
			[
				'type' => Controls_Manager::BUTTON,
				'label' => __( 'Apply & Preview', 'qazana' ),
				'label_block' => true,
				'show_label' => false,
				'text' => __( 'Apply & Preview', 'qazana' ),
				'separator' => 'none',
				'event' => 'qazanaDocumentConditions:ApplyPreview',
			]
		);

		$this->end_controls_section();

		$post_type = $this->get_main_meta( self::SUB_TYPE_META_KEY );

		$latest_posts = get_posts( [
			'posts_per_page' => 1,
			'post_type' => $post_type,
		] );

		if ( ! empty( $latest_posts ) ) {
			$this->update_control(
				'preview_type',
				[
					'default' => 'single/' . $post_type,
				]
			);

			$this->update_control(
				'preview_id',
				[
					'default' => $latest_posts[0]->ID,
				]
			);
		}

	}

}
