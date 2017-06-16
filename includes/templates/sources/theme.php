<?php
namespace Builder\Template_Library;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Source_Theme extends Source_Base {

    public function get_id() {
        return 'theme';
    }

    public function get_title() {
        return __( 'Theme', 'builder' );
    }

    public function register_data() {}

    public function get_items() {

        $templates = array();

        $templates_data = apply_filters( 'builder_theme_template_presets', array() );

        if ( ! empty( $templates_data ) ) {
            foreach ( $templates_data as $template_data ) {
                $templates[] = $this->get_item( $template_data );
            }
        }

        return $templates;
    }

	/**
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
			'url' => $template_data['url'],
		];
	}

	public function save_item( $template_data ) {
		return false;
	}

	public function update_item( $new_data ) {
		return false;
	}

	public function delete_template( $item_id ) {
		return false;
	}

	public function export_template( $item_id ) {
		return false;
	}

    public function get_content( $item_id, $context = 'display' ) {

        $template_content = apply_filters( 'builder_theme_template_content', array(), $item_id );

        if ( empty( $template_content ) || ! is_array( $template_content ) ) {
            return false;
        }

        if ( empty( $template_content['data'] ) ) {
            return false;
        }

        $data = $template_content['data'];

        if ( ! $data ) {
            return false;
        }

       if ( ! $data ) {
			return false;
		}

		$data = $this->replace_elements_ids( $data );
		$data = $this->process_export_import_data( $data, 'on_import' );

		return $data;
	}
}
