<?php
namespace Builder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

?><script type="text/template" id="tmpl-builder-repeater-row">
	<div class="builder-repeater-row-tools">
		<div class="builder-repeater-row-handle-sortable">
			<i class="fa fa-ellipsis-v"></i>
		</div>
		<div class="builder-repeater-row-item-title"></div>
		<div class="builder-repeater-row-tool builder-repeater-tool-duplicate">
			<i class="fa fa-copy"></i>
		</div>
		<div class="builder-repeater-row-tool builder-repeater-tool-remove">
			<i class="fa fa-remove"></i>
		</div>
	</div>
	<div class="builder-repeater-row-controls"></div>
</script>
