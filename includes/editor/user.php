<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Qazana user.
 *
 * Qazana user handler class is responsible for checking if the user can edit
 * with Qazana and displaying different admin notices.
 *
 * @since 1.0.0
 */
class User {

	/**
	 * The admin notices key.
	 */
	const ADMIN_NOTICES_KEY = 'qazana_admin_notices';

	/**
	 * Init.
	 *
	 * Initialize Qazana user.
	 *
	 * @since 1.0.0
	 * @access public
	 * @static
	 */
	public static function init() {
		add_action( 'wp_ajax_qazana_set_admin_notice_viewed', [ __CLASS__, 'ajax_set_admin_notice_viewed' ] );
	}

	/**
	 * Is current user can edit.
	 *
	 * Whether the current user can edit the post.
	 *
	 * @since 1.0.0
	 * @access public
	 * @static
	 *
	 * @param int $post_id Optional. The post ID. Default is `0`.
	 *
	 * @return bool Whether the current user can edit the post.
	 */
	public static function is_current_user_can_edit( $post_id = 0 ) {
		$post = get_post( $post_id );

		if ( ! $post ) {
			return false;
		}

		if ( 'trash' === get_post_status( $post_id ) ) {
			return false;
		}

		if ( ! self::is_current_user_can_edit_post_type( $post->post_type ) ) {
			return false;
		}

		$post_type_object = get_post_type_object( $post->post_type );

		if ( ! isset( $post_type_object->cap->edit_post ) ) {
			return false;
		}

		$edit_cap = $post_type_object->cap->edit_post;
		if ( ! current_user_can( $edit_cap, $post_id ) ) {
			return false;
		}

		if ( get_option( 'page_for_posts' ) === $post_id ) {
			return false;
		}

		return true;
	}

	/**
	 * Is current user can access qazana.
	 *
	 * Whether the current user role is not excluded by Qazana Settings.
	 *
	 * @access public
	 * @static
	 *
	 * @return bool True if can access, False otherwise.
	 */
	public static function is_current_user_in_editing_black_list() {
		$user = wp_get_current_user();
		$exclude_roles = get_option( 'qazana_exclude_user_roles', [] );

		$compare_roles = array_intersect( $user->roles, $exclude_roles );
		if ( ! empty( $compare_roles ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Is current user can edit post type.
	 *
	 * Whether the current user can edit the given post type.
	 *
	 * @since 1.9.0
	 * @access public
	 * @static
	 *
	 * @param string $post_type the post type slug to check.
	 *
	 * @return bool True if can edit, False otherwise.
	 */
	public static function is_current_user_can_edit_post_type( $post_type ) {
		if ( ! self::is_current_user_in_editing_black_list() ) {
			return false;
		}

		if ( ! Utils::is_post_type_support( $post_type ) ) {
			return false;
		}

		$post_type_object = get_post_type_object( $post_type );

		if ( ! current_user_can( $post_type_object->cap->edit_posts ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Get user notices.
	 *
	 * Retrieve the list of notices for the current user.
	 *
	 * @since 2.0.0
	 * @access private
	 * @static
	 *
	 * @return array A list of user notices.
	 */
	private static function get_user_notices() {
		return get_user_meta( get_current_user_id(), self::ADMIN_NOTICES_KEY, true );
	}

	/**
	 * Is user notice viewed.
	 *
	 * Whether the notice was viewed by the user.
	 *
	 * @since 1.0.0
	 * @access public
	 * @static
	 *
	 * @param int $notice_id The notice ID.
	 *
	 * @return bool Whether the notice was viewed by the user.
	 */
	public static function is_user_notice_viewed( $notice_id ) {
		$notices = self::get_user_notices();
		if ( empty( $notices ) || empty( $notices[ $notice_id ] ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Set admin notice as viewed.
	 *
	 * Flag the user admin notice as viewed using an authenticated ajax request.
	 *
	 * Fired by `wp_ajax_qazana_set_admin_notice_viewed` action.
	 *
	 * @since 1.0.0
	 * @access public
	 * @static
	 */
	public static function ajax_set_admin_notice_viewed() {
		if ( empty( $_POST['notice_id'] ) ) {
			die;
		}

		$notices = self::get_user_notices();
		if ( empty( $notices ) ) {
			$notices = [];
		}

		$notices[ $_POST['notice_id'] ] = 'true';
		update_user_meta( get_current_user_id(), self::ADMIN_NOTICES_KEY, $notices );

		die;
	}
}

User::init();
