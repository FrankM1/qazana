<?php
namespace Builder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
?>
<script type="text/template" id="tmpl-builder-empty-preview">
	<div class="builder-first-add">
		<div class="builder-icon eicon-plus"></div>
	</div>
</script>

<script type="text/template" id="tmpl-builder-preview">
	<div class="builder-section-wrap"></div>
	<div id="builder-add-section" class="builder-visible-desktop">
		<div id="builder-add-section-inner">
			<div id="builder-add-new-section">
				<button id="builder-add-section-button" class="builder-button"><?php _e( 'Add New Section', 'builder' ); ?></button>
				<button id="builder-add-template-button" class="builder-button"><?php _e( 'Add Template', 'builder' ); ?></button>
				<div id="builder-add-section-drag-title"><?php _e( 'Or drag widget here', 'builder' ); ?></div>
			</div>
			<div id="builder-select-preset">
				<div id="builder-select-preset-close">
					<i class="fa fa-times"></i>
				</div>
				<div id="builder-select-preset-title"><?php _e( 'Select your Structure', 'builder' ); ?></div>
				<ul id="builder-select-preset-list">
					<#
					var structures = [ 10, 20, 30, 40, 21, 22, 31, 32, 33, 50, 60, 34 ];

					_.each( structures, function( structure ) {
						var preset = builder.presetsFactory.getPresetByStructure( structure ); #>

						<li class="builder-preset builder-column builder-col-16" data-structure="{{ structure }}">
							{{{ builder.presetsFactory.getPresetSVG( preset.preset ).outerHTML }}}
						</li>
					<# } ); #>
				</ul>
			</div>
		</div>
	</div>
</script>
