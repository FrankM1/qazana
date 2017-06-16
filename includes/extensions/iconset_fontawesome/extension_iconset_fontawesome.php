<?php
namespace Builder\Extensions;

use Builder\Utils;

class Iconset_FontAwesome extends Base {

	public function get_config() {

        return [
        	'title' => __( 'Fontawesome iconset', 'builder' ),
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
        add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_styles' ] );
        add_action( 'builder/editor/before_enqueue_scripts', [ $this, 'enqueue_styles' ] );
	}

    private function _register_icons() {

        $config = $this->get_config();

        $file = builder()->extensions_loader->locate_widget( $config['name'] . '/icons/font-awesome.json');

        $iconset = builder()->icons_manager->get_icons_for_controls( $file, 'font-awesome', 'fa fa-' );

        builder()->icons_manager->add_iconset( 'font-awesome', $iconset  );

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
