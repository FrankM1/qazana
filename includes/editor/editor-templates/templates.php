<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
?>
<script type="text/template" id="tmpl-qazana-template-library-header">
	<div id="qazana-template-library-header-logo-area"></div>
	<div id="qazana-template-library-header-menu-area"></div>
	<div id="qazana-template-library-header-search-area"></div>
	<div id="qazana-template-library-header-items-area">
		<div id="qazana-template-library-header-close-modal" class="qazana-template-library-header-item" title="<?php _e( 'Close', 'qazana' ); ?>">
			<i class="eicon-close" title="<?php _e( 'Close', 'qazana' ); ?>"></i>
		</div>
		<div id="qazana-template-library-header-tools"></div>
		<div id="qazana-template-library-header-import"></div>
	</div>
</script>

<script type="text/template" id="tmpl-qazana-template-library-header-logo">
	<i class="eicon-qazana-square"></i><span><?php _e( 'Library', 'qazana' ); ?></span>
</script>

<script type="text/template" id="tmpl-qazana-template-library-header-save">
	<i class="eicon-save" title="<?php _e( 'Save Template', 'qazana' ); ?>"></i>
</script>

<script type="text/template" id="tmpl-qazana-template-library-header-import">
	<i class="fa fa-upload" title="<?php _e( 'Import Template', 'qazana' ); ?>"></i>
</script>

<script type="text/template" id="tmpl-qazana-template-library-header-menu">
    <div id="qazana-template-library-menu-pre-made-templates" class="qazana-template-library-menu-item" data-template-source="theme"><?php _e( 'Theme  Templates', 'qazana' ); ?></div>
    <div id="qazana-template-library-menu-pre-made-templates" class="qazana-template-library-menu-item" data-template-source="remote"><?php _e( 'Predesigned Templates', 'qazana' ); ?></div>
    <div id="qazana-template-library-menu-my-templates" class="qazana-template-library-menu-item" data-template-source="local"><?php _e( 'Saved Templates', 'qazana' ); ?></div>
</script>

<script type="text/template" id="tmpl-qazana-template-library-header-preview">
	<div id="qazana-template-library-header-preview-insert-wrapper" class="qazana-template-library-header-item">
	</div>
</script>

<script type="text/template" id="tmpl-qazana-template-library-header-preview-insert-button">
	<button id="qazana-template-library-header-preview-insert" class="qazana-template-library-template-insert qazana-button qazana-button-success">
		<i class="eicon-file-download"></i><span class="qazana-button-title"><?php _e( 'Insert', 'qazana' ); ?></span>
	</button>
</script>

<script type="text/template" id="tmpl-qazana-template-library-header-back">
	<i class="eicon-"></i><span><?php _e( 'Back To library', 'qazana' ); ?></span>
</script>

<script type="text/template" id="tmpl-qazana-template-library-header-search">
	<input id="qazana-template-library-header-search-input-text" placeholder="<?php _e( 'Search...', 'qazana' ); ?>" />
	<i class="fa fa-search"></i>
	<div id="qazana-template-library-header-search-input-clear"><i class="eicon-close"></i></div>
</script>

<script type="text/template" id="tmpl-qazana-template-library-loading">
	<?php echo qazana_loading_indicator(); ?>
</script>

<script type="text/template" id="tmpl-qazana-template-library-templates">
	<div id="qazana-template-library-templates-container"></div>
	<div id="qazana-template-library-footer-banner">
		<i class="eicon-nerd"></i>
		<div class="qazana-excerpt"><?php echo __( 'Stay tuned! More awesome templates coming real soon.', 'qazana' ); ?></div>
	</div>
</script>

<script type="text/template" id="tmpl-qazana-template-library-template-theme">
    <div class="qazana-template-library-template-body">
        <div class="qazana-template-library-template-screenshot" style="background-image: url({{ thumbnail }});"></div>
        <div class="qazana-template-library-template-controls">
            <div class="qazana-template-library-template-preview">
                <i class="fa fa-search-plus"></i>
            </div>
            <button class="qazana-template-library-template-insert qazana-button qazana-button-success">
                <i class="eicon-file-download"></i>
                <?php _e( 'Insert', 'qazana' ); ?>
            </button>
        </div>
    </div>
    <div class="qazana-template-library-template-name">{{{ title }}}</div>
</script>

<script type="text/template" id="tmpl-qazana-template-library-insert-button">
	<button class="qazana-template-library-template-insert qazana-button qazana-button-success" data-action="insert">
		<i class="eicon-file-download"></i><span class="qazana-button-title"><?php _e( 'Insert', 'qazana' ); ?></span>
	</button>
