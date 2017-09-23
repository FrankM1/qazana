<?php
namespace Qazana\PageSettings;

use Qazana\Post_CSS_File;
use Qazana\Utils;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Manager {

	const TEMPLATE_CANVAS = 'qazana_canvas';

	const META_KEY = '_qazana_page_settings';

	public static function ajax_save_page_settings() {
		if ( empty( $_POST['id'] ) ) {
			wp_send_json_error( 'You must set the post ID' );
		}

		$data = json_decode( stripslashes( $_POST['data'] ), true );

		$post = get_post( $_POST['id'] );

		if ( empty( $post ) ) {
			wp_send_json_error( 'Invalid Post' );
		}

		$post->post_title = $data['post_title'];

		if ( isset( $data['post_status'] ) ) {
			$post->post_status = $data['post_status'];
		}

		$saved = wp_update_post( $post );

		if ( isset( $data['template'] ) && Manager::is_cpt_custom_templates_supported() ) {
			update_post_meta( $post->ID, '_wp_page_template', $data['template'] );
		}

		self::save_page_settings( $post->ID, $data );

		if ( $saved ) {
			wp_send_json_success();
		} else {
			wp_send_json_error();
		}
	}

	public static function save_page_settings( $post_id, $settings ) {
		$special_settings = [
			'id',
			'post_title',
			'post_status',
			'template',
		];

		$special_settings = apply_filters( 'qazana/editor/page_settings/special_settings', $special_settings, $post_id );

		foreach ( $special_settings as $special_setting ) {
			if ( isset( $settings[ $special_setting ] ) ) {
				unset( $settings[ $special_setting ] );
			}
		}

		if ( ! empty( $settings ) ) {
			update_post_meta( $post_id, self::META_KEY, $settings );
		} else {
			delete_post_meta( $post_id, self::META_KEY );
		}

		do_action( 'qazana/editor/page_settings/save', $settings, $post_id );

		$css_file = new Post_CSS_File( $post_id );

		$css_file->update();
	}

	public static function template_include( $template ) {
		if ( is_singular() ) {
			$page_template = get_post_meta( get_the_ID(), '_wp_page_template', true );
			if ( self::TEMPLATE_CANVAS === $page_template ) {
				$template = qazana()->plugin_dir . 'templates/default/qazana.php';
			}
		}

		return $template;
	}

	public static function add_page_templates( $post_templates ) {
		$post_templates = [
				self::TEMPLATE_CANVAS => __( 'Qazana', 'qazana' ) . ' ' . __( 'Canvas', 'qazana' ),
		] + $post_templates;

		return $post_templates;
	}

	public static function is_cpt_custom_templates_supported() {
		require_once ABSPATH . '/wp-admin/includes/theme.php';

		return method_exists( wp_get_theme(), 'get_post_templates' );
	}

	public static function get_page( $post_id, $settings = [] ) {
		if ( ! $settings ) {
			$settings = self::get_saved_settings( $post_id );
		}

		return new Page( [
			'id' => $post_id,
			'settings' => $settings,
		] );
	}

	public static function init() {
		$post_types = get_post_types_by_support( 'qazana' );

		foreach ( $post_types as $post_type ) {
			add_filter( "theme_{$post_type}_templates", [ __CLASS__, 'add_page_templates' ], 10, 4 );
		}
	}

	public function __construct() {
		require qazana()->includes_dir . 'editor/page.php';

		if ( Utils::is_ajax() ) {
			add_action( 'wp_ajax_qazana_save_page_settings', [ __CLASS__, 'ajax_save_page_settings' ] );
		}

		add_action( 'init', [ __CLASS__, 'init' ] );

		add_filter( 'template_include', [ __CLASS__, 'template_include' ] );
	}

	private static function get_saved_settings( $post_id ) {
		$settings = get_post_meta( $post_id, Manager::META_KEY, true );

		return $settings ? $settings : [];
	}
}
