<?php
namespace Qazana\Extensions;

class Ninja_Forms extends Base {

	public function get_config() {

        $ninja_exists = class_exists( '\Ninja_Forms' );

        return [
        	'title' => __( 'Ninja Forms Compatibility', 'qazana' ),
            'name' => 'ninja_forms',
        	'required' => false,
        	'default_activation' => $ninja_exists,
        ];

	}

    public function __construct() {
        add_action( 'init', [ __CLASS__, 'init' ] );
    }

    public static function init() {

        // Hack for Ninja Forms
        if ( class_exists( '\Ninja_Forms' ) ) {
            add_action( 'qazana/preview/enqueue_styles', function() {
                ob_start();

                \NF_Display_Render::localize( 0 );

                ob_clean();

                wp_add_inline_script( 'nf-front-end', 'var nfForms = nfForms || [];' );
            } );
        }

    }

}
