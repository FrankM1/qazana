<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
/**
 * A font select box control. The list is based on Google Fonts project (@see https://fonts.google.com/)
 *
 * @param string $default   The selected font name
 *                          Default empty
 * @param array $fonts      All available fonts
 *                          Default @see Fonts::get_fonts()
 *
 * @since 1.0.0
 */
class Control_Font extends Base_Data_Control {

	public function get_type() {
		return 'font';
	}

	protected function get_default_settings() {
		return [
			'fonts' => Fonts::get_fonts(),
		];
	}

	public function content_template() {
		$control_uid = $this->get_control_uid();
		?>
		<div class="qazana-control-field">
			<label for="<?php echo $control_uid; ?>" class="qazana-control-title">{{{ data.label }}}</label>
			<div class="qazana-control-input-wrapper">
				<select id="<?php echo $control_uid; ?>" class="qazana-control-font-family" data-setting="{{ data.name }}">
					<option value=""><?php _e( 'Default', 'qazana' ); ?></option>
					<optgroup label="<?php _e( 'System', 'qazana' ); ?>">
						<# _.each( getFontsByGroups( 'system' ), function( fontType, fontName ) { #>
						<option value="{{ fontName }}">{{{ fontName }}}</option>
						<# } ); #>
					</optgroup>
					<?php /*
					<optgroup label="<?php _e( 'Local', 'qazana' ); ?>">
						<# _.each( getFontsByGroups( 'local' ), function( fontType, fontName ) { #>
						<option value="{{ fontName }}">{{{ fontName }}}</option>
						<# } ); #>
					</optgroup> */ ?>
					<optgroup label="<?php _e( 'Google', 'qazana' ); ?>">
						<# _.each( getFontsByGroups( [ 'googlefonts', 'earlyaccess' ] ), function( fontType, fontName ) { #>
						<option value="{{ fontName }}">{{{ fontName }}}</option>
						<# } ); #>
					</optgroup>
				</select>
			</div>
		</div>
		<# if ( data.description ) { #>
		<div class="qazana-control-description">{{{ data.description }}}</div>
		<# } #>
		<?php
	}
}
