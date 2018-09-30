<?php
namespace Qazana\Extensions\Tags;

use Qazana\Core\DynamicTags\Data_Tag;
use Qazana\Extensions\DynamicTags_Site;

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
		return DynamicTags_Site::AUTHOR_GROUP;
	}

	public function get_categories() {
		return [ DynamicTags_Site::IMAGE_CATEGORY ];
	}

	public function get_value( array $options = [] ) {
		return [
			'id' => '',
			'url' => get_avatar_url( (int) get_the_author_meta( 'ID' ) ),
		];
	}
}
