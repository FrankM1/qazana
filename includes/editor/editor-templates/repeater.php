<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

?>
<script type="text/template" id="tmpl-qazana-repeater-row">
	<div class="qazana-repeater-row-tools">
		<div class="qazana-repeater-row-handle-sortable">
			<i class="fa fa-ellipsis-v" aria-hidden="true"></i>
			<span class="qazana-screen-only"><?php _e( 'Drag & Drop', 'qazana' ); ?></span>
		</div>
		<div class="qazana-repeater-row-item-title"></div>
		<div class="qazana-repeater-row-tool qazana-repeater-tool-duplicate">
			<i class="fa fa-copy" aria-hidden="true"></i>
			<span class="qazana-screen-only"><?php _e( 'Duplicate', 'qazana' ); ?></span>
		</div>
		<div class="qazana-repeater-row-tool qazana-repeater-tool-remove">
			<i class="fa fa-remove" aria-hidden="true"></i>
			<span class="qazana-screen-only"><?php _e( 'Remove', 'qazana' ); ?></span>
		</div>
	</div>
	<div class="qazana-repeater-row-controls"></div>
</script>
