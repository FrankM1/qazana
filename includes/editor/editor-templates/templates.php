<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
?>
<script type="text/template" id="tmpl-qazana-templates-modal__header">
	<div class="qazana-templates-modal__header__logo-area"></div>
	<div class="qazana-templates-modal__header__menu-area"></div>
	<div class="qazana-templates-modal__header__items-area">
		<div class="qazana-templates-modal__header__close-modal qazana-templates-modal__header__item">
			<i class="eicon-close" aria-hidden="true" title="<?php esc_attr_e( 'Close', 'qazana' ); ?>"></i>
			<span class="qazana-screen-only"><?php _e( 'Close', 'qazana' ); ?></span>
		</div>
		<div id="qazana-template-library-header-tools"></div>
	</div>
</script>

<script type="text/template" id="tmpl-qazana-templates-modal__header__logo">
	<span class="qazana-templates-modal__header__logo__icon-wrapper">
		<i class="eicon-chevron-left"></i>
	</span>
	<span class="qazana-templates-modal__header__logo__title">{{{ title }}}</span>
</script>

<script type="text/template" id="tmpl-qazana-template-library-header-actions">
	<div id="qazana-template-library-header-import" class="qazana-templates-modal__header__item">
		<i class="eicon-upload-circle-o" aria-hidden="true" title="<?php esc_attr_e( 'Import Template', 'qazana' ); ?>"></i>
		<span class="qazana-screen-only"><?php _e( 'Import Template', 'qazana' ); ?></span>
	</div>
	<div id="qazana-template-library-header-sync" class="qazana-templates-modal__header__item">
		<i class="eicon-sync" aria-hidden="true" title="<?php esc_attr_e( 'Sync Library', 'qazana' ); ?>"></i>
		<span class="qazana-screen-only"><?php _e( 'Sync Library', 'qazana' ); ?></span>
	</div>
	<div id="qazana-template-library-header-save" class="qazana-templates-modal__header__item">
		<i class="eicon-save-o" aria-hidden="true" title="<?php esc_attr_e( 'Save', 'qazana' ); ?>"></i>
		<span class="qazana-screen-only"><?php _e( 'Save', 'qazana' ); ?></span>
	</div>
</script>

<script type="text/template" id="tmpl-qazana-template-library-header-menu">
	<div id="qazana-template-library-menu-pre-made-blocks" class="qazana-template-library-menu-item" data-template-source="remote" data-template-type="block"><?php _e( 'Blocks', 'qazana' ); ?></div>
	<div id="qazana-template-library-menu-pre-made-pages" class="qazana-template-library-menu-item" data-template-source="remote" data-template-type="page"><?php _e( 'Pages', 'qazana' ); ?></div>
	<div id="qazana-template-library-menu-my-templates" class="qazana-template-library-menu-item" data-template-source="local"><?php _e( 'My Templates', 'qazana' ); ?></div>
</script>

<script type="text/template" id="tmpl-qazana-template-library-header-preview">
	<div id="qazana-template-library-header-preview-insert-wrapper" class="qazana-templates-modal__header__item">
		{{{ qazana.templates.getLayout().getTemplateActionButton( obj ) }}}
	</div>
</script>

<script type="text/template" id="tmpl-qazana-template-library-header-back">
	<i class="eicon-" aria-hidden="true"></i>
	<span><?php _e( 'Back to Library', 'qazana' ); ?></span>
</script>

<script type="text/template" id="tmpl-qazana-template-library-loading">
	<?php echo qazana_loading_indicator(); ?>
</script>

