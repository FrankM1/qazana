<?php
namespace Builder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
?>
<script type="text/template" id="tmpl-builder-panel">
	<div id="builder-mode-switcher"></div>
	<header id="builder-panel-header-wrapper"></header>
	<main id="builder-panel-content-wrapper"></main>
	<footer id="builder-panel-footer">
		<div class="builder-panel-container">
		</div>
	</footer>
</script>

<script type="text/template" id="tmpl-builder-panel-menu-item">
	<div class="builder-panel-menu-item-icon">
		<i class="fa fa-{{ icon }}"></i>
	</div>
	<div class="builder-panel-menu-item-title">{{{ title }}}</div>
</script>

<script type="text/template" id="tmpl-builder-panel-header">
    <div class="builder-panel-header-row">

        <div id="builder-panel-header-exit" class="builder-panel-header-button" title="<?php _e( 'Exit', 'builder' ); ?>">
            <a id="builder-panel-header-view-page" href="<?php the_permalink(); ?>">
                <span class="screen-reader-text"><?php esc_attr_e( 'View Page', 'builder' ); ?></span>
            </a>
        </div>

        <div id="builder-panel-header-menu" class="builder-panel-header-menu" title="<?php _e( 'Menu', 'builder' ); ?>">

            <ul class="builder-panel-header-nav">
                <li>
                    <span id="builder-panel-header-nav-button" class="builder-panel-header-nav-button" title="<?php esc_attr_e( 'Builder Dashboard', 'builder' ); ?>" href="<?php the_permalink(); ?>"></span>
                    <ul>
                        <li><a id="builder-panel-header-nav-view-page" href="<?php the_permalink(); ?>" target="_blank">
                            <i class="dashicons dashicons-plus"></i>
                            <span><?php esc_attr_e( 'View Page', 'builder' ); ?></span>
                        </a>
                        </li>
                            <li>
                                <a class="builder-panel-header-nav-button builder-panel-header-nav-button-add-new-page" href="<?php
                                echo esc_url( add_query_arg(
                                    array(
                                        'post_type' => 'page',
                                        'ref' => 'builder',
                                    ),
                                    admin_url( 'post-new.php' )
                                ) ); ?>"><i class="icon-display"></i>
                                    <span><?php esc_attr_e( 'Add new builder page', 'builder' ); ?></span></a>
                            </li>
                            <li>
                                <a class="builder-panel-header-nav-button builder-panel-header-nav-button-dashboard" href="<?php echo admin_url( 'admin.php?page=' . builder()->slug ); ?>"><i class="layers-button-icon-dashboard"></i>
                                <span><?php esc_attr_e( 'Builder Dashboard', 'builder' ); ?></span></a>

                            </li>
                    </ul>
                </li>
            </ul>
        </div>

        <div id="builder-panel-header-save" class="builder-panel-header-tool" title="<?php esc_attr_e( 'Publish', 'builder' ); ?>">
            <button class="builder-button">
                <span class="builder-state-icon">
                    <i class="fa fa-spin fa-circle-o-notch" data-tooltip="<?php esc_attr_e( 'Publish', 'builder' ); ?>"></i>
                </span>
                <span><?php esc_attr_e( 'Publish', 'builder' ); ?></span>
            </button>
        </div>

    </div>

    <div class="builder-panel-header-row">

        <div id="builder-panel-header-menu-button" class="builder-header-button">
            <i class="builder-icon eicon-menu tooltip-target" data-tooltip="<?php esc_attr_e( 'Menu', 'builder' ); ?>"></i>
        </div>
        <div id="builder-panel-header-title"></div>
        <div id="builder-panel-header-add-button" class="builder-header-button">
            <i class="builder-icon eicon-apps tooltip-target" data-tooltip="<?php esc_attr_e( 'Widgets Panel', 'builder' ); ?>"></i>
        </div>

    </div>

</script>

