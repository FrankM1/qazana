<?php
namespace Builder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

?>
<!DOCTYPE html>
<!--[if lt IE 7]>
<html class="no-js lt-ie9 lt-ie8 lt-ie7" <?php language_attributes(); ?>> <![endif]-->
<!--[if IE 7]>
<html class="no-js lt-ie9 lt-ie8" <?php language_attributes(); ?>> <![endif]-->
<!--[if IE 8]>
<html class="no-js lt-ie9" <?php language_attributes(); ?>> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" <?php language_attributes(); ?>> <!--<![endif]-->
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title><?php echo __( 'Builder', 'builder' ) . ' | ' . get_the_title(); ?></title>
	<?php wp_head(); ?>
</head>
<body class="builder-editor-active">
<div id="builder-editor-wrapper">
	<div id="builder-preview">
		<div id="builder-loading">
			<?php echo builder_loading_indicator(); ?>
		</div>
		<div id="builder-preview-responsive-wrapper" class="builder-device-desktop builder-device-rotate-portrait">
			<div id="builder-preview-loading">
				<i class="fa fa-spin fa-circle-o-notch"></i>
			</div>
			<?php // Iframe will be create here by the Javascript later. ?>
		</div>
	</div>
	<div id="builder-panel" class="builder-panel"></div>
</div>
<?php wp_footer(); ?>
</body>
</html>
