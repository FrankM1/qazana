<?php
namespace Qazana\Template_Library;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Source_Theme extends Source_Base {

    public function get_id() {
        return 'theme';
    }

    public function get_title() {
        return __( 'Theme', 'qazana' );
    }

    public function register_data() {}

    public function get_items( $args = [] ) {

        $templates = array();

        $templates_data = apply_filters( 'qazana_theme_template_presets', array() );

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

    public function get_data( array $args, $context = 'display' ) {

        $data = apply_filters( 'qazana_theme_template_content', array(), $item_id );

        if ( empty( $data ) || ! is_array( $data ) ) {
            return false;
        }

        if ( empty( $data['data'] ) ) {
            return false;
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
