<?php
namespace Qazana\Extensions\ThemeBuilder\Conditions;

use Qazana\Extensions\Queries_Group_Controls as QueryModule;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Author extends Condition_Base {

	public static function get_type() {
		return 'archive';
	}

	public function get_name() {
		return 'author';
	}

	public function get_label() {
		return __( 'Author Archive', 'qazana' );
	}

	public function check( $author = null ) {
		return is_author( $author );
	}

	protected function _register_controls() {
		$this->add_control(
			'author_id',
			[
				'section' => 'settings',
				'type' => QueryModule::QUERY_CONTROL_ID,
				'select2options' => [
					'dropdownCssClass' => 'qazana-conditions-select2-dropdown',
				],
				'filter_type' => 'author',
				'object_type' => $this->get_name(),
			]
		);
	}
}