</script>


<script type="text/template" id="tmpl-qazana-template-library-template-remote">
	<div class="qazana-template-library-template-body">
		<div class="qazana-template-library-template-screenshot" style="background-image: url({{ thumbnail }});"></div>
		<div class="qazana-template-library-template-controls">
			<div class="qazana-template-library-template-preview">
				<i class="fa fa-search-plus"></i>
			</div>
			<button class="qazana-template-library-template-insert qazana-button qazana-button-success">
				<i class="eicon-file-download"></i>
				<?php _e( 'Insert', 'qazana' ); ?>
			</button>
		</div>
	</div>
	<div class="qazana-template-library-template-name">{{{ title }}}</div>
</script>


<script type="text/template" id="tmpl-qazana-template-library-template-local">
	<div class="qazana-template-library-template-icon">
		<i class="fa fa-{{ 'section' === type ? 'columns' : 'file-text-o' }}"></i>
	</div>
	<div class="qazana-template-library-template-name">{{{ title }}}</div>
	<div class="qazana-template-library-template-type">{{{ qazana.translate( type ) }}}</div>
	<div class="qazana-template-library-template-controls">
		<button class="qazana-template-library-template-insert qazana-button qazana-button-success" data-action="insert">
			<i class="eicon-file-download"></i><span class="qazana-button-title"><?php _e( 'Insert', 'qazana' ); ?></span>
		</button>
		<div class="qazana-template-library-template-export">
			<a href="{{ export_link }}">
				<i class="fa fa-sign-out"></i><span class="qazana-template-library-template-control-title"><?php echo __( 'Export', 'qazana' ); ?></span>
			</a>
		</div>
		<div class="qazana-template-library-template-delete">
			<i class="fa fa-trash-o"></i><span class="qazana-template-library-template-control-title"><?php echo __( 'Delete', 'qazana' ); ?></span>
		</div>
		<div class="qazana-template-library-template-preview">
			<i class="eicon-zoom-in"></i><span class="qazana-template-library-template-control-title"><?php echo __( 'Preview', 'qazana' ); ?></span>
		</div>
	</div>
</script>

<script type="text/template" id="tmpl-qazana-template-library-save-template">
    <div class="qazana-template-library-blank-title">{{{ title }}}</div>
    <div class="qazana-template-library-blank-excerpt">{{{ description }}}</div>
    <form id="qazana-template-library-save-template-form">
		<input type="hidden" name="post_id" value="<?php echo get_the_ID(); ?>">
        <input id="qazana-template-library-save-template-name" name="title" placeholder="<?php _e( 'Enter Template Name', 'qazana' ); ?>" required>
        <button id="qazana-template-library-save-template-submit" class="qazana-button qazana-button-success">
            <span class="qazana-state-icon">
                <i class="fa fa-spin fa-circle-o-notch "></i>
            </span>
            <?php _e( 'Save', 'qazana' ); ?>
        </button>
    </form>
</script>

<script type="text/template" id="tmpl-qazana-template-library-import">
	<div class="qazana-template-library-import-title"><?php echo __( 'Import Templates', 'qazana' ); ?></div>
	<div class="qazana-template-library-import-excerpt"><?php _e( 'Choose a Qazana template JSON file or a .zip archive of Qazana templates, and add them to the list of templates available in your library.', 'qazana' ); ?></div>
    <form id="qazana-template-library-import-form">
        <input id="qazana-template-library-import-file" type="file" name="file" />
		<button id="qazana-template-library-import-submit" class="qazana-button qazana-button-success">
            <span class="qazana-state-icon">
                <i class="fa fa-spin fa-circle-o-notch "></i>
            </span>
            <?php _e( 'Import', 'qazana' ); ?>
        </button>
    </form>
</script>

<script type="text/template" id="tmpl-qazana-template-library-templates-empty">
    <div id="qazana-template-library-templates-empty-icon">
        <i class="eicon-nerd"></i>
    </div>
    <div class="qazana-template-library-blank-title"><?php _e( 'Haven’t Saved Templates Yet?', 'qazana' ); ?></div>
    <div class="qazana-template-library-blank-excerpt"><?php _e( 'This is where your templates should be. Design it. Save it. Reuse it.', 'qazana' ); ?></div>

</script>

<script type="text/template" id="tmpl-qazana-template-library-preview">
	<iframe></iframe>
</script>
