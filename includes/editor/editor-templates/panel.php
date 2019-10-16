<?php
namespace Qazana;

use Qazana\Core\Responsive\Breakpoints;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * @var Editor $this
 */
$document = qazana()->get_documents()->get( $this->get_post_id() );

?>
<script type="text/template" id="tmpl-qazana-panel">
	<div id="qazana-mode-switcher"></div>
	<header id="qazana-panel-header"></header>
	<main id="qazana-panel-content"></main>
	<footer id="qazana-panel-footer">
		<div class="qazana-panel-container">
		</div>
	</footer>
</script>

<script type="text/template" id="tmpl-qazana-panel-menu">
	<div id="qazana-panel-page-menu-content"></div>
	<div id="qazana-panel-page-menu-footer">
		<a href="<?php echo esc_url( $document->get_exit_to_dashboard_url() ); ?>" id="qazana-panel-exit-to-dashboard" class="qazana-button qazana-button-default">
			<i class="fa fa-wordpress"></i>
			<?php _e( 'Exit To Dashboard', 'qazana' ); ?>
		</a>
	</div>
</script>

<script type="text/template" id="tmpl-qazana-panel-menu-group">
	<div class="qazana-panel-menu-group-title">{{{ title }}}</div>
	<div class="qazana-panel-menu-items"></div>
</script>

<script type="text/template" id="tmpl-qazana-panel-menu-item">
	<div class="qazana-panel-menu-item-icon">
		<i class="{{ icon }}"></i>
	</div>
	<div class="qazana-panel-menu-item-title">{{{ title }}}</div>
</script>

