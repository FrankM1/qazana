<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * A URL input control. with the ability to set the target of the link to `_blank` to open in a new tab.
 *
 * @param array $default {
 * 		@type string $url         Default empty
 * 		@type bool   $is_external Determine whether to open the url in the same tab or in a new one
 *                                Default empty
 * }
 *
 * @param bool  $show_external 	  Whether to show the 'Is External' button
 *                                Default true
 *
 * @since 1.0.0
 */
class Control_URL extends Base_Control_Multiple {

	public function get_type() {
		return 'url';
	}

	public function get_default_value() {
		return [
			'url' => '',
			'is_external' => '',
			'nofollow' => '',
		];
	}

	protected function get_default_settings() {
		return [
			'label_block' => true,
			'show_external' => true,
		];
	}

	public function content_template() {

		$control_uid = $this->get_control_uid();

		$more_input_control_uid = $this->get_control_uid( 'more-input' );

		$is_external_control_uid = $this->get_control_uid( 'is_external' );

		$nofollow_control_uid = $this->get_control_uid( 'nofollow' );
		?>
		<div class="qazana-control-field qazana-control-url-external-{{{ data.show_external ? 'show' : 'hide' }}}">
			<label for="<?php echo $control_uid; ?>" class="qazana-control-title">{{{ data.label }}}</label>
			<div class="qazana-control-input-wrapper">
				<input id="<?php echo $control_uid; ?>" type="url" data-setting="url" placeholder="{{ data.placeholder }}" />
				<label for="<?php echo $more_input_control_uid; ?>" class="qazana-control-url-more tooltip-target" data-tooltip="<?php _e( 'Link Options', 'qazana' ); ?>">
					<i class="fa fa-cog"></i>
				</label>
				<input id="<?php echo $more_input_control_uid; ?>" type="checkbox" class="qazana-control-url-more-input">
				<div class="qazana-control-url-more-options">
					<div class="qazana-control-url-option">
						<input id="<?php echo $is_external_control_uid; ?>" type="checkbox" class="qazana-control-url-option-input" data-setting="is_external">
						<label for="<?php echo $is_external_control_uid; ?>"><?php echo __( 'Open in new window', 'qazana' ); ?></label>
					</div>
					<div class="qazana-control-url-option">
						<input id="<?php echo $nofollow_control_uid; ?>" type="checkbox" class="qazana-control-url-option-input" data-setting="nofollow">
						<label for="<?php echo $nofollow_control_uid; ?>"><?php echo __( 'Add nofollow', 'qazana' ); ?></label>
					</div>
				</div>
			</div>
		</div>
		<# if ( data.description ) { #>
		<div class="qazana-control-field-description">{{{ data.description }}}</div>
		<# } #>
		<?php
	}
}
