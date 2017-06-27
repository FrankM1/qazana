<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
?>
<script type="text/template" id="tmpl-qazana-empty-preview">
	<div class="qazana-first-add">
		<div class="qazana-icon eicon-plus"></div>
	</div>
</script>

<script type="text/template" id="tmpl-qazana-preview">
	<div class="qazana-section-wrap"></div>
	<div id="qazana-add-section" class="qazana-visible-desktop">
		<div id="qazana-add-section-inner">
			<div id="qazana-add-new-section">
				<button id="qazana-add-section-button" class="qazana-button"><?php _e( 'Add New Section', 'qazana' ); ?></button>
				<button id="qazana-add-template-button" class="qazana-button"><?php _e( 'Add Template', 'qazana' ); ?></button>
				<div id="qazana-add-section-drag-title"><?php _e( 'Or drag widget here', 'qazana' ); ?></div>
			</div>
			<div id="qazana-select-preset">
				<div id="qazana-select-preset-close">
					<i class="fa fa-times"></i>
				</div>
				<div id="qazana-select-preset-title"><?php _e( 'Select your Structure', 'qazana' ); ?></div>
				<ul id="qazana-select-preset-list">
					<#
					var structures = [ 10, 20, 30, 40, 21, 22, 31, 32, 33, 50, 60, 34 ];

					_.each( structures, function( structure ) {
						var preset = qazana.presetsFactory.getPresetByStructure( structure ); #>

						<li class="qazana-preset qazana-column qazana-col-16" data-structure="{{ structure }}">
							{{{ qazana.presetsFactory.getPresetSVG( preset.preset ).outerHTML }}}
						</li>
					<# } ); #>
				</ul>
			</div>
		</div>
	</div>
</script>
