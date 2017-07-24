<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * A simple Select box control.
 *
 * @param string $default     The selected option key
 *                            Default empty
 * @param array $options      Array of key & value pairs: `[ 'key' => 'value', ... ]`
 *                            Default empty
 *
 * @since 1.0.0
 */
class Control_Select extends Base_Data_Control {

	public function get_type() {
		return 'select';
	}

	public function content_template() {
		$control_uid = $this->get_control_uid();
		?>
		<div class="qazana-control-field">
			<label for="<?php echo $control_uid; ?>" class="qazana-control-title">{{{ data.label }}}</label>
			<div class="qazana-control-input-wrapper">
				<select for="<?php echo $control_uid; ?>" data-setting="{{ data.name }}">
				<<#
				_.each( data.options, function( option_title, option_value ) {
					if( typeof option_title == 'object' ) {
						#>
							<optgroup label="{{{ option_value }}}">
						<#
						_.each( option_title, function( title, value ) {
							#>
							<option value="{{ value }}">{{{ title }}}</option>
							<#
						} );
						#>
							</optgroup>
						<#
					} else {
						#>
						<option value="{{ option_value }}">{{{ option_title }}}</option>
						<#
					}
				} );

				#>
				</select>
			</div>
		</div>
		<# if ( data.description ) { #>
			<div class="qazana-control-description">{{{ data.description }}}</div>
		<# } #>
		<?php
	}
}
