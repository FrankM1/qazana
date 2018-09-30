<?php
namespace Qazana\Extensions\History;

use Qazana\Core\Base\Document;
use Qazana\Core\Files\CSS\Post as Post_CSS;
use Qazana\Core\Settings\Manager;
use Qazana\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Qazana history revisions manager.
 *
 * Qazana history revisions manager handler class is responsible for
 * registering and managing Qazana revisions manager.
 *
 * @since 1.0.0
 */
class Revisions_Manager {

	/**
	 * Maximum number of revisions to display.
	 */
	const MAX_REVISIONS_TO_DISPLAY = 100;

	/**
	 * Authors list.
	 *
	 * Holds all the authors.
	 *
	 * @access private
	 *
	 * @var array
	 */
	private static $authors = [];

	/**
	 * History revisions manager constructor.
	 *
	 * Initializing Qazana history revisions manager.
	 *
	 * @since 1.7.0
	 * @access public
	 */
	public function __construct() {
		self::register_actions();
	}

	/**
	 * @since 1.7.0
	 * @access public
	 * @static
	 */
	public static function handle_revision() {
		add_filter( 'wp_save_post_revision_check_for_changes', '__return_false' );
	}

	/**
	 * @since  2.0.0
	 * @access public
	 * @static
	 *
	 * @param $post_content
	 * @param $post_id
	 *
	 * @return string
	 */
	public static function avoid_delete_auto_save( $post_content, $post_id ) {
		// Add a temporary string in order the $post will not be equal to the $autosave
		// in edit-form-advanced.php:210
		if ( $post_id && qazana()->db->is_built_with_qazana( $post_id ) ) {
			$post_content .= '<!-- Created with Qazana -->';
		}

		return $post_content;
	}

	/**
	 * @since 2.0.0
	 * @access public
	 * @static
	 */
	public static function remove_temp_post_content() {
		global $post;

		if ( qazana()->db->is_built_with_qazana( $post->ID ) ) {
			$post->post_content = str_replace( '<!-- Created with Qazana -->', '', $post->post_content );
		}
	}

	/**
	 * @since 1.7.0
	 * @access public
	 * @static
	 *
	 * @param int   $post_id
	 * @param array $query_args
	 * @param bool  $parse_result
	 *
	 * @return array
	 */
	public static function get_revisions( $post_id = 0, $query_args = [], $parse_result = true ) {
		$post = get_post( $post_id );

		if ( ! $post || empty( $post->ID ) ) {
			return [];
		}

		$revisions = [];

		$default_query_args = [
			'posts_per_page' => self::MAX_REVISIONS_TO_DISPLAY,
			'meta_key' => '_qazana_data',
		];

		$query_args = array_merge( $default_query_args, $query_args );

		$posts = wp_get_post_revisions( $post->ID, $query_args );

		if ( ! wp_revisions_enabled( $post ) ) {
			$autosave = Utils::get_post_autosave( $post->ID );
			if ( $autosave ) {
				if ( $parse_result ) {
					array_unshift( $posts, $autosave );
				} else {
					array_unshift( $posts, $autosave->ID );
				}
			}
		}

		if ( $parse_result ) {
			array_unshift( $posts, $post );
		} else {
			array_unshift( $posts, $post->ID );
			return $posts;
		}

		$current_time = current_time( 'timestamp' );

		/** @var \WP_Post $revision */
		foreach ( $posts as $revision ) {
			$date = date_i18n( _x( 'M j @ H:i', 'revision date format', 'qazana' ), strtotime( $revision->post_modified ) );

			$human_time = human_time_diff( strtotime( $revision->post_modified ), $current_time );

			if ( $revision->ID === $post->ID ) {
				$type = 'current';
			} elseif ( false !== strpos( $revision->post_name, 'autosave' ) ) {
				$type = 'autosave';
			} else {
				$type = 'revision';
			}

			if ( ! isset( self::$authors[ $revision->post_author ] ) ) {
				self::$authors[ $revision->post_author ] = [
					'avatar' => get_avatar( $revision->post_author, 22 ),
					'display_name' => get_the_author_meta( 'display_name', $revision->post_author ),
				];
			}

			$revisions[] = [
				'id' => $revision->ID,
				'author' => self::$authors[ $revision->post_author ]['display_name'],
				'timestamp' => strtotime( $revision->post_modified ),
				'date' => sprintf(
					/* translators: 1: Human readable time difference, 2: Date */
					__( '%1$s ago (%2$s)', 'qazana' ),
					$human_time,
					$date
				),
				'type' => $type,
				'gravatar' => self::$authors[ $revision->post_author ]['avatar'],
			];
		}

		return $revisions;
	}

