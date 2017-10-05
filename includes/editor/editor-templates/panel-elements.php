<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
?>
<script type="text/template" id="tmpl-qazana-panel-elements">
	<div id="qazana-panel-elements-navigation" class="qazana-panel-navigation">
		<div id="qazana-panel-elements-navigation-all" class="qazana-panel-navigation-tab active" data-view="categories"><?php echo __( 'Elements', 'qazana' ); ?></div>
		<div id="qazana-panel-elements-navigation-global" class="qazana-panel-navigation-tab" data-view="global"><?php echo __( 'Global', 'qazana' ); ?></div>
	</div>
	<div id="qazana-panel-elements-search-area"></div>
	<div id="qazana-panel-elements-wrapper"></div>
</script>

<script type="text/template" id="tmpl-qazana-panel-categories">
	<div id="qazana-panel-categories"></div>
</script>

<script type="text/template" id="tmpl-qazana-panel-elements-category">
	<div class="panel-elements-category-title panel-elements-category-title-{{ name }}">{{{ title }}}</div>
	<div class="panel-elements-category-items"></div>
</script>

<script type="text/template" id="tmpl-qazana-panel-element-search">
	<input id="qazana-panel-elements-search-input" placeholder="<?php _e( 'Search...', 'qazana' ); ?>" />
	<i class="fa fa-search"></i>
</script>

<script type="text/template" id="tmpl-qazana-element-library-element">
	<div class="qazana-element">
		<div class="icon">
			<i class="{{ icon }}"></i>
		</div>
		<div class="qazana-element-title-wrapper">
			<div class="title">{{{ title }}}</div>
		</div>
	</div>
</script>

<script type="text/template" id="tmpl-qazana-panel-global">
	<div class="qazana-panel-nerd-box">Coming Soon</div>
</script>
