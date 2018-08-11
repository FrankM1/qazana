<?php
/**
 * Template Name: Qazana Full Width
 *
 * This template is used for displaying a Qazana Layout on a blank page.
 *
 * @package Qazana
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

qazana()->frontend->add_body_class( 'qazana-template-full-width' );

get_header();
/**
 * Before Header-Footer page template content.
 *
 * Fires before the content of Elementor Header-Footer page template.
 *
 * @since 2.0.0
 */
do_action( 'qazana/page_templates/header-footer/before_content' );

while ( have_posts() ) : the_post();
 	the_content();
endwhile;

/**
 * After Header-Footer page template content.
 *
 * Fires after the content of Elementor Header-Footer page template.
 *
 * @since 2.0.0
 */
do_action( 'qazana/page_templates/header-footer/after_content' );

get_footer();
