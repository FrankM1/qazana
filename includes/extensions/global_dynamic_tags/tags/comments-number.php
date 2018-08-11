<?php
namespace Qazana\Extensions\Tags;

use Qazana\Controls_Manager;
use Qazana\Core\DynamicTags\Tag;
use Qazana\Extensions\Global_Dynamic_Tags;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Comments_Number extends Tag {

	public function get_name() {
		return 'comments-number';
	}

	public function get_title() {
		return __( 'Comments Number', 'qazana' );
	}

	public function get_group() {
		return Global_Dynamic_Tags::COMMENTS_GROUP;
	}

	public function get_categories() {
		return [ Global_Dynamic_Tags::TEXT_CATEGORY ];
	}

	protected function _register_controls() {
		$this->add_control(
			'format_no_comments',
			[
				'label'   => __( 'No Comments Format', 'qazana' ),
				'default' => __( 'No Responses', 'qazana' ),
			]
		);

		$this->add_control(
			'format_one_comments',
			[
				'label'   => __( 'One Comment Format', 'qazana' ),
				'default' => __( 'One Response', 'qazana' ),
			]
		);

		$this->add_control(
			'format_many_comments',
			[
				'label'   => __( 'Many Comment Format', 'qazana' ),
				'default' => __( '{number} Responses', 'qazana' ),
			]
		);

		$this->add_control(
			'link_to',
			[
				'label'   => __( 'Link To', 'qazana' ),
				'type'    => Controls_Manager::SELECT,
				'default' => '',
				'options' => [
					'' => __( 'None', 'qazana' ),
					'comments_link' => __( 'Comments Link', 'qazana' ),
				],
			]
		);
	}

	public function render() {
		$settings = $this->get_settings();

		$comments_number = get_comments_number();

		if ( ! $comments_number ) {
			$count = $settings['format_no_comments'];
		} elseif ( 1 === $comments_number ) {
			$count = $settings['format_one_comments'];
		} else {
			$count = strtr( $settings['format_many_comments'], [
				'{number}' => number_format_i18n( $comments_number ),
			] );
		}

		if ( 'comments_link' === $this->get_settings( 'link_to' ) ) {
			$count = sprintf( '<a href="%s">%s</a>', get_comments_link(), $count );
		}

		echo wp_kses_post( $count );
	}
}
