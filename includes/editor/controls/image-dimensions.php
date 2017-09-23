<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * An Image Dimensions control. Shows Width and Height inputs and an Apply button
 *
 * @param array  $default {
 *      @type integer $width   Default empty
 *      @type integer $height  Default empty
 * }
 *
 * @since 1.0.0
 */
class Control_Image_Dimensions extends Control_Base_Multiple {

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
			<div class="qazana-panel-alert qazana-panel-alert-danger">
				<?php _e( 'The server does not have ImageMagick or GD installed and/or enabled! Any of these libraries are required for WordPress to be able to resize images. Please contact your server administrator to enable this before continuing.', 'qazana' ); ?>
			</div>
		<?php
			return;
		endif;
		?>
		<# if ( data.description ) { #>
			<div class="qazana-control-field-description">{{{ data.description }}}</div>
		<# } #>
		<div class="qazana-control-field">
			<label class="qazana-control-title">{{{ data.label }}}</label>
			<div class="qazana-control-input-wrapper">
				<div class="qazana-image-dimensions-field">
					<?php $control_uid = $this->get_control_uid( 'width' ); ?>
					<input id="<?php echo $control_uid; ?>" type="text" data-setting="width" />
					<label for="<?php echo $control_uid; ?>" class="qazana-image-dimensions-field-description"><?php _e( 'Width', 'qazana' ); ?></label>
				</div>
				<div class="qazana-image-dimensions-separator">x</div>
				<div class="qazana-image-dimensions-field">
					<?php $control_uid = $this->get_control_uid( 'height' ); ?>
					<input id="<?php echo $control_uid; ?>" type="text" data-setting="height" />
					<label for="<?php echo $control_uid; ?>" class="qazana-image-dimensions-field-description"><?php _e( 'Height', 'qazana' ); ?></label>
				</div>
				<button class="qazana-button qazana-button-success qazana-image-dimensions-apply-button"><?php _e( 'Apply', 'qazana' ); ?></button>
			</div>
		</div>
		<?php
	}

	private function _is_image_editor_supports() {
		$arg = [
			'mime_type' => 'image/jpeg',
		];
		return ( wp_image_editor_supports( $arg ) );
	}
}
