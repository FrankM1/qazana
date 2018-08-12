<?php

namespace Qazana\Admin\Settings;

if (!defined('ABSPATH')) exit; // Exit if accessed directly

class Extensions extends Panel {

    const PAGE_ID = 'qazana-extensions-manager';
    const EXTENSIONS_MANAGER_OPTION_NAME = 'extensions-manager';

	public function __construct() {
        parent::__construct();
        add_action( 'admin_menu', [$this, 'register_admin_menu'], 100 );
        add_action( 'admin_init', [$this, 'register_setting']);
    }

    /**
    * Registers a text field setting for Wordpress 4.7 and higher.
    **/
    function register_setting() {
        register_setting('qazana-extensions-manager', 'qazana_' . self::EXTENSIONS_MANAGER_OPTION_NAME ); 
    } 

    /**
     * @since 2.0.0
     * @access public
     */
    public function get_extension_manager_options() {
        return get_option( 'qazana_' . self::EXTENSIONS_MANAGER_OPTION_NAME, [] );
    }

    /**
     * @since 2.0.0
     * @access protected
     */
    protected function get_page_title() {
        return __('Extensions', 'qazana');
    }

    /**
     * @since 2.0.0
     * @access public
     */
    public function register_admin_menu() {
        add_submenu_page(
            qazana()->slug,
            $this->get_page_title(),
            $this->get_page_title(),
            'manage_options',
            self::PAGE_ID,
            [$this, 'display_settings_page']
        );
    }

    /**
     * @since 2.0.0
     * @access public
     */
    public function display_settings_page() {
        $this->get_tabs();

        ?><div class="wrap">
			<h1><?php echo esc_html($this->get_page_title()); ?></h1>
			<div id="qazana-extensions-manager">
				<h3><?php echo __('Manage Qazana Extension', 'qazana'); ?></h3>
				<form id="qazana-settings-form" method="post" action="options.php">
					<?php
                        settings_fields(static::PAGE_ID);

                        submit_button();

                        $extensions = qazana()->extensions_manager->get_extensions();

                        usort($extensions, array($this, 'sort'));

                        foreach ( $extensions as $extension ) {
                            if ($extension->required) {
                                continue; // Hide required extensions
                            }

                            $extension_slug = sanitize_title_with_dashes($extension->get_config()['name'], '', 'save' );

                            $this->display_controls($extension_slug, $extension->get_config() );
                        }

                        submit_button();

                        ?>
                </form>
            </div>
        </div><!-- /.wrap --><?php

    }

    /**
     * @since 2.0.0
     * @access private
     *
     * @param string $extension_slug The extension slug.
     * @param array  $extension_data An array with extension data.
     */
    private function display_controls( $extension_slug, $extension_data) {

        $title = isset( $extension_data['title'] ) ? $extension_data['title'] : ucfirst( str_replace( '_', ' ', str_replace('-', ' ', $extension_slug ) ) );
        static $options = false;
        if ( ! $options ) {
            $options = $this->get_extension_manager_options();
        }

        $id = 'extension-manage_' . $extension_slug;
        $name = 'qazana_' . self::EXTENSIONS_MANAGER_OPTION_NAME . '[' . $extension_slug . '][]';
        $extension_options = isset($options[$extension_slug]) ? $options[$extension_slug] : [ 'active', 'widgets' ];

        ?><div class="qazana-extension-row qazana-extension-<?php echo esc_attr($extension_slug); ?>">

                <div class="qazana-extension-label">
                    <span class="qazana-extension-name"><?php echo esc_html( $title ); ?></span>
                    <span data-label="<?php esc_attr_e( 'Disabled', 'qazana' ); ?>" class="qazana-extension-indicator"></span>
                    <span class="qazana-extension-toggle"><span class="dashicons dashicons-arrow-down"></span></span>
                    <label for="<?php echo esc_attr($id); ?>">
                        <input type="checkbox" name="<?php echo esc_attr($name); ?>" id="<?php echo esc_attr($id); ?>" value="active" <?php checked(in_array('active', $extension_options), true); ?>>
                    </label>
                </div>

                <div class="qazana-extension-controls hidden">
                    <div>
                        <?php 
                        $id = 'extension-manage_' . $extension_slug . '_widgets';
                        ?>
                        <label for="<?php echo esc_attr($id); ?>">
                            <input type="checkbox" name="<?php echo esc_attr($name); ?>" id="<?php echo esc_attr($id); ?>" value="widgets" <?php checked(in_array('widgets', $extension_options), true); ?>>
                            <?php esc_html_e('Enable Widgets', 'qazana'); ?>
                        </label>
                    </div>
                <div>
                <?php
                    /**
                     * Extensions manager controls.
                     *
                     * Fires after the extension manager checkbox that allows the user to
                     * exclude the extension.
                     *
                     * This filter allows developers to add custom controls to the extension
                     * manager.
                     *
                     * @since 2.0.0
                     *
                     * @param string $extension_slug The extension slug.
                     * @param array  $extension_data An array with extension data.
                     */
                    do_action('qazana/extension/manager/controls', $extension_slug, $extension_data);
                    ?>
                </div>

            </div>
        </div>
        <?php
    }

    function sort( $a, $b ) {
        return strcmp( $a->get_name(), $b->get_name() );
    }
}