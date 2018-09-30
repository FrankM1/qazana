<?php

namespace Qazana\Extensions;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class DynamicTags_Site extends DynamicTags {

	const AUTHOR_GROUP = 'author';

	const POST_GROUP = 'post';

	const COMMENTS_GROUP = 'comments';

	const SITE_GROUP = 'site';

	const ARCHIVE_GROUP = 'archive';

    /**
     * Extension title
     *
     * @return string
     */
    public function get_title() {
        return __( 'Site Dynamic Tags', 'qazana' );
    }

    /**
	 * Unique extension name
	 *
	 * @return string
	 */
    public function get_name() {
		return 'dynamictags-site';
	}

	public function get_tag_classes_names() {
		return [
			'Archive_Description',
			'Archive_Meta',
			'Archive_Title',
			'Archive_URL',
			'Author_Info',
			'Author_Meta',
			'Author_Name',
			'Author_Profile_Picture',
			'Author_URL',
			'Comments_Number',
			'Comments_URL',
			'Post_Custom_Field',
			'Post_Date',
			'Post_Excerpt',
			'Post_Featured_Image',
			'Post_Gallery',
			'Post_ID',
			'Post_Terms',
			'Post_Time',
			'Post_Title',
			'Post_URL',
			'Site_Logo',
			'Site_Tagline',
			'Site_Title',
			'Site_URL',
			'Current_Date_Time',
		];
	}

	public function get_groups() {
		return [
			self::POST_GROUP => [
				'title' => __( 'Post', 'qazana' ),
			],
			self::ARCHIVE_GROUP => [
				'title' => __( 'Archive', 'qazana' ),
			],
			self::SITE_GROUP => [
				'title' => __( 'Site', 'qazana' ),
			],
			self::COMMENTS_GROUP => [
				'title' => __( 'Comments', 'qazana' ),
			],
			self::AUTHOR_GROUP => [
				'title' => __( 'Author', 'qazana' ),
			],
		];
    }
   
	public function include_files() {
        require 'tags/archive-description.php';
        require 'tags/archive-meta.php';
        require 'tags/archive-title.php';
        require 'tags/archive-url.php';
        require 'tags/author-info.php';
        require 'tags/author-meta.php';
        require 'tags/author-name.php';
        require 'tags/author-profile-picture.php';
        require 'tags/author-url.php';
        require 'tags/comments-number.php';
        require 'tags/comments-url.php';
        require 'tags/current-date-time.php';
        require 'tags/post-custom-field.php';
        require 'tags/post-date.php';
        require 'tags/post-excerpt.php';
        require 'tags/post-featured-image.php';
        require 'tags/post-gallery.php';
        require 'tags/post-id.php';
        require 'tags/post-terms.php';
        require 'tags/post-time.php';
        require 'tags/post-title.php';
        require 'tags/post-url.php';
        require 'tags/site-logo.php';
        require 'tags/site-tagline.php';
        require 'tags/site-title.php';
        require 'tags/site-url.php';
    }
    
    public function __construct() {
        $this->include_files();

        parent::__construct();
    }
}
