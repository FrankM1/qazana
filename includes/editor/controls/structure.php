<?php
namespace Builder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * A private control for section columns structure.
 *
 * @since 1.0.0
 */
class Control_Structure extends Base_Control {

	public function get_type() {
		return 'structure';
	}

	public function content_template() {
		?>
		<div class="builder-control-field">
			<div class="builder-control-input-wrapper">
				<div class="builder-control-structure-title"><?php _e( 'Structure', 'builder' ); ?></div>
				<# var currentPreset = builder.presetsFactory.getPresetByStructure( data.controlValue ); #>
				<div class="builder-control-structure-preset builder-control-structure-current-preset">
					{{{ builder.presetsFactory.getPresetSVG( currentPreset.preset, 233, 72, 5 ).outerHTML }}}
				</div>
				<div class="builder-control-structure-reset"><i class="fa fa-undo"></i><?php _e( 'Reset Structure', 'builder' ); ?></div>
				<#
				var morePresets = getMorePresets();

				if ( morePresets.length > 1 ) { #>
					<div class="builder-control-structure-more-presets-title"><?php _e( 'More Structures', 'builder' ); ?></div>
					<div class="builder-control-structure-more-presets">
						<# _.each( morePresets, function( preset ) { #>
							<div class="builder-control-structure-preset-wrapper">
								<input id="builder-control-structure-preset-{{ data._cid }}-{{ preset.key }}" type="radio" name="builder-control-structure-preset-{{ data._cid }}" data-setting="structure" value="{{ preset.key }}">
								<label class="builder-control-structure-preset" for="builder-control-structure-preset-{{ data._cid }}-{{ preset.key }}">
									{{{ builder.presetsFactory.getPresetSVG( preset.preset, 102, 42 ).outerHTML }}}
								</label>
								<div class="builder-control-structure-preset-title">{{{ preset.preset.join( ', ' ) }}}</div>
							</div>
						<# } ); #>
					</div>
				<# } #>
			</div>
		</div>
		
		<# if ( data.description ) { #>
			<div class="builder-control-description">{{{ data.description }}}</div>
		<# } #>
		<?php
	}

	protected function get_default_settings() {
		return [
			'separator' => 'none',
		];
	}
}
