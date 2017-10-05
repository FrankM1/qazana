<script type="text/template" id="tmpl-qazana-panel-history-page">
	<div id="qazana-panel-elements-navigation" class="qazana-panel-navigation">
		<div id="qazana-panel-elements-navigation-history" class="qazana-panel-navigation-tab active" data-view="history"><?php esc_html_e( 'Actions', 'qazana' ); ?></div>
		<div id="qazana-panel-elements-navigation-revisions" class="qazana-panel-navigation-tab" data-view="revisions"><?php esc_html_e( 'Revisions', 'qazana' ); ?></div>
	</div>
	<div id="qazana-panel-history-content"></div>
</script>

<script type="text/template" id="tmpl-qazana-panel-history-tab">
	<div class="qazana-panel-box">
		<div class="qazana-panel-box-content">
			<div id="qazana-history-list"></div>
			<div class="qazana-history-revisions-message"><?php esc_html_e( 'Switch to Revisions tab for older versions', 'qazana' ) ?></div>
		</div>
	</div>
</script>

<script type="text/template" id="tmpl-qazana-panel-history-no-items">
	<i class="qazana-panel-nerd-box-icon eicon-nerd"></i>
	<div class="qazana-panel-nerd-box-title"><?php esc_html_e( 'No History Yet', 'qazana' ); ?></div>
	<div class="qazana-panel-nerd-box-message"><?php esc_html_e( 'Once you start working, you\'ll be able to redo / undo any action you make in the editor.', 'qazana' ) ?></div>
	<div class="qazana-panel-nerd-box-message"><?php esc_html_e( 'Switch to Revisions tab for older versions', 'qazana' ) ?></div>
</script>

<script type="text/template" id="tmpl-qazana-panel-history-item">
	<div class="qazana-history-item qazana-history-item-{{ status }}">
		<div class="qazana-history-item__details">
			<span class="qazana-history-item__title">{{{ title }}} </span>
			<span class="qazana-history-item__subtitle">{{{ subTitle }}} </span>
			<span class="qazana-history-item__action">{{{ action }}}</span>
		</div>
		<div class="qazana-history-item__icon">
			<span class="fa"></span>
		</div>
	</div>
</script>
