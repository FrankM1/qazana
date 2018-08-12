<?php
namespace Qazana\Admin\Post;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

use Qazana\Utils;
use Qazana\User;

class Editor {

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
		add_filter( 'display_post_states', [ $this, 'add_post_state' ], 10, 2 );

        add_filter( 'admin_body_class', [ $this, 'body_status_classes' ] );

        // Admin Actions
		add_action( 'admin_action_qazana_new_post', [ $this, 'admin_action_new_post' ] );
    }

    /**
     * Enqueue admin scripts.
     *
     * @since 1.0.0
     * @return void
     */
    public function enqueue_scripts() {

        $suffix = Utils::is_script_debug() ? '' : '.min';

        wp_register_script(
            'qazana-dialog',
            qazana()->core_assets_url . 'lib/dialog/dialog' . $suffix . '.js',
            [
                'jquery-ui-position',
            ],
			'4.4.1',
            true
        );

        wp_register_script( 
            'qazana-admin-app',
            qazana()->core_assets_url . 'js/admin' . $suffix . '.js',
            [ 'jquery', 'qazana-dialog' ],
            qazana_get_version(),
            true
        );

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
     * Admin action new post.
     *
     * When a new post action is fired the title is set to 'Qazana' and the post ID.
     *
     * Fired by `admin_action_qazana_new_post` action.
     *
     * @since 1.9.0
     * @access public
     */
	public function admin_action_new_post() {
		check_admin_referer( 'qazana_action_new_post' );

		if ( empty( $_GET['post_type'] ) ) {
			$post_type = 'post';
		} else {
			$post_type = $_GET['post_type'];
		}

		if ( ! User::is_current_user_can_edit_post_type( $post_type ) ) {
			return;
		}

		if ( empty( $_GET['template_type'] ) ) {
			$type = 'post';
		} else {
			$type = $_GET['template_type']; // XSS ok.
		}

		$post_data = isset( $_GET['post_data'] ) ? $_GET['post_data'] : [];

		$meta = [];

		/**
		 * Create new post meta data.
		 *
		 * Filters the meta data of any new post created.
		 *
		 * @since 2.0.0
		 *
		 * @param array $meta Post meta data.
		 */
		$meta = apply_filters( 'qazana/admin/create_new_post/meta', $meta );

		$post_data['post_type'] = $post_type;

		$document = qazana()->documents->create( $type, $post_data, $meta );

		wp_redirect( $document->get_edit_url() );
		die;
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

        wp_nonce_field( basename( __FILE__ ), '_qazana_edit_mode_nonce' );
        ?>
        <div id="qazana-switch-mode">
            <input id="qazana-switch-mode-input" type="hidden" name="_qazana_post_mode" value="<?php echo qazana()->db->is_built_with_qazana( $post->ID ); ?>" />
            <button id="qazana-switch-mode-button" class="qazana-button button-hero">
                <span class="qazana-switch-mode-on"><?php _e( '&#8592; Back to WordPress Editor', 'qazana' ); ?></span>
                <span class="qazana-switch-mode-off"><i class="eicon-qazana"></i><?php _e( 'Edit with Qazana', 'qazana' ); ?></span>
            </button>
        </div>
        <div id="qazana-editor">
            <a id="qazana-go-to-edit-page-link" href="<?php echo Utils::get_edit_link( $post->ID ); ?>">
                <div id="qazana-editor-button" class="qazana-button button button-primary button-hero">
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
        if (!isset($_POST['_qazana_edit_mode_nonce']) || !wp_verify_nonce($_POST['_qazana_edit_mode_nonce'], basename(__FILE__))) {
            return;
        }

        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        qazana()->db->set_is_qazana_page($post_id, !empty($_POST['_qazana_post_mode']));
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
		if ( User::is_current_user_can_edit( $post->ID ) && qazana()->db->is_built_with_qazana( $post->ID ) ) {
            $actions['edit_with_qazana'] = sprintf(
                '<a href="%s">%s</a>',
                Utils::get_edit_link( $post->ID ),
                __( 'Qazana', 'qazana' )
            );
        }

        return $actions;
    }

    /**
	 * Body status classes.
	 *
	 * Adds CSS classes to the admin body tag.
	 *
	 * Fired by `admin_body_class` filter.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param string $classes Space-separated list of CSS classes.
	 *
	 * @return string Space-separated list of CSS classes.
	 */
    public function body_status_classes( $classes ) {
        global $pagenow;

		if ( in_array( $pagenow, [ 'post.php', 'post-new.php' ], true ) && Utils::is_post_type_support() ) {
            $post = get_post();

			$mode_class = qazana()->db->is_built_with_qazana( $post->ID ) ? 'qazana-editor-active' : 'qazana-editor-inactive';

            $classes .= ' ' . $mode_class;
        }

        return $classes;
    }

    /**
	 * Adds a "Qazana" post state for post table.
	 *
	 * @since 1.2.1
	 *
	 * @param  array   $post_states An array of post display states.
	 * @param  \WP_Post $post        The current post object.
	 *
	 * @return array                A filtered array of post display states.
	 */
	public function add_post_state( $post_states, $post ) {
		if ( User::is_current_user_can_edit( $post->ID ) && qazana()->db->is_built_with_qazana( $post->ID ) ) {
			$post_states[] = '<span class="status-qazana">' . __( 'Qazana', 'qazana' ) . '</span>';
		}
		return $post_states;
	}
}
