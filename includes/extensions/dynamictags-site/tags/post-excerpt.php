<?php
namespace Qazana\Extensions\Tags;

use Qazana\Core\DynamicTags\Tag;
use Qazana\Extensions\DynamicTags_Site;
use Qazana\Controls_Manager;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Post_Excerpt extends Tag {
	public function get_name() {
		return 'post-excerpt';
	}

	public function get_title() {
		return __( 'Post Excerpt', 'qazana' );
	}

	public function get_group() {
		return DynamicTags_Site::POST_GROUP;
	}

	public function get_categories() {
		return [ DynamicTags_Site::TEXT_CATEGORY ];
	}

	protected function _register_controls() {

		$this->add_responsive_control( 'content_limit', [
			'type'        => Controls_Manager::NUMBER,
			'label'       => esc_html__( 'Excerpt limit', 'qazana' ),
			'description' => esc_html__( 'How many characters to display in the excerpt section.', 'qazana' ),
			'default'     => 150,
			'label_block' => true,
		]);

		$this->add_responsive_control( 'read_more_style', [
			'type'    => Controls_Manager::SELECT,
			'label'   => esc_html__( 'Content limit style', 'qazana' ),
			'default' => 'preset',
			'label_block' => true,
			'options' => array(
				'preset' => esc_html__( 'Preset',  'qazana' ),
				'custom' => esc_html__( 'Custom',  'qazana' ),
			),
		]);

	    $this->add_responsive_control( 'read_more_text', [
			'type'        => Controls_Manager::TEXT,
			'label'       => esc_html__( 'Read more text', 'qazana' ),
			'description' => esc_html__( 'Display read more link', 'qazana' ),
			'label_block' => true,
			'condition'   => [
				'content_limit!'  => '',
				'read_more_style' => 'custom',
            ],
		]);

	}


/**
 * Return a phrase shortened in length to a maximum number of characters.
 *
 * Result will be truncated at the last white space in the original string. In this function the word separator is a
 * single space. Other white space characters (like newlines and tabs) are ignored.
 *
 * If the first `$max_characters` of the string does not contain a space character, an empty string will be returned.
 *
 * @since 1.0.0
 *
 * @param string $text A string to be shortened.
 * @param integer $max_characters The maximum number of characters to return.
 *
 * @return string Truncated string
 */
function truncate_phrase( $text, $max_characters ) {

    $text = trim( $text );

    if ( mb_strlen( $text ) > $max_characters ) {
        // Truncate $text to $max_characters + 1
        $text = mb_substr( $text, 0, $max_characters + 1 );

        // Truncate to the last space in the truncated string
        $text_trim = trim( mb_substr( $text, 0, strripos( $text, ' ' ) ) );

        $text = empty( $text_trim ) ? $text : $text_trim;
    }

    return $text;
 }


	/**
 * Return stripped down and limited content.
 *
 * Strips out tags and shortcodes, limits the output to `$max_char` characters, and appends an ellipsis and more link to the end.
 *
 * @since 1.0.0
 *
 * @param integer $max_characters The maximum number of characters to return.
 * @param string  $more_link_text Optional. Text of the more link. Default is "(more...)".
 * @param bool    $stripteaser    Optional. Strip teaser content before the more text. Default is false.
 *
 * @return string Limited content.
 */
function get_the_content_limit( $max_characters, $more_link_text = '(more...)', $stripteaser = false, $content = '' ) {

    if ( empty( $content ) ) {
        $content = get_the_content( '', $stripteaser );
    }

    // Strip tags and shortcodes so the content truncation count is done correctly
    $content = strip_tags( strip_shortcodes( $content ), apply_filters( 'qazana_post-excerpt_get_the_content_limit_allowedtags', '<script>,<style>' ) );

    // Fallback for stripping shortcodes. strip_shortcodes() doesn't always work.
    $content = preg_replace( '#\[[^\]]+\]#', '', $content );

    // Remove urls
    $content = preg_replace('#(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?#', '', $content); // https://css-tricks.com/snippets/php/find-urls-in-text-make-links/

    // Remove inline styles / scripts
    $content = trim( preg_replace( '#<(s(cript|tyle)).*?</\1>#si', '', $content ) );

    // Truncate $content to $max_char
    $content = $this->truncate_phrase( $content, $max_characters );

    // More link?
    if ( $more_link_text ) {
        $link   = apply_filters( 'get_the_content_more_link', sprintf( '&#x02026; <a href="%s" class="more-link">%s</a>', get_permalink(), $more_link_text ), $more_link_text );
        $output = sprintf( '<p>%s %s</p>', $content, $link );
    } else {
        $output = sprintf( '<p>%s</p>', $content );
        $link = '';
    }

    return apply_filters( '$this->get_the_content_limit', $output, $content, $link, $max_characters );
}

	 /**
	 * Hack to get correct post format since WordPress has no filter for 'get_post_format'
	 *
	 * @return void
	 */
	public function get_post_format() {
		return apply_filters( 'qazana_queries_post_type_format', get_post_format() );
	}

	protected function get_excerpt() {

		$read_more_text = $this->get_settings( 'read_more_text' );
		$read_more_style = $this->get_settings( 'read_more_style' );
		$content_limit = $this->get_responsive_settings( 'content_limit' );

	    if ( ( get_post_type() === 'video' ) && function_exists( 'video_central' ) ) {

	        $output = $this->get_the_content_limit( (int) $content_limit, '', false, video_central_get_excerpt( get_the_ID() ) );
	        if ( ! empty( $read_more_text ) ) {
	            $output .= sprintf( '<a href="%s" class="more-link go-right"><span>%s</span></a>', esc_url( get_permalink() ), esc_html( $read_more_text ) );
	        }
			return $output;
	    }

	    $output = $this->get_the_content_limit( (int) $content_limit, '' );

	    if ( ! empty( $content_limit ) && $read_more_style === 'preset' ) {

	        $post_format = $this->get_post_format();

	        if ( $post_format === 'video' ) {
	            $more = __( 'Watch Video', 'qazana' );
	        } elseif (  $post_format === 'audio' ) {
	            $more = __( 'Listen to Audio', 'qazana' );
	        } else {
	            $more = __( 'Read full story', 'qazana' );
	        }

	        $output .= sprintf( '<a href="%s" class="more-link go-right"><span>%s</span></a>', esc_url( get_permalink() ), esc_html( $more ) );

	    } elseif ( ! empty( $content_limit ) && $read_more_style === 'custom' && ! empty( $read_more_text ) ) {
	        $output .= sprintf( '<a href="%s" class="more-link go-right"><span>%s</span></a>', esc_url( get_permalink() ), esc_html( $read_more_text ) );
	    }

		return $output;
	}

	public function render() {
		echo $this->get_excerpt();
	}
}
