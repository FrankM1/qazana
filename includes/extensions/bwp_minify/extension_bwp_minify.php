<?php
namespace Qazana\Extensions;

class Bwp_Minify extends Base {

	public function get_config() {

        $bwp_minify_exist = function_exists( '\bwp_minify_is_loadable' );

        return [
        	'title' => __( 'Better Wordpress Minify Compatibility', 'qazana' ),
            'name' => 'bwp_minify',
        	'required' => true,
        	'default_activation' => $bwp_minify_exist,
        ];

	}

    public function __construct() {
        add_action( 'init', [ $this, 'init' ] );
    }

    public function init() {

		// Disable minifier files in Editor from Better Wordpress Minifier plugin
        add_filter( 'bwp_minify_is_loadable', function( $retval ) {
            if ( qazana()->editor->is_edit_mode() ) {
                return false;
            }
            return $retval;
        } );

    }

}