<script type="text/template" id="tmpl-qazana-panel-header-content">
    <div class="qazana-panel-header-row">

        <div id="qazana-panel-header-exit" class="qazana-panel-header-tool qazana-panel-header-button">
            <a id="qazana-panel-header-view-page" class="tooltip-target" href="<?php the_permalink(); ?>" title="<?php _e( 'Exit editor', 'qazana' ); ?>" data-tooltip="<?php esc_attr_e( 'Exit editor', 'qazana' ); ?>" data-tooltip-pos="nw">
                <span class="screen-reader-text"><?php esc_attr_e( 'Exit editor', 'qazana' ); ?></span>
            </a>
        </div>

        <div id="qazana-panel-header-menu" class="qazana-panel-header-tool qazana-panel-header-menu">
            <ul class="qazana-panel-header-nav qazana-panel-header-sub-menu-wrapper">
                <li>
                    <span id="qazana-panel-header-nav-button" class="qazana-panel-header-nav-button" title="<?php esc_attr_e( 'Qazana Dashboard', 'qazana' ); ?>" href="<?php the_permalink(); ?>"></span>
                    <ul>
                        <li class="qazana-panel-footer-sub-menu-item">
                            <a id="qazana-panel-header-nav-view-page" href="<?php the_permalink(); ?>" target="_blank">
                                <i class="dashicons dashicons-plus"></i>
                                <span><?php esc_attr_e( 'View Page', 'qazana' ); ?></span>
                            </a>
                        </li>
                        <li class="qazana-panel-footer-sub-menu-item">
                            <a class="qazana-panel-header-nav-button qazana-panel-header-nav-button-add-new-page" href="<?php
                                echo esc_url( add_query_arg(
                                    array(
                                        'post_type' => 'page',
                                        'ref' => 'qazana',
                                    ),
                                    admin_url( 'post-new.php' )
                                ) ); ?>"><i class="icon-display"></i>
                                    <span><?php esc_attr_e( 'Add new qazana page', 'qazana' ); ?></span>
                                </a>
                            </li>
                            <li class="qazana-panel-footer-sub-menu-item">
                                <a class="qazana-panel-header-nav-button qazana-panel-header-nav-button-dashboard" href="<?php echo admin_url( 'admin.php?page=' . qazana()->slug ); ?>">
                                    <i class="layers-button-icon-dashboard"></i>
                                    <span><?php esc_attr_e( 'Qazana Dashboard', 'qazana' ); ?></span>
                                </a>
                            </li>
                    </ul>
                </li>
            </ul>
        </div>

        <div id="qazana-panel-header-saver-publish" class="qazana-panel-header-tool">
            <button id="qazana-panel-header-saver-button-publish" class="qazana-button qazana-button-success qazana-saver-disabled">
                <span class="qazana-state-icon">
                    <i class="fa fa-spin fa-circle-o-notch" aria-hidden="true"></i>
                </span>
                <span id="qazana-panel-header-saver-button-publish-label">
                    <?php _e( 'Publish', 'qazana' ); ?>
                </span>
            </button>
        </div>

        <div id="qazana-panel-header-saver-save-options" class="qazana-panel-header-tool">
            <button id="qazana-panel-header-saver-button-save-options" class="qazana-button qazana-button-success tooltip-target qazana-saver-disabled" data-tooltip="<?php esc_attr_e( 'Save Options', 'qazana' ); ?>" data-tooltip-pos="n">
                <i class="fa fa-caret-down" aria-hidden="true"></i>
                <span class="qazana-screen-only"><?php _e( 'Save Options', 'qazana' ); ?></span>
            </button>
            <div class="qazana-panel-header-sub-menu-wrapper">
                <p class="qazana-last-edited-wrapper">
                    <span class="qazana-state-icon">
                        <i class="fa fa-spin fa-circle-o-notch" aria-hidden="true"></i>
                    </span>
                    <span class="qazana-last-edited">
                        {{{ qazana.config.document.last_edited }}}
                    </span>
                </p>
                <div class="qazana-panel-header-sub-menu">
                    <div id="qazana-panel-header-saver-button-save-draft" class="qazana-panel-header-sub-menu-item qazana-saver-disabled">
                        <i class="qazana-icon fa fa-save" aria-hidden="true"></i>
                        <span class="qazana-title"><?php _e( 'Save Draft', 'qazana' ); ?></span>
                    </div>
                    <div id="qazana-panel-header-saver-button-save-template" class="qazana-panel-header-sub-menu-item">
                        <i class="qazana-icon fa fa-folder" aria-hidden="true"></i>
                        <span class="qazana-title"><?php _e( 'Save as Template', 'qazana' ); ?></span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="qazana-panel-header-row">

        <div id="qazana-panel-header-menu-button" class="qazana-panel-header-tool qazana-header-button">
            <i class="qazana-icon eicon-menu-bar tooltip-target" aria-hidden="true" data-tooltip="<?php esc_attr_e( 'Menu', 'qazana' ); ?>" data-tooltip-pos="n"></i>
		<span class="qazana-screen-only"><?php _e( 'Menu', 'qazana' ); ?></span>
        </div>
        <div id="qazana-panel-header-title" class="qazana-panel-header-tool"></div>
        <div id="qazana-panel-header-add-button" class="qazana-panel-header-tool qazana-header-button">
            <i class="qazana-icon eicon-apps tooltip-target" aria-hidden="true" data-tooltip="<?php esc_attr_e( 'Widgets Panel', 'qazana' ); ?>" data-tooltip-pos="n"></i>
	    <span class="qazana-screen-only"><?php _e( 'Widgets Panel', 'qazana' ); ?></span>
        </div>

    </div>

</script>

