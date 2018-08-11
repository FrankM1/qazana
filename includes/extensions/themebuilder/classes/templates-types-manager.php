<?php
namespace Qazana\Extensions\ThemeBuilder\Classes;

use Qazana\Template_Library\Source_Local;
use Qazana\Extensions\ThemeBuilder\Documents;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Templates_Types_Manager {
	private $docs_types = [];

	public function __construct() {
		add_action( 'qazana/documents/register', [ $this, 'register_documents' ] );
	}

	public function get_types_config() {
		$config = [];

		foreach ( $this->docs_types as $type => $class_name ) {
			$config[ $type ] = call_user_func( [ $class_name, 'get_properties' ] );
		}

		return $config;
	}

	public function register_documents() {
		$this->docs_types = [
			'section' => Documents\Section::get_class_full_name(),
            'header' => Documents\Header::get_class_full_name(),
            'site-hero' => Documents\Site_Hero::get_class_full_name(),
			'footer' => Documents\Footer::get_class_full_name(),
			'single' => Documents\Single::get_class_full_name(),
            'archive' => Documents\Archive::get_class_full_name(),
		];

		foreach ( $this->docs_types as $type => $class_name ) {
			qazana()->documents->register_document_type( $type, $class_name );
		}
	}
}
