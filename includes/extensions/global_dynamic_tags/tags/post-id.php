<?php
namespace Qazana\Extensions\Tags;

use Qazana\Core\DynamicTags\Tag;
use Qazana\Extensions\Global_Dynamic_Tags;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Post_ID extends Tag {
	public function get_name() {
		return 'post-id';
	}

	public function get_title() {
		return __( 'Post ID', 'qazana' );
	}

	public function get_group() {
		return Global_Dynamic_Tags::POST_GROUP;
	}

	public function get_categories() {
		return [ Global_Dynamic_Tags::TEXT_CATEGORY ];
	}

	public function render() {
		echo get_the_ID();
	}
}
