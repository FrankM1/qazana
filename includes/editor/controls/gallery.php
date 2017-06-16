<?php
namespace Builder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * A Gallery creation control. Based on the WordPress media gallery creator
 *
 * @param array $default   The selected images array [ [ 'id' => ??, 'url' => ?? ], [ 'id' => ??, 'url' => ?? ], ... ]
 *                         Default empty array
 *
 * @since 1.0.0
 */
class Control_Gallery extends Control_Base {

	public function get_type() {
		return 'gallery';
	}

	public function on_import( $settings ) {
		foreach ( $settings as &$attachment ) {
			if ( empty( $attachment['url'] ) )
				continue;

			$attachment = builder()->templates_manager->get_import_images_instance()->import( $attachment );
		}

		// Filter out attachments that don't exist
		$settings = array_filter( $settings );

		return $settings;
	}

	public function content_template() {
		?>
		<div class="builder-control-field">
			<div class="builder-control-input-wrapper">
				<# if ( data.description ) { #>
				<div class="builder-control-description">{{{ data.description }}}</div>
				<# } #>
				<div class="builder-control-media">
					<div class="builder-control-gallery-status">
						<span class="builder-control-gallery-status-title">
							<# if ( data.controlValue.length ) {
								print( builder.translate( 'gallery_images_selected', [ data.controlValue.length ] ) );
							} else { #>
								<?php _e( 'No Images Selected', 'builder' ); ?>
							<# } #>
						</span>
						<span class="builder-control-gallery-clear">(<?php _e( 'Clear', 'builder' ); ?>)</span>
					</div>
					<div class="builder-control-gallery-thumbnails">
						<# _.each( data.controlValue, function( image ) { #>
							<div class="builder-control-gallery-thumbnail" style="background-image: url({{ image.url }})"></div>
						<# } ); #>
					</div>
					<button class="builder-button builder-control-gallery-add"><?php _e( '+ Add Images', 'builder' ); ?></button>
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
