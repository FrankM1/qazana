<?php
namespace Qazana\Extensions;

class Autoptimize extends Base {

	public function register() {

        $autoptimize_minify_exist = function_exists( '\autoptimize_filter_noptimize' );

        return [
        	'title' => __( 'Autoptimize Compatibility', 'qazana' ),
            'name' => 'autoptimize',
        	'required' => false,
            'default_activation' => $autoptimize_minify_exist,
        ];

	}

    public function __construct() {
        add_action( 'init', [ __CLASS__, 'init' ] );
    }

    public static function init() {

        // Disable optimize files in Editor from Autoptimize plugin
        add_filter( 'autoptimize_filter_noptimize', function( $retval ) {
            if ( qazana()->get_editor()->is_edit_mode() ) {
                $retval = true;
            }

            return $retval;
        } );

    }

}
