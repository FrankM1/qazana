<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Qazana popover toggle control.
 *
 * A base control for creating a popover toggle control. By default displays a toggle
 * button to open and close a popover.
 *
 * @since 1.9.0
 */
class Control_Popover_Toggle extends Base_Data_Control {

	/**
	 * Get popover toggle control type.
	 *
	 * Retrieve the control type, in this case `popover_toggle`.
	 *
	 * @since 1.9.0
	 * @access public
	 *
	 * @return string Control type.
	 */
	public function get_type() {
		return 'popover_toggle';
	}

	/**
	 * Get popover toggle control default settings.
	 *
	 * Retrieve the default settings of the popover toggle control. Used to
	 * return the default settings while initializing the popover toggle
	 * control.
	 *
	 * @since 1.9.0
	 * @access protected
	 *
	 * @return array Control default settings.
	 */
	protected function get_default_settings() {
		return [
			'return_value' => 'yes',
		];
	}

	/**
	 * Render popover toggle control output in the editor.
	 *
	 * Used to generate the control HTML in the editor using Underscore JS
	 * template. The variables for the class are available using `data` JS
	 * object.
	 *
	 * @since 1.9.0
	 * @access public
	 */
	public function content_template() {
		$control_uid = $this->get_control_uid();
		?>
		<div class="qazana-control-field">
			<label class="qazana-control-title">{{{ data.label }}}</label>
			<div class="qazana-control-input-wrapper">
				<input id="<?php echo $control_uid; ?>-custom" class="qazana-control-popover-toggle-toggle" type="radio" name="qazana-choose-{{ data.name }}-{{ data._cid }}" value="{{ data.return_value }}">
				<label class="qazana-control-popover-toggle-toggle-label" for="<?php echo $control_uid; ?>-custom">
					<i class="eicon-edit" aria-hidden="true"></i>
					<span class="qazana-screen-only"><?php _e( 'Edit', 'qazana' ); ?></span>
				</label>
				<input id="<?php echo $control_uid; ?>-default" type="radio" name="qazana-choose-{{ data.name }}-{{ data._cid }}" value="">
				<label class="qazana-control-popover-toggle-reset-label tooltip-target" for="<?php echo $control_uid; ?>-default" data-tooltip="<?php _e( 'Back to default', 'qazana' ); ?>" data-tooltip-pos="s">
					<i class="fa fa-repeat" aria-hidden="true"></i>
					<span class="qazana-screen-only"><?php _e( 'Back to default', 'qazana' ); ?></span>
				</label>
			</div>
		</div>
		<?php
	}
}
