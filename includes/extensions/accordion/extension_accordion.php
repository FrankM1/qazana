<?php
namespace Qazana\Extensions;

use Qazana\Utils;

class Accordion extends Base {

    /**
	 * Unique extension name
	 *
	 * @return string
	 */
    public function get_name() {
        return 'accordion';
    }
        
    /**
     * Extension title
     *
     * @return string
     */
    public function get_title() {
        return __( 'Accordion', 'qazana' );
    }

    /**
     * Extension widgets
     *
     * @return array
     */
    public function get_widgets() {
        return [
            'accordion'
        ];
    }

	public function __construct() {
		add_action( 'qazana/frontend/after_register_styles', [ $this, 'register_styles' ] );
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