<script type="text/template" id="tmpl-qazana-template-library-templates">
	<#
		var activeSource = qazana.templates.getFilter('source');
	#>
	<div id="qazana-template-library-toolbar">
		<# if ( 'remote' === activeSource ) {
			var activeType = qazana.templates.getFilter('type');
			#>
			<div id="qazana-template-library-filter-toolbar-remote" class="qazana-template-library-filter-toolbar">
				<# if ( 'page' === activeType ) { #>
					<div id="qazana-template-library-order">
						<input type="radio" id="qazana-template-library-order-new" class="qazana-template-library-order-input" name="qazana-template-library-order" value="date">
						<label for="qazana-template-library-order-new" class="qazana-template-library-order-label"><?php _e( 'New', 'qazana' ); ?></label>
						<input type="radio" id="qazana-template-library-order-trend" class="qazana-template-library-order-input" name="qazana-template-library-order" value="trendIndex">
						<label for="qazana-template-library-order-trend" class="qazana-template-library-order-label"><?php _e( 'Trend', 'qazana' ); ?></label>
						<input type="radio" id="qazana-template-library-order-popular" class="qazana-template-library-order-input" name="qazana-template-library-order" value="popularityIndex">
						<label for="qazana-template-library-order-popular" class="qazana-template-library-order-label"><?php _e( 'Popular', 'qazana' ); ?></label>
					</div>
				<# } else { #>
					<div id="qazana-template-library-filter">
						<select id="qazana-template-library-filter-subtype" class="qazana-template-library-filter-select" data-qazana-filter="subtype">
							<option></option>
							<# qazana.templates.getConfig( 'categories' ).forEach( function( category ) {
								var selected = category === qazana.templates.getFilter( 'subtype' ) ? ' selected' : '';
								#>
								<option value="{{ category }}"{{{ selected }}}>{{{ category }}}</option>
							<# } ); #>
						</select>
					</div>
				<# } #>
				<div id="qazana-template-library-my-favorites">
					<# var checked = qazana.templates.getFilter( 'favorite' ) ? ' checked' : ''; #>
					<input id="qazana-template-library-filter-my-favorites" type="checkbox"{{{ checked }}}>
					<label id="qazana-template-library-filter-my-favorites-label" for="qazana-template-library-filter-my-favorites">
						<i class="fa" aria-hidden="true"></i>
						<?php _e( 'My Favorites', 'qazana' ); ?>
					</label>
				</div>
			</div>
		<# } else { #>
			<div id="qazana-template-library-filter-toolbar-local" class="qazana-template-library-filter-toolbar"></div>
		<# } #>
		<div id="qazana-template-library-filter-text-wrapper">
			<label for="qazana-template-library-filter-text" class="qazana-screen-only"><?php _e( 'Search Templates:', 'qazana' ); ?></label>
			<input id="qazana-template-library-filter-text" placeholder="<?php echo esc_attr__( 'Search', 'qazana' ); ?>">
		</div>
	</div>
	<# if ( 'local' === activeSource ) { #>
		<div id="qazana-template-library-order-toolbar-local">
			<div class="qazana-template-library-local-column-1">
				<input type="radio" id="qazana-template-library-order-local-title" class="qazana-template-library-order-input" name="qazana-template-library-order-local" value="title" data-default-ordering-direction="asc">
				<label for="qazana-template-library-order-local-title" class="qazana-template-library-order-label"><?php _e( 'Name', 'qazana' ); ?></label>
			</div>
			<div class="qazana-template-library-local-column-2">
				<input type="radio" id="qazana-template-library-order-local-type" class="qazana-template-library-order-input" name="qazana-template-library-order-local" value="type" data-default-ordering-direction="asc">
				<label for="qazana-template-library-order-local-type" class="qazana-template-library-order-label"><?php _e( 'Type', 'qazana' ); ?></label>
			</div>
			<div class="qazana-template-library-local-column-3">
				<input type="radio" id="qazana-template-library-order-local-author" class="qazana-template-library-order-input" name="qazana-template-library-order-local" value="author" data-default-ordering-direction="asc">
				<label for="qazana-template-library-order-local-author" class="qazana-template-library-order-label"><?php _e( 'Created By', 'qazana' ); ?></label>
			</div>
			<div class="qazana-template-library-local-column-4">
				<input type="radio" id="qazana-template-library-order-local-date" class="qazana-template-library-order-input" name="qazana-template-library-order-local" value="date">
				<label for="qazana-template-library-order-local-date" class="qazana-template-library-order-label"><?php _e( 'Creation Date', 'qazana' ); ?></label>
			</div>
			<div class="qazana-template-library-local-column-5">
				<div class="qazana-template-library-order-label"><?php _e( 'Actions', 'qazana' ); ?></div>
			</div>
		</div>
	<# } #>
	<div id="qazana-template-library-templates-container"></div>
	<# if ( 'remote' === activeSource ) { #>
		<div id="qazana-template-library-footer-banner">
			<i class="eicon-nerd" aria-hidden="true"></i>
			<div class="qazana-excerpt"><?php _e( 'Stay tuned! More awesome templates coming real soon.', 'qazana' ); ?></div>
		</div>
	<# } #>
