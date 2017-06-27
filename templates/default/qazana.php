<?php
/**
 * Template Name: Page Qazana
 *
 * This template is used for displaying the Visual composer qazana
 *
 * @package NewsFront
 * @since 1.0.0
 */
get_header();
    while ( have_posts() ) : the_post();
        the_content();
    endwhile; // end of the loop.
get_footer();
