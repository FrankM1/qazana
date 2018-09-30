<?php
namespace Qazana\Extensions\Tags;

use Qazana\Core\DynamicTags\Data_Tag;
use Qazana\Utils;
use Qazana\Extensions\DynamicTags_Site;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Archive_URL extends Data_Tag {

	public function get_name() {
		return 'archive-url';
	}

	public function get_group() {
		return DynamicTags_Site::ARCHIVE_GROUP;
	}

	public function get_categories() {
		return [ DynamicTags_Site::URL_CATEGORY ];
	}

	public function get_title() {
		return __( 'Archive URL', 'qazana' );
	}

	public function get_panel_template() {
		return ' ({{ url }})';
	}

	public function get_value( array $options = [] ) {
		return Utils::get_the_archive_url();
	}
}

