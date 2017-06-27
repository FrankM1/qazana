<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * A UI only control. Show HTML markup between controls
 *
 * @param string $raw     The HTML markup
 *                        Default empty
 * @param string $classes Additional classes for the HTML wrapper
 *                        Default empty
 *
 * @since 1.0.0
 */
class Control_Raw_Html extends Base_Control {

	public function get_type() {
		return 'raw_html';
	}

	public function content_template() {
		?>
		<# if ( data.label ) { #>
		<span class="qazana-control-title">{{{ data.label }}}</span>
		<# } #>
		<div class="qazana-control-raw-html {{ data.classes }}">{{{ data.raw }}}</div>
		<?php
	}

	public function get_default_settings() {
		return [
			'classes' => '',
		];
	}
}
