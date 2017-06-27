<?php
namespace Qazana\Extensions;

class Autoptimize extends Base {

	public function get_config() {

        return [
        	'title' => __( 'Autoptimize Compatibility', 'qazana' ),
            'name' => 'ninja_forms',
        	'required' => true,
        	'default_activation' => true,
        ];

	}

    public function __construct() {
        add_action( 'init', [ __CLASS__, 'init' ] );
    }

    public static function init() {

        // Disable optimize files in Editor from Autoptimize plugin
        add_filter( 'autoptimize_filter_noptimize', function( $retval ) {
            if ( qazana()->editor->is_edit_mode() ) {
                $retval = true;
            }

            return $retval;
        } );

    }

}
