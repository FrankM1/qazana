<?php
namespace Qazana\Extensions;

class Hueman_Theme extends Base {

	public function get_config() {

        $active_theme = wp_get_theme();

        return [
        	'title'              => __( 'Hueman Theme Compatibility', 'qazana' ),
        	'name'               => 'hueman_theme',
        	'required'           => false,
        	'default_activation' => ( $active_theme->get( 'Name' ) === 'hueman' ),
        ];

	}

    public function __construct() {
        add_action( 'qazana/frontend/after_enqueue_styles', [ $this, 'enqueue_styles' ] );
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
