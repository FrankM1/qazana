<?php
namespace Builder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * A Color Picker control.
 *
 * @param string $default    A color, in rgb|rgba|hex format.
 *                           Default empty
 * @param bool   $alpha      Whether to allow set the alpha channel
 *                           Default true
 * @since 1.0.0
 */
class Control_Color extends Base_Control {

	public function get_type() {
		return 'color';
	}

	public function enqueue() {
		$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

		wp_register_script( 'iris', admin_url( '/js/iris.min.js' ), [ 'jquery-ui-draggable', 'jquery-ui-slider', 'jquery-touch-punch' ], '1.0.7', 1 );
		wp_register_script( 'wp-color-picker', admin_url( '/js/color-picker.min.js' ), [ 'iris' ], false, true );

		wp_localize_script(
			'wp-color-picker',
			'wpColorPickerL10n',
			[
				'clear' => __( 'Clear', 'builder' ),
				'defaultString' => __( 'Default', 'builder' ),
				'pick' => __( 'Select Color', 'builder' ),
				'current' => __( 'Current Color', 'builder' ),
			]
		);

		wp_register_script(
			'wp-color-picker-alpha',
			builder()->core_assets_url . 'lib/wp-color-picker/wp-color-picker-alpha' . $suffix . '.js',
			[
				'wp-color-picker',
			],
			'1.1',
			true
		);

		wp_enqueue_style( 'wp-color-picker' );
		wp_enqueue_script( 'wp-color-picker-alpha' );
	}

	public function content_template() {
		?>
		<# var defaultValue = '', dataAlpha = '';
			if ( data.default ) {
				if ( '#' !== data.default.substring( 0, 1 ) ) {
					defaultValue = '#' + data.default;
				} else {
					defaultValue = data.default;
				}
				defaultValue = ' data-default-color=' + defaultValue; // Quotes added automatically.
			}
			if ( data.alpha ) {
				dataAlpha = ' data-alpha=true';
			} #>
		<div class="builder-control-field">
			<label class="builder-control-title">
				<# if ( data.label ) { #>
					{{{ data.label }}}
				<# } #>
				<# if ( data.description ) { #>
					<span class="builder-control-description">{{{ data.description }}}</span>
				<# } #>
			</label>
			<div class="builder-control-input-wrapper">
				<input data-setting="{{ name }}" class="color-picker-hex" type="text" maxlength="7" placeholder="<?php esc_attr_e( 'Hex Value', 'builder' ); ?>" {{ defaultValue }}{{ dataAlpha }} />
			</div>
		</div>
		<?php
	}

	protected function get_default_settings() {
		return [
			'alpha' => true,
		];
	}
}
