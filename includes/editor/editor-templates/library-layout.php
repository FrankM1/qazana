<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}
?>
<script type="text/template" id="tmpl-qazana-templates-modal__header">
	<div class="qazana-templates-modal__header__logo-area"></div>
	<div class="qazana-templates-modal__header__menu-area"></div>
	<div class="qazana-templates-modal__header__items-area">
		<div class="qazana-templates-modal__header__close qazana-templates-modal__header__close--{{{ 'skip' === closeType ? 'skip' : 'normal' }}} qazana-templates-modal__header__item">
			<# if ( 'skip' === closeType ) { #>
			<span><?php _e( 'Skip', 'qazana' ); ?></span>
			<# } #>
			<i class="eicon-close" aria-hidden="true" title="<?php _e( 'Close', 'qazana' ); ?>"></i>
			<span class="qazana-screen-only"><?php _e( 'Close', 'qazana' ); ?></span>
		</div>
		<div id="qazana-template-library-header-tools"></div>
	</div>
</script>

<script type="text/template" id="tmpl-qazana-templates-modal__header__logo">
	<span class="qazana-templates-modal__header__logo__icon-wrapper">
		<i class="eicon-qazana"></i>
	</span>
	<span class="qazana-templates-modal__header__logo__title">{{{ title }}}</span>
</script>
