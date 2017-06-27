<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * A Gallery creation control. Based on the WordPress media gallery creator
 *
 * @param array $default   The selected images array [ [ 'id' => ??, 'url' => ?? ], [ 'id' => ??, 'url' => ?? ], ... ]
 *                         Default empty array
 *
 * @since 1.0.0
 */
class Control_Gallery extends Base_Control {

	public function get_type() {
		return 'gallery';
	}

	public function on_import( $settings ) {
		foreach ( $settings as &$attachment ) {
			if ( empty( $attachment['url'] ) )
				continue;

			$attachment = qazana()->templates_manager->get_import_images_instance()->import( $attachment );
		}

		// Filter out attachments that don't exist
		$settings = array_filter( $settings );

		return $settings;
	}

	public function content_template() {
		?>
		<div class="qazana-control-field">
			<div class="qazana-control-input-wrapper">
				<# if ( data.description ) { #>
				<div class="qazana-control-description">{{{ data.description }}}</div>
				<# } #>
				<div class="qazana-control-media">
					<div class="qazana-control-gallery-status">
						<span class="qazana-control-gallery-status-title">
							<# if ( data.controlValue.length ) {
								print( qazana.translate( 'gallery_images_selected', [ data.controlValue.length ] ) );
							} else { #>
								<?php _e( 'No Images Selected', 'qazana' ); ?>
							<# } #>
						</span>
						<span class="qazana-control-gallery-clear">(<?php _e( 'Clear', 'qazana' ); ?>)</span>
					</div>
					<div class="qazana-control-gallery-thumbnails">
						<# _.each( data.controlValue, function( image ) { #>
							<div class="qazana-control-gallery-thumbnail" style="background-image: url({{ image.url }})"></div>
						<# } ); #>
					</div>
					<button class="qazana-button qazana-control-gallery-add"><?php _e( '+ Add Images', 'qazana' ); ?></button>
				</div>
			</div>
		</div>
		<?php
	}

	protected function get_default_settings() {
		return [
			'label_block' => true,
			'separator' => 'none',
		];
	}

	public function get_default_value() {
		return [];
	}
}
