<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

qazana()->frontend->add_body_class( 'qazana-template-canvas' );

?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<?php if ( ! current_theme_supports( 'title-tag' ) ) : ?>
		<title><?php echo wp_get_document_title(); ?></title>
	<?php endif; ?>
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
	<?php
	/**
	 * Before canvas page template content.
	 *
	 * Fires before the content of Qazana canvas page template.
	 *
	 * @since 1.0.0
	 */
	do_action( 'qazana/page_templates/canvas/before_content' );

	qazana()->extensions_manager->get_extension( 'page_templates' )->print_content();

	/**
	 * After canvas page template content.
	 *
	 * Fires after the content of Qazana canvas page template.
	 *
	 * @since 1.0.0
	 */
	do_action( 'qazana/page_templates/canvas/after_content' );

	wp_footer();
	?>
	</body>
</html>
