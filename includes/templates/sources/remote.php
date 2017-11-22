<?php
namespace Qazana\Template_Library;

use Qazana\Core\Settings\Page\Model as Page;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Source_Remote extends Source_Base {

	/**
	 * @since 1.0.0
	 * @access public
	*/
	public function get_id() {
		return 'remote';
	}

	/**
	 * @since 1.0.0
	 * @access public
	*/
	public function get_title() {
		return __( 'Remote', 'qazana' );
	}

	/**
	 * @since 1.0.0
	 * @access public
	*/
	public function register_data() {}

	/**
	 * @since 1.0.0
	 * @access public
	*/
	public function get_items( $args = [] ) {
		$templates_data = Template_Api::get_templates_data();

		$templates = [];

		if ( ! empty( $templates_data ) ) {
			foreach ( $templates_data as $template_data ) {
				$templates[] = $this->get_item( $template_data );
			}
		}

		if ( ! empty( $args ) ) {
			$templates = $this->filter_supported_templates( $templates, $args );
		}

		return $templates;
	}

	/**
	 * @since 1.0.0
	 * @access public
	 * @param array $template_data
	 *
	 * @return array
	 */
	public function get_item( $template_data ) {

        $timestamp = '';

		return [
			'template_id' => $template_data['id'],
			'source' => $this->get_id(),
			'title' => $template_data['title'],
			'thumbnail' => $template_data['thumbnail'],
			'date' => $timestamp,
			'author' => $template_data['author'],
			'categories' => [],
			'keywords' => [],
			'url' => $template_data['url'],
			'supports' => $template_data['supports'],
		];
	}

	/**
	 * @since 1.0.0
	 * @access public
	*/
	public function save_item( $template_data ) {
		return false;
	}

	/**
	 * @since 1.0.0
	 * @access public
	*/
	public function update_item( $new_data ) {
		return false;
	}

	/**
	 * @since 1.0.0
	 * @access public
	*/
	public function delete_template( $template_id ) {
		return false;
	}

	/**
	 * @since 1.0.0
	 * @access public
	*/
	public function export_template( $template_id ) {
		return false;
	}

	/**
	 * @since 1.0.0
	 * @access public
	*/
	public function get_data( array $args, $context = 'display' ) {
		$data = Template_Api::get_template_content( $args['template_id'] );

		if ( is_wp_error( $data ) ) {
			return $data;
		}

		$data['data'] = $this->replace_elements_ids( $data['data'] );
		$data['data'] = $this->process_export_import_content( $data['data'], 'on_import' );

		if ( ! empty( $args['page_settings'] ) && ! empty( $data['page_settings'] ) ) {
			$page = new Page( [
				'settings' => $data['page_settings'],
			] );

			$page_settings_data = $this->process_element_export_import_content( $page, 'on_import' );
			$data['page_settings'] = $page_settings_data['settings'];
		}

		return $data;
	}
}
