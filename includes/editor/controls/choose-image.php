<?php
namespace Qazana;

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Qazana choose control.
 *
 * A base control for creating choose control. Displays radio buttons styled as
 * groups of buttons with icons for each option.
 *
 * @since 1.0.0
 */
class Control_Choose_Image extends Base_Data_Control {

    /**
     * Get choose control type.
     *
     * Retrieve the control type, in this case `choose`.
     *
     * @since 1.0.0
     * @access public
     *
     * @return string Control type.
     */
	public function get_type() {
		return 'choose_image';
    }

    /**
     * Render choose control output in the editor.
     *
     * Used to generate the control HTML in the editor using Underscore JS
     * template. The variables for the class are available using `data` JS
     * object.
     *
     * @since 1.0.0
     * @access public
     */
	public function content_template() {
		$control_uid = $this->get_control_uid( '{{value}}' );
		?>
		<div class="qazana-control-field">
			<!--<label class="qazana-control-title">{{{ data.label }}}</label>-->
			<div class="qazana-control-input-wrapper">
				<div class="qazana-choices qazana-choices-image">
					<# _.each( data.options, function( options, value ) { #>
					<input id="<?php echo $control_uid; ?>" type="radio" name="qazana-choose-{{ data.name }}-{{ data._cid }}" value="{{ value }}" data-setting="{{ data.name }}">
					<label class="qazana-choices-label" for="<?php echo $control_uid; ?>">
						<img src="{{ options }}" alt="...">
					</label>
					<# } ); #>
				</div>
			</div>
		</div>

		<# if ( data.description ) { #>
		<div class="qazana-control-field-description">{{{ data.description }}}</div>
		<# } #>
		<?php
	}

    /**
     * Get choose control default settings.
     *
     * Retrieve the default settings of the choose control. Used to return the
     * default settings while initializing the choose control.
     *
     * @since 1.0.0
     * @access protected
     *
     * @return array Control default settings.
     */
	protected function get_default_settings() {
		return [
			'options' => [],
			'label_block' => true,
			'toggle' => true,
		];
	}
}
