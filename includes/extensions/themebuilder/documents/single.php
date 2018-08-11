<?php
namespace Qazana\Extensions\ThemeBuilder\Documents;

use Qazana\DB;
use Qazana\Extensions\ThemeBuilder\Classes\Utils;
use Qazana\Extensions\ThemeBuilder as Module;
use Qazana\Extensions\ThemeBuilder\Widgets\Post_Content;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Single extends Theme_Page_Document {

	/**
	 * Document sub type meta key.
	 */
	const SUB_TYPE_META_KEY = '_qazana_template_sub_type';

	public static function get_properties() {
		$properties = parent::get_properties();

		$properties['location'] = 'single';
		$properties['condition_type'] = 'singular';

		return $properties;
	}

	public function get_name() {
		return 'single';
	}

	public static function get_title() {
		return __( 'Single', 'qazana' );
	}

	public function get_remote_library_type() {
		$sub_type = $this->get_meta( self::SUB_TYPE_META_KEY );

		if ( $sub_type ) {
			if ( 'not_found404' === $sub_type ) {
				$sub_type = '404 page';
			} else {
				$sub_type = 'single ' . $sub_type;
			}

			return $sub_type;
		}

		return parent::get_remote_library_type();
	}

	public function print_content() {
		$requested_post_id = get_the_ID();
		if ( $requested_post_id !== $this->post->ID ) {
			$requested_document = Module::instance()->get_document( $requested_post_id );

			/**
			 * if current requested document is theme-document & it's not a content type ( like header/footer/sidebar )
			 * show a placeholder instead of content.
			 */
			if ( $requested_document && ! $requested_document instanceof Section && $requested_document->get_location() !== $this->get_location() ) {
				echo '<div class="qazana-theme-builder-content-area">' . __( 'Content Area', 'qazana' ) . '</div>';
				return;
			}
		}

		parent::print_content();
	}

	protected function _register_controls() {
		parent::_register_controls();

		$post_type = $this->get_main_meta( self::SUB_TYPE_META_KEY );

		$latest_posts = get_posts( [
			'posts_per_page' => 1,
			'post_type' => $post_type,
		] );

		if ( ! empty( $latest_posts ) ) {
			$this->update_control(
				'preview_type',
				[
					'default' => 'single/' . $post_type,
				]
			);

			$this->update_control(
				'preview_id',
				[
					'default' => $latest_posts[0]->ID,
				]
			);
		}
	}

	public static function get_preview_as_options() {
		$post_types = Utils::get_post_types();
		$post_types['attachment'] = get_post_type_object( 'attachment' )->label;
		unset( $post_types['product'] );

		$post_types_options = [];

		foreach ( $post_types as $post_type => $label ) {
			$post_types_options[ 'single/' . $post_type ] = get_post_type_object( $post_type )->labels->singular_name;
		}

		return [
			'single' => [
				'label' => __( 'Single', 'qazana' ),
				'options' => $post_types_options,
			],
			'page/404' => __( '404', 'qazana' ),
		];
	}

	public function get_elements_data( $status = DB::STATUS_PUBLISH ) {
		$data = parent::get_elements_data();

		if ( qazana()->preview->is_preview_mode() && self::get_property( 'location' ) === Module::instance()->get_locations_manager()->get_current_location() ) {
			$has_the_content = false;

			qazana()->db->iterate_data( $data, function ( $element ) use ( &$has_the_content ) {
				if ( isset( $element['widgetType'] ) && 'theme-post-content' === $element['widgetType'] ) {
					$has_the_content = true;
				}
			} );

			if ( ! $has_the_content ) {
				add_action( 'wp_footer', [ $this, 'preview_error_handler' ] );
			}
		}

		return $data;
	}

	public function preview_error_handler() {
		wp_localize_script( 'qazana-frontend', 'qazanaPreviewErrorArgs', [
			'headerMessage' => __( 'The Post Content Widget was not found in your template.', 'qazana' ),
			'message' => sprintf(
				/* translators: %s: Template name. */
				__( 'You must include the Post Content Widget in your template (%s), in order for Elementor to work on this page.', 'qazana' ),
				'<strong>' . self::get_title() . '</strong>'
			),
			'strings' => [
				'confirm' => __( 'Edit Template', 'qazana' ),
			],
			'confirmURL' => $this->get_edit_url(),
		] );
	}

	/**
	 * @since 2.0.6
	 * @access public
	 */
	public function save_type() {
		parent::save_type();

		$conditions_manager = Module::instance()->get_conditions_manager();

		if ( ! empty( $_REQUEST[ self::SUB_TYPE_META_KEY ] ) ) {
			$sub_type = $_REQUEST[ self::SUB_TYPE_META_KEY ];

			if ( $conditions_manager->get_condition( $sub_type ) ) {
				$this->update_meta( self::SUB_TYPE_META_KEY, $sub_type );

				$conditions_manager->save_conditions( $this->post->ID, [
					[
						'include',
						'singular',
						$sub_type,
					],
				] );
			}
		}
	}
}
