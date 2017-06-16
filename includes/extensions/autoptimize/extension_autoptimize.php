<?php
namespace Builder\Extensions;

class Autoptimize extends Base {

	public function get_config() {

        return [
        	'title' => __( 'Autoptimize Compatibility', 'builder' ),
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
            if ( builder()->editor->is_edit_mode() ) {
                $retval = true;
            }

            return $retval;
        } );

    }

}