	/**
	 * @since 1.9.2
	 * @access public
	 * @static
	 */
	public static function update_autosave( $autosave_data ) {
		self::save_revision( $autosave_data['ID'] );
	}

	/**
	 * @since 1.7.0
	 * @access public
	 * @static
	 */
	public static function save_revision( $revision_id ) {
		$parent_id = wp_is_post_revision( $revision_id );

		if ( $parent_id ) {
			qazana()->db->safe_copy_qazana_meta( $parent_id, $revision_id );
		}
	}

	/**
	 * @since 1.7.0
	 * @access public
	 * @static
	 */
	public static function restore_revision( $parent_id, $revision_id ) {
		$is_built_with_qazana = qazana()->db->is_built_with_qazana( $revision_id );

		qazana()->db->set_is_qazana_page( $parent_id, $is_built_with_qazana );

		if ( ! $is_built_with_qazana ) {
			return;
		}

		qazana()->db->copy_qazana_meta( $revision_id, $parent_id );

		$post_css = new Post_CSS( $parent_id );

		$post_css->update();
	}

	/**
	 * @since 1.7.0
	 * @access public
	 * @static
	 */
	public static function on_revision_data_request() {
		qazana()->editor->verify_ajax_nonce();

		if ( ! isset( $_POST['id'] ) ) {
			wp_send_json_error( 'You must set the revision ID.' );
		}

		$revision = get_post( $_POST['id'] );

		if ( empty( $revision ) ) {
			wp_send_json_error( 'Invalid revision.' );
		}

		if ( ! current_user_can( 'edit_post', $revision->ID ) ) {
			wp_send_json_error( __( 'Access denied.', 'qazana' ) );
		}

		$revision_data = [
			'settings' => Manager::get_settings_managers( 'page' )->get_model( $revision->ID )->get_settings(),
			'elements' => qazana()->db->get_plain_editor( $revision->ID ),
		];

		wp_send_json_success( $revision_data );
	}

	/**
	 * @since 1.7.0
	 * @access public
	 * @static
	 */
	public static function on_delete_revision_request() {
		qazana()->editor->verify_ajax_nonce();

		if ( empty( $_POST['id'] ) ) {
			wp_send_json_error( 'You must set the revision ID.' );
		}

		$revision = get_post( $_POST['id'] );

		if ( empty( $revision ) ) {
			wp_send_json_error( 'Invalid revision.' );
		}

		if ( ! current_user_can( 'delete_post', $revision->ID ) ) {
			wp_send_json_error( __( 'Access denied.', 'qazana' ) );
		}

		$deleted = wp_delete_post_revision( $revision->ID );

		if ( $deleted && ! is_wp_error( $deleted ) ) {
			wp_send_json_success();
		} else {
			wp_send_json_error( __( 'Cannot delete this revision.', 'qazana' ) );
		}
	}

	/**
	 * @since 1.7.0
	 * @access public
	 * @static
	 */
	public static function add_revision_support_for_all_post_types() {
		$post_types = get_post_types_by_support( 'qazana' );
		foreach ( $post_types as $post_type ) {
			add_post_type_support( $post_type, 'revisions' );
		}
	}

	/**
	 * @since 2.0.0
	 * @access public
	 * @static
	 * @param array $return_data
	 * @param Document $document
	 *
	 * @return array
	 */
	public static function on_ajax_save_builder_data( $return_data, $document ) {
		$post_id = $document->get_main_id();

		$latest_revisions = self::get_revisions(
			$post_id, [
				'posts_per_page' => 1,
			]
		);

		$all_revision_ids = self::get_revisions(
			$post_id, [
				'fields' => 'ids',
			], false
		);

		// Send revisions data only if has revisions.
		if ( ! empty( $latest_revisions ) ) {
			$current_revision_id = self::current_revision_id( $post_id );

			$return_data = array_replace_recursive( $return_data, [
				'config' => [
					'current_revision_id' => $current_revision_id,
				],
				'latest_revisions' => $latest_revisions,
				'revisions_ids' => $all_revision_ids,
			] );
		}

		return $return_data;
	}

