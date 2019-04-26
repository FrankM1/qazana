<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 *
 * @property array $icons   A list of font-icon classes. [ 'class-name' => 'nicename', ... ]
 *                            Default Font Awesome icons from the `get_icons` function
 * @property array $include list of classes to include form the $icons property
 * @property array $exclude list of classes to exclude form the $icons property
 *
 * @since 1.0.0
 */
class Icons_Manager {

	/**
	 * Default Icons
     *
	 * @var array
	 */
	private static $default_iconsets = [
		'font-awesome' => array(
			'name' => 'Font Awesome',
			'prefix' => 'fa fa-',
		),
		'elicons' => array(
			'name' => 'Font Awesome',
			'prefix' => 'el el-',
		),
	];

	/**
	 * Add iconset Register new iconset
     *
	 * @param ID
	 * @param Skin_Base   $skin   [description]
	 */
	public function add_iconset( $set_id, $icons ) {

		if ( ! isset( $this->_iconsets[ $set_id ] ) ) {
			$this->_iconsets[ $set_id ] = [];
		}

		$this->_iconsets[ $set_id ] = $icons;

		return true;
	}

	/**
	 * [remove_iconset description]
	 * @param Widget_Base $iconset  [description]
	 * @param [type]      $set_id [description]
	 */
	public function remove_iconset( $set_id ) {

		if ( ! isset( $this->_iconsets[ $set_id ] ) ) {
			return new \WP_Error( 'Cannot remove not-existent set.' );
		}

		unset( $this->_iconsets[ $set_id ] );

		return true;
	}

	/**
	 * [get_iconset description]
	 * @param Widget_Base $iconset [description]
	 */
	public function get_iconset( $set_id ) {

		if ( ! isset( $this->_iconsets[ $set_id ] ) ) {
			return false;
		}

		return $this->_iconsets[ $set_id ];
	}

	/**
	 * [get_iconset description]
	 * @param Widget_Base $iconset [description]
	 */
	public function get_all_iconsets() {

		if ( empty( $this->_iconsets ) ) {
			return false;
		}

		return $this->_iconsets;
	}

	/**
	 * [get_file_content description]
	 * @param  [type] $template_id [description]
	 * @return [type]              [description]
	 */
	public function get_file_content( $file_path ) {

		global $wp_filesystem;

		if ( empty( $wp_filesystem ) ) {
			require ABSPATH . 'wp-admin/includes/file.php';
			\WP_Filesystem();
		}

		$response = $wp_filesystem->get_contents( $file_path );

		if ( is_wp_error( $response ) ) {
			return false;
		}

		$file_content = json_decode( $response, true );
		if ( empty( $file_content ) || ! is_array( $file_content ) ) {
			return false;
		}

		return $file_content;
	}

	/**
	 * [get_fontawesome_icons description]
	 * @param  [type] $template_id [description]
	 * @return [type]              [description]
	 */
	public function get_icons_for_controls( $file_path, $template_id, $prefix = '' ) {

		$formated_icons = array();

		$file_content = self::get_file_content( $file_path );

		$icons = $file_content['icons'];

		if ( empty( $icons ) || ! array( $icons ) ) {
			return false;
		}

		foreach ( $icons as $icon => $value ) {
			$formated_icons[ $prefix . $value['id'] ] = $value['name'];
		}

		return $formated_icons;
	}
}
