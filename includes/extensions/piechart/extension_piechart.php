<?php
namespace Qazana\Extensions;

use Qazana\Utils;

class PieChart extends Base {

	public function get_config() {

        return [
        	'title' => __( 'PieChart', 'qazana' ),
            'name' => 'piechart',
        	'required' => true,
        	'default_activation' => true,
			'widgets' => [
				'Piechart'
			]
        ];

	}

	public function __construct() {
		add_action( 'qazana/frontend/after_register_scripts', [ $this, 'enqueue_scripts' ] );
	}

   	public function enqueue_scripts() {

		$suffix = Utils::is_script_debug() ? '' : '.min';

		wp_register_script(
            'jquery-circle-progress',
            qazana()->core_assets_url . 'lib/jquery-circle-progress/circle-progress' . $suffix . '.js',
            [],
            '1.2.2',
            true
        );

		if ( qazana()->preview->is_preview_mode() ) {
			wp_enqueue_script( 'jquery-circle-progress' );
	   }
   }

}
