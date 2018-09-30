<?php
namespace Qazana\Extensions\Tags;

use Qazana\Core\DynamicTags\Tag;
use Qazana\Extensions\DynamicTags_Site;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Archive_Description extends Tag {

	public function get_name() {
		return 'archive-description';
	}

	public function get_title() {
		return __( 'Archive Description', 'qazana' );
	}

	public function get_group() {
		return DynamicTags_Site::ARCHIVE_GROUP;
	}

	public function get_categories() {
		return [ DynamicTags_Site::TEXT_CATEGORY ];
	}

	public function render() {
		echo wp_kses_post( get_the_archive_description() );
	}
}
