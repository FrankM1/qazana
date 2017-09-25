<?php
namespace Qazana\Extensions;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class History extends Base {

	public function get_name() {
		return 'history';
	}

	public function get_title() {
		return __( 'History', 'qazana' );
	}

	public function localize_settings( $settings ) {
		$settings = array_replace_recursive( $settings, [
			'i18n' => [
				'history' => __( 'History', 'qazana' ),
				'template' => __( 'Template', 'qazana' ),
				'added' => __( 'Added', 'qazana' ),
				'removed' => __( 'Removed', 'qazana' ),
				'edited' => __( 'Edited', 'qazana' ),
				'moved' => __( 'Moved', 'qazana' ),
				'duplicated' => __( 'Duplicated', 'qazana' ),
				'editing_started' => __( 'Editing Started', 'qazana' ),
			],
		] );

		return $settings;
	}

	public function __construct() {

		add_filter( 'qazana/editor/localize_settings', [ $this, 'localize_settings' ] );

		qazana()->editor->add_editor_template( __DIR__ . '/views/history-panel-template.php' );
		qazana()->editor->add_editor_template( __DIR__ . '/views/revisions-panel-template.php' );
	}
}
