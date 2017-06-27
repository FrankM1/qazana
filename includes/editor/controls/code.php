<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * A Code Editor control based on Ace editor. @see https://ace.c9.io/
 *
 * @param string $default        Default code editor content
 * @param array  $language       Any language(mode) supported by Ace editor. @see https://ace.c9.io/build/kitchen-sink.html
 *                               Default 'html'
 *
 * @since 1.0.0
 */
class Control_Code extends Base_Control {

	public function get_type() {
		return 'code';
	}

	protected function get_default_settings() {
		return [
			'label_block' => true,
			'language' => 'html', // html/css
		];
	}

	public function content_template() {
		?>
		<div class="qazana-control-field">
			<label class="qazana-control-title">{{{ data.label }}}</label>
			<div class="qazana-control-input-wrapper">
				<textarea rows="10" class="qazana-input-style qazana-code-editor" data-setting="{{ data.name }}"></textarea>
			</div>
		</div>
		<# if ( data.description ) { #>
			<div class="qazana-control-description">{{{ data.description }}}</div>
		<# } #>
		<?php
	}
}
