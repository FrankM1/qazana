<?php
namespace Builder\Template_Library;

class Import_Images {

    private $_replace_image_ids = [];

    private function _get_hash_image( $attachment_url ) {
        return sha1( $attachment_url );
    }

    private function _return_saved_image( $attachment ) {
        global $wpdb;

        if ( isset( $this->_replace_image_ids[ $attachment['id'] ] ) )
            return $this->_replace_image_ids[ $attachment['id'] ];

        $post_id = $wpdb->get_var(
            $wpdb->prepare(
                'SELECT `post_id` FROM %1$s
                    WHERE `meta_key` = \'_builder_source_image_hash\'
                        AND `meta_value` = \'%2$s\'
                ;',
                $wpdb->postmeta,
                $this->_get_hash_image( $attachment['url'] )
            )
        );

        if ( $post_id ) {
            $new_attachment = [
                'id' => $post_id,
                'url' => wp_get_attachment_url( $post_id ),
            ];
            $this->_replace_image_ids[ $attachment['id'] ] = $new_attachment;

            return $new_attachment;
        }

        return false;
    }

    /**
     * If fetching attachments is enabled then attempt to create a new attachment
     *
     * @param array $post Attachment post details from WXR
     * @param string $url URL to fetch attachment from
     * @return int|WP_Error Post ID on success, WP_Error otherwise
     */
    function import( $attachment ) {

        add_filter( 'http_request_timeout', array( &$this, 'bump_request_timeout' ) );

        $saved_image = $this->_return_saved_image( $attachment );
        if ( $saved_image )
            return $saved_image;

        $url = $attachment['url'];

        // extract the file name and extension from the url
        $filename = basename( $url );

        $upload = $this->fetch_remote_file( $url );
        if ( is_wp_error( $upload ) )
            return $attachment;

        $post = [
            'post_title' => $filename,
            'guid' => $upload['url'],
        ];

        $info = wp_check_filetype( $upload['file'] );
        if ( $info ) {
            $post['post_mime_type'] = $info['type'];
        } else {
            return $attachment;
        }

        // as per wp-admin/includes/upload.php
        $post_id = wp_insert_attachment( $post, $upload['file'] );
        wp_update_attachment_metadata(
            $post_id,
            wp_generate_attachment_metadata( $post_id, $upload['file'] )
        );
        update_post_meta( $post_id, '_builder_source_image_hash', $this->_get_hash_image( $attachment['url'] ) );

        $new_attachment = [
            'id' => $post_id,
            'url' => $upload['url'],
        ];
        $this->_replace_image_ids[ $attachment['id'] ] = $new_attachment;
        return $new_attachment;
    }

    /**
	 * Attempt to download a remote file attachment
	 *
	 * @param string $url URL of item to fetch
	 * @param array $post Attachment details
	 * @return array|WP_Error Local file location details on success, WP_Error otherwise
	 */
	protected function fetch_remote_file( $url ) {
		// extract the file name and extension from the url
		$filename = basename( $url );

		// get placeholder file in the upload dir with a unique, sanitized filename
		$upload = wp_upload_bits( $filename, 0, '' );
		if ( $upload['error'] ) {
            return false;
		}

		// fetch the remote url and write it to the placeholder file
		$response = wp_remote_get( $url, array(
			'stream' => true,
			'filename' => $upload['file'],
		) );

		// request failed
		if ( is_wp_error( $response ) ) {
			unlink( $upload['file'] );
			return $response;
		}

		$code = (int) wp_remote_retrieve_response_code( $response );

		// make sure the fetch was successful
		if ( $code !== 200 ) {
			unlink( $upload['file'] );
            return false;
		}

		$filesize = filesize( $upload['file'] );
		$headers = wp_remote_retrieve_headers( $response );

		if ( isset( $headers['content-length'] ) && $filesize !== (int) $headers['content-length'] ) {
			unlink( $upload['file'] );
			return false;
		}

		if ( 0 === $filesize ) {
			unlink( $upload['file'] );
            return false;
		}

		$max_size = (int) $this->max_attachment_size();
		if ( ! empty( $max_size ) && $filesize > $max_size ) {
			unlink( $upload['file'] );
            return false;
		}

		return $upload;
	}

    /**
	 * Decide what the maximum file size for downloaded attachments is.
	 * Default is 0 (unlimited), can be filtered via import_attachment_size_limit
	 *
	 * @return int Maximum attachment file size to import
	 */
	protected function max_attachment_size() {
		return apply_filters( 'builder_import_attachment_size_limit', 0 );
	}

    /**
	 * Added to http_request_timeout filter to force timeout at 60 seconds during import
	 *
	 * @access protected
	 * @return int 60
	 */
	function bump_request_timeout($val) {
		return 60;
	}

    public function __construct() {}
}
