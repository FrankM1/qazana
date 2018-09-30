<?php
namespace Qazana\Extensions;

use Qazana\Core\DynamicTags\Manager;
use Qazana\Core\DynamicTags\Tag;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Qazana dynamic tags extension.
 *
 * Qazana dynamic tags extension handler class is responsible for registering
 * and managing Qazana dynamic tags modules.
 *
 * @since 2.0.0
 */
class DynamicTags extends Base {

    /**
	 * Extension class reflection.
	 *
	 * Holds the information about a class.
	 *
	 * @since 2.0.0
	 * @access private
	 *
	 * @var \ReflectionClass
	 */
    private $reflection;
    
	/**
	 * Base dynamic tag group.
	 */
	const BASE_GROUP = 'base';

	/**
	 * Dynamic tags text category.
	 */
	const TEXT_CATEGORY = 'text';

	/**
	 * Dynamic tags URL category.
	 */
	const URL_CATEGORY = 'url';

	/**
	 * Dynamic tags image category.
	 */
	const IMAGE_CATEGORY = 'image';

	/**
	 * Dynamic tags media category.
	 */
	const MEDIA_CATEGORY = 'media';

	/**
	 * Dynamic tags post meta category.
	 */
	const POST_META_CATEGORY = 'post_meta';

	/**
	 * Dynamic tags gallery category.
	 */
	const GALLERY_CATEGORY = 'gallery';

	/**
	 * Dynamic tags extension constructor.
	 *
	 * Initializing Qazana dynamic tags extension.
	 *
	 * @since 2.0.0
	 * @access public
	 */
	public function __construct() {
		$this->register_groups();

		add_action( 'qazana/dynamic_tags/register_tags', [ $this, 'register_tags' ] );
    }
    
    /**
	 * @since 2.0.0
	 * @access public
	 */
	public function get_reflection() {
		if ( null === $this->reflection ) {
			$this->reflection = new \ReflectionClass( $this );
		}

		return $this->reflection;
	}

	/**
	 * Get extension name.
	 *
	 * Retrieve the dynamic tags extension name.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return string Extension name.
	 */
	public function get_name() {
		return 'dynamic_tags';
	}

	/**
	 * Get classes names.
	 *
	 * Retrieve the dynamic tag classes names.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return array Tag dynamic tag classes names.
	 */
	public function get_tag_classes_names() {
		return [];
	}

	/**
	 * Get groups.
	 *
	 * Retrieve the dynamic tag groups.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return array Tag dynamic tag groups.
	 */
	public function get_groups() {
		return [
			self::BASE_GROUP => [
				'title' => 'Base Tags',
			],
		];
	}

	/**
	 * Register groups.
	 *
	 * Add all the available tag groups.
	 *
	 * @since 2.0.0
	 * @access private
	 */
	private function register_groups() {
		foreach ( $this->get_groups() as $group_name => $group_settings ) {
			qazana()->dynamic_tags->register_group( $group_name, $group_settings );
		}
	}

	/**
	 * Register tags.
	 *
	 * Add all the available dynamic tags.
	 *
	 * @since  2.0.0
	 * @access public
	 *
	 * @param Manager $dynamic_tags
	 */
	public function register_tags( $dynamic_tags ) {
		foreach ( $this->get_tag_classes_names() as $tag_class ) {
			/** @var Tag $class_name */
            $class_name = $this->get_reflection()->getNamespaceName() . '\Tags\\' . $tag_class;

			$dynamic_tags->register_tag( $class_name );
		}
	}
}
