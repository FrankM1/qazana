<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * A single Checkbox control
 *
 * @param string $default     Whether to initial it as checked. 'on' for checked, and '' (empty string) for unchecked
 *                            Default ''
 *
 * @since 1.0.0
 */
class Control_Checkbox extends Base_Data_Control {

	public function get_type() {
		return 'checkbox';
	}

	public function content_template() {
		?>
		<label class="qazana-control-title">
			<input type="checkbox" data-setting="{{ data.name }}" />
			<span>{{{ data.label }}}</span>
		</label>
		<# if ( data.description ) { #>
		<div class="qazana-control-field-description">{{{ data.description }}}</div>
		<# } #>
		<?php
	}
}
