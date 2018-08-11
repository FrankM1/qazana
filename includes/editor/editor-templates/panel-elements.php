<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
?>
<script type="text/template" id="tmpl-qazana-panel-elements">
	<div id="qazana-panel-elements-navigation" class="qazana-panel-navigation">
		<div id="qazana-panel-elements-navigation-all" class="qazana-panel-navigation-tab qazana-active" data-view="categories"><?php _e( 'Elements', 'qazana' ); ?></div>
		<div id="qazana-panel-elements-navigation-global" class="qazana-panel-navigation-tab" data-view="global"><?php _e( 'Global', 'qazana' ); ?></div>
	</div>
	<div id="qazana-panel-elements-search-area"></div>
	<div id="qazana-panel-elements-wrapper"></div>
</script>

<script type="text/template" id="tmpl-qazana-panel-categories">
	<div id="qazana-panel-categories"></div>
</script>

<script type="text/template" id="tmpl-qazana-panel-elements-category">
	<div class="qazana-panel-category-title qazana-panel-category-title-{{ name }}">{{{ title }}}</div>
	<div class="qazana-panel-category-items"></div>
</script>

<script type="text/template" id="tmpl-qazana-panel-element-search">
	<label for="qazana-panel-elements-search-input" class="screen-reader-text"><?php _e( 'Search Widget:', 'qazana' ); ?></label>
	<input type="search" id="qazana-panel-elements-search-input" placeholder="<?php esc_attr_e( 'Search Widget...', 'qazana' ); ?>" />
	<i class="fa fa-search" aria-hidden="true"></i>
</script>

<script type="text/template" id="tmpl-qazana-element-library-element">
	<div class="qazana-element">
		<div class="icon">
			<i class="{{ icon }}" aria-hidden="true"></i>
		</div>
		<div class="qazana-element-title-wrapper">
			<div class="title">{{{ title }}}</div>
		</div>
	</div>
</script>

<script type="text/template" id="tmpl-qazana-panel-global">
	<div class="qazana-panel-nerd-box">Coming Soon</div>
</script>
