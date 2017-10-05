<?php
namespace Qazana\Extensions;

use Qazana\Extensions\History\Revisions_Manager as Revisions_Manager;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class History extends Base {

	public function get_name() {
		return 'history';
	}

	public function get_title() {
		return __( 'History', 'qazana' );
	}

	public function add_actions() {
		add_filter( 'qazana/editor/localize_settings', [ $this, 'localize_settings' ] );
		qazana()->editor->add_editor_template( __DIR__ . '/views/history-panel-template.php' );
		qazana()->editor->add_editor_template( __DIR__ . '/views/revisions-panel-template.php' );
	}	

	public function include_files() {
        require('classes/revisions-manager.php');
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

		add_filter( 'qazana/after/init_classes', [ $this, 'add_actions' ] );

		if ( is_admin() ) {
			$this->include_files();
			qazana()->revisions_manager = new Revisions_Manager();
		}		
	}
}
