<?php
/**
 * This file is a part of the Radium Framework core.
 * Please be cautious editing this file,
 *
 * @package Radium\Functions
 * @subpackage  NewsFront
 * @author   Franklin M Gitonga
 * @link     http://builderthemes.com/
 */

/**
 * Pull an attachment ID from a post, if one exists.
 *
 * @since 1.0.0
 *
 * @param integer $index Optional. Index of which image to return from a post. Default is 0.
 *
 * @return integer|boolean Returns image ID, or false if image with given index does not exist.
 */
function builder_get_image_id( $index = 0, $post_id = null ) {

    $image_ids = array_keys(
        get_children(
            array(
                'post_parent'    => $post_id ? $post_id : get_the_ID(),
                'post_type'	     => 'attachment',
                'post_mime_type' => 'image',
                'orderby'        => 'menu_order',
                'order'	         => 'ASC',
            )
        )
    );

    if ( isset( $image_ids[ $index ] ) ) {
        return $image_ids[ $index ];
    }

    return false;

}

/**
 * Check if post has an image attached.
 *
 * @since 1.0.0
 *
 * @param int $post_id Optional. Post ID.
 * @return bool Whether post has an image attached.
 */
function builder_has_post_thumbnail( $post_id = null ) {
    return (bool) builder_get_post_thumbnail_id( $post_id );
}

/**
 * Retrieve Post Thumbnail ID.
 *
 * @since 1.0.0
 *
 * @param int|null $post_id Optional. Post ID.
 * @return mixed
 */
