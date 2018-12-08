<?php
namespace Qazana\Extensions;

class Wordpress_Importer extends Base {

	public function register() {

        return [
        	'title'              => __( 'Wordpress importer', 'qazana' ),
        	'name'               => 'wordpress_importer',
        	'required'           => true,
        	'default_activation' => true,
        ];

	}

    public function __construct() {
    	if ( is_admin() ) {
    		add_filter( 'wp_import_post_meta', [ __CLASS__, 'on_wp_import_post_meta' ] );
            add_filter( 'wxr_importer.pre_process.post_meta', [ __CLASS__, 'on_wxr_importer_pre_process_post_meta' ] );
            add_action( 'import_end', [ __CLASS__, 'on_wxr_importer_end_remap_images' ] );
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

    /**
     * Remap images in Qazana post meta on import with the new WP_importer,
     *
     * @return void
     */
    public static function on_wxr_importer_end_remap_images() {
        global $wpdb;

        // All qazana enabled posts and templates
        $post_ids = $wpdb->get_col(
			'SELECT `post_id` FROM `' . $wpdb->postmeta . '`
					WHERE `meta_key` = \'_qazana_data\';'
        );

        if ( empty( $post_ids ) ) {
			return;
		}

		foreach ( $post_ids as $post_id ) {
			$data = qazana()->db->get_plain_editor( $post_id );
			if ( empty( $data ) ) {
				continue;
			}

			$data = qazana()->db->iterate_data( $data, function( $element ) {
                if ( ! empty( $element['settings']['background_image']['id'] ) ) {
                    $element['settings']['background_image'] = qazana()->templates_manager->get_import_images_instance()->import( $element['settings']['background_image'] );
                }

                if ( ! empty( $element['settings']['image']['id'] ) ) {
                    $element['settings']['image'] = qazana()->templates_manager->get_import_images_instance()->import( $element['settings']['image'] );
                }

				return $element;
			} );

			qazana()->db->save_editor( $post_id, $data );
		}

        qazana()->files_manager->clear_cache();
    }

}
