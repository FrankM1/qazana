<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

?>
<script type="text/template" id="tmpl-qazana-repeater-row">
	<div class="qazana-repeater-row-tools">
		<div class="qazana-repeater-row-handle-sortable">
			<i class="fa fa-ellipsis-v"></i>
		</div>
		<div class="qazana-repeater-row-item-title"></div>
		<div class="qazana-repeater-row-tool qazana-repeater-tool-duplicate">
			<i class="fa fa-copy"></i>
		</div>
		<div class="qazana-repeater-row-tool qazana-repeater-tool-remove">
			<i class="fa fa-remove"></i>
		</div>
	</div>
	<div class="qazana-repeater-row-controls"></div>
</script>