<script type="text/template" id="tmpl-builder-panel-footer-content">
    <div id="builder-panel-footer-exit" class="builder-panel-footer-tool" title="<?php _e( 'Exit', 'builder' ); ?>">
        <i class="fa fa-times"></i>
        <div class="builder-panel-footer-sub-menu-wrapper">
            <div class="builder-panel-footer-sub-menu">
                <a id="builder-panel-footer-view-page" class="builder-panel-footer-sub-menu-item" href="<?php the_permalink(); ?>" target="_blank">
                    <i class="builder-icon fa fa-external-link"></i>
                    <span class="builder-title"><?php _e( 'View Page', 'builder' ); ?></span>
                </a>
                <a id="builder-panel-footer-view-edit-page" class="builder-panel-footer-sub-menu-item" href="<?php echo get_edit_post_link(); ?>">
                    <i class="builder-icon fa fa-wordpress"></i>
                    <span class="builder-title"><?php _e( 'Go to Dashboard', 'builder' ); ?></span>
                </a>
            </div>
        </div>
    </div>
    <div id="builder-panel-footer-responsive" class="builder-panel-footer-tool" title="<?php esc_attr_e( 'Responsive Mode', 'builder' ); ?>">
        <i class="eicon-device-desktop"></i>
        <div class="builder-panel-footer-sub-menu-wrapper">
            <div class="builder-panel-footer-sub-menu">
                <div class="builder-panel-footer-sub-menu-item" data-device-mode="desktop">
                    <i class="builder-icon eicon-device-desktop"></i>
                    <span class="builder-title"><?php _e( 'Desktop', 'builder' ); ?></span>
                    <span class="builder-description"><?php _e( 'Default Preview', 'builder' ); ?></span>
                </div>
                <div class="builder-panel-footer-sub-menu-item" data-device-mode="tablet">
                    <i class="builder-icon eicon-device-tablet"></i>
                    <span class="builder-title"><?php _e( 'Tablet', 'builder' ); ?></span>
                    <span class="builder-description"><?php _e( 'Preview for 768px', 'builder' ); ?></span>
                </div>
                <div class="builder-panel-footer-sub-menu-item" data-device-mode="mobile">
                    <i class="builder-icon eicon-device-mobile"></i>
                    <span class="builder-title"><?php _e( 'Mobile', 'builder' ); ?></span>
                    <span class="builder-description"><?php _e( 'Preview for 360px', 'builder' ); ?></span>
                </div>
            </div>
        </div>
    </div>

    <div id="builder-panel-footer-templates" class="builder-panel-footer-tool" title="<?php esc_attr_e( 'Templates', 'builder' ); ?>">
        <span class="builder-screen-only"><?php _e( 'Templates', 'builder' ); ?></span>
        <i class="fa fa-folder"></i>
        <div class="builder-panel-footer-sub-menu-wrapper">
            <div class="builder-panel-footer-sub-menu">
                <div id="builder-panel-footer-templates-modal" class="builder-panel-footer-sub-menu-item">
                    <i class="builder-icon fa fa-folder"></i>
                    <span class="builder-title"><?php _e( 'Templates Library', 'builder' ); ?></span>
                </div>
                <div id="builder-panel-footer-save-template" class="builder-panel-footer-sub-menu-item">
                    <i class="builder-icon fa fa-save"></i>
                    <span class="builder-title"><?php _e( 'Save Template', 'builder' ); ?></span>
                </div>
            </div>
        </div>
    </div>
    <div id="builder-panel-footer-save" class="builder-panel-footer-tool" title="<?php esc_attr_e( 'Save', 'builder' ); ?>">
        <button class="builder-button">
            <span class="builder-state-icon">
                <i class="fa fa-spin fa-circle-o-notch "></i>
            </span>
            <?php _e( 'Publish', 'builder' ); ?>
        </button>
        <?php /*<div class="builder-panel-footer-sub-menu-wrapper">
            <div class="builder-panel-footer-sub-menu">
                <div id="builder-panel-footer-publish" class="builder-panel-footer-sub-menu-item">
                    <i class="builder-icon fa fa-check-circle"></i>
                    <span class="builder-title"><?php _e( 'Publish', 'builder' ); ?></span>
                </div>
                <div id="builder-panel-footer-discard" class="builder-panel-footer-sub-menu-item">
                    <i class="builder-icon fa fa-times-circle"></i>
                    <span class="builder-title"><?php _e( 'Discard', 'builder' ); ?></span>
                </div>
            </div>
        </div>*/ ?>
    </div>
