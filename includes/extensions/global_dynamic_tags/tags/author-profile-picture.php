<?php
namespace Qazana\Extensions\Tags;

use Qazana\Core\DynamicTags\Data_Tag;
use Qazana\Extensions\Global_Dynamic_Tags;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Author_Profile_Picture extends Data_Tag {

	public function get_name() {
		return 'author-profile-picture';
	}

	public function get_title() {
		return __( 'Author Profile Picture', 'qazana' );
	}

	public function get_group() {
		return Global_Dynamic_Tags::AUTHOR_GROUP;
	}

	public function get_categories() {
		return [ Global_Dynamic_Tags::IMAGE_CATEGORY ];
	}

	public function get_value( array $options = [] ) {
		return [
			'id' => '',
			'url' => get_avatar_url( (int) get_the_author_meta( 'ID' ) ),
		];
	}
}