function builder_get_post_thumbnail_id( $post_id = null ) {

    $post_id = ( null === $post_id ) ? get_the_ID() : $post_id;
    $post_thumbnail_id = get_post_meta( $post_id, '_thumbnail_id', true );

    /**
     * Filter the image id result.
     *
     * @since 1.0.0
     *
     * @param int  $post_thumbnail_id     The featured image id
     * @param int  $post_id         the parent id
     */
    return apply_filters( 'builder_get_post_thumbnail_id', $post_thumbnail_id, $post_id );
}

 /**
  * Gallery Central master get image function.
  *
  * @param array $args
  *
  * @return string
  */
 function builder_get_image( $args = array() ) {

    $defaults = array(
        'wrap'				=> '<a %HREF% %CLASS% %TITLE% %CUSTOM%><img %SRC% %IMG_CLASS% %SIZE% %ALT% %IMG_TITLE% /></a>',
        'class'         	=> '',
        'alt'				=> '',
        'title'         	=> '',
        'custom'        	=> '',
        'img_class'     	=> '',
        'img_title'		=> '',
        'img_description'	=> '',
        'img_caption'		=> '',
        'href'				=> '',
        'img_meta'      	=> array(),
        'img_id'			=> 0,
        'options'    		=> array(
            'w'            => '500', // required
            'h'            => '',
            'zc'           => 1, // 0, 1, 3
            'z'            => 1, // 1
        ),
        'default_img'		=> wp_get_attachment_image_src( builder_get_default_image_id(), 'full' ),
        'aspect_ratio'		=> 1.66667, // aspect ratio
        'src'  			    => false,
        'srcset_2x'         => false,
    );

    $args = builder_parse_args( $args, $defaults, 'get_thumb_img' );

    if ( ! isset( $args['options']['retina'] ) ) {
        $args['options']['retina'] = builder_get_meta_retina_on();
    }

    if ( ! builder_get_meta_is_hd_device() ) {
        $args['options']['retina'] = false;
    }

    if ( ! isset( $args['options']['crop'] ) ) {
        $args['options']['crop'] = true;
    }

    if ( ! isset( $args['options']['use_srcset'] ) ) {
        $args['options']['use_srcset'] = true;
    }

    if ( ! isset( $args['options']['hd_convert'] ) ) {
        $args['options']['hd_convert'] = true;
    }

    $original_image = $srcset_2x_resized_images = null;

     if ( $args['img_meta'] ) {
        $original_image = $args['img_meta'];
     } elseif ( $args['img_id'] ) {
        $original_image = wp_get_attachment_image_src( $args['img_id'], 'full' );
     } elseif ( 0 == $args['img_id'] ) {
        $original_image = wp_get_attachment_image_src( builder_get_post_thumbnail_id(), 'full' );
     }

     if ( ! $original_image ) {
        $original_image = $args['default_img'];
     }

     // proportion
     if ( $original_image && ! empty( $args['aspect_ratio'] ) && ! empty( $args['options']['w'] ) ) {

         // override with propotions from variable
         if ( ! empty( $args['options']['w'] ) && ! empty( $args['aspect_ratio'] ) ) {

            $__prop = $args['aspect_ratio'];
            $w 		= intval( $args['options']['w'] );
            $h 		= builder_calculate_image_height_by_aspect( $w, $args['aspect_ratio'] );

        } elseif ( ! empty( $args['options']['w'] ) && ! empty( $args['options']['h'] ) && ! $args['aspect_ratio'] ) {

            $w 		= intval( $args['options']['w'] );
            $h 		= intval( $args['options']['h'] );
            $__prop = $w / $h;

        } elseif ( ! empty( $args['options']['h'] ) && ! empty( $args['options'] ) ) {

            $__prop = $args['aspect_ratio'];
            $h 		= intval( $args['options']['h'] );
            $w 		= intval( floor( $__prop * $h ) );

        } else {

            $_img_meta = $original_image;
            $_prop = $args['aspect_ratio'];

            if ( $_prop > 1 ) {
                $h = builder_calculate_image_height_by_aspect( $_img_meta[1], $_prop );
                $w = intval( floor( $_prop * $h ) );
            } else if ( $_prop < 1 ) {
                $w = intval( floor( $_prop * $_img_meta[2] ) );
                $h = builder_calculate_image_height_by_aspect( $w, $_prop );
            } else {
                $w = min( $_img_meta[1], $_img_meta[2] );
            }
        }

        $args['options']['w'] = $w;
        $args['options']['h'] = $h;

    }

    if ( $args['options'] ) {

        $resized_image = builder_get_resized_img( $original_image, $args['options'], true, false );
        $src = apply_filters( 'builder_get_thumb_image_src', $resized_image[0], $args );

        if ( $args['options']['use_srcset'] ) {

            $resized_2x_image_hd = builder_get_resized_img( $original_image, $args['options'], true, true );
            $srcset_2x = apply_filters( 'builder_get_thumb_image_srcset_2x', $resized_2x_image_hd[0], $args );

            $srcset_2x_resized_images = $srcset_2x .' 2x';
        }
    } else {

        $resized_image = $original_image;
    }

    if ( $img_id = absint( $args['img_id'] ) ) {

        if ( '' === $args['alt'] ) {
            $args['alt'] = get_post_meta( $img_id, '_wp_attachment_image_alt', true );
        }

        if ( '' === $args['img_title'] ) {
            $args['img_title'] = get_the_title( $img_id );
        }
    }

    $class = empty( $args['class'] ) ? '' : 'class="' . esc_attr( trim( $args['class'] ) ) . '"';
    $title = empty( $args['title'] ) ? '' : 'title="' . esc_attr( trim( $args['title'] ) ) . '"';
    $img_title = empty( $args['img_title'] ) ? '' : 'title="' . esc_attr( trim( $args['img_title'] ) ) . '"';
    $img_class = empty( $args['img_class'] ) ? '' : 'class="' . esc_attr( trim( $args['img_class'] ) ) . '"';

    $href = $args['href'];
    if ( ! $href ) {
        $href = $original_image[0];
    }

    if ( $args['srcset_2x'] ) {
        return esc_url( $srcset_2x );
    }

    // Comes last if only an image url is needed
    if ( $args['src'] ) {
        return esc_url( $src );
    }

    if ( empty( $src ) ) {
        return false;
    }

    if ( empty( $args['options']['use_srcset'] ) ) {
        $src_att = 'src="' . esc_url( $src ) . '"';
    } else {
        $src_att = 'src="' . esc_url( $src ) . '"';
        $srcset_att = ' srcset="' . esc_attr( $srcset_2x ) . '"';
    }

    if ( empty( $resized_image[3] ) || ! is_string( $resized_image[3] ) ) {
        $size = image_hwstring( $resized_image[1], $resized_image[2] );
    } else {
        $size = $resized_image[3];
    }

     $output = str_replace(
         array(
             '%HREF%',
             '%CLASS%',
             '%TITLE%',
             '%CUSTOM%',
             '%SRC%',
             '%IMG_CLASS%',
             '%SIZE%',
             '%ALT%',
             '%IMG_TITLE%',
             '%RAW_TITLE%',
             '%RAW_ALT%',
             '%RAW_IMG_TITLE%',
             '%RAW_IMG_DESCRIPTION%',
             '%RAW_IMG_CAPTION',
         ),
         array(
             'href="' . esc_url( $href ) . '"',
             $class,
             $title,
             strip_tags( $args['custom'] ),
             $src_att . $srcset_att,
             $img_class,
             $size,
             'alt="' . esc_attr( $args['alt'] ) . '"',
             $img_title,
             esc_attr( $args['title'] ),
             esc_attr( $args['alt'] ),
             esc_attr( $args['img_title'] ),
             esc_attr( $args['img_description'] ),
             esc_attr( $args['img_caption'] ),
         ),
         $args['wrap']
     );

     return $output;
 }

     /**
      * Echo Radium master get image function.
      *
      * @param $args array
      *
      * @return string
      */
     function builder_image_html( $args = array() ) {
         echo builder_get_image( $args );
     }

 /**
  * Resize image to specific dimensions.
  *
  * Evaluate new width and height.
  * $img - image meta array($img[0] - image url, $img[1] - width, $img[2] - height).
  * $args - options array, supports w, h, zc, a, q.
  *
  * @param array $img
  * @param $args array of options
  *
  * @return array
  */
 function builder_get_resized_img( $img, $args, $resize = true, $is_retina = false ) {

    $args = apply_filters( 'builder_get_resized_img_options', $args, $img );

    if ( ! is_array( $img ) || ( ! $img[1] && ! $img[2]) ) {
        return false;
    }

    if ( ! is_array( $args ) ) {

        if ( ! isset( $img[3] ) ) {
            $img[3] = image_hwstring( $img[1], $img[2] );
        }

        return $img;
    }

   if ( ! isset( $args['options']['crop'] ) ) {
         $args['options']['crop'] = true;
     }

     if ( ! isset( $args['hd_convert'] ) ) {
         $args['hd_convert'] = true;
     }

    $defaults = array(
        'w'    => 0,
        'h'    => 0,
        'zc'   => 1,
        'z'    => 1,
    );

    $args = builder_parse_args( $args, $defaults, 'get_resized_img' );

     $w = absint( $args['w'] );
     $h = absint( $args['h'] );

     // If zoomcropping off and image smaller then required square
     if ( 0 == $args['zc'] && ( $img[1] <= $w  && $img[2] <= $h ) ) {

         return array( $img[0], $img[1], $img[2], image_hwstring( $img[1], $img[2] ) );

     } elseif ( 3 == $args['zc'] || empty( $w ) || empty( $h ) ) {

         if ( 0 == $args['z'] ) {
             builder_resizer_constrain_dim( $img[1], $img[2], $w, $h, true );
         } else {
             $p = absint( $img[1] ) / absint( $img[2] );
             $hx = absint( floor( $w / $p ) );
             $wx = absint( floor( $h * $p ) );

             if ( empty( $w ) ) {
                 $w = $wx;
             } elseif ( empty( $h ) ) {
                 $h = $hx;
             } else {
                 if ( $hx < $h && $wx >= $w ) {
                     $h = $hx;
                 } elseif ( $wx < $w && $hx >= $h ) {
                     $w = $wx;
                 }
             }
         }

        if ( $img[1] == $w && $img[2] == $h ) {
            return array( $img[0], $img[1], $img[2], image_hwstring( $img[1], $img[2] ) );
        }
     }

     $img_h = $h;
     $img_w = $w;

    if ( $args['hd_convert'] && $is_retina ) {
        $img_h *= 2;
        $img_w *= 2;
    }

    if ( 1 == $args['zc'] ) {

        if ( $img[1] >= $img_w && $img[2] >= $img_h ) {

        // do nothing
        } else if ( $img[1] <= $img[2] && $img_w >= $img_h ) { // img=portrait; c=landscape

            $cw_new = $img[1];
            $k = $cw_new / $img_w;
            $ch_new = $k * $img_h;

        } else if ( $img[1] >= $img[2] && $img_w <= $img_h ) { // img=landscape; c=portrait

            $ch_new = $img[2];
            $k = $ch_new / $img_h;
            $cw_new = $k * $img_w;

        } else {

            $kh = $img_h / $img[2];
            $kw = $img_w / $img[1];
            $kres = max( $kh, $kw );
            $ch_new = $img_h / $kres;
            $cw_new = $img_w / $kres;

        }

        if ( isset( $ch_new, $cw_new ) ) {
            $img_h = absint( floor( $ch_new ) );
            $img_w = absint( floor( $cw_new ) );
        }
    }

    if ( $resize ) {
        $file_url = builder_resize( $img[0], $img_w, $img_h, $args['options']['crop'], true, false );
    }

    if ( empty( $file_url ) ) {
        $file_url = $img[0];
    }

    return array(
        $file_url,
        $w,
        $h,
        image_hwstring( $w, $h )
     );
 }

 /**
  * Constrain dimensions helper.
  *
  * @param $w0 int
  * @param $h0 int
  * @param $w1 int
  * @param $h1 int
  * @param $change boolena
  *
  * @return array
  */
