<?php
namespace Builder;

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

        wp_register_script( 'builder-admin-app', builder()->core_assets_url . 'js/admin' . $suffix . '.js', [ 'jquery' ], builder()->get_version(), true );

        wp_enqueue_script( 'builder-admin-app' );

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
            'builder-icons',
            builder()->core_assets_url . 'lib/eicons/css/icons' . $suffix . '.css',
            [],
            builder()->get_version()
        );

        wp_register_style(
            'builder-admin-app',
            builder()->core_assets_url . 'css/admin' . $direction_suffix . $suffix . '.css',
            [
                'builder-icons',
            ],
            builder()->get_version()
        );

        wp_enqueue_style( 'builder-admin-app' );

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

        $current_mode = builder()->db->get_edit_mode( $post->ID );
        if ( 'builder' !== $current_mode ) {
            $current_mode = 'editor';
        }

        wp_nonce_field( basename( __FILE__ ), '_builder_edit_mode_nonce' );
        ?>
        <div id="builder-switch-mode">
            <input id="builder-switch-mode-input" type="hidden" name="_builder_post_mode" value="<?php echo $current_mode; ?>" />
            <button id="builder-switch-mode-button" class="builder-button">
                <span class="builder-switch-mode-on"><?php _e( '&#8592; Back to WordPress Editor', 'builder' ); ?></span>
                <span class="builder-switch-mode-off">
                    <i class="eicon-builder"></i>
                    <?php _e( 'Edit with Builder', 'builder' ); ?>
                </span>
            </button>
        </div>
        <div id="builder-editor">
            <a id="builder-go-to-edit-page-link" href="<?php echo Utils::get_edit_link( $post->ID ); ?>">
                <div id="builder-editor-button" class="builder-button">
                    <i class="eicon-builder"></i>
                    <?php _e( 'Edit with Builder', 'builder' ); ?>
                </div>
                <?php echo builder_loading_indicator(); ?>
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
        if ( ! isset( $_POST['_builder_edit_mode_nonce'] ) || ! wp_verify_nonce( $_POST['_builder_edit_mode_nonce'], basename( __FILE__ ) ) ) {
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

            if ( ! isset( $_POST['_builder_post_mode'] ) )
                $_POST['_builder_post_mode'] = '';

            // Save builder flag
            builder()->db->set_edit_mode( $post_id, $_POST['_builder_post_mode'] );
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
        if ( User::is_current_user_can_edit( $post->ID ) && 'builder' === builder()->db->get_edit_mode( $post->ID ) ) {
            $actions['edit_with_builder'] = sprintf(
                '<a href="%s">%s</a>',
                Utils::get_edit_link( $post->ID ),
                __( 'Builder', 'builder' )
            );
        }

        return $actions;
    }

    public function body_status_classes( $classes ) {
        global $pagenow;

        if ( in_array( $pagenow, [ 'post.php', 'post-new.php' ] ) && Utils::is_post_type_support() ) {
            $post = get_post();
            $current_mode = builder()->db->get_edit_mode( $post->ID );

            $mode_class = 'builder' === $current_mode ? 'builder-editor-active' : 'builder-editor-inactive';

            $classes .= ' ' . $mode_class;
        }

        return $classes;
    }

}
