<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * A draggable Range Slider control.
 *
 * @param array  $default    {
 *
 * 		@type integer $size       The initial value of slider
 *                           	  Default empty
 * }
 *
 * @since              1.0.0
 */
class Control_Slider extends Base_Control_Units {

	public function get_type() {
		return 'slider';
	}

	public function get_default_value() {
		return array_merge( parent::get_default_value(), [
			'size' => '',
		] );
	}

	protected function get_default_settings() {
		return array_merge( parent::get_default_settings(), [
			'label_block' => true,
		] );
	}

	public function content_template() {
		?>
		<div class="qazana-control-field">
			<label class="qazana-control-title">{{{ data.label }}}</label>
			<?php $this->print_units_template(); ?>
			<div class="qazana-control-input-wrapper qazana-clearfix">
				<div class="qazana-slider"></div>
				<div class="qazana-slider-input">
					<input type="number" min="{{ data.min }}" max="{{ data.max }}" step="{{ data.step }}" data-setting="size" />
				</div>
			</div>
		</div>
		<# if ( data.description ) { #>
		<div class="qazana-control-description">{{{ data.description }}}</div>
		<# } #>
		<?php
	}
}