</script>

<script type="text/template" id="tmpl-builder-mode-switcher-content">
	<input id="builder-mode-switcher-preview-input" type="checkbox">
	<label for="builder-mode-switcher-preview-input" id="builder-mode-switcher-preview" title="<?php esc_attr_e( 'Preview', 'builder' ); ?>">
		<span class="builder-screen-only"><?php _e( 'Preview', 'builder' ); ?></span>
		<i class="fa"></i>
	</label>
</script>

<script type="text/template" id="tmpl-editor-content">
	<div class="builder-panel-navigation">
		<# _.each( elementData.tabs_controls, function( tabTitle, tabSlug ) { #>
		<div class="builder-panel-navigation-tab builder-tab-control-{{ tabSlug }}">
			<a data-tab="{{ tabSlug }}">
				{{{ tabTitle }}}
			</a>
		</div>
		<# } ); #>
	</div>
	<# if ( elementData.reload_preview ) { #>
		<div id="builder-update-preview">
			<div id="builder-update-preview-title"><?php echo __( 'Update changes to page', 'builder' ); ?></div>
			<div id="builder-update-preview-button-wrapper">
				<button id="builder-update-preview-button" class="builder-button builder-button-success"><?php echo __( 'Apply', 'builder' ); ?></button>
			</div>
		</div>
	<# } #>
	<div id="builder-controls"></div>
</script>

<script type="text/template" id="tmpl-builder-panel-schemes-disabled">
	<i class="builder-panel-nerd-box-icon eicon-nerd"></i>
	<div class="builder-panel-nerd-box-title">{{{ '<?php echo __( '{0} are disabled', 'builder' ); ?>'.replace( '{0}', disabledTitle ) }}}</div>
	<div class="builder-panel-nerd-box-message"><?php printf( __( 'You can enable it from the <a href="%s" target="_blank">Builder settings page</a>.', 'builder' ), admin_url( 'admin.php?page=' . builder()->slug ) ); ?></div>
</script>

<script type="text/template" id="tmpl-builder-panel-scheme-color-item">
	<div class="builder-panel-scheme-color-input-wrapper">
		<input type="text" class="builder-panel-scheme-color-value" value="{{ value }}" data-alpha="true" />
	</div>
	<div class="builder-panel-scheme-color-title">{{{ title }}}</div>
</script>

<script type="text/template" id="tmpl-builder-panel-scheme-typography-item">
	<div class="builder-panel-heading">
		<div class="builder-panel-heading-toggle">
			<i class="fa"></i>
		</div>
		<div class="builder-panel-heading-title">{{{ title }}}</div>
	</div>
	<div class="builder-panel-scheme-typography-items builder-panel-box-content">
		<?php
		$scheme_fields_keys = Group_Control_Typography::get_scheme_fields_keys();

		$typography_group = builder()->controls_manager->get_control_groups( 'typography' );

		$typography_fields = $typography_group->get_fields();

		$scheme_fields = array_intersect_key( $typography_fields, array_flip( $scheme_fields_keys ) );

		foreach ( $scheme_fields as $option_name => $option ) : ?>
			<div class="builder-panel-scheme-typography-item">
				<div class="builder-panel-scheme-item-title builder-control-title"><?php echo $option['label']; ?></div>
				<div class="builder-panel-scheme-typography-item-value">
					<?php if ( 'select' === $option['type'] ) : ?>
						<select name="<?php echo $option_name; ?>" class="builder-panel-scheme-typography-item-field">
							<?php foreach ( $option['options'] as $field_key => $field_value ) : ?>
								<option value="<?php echo $field_key; ?>"><?php echo $field_value; ?></option>
							<?php endforeach; ?>
						</select>
					<?php elseif ( 'font' === $option['type'] ) : ?>
						<select name="<?php echo $option_name; ?>" class="builder-panel-scheme-typography-item-field">
							<option value=""><?php _e( 'Default', 'builder' ); ?></option>

							<optgroup label="<?php _e( 'System', 'builder' ); ?>">
								<?php foreach ( Fonts::get_fonts_by_groups( [ Fonts::SYSTEM ] ) as $font_title => $font_type ) : ?>
									<option value="<?php echo esc_attr( $font_title ); ?>"><?php echo $font_title; ?></option>
								<?php endforeach; ?>
							</optgroup>

							<optgroup label="<?php _e( 'Google', 'builder' ); ?>">
								<?php foreach ( Fonts::get_fonts_by_groups( [ Fonts::GOOGLE, Fonts::EARLYACCESS ] ) as $font_title => $font_type ) : ?>
									<option value="<?php echo esc_attr( $font_title ); ?>"><?php echo $font_title; ?></option>
								<?php endforeach; ?>
							</optgroup>
						</select>
					<?php elseif ( 'text' === $option['type'] ) : ?>
						<input name="<?php echo $option_name; ?>" class="builder-panel-scheme-typography-item-field" />
					<?php endif; ?>
				</div>
			</div>
		<?php endforeach; ?>
	</div>
