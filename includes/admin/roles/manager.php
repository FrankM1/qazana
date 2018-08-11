<?php
namespace Qazana\Core\Roles;

use Qazana\Admin\Settings\Panel;
use Qazana\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Manager extends Panel {

	const PAGE_ID = 'qazana-role-manager';
	const ROLE_MANAGER_OPTION_NAME = 'role-manager';

	/**
	 * @since 2.0.0
	 * @access public
	 */
	public function get_role_manager_options() {
		return get_option( 'qazana_' . self::ROLE_MANAGER_OPTION_NAME, [] );
	}

	/**
	 * @since 2.0.0
	 * @access protected
	 */
	protected function get_page_title() {
		return __( 'Permissions', 'qazana' );
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
			[ $this, 'display_settings_page' ]
		);
	}

	/**
	 * @since 2.0.0
	 * @access protected
	 */
	protected function create_tabs() {
		$validation_class = 'Qazana\Settings_Validations';
		return [
			'general' => [
				'label' => __( 'General', 'qazana' ),
				'sections' => [
					'tools' => [
						'fields' => [
							'exclude_user_roles' => [
								'label' => __( 'Exclude Roles', 'qazana' ),
								'field_args' => [
									'type' => 'checkbox_list_roles',
									'exclude' => [ 'administrator' ],
								],
								'setting_args' => [
									'sanitize_callback' => [ $validation_class, 'checkbox_list' ],
								],
                            ],
                            'role-manage' => [
                                'field_args' => [
                                    'type' => 'raw_html',
                                    'html' => '',
                                ],
                                'setting_args' => [
                                    'sanitize_callback' => [ $this, 'save_advanced_options' ],
                                ],
                            ],
						],
					],
				],
			],
		];
	}

	/**
	 * @since 2.0.0
	 * @access public
	 */
	public function display_settings_page() {
		$this->get_tabs();
		?>
		<div class="wrap">
			<h1><?php echo esc_html( $this->get_page_title() ); ?></h1>

			<div id="qazana-role-manager">
				<h3><?php echo __( 'Manage What Your Users Can Edit In Qazana', 'qazana' ); ?></h3>
				<form id="qazana-settings-form" method="post" action="options.php">
					<?php
					settings_fields( static::PAGE_ID );
					echo '<div class="qazana-settings-form-page qazana-active">';
					foreach ( get_editable_roles() as $role_slug => $role_data ) {
						if ( 'administrator' === $role_slug ) {
							continue;
						}
						$this->display_role_controls( $role_slug, $role_data );
					}
					submit_button();
					?>
				</form>
			</div>
		</div><!-- /.wrap -->
		<?php
	}

	/**
	 * @since 2.0.0
	 * @access private
	 *
	 * @param string $role_slug The role slug.
	 * @param array  $role_data An array with role data.
	 */
	private function display_role_controls( $role_slug, $role_data ) {
		static $excluded_options = false;
		if ( false === $excluded_options ) {
			$excluded_options = $this->get_role_manager_options();
		}

		?>
		<div class="qazana-role-row <?php echo esc_attr( $role_slug ); ?>">
			<div class="qazana-role-label">
				<span class="qazana-role-name"><?php echo esc_html( $role_data['name'] ); ?></span>
				<span data-excluded-label="<?php esc_attr_e( 'Role Excluded', 'qazana' ); ?>" class="qazana-role-excluded-indicator"></span>
				<span class="qazana-role-toggle"><span class="dashicons dashicons-arrow-down"></span></span>
			</div>
			<div class="qazana-role-controls hidden">
				<div class="qazana-role-control">
					<label>
						<input type="checkbox" name="qazana_exclude_user_roles[]" value="<?php echo esc_attr( $role_slug ); ?>"<?php checked( in_array( $role_slug, $excluded_options, true ), true ); ?>>
						<?php echo __( 'No access to editor', 'qazana' ); ?>
					</label>
				</div>
				<div>
                    <?php static $options = false;
                        if ( ! $options ) {
                            $options = [
                                'excluded_options' => $excluded_options,
                                'advanced_options' => $this->get_role_manager_options(),
                            ];
                        }
                        $id = 'role-manage_' . $role_slug . '_design';
                        $name = 'qazana_role-manage[' . $role_slug . '][]';
                        $checked = isset( $options['advanced_options'][ $role_slug ] ) ? $options['advanced_options'][ $role_slug ] : [];

                        ?>
                        <label for="<?php echo esc_attr( $id ); ?>">
                            <input type="checkbox" name="<?php echo esc_attr( $name ); ?>" id="<?php echo esc_attr( $id ); ?>" value="design" <?php checked( in_array( 'design', $checked ), true ); ?>>
                            <?php esc_html_e( 'Access to edit content only', 'qazana' ); ?>
                        </label>
                    </div>
        			<div>
					<?php
					/**
					 * Role restrictions controls.
					 *
					 * Fires after the role manager checkbox that allows the user to
					 * exclude the role.
					 *
					 * This filter allows developers to add custom controls to the role
					 * manager.
					 *
					 * @since 2.0.0
					 *
					 * @param string $role_slug The role slug.
					 * @param array  $role_data An array with role data.
					 */
					do_action( 'qazana/role/restrictions/controls', $role_slug, $role_data );
					?>
				</div>
			</div>
		</div>
		<?php
	}

	/**
	 * @since 2.0.0
	 * @access public
	 */
	public function get_user_restrictions_array() {
		$user  = wp_get_current_user();
		$user_roles = $user->roles;
		$options = $this->get_user_restrictions();
		$restrictions = [];
		if ( empty( $options ) ) {
			return $restrictions;
		}

		foreach ( $user_roles as $role ) {
			if ( ! isset( $options[ $role ] ) ) {
				continue;
			}
			$restrictions = array_merge( $restrictions, $options[ $role ] );
		}
		return array_unique( $restrictions );
	}

	/**
	 * @since 2.0.0
	 * @access private
	 */
	private function get_user_restrictions() {
		static $restrictions = false;
		if ( ! $restrictions ) {
			$restrictions = [];

			/**
			 * Editor user restrictions.
			 *
			 * Filters the user restrictions in the editor.
			 *
			 * @since 2.0.0
			 *
			 * @param array $restrictions User restrictions.
			 */
			$restrictions = apply_filters( 'qazana/editor/user/restrictions', $restrictions );
		}
		return $restrictions;
	}

	/**
	 * @since 2.0.0
	 * @access public
	 *
	 * @param $capability
	 *
	 * @return bool
	 */
	public function user_can( $capability ) {
		$options = $this->get_user_restrictions_array();

		if ( in_array( $capability, $options, true ) ) {
			return false;
		}

		return true;
	}

	/**
	 * @since 2.0.0
	 * @access public
	 */
	public function __construct() {
		parent::__construct();

		add_action( 'admin_menu', [ $this, 'register_admin_menu' ], 100 );
	}
}
