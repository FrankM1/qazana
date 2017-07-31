<?php
namespace Qazana\Extensions;

class Bwp_Minify extends Base {

	public function get_config() {

        return [
        	'title' => __( 'Better Wordpress Minify Compatibility', 'qazana' ),
            'name' => 'bwp_minify',
        	'required' => true,
        	'default_activation' => true,
        ];

	}

    public function __construct() {
        add_action( 'init', [ __CLASS__, 'init' ] );
    }

    public static function init() {

		// Disable minifier files in Editor from Better Wordpress Minifier plugin
        add_filter( 'bwp_minify_is_loadable', function( $retval ) {
            if ( qazana()->editor->is_edit_mode() ) {
                $retval = false;
            }

            return $retval;
        } );

    }

}