	/**
	 * @since 1.7.0
	 * @access public
	 * @static
	 */
	public static function db_before_save( $status, $has_changes ) {
		if ( $has_changes ) {
			self::handle_revision();
		}
	}

	/**
	 * Localize settings.
	 *
	 * Add new localized settings for the revisions manager.
	 *
	 * Fired by `qazana/editor/localize_settings` filter.
	 *
	 * @since 1.7.0
	 * @access public
	 * @static
	 */
	public static function editor_settings( $settings, $post_id ) {
		$settings = array_replace_recursive( $settings, [
			'revisions' => self::get_revisions(),
			'revisions_enabled' => ( $post_id && wp_revisions_enabled( get_post( $post_id ) ) ),
			'current_revision_id' => self::current_revision_id( $post_id ),
			'i18n' => [
				'edit_draft' => __( 'Edit Draft', 'qazana' ),
				'edit_published' => __( 'Edit Published', 'qazana' ),
				'no_revisions_1' => __( 'Revision history lets you save your previous versions of your work, and restore them any time.', 'qazana' ),
				'no_revisions_2' => __( 'Start designing your page and you\'ll be able to see the entire revision history here.', 'qazana' ),
				'current' => __( 'Current Version', 'qazana' ),
				'restore' => __( 'Restore', 'qazana' ),
				'restore_auto_saved_data' => __( 'Restore Auto Saved Data', 'qazana' ),
				'restore_auto_saved_data_message' => __( 'There is an autosave of this post that is more recent than the version below. You can restore the saved data fron the Revisions panel', 'qazana' ),
				'revision' => __( 'Revision', 'qazana' ),
				'revision_history' => __( 'Revision History', 'qazana' ),
				'revisions_disabled_1' => __( 'It looks like the post revision feature is unavailable in your website.', 'qazana' ),
				'revisions_disabled_2' => sprintf(
					/* translators: %s: Codex URL */
					__( 'Learn more about <a target="_blank" href="%s">WordPress revisions</a>', 'qazana' ),
					'https://codex.wordpress.org/Revisions#Revision_Options'
				),
			],
		] );

		return $settings;
	}

	/**
	 * @since 1.7.0
	 * @access private
	 * @static
	 */
	private static function register_actions() {
		add_action( 'wp_restore_post_revision', [ __CLASS__, 'restore_revision' ], 10, 2 );
		add_action( 'init', [ __CLASS__, 'add_revision_support_for_all_post_types' ], 9999 );
		add_filter( 'qazana/editor/localize_settings', [ __CLASS__, 'editor_settings' ], 10, 2 );
		add_action( 'qazana/db/before_save', [ __CLASS__, 'db_before_save' ], 10, 2 );
		add_action( '_wp_put_post_revision', [ __CLASS__, 'save_revision' ] );
		add_action( 'wp_creating_autosave', [ __CLASS__, 'update_autosave' ] );

		// Hack to avoid delete the auto-save revision in WP editor.
		add_filter( 'edit_post_content', [ __CLASS__, 'avoid_delete_auto_save' ], 10, 2 );
		add_action( 'edit_form_after_title', [ __CLASS__, 'remove_temp_post_content' ] );

		if ( Utils::is_ajax() ) {
			add_filter( 'qazana/documents/ajax_save/return_data', [ __CLASS__, 'on_ajax_save_builder_data' ], 10, 2 );
			add_action( 'wp_ajax_qazana_get_revision_data', [ __CLASS__, 'on_revision_data_request' ] );
			add_action( 'wp_ajax_qazana_delete_revision', [ __CLASS__, 'on_delete_revision_request' ] );
		}
	}

	/**
	 * @since 1.9.0
	 * @access private
	 * @static
	 */
	private static function current_revision_id( $post_id ) {
		$current_revision_id = $post_id;
		$autosave = Utils::get_post_autosave( $post_id );

		if ( is_object( $autosave ) ) {
			$current_revision_id = $autosave->ID;
		}

		return $current_revision_id;
	}
}
