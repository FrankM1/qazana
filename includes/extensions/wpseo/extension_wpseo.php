<?php
namespace Builder\Extensions;

use Builder\Template_Library;

class WPSEO extends Base {

	public function get_config() {

        return [
        	'title' => __( 'WPSEO Compatibility', 'builder' ),
            'name' => 'wpseo',
        	'required' => true,
        	'default_activation' => true,
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

    }

}
