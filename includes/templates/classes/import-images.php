<?php
namespace Qazana\Template_Library\Classes;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Qazana template library import images.
 *
 * Qazana template library import images handler class is responsible for
 * importing remote images used by the template library.
 *
 * @since 1.0.0
 */
class Import_Images {

	/**
	 * Replaced images IDs.
	 *
	 * The IDs of all the new imported images. An array containing the old
	 * attachment ID and the new attachment ID generated after the import.
	 *
	 * @since 1.0.0
	 * @access private
	 *
	 * @var array
	 */
	private $_replace_image_ids = [];

	/**
	 * Get image hash.
	 *
	 * Retrieve the sha1 hash of the image URL.
	 *
	 * @since 2.0.0
	 * @access private
	 *
	 * @param string $attachment_url The attachment URL.
	 *
	 * @return string Image hash.
	 */
	private function get_hash_image( $attachment_url ) {
		return sha1( $attachment_url );
	}

	/**
	 * Get saved image.
	 *
	 * Retrieve new image ID, if the image has a new ID after the import.
	 *
	 * @since 2.0.0
	 * @access private
	 *
	 * @param array $attachment The attachment.
	 *
	 * @return false|array New image ID  or false.
	 */
	private function get_saved_image( $attachment ) {
		global $wpdb;

		if ( isset( $this->_replace_image_ids[ $attachment['id'] ] ) ) {
			return $this->_replace_image_ids[ $attachment['id'] ];
		}

		$post_id = $wpdb->get_var(
			$wpdb->prepare(
				'SELECT `post_id` FROM `' . $wpdb->postmeta . '`
					WHERE `meta_key` = \'_qazana_source_image_hash\'
						AND `meta_value` = %s
				;',
				$this->get_hash_image( $attachment['url'] )
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
	 * Import image.
	 *
	 * Import a single image from a remote server, upload the image WordPress
	 * uploads folder, create a new attachment in the database and updates the
	 * attachment metadata.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param array $attachment The attachment.
	 *
	 * @return false|array Imported image data, or false.
	 */
    	public function import( $attachment ) {

        add_filter( 'http_request_timeout', array( &$this, 'bump_request_timeout' ) );

        $saved_image = $this->get_saved_image( $attachment );
        if ( $saved_image ) {
            return $saved_image;
	}

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

        if ( ! function_exists( 'wp_generate_attachment_metadata' ) ) {
            require_once ABSPATH . 'wp-admin/includes/image.php';
        }

        // as per wp-admin/includes/upload.php
        $post_id = wp_insert_attachment( $post, $upload['file'] );
        wp_update_attachment_metadata( $post_id, wp_generate_attachment_metadata( $post_id, $upload['file'] ) );
        update_post_meta( $post_id, '_qazana_source_image_hash', $this->get_hash_image( $attachment['url'] ) );

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
		return apply_filters( 'qazana_import_attachment_size_limit', 0 );
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