<script type="text/template" id="tmpl-qazana-panel-footer-content">
    <div id="qazana-panel-footer-settings" class="qazana-panel-footer-tool qazana-leave-open tooltip-target" data-tooltip="<?php esc_attr_e( 'Settings', 'qazana' ); ?>">
		<i class="fa fa-cog" aria-hidden="true"></i>
		<span class="qazana-screen-only"><?php printf( esc_html__( '%s Settings', 'qazana' ), $document::get_title() ); ?></span>
	</div>
	<div id="qazana-panel-footer-navigator" class="qazana-panel-footer-tool tooltip-target" data-tooltip="<?php esc_attr_e( 'Navigator', 'qazana' ); ?>">
		<i class="eicon-navigator" aria-hidden="true"></i>
		<span class="qazana-screen-only"><?php echo __( 'Navigator', 'qazana' ); ?></span>
	</div>
	<div id="qazana-panel-footer-history" class="qazana-panel-footer-tool qazana-leave-open tooltip-target qazana-toggle-state" data-tooltip="<?php esc_attr_e( 'History', 'qazana' ); ?>">
		<i class="fa fa-history" aria-hidden="true"></i>
		<span class="qazana-screen-only"><?php echo __( 'History', 'qazana' ); ?></span>
	</div>
	<div id="qazana-panel-footer-responsive" class="qazana-panel-footer-tool qazana-toggle-state">
		<i class="eicon-device-desktop tooltip-target" aria-hidden="true" data-tooltip="<?php esc_attr_e( 'Responsive Mode', 'qazana' ); ?>"></i>
		<span class="qazana-screen-only">
			<?php _e( 'Responsive Mode', 'qazana' ); ?>
		</span>
		<div class="qazana-panel-footer-sub-menu-wrapper">
			<div class="qazana-panel-footer-sub-menu">
				<div class="qazana-panel-footer-sub-menu-item" data-device-mode="desktop">
					<i class="qazana-icon eicon-device-desktop" aria-hidden="true"></i>
					<span class="qazana-title"><?php _e( 'Desktop', 'qazana' ); ?></span>
					<span class="qazana-description"><?php _e( 'Default Preview', 'qazana' ); ?></span>
				</div>
				<div class="qazana-panel-footer-sub-menu-item" data-device-mode="tablet">
					<i class="qazana-icon eicon-device-tablet" aria-hidden="true"></i>
					<span class="qazana-title"><?php _e( 'Tablet', 'qazana' ); ?></span>
					<?php $breakpoints = Breakpoints::get_breakpoints(); ?>
					<span class="qazana-description"><?php echo sprintf( __( 'Preview for %s', 'qazana' ), $breakpoints['md'] . 'px' ); ?></span>
				</div>
				<div class="qazana-panel-footer-sub-menu-item" data-device-mode="mobile">
					<i class="qazana-icon eicon-device-mobile" aria-hidden="true"></i>
					<span class="qazana-title"><?php _e( 'Mobile', 'qazana' ); ?></span>
					<span class="qazana-description"><?php _e( 'Preview for 360px', 'qazana' ); ?></span>
				</div>
			</div>
		</div>
	</div>
	<div id="qazana-panel-footer-saver-button-preview" class="qazana-panel-footer-tool tooltip-target" data-tooltip="<?php esc_attr_e( 'Preview Changes', 'qazana' ); ?>">
		<span id="qazana-panel-footer-saver-button-preview-label">
			<i class="fa fa-eye" aria-hidden="true"></i>
			<span class="qazana-screen-only"><?php _e( 'Preview Changes', 'qazana' ); ?></span>
		</span>
	</div>
	<div id="qazana-panel-footer-saver-publish" class="qazana-panel-footer-tool">
		<button id="qazana-panel-footer-saver-button-publish" class="qazana-button qazana-button-success qazana-saver-disabled">
			<span class="qazana-state-icon">
				<i class="fa fa-spin fa-circle-o-notch" aria-hidden="true"></i>
			</span>
			<span id="qazana-panel-footer-saver-button-publish-label">
				<?php _e( 'Publish', 'qazana' ); ?>
			</span>
		</button>
	</div>
	<div id="qazana-panel-footer-saver-save-options" class="qazana-panel-footer-tool" >
		<button id="qazana-panel-footer-saver-button-save-options" class="qazana-button qazana-button-success tooltip-target qazana-saver-disabled" data-tooltip="<?php esc_attr_e( 'Save Options', 'qazana' ); ?>">
			<i class="fa fa-caret-up" aria-hidden="true"></i>
			<span class="qazana-screen-only"><?php _e( 'Save Options', 'qazana' ); ?></span>
		</button>
		<div class="qazana-panel-footer-sub-menu-wrapper">
			<p class="qazana-last-edited-wrapper">
				<span class="qazana-state-icon">
					<i class="fa fa-spin fa-circle-o-notch" aria-hidden="true"></i>
				</span>
				<span class="qazana-last-edited">
					{{{ qazana.config.document.last_edited }}}
				</span>
			</p>
			<div class="qazana-panel-footer-sub-menu">
				<div id="qazana-panel-footer-saver-menu-save-draft" class="qazana-panel-footer-sub-menu-item qazana-saver-disabled">
					<i class="qazana-icon fa fa-save" aria-hidden="true"></i>
					<span class="qazana-title"><?php _e( 'Save Draft', 'qazana' ); ?></span>
				</div>
				<div id="qazana-panel-footer-saver-menu-save-template" class="qazana-panel-footer-sub-menu-item">
					<i class="qazana-icon fa fa-folder" aria-hidden="true"></i>
					<span class="qazana-title"><?php _e( 'Save as Template', 'qazana' ); ?></span>
				</div>
			</div>
		</div>
	</div>
