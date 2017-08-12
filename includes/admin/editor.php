<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Editor_Admin {

    /**
     * Admin constructor.
     */
    public function __construct() {

        add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
        add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_styles' ] );

        add_action( 'edit_form_after_title', [ $this, 'print_switch_mode_button' ] );
        add_action( 'save_post', [ $this, 'save_post' ] );

        add_filter( 'page_row_actions', [ $this, 'add_edit_in_dashboard' ], 10, 2 );
        add_filter( 'post_row_actions', [ $this, 'add_edit_in_dashboard' ], 10, 2 );

        add_filter( 'admin_body_class', [ $this, 'body_status_classes' ] );
    }

    /**
     * Enqueue admin scripts.
     *
     * @since 1.0.0
     * @return void
     */
    public function enqueue_scripts() {

        $suffix = Utils::is_script_debug() ? '' : '.min';

        wp_register_script( 'qazana-admin-app', qazana()->core_assets_url . 'js/admin' . $suffix . '.js', [ 'jquery' ], qazana_get_version(), true );

        wp_enqueue_script( 'qazana-admin-app' );

    }

    /**
     * Enqueue admin styles.
     *
     * @since 1.0.0
     * @return void
     */
    public function enqueue_styles() {
        $suffix = Utils::is_script_debug() ? '' : '.min';

        $direction_suffix = is_rtl() ? '-rtl' : '';

        wp_register_style(
            'qazana-icons',
            qazana()->core_assets_url . 'lib/eicons/css/icons' . $suffix . '.css',
            [],
            qazana_get_version()
        );

        wp_register_style(
            'qazana-admin-app',
            qazana()->core_assets_url . 'css/admin' . $direction_suffix . $suffix . '.css',
            [
                'qazana-icons',
            ],
            qazana_get_version()
        );

        wp_enqueue_style( 'qazana-admin-app' );

        // It's for upgrade notice
        // TODO: enqueue this just if needed
        add_thickbox();
    }

    /**
     * Print switch button in edit post (which has cpt support).
     *
     * @since 1.0.0
     * @param $post
     *
     * @return void
     */
    public function print_switch_mode_button( $post ) {
        if ( ! User::is_current_user_can_edit( $post->ID ) ) {
            return;
        }

        $current_mode = qazana()->db->get_edit_mode( $post->ID );
        if ( 'qazana' !== $current_mode ) {
            $current_mode = 'editor';
        }

        wp_nonce_field( basename( __FILE__ ), '_qazana_edit_mode_nonce' );
        ?>
        <div id="qazana-switch-mode">
            <input id="qazana-switch-mode-input" type="hidden" name="_qazana_post_mode" value="<?php echo $current_mode; ?>" />
            <button id="qazana-switch-mode-button" class="qazana-button">
                <span class="qazana-switch-mode-on"><?php _e( '&#8592; Back to WordPress Editor', 'qazana' ); ?></span>
                <span class="qazana-switch-mode-off">
                    <i class="eicon-qazana"></i>
                    <?php _e( 'Edit with Qazana', 'qazana' ); ?>
                </span>
            </button>
        </div>
        <div id="qazana-editor">
            <a id="qazana-go-to-edit-page-link" href="<?php echo Utils::get_edit_link( $post->ID ); ?>">
                <div id="qazana-editor-button" class="qazana-button">
                    <i class="eicon-qazana"></i>
                    <?php _e( 'Edit with Qazana', 'qazana' ); ?>
                </div>
                <?php echo qazana_loading_indicator(); ?>
            </a>
        </div>
        <?php
    }

    /**
     * Fired when the save the post, and flag the post mode.
     *
     * @since 1.0.0
     * @param $post_id
     *
     * @return void
     */
    public function save_post( $post_id ) {
        if ( ! isset( $_POST['_qazana_edit_mode_nonce'] ) || ! wp_verify_nonce( $_POST['_qazana_edit_mode_nonce'], basename( __FILE__ ) ) ) {
            return;
        }

        if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
            return;
        }

        // Exit when you don't have $_POST array.
        if ( empty( $_POST ) ) {
            return;
        }

        // Make sure we are on the right page
        if ( $_POST['post_ID'] == $post_id ) {

            if ( ! isset( $_POST['_qazana_post_mode'] ) )
                $_POST['_qazana_post_mode'] = '';

            // Save qazana flag
            qazana()->db->set_edit_mode( $post_id, $_POST['_qazana_post_mode'] );
        }
    }

    /**
     * Add edit link in outside edit post.
     *
     * @since 1.0.0
     * @param $actions
     * @param $post
     *
     * @return array
     */
    public function add_edit_in_dashboard( $actions, $post ) {
        if ( User::is_current_user_can_edit( $post->ID ) && 'qazana' === qazana()->db->get_edit_mode( $post->ID ) ) {
            $actions['edit_with_qazana'] = sprintf(
                '<a href="%s">%s</a>',
                Utils::get_edit_link( $post->ID ),
                __( 'Qazana', 'qazana' )
            );
        }

        return $actions;
    }

    public function body_status_classes( $classes ) {
        global $pagenow;

        if ( in_array( $pagenow, [ 'post.php', 'post-new.php' ] ) && Utils::is_post_type_support() ) {
            $post = get_post();
            $current_mode = qazana()->db->get_edit_mode( $post->ID );

            $mode_class = 'qazana' === $current_mode ? 'qazana-editor-active' : 'qazana-editor-inactive';

            $classes .= ' ' . $mode_class;
        }

        return $classes;
    }

}
