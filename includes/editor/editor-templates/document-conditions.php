<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

?>
<script type="text/template" id="tmpl-qazana-document-conditions-view">
	<div class="qazana-template-library-blank-icon">
		<i class="fa fa-paper-plane"></i>
	</div>
	<div class="qazana-template-library-blank-title">{{{ title }}}</div>
	<div class="qazana-template-library-blank-message">{{{ description }}}</div>
	<div id="qazana-document-conditions">
		<div id="qazana-document-conditions-controls"></div>
	</div>
	<div id="qazana-document-conditions__footer">
		<button id="qazana-document-conditions__publish" class="qazana-button qazana-button-success">
			<span class="qazana-state-icon">
				<i class="fa fa-spin fa-circle-o-notch"></i>
			</span>
			<span id="qazana-document-conditions__publish__title"></span>
		</button>
	</div>
</script>

<script type="text/template" id="tmpl-qazana-document-conditions-repeater-row">
	<div class="qazana-document-conditions-repeater-row-controls"></div>
	<div class="qazana-repeater-row-tool qazana-repeater-tool-remove">
		<i class="eicon-close"></i>
	</div>
</script>

<script type="text/template" id="tmpl-qazana-document-conditions-button-preview">
<div id="qazana-panel-footer-document-conditions-button-preview-wrapper" class="qazana-panel-footer-tool">
	<i class="fa fa-eye tooltip-target" aria-hidden="true"  data-tooltip="<?php esc_attr_e( 'Preview Changes', 'qazana' ); ?>"></i>
	<span class="qazana-screen-only">
		<?php echo __( 'Preview Changes', 'qazana' ); ?>
	</span>
	<div class="qazana-panel-footer-sub-menu-wrapper">
		<div class="qazana-panel-footer-sub-menu">
			<div id="qazana-panel-footer-document-conditions-button-preview-settings" class="qazana-panel-footer-sub-menu-item">
				<i class="fa fa-wrench" aria-hidden="true"></i>
				<span class="qazana-title"><?php echo __( 'Settings', 'qazana' ); ?></span>
			</div>
			<div id="qazana-panel-footer-document-conditions-button-open-preview" class="qazana-panel-footer-sub-menu-item">
				<i class="fa fa-external-link" aria-hidden="true"></i>
				<span class="qazana-title"><?php echo __( 'Preview', 'qazana' ); ?></span>
			</div>
		</div>
	</div>
</div>
</script>
