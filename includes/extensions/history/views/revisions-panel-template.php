<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

?>
<script type="text/template" id="tmpl-qazana-panel-revisions">
	<div class="qazana-panel-box">
	<div class="qazana-panel-scheme-buttons">
			<div class="qazana-panel-scheme-button-wrapper qazana-panel-scheme-discard">
				<button class="qazana-button" disabled>
					<i class="fa fa-times" aria-hidden="true"></i>
					<?php _e( 'Discard', 'qazana' ); ?>
				</button>
			</div>
			<div class="qazana-panel-scheme-button-wrapper qazana-panel-scheme-save">
				<button class="qazana-button qazana-button-success" disabled>
					<?php esc_html_e( 'Apply', 'qazana' ); ?>
				</button>
			</div>
		</div>
	</div>

	<div class="qazana-panel-box">
		<div class="qazana-panel-heading">
			<div class="qazana-panel-heading-title"><?php esc_html_e( 'Revisions', 'qazana' ); ?></div>
		</div>
		<div id="qazana-revisions-list" class="qazana-panel-box-content"></div>
	</div>
</script>

<script type="text/template" id="tmpl-qazana-panel-revisions-no-revisions">
	<i class="qazana-panel-nerd-box-icon eicon-nerd" aria-hidden="true"></i>
	<div class="qazana-panel-nerd-box-title"><?php _e( 'No Revisions Saved Yet', 'qazana' ); ?></div>
	<div class="qazana-panel-nerd-box-message">{{{ qazana.translate( qazana.config.revisions_enabled ? 'no_revisions_1' : 'revisions_disabled_1' ) }}}</div>
	<div class="qazana-panel-nerd-box-message">{{{ qazana.translate( qazana.config.revisions_enabled ? 'no_revisions_2' : 'revisions_disabled_2' ) }}}</div>
</script>

<script type="text/template" id="tmpl-qazana-panel-revisions-revision-item">
	<div class="qazana-revision-item__wrapper {{ type }}">
		<div class="qazana-revision-item__gravatar">{{{ gravatar }}}</div>
		<div class="qazana-revision-item__details">
			<div class="qazana-revision-date">{{{ date }}}</div>
			<div class="qazana-revision-meta"><span>{{{ qazana.translate( type ) }}}</span> <?php _e( 'By', 'qazana' ); ?> {{{ author }}}</div>
		</div>
		<div class="qazana-revision-item__tools">
			<# if ( 'current' === type ) { #>
				<i class="qazana-revision-item__tools-current fa fa-star" aria-hidden="true"></i>
				<span class="qazana-screen-only"><?php echo __( 'Current', 'qazana' ); ?></span>
			<# } else { #>
				<i class="qazana-revision-item__tools-delete fa fa-times" aria-hidden="true"></i>
				<span class="qazana-screen-only"><?php echo __( 'Delete', 'qazana' ); ?></span>
			<# } #>

			<i class="qazana-revision-item__tools-spinner fa fa-spin fa-circle-o-notch" aria-hidden="true"></i>
		</div>
	</div>
</script>
