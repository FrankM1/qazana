<?php
namespace Qazana\Extensions\ThemeBuilder\Documents;

use Qazana\Controls_Manager;
use Qazana\Core\DocumentTypes\Post;
use Qazana\Extensions\Page_Templates;
use Qazana\Template_Library\Source_Local;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

abstract class Theme_Page_Document extends Theme_Document {

	protected function _register_controls() {
		parent::_register_controls();

		$this->start_injection( [
			'of' => 'post_status',
			'fallback' => [
				'of' => 'post_title',
			],
		] );

		$this->add_control(
			'page_template',
			[
				'label' => __( 'Page Layout', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'' => __( 'Default', 'qazana' ),
					Page_Templates::TEMPLATE_CANVAS => __( 'Qazana Canvas', 'qazana' ),
					Page_Templates::TEMPLATE_HEADER_FOOTER => __( 'Qazana Full Width', 'qazana' ),
				],
			]
		);

		$this->add_control(
			'page_template_default_description',
			[
				'type' => Controls_Manager::RAW_HTML,
				'raw' => __( 'Default Page Template from your theme', 'qazana' ),
				'separator' => 'none',
				'content_classes' => 'qazana-descriptor',
				'condition' => [
					'page_template' => 'default',
				],
			]
		);

		$this->add_control(
			'page_template_canvas_description',
			[
				'type' => Controls_Manager::RAW_HTML,
				'raw' => __( 'No header, no footer, just Qazana', 'qazana' ),
				'separator' => 'none',
				'content_classes' => 'qazana-descriptor',
				'condition' => [
					'page_template' => Page_Templates::TEMPLATE_CANVAS,
				],
			]
		);

		$this->add_control(
			'page_template_header_footer_description',
			[
				'type' => Controls_Manager::RAW_HTML,
				'raw' => __( 'This template includes the header, full-width content and footer', 'qazana' ),
				'separator' => 'none',
				'content_classes' => 'qazana-descriptor',
				'condition' => [
					'page_template' => Page_Templates::TEMPLATE_HEADER_FOOTER,
				],
			]
		);

		$this->end_injection();

		Post::register_style_controls( $this );
	}

	/**
	 * Add body classes.
	 *
	 * Add the body classes for the `style` controls selector.
	 *
	 * @param $body_classes
	 *
	 * @return array
	 */
	public function filter_body_classes( $body_classes ) {
		// Indicator for edit/preview an `archive` document, so it's a `single` qazana_library post - but need a behavior like an archive.
		$is_archive_template = 'archive' === Source_Local::get_template_type( get_the_ID() );

		$add_body_class = false;

		if ( $this instanceof Archive && ( is_archive() || is_search() || is_home() || $is_archive_template ) ) {
			$add_body_class = true;
		} elseif ( $this instanceof Single && ( is_singular() || is_404() ) && ! $is_archive_template ) {
			$add_body_class = true;
		}

		if ( $add_body_class ) {
			$body_classes[] = 'qazana-page-' . $this->get_main_id();
		}

		return $body_classes;
	}

	public function __construct( array $data = [] ) {
		if ( $data ) {
			add_filter( 'body_class', [ $this, 'filter_body_classes' ] );
		}

		parent::__construct( $data );
	}
}
