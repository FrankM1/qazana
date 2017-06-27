<?php
namespace Builder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * A File Chooser control. Based on the WordPress file library
 *
 * @param array  $default {
 * 		@type string  $url   Default empty
 * 		@type integer $id    Default empty
 * }
 *
 * @since 1.0.0
 */
class Control_File extends Base_Control_Multiple {

	public function get_type() {
		return 'file';
	}

	public function get_default_value() {
		return [
			'url' => '',
			'id' => '',
		];
	}

	/**
	 * Fetch images and replace to new
	 *
	 * @param $settings
	 *
	 * @return array|bool
	 */
	public function on_import( $settings ) {

		if ( empty( $settings['url'] ) ) {
			return $settings;
		}

		$settings = builder()->templates_manager->get_import_images_instance()->import( $settings );

		if ( ! $settings ) {
			$settings = [
				'id' => '',
				'url' => '',
			];
		}

		return $settings;
	}

	public function enqueue() {
		$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';
		wp_enqueue_media();

		wp_enqueue_style(
			'media',
			admin_url( '/css/media' . $suffix . '.css' )
		);

		wp_register_script(
			'image-edit',
			admin_url( '/js/image-edit' . $suffix . '.js' ),
			[
				'jquery',
				'json2',
				'imgareaselect',
			],
			false,
			true
		);

		wp_enqueue_script( 'image-edit' );
	}

	public function content_template() {
		?>
		<div class="builder-control-field">
			<label class="builder-control-title">{{{ data.label }}}</label>
			<div class="builder-control-input-wrapper">
				<div class="builder-control-file">
					<div class="builder-control-file-upload-button">
						<i class="fa fa-plus-circle"></i>
					</div>
					<div class="builder-control-file-image-area">
						<div class="builder-control-file-image" style="background-image: url({{ data.controlValue.url }});"></div>
						<div class="builder-control-file-delete"><?php _e( 'Delete', 'builder' ); ?></div>
					</div>
				</div>
			</div>
			<# if ( data.description ) { #>
				<div class="builder-control-description">{{{ data.description }}}</div>
			<# } #>
			<input type="hidden" data-setting="{{ data.name }}" />
		</div>
		<?php
	}

	protected function get_default_settings() {
		return [
			'label_block' => true,
		];
	}

	public static function get_file_title( $instance ) {
		if ( empty( $instance['id'] ) )
			return '';

		$attachment_id = $instance['id'];
		if ( ! $attachment_id )
			return '';

		return get_the_title( $attachment_id );
	}

	public static function get_image_alt( $instance ) {
		if ( empty( $instance['id'] ) )
			return '';

		$attachment_id = $instance['id'];
		if ( ! $attachment_id )
			return '';

		$attachment = get_post( $attachment_id );
		if ( ! $attachment )
			return '';

		$alt = get_post_meta( $attachment_id, '_wp_attachment_image_alt', true );
		if ( ! $alt ) {
			$alt = $attachment->post_excerpt;
			if ( ! $alt ) {
				$alt = $attachment->post_title;
			}
		}
		return trim( strip_tags( $alt ) );
	}
}
