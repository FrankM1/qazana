<?php
namespace Builder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
?>
<script type="text/template" id="tmpl-builder-template-library-header">
	<div id="builder-template-library-header-logo-area"></div>
	<div id="builder-template-library-header-menu-area"></div>
	<div id="builder-template-library-header-search-area"></div>
	<div id="builder-template-library-header-items-area">
		<div id="builder-template-library-header-close-modal" class="builder-template-library-header-item" title="<?php _e( 'Close', 'builder' ); ?>">
			<i class="eicon-close" title="<?php _e( 'Close', 'builder' ); ?>"></i>
		</div>
		<div id="builder-template-library-header-tools"></div>
	</div>
</script>

<script type="text/template" id="tmpl-builder-template-library-header-logo">
	<i class="eicon-builder-square"></i><span><?php _e( 'Library', 'builder' ); ?></span>
</script>

<script type="text/template" id="tmpl-builder-template-library-header-save">
	<i class="eicon-save" title="<?php _e( 'Save Template', 'builder' ); ?>"></i>
</script>

<script type="text/template" id="tmpl-builder-template-library-header-menu">
    <div id="builder-template-library-menu-pre-made-templates" class="builder-template-library-menu-item" data-template-source="theme"><?php _e( 'Theme  Templates', 'builder' ); ?></div>
    <div id="builder-template-library-menu-pre-made-templates" class="builder-template-library-menu-item" data-template-source="remote"><?php _e( 'Predesigned Templates', 'builder' ); ?></div>
    <div id="builder-template-library-menu-my-templates" class="builder-template-library-menu-item" data-template-source="local"><?php _e( 'Saved Templates', 'builder' ); ?></div>
</script>

<script type="text/template" id="tmpl-builder-template-library-header-preview">
	<div id="builder-template-library-header-preview-insert-wrapper" class="builder-template-library-header-item">
	</div>
</script>

<script type="text/template" id="tmpl-builder-template-library-header-preview-insert-button">
	<button id="builder-template-library-header-preview-insert" class="builder-template-library-template-insert builder-button builder-button-success">
		<i class="eicon-file-download"></i><span class="builder-button-title"><?php _e( 'Insert', 'builder' ); ?></span>
	</button>
</script>

<script type="text/template" id="tmpl-builder-template-library-header-back">
	<i class="eicon-"></i><span><?php _e( 'Back To library', 'builder' ); ?></span>
</script>

<script type="text/template" id="tmpl-builder-template-library-header-search">
	<input id="builder-template-library-header-search-input-text" placeholder="<?php _e( 'Search Widget...', 'builder' ); ?>" />
	<i class="fa fa-search"></i>
	<div id="builder-template-library-header-search-input-clear"><i class="eicon-close"></i></div>
</script>

<script type="text/template" id="tmpl-builder-template-library-loading">
	<?php echo builder_loading_indicator(); ?>
</script>

<script type="text/template" id="tmpl-builder-template-library-templates">
	<div id="builder-template-library-templates-container"></div>
	<div id="builder-template-library-footer-banner">
		<i class="eicon-nerd"></i>
		<div class="builder-excerpt"><?php echo __( 'Stay tuned! More awesome templates coming real soon.', 'builder' ); ?></div>
	</div>
</script>

<script type="text/template" id="tmpl-builder-template-library-template-theme">
    <div class="builder-template-library-template-body">
        <div class="builder-template-library-template-screenshot" style="background-image: url({{ thumbnail }});"></div>
        <div class="builder-template-library-template-controls">
            <div class="builder-template-library-template-preview">
                <i class="fa fa-search-plus"></i>
            </div>
            <button class="builder-template-library-template-insert builder-button builder-button-success">
                <i class="eicon-file-download"></i>
                <?php _e( 'Insert', 'builder' ); ?>
            </button>
        </div>
    </div>
    <div class="builder-template-library-template-name">{{{ title }}}</div>
</script>

<script type="text/template" id="tmpl-builder-template-library-insert-button">
	<button class="builder-template-library-template-insert builder-button builder-button-success" data-action="insert">
		<i class="eicon-file-download"></i><span class="builder-button-title"><?php _e( 'Insert', 'builder' ); ?></span>
	</button>
</script>


<script type="text/template" id="tmpl-builder-template-library-template-remote">
	<div class="builder-template-library-template-body">
		<div class="builder-template-library-template-screenshot" style="background-image: url({{ thumbnail }});"></div>
		<div class="builder-template-library-template-controls">
			<div class="builder-template-library-template-preview">
				<i class="fa fa-search-plus"></i>
			</div>
			<button class="builder-template-library-template-insert builder-button builder-button-success">
				<i class="eicon-file-download"></i>
				<?php _e( 'Insert', 'builder' ); ?>
			</button>
		</div>
	</div>
	<div class="builder-template-library-template-name">{{{ title }}}</div>
</script>


<script type="text/template" id="tmpl-builder-template-library-template-local">
	<div class="builder-template-library-template-icon">
		<i class="fa fa-{{ 'section' === type ? 'columns' : 'file-text-o' }}"></i>
	</div>
	<div class="builder-template-library-template-name">{{{ title }}}</div>
	<div class="builder-template-library-template-type">{{{ builder.translate( type ) }}}</div>
	<div class="builder-template-library-template-controls">
		<button class="builder-template-library-template-insert builder-button builder-button-success" data-action="insert">
			<i class="eicon-file-download"></i><span class="builder-button-title"><?php _e( 'Insert', 'builder' ); ?></span>
		</button>
		<div class="builder-template-library-template-export">
			<a href="{{ export_link }}">
				<i class="fa fa-sign-out"></i><span class="builder-template-library-template-control-title"><?php echo __( 'Export', 'builder' ); ?></span>
			</a>
		</div>
		<div class="builder-template-library-template-delete">
			<i class="fa fa-trash-o"></i><span class="builder-template-library-template-control-title"><?php echo __( 'Delete', 'builder' ); ?></span>
		</div>
		<div class="builder-template-library-template-preview">
			<i class="eicon-zoom-in"></i><span class="builder-template-library-template-control-title"><?php echo __( 'Preview', 'builder' ); ?></span>
		</div>
	</div>
</script>

<script type="text/template" id="tmpl-builder-template-library-save-template">
    <div class="builder-template-library-blank-title">{{{ title }}}</div>
    <div class="builder-template-library-blank-excerpt">{{{ description }}}</div>
    <form id="builder-template-library-save-template-form">
        <input id="builder-template-library-save-template-name" name="title" placeholder="<?php _e( 'Enter Template Name', 'builder' ); ?>" required>
        <button id="builder-template-library-save-template-submit" class="builder-button builder-button-success">
            <span class="builder-state-icon">
                <i class="fa fa-spin fa-circle-o-notch "></i>
            </span>
            <?php _e( 'Save', 'builder' ); ?>
        </button>
    </form>
</script>

<script type="text/template" id="tmpl-builder-template-library-import">
    <form id="builder-template-library-import-form">
        <input type="file" name="file" />
        <input type="submit">
    </form>
</script>

<script type="text/template" id="tmpl-builder-template-library-templates-empty">
    <div id="builder-template-library-templates-empty-icon">
        <i class="eicon-nerd"></i>
    </div>
    <div class="builder-template-library-blank-title"><?php _e( 'Haven’t Saved Templates Yet?', 'builder' ); ?></div>
    <div class="builder-template-library-blank-excerpt"><?php _e( 'This is where your templates should be. Design it. Save it. Reuse it.', 'builder' ); ?></div>

</script>

<script type="text/template" id="tmpl-builder-template-library-preview">
	<iframe></iframe>
</script>
