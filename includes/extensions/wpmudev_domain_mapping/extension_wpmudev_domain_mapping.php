<?php
namespace Qazana\Extensions;

class Wpmudev_Domain_Mapping extends Base {

	public function get_config() {

        $domain_mapping_exist = class_exists( 'domain_map' );

        return [
        	'title' => __( 'Wpmudev Domain Mapping Compatibility', 'qazana' ),
            'name' => 'wpmudev_domain_mapping',
        	'required' => false,
            'default_activation' => $domain_mapping_exist,
        ];

	}

    public function __construct() {
        if ( class_exists( 'domain_map' ) ) {
            add_action( 'init', [ __CLASS__, 'init' ] );
        }
    }

    public static function init() {

        add_filter( 'qazana/utils/preview_url', function( $preview_url ) {
            if ( wp_parse_url( $preview_url, PHP_URL_HOST ) !== $_SERVER['HTTP_HOST'] ) {
                $preview_url = \domain_map::utils()->unswap_url( $preview_url );
                $preview_url = add_query_arg( [
                    'dm' => \Domainmap_Module_Mapping::BYPASS,
                ], $preview_url );
            }

            return $preview_url;
        } );

    }

}
