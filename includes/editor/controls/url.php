<?php
namespace Qazana;

use Qazana\Extensions\DynamicTags as TagsModule;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Qazana URL control.
 *
 * A base control for creating url control. Displays a URL input with the
 * ability to set the target of the link to `_blank` to open in a new tab.
 *
 * @since 1.0.0
 */
class Control_URL extends Control_Base_Multiple {

	/**
	 * Get url control type.
	 *
	 * Retrieve the control type, in this case `url`.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Control type.
	 */
	public function get_type() {
		return 'url';
	}

	/**
	 * Get url control default values.
	 *
	 * Retrieve the default value of the url control. Used to return the default
	 * values while initializing the url control.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return array Control default value.
	 */
	public function get_default_value() {
		return [
			'url' => '',
			'is_external' => '',
			'nofollow' => '',
		];
	}

	/**
	 * Get url control default settings.
	 *
	 * Retrieve the default settings of the url control. Used to return the default
	 * settings while initializing the url control.
	 *
	 * @since 1.0.0
	 * @access protected
	 *
	 * @return array Control default settings.
	 */
	protected function get_default_settings() {
		return [
			'label_block' => true,
			'show_external' => true,
			'placeholder' => __( 'Paste URL or type', 'qazana' ),
			'dynamic' => [
				'categories' => [ TagsModule::URL_CATEGORY ],
				'property' => 'url',
			],
		];
	}

	/**
	 * Render url control output in the editor.
	 *
	 * Used to generate the control HTML in the editor using Underscore JS
	 * template. The variables for the class are available using `data` JS
	 * object.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function content_template() {
		$control_uid = $this->get_control_uid();

		$more_input_control_uid = $this->get_control_uid( 'more-input' );

		$is_external_control_uid = $this->get_control_uid( 'is_external' );

		$nofollow_control_uid = $this->get_control_uid( 'nofollow' );
		?>
		<div class="qazana-control-field qazana-control-url-external-{{{ data.show_external ? 'show' : 'hide' }}}">
			<label for="<?php echo $control_uid; ?>" class="qazana-control-title">{{{ data.label }}}</label>
			<div class="qazana-control-input-wrapper">
				<i class="qazana-control-url-autocomplete-spinner fa fa-spin fa-circle-o-notch" aria-hidden="true"></i>
				<input id="<?php echo $control_uid; ?>" class="qazana-control-tag-area qazana-input" data-setting="url" placeholder="{{ data.placeholder }}" />
				<input id="_ajax_linking_nonce" type="hidden" value="<?php echo wp_create_nonce( 'internal-linking' ); ?>" />

				<label for="<?php echo $more_input_control_uid; ?>" class="qazana-control-url-more tooltip-target" data-tooltip="<?php _e( 'Link Options', 'qazana' ); ?>">
					<i class="fa fa-cog" aria-hidden="true"></i>
				</label>
				<input id="<?php echo $more_input_control_uid; ?>" type="checkbox" class="qazana-control-url-more-input">
				<div class="qazana-control-url-more-options">
					<div class="qazana-control-url-option">
						<input id="<?php echo $is_external_control_uid; ?>" type="checkbox" class="qazana-control-url-option-input" data-setting="is_external">
						<label for="<?php echo $is_external_control_uid; ?>"><?php _e( 'Open in new window', 'qazana' ); ?></label>
					</div>
					<div class="qazana-control-url-option">
						<input id="<?php echo $nofollow_control_uid; ?>" type="checkbox" class="qazana-control-url-option-input" data-setting="nofollow">
						<label for="<?php echo $nofollow_control_uid; ?>"><?php _e( 'Add nofollow', 'qazana' ); ?></label>
					</div>
				</div>
			</div>
		</div>
		<# if ( data.description ) { #>
		<div class="qazana-control-field-description">{{{ data.description }}}</div>
		<# } #>
		<?php
	}
}
