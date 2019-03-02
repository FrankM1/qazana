<?php
/**
 * The 404 page template file.
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * For example, it puts together the home page when no home.php file exists.
 *
 * Learn more: http://codex.wordpress.org/Template_Hierarchy
 *
 * @package Energia/Templates
 * @since 1.0.0
 */
$post_id = get_the_ID();

// Add element script and css dependencies.
qazana()->get_frontend()->get_dependencies( $post_id );
qazana()->get_frontend()->enqueue_widget_scripts();
qazana()->get_frontend()->enqueue_widget_styles();

get_header();

echo qazana()->get_frontend()->get_builder_content( $post_id, false );

get_footer();
