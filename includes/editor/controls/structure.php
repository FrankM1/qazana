<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Structure control.
 *
 * A base control for creating structure control. A private control for section
 * columns structure.
 *
 * Creating new control in the editor (inside `Widget_Base::_register_controls()`
 * method):
 *
 *    $this->add_control(
 *    	'structure',
 *    	[
 *    		'label' => __( 'Structure', 'plugin-domain' ),
 *    		'type' => Controls_Manager::STRUCTURE,
 *    		'default' => '10',
 *    		'render_type' => 'none',
 *    	]
 *    );
 *
 * @since 1.0.0
 *
 * @param string $label       Optional. The label that appears above of the
 *                            field. Default is empty.
 * @param string $description Optional. The description that appears below the
 *                            field. Default is empty.
 * @param int    $default     Optional. The field default value. Default is
 *                            empty.
 * @param string $separator   Optional. Set the position of the control separator.
 *                            Available values are 'default', 'before', 'after'
 *                            and 'none'. 'default' will position the separator
 *                            depending on the control type. 'before' / 'after'
 *                            will position the separator before/after the
 *                            control. 'none' will hide the separator. Default
 *                            is 'none'.
 * @param bool   $show_label  Optional. Whether to display the label. Default is
 *                            true.
 * @param bool   $label_block Optional. Whether to display the label in a
 *                            separate line. Default is true.
 */
class Control_Structure extends Base_Data_Control {

	/**
	 * Retrieve structure control type.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Control type.
	 */
	public function get_type() {
		return 'structure';
	}

	/**
	 * Render structure control output in the editor.
	 *
	 * Used to generate the control HTML in the editor using Underscore JS
	 * template. The variables for the class are available using `data` JS
	 * object.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function content_template() {
		$preset_control_uid = $this->get_control_uid( '{{ preset.key }}' );
		?>
		<div class="qazana-control-field">
			<div class="qazana-control-input-wrapper">
				<div class="qazana-control-structure-title"><?php _e( 'Structure', 'qazana' ); ?></div>
				<# var currentPreset = qazana.presetsFactory.getPresetByStructure( data.controlValue ); #>
				<div class="qazana-control-structure-preset qazana-control-structure-current-preset">
					{{{ qazana.presetsFactory.getPresetSVG( currentPreset.preset, 233, 72, 5 ).outerHTML }}}
				</div>
				<div class="qazana-control-structure-reset"><i class="fa fa-undo"></i><?php _e( 'Reset Structure', 'qazana' ); ?></div>
				<#
				var morePresets = getMorePresets();

				if ( morePresets.length > 1 ) { #>
					<div class="qazana-control-structure-more-presets-title"><?php _e( 'More Structures', 'qazana' ); ?></div>
					<div class="qazana-control-structure-more-presets">
						<# _.each( morePresets, function( preset ) { #>
							<div class="qazana-control-structure-preset-wrapper">
								<input id="<?php echo $preset_control_uid; ?>" type="radio" name="qazana-control-structure-preset-{{ data._cid }}" data-setting="structure" value="{{ preset.key }}">
								<label for="<?php echo $preset_control_uid; ?>" class="qazana-control-structure-preset">
									{{{ qazana.presetsFactory.getPresetSVG( preset.preset, 102, 42 ).outerHTML }}}
								</label>
								<div class="qazana-control-structure-preset-title">{{{ preset.preset.join( ', ' ) }}}</div>
							</div>
						<# } ); #>
					</div>
				<# } #>
			</div>
		</div>
		
		<# if ( data.description ) { #>
			<div class="qazana-control-field-description">{{{ data.description }}}</div>
		<# } #>
		<?php
	}

	/**
	 * Retrieve structure control default settings.
	 *
	 * Get the default settings of the structure control. Used to return the
	 * default settings while initializing the structure control.
	 *
	 * @since 1.0.0
	 * @access protected
	 *
	 * @return array Control default settings.
	 */
	protected function get_default_settings() {
		return [
			'separator' => 'none',
			'label_block' => true,
		];
	}
}
