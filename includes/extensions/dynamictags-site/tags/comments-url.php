<?php
namespace Qazana\Extensions\Tags;

use Qazana\Core\DynamicTags\Data_Tag;
use Qazana\Extensions\DynamicTags_Site;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Comments_URL extends Data_Tag {

	public function get_name() {
		return 'comments-url';
	}

	public function get_title() {
		return __( 'Comments URL', 'qazana' );
	}

	public function get_group() {
		return DynamicTags_Site::COMMENTS_GROUP;
	}

	public function get_categories() {
		return [ DynamicTags_Site::URL_CATEGORY ];
	}

	public function get_value( array $options = [] ) {
		return get_comments_link();
	}
}
