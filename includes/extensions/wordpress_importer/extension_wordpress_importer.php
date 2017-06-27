<?php
namespace Qazana\Extensions;

class Wordpress_Importer extends Base {

	public function get_config() {

        return [
        	'title' => __( 'Wordpress importer', 'qazana' ),
            'name' => 'wordpress_importer',
        	'required' => true,
        	'default_activation' => true,
        ];

	}

    public function __construct() {
    	if ( is_admin() ) {
    		add_filter( 'wp_import_post_meta', [ __CLASS__, 'on_wp_import_post_meta' ] );
    		add_filter( 'wxr_importer.pre_process.post_meta', [ __CLASS__, 'on_wxr_importer_pre_process_post_meta' ] );
    	}
    }

    /**
     * Normalize Qazana post meta on import,
     * We need the `wp_slash` in order to avoid the unslashing during the `add_post_meta`
     *
     * @param array $post_meta
     *
     * @return array
     */
    public static function on_wp_import_post_meta( $post_meta ) {
        foreach ( $post_meta as &$meta ) {
            if ( '_qazana_data' === $meta['key'] ) {
                $meta['value'] = wp_slash( $meta['value'] );
                break;
            }
        }

		return $post_meta;
	}

	/**
	 * Normalize Qazana post meta on import with the new WP_importer,
	 * We need the `wp_slash` in order to avoid the unslashing during the `add_post_meta`
	 *
	 * @param array $post_meta
	 *
	 * @return array
	 */

	public static function on_wxr_importer_pre_process_post_meta( $post_meta ) {
		if ( '_qazana_data' === $post_meta['key'] ) {
			$post_meta['value'] = wp_slash( $post_meta['value'] );
		}

		return $post_meta;
	}

}