function builder_resizer_constrain_dim( $w0, $h0, &$w1, &$h1, $change = false ) {

    $prop_sizes = wp_constrain_dimensions( $w0, $h0, $w1, $h1 );

    if ( $change ) {
        $w1 = $prop_sizes[0];
        $h1 = $prop_sizes[1];
    }
    return array( $w1, $h1 );
}

if ( ! function_exists( 'builder_resize' ) ) {

    /**
     * This is just a tiny wrapper function for the class above so that there is no
     * need to change any code in your own WP themes. Usage is still the same :)
     */
    function builder_resize( $url, $width = null, $height = null, $crop = null, $single = true, $upscale = false ) {

        /* WPML Fix */
        if ( defined( 'ICL_SITEPRESS_VERSION' ) ){
            global $sitepress;
            $url = $sitepress->convert_url( $url, $sitepress->get_default_language() );
        }
        /* WPML Fix */

        $resizer = Radium_Aq_Resize::getInstance();

        return $resizer->process( $url, $width, $height, $crop, $single, $upscale );
    }

}

/**
 * Register Image Sizes
 *
 * @since 1.0.0
 */
function builder_framework_add_image_sizes( $add_image_size = false ) {

    // Content Width
    $content_width = apply_filters( 'builder_framework_content_width', 1240 ); // Default width of primary content area

    // Crop sizes
    $sizes = array(
        'builder_large' => array(
            'width'     => $content_width,  // 940 => Full width thumb for 1-col page
            'height'    => 9999,
            'crop'      => false
        ),
        'builder_medium' => array(
            'width'     => 750,             // 620 => Full width thumb for 2-col/3-col page
            'height'    => 9999,
            'crop'      => false
        ),
        'builder_small' => array(
            'width'     => 195,             // Square'ish thumb floated left
            'height'    => 195,
            'crop'      => false
        ),

        'content_carousel_large' => array(
            'width'     => 827,
            'height'    => 430,
            'crop'      => true
        ),

        'content_list_large_1' => array(
            'width'     => 440,
            'height'    => 273,
            'crop'      => true
        ),

        'content_list_large_2' => array(
            'width'     => 440,
            'height'    => 273,
            'crop'      => true
        ),

        'content_list_1' => array(
            'width'     => 100,
            'height'    => 70,
            'crop'      => true
        ),

    );

    $sizes = apply_filters( 'builder_framework_image_sizes', $sizes );

    if ( $add_image_size ) {

        // Add image sizes
        foreach ( $sizes as $size => $atts ) {
            add_image_size( $size, $atts['width'], $atts['height'], $atts['crop'] );
        }
    }

    return $sizes;
}

