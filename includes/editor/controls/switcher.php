<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * A Switcher (on/off) control - basically a fancy UI representation of a checkbox.
 *
 * @param string $label_off           The label for off status
 *                                    Default ''
 * @param string $label_on            The label for on status
 *                                    Default ''
 * @param string $return_value        The value of the control
 *                                    Default 'yes'
 *
 * @since 1.0.0
 *
```<php
	$this->add_control(
		'show_title',
		[
			'label' => __( 'Show Title', 'plugin-domain' ),
			'type' => Controls_Manager::SWITCHER,
			'default' => 'yes',
			'label_on' => __( 'Show', 'plugin-domain' ),
			'label_off' => __( 'Hide', 'plugin-domain' ),
			'return_value' => 'yes',
		]
	);
?>```
 */
class Control_Switcher extends Base_Data_Control {

	public function get_type() {
		return 'switcher';
	}

	public function content_template() {
		$control_uid = $this->get_control_uid();
		?>
		<div class="qazana-control-field">
			<label for="<?php echo $control_uid; ?>" class="qazana-control-title">{{{ data.label }}}</label>
			<div class="qazana-control-input-wrapper">
				<label class="qazana-switch">
					<input id="<?php echo $control_uid; ?>" type="checkbox" data-setting="{{ data.name }}" class="qazana-switch-input" value="{{ data.return_value }}">
					<span class="qazana-switch-label" data-on="{{ data.label_on }}" data-off="{{ data.label_off }}"></span>
					<span class="qazana-switch-handle"></span>
				</label>
			</div>
		</div>
		<# if ( data.description ) { #>
		<div class="qazana-control-field-description">{{{ data.description }}}</div>
		<# } #>
		<?php
	}

	protected function get_default_settings() {
		return [
			'label_off' => __( 'No', 'qazana' ),
			'label_on' => __( 'Yes', 'qazana' ),
			'return_value' => 'yes',
		];
	}
}
