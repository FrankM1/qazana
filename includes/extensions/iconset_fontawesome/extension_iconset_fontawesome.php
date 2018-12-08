<?php
namespace Qazana\Extensions;

use Qazana\Utils;

class Iconset_FontAwesome extends Base {

	public function register() {
        return [
        	'title' => __( 'Fontawesome iconset', 'qazana' ),
            'name' => 'iconset_fontawesome',
        	'required' => true,
        	'default_activation' => true,
        ];
	}

    public function __construct() {
        $this->_register_icons();
        $this->_add_actions();
    }

    public function _add_actions() {
        add_action( 'qazana/frontend/before_enqueue_scripts', [ $this, 'enqueue_styles' ] );
        add_action( 'qazana/editor/before_enqueue_scripts', [ $this, 'enqueue_styles' ] );
	}

    private function _register_icons() {

        $file = $this->extension_dir( 'icons/font-awesome.json');

        $iconset = qazana()->icons_manager->get_icons_for_controls( $file, 'font-awesome', 'fa fa-' );

        qazana()->icons_manager->add_iconset( 'font-awesome', $iconset  );
    }

	public function enqueue_styles() {

        $suffix = Utils::is_script_debug() ? '' : '.min';

		wp_register_style(
			'font-awesome', $this->extension_url( 'assets/font-awesome/css/font-awesome'. $suffix .'.css'),
			[],
			'4.7.0'
		);

        wp_enqueue_style( 'font-awesome' );
	}
}
