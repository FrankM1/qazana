<?php
namespace Builder;

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
		<div class="panel-alert panel-alert-danger">
			<?php _e( 'The server does not have ImageMagick or GD installed and/or enabled! Any of these libraries are required for WordPress to be able to resize images. Please contact your server administrator to enable this before continuing.', 'builder' ); ?>
		</div>
		<?php
			return;
		endif;
		?>
		<# if ( data.description ) { #>
			<div class="builder-control-description">{{{ data.description }}}</div>
		<# } #>
		<div class="builder-control-field">
			<label class="builder-control-title">{{{ data.label }}}</label>
			<div class="builder-control-input-wrapper">
				<div class="builder-image-dimensions-field">
					<input type="text" data-setting="width" />
					<div class="builder-image-dimensions-field-description"><?php _e( 'Width', 'builder' ); ?></div>
				</div>
				<div class="builder-image-dimensions-separator">x</div>
				<div class="builder-image-dimensions-field">
					<input type="text" data-setting="height" />
					<div class="builder-image-dimensions-field-description"><?php _e( 'Height', 'builder' ); ?></div>
				</div>
				<button class="builder-button builder-button-success builder-image-dimensions-apply-button"><?php _e( 'Apply', 'builder' ); ?></button>
			</div>
		</div>
		<?php
	}

	private function _is_image_editor_supports() {
		$arg = [ 'mime_type' => 'image/jpeg' ];
		return ( wp_image_editor_supports( $arg ) );
	}
}
