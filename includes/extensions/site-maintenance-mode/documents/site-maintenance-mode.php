<?php
namespace Qazana\Extensions\Documents;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
use Qazana\Core\Base\Document as Base;
use Qazana\Controls_Manager;

class Site_Maintenance_Mode extends Base {

    public function get_name() {
        return 'site-maintenance-mode';
	}

	/**
	 * Get element title.
	 *
	 * Retrieve the element title.
	 *
	 * @since 2.0.0
	 * @access public
	 * @static
	 *
	 * @return string Element title.
	 */
	public static function get_title() {
		return __('Site Maintenance Mode', 'qazana' );
	}

	public static function get_widget_category() {
		return [ 'basic', 'site-maintenance-mode' ];
	}

	public function get_css_wrapper_selector() {
		return '.qazana-'. $this->get_name() . '-' . $this->get_main_id();
	}

	/**
	 * @static
	 * @since 2.0.0
	 * @access public
	 *
	 * @return string
	 */
	public function get_edit_url() {
		$url = parent::get_edit_url();

		if ( isset( $_GET['action'] ) && 'qazana_new_post' === $_GET['action'] ) {
			$url .= '#library';
		}

		return $url;
	}

	/**
	 * Get document properties.
	 *
	 * Retrieve the document properties.
	 *
	 * @since 2.0.0
	 * @access public
	 * @static
	 *
	 * @return array Document properties.
	 */
	public static function get_properties() {
		$properties = parent::get_properties();

		$properties['show_in_library'] = true;
		$properties['register_type'] = true;
		$properties['library_view'] = 'grid';
		$properties['group'] = 'blocks';
		$properties['location'] = 'site-maintenance-mode';
		$properties['widgets'] = self::get_widget_category();

		return $properties;
	}

    public function get_content( $with_css = false ) {
		qazana()->get_preview()->switch_to_preview_query();
		$content = parent::get_content( $with_css );
		qazana()->get_preview()->restore_current_query();
		return $content;
	}

	public function print_content() {
		if ( qazana()->get_preview()->is_preview_mode( $this->get_main_id() ) ) {
			echo qazana()->get_preview()->builder_wrapper( '' );
		} else {
			echo $this->get_content();
		}
	}

	public function get_elements_raw_data( $data = null, $with_html_content = false ) {
		qazana()->get_preview()->switch_to_preview_query();
		$editor_data = parent::get_elements_raw_data( $data, $with_html_content );
		qazana()->get_preview()->restore_current_query();
		return $editor_data;
	}

	public function render_element( $data ) {
		qazana()->get_preview()->switch_to_preview_query();
		$render_html = parent::render_element( $data );
		qazana()->get_preview()->restore_current_query();
		return $render_html;
    }

	/**
	 * Save document type.
	 *
	 * Set new/updated document type.
	 *
	 * @since 2.0.0
	 * @access public
	 */
	public function save_type() {
		parent::save_type();
		wp_set_object_terms( $this->post->ID, $this->get_name(), self::TAXONOMY_TYPE_SLUG );
	}

    public static function get_preview_as_default() {
		return '';
	}

	/**
	 * [_register_controls description]
	 * @return [type] [description]
	 */
	protected function _register_controls() {
		parent::_register_controls();
		parent::_register_preview_controls();
	}
}
