<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * A group of Radio Buttons controls represented as a stylized component with an icon for each option.
 *
 * @param mixed $default      The selected option key
 *                            Default ''
 * @param array $options      Array of arrays `[ [ 'title' => ??, 'icon' => ?? ], [ 'title' ... ]`.
 *                            The icon can be any icon-font class that appears in the panel, e.g. 'fa fa-align-left' for Font Awesome
 * @param bool  $toggle       Whether to allow toggle the selected button (unset the selection)
 *                            Default true
 *
 * @since 1.0.0
 */
class Control_Choose extends Base_Data_Control {

	public function get_type() {
		return 'choose';
	}

	public function content_template() {
		$control_uid = $this->get_control_uid( '{{value}}' );
		?>
		<div class="qazana-control-field">
			<label class="qazana-control-title">{{{ data.label }}}</label>
			<div class="qazana-control-input-wrapper">
				<div class="qazana-choices">
					<# _.each( data.options, function( options, value ) { #>
					<input id="<?php echo $control_uid; ?>" type="radio" name="qazana-choose-{{ data.name }}-{{ data._cid }}" value="{{ value }}">
					<label class="qazana-choices-label tooltip-target" for="<?php echo $control_uid; ?>" data-tooltip="{{ options.title }}" title="{{ options.title }}">
						<# if( options.icon ) { #>
							<i class="{{ options.icon }}"></i>
						<# } else if( options.title ) { #>
							<span class="qazana-choose-option-title">{{ options.title }}</span>
						<# } #>
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

	protected function get_default_settings() {
		return [
			'options' => [],
			'label_block' => true,
			'toggle' => true,
		];
	}
}