</script>

<script type="text/template" id="tmpl-builder-control-responsive-switchers">
	<div class="builder-control-responsive-switchers">
		<a class="builder-responsive-switcher builder-responsive-switcher-desktop" data-device="desktop">
			<i class="eicon-device-desktop"></i>
		</a>
		<a class="builder-responsive-switcher builder-responsive-switcher-tablet" data-device="tablet">
			<i class="eicon-device-tablet"></i>
		</a>
		<a class="builder-responsive-switcher builder-responsive-switcher-mobile" data-device="mobile">
			<i class="eicon-device-mobile"></i>
		</a>
	</div>
</script>

<script type="text/template" id="tmpl-builder-panel-revisions">
	<div class="builder-panel-scheme-buttons">
		<div class="builder-panel-scheme-button-wrapper builder-panel-scheme-discard">
			<button class="builder-button" disabled>
				<i class="fa fa-times"></i><?php _e( 'Discard', 'builder' ); ?>
			</button>
		</div>
		<div class="builder-panel-scheme-button-wrapper builder-panel-scheme-save">
			<button class="builder-button builder-button-success" disabled>
				<?php _e( 'Apply', 'builder' ); ?>
			</button>
		</div>
	</div>
	<div class="builder-panel-box">
		<div class="builder-panel-heading">
			<div class="builder-panel-heading-title"><?php _e( 'Revision History', 'builder' ); ?></div>
		</div>
		<div id="builder-revisions-list" class="builder-panel-box-content"></div>
	</div>
</script>

<script type="text/template" id="tmpl-builder-panel-revisions-no-revisions">
	<i class="builder-panel-nerd-box-icon eicon-nerd"></i>
	<div class="builder-panel-nerd-box-title"><?php _e( 'No Revisions Saved Yet', 'builder' ); ?></div>
	<div class="builder-panel-nerd-box-message">{{{ builder.translate( builder.config.revisions_enabled ? 'no_revisions_1' : 'revisions_disabled_1' ) }}}</div>
	<div class="builder-panel-nerd-box-message">{{{ builder.translate( builder.config.revisions_enabled ? 'no_revisions_2' : 'revisions_disabled_2' ) }}}</div>
</script>

<script type="text/template" id="tmpl-builder-panel-revisions-revision-item">
	<div class="builder-revision-item__gravatar">{{{ gravatar }}}</div>
	<div class="builder-revision-item__details">
		<div class="builder-revision-date">{{{ date }}}</div>
		<div class="builder-revision-meta">{{{ builder.translate( type ) }}} <?php _e( 'By', 'builder' ); ?> {{{ author }}}</div>
	</div>
	<div class="builder-revision-item__tools">
		<i class="builder-revision-item__tools-delete fa fa-times"></i>
		<i class="builder-revision-item__tools-spinner fa fa-spin fa-circle-o-notch"></i>
	</div>
</script>
