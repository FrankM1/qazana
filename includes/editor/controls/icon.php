<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Icon control.
 *
 * A base control for creating an icon control. Displays font icon select box.
 * Available icons are listed in @see Control_Icon::get_icons(). The control
 * accepts `include` or `exclude` arguments to set a partial list of icons.
 *
 * Creating new control in the editor (inside `Widget_Base::_register_controls()`
 * method):
 *
 *    $this->add_control(
 *    	'icon',
 *    	[
 *    		'label' => __( 'Social Icon', 'plugin-domain' ),
 *    		'type' => Controls_Manager::ICON,
 *    		'include' => [
 *    			'fa fa-facebook',
 *    			'fa fa-flickr',
 *    			'fa fa-google-plus',
 *    			'fa fa-instagram',
 *    			'fa fa-linkedin',
 *    			'fa fa-pinterest',
 *    			'fa fa-reddit',
 *    			'fa fa-twitch',
 *    			'fa fa-twitter',
 *    			'fa fa-vimeo',
 *    			'fa fa-youtube',
 *    		],
 *    	]
 *    );
 *
 * PHP usage (inside `Widget_Base::render()` method):
 *
 *    echo '<i class="' . esc_attr( $this->get_settings( 'icon' ) ) . '"></i>';
 *
 * JS usage (inside `Widget_Base::_content_template()` method):
 *
 *    <i class="{{ settings.icon }}"></i>
 *
 * @since 1.0.0
 *
 * @param string $label       Optional. The label that appears above of the
 *                            field. Default is empty.
 * @param string $description Optional. The description that appears below the
 *                            field. Default is empty.
 * @param string $default     Optional. Default icon name. Default is empty.
 * @param array  $options     Optional. An associative array of available icons.
 *                            `[ 'class-name' => 'nicename', ... ]`
 *                            Default is a list of Font Awesome icons @see Control_Icon::get_icons()
 * @param array  $include     Optional. An array of icon classes to include in
 *                            the options list. Default is an empty array.
 * @param array  $exclude     Optional. An array of icon classes to exclude from
 *                            the options list. Default is an empty array.
 * @param string $separator   Optional. Set the position of the control separator.
 *                            Available values are 'default', 'before', 'after'
 *                            and 'none'. 'default' will position the separator
 *                            depending on the control type. 'before' / 'after'
 *                            will position the separator before/after the
 *                            control. 'none' will hide the separator. Default
 *                            is 'default'.
 * @param bool   $show_label  Optional. Whether to display the label. Default is
 *                            true.
 * @param bool   $label_block Optional. Whether to display the label in a
 *                            separate line. Default is false.
 */
class Control_Icon extends Base_Data_Control {

	/**
	 * Retrieve icon control type.
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
	 * Retrieve icons control default settings.
	 *
	 * Get the default settings of the icons control. Used to return the default
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
		?>
		<div class="qazana-control-field">
			<label class="qazana-control-title">{{{ data.label }}}</label>
			<div class="qazana-control-input-wrapper">
				<select class="qazana-control-icon" data-setting="{{ data.name }}" data-placeholder="<?php _e( 'Select an Icon', 'qazana' ); ?>">
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
