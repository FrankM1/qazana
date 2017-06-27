<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * An Image Dimensions control. Shows Width and Height inputs and an Apply button
 *
 * @param array  $default {
 * 		@type integer $width   Default empty
 * 		@type integer $height  Default empty
 * }
 *
 * @since 1.0.0
 */
class Control_Image_Dimensions extends Base_Control_Multiple {

	public function get_type() {
		return 'image_dimensions';
	}

	public function get_default_value() {
		return [
			'width' => '',
			'height' => '',
		];
	}

	protected function get_default_settings() {
		return [
			'label_block' => true,
			'show_label' => false,
		];
	}

	public function content_template() {
		if ( ! $this->_is_image_editor_supports() ) : ?>
		<div class="panel-alert panel-alert-danger">
			<?php _e( 'The server does not have ImageMagick or GD installed and/or enabled! Any of these libraries are required for WordPress to be able to resize images. Please contact your server administrator to enable this before continuing.', 'qazana' ); ?>
		</div>
		<?php
			return;
		endif;
		?>
		<# if ( data.description ) { #>
			<div class="qazana-control-description">{{{ data.description }}}</div>
		<# } #>
		<div class="qazana-control-field">
			<label class="qazana-control-title">{{{ data.label }}}</label>
			<div class="qazana-control-input-wrapper">
				<div class="qazana-image-dimensions-field">
					<input type="text" data-setting="width" />
					<div class="qazana-image-dimensions-field-description"><?php _e( 'Width', 'qazana' ); ?></div>
				</div>
				<div class="qazana-image-dimensions-separator">x</div>
				<div class="qazana-image-dimensions-field">
					<input type="text" data-setting="height" />
					<div class="qazana-image-dimensions-field-description"><?php _e( 'Height', 'qazana' ); ?></div>
				</div>
				<button class="qazana-button qazana-button-success qazana-image-dimensions-apply-button"><?php _e( 'Apply', 'qazana' ); ?></button>
			</div>
		</div>
		<?php
	}

	private function _is_image_editor_supports() {
		$arg = [ 'mime_type' => 'image/jpeg' ];
		return ( wp_image_editor_supports( $arg ) );
	}
}
