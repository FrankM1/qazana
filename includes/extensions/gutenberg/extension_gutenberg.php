<?php
namespace Qazana\Extensions;

use Qazana\Utils;
use Qazana\User;

class Gutenberg extends Base {

    /**
	 * Unique extension name
	 *
	 * @return string
	 */
	public function get_name() {
        return 'gutenberg';
    }

    /**
     * Extension title
     *
     * @return string
     */
    public function get_title() {
        return 'Gutenberg';
    }

    protected $is_gutenberg_editor_active = false;

	public static function gutenberg_is_active() {
		return function_exists( 'the_gutenberg_project' );
    }
    
    /**
	 * Add new button to gutenberg.
	 *
	 * Insert new "Qazana" button to the gutenberg editor to create new post
	 * using Qazana page builder.
	 *
	 * @since 2.0.0
	 * @access public
	 * @static
	 */
	public static function add_new_button_to_gutenberg() {
		global $typenow;
		if ( ! gutenberg_can_edit_post_type( $typenow ) || ! User::is_current_user_can_edit_post_type( $typenow ) ) {
			return;
		}
		?>
		<script type="text/javascript">
			document.addEventListener( 'DOMContentLoaded', function() {
				var dropdown = document.querySelector( '#split-page-title-action .dropdown' );

				if ( ! dropdown ) {
					return;
				}

				var url = '<?php echo esc_url( Utils::get_create_new_post_url( $typenow ) ); ?>';

				dropdown.insertAdjacentHTML( 'afterbegin', '<a href="' + url + '">Qazana</a>' );
			} );
		</script>
		<?php
	}

	public function register_qazana_rest_field() {
		register_rest_field( get_post_types( '', 'names' ),
			'gutenberg_qazana_mode', [
				'update_callback' => function( $request_value, $object ) {
					if ( ! User::is_current_user_can_edit( $object->ID ) ) {
						return false;
					}

					qazana()->get_db()->set_is_qazana_page( $object->ID, false );

					return true;
				},
			]
		);
	}

	public function enqueue_assets() {
		$post_id = get_the_ID();

		if ( ! User::is_current_user_can_edit( $post_id ) ) {
			return;
		}

		$this->is_gutenberg_editor_active = true;

		$suffix = Utils::is_script_debug() ? '' : '.min';

		wp_enqueue_script( 'qazana-gutenberg', qazana()->core_assets_url . 'js/gutenberg' . $suffix . '.js', [ 'jquery' ], qazana_get_version(), true );

		$qazana_settings = [
			'isQazanaMode' => qazana()->get_db()->is_built_with_qazana( $post_id ),
			'editLink' => Utils::get_edit_link( $post_id ),
		];

		wp_localize_script( 'qazana-gutenberg', 'QazanaGutenbergSettings', $qazana_settings );
	}

	public function print_admin_js_template() {
		if ( ! $this->is_gutenberg_editor_active ) {
			return;
		}

		?>
		<script id="qazana-gutenberg-button-switch-mode" type="text/html">
			<div id="qazana-switch-mode">
				<button id="qazana-switch-mode-button" type="button" class="button button-primary button-large">
					<span class="qazana-switch-mode-on"><?php echo __( '&#8592; Back to WordPress Editor', 'qazana' ); ?></span>
					<span class="qazana-switch-mode-off">
						<i class="eicon-qazana-square" aria-hidden="true" />
						<?php echo __( 'Edit with Qazana', 'qazana' ); ?>
					</span>
				</button>
			</div>
		</script>

		<script id="qazana-gutenberg-panel" type="text/html">
			<div id="qazana-editor"><a id="qazana-go-to-edit-page-link" href="#">
					<div id="qazana-editor-button" class="button button-primary button-hero">
						<i class="eicon-qazana" aria-hidden="true" />
						<?php echo __( 'Edit with Qazana', 'qazana' ); ?>
					</div>
					<?php echo qazana_loading_indicator(); ?>
				</a></div>
		</script>
		<?php
	}

	public function __construct() {
		add_action( 'rest_api_init', [ $this, 'register_qazana_rest_field' ] );
		add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_assets' ] );
        add_action( 'admin_footer', [ $this, 'print_admin_js_template' ] );
        // Gutenberg
		if ( self::gutenberg_is_active() ) {
			add_action( 'admin_print_scripts-edit.php', [ $this, 'add_new_button_to_gutenberg' ], 11 );
		}
	}
}
