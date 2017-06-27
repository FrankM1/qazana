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
			'is_external' => '',
			'url' => '',
		];
	}

	protected function get_default_settings() {
		return [
			'label_block' => true,
			'show_external' => true,
		];
	}

	public function content_template() {
		?>
		<div class="qazana-control-field qazana-control-url-external-{{{ data.show_external ? 'show' : 'hide' }}}">
			<label class="qazana-control-title">{{{ data.label }}}</label>
			<div class="qazana-control-input-wrapper">
				<input type="url" data-setting="url" placeholder="{{ data.placeholder }}" />
				<button class="qazana-control-url-target tooltip-target" data-tooltip="<?php _e( 'Open Link in new Tab', 'qazana' ); ?>" title="<?php esc_attr_e( 'Open Link in new Tab', 'qazana' ); ?>">
					<span class="qazana-control-url-external" title="<?php esc_attr_e( 'New Window', 'qazana' ); ?>"><i class="fa fa-external-link"></i></span>
				</button>
			</div>
		</div>
		<# if ( data.description ) { #>
		<div class="qazana-control-description">{{{ data.description }}}</div>
		<# } #>
		<?php
	}
}