</script>

<script type="text/template" id="tmpl-qazana-template-library-template-remote">
	<div class="qazana-template-library-template-body">
		<# if ( 'page' === type ) { #>
			<div class="qazana-template-library-template-screenshot" style="background-image: url({{ thumbnail }});"></div>
		<# } else { #>
			<img src="{{ thumbnail }}">
		<# } #>
		<div class="qazana-template-library-template-preview">
			<i class="fa fa-search-plus" aria-hidden="true"></i>
		</div>
	</div>
	<div class="qazana-template-library-template-footer">
		{{{ qazana.templates.getLayout().getTemplateActionButton( obj ) }}}
		<div class="qazana-template-library-template-name">{{{ title }}} - {{{ type }}}</div>
		<div class="qazana-template-library-favorite">
			<input id="qazana-template-library-template-{{ template_id }}-favorite-input" class="qazana-template-library-template-favorite-input" type="checkbox"{{ favorite ? " checked" : "" }}>
			<label for="qazana-template-library-template-{{ template_id }}-favorite-input" class="qazana-template-library-template-favorite-label">
				<i class="fa fa-heart-o" aria-hidden="true"></i>
				<span class="qazana-screen-only"><?php _e( 'Favorite', 'qazana' ); ?></span>
			</label>
		</div>
	</div>
</script>

<script type="text/template" id="tmpl-qazana-template-library-template-local">
	<div class="qazana-template-library-template-name qazana-template-library-local-column-1">{{{ title }}}</div>
	<div class="qazana-template-library-template-meta qazana-template-library-template-type qazana-template-library-local-column-2">{{{ qazana.translate( type ) }}}</div>
	<div class="qazana-template-library-template-meta qazana-template-library-template-author qazana-template-library-local-column-3">{{{ author }}}</div>
	<div class="qazana-template-library-template-meta qazana-template-library-template-date qazana-template-library-local-column-4">{{{ human_date }}}</div>
	<div class="qazana-template-library-template-controls qazana-template-library-local-column-5">
		<div class="qazana-template-library-template-preview">
			<i class="fa fa-eye" aria-hidden="true"></i>
			<span class="qazana-template-library-template-control-title"><?php _e( 'Preview', 'qazana' ); ?></span>
		</div>
		<button class="qazana-template-library-template-action qazana-template-library-template-insert qazana-button qazana-button-success">
			<i class="eicon-file-download" aria-hidden="true"></i>
			<span class="qazana-button-title"><?php _e( 'Insert', 'qazana' ); ?></span>
		</button>
		<div class="qazana-template-library-template-more-toggle">
			<i class="eicon-ellipsis-h" aria-hidden="true"></i>
			<span class="qazana-screen-only"><?php _e( 'More actions', 'qazana' ); ?></span>
		</div>
		<div class="qazana-template-library-template-more">
			<div class="qazana-template-library-template-delete">
				<i class="fa fa-trash-o" aria-hidden="true"></i>
				<span class="qazana-template-library-template-control-title"><?php _e( 'Delete', 'qazana' ); ?></span>
			</div>
			<div class="qazana-template-library-template-export">
				<a href="{{ export_link }}">
					<i class="fa fa-sign-out" aria-hidden="true"></i>
					<span class="qazana-template-library-template-control-title"><?php _e( 'Export', 'qazana' ); ?></span>
				</a>
			</div>
		</div>
	</div>
