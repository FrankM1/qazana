<?php
namespace Qazana\Extensions\Tags;

use Qazana\Controls_Manager;
use Qazana\Core\DynamicTags\Data_Tag;
use Qazana\Extensions\DynamicTags_Site;
use Qazana\Group_Control_Image_Size;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Post_Featured_Image extends Data_Tag {

	public function get_name() {
		return 'post-featured-image';
	}

	public function get_group() {
		return DynamicTags_Site::POST_GROUP;
	}

	public function get_categories() {
		return [ DynamicTags_Site::IMAGE_CATEGORY ];
	}

	public function get_title() {
		return __( 'Featured Image', 'qazana' );
	}

	public function get_value( array $options = [] ) {
		$thumbnail_id = get_post_thumbnail_id();

		if ( $thumbnail_id ) {
            $settings = $this->get_settings();

            if ( ! isset( $settings[ 'image_size' ] ) ) {
                $settings[ 'image_size' ] = '';
            }

            if ( empty( $settings[ 'image_resize' ] ) ) {
                $size = 'full';
            } else {
                $size = $settings[ 'image_size' ];
            }

            $image_src = Group_Control_Image_Size::get_attachment_image_src( $thumbnail_id, 'image', $settings );

			$image_data = [
				'id' => $thumbnail_id,
				'url' => $image_src,
			];
		} else {
			$image_data = $this->get_settings( 'fallback' );
		}

		return $image_data;
	}

	protected function _register_controls() {

        $this->add_group_control(
			Group_Control_Image_Size::get_type(),
			[
				'name' => 'image', // Usage: `{name}_size` and `{name}_custom_dimension`, in this case `image_size` and `image_custom_dimension`.
				'default' => 'large',
				'separator' => 'none',
			]
        );

		$this->add_control(
			'fallback',
			[
				'label' => __( 'Fallback', 'qazana' ),
				'type' => Controls_Manager::MEDIA,
			]
		);
	}
}
