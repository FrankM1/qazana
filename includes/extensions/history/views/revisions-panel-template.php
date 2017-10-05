<script type="text/template" id="tmpl-qazana-panel-revisions">
	<div class="qazana-panel-box">
	<div class="qazana-panel-scheme-buttons">
			<div class="qazana-panel-scheme-button-wrapper qazana-panel-scheme-discard">
				<button class="qazana-button" disabled>
					<i class="fa fa-times"></i><?php esc_html_e( 'Discard', 'qazana' ); ?>
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
	<i class="qazana-panel-nerd-box-icon eicon-nerd"></i>
	<div class="qazana-panel-nerd-box-title"><?php esc_html_e( 'No Revisions Saved Yet', 'qazana' ); ?></div>
	<div class="qazana-panel-nerd-box-message">{{{ qazana.translate( qazana.config.revisions_enabled ? 'no_revisions_1' : 'revisions_disabled_1' ) }}}</div>
	<div class="qazana-panel-nerd-box-message">{{{ qazana.translate( qazana.config.revisions_enabled ? 'no_revisions_2' : 'revisions_disabled_2' ) }}}</div>
</script>

<script type="text/template" id="tmpl-qazana-panel-revisions-revision-item">
	<div class="qazana-revision-item__gravatar">{{{ gravatar }}}</div>
	<div class="qazana-revision-item__details">
		<div class="qazana-revision-date">{{{ date }}}</div>
		<div class="qazana-revision-meta">{{{ qazana.translate( type ) }}} <?php esc_html_e( 'By', 'qazana' ); ?> {{{ author }}}</div>
	</div>
	<div class="qazana-revision-item__tools">
		<i class="qazana-revision-item__tools-delete fa fa-times"></i>
		<i class="qazana-revision-item__tools-spinner fa fa-spin fa-circle-o-notch"></i>
	</div>
</script>
