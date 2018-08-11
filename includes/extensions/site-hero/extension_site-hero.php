<?php
namespace Qazana\Extensions;

if ( ! defined('ABSPATH') ) exit; // Exit if accessed directly

use Qazana\Extensions\Site_Hero\Document;

class Site_Hero extends Base {

    /**
     * Unique extension name
     *
     * @return string
     */
    public function get_name()
    {
        return 'site-hero';
    }

    /**
     * Extension title
     *
     * @return string
     */
    public function get_title() {
        return 'Site hero';
    }

    /**
     * Extension dependencies
     *
     * Reliably have an extension as child of another.
     *
     * @since 1.3.0
     *
     * @return array of names of parent extensions
     */
    public function get_dependencies() {
        return [ 'library' ];
    }

    public function __construct() {
        add_action('qazana/extensions/registered/themebuilder', [ $this, 'add_actions' ], 10, 2 );
    }
  
    public function add_actions( $extension, $instance ) {
        require __DIR__ . '/documents/site-hero.php';
        add_action( 'qazana/documents/register', [$this, 'register_documents']);
	}

	public function register_documents() {
		qazana()->documents->register_document_type( 'site_hero', Document::get_class_full_name() );
    }
    
}