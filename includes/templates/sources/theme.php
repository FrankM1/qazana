<?php
namespace Qazana\Template_Library;

use Qazana\PageSettings\Page;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Source_Theme extends Source_Base {

	/**
	 * @since 1.0.0
	 * @access public
	*/
    public function get_id() {
        return 'theme';
    }

	/**
	 * @since 1.0.0
	 * @access public
	*/
    public function get_title() {
        return __( 'Theme', 'qazana' );
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

        $templates = [];

        $templates_data = apply_filters( 'qazana_theme_template_presets', array() );

        if ( ! empty( $templates_data ) ) {
            foreach ( $templates_data as $template_data ) {
                $templates[] = $this->get_item( $template_data );
            }
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
		return [
			'template_id' => $template_data['id'],
			'source' => $this->get_id(),
			'title' => $template_data['title'],
			'thumbnail' => $template_data['thumbnail'],
			'date' => date( get_option( 'date_format' ), $template_data['tmpl_created'] ),
			'author' => $template_data['author'],
			'categories' => [],
			'keywords' => [],
			'hasPageSettings' => ( ! empty( $template_data['has_page_settings'] ) && '1' === $template_data['has_page_settings'] ),
			'url' => $template_data['url'],
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
        $data = apply_filters( 'qazana_theme_template_content', array(), $args['template_id'] );

        if ( empty( $data ) || ! is_array( $data ) ) {
            return false;
        }

        if ( empty( $data['content'] ) ) {
            return false;
        }

        $data['content'] = $this->replace_elements_ids( $data['content'] );
        $data['content'] = $this->process_export_import_content( $data['content'], 'on_import' );

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
