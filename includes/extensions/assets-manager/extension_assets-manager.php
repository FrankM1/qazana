<?php
namespace Qazana\Extensions;

use Qazana\Extensions\Assets_Manager\AssetTypes;
use Qazana\Utils;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Assets_Manager extends Base {

    private $asset_managers = [];
    
    /**
     * Extension title
     *
     * @return string
     */
    public function get_title() {
        return __( 'Assets Manager', 'qazana' );
    }

    /**
	 * Unique extension name
	 *
	 * @return string
	 */
	public function get_name() {
		return 'assets-manager';
	}

	public function add_asset_manager( $name, $instance ) {
		$this->asset_managers[ $name ] = $instance;
	}

	public function get_assets_manager( $id = null ) {
		if ( $id ) {
			if ( ! isset( $this->asset_managers[ $id ] ) ) {
				return null;
			}

			return $this->asset_managers[ $id ];
		}

		return $this->asset_managers;
    }

    public function enqueue_admin_scripts() {
        $suffix = Utils::is_script_debug() ? '' : '.min';

        wp_enqueue_script(
            'qazana-assets-manager-admin',
            $this->extension_url('assets/js/admin' . $suffix . '.js'),
            ['jquery'],
            '2.0.0',
            true
        );
    }

    public function enqueue_admin_styles( $hook ) {
        $suffix = Utils::is_script_debug() ? '' : '.min';

        wp_enqueue_style(
            'qazana-assets-manager-admin',
            $this->extension_url('assets/css/admin' . $suffix . '.css'),
            '2.0.0'
        );
    }

	public function __construct() {
        require 'classes/assets-base.php';
        require 'classes/font-base.php';
        require 'asset-types/fonts/custom-fonts.php';
        require 'asset-types/fonts/typekit-fonts.php';
        require 'asset-types/fonts-manager.php';

        require 'classes/icon-base.php';
        require 'asset-types/icons/custom-icons.php';
        require 'asset-types/icons-manager.php';

        $this->add_asset_manager( 'font', new AssetTypes\Fonts_Manager() );
        $this->add_asset_manager( 'icon', new AssetTypes\Icons_Manager());

        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_scripts']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_styles']); // Add enqueued CSS
	}
}