</script>

<script type="text/template" id="tmpl-qazana-mode-switcher-content">
	<input id="qazana-mode-switcher-preview-input" type="checkbox">
	<label for="qazana-mode-switcher-preview-input" id="qazana-mode-switcher-preview">
		<i class="fa" aria-hidden="true" title="<?php esc_attr_e( 'Hide Panel', 'qazana' ); ?>"></i>
		<span class="qazana-screen-only"><?php _e( 'Hide Panel', 'qazana' ); ?></span>
	</label>
</script>

<script type="text/template" id="tmpl-editor-content">
	<div class="qazana-panel-navigation">
		<# _.each( elementData.tabs_controls, function( tabTitle, tabSlug ) {
			if ( 'content' !== tabSlug && ! qazana.userCan( 'design' ) ) {
			return;
		}
			#>
			<div class="qazana-panel-navigation-tab qazana-tab-control-{{ tabSlug }}" data-tab="{{ tabSlug }}">
				<a href="#">{{{ tabTitle }}}</a>
			</div>
		<# } ); #>
	</div>
	<# if ( elementData.reload_preview ) { #>
		<div class="qazana-update-preview">
			<div class="qazana-update-preview-title"><?php _e( 'Update changes to page', 'qazana' ); ?></div>
			<div class="qazana-update-preview-button-wrapper">
				<button class="qazana-update-preview-button qazana-button qazana-button-success"><?php _e( 'Apply', 'qazana' ); ?></button>
			</div>
		</div>
	<# } #>
	<div id="qazana-controls"></div>
</script>

<script type="text/template" id="tmpl-qazana-panel-schemes-disabled">
	<i class="qazana-nerd-box-icon eicon-nerd" aria-hidden="true"></i>
	<div class="qazana-nerd-box-title">{{{ '<?php _e( '%s are disabled', 'qazana' ); ?>'.replace( '%s', disabledTitle ) }}}</div>
	<div class="qazana-nerd-box-message"><?php printf( __( 'You can enable it from the <a href="%s" target="_blank">Qazana settings page</a>.', 'qazana' ), admin_url( 'admin.php?page=' . qazana()->slug ) ); ?></div>
</script>

<script type="text/template" id="tmpl-qazana-panel-scheme-color-item">
	<div class="qazana-panel-scheme-color-input-wrapper">
		<input type="text" class="qazana-panel-scheme-color-value" value="{{ value }}" data-alpha="true" />
	</div>
	<div class="qazana-panel-scheme-color-title">{{{ title }}}</div>
</script>

