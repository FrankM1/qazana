<?php
namespace Builder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
?>
<script type="text/template" id="tmpl-builder-panel-elements">
	<div id="builder-panel-elements-navigation" class="builder-panel-navigation">
		<div id="builder-panel-elements-navigation-all" class="builder-panel-navigation-tab active" data-view="categories"><?php echo __( 'Elements', 'builder' ); ?></div>
		<div id="builder-panel-elements-navigation-global" class="builder-panel-navigation-tab" data-view="global"><?php echo __( 'Global', 'builder' ); ?></div>
	</div>
	<div id="builder-panel-elements-search-area"></div>
	<div id="builder-panel-elements-wrapper"></div>
</script>

<script type="text/template" id="tmpl-builder-panel-categories">
	<div id="builder-panel-categories"></div>
</script>

<script type="text/template" id="tmpl-builder-panel-elements-category">
	<div class="panel-elements-category-title panel-elements-category-title-{{ name }}">{{{ title }}}</div>
	<div class="panel-elements-category-items"></div>
</script>

<script type="text/template" id="tmpl-builder-panel-element-search">
	<input id="builder-panel-elements-search-input" placeholder="<?php _e( 'Search Widget...', 'builder' ); ?>" />
	<i class="fa fa-search"></i>
</script>

<script type="text/template" id="tmpl-builder-element-library-element">
	<div class="builder-element">
		<div class="icon">
			<i class="{{ icon }}"></i>
		</div>
		<div class="builder-element-title-wrapper">
			<div class="title">{{{ title }}}</div>
		</div>
	</div>
</script>

<script type="text/template" id="tmpl-builder-panel-global">
	<div class="builder-panel-nerd-box">
		
	</div>
</script>
