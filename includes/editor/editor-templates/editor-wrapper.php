<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

global $wp_version;
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title><?php echo __( 'Qazana', 'qazana' ) . ' | ' . get_the_title(); ?></title>
	<?php wp_head(); ?>
	<script>
		var ajaxurl = '<?php echo admin_url( 'admin-ajax.php', 'relative' ); ?>';
	</script>
</head>
<body class="qazana-editor-active wp-version-<?php echo str_replace( '.', '-', $wp_version ); ?>">
<div id="qazana-editor-wrapper">
	<div id="qazana-preview">
		<div id="qazana-loading">
			<?php echo qazana_loading_indicator(); ?>
		</div>
		<div id="qazana-preview-responsive-wrapper" class="qazana-device-desktop qazana-device-rotate-portrait">
			<div id="qazana-preview-loading">
				<i class="fa fa-spin fa-circle-o-notch"></i>
			</div>
			<?php // Iframe will be create here by the Javascript later. ?>
		</div>
	</div>
	<div id="qazana-panel" class="qazana-panel"></div>
</div>
<?php
	wp_footer();
	do_action( 'admin_print_footer_scripts' );
?>
</body>
</html>
