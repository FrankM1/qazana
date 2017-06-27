<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * A simple text input control.
 *
 * @param string $default     A default value
 *                            Default empty
 * @param string $input_type  any valid HTML5 input type: email, tel, etc.
 *                            Default 'text'
 *
 * @since 1.0.0
 */
class Control_Text extends Base_Control {

	public function get_type() {
		return 'text';
	}

	public function content_template() {
		?>
		<div class="qazana-control-field">
			<label class="qazana-control-title">{{{ data.label }}}</label>
			<div class="qazana-control-input-wrapper">
				<input type="{{ data.input_type }}" class="tooltip-target" data-tooltip="{{ data.title }}" title="{{ data.title }}" data-setting="{{ data.name }}" placeholder="{{ data.placeholder }}" />
			</div>
		</div>
		<# if ( data.description ) { #>
		<div class="qazana-control-description">{{{ data.description }}}</div>
		<# } #>
		<?php
	}

	public function get_default_settings() {
		return [
			'input_type' => 'text',
		];
	}
}