</script>

<script type="text/template" id="tmpl-qazana-template-library-insert-button">
	<a class="qazana-template-library-template-action qazana-template-library-template-insert qazana-button">
		<i class="eicon-file-download" aria-hidden="true"></i>
		<span class="qazana-button-title"><?php _e( 'Insert', 'qazana' ); ?></span>
	</a>
</script>

<script type="text/template" id="tmpl-qazana-template-library-save-template">
	<div class="qazana-template-library-blank-icon">
		<i class="eicon-library-save" aria-hidden="true"></i>
		<span class="qazana-screen-only"><?php _e( 'Save', 'qazana' ); ?></span>
	</div>
	<div class="qazana-template-library-blank-title">{{{ title }}}</div>
	<div class="qazana-template-library-blank-message">{{{ description }}}</div>
	<form id="qazana-template-library-save-template-form">
		<input type="hidden" name="post_id" value="<?php echo get_the_ID(); ?>">
		<input id="qazana-template-library-save-template-name" name="title" placeholder="<?php echo esc_attr__( 'Enter Template Name', 'qazana' ); ?>" required>
		<button id="qazana-template-library-save-template-submit" class="qazana-button qazana-button-success">
			<span class="qazana-state-icon">
				<i class="fa fa-spin fa-circle-o-notch" aria-hidden="true"></i>
			</span>
			<?php _e( 'Save', 'qazana' ); ?>
		</button>
	</form>
	<div class="qazana-template-library-blank-footer">
		<?php _e( 'Want to learn more about the Qazana library?', 'qazana' ); ?>
		<a class="qazana-template-library-blank-footer-link" href="https://go.qazana.net/docs-library/" target="_blank"><?php _e( 'Click here', 'qazana' ); ?></a>
	</div>
</script>

<script type="text/template" id="tmpl-qazana-template-library-import">
	<form id="qazana-template-library-import-form">
		<div class="qazana-template-library-blank-icon">
			<i class="eicon-library-upload" aria-hidden="true"></i>
		</div>
		<div class="qazana-template-library-blank-title"><?php _e( 'Import Template to Your Library', 'qazana' ); ?></div>
		<div class="qazana-template-library-blank-message"><?php _e( 'Drag & drop your .JSON or .zip template file', 'qazana' ); ?></div>
		<div id="qazana-template-library-import-form-or"><?php _e( 'or', 'qazana' ); ?></div>
		<label for="qazana-template-library-import-form-input" id="qazana-template-library-import-form-label" class="qazana-button qazana-button-success"><?php _e( 'Select File', 'qazana' ); ?></label>
		<input id="qazana-template-library-import-form-input" type="file" name="file" accept=".json,.zip" required/>
		<div class="qazana-template-library-blank-footer">
			<?php _e( 'Want to learn more about the Qazana library?', 'qazana' ); ?>
			<a class="qazana-template-library-blank-footer-link" href="https://go.qazana.net/docs-library/" target="_blank"><?php _e( 'Click here', 'qazana' ); ?></a>
		</div>
	</form>
</script>

<script type="text/template" id="tmpl-qazana-template-library-templates-empty">
	<div class="qazana-template-library-blank-icon">
		<i class="eicon-nerd" aria-hidden="true"></i>
	</div>
	<div class="qazana-template-library-blank-title"></div>
	<div class="qazana-template-library-blank-message"></div>
	<div class="qazana-template-library-blank-footer">
		<?php _e( 'Want to learn more about the Qazana library?', 'qazana' ); ?>
		<a class="qazana-template-library-blank-footer-link" href="https://go.qazana.net/docs-library/" target="_blank"><?php _e( 'Click here', 'qazana' ); ?></a>
	</div>
</script>

<script type="text/template" id="tmpl-qazana-template-library-preview">
	<iframe></iframe>
</script>
