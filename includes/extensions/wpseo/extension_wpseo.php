<?php
namespace Qazana\Extensions;

use Qazana\Template_Library;

class WPSEO extends Base {

	public function register() {

        $wpseo_exists = class_exists( '\wpseo_sitemaps_supported_post_types' );

        return [
        	'title' => __( 'WPSEO Compatibility', 'qazana' ),
            'name' => 'wpseo',
        	'required' => false,
        	'default_activation' => $wpseo_exists,
        ];

	}

    public function __construct() {

        // Exclude our Library from sitemap.xml in Yoast SEO plugin
        add_filter( 'wpseo_sitemaps_supported_post_types', function( $post_types ) {
            unset( $post_types[ Template_Library\Source_Local::CPT ] );

            return $post_types;
        } );

		add_filter( 'wpseo_sitemap_exclude_post_type', function( $retval, $post_type ) {
			if ( Template_Library\Source_Local::CPT === $post_type ) {
				$retval = true;
			}

			return $retval;
        }, 10, 2 );
        
        // Compatibility with Yoast SEO plugin when 'Removes unneeded query variables from the URL' enabled.
		if ( qazana()->get_preview()->is_preview_mode() && class_exists( 'WPSEO_Frontend' ) ) {
			remove_action( 'template_redirect', [ \WPSEO_Frontend::get_instance(), 'clean_permalink' ], 1 );
		}
    }

}
