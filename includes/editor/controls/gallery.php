<?php
namespace Qazana;

use Qazana\Extensions\DynamicTags as TagsModule;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Qazana gallery control.
 *
 * A base control for creating gallery chooser control. Based on the WordPress
 * media library galleries. Used to select images from the WordPress media library.
 *
 * @since 1.0.0
 */
class Control_Gallery extends Base_Data_Control {

	/**
	 * Get gallery control type.
	 *
	 * Retrieve the control type, in this case `gallery`.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Control type.
	 */
	public function get_type() {
		return 'gallery';
	}

	/**
	 * Import gallery images.
	 *
	 * Used to import gallery control files from external sites while importing
	 * Qazana template JSON file, and replacing the old data.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param array $settings Control settings
	 *
	 * @return array Control settings.
	 */
	public function on_import( $settings ) {
		foreach ( $settings as &$attachment ) {
			if ( empty( $attachment['url'] ) ) {
				continue;
			}

			$attachment = qazana()->get_templates_manager()->get_import_images_instance()->import( $attachment );
		}

		// Filter out attachments that don't exist
		$settings = array_filter( $settings );

		return $settings;
	}

	/**
	 * Render gallery control output in the editor.
	 *
	 * Used to generate the control HTML in the editor using Underscore JS
	 * template. The variables for the class are available using `data` JS
	 * object.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function content_template() {
		?>
		<div class="qazana-control-field">
			<div class="qazana-control-title">{{{ data.label }}}</div>
			<div class="qazana-control-input-wrapper">
				<# if ( data.description ) { #>
				<div class="qazana-control-field-description">{{{ data.description }}}</div>
				<# } #>
				<div class="qazana-control-media qazana-control-tag-area">
					<div class="qazana-control-gallery-status">
						<span class="qazana-control-gallery-status-title"></span>
						<span class="qazana-control-gallery-clear">(<?php _e( 'Clear', 'qazana' ); ?>)</span>
					</div>
					<div class="qazana-control-gallery-thumbnails"></div>
					<button class="qazana-button qazana-control-gallery-add"><?php _e( 'Add Images', 'qazana' ); ?></button>
				</div>
			</div>
		</div>
		<?php
	}

	/**
	 * Get gallery control default settings.
	 *
	 * Retrieve the default settings of the gallery control. Used to return the
	 * default settings while initializing the gallery control.
	 *
	 * @since 1.0.0
	 * @access protected
	 *
	 * @return array Control default settings.
	 */
	protected function get_default_settings() {
		return [
			'label_block' => true,
			'separator' => 'none',
			'dynamic' => [
				'categories' => [ TagsModule::GALLERY_CATEGORY ],
				'returnType' => 'object',
			],
		];
	}

	/**
	 * Get gallery control default values.
	 *
	 * Retrieve the default value of the gallery control. Used to return the default
	 * values while initializing the gallery control.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return array Control default value.
	 */
	public function get_default_value() {
		return [];
	}
}
