<?php
namespace Qazana\Extensions\Tags;

use Qazana\Core\DynamicTags\Data_Tag;
use Qazana\Extensions\DynamicTags_Site;
use Qazana\Controls_Manager;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Internal_URL extends Data_Tag {

	public function get_name() {
		return 'internal-url';
	}

	public function get_group() {
		return DynamicTags_Site::SITE_GROUP;
	}

	public function get_categories() {
		return [ DynamicTags_Site::URL_CATEGORY ];
	}

	public function get_title() {
		return __( 'Internal URL', 'qazana' );
	}

	public function get_panel_template() {
		return ' ({{ url }})';
	}

	public function get_value( array $options = [] ) {
		$settings = $this->get_settings();

		$type = $settings['type'];
		$url = '';

		if ( 'post' === $type && ! empty( $settings['post_id'] ) ) {
			$url = get_permalink( (int) $settings['post_id'] );
		} elseif ( 'taxonomy' === $type && ! empty( $settings['taxonomy_id'] ) ) {
			$url = get_term_link( (int) $settings['taxonomy_id'] );
		} elseif ( 'attachment' === $type && ! empty( $settings['attachment_id'] ) ) {
			$url = get_attachment_link( (int) $settings['attachment_id'] );
		} elseif ( 'author' === $type && ! empty( $settings['author_id'] ) ) {
			$url = get_author_posts_url( (int) $settings['author_id'] );
		}

		return $url;
	}

	protected function _register_controls() {
		$this->add_control( 'type', [
			'label' => __( 'Type', 'qazana' ),
			'type' => Controls_Manager::SELECT,
			'options' => [
				'post' => __( 'Content', 'qazana' ),
				'taxonomy' => __( 'Taxonomy', 'qazana' ),
				'attachment' => __( 'Media', 'qazana' ),
				'author' => __( 'Author', 'qazana' ),
			],
		] );

		$this->add_control( 'post_id', [
			'label' => __( 'Search & Select', 'qazana' ),
			'type' => 'query',
			'post_type' => '',
			'options' => [],
			'label_block' => true,
			'filter_type' => 'post',
			'object_type' => 'any',
			'include_type' => true,
			'condition' => [
				'type' => 'post',
			],
		] );

		$this->add_control( 'taxonomy_id', [
			'label' => __( 'Search & Select', 'qazana' ),
			'type' => 'query',
			'post_type' => '',
			'options' => [],
			'label_block' => true,
			'filter_type' => 'taxonomy',
			'include_type' => true,
			'condition' => [
				'type' => 'taxonomy',
			],
		] );

		$this->add_control( 'attachment_id', [
			'label' => __( 'Search & Select', 'qazana' ),
			'type' => 'query',
			'post_type' => '',
			'options' => [],
			'label_block' => true,
			'filter_type' => 'post',
			'object_type' => 'attachment',
			'condition' => [
				'type' => 'attachment',
			],
		] );

		$this->add_control( 'author_id', [
			'label' => __( 'Search & Select', 'qazana' ),
			'type' => 'query',
			'post_type' => '',
			'options' => [],
			'label_block' => true,
			'filter_type' => 'author',
			'include_type' => true,
			'condition' => [
				'type' => 'author',
			],
		] );
	}
}
