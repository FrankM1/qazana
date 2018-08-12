<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

qazana()->frontend->add_body_class( 'qazana-template-full-width' );

get_header();
/**
 * Before Header-Footer page template content.
 *
 * Fires before the content of Qazana Header-Footer page template.
 *
 * @since 2.0.0
 */
do_action( 'qazana/page_templates/header-footer/before_content' );

qazana()->extensions_manager->get_extension( 'page_templates' )->print_content();

/**
 * After Header-Footer page template content.
 *
 * Fires after the content of Qazana Header-Footer page template.
 *
 * @since 2.0.0
 */
do_action( 'qazana/page_templates/header-footer/after_content' );

get_footer();