<script type="text/template" id="tmpl-qazana-panel-scheme-typography-item">
	<div class="qazana-panel-heading">
		<div class="qazana-panel-heading-toggle">
			<i class="fa" aria-hidden="true"></i>
		</div>
		<div class="qazana-panel-heading-title">{{{ title }}}</div>
	</div>
	<div class="qazana-panel-scheme-typography-items qazana-panel-box-content">
		<?php
		$scheme_fields_keys = Group_Control_Typography::get_scheme_fields_keys();

		$typography_group = qazana()->get_controls_manager()->get_control_groups( 'typography' );
		$typography_fields = $typography_group->get_fields();

		$scheme_fields = array_intersect_key( $typography_fields, array_flip( $scheme_fields_keys ) );

		foreach ( $scheme_fields as $option_name => $option ) :
		?>
			<div class="qazana-panel-scheme-typography-item">
				<div class="qazana-panel-scheme-item-title qazana-control-title"><?php echo $option['label']; ?></div>
				<div class="qazana-panel-scheme-typography-item-value">
					<?php if ( 'select' === $option['type'] ) : ?>
						<select name="<?php echo esc_attr( $option_name ); ?>" class="qazana-panel-scheme-typography-item-field">
							<?php foreach ( $option['options'] as $field_key => $field_value ) : ?>
								<option value="<?php echo esc_attr( $field_key ); ?>"><?php echo $field_value; ?></option>
							<?php endforeach; ?>
						</select>
					<?php elseif ( 'font' === $option['type'] ) : ?>
						<select name="<?php echo esc_attr( $option_name ); ?>" class="qazana-panel-scheme-typography-item-field">
							<option value=""><?php _e( 'Default', 'qazana' ); ?></option>
							<?php foreach ( Fonts::get_font_groups() as $group_type => $group_label ) : ?>
								<optgroup label="<?php echo esc_attr( $group_label ); ?>">
									<?php foreach ( Fonts::get_fonts_by_groups( [ $group_type ] ) as $font_title => $font_type ) : ?>
										<option value="<?php echo esc_attr( $font_title ); ?>"><?php echo $font_title; ?></option>
									<?php endforeach; ?>
								</optgroup>
							<?php endforeach; ?>
						</select>
					<?php elseif ( 'text' === $option['type'] ) : ?>
						<input name="<?php echo esc_attr( $option_name ); ?>" class="qazana-panel-scheme-typography-item-field" />
					<?php endif; ?>
				</div>
			</div>
		<?php endforeach; ?>
	</div>
</script>

<script type="text/template" id="tmpl-qazana-control-responsive-switchers">
	<div class="qazana-control-responsive-switchers">
		<#
			var devices = responsive.devices || [ 'desktop', 'tablet', 'mobile' ];

			_.each( devices, function( device ) { #>
				<a class="qazana-responsive-switcher qazana-responsive-switcher-{{ device }}" data-device="{{ device }}">
					<i class="eicon-device-{{ device }}"></i>
				</a>
			<# } );
		#>
	</div>
</script>

<script type="text/template" id="tmpl-qazana-control-dynamic-switcher">
	<div class="qazana-control-dynamic-switcher-wrapper">
		<div class="qazana-control-dynamic-switcher">
			<?php _e( 'Dynamic', 'qazana' ); ?>
			<i class="fa fa-database"></i>
		</div>
	</div>
</script>

<script type="text/template" id="tmpl-qazana-control-dynamic-cover">
    <div class="qazana-dynamic-cover__settings">
        <i class="fa fa-{{ hasSettings ? 'wrench' : 'database' }}"></i>
    </div>
	<div class="qazana-dynamic-cover__title" title="{{{ title + ' ' + content }}}">{{{ title + ' ' + content }}}</div>
	<# if ( isRemovable ) { #>
		<div class="qazana-dynamic-cover__remove">
			<i class="fa fa-times-circle"></i>
		</div>
	<# } #>
</script>

<script type="text/template" id="tmpl-qazana-panel-page-settings">
	<div class="qazana-panel-navigation">
		<# _.each( qazana.config.page_settings.tabs, function( tabTitle, tabSlug ) { #>
			<div class="qazana-panel-navigation-tab qazana-tab-control-{{ tabSlug }}" data-tab="{{ tabSlug }}">
				<a href="#">{{{ tabTitle }}}</a>
			</div>
			<# } ); #>
	</div>
	<div id="qazana-panel-page-settings-controls"></div>
</script>
