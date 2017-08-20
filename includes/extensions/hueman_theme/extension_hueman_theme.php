<?php
namespace Qazana\Extensions;

class Hueman_Theme extends Base {

	public function get_config() {

        return [
        	'title' => __( 'Hueman Theme Compatibility', 'qazana' ),
            'name' => 'hueman_theme',
        	'required' => true,
        	'default_activation' => true,
        ];

	}

    public function __construct() {
        add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_styles' ] );
    }

    function enqueue_styles() {

    	$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

        wp_enqueue_style(
            'qazana-theme-compat-hueman',
            qazana()->core_assets_url . 'css/hueman' . $suffix . '.css',
            [],
            qazana_get_version()
        );

    }

}
