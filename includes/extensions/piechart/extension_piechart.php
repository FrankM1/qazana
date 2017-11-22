<?php
namespace Qazana\Extensions;

use Qazana\Utils;

class PieChart extends Base {

    /**
	 * Unique extension name
	 *
	 * @return string
	 */
    public function get_name() {
        return 'piechart';
    }
        
    /**
     * Extension title
     *
     * @return string
     */
    public function get_title() {
        return __( 'PieChart', 'qazana' );
    }

    /**
     * Extension widgets
     *
     * @return array
     */
    public function get_widgets() {
        return [
            'Piechart'
        ];
    }

	public function __construct() {
        add_action( 'qazana/frontend/after_register_scripts', [ $this, 'enqueue_scripts' ] );
        add_action( 'qazana/frontend/after_register_styles', [ $this, 'register_styles' ] );
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

   public function register_styles() {
     
        $suffix = Utils::is_script_debug() ? '' : '.min';
        
        $direction_suffix = is_rtl() ? '-rtl' : '';

        wp_register_style(
            'qazana-extension-' . $this->get_name(),
            $this->extension_url( 'assets/css/direction/style' . $direction_suffix . $suffix . '.css' ),
            [
                'qazana-frontend',
            ],
            qazana_get_version()
        );

        if ( qazana()->preview->is_preview_mode() ) {
            wp_enqueue_style( 'qazana-extension-' . $this->get_name() );
        }
        
    }

}
