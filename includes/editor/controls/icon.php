<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Qazana icon control.
 *
 * A base control for creating an icon control. Displays a font icon select box
 * field. The control accepts `include` or `exclude` arguments to set a partial
 * list of icons.
 *
 * @since 1.0.0
 */
class Control_Icon extends Base_Data_Control {

	/**
	 * Get icon control type.
	 *
	 * Retrieve the control type, in this case `icon`.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Control type.
	 */
	public function get_type() {
		return 'icon';
	}

    public function get_icons() {
		return qazana()->icons_manager->get_all_iconsets();
    }

	/**
	 * Get icons control default settings.
	 *
	 * Retrieve the default settings of the icons control. Used to return the default
	 * settings while initializing the icons control.
	 *
	 * @since 1.0.0
	 * @access protected
	 *
	 * @return array Control default settings.
	 */
	protected function get_default_settings() {
		return [
			'options' => $this->get_icons(),
            'include' => '',
			'exclude' => '',
		];
	}

	/**
	 * Render icons control output in the editor.
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
		?>
		<div class="qazana-control-field">
			<label for="<?php echo $control_uid; ?>" class="qazana-control-title">{{{ data.label }}}</label>
			<div class="qazana-control-input-wrapper">
				<select  id="<?php echo $control_uid; ?>" class="qazana-control-icon" data-setting="{{ data.name }}" data-placeholder="<?php _e( 'Select an Icon', 'qazana' ); ?>">
                    <option value=""><?php _e( 'Select an Icon', 'qazana' ); ?></option>
                    <?php foreach ( $this->get_icons() as $group => $iconset ) {
                        if ( empty( $iconset ) ) continue; ?>
                        <optgroup label="<?php echo ucfirst( str_replace( "-", " ", $group) ); ?>">
                            <?php foreach ( $iconset as $key => $value ) { ?>
        					<option value="<?php echo $key; ?>"><?php echo ucfirst( str_replace( "-", " ", $value) ); ?></option>
        					 <?php } ?>
                        </optgroup>
                    <?php } ?>
				</select>
			</div>
		</div>
		<# if ( data.description ) { #>
		<div class="qazana-control-field-description">{{ data.description }}</div>
		<# } #>
		<?php
	}
}
