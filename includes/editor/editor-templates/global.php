<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
?>
<script type="text/template" id="tmpl-qazana-empty-preview">
	<div class="qazana-first-add">
		<div class="qazana-icon eicon-plus"></div>
	</div>
</script>

<script type="text/template" id="tmpl-qazana-preview">
	<div class="qazana-section-wrap"></div>
</script>

<script type="text/template" id="tmpl-qazana-add-section">
	<div class="qazana-add-section-inner">
		<div class="qazana-add-section-close">
			<i class="eicon-close" aria-hidden="true"></i>
			<span class="qazana-screen-only"><?php _e( 'Close', 'qazana' ); ?></span>
		</div>
		<div class="qazana-add-new-section">
			<div class="qazana-add-section-area-button qazana-add-section-button" title="<?php _e( 'Add New Section', 'qazana' ); ?>">
                <i class="eicon-plus"></i>
                <?php _e( 'Add New Section', 'qazana' ); ?>
			</div>
			<div class="qazana-add-section-area-button qazana-add-template-button" title="<?php _e( 'Add Template', 'qazana' ); ?>">
                <i class="fa fa-folder"></i>
                <?php _e( 'Add Template', 'qazana' ); ?>
			</div>
			<div class="qazana-add-section-drag-title"><?php _e( 'Drag widget here', 'qazana' ); ?></div>
		</div>
		<div class="qazana-select-preset">
			<div class="qazana-select-preset-title"><?php _e( 'Select your Structure', 'qazana' ); ?></div>
			<ul class="qazana-select-preset-list">
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
</script>

<script type="text/template" id="tmpl-qazana-tag-controls-stack-empty">
	<?php _e( 'This tag has no settings.', 'qazana' ); ?>
</script>
