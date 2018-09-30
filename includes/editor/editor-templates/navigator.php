<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

?>
<script type="text/template" id="tmpl-qazana-navigator">
	<div id="qazana-navigator__header">
		<i id="qazana-navigator__toggle-all" class="eicon-expand" data-qazana-action="expand"></i>
		<div id="qazana-navigator__header__title"><?php echo __( 'Navigator', 'qazana' ); ?></div>
		<i id="qazana-navigator__close" class="eicon-close"></i>
	</div>
	<div id="qazana-navigator__elements"></div>
	<div id="qazana-navigator__footer">
		<i class="eicon-ellipsis-h"></i>
	</div>
</script>

<script type="text/template" id="tmpl-qazana-navigator__elements">
	<# if ( obj.elType ) { #>
		<div class="qazana-navigator__item">
			<div class="qazana-navigator__element__list-toggle">
				<i class="eicon-sort-down"></i>
			</div>
			<#
			if ( icon ) { #>
				<div class="qazana-navigator__element__element-type">
					<i class="{{{ icon }}}"></i>
				</div>
			<# } #>
			<div class="qazana-navigator__element__title">
				<span class="qazana-navigator__element__title__text">{{{ title }}}</span>
			</div>
			<# if ( 'column' !== elType ) { #>
				<div class="qazana-navigator__element__toggle">
					<i class="eicon-eye"></i>
				</div>
			<# } #>
		</div>
	<# } #>
	<div class="qazana-navigator__elements"></div>
</script>

<script type="text/template" id="tmpl-qazana-navigator__elements--empty">
	<div class="qazana-empty-view__title"><?php echo __( 'Empty', 'qazana' ); ?></div>
</script>

<script type="text/template" id="tmpl-qazana-navigator__root--empty">
	<i class="qazana-nerd-box-icon eicon-nerd" aria-hidden="true"></i>
	<div class="qazana-nerd-box-title"><?php echo __( 'Easy Navigation is Here!', 'qazana' ); ?></div>
	<div class="qazana-nerd-box-message"><?php echo __( 'Once you fill your page with content, this window will give you an overview display of all the page elements. This way, you can easily move the different sections, columns, and widgets.', 'qazana' ); ?></div>
</script>
