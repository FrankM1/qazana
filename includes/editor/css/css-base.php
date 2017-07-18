<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class CSS_Base {

	const FILE_BASE_DIR = '/qazana/css';

	// %s: Base folder; %s: file prefix; %d: post_id
	const FILE_NAME_PATTERN = '%s/%s%d.css';

	const FILE_PREFIX = 'post-';

	const CSS_STATUS_FILE = 'file';

	const CSS_STATUS_INLINE = 'inline';

	const CSS_STATUS_EMPTY = 'empty';

	const META_KEY_CSS = '_qazana_css';

	/*
	 * @var int
	 */
	protected $post_id;

	protected $is_built_with_qazana;

	protected $path;

	protected $url;

	protected $css = '';

	/**
	 * @var Stylesheet
	 */
	public $stylesheet_obj;

	public function is_built_with_qazana() {
		return $this->is_built_with_qazana;
	}

	public function get_stylesheet() {
		return $this->stylesheet_obj;
	}

	public function delete() {
		if ( file_exists( $this->path ) ) {
			unlink( $this->path );
		}
	}

	public function enqueue() {
		if ( ! $this->is_built_with_qazana() ) {
			return;
		}

		$meta = $this->get_meta();

		if ( self::CSS_STATUS_EMPTY === $meta['status'] ) {
			return;
		}

		// First time after clear cache and etc.
		if ( '' === $meta['status'] ) {
			$this->update();
			$meta = $this->get_meta();
		}

		if ( self::CSS_STATUS_INLINE === $meta['status'] ) {
			wp_add_inline_style( 'qazana-frontend', $meta['css'] );
		} else {
			wp_enqueue_style( 'qazana-post-' . $this->post_id, $this->url, [ 'qazana-frontend' ], $meta['time'] );
		}

		// Handle fonts
		if ( ! empty( $meta['fonts'] ) ) {
			foreach ( $meta['fonts'] as $font ) {
				qazana()->frontend->add_enqueue_font( $font );
			}
		}
	}

	/**
	 * @return int
	 */
	public function get_post_id() {
		return $this->post_id;
	}

	protected function set_path_and_url() {
		$wp_upload_dir = wp_upload_dir( null, false );
		$relative_path = sprintf( self::FILE_NAME_PATTERN, self::FILE_BASE_DIR, self::FILE_PREFIX, $this->post_id );
		$this->path = $wp_upload_dir['basedir'] . $relative_path;
		$this->url = set_url_scheme( $wp_upload_dir['baseurl'] . $relative_path );
	}

}
