<?php

namespace Qazana\Extensions\Tags;

use Qazana\Core\DynamicTags\Data_Tag;
use Qazana\Extensions\DynamicTags_Site;

if ( ! defined( 'ABSPATH' ) )
	exit; // Exit if accessed directly

class Post_Gallery extends Data_Tag {

	public function get_name() {
		return 'post-gallery';
	}

	public function get_title() {
		return __( 'Post Gallery', 'qazana' );
	}

	public function get_categories() {
		return [ DynamicTags_Site::GALLERY_CATEGORY ];
	}

	public function get_group() {
		return DynamicTags_Site::POST_GROUP;
	}

	public function get_value( array $options = [] ) {
		$images = get_attached_media( 'image' );

		$value = [];

		foreach ( $images as $image ) {
			$value[] = [
				'id' => $image->ID,
			];
		}

		return $value;
	}
}