/**
 * Calculate image height
 *
 * @param int $srcWidth
 * @param int $srcHeight
 * @param int $maxWidth
 * @param int $maxHeight
 *
 * @since  1.0.0
 *
 * @return array width and height
 */
function builder_calculate_image_height( $srcWidth, $srcHeight, $maxWidth, $maxHeight ) {

    $ratio1 = $maxWidth / $srcWidth;

    $ratio2 = $maxHeight / $srcHeight;

    $ratio = min( $ratio1, $ratio2 );

    $width = $srcWidth * $ratio;

    $height = $srcHeight * $ratio;

    return array( $width, $height );

}

/**
 * Calculate image height by aspect ratio
 *
 * @param int $width
 * @param num $aspect
 *
 * @since  1.0.0
 *
 * @return string height
 */
function builder_calculate_image_height_by_aspect( $width, $aspect = '1.66669' ) {

    $height = intval( floor( $width / $aspect ) );

    return $height;

}

add_filter( 'builder_get_thumb_image_src', 'builder_images_ssl_friendly', 10, 2 );
/**
 * Make resized images ssl friendly
 *
 * @param  [type] $src  [description]
 * @param  [type] $args [description]
 * @return [type]       [description]
 */
function builder_images_ssl_friendly( $src, $args ) {

    $src = builder_url_ssl_friendly( $src );

    return $src;
}

/**
 * Get image metadata
 *
 * @param  [type] $src  [description]
 * @param  [type] $args [description]
 * @return [type]       [description]
 */
function builder_get_image_metadata( $image_id = null ) {

    $image_id = ! empty( $image_id ) ? $image_id : get_post_thumbnail_id( get_the_ID() );

    $attachment = get_post( $image_id );

    if ( ! empty( $attachment ) ) {
        $metadata = array(
            'alt' => get_post_meta( $attachment->ID, '_wp_attachment_image_alt', true ),
            'caption' => $attachment->post_excerpt,
            'description' => $attachment->post_content,
            'title' => $attachment->post_title,
            'href' => get_permalink( $attachment->ID ),
            'src' => $attachment->guid,
        );
    } else {
        $metadata = array();
    }

    return apply_filters( __FUNCTION__, $metadata, $image_id );
}

/**
 * Retina on flag.
 *
 * @return boolean
 */
function builder_get_meta_retina_on() {

    $retval = get_option( 'retina-images' );

    return apply_filters( __FUNCTION__, $retval );
}

/**
 * Get device pixel ratio cookie value and check if it greater than 1.
 *
 * @return boolean
 */
function builder_get_meta_is_hd_device() {

    $retval = true;

    return $retval;
}
