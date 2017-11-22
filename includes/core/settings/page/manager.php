<?php
namespace Qazana\Core\Settings\Page;

use Qazana\CSS_File;
use Qazana\Core\Settings\Base\Manager as BaseManager;
use Qazana\Core\Settings\Manager as SettingsManager;
use Qazana\Core\Settings\Base\Model as BaseModel;
use Qazana\Post_CSS_File;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Manager extends BaseManager {

	const TEMPLATE_CANVAS = 'qazana_canvas';

	const META_KEY = '_qazana_page_settings';

	public function __construct() {
		parent::__construct();

		add_action( 'init', [ $this, 'init' ] );

		add_filter( 'template_include', [ $this, 'template_include' ] );
	}

	/**
	 * @deprecated since 1.6.0
	 *
	 * @param int $id
	 *
	 * @return BaseModel
	 */
	public static function get_page( $id ) {
		return SettingsManager::get_settings_managers( 'page' )->get_model( $id );
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

	public function template_include( $template ) {
		if ( is_singular() ) {
			$page_template = get_post_meta( get_the_ID(), '_wp_page_template', true );

			if ( self::TEMPLATE_CANVAS === $page_template ) {
				$template = qazana()->plugin_dir . 'templates/default/qazana.php';
			}
		}

		return $template;
	}

	public function init() {
		$post_types = get_post_types_by_support( 'qazana' );

		foreach ( $post_types as $post_type ) {
			add_filter( "theme_{$post_type}_templates", [ __CLASS__, 'add_page_templates' ], 10, 4 );
		}
	}

	public function get_name() {
		return 'page';
	}

	/**
	 * @return BaseModel
	 */
	public function get_model_for_config() {
		return $this->get_model( get_the_ID() );
	}

	protected function ajax_before_save_settings( array $data, $id ) {
		$post = get_post( $id );

		if ( empty( $post ) ) {
			wp_send_json_error( 'Invalid Post' );
		}

		$post->post_title = $data['post_title'];

		if ( isset( $data['post_status'] ) ) {
			$post->post_status = $data['post_status'];
		}

		wp_update_post( $post );
        
		if ( self::is_cpt_custom_templates_supported() ) {
			$template = 'default';

			if ( isset( $data['template'] ) ) {
				$template = $data['template'];
			}

			update_post_meta( $post->ID, '_wp_page_template', $template );
		}
	}

	protected function save_settings_to_db( array $settings, $id ) {

		$settings = apply_filters( 'qazana/core/settings/'. $this->get_name() .'/to_save', $settings, $id );
		
		if ( ! empty( $settings ) ) {
			update_post_meta( $id, self::META_KEY, $settings );
		} else {
			delete_post_meta( $id, self::META_KEY );
		}
	}

	protected function get_css_file_for_update( $id ) {
		return new Post_CSS_File( $id );
	}

	protected function get_saved_settings( $id ) {
		$settings = get_post_meta( $id, self::META_KEY, true );

		if ( ! $settings ) {
			$settings = [];
		}

		if ( self::is_cpt_custom_templates_supported() ) {
			$saved_template = get_post_meta( $id, '_wp_page_template', true );

			if ( $saved_template ) {
				$settings['template'] = $saved_template;
			}
		}

		return $settings;
	}

	protected function get_css_file_name() {
		return 'post';
	}

	/**
	 * @param CSS_File $css_file
	 *
	 * @return BaseModel
	 */
	protected function get_model_for_css_file( CSS_File $css_file ) {
		if ( ! $css_file instanceof Post_CSS_File ) {
			return null;
		}

		return $this->get_model( $css_file->get_post_id() );
	}

	protected function get_special_settings_names() {
		$special_settings = [
			'id',
			'post_title',
			'post_status',
			'template',
		];

		return apply_filters( 'qazana/core/settings/page/special_settings', $special_settings );
	}
}
