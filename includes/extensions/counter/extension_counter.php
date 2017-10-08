<?php
namespace Qazana\Extensions;

use Qazana\Utils;

class Counter extends Base {

	public function get_config() {

        return [
        	'title' => __( 'Counter', 'qazana' ),
            'name' => 'counter',
        	'required' => true,
        	'default_activation' => true,
			'widgets' => [
				'Counter'
			]
        ];

	}

	public function __construct() {
		add_action( 'qazana/frontend/after_enqueue_styles', [ $this, 'enqueue_styles' ] );
		add_action( 'qazana/frontend/after_register_scripts', [ $this, 'enqueue_scripts' ] );
	}

	public function enqueue_styles() {

		$suffix = Utils::is_script_debug() ? '' : '.min';

        wp_register_style(
            'odometer-theme-default',
            qazana()->core_assets_url . 'lib/odometer/themes/odometer-theme-default' . $suffix . '.css',
            [],
            qazana_get_version()
        );

		if ( qazana()->preview->is_preview_mode() ) {
			wp_enqueue_style( 'odometer-theme-default' );
		}
	}

   	public function enqueue_scripts() {

		$suffix = Utils::is_script_debug() ? '' : '.min';

        wp_register_script(
            'odometer',
            qazana()->core_assets_url . 'lib/odometer/odometer' . $suffix . '.js',
            [],
            '0.4.8',
            true
        );

		if ( qazana()->preview->is_preview_mode() ) {
			wp_enqueue_script( 'odometer' );
	   }
   }

}
