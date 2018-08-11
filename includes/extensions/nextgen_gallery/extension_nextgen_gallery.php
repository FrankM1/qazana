<?php
namespace Qazana\Extensions;

class NextGen_Gallery extends Base {

	public function get_config() {
        
        $NextGen_exist = defined( 'NGG_PLUGIN_VERSION' );

        return [
        	'title' => __( 'Ninja_Forms Compatibility', 'qazana' ),
            'name' => 'ninja_forms',
        	'required' => false,
        	'default_activation' => $NextGen_exist,
        ];

	}

    public function __construct() {
        add_action( 'init', [ __CLASS__, 'init' ] );
    }

    public static function init() {

        // Hotfix for NextGEN Gallery plugin
        add_filter( 'qazana/utils/get_edit_link', function( $edit_link ) {
            return add_query_arg( 'display_gallery_iframe', '', $edit_link );
        } );
    }

}
