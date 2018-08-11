<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Qazana dimension control.
 *
 * A base control for creating dimension control. Displays input fields for top,
 * right, bottom, left and the option to link them together.
 *
 * @since 1.0.0
 */
class Control_Dimensions extends Control_Base_Units {

	/**
	 * Get dimensions control type.
	 *
	 * Retrieve the control type, in this case `dimensions`.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Control type.
	 */
	public function get_type() {
		return 'dimensions';
	}

	/**
	 * Get dimensions control default values.
	 *
	 * Retrieve the default value of the dimensions control. Used to return the
	 * default values while initializing the dimensions control.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return array Control default value.
	 */
	public function get_default_value() {
		return array_merge(
			parent::get_default_value(), [
				'top' => '',
				'right' => '',
				'bottom' => '',
				'left' => '',
				'isLinked' => true,
			]
		);
	}

	/**
	 * Get dimensions control default settings.
	 *
	 * Retrieve the default settings of the dimensions control. Used to return the
	 * default settings while initializing the dimensions control.
	 *
	 * @since 1.0.0
	 * @access protected
	 *
	 * @return array Control default settings.
	 */
	protected function get_default_settings() {
		return array_merge(
			parent::get_default_settings(), [
				'label_block' => true,
				'allowed_dimensions' => 'all',
				'placeholder' => '',
			]
		);
	}

	/**
	 * Render dimensions control output in the editor.
	 *
	 * Used to generate the control HTML in the editor using Underscore JS
	 * template. The variables for the class are available using `data` JS
	 * object.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function content_template() {
		$dimensions = [
			'top' => __( 'Top', 'qazana' ),
			'right' => __( 'Right', 'qazana' ),
			'bottom' => __( 'Bottom', 'qazana' ),
			'left' => __( 'Left', 'qazana' ),
		];
		?>
		<div class="qazana-control-field">
			<label class="qazana-control-title">{{{ data.label }}}</label>
			<?php $this->print_units_template(); ?>
			<div class="qazana-control-input-wrapper">
				<ul class="qazana-control-dimensions">
					<?php
					foreach ( $dimensions as $dimension_key => $dimension_title ) :
						$control_uid = $this->get_control_uid( $dimension_key );
						?>
						<li class="qazana-control-dimension">
							<input id="<?php echo $control_uid; ?>" type="number" data-setting="<?php echo esc_attr( $dimension_key ); ?>"
								   placeholder="<#
							   if ( _.isObject( data.placeholder ) ) {
								if ( ! _.isUndefined( data.placeholder.<?php echo $dimension_key; ?> ) ) {
									print( data.placeholder.<?php echo $dimension_key; ?> );
								}
							   } else {
								print( data.placeholder );
							   } #>"
							<# if ( -1 === _.indexOf( allowed_dimensions, '<?php echo $dimension_key; ?>' ) ) { #>
								disabled
								<# } #>
									/>
							<label for="<?php echo esc_attr( $control_uid ); ?>" class="qazana-control-dimension-label"><?php echo $dimension_title; ?></label>
						</li>
					<?php endforeach; ?>
					<li>
						<button class="qazana-link-dimensions tooltip-target" data-tooltip="<?php echo esc_attr__( 'Link values together', 'qazana' ); ?>">
							<span class="qazana-linked">
								<i class="fa fa-link" aria-hidden="true"></i>
								<span class="qazana-screen-only"><?php _e( 'Link values together', 'qazana' ); ?></span>
							</span>
							<span class="qazana-unlinked">
								<i class="fa fa-chain-broken" aria-hidden="true"></i>
								<span class="qazana-screen-only"><?php _e( 'Unlinked values', 'qazana' ); ?></span>
							</span>
						</button>
					</li>
				</ul>
			</div>
		</div>
		<# if ( data.description ) { #>
		<div class="qazana-control-field-description">{{{ data.description }}}</div>
		<# } #>
		<?php
	}
}
