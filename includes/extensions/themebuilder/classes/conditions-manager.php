<?php
namespace Qazana\Extensions\ThemeBuilder\Classes;

use Qazana\Core\Ajax_Manager;
use Qazana\Core\Utils\Exceptions;
use Qazana\Template_Library\Source_Local;
use Qazana\Extensions\ThemeBuilder;
use Qazana\Extensions\ThemeBuilder\Documents\Theme_Document;
use Qazana\Extensions\ThemeBuilder\Conditions\Condition_Base;


if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Conditions_Manager {

	/**
	 * @var Condition_Base[]
	 */
	private $conditions = [];

	/**
	 * @var Conditions_Cache
	 */
	private $cache;

	public function __construct() {
		$this->cache = new Conditions_Cache();

		add_action( 'init', [ $this, 'register_conditions' ], 11 ); // After Plugins Registered CPT.
		add_action( 'wp_trash_post', [ $this, 'purge_post_from_cache' ] );
		add_action( 'untrashed_post', [ $this, 'on_untrash_post' ] );
		add_action( 'qazana/ajax/register_actions', [ $this, 'register_ajax_actions' ] );

		add_action( 'manage_' . Source_Local::CPT . '_posts_columns', [ $this, 'admin_columns_headers' ] );
		add_action( 'manage_' . Source_Local::CPT . '_posts_custom_column', [ $this, 'admin_columns_content' ] , 10, 2 );
	}

	public function on_untrash_post( $post_id ) {
		$document = ThemeBuilder::instance()->get_document( $post_id );
		if ( $document ) {
			$conditions = $document->get_meta( '_qazana_conditions' );
			if ( $conditions ) {
				$this->cache->add( $document, $conditions )->save();
			}
		}
	}

	public function admin_columns_headers( $posts_columns ) {
		$offset = 3;

		$posts_columns = array_slice( $posts_columns, 0, $offset, true ) + [
				'instances' => __( 'Instances', 'qazana' ),
			] + array_slice( $posts_columns, $offset, null, true );

		return $posts_columns;
	}

	public function admin_columns_content( $column_name, $post_id ) {
		if ( 'instances' !== $column_name ) {
			return;
		}

		$document = ThemeBuilder::instance()->get_document( $post_id );
		if ( ! $document ) {
			echo __( 'None', 'qazana' );
			return;
		}
		$document_conditions = $this->get_document_conditions( $document );

		$instances = [];
		if ( ! empty( $document_conditions ) ) {
			foreach ( $document_conditions as $document_condition ) {
				if ( 'exclude' === $document_condition['type'] ) {
					continue;
				}

				$condition_name = ! empty( $document_condition['sub_name'] ) ? $document_condition['sub_name'] : $document_condition['name'];

				$condition = $this->get_condition( $condition_name );
				if ( ! $condition ) {
					continue;
				}

				if ( ! empty( $document_condition['sub_id'] ) ) {
					$instance_label = $condition->get_label() . " #{$document_condition['sub_id']}";
				} else {
					$instance_label = $condition->get_all_label();
				}

				$instances[] = $instance_label;
			}
		}

		if ( ! empty( $instances ) ) {
			echo implode( '<br />', $instances );
		} else {
			echo 'None';
		}
	}

	/**
	 * @access public
	 *
	 * @param Ajax_Manager $ajax_manager
	 */
	public function register_ajax_actions( $ajax_manager ) {
		$ajax_manager->register_ajax_action( 'theme_builder_save_conditions', [ $this, 'ajax_save_theme_template_conditions' ] );
		$ajax_manager->register_ajax_action( 'theme_builder_conditions_check_conflicts', [ $this, 'ajax_check_conditions_conflicts' ] );
	}

	public function ajax_check_conditions_conflicts( $request ) {
		$post_id = $request['editor_post_id'];
		$condition = $request['condition'];

		unset( $condition['_id'] );

		$conditions_to_check = rtrim( implode( '/', $condition ), '/' );

		$document = ThemeBuilder::instance()->get_document( $post_id );

		$conditions_groups = $this->cache->get_by_location( $document->get_location() );

		$conflicted = [];
		$message = '';

		if ( ! empty( $conditions_groups ) ) {
			foreach ( $conditions_groups as $template_id => $conditions ) {
				if ( ! get_post( $template_id ) ) {
					$this->purge_post_from_cache( $template_id );
				}

				if ( $post_id === $template_id ) {
					continue;
				}

				if ( false !== array_search( $conditions_to_check, $conditions, true ) ) {
					$edit_url = ThemeBuilder::instance()->get_document( $template_id )->get_edit_url();
					$conflicted[] = sprintf( '<a href="%s" target="_blank">%s</a>', $edit_url, get_the_title( $template_id ) );
				}
			}
		}

		if ( ! empty( $conflicted ) ) {
			$message = __( 'Elementor recognized that you have set this location for other templates: ', 'qazana' ) . ' ' . implode( ', ', $conflicted );
		}

		return $message;
	}

	public function ajax_save_theme_template_conditions( $request ) {
		if ( ! isset( $request['conditions'] ) ) {
			$request['conditions'] = [];
		}
		$is_saved = $this->save_conditions( $request['editor_post_id'], $request['conditions'] );

		if ( ! $is_saved ) {
			throw new \Exception( 'Error while saving conditions.', Exceptions::INTERNAL_SERVER_ERROR );
		}
	}

	private function register_condition( $id, $args = [] ) {
		if ( isset( $this->conditions[ $id ] ) ) {
			return;
		}

		$class_name = ucfirst( $id );
		$class_name = '\\Qazana\\Extensions\\ThemeBuilder\\Conditions\\' . $class_name;
		/** @var Condition_Base $condition */
		$condition = new $class_name( $args );
		$this->register_condition_instance( $condition );

		foreach ( $condition->get_sub_conditions() as $key => $val ) {
			if ( is_numeric( $key ) ) {
				$id = $val;
				$args = [];
			} else {
				$id = $key;
				$args = $val;
			}
			$this->register_condition( $id, $args );
		}
	}

	/**
	 * @param Condition_Base $instance
	 */
	public function register_condition_instance( $instance ) {
		$this->conditions[ $instance->get_name() ] = $instance;
	}

	/**
	 * @param $id
	 *
	 * @return Condition_Base|bool
	 */
	public function get_condition( $id ) {
		return isset( $this->conditions[ $id ] ) ? $this->conditions[ $id ] : false;
	}

	public function get_conditions_config() {
		$config = [];

		foreach ( $this->conditions as $condition ) {
			$config[ $condition->get_name() ] = $condition->get_condition_config();
		}

		return $config;
	}

	public function register_conditions() {
		$this->register_condition( 'general' );
	}

	public function save_conditions( $post_id, $conditions ) {
		$conditions_to_save = [];

		foreach ( $conditions as $condition ) {
			unset( $condition['_id'] );
			$conditions_to_save[] = rtrim( implode( '/', $condition ), '/' );
		}

		$document = ThemeBuilder::instance()->get_document( $post_id );
		if ( empty( $conditions_to_save ) ) {
			// TODO: $document->delete_meta.
			delete_post_meta( $post_id, '_qazana_conditions' );
		} else {
			$document->update_meta( '_qazana_conditions', $conditions_to_save );
		}

		return $this->cache->regenerate();
	}

	public function get_location_templates( $location ) {
		$conditions_priority = [];

		$conditions_groups = $this->cache->get_by_location( $location );

		if ( empty( $conditions_groups ) ) {
			return $conditions_priority;
		}

		$excludes = [];

		foreach ( $conditions_groups as $theme_template_id => $conditions ) {
			$theme_template_id = apply_filters( 'qazana/theme/get_location_templates/template_id', $theme_template_id );

			$post_status = get_post_status( $theme_template_id );

			if ( 'publish' !== $post_status ) {
				continue;
			}

			foreach ( $conditions as $condition ) {
				$parsed_condition = $this->parse_condition( $condition );

				$include = $parsed_condition['type'];
				$name = $parsed_condition['name'];
				$sub_name = $parsed_condition['sub_name'];
				$sub_id = $parsed_condition['sub_id'];

				$is_include = 'include' === $include;
				$condition_instance = $this->get_condition( $name );

				if ( ! $condition_instance ) {
					continue;
				}

				$condition_pass = $condition_instance->check( [] );
				$sub_condition_instance = null;

				if ( $condition_pass && $sub_name ) {
					$sub_condition_instance = $this->get_condition( $sub_name );
					if ( ! $sub_condition_instance ) {
						continue;
					}

					$args = [
						'id' => $sub_id,
					];

					$condition_pass = $sub_condition_instance->check( $args );
				}

				if ( $condition_pass ) {
					if ( $is_include ) {
						$conditions_priority[ $theme_template_id ] = $this->get_condition_priority( $condition_instance, $sub_condition_instance, $sub_id );
					} else {
						$excludes[] = $theme_template_id;
					}
				}
			} // End foreach().
		} // End foreach().

		foreach ( $excludes as $exclude_id ) {
			unset( $conditions_priority[ $exclude_id ] );
		}

		asort( $conditions_priority );

		return $conditions_priority;
	}

	public function get_theme_templates_ids( $location ) {
		// In case the user want to preview any page with a theme_template_id,
		// like http://domain.com/any-post/?preview=1&theme_template_id=6453
		if ( ! empty( $_GET['theme_template_id'] ) ) {
			$force_template_id = $_GET['theme_template_id'];
			$document = ThemeBuilder::instance()->get_document( $force_template_id );
			// e.g. header / header
			if ( $document && $location === $document->get_location() ) {
				return [
					$force_template_id => 1,
				];
			}
		}

		$current_post_id = get_the_ID();
		$document = ThemeBuilder::instance()->get_document( $current_post_id );
		if ( $document && $location === $document->get_location() ) {
			return [
				$current_post_id => 1,
			];
		}

		$templates = $this->get_location_templates( $location );

		return $templates;
	}

	/**
	 * @param Condition_Base $condition_instance
	 * @param Condition_Base $sub_condition_instance
	 * @param int $sub_id
	 *
	 * @return mixed
	 * @throws \Exception
	 */
	private function get_condition_priority( $condition_instance, $sub_condition_instance, $sub_id ) {
		$type_priority = [
			'general' => 50,
			'archive' => 40,
			'singular' => 30,
		];

		$type_priority = $type_priority[ $condition_instance::get_type() ];

		if ( $sub_condition_instance ) {
			$type_priority -= 10;

			if ( $sub_id ) {
				$type_priority -= 10;
			} elseif ( 0 === count( $sub_condition_instance->get_sub_conditions() ) ) {
				// if no sub conditions - it's more specific.
				$type_priority -= 5;
			}
		}

		return $type_priority;
	}

	/**
	 * @param Theme_Document $document
	 *
	 * @return array
	 */
	public function get_document_conditions( $document ) {
		$saved_conditions = $document->get_main_meta( '_qazana_conditions' );
		$conditions = [];

		if ( is_array( $saved_conditions ) ) {
			foreach ( $saved_conditions as $condition ) {
				$conditions[] = $this->parse_condition( $condition );
			}
		}

		return $conditions;
	}

	protected function parse_condition( $condition ) {
		list ( $type, $name, $sub_name, $sub_id ) = array_pad( explode( '/', $condition ), 4,'' );
		return compact( 'type', 'name', 'sub_name', 'sub_id' );
	}

	/**
	 * @param $location
	 *
	 * @return Theme_Document[]
	 */
	public function get_documents_for_location( $location ) {
		$theme_templates_ids = $this->get_theme_templates_ids( $location );

		$location_settings = ThemeBuilder::instance()->get_locations_manager()->get_locations( $location );

		$documents = [];

		foreach ( $theme_templates_ids as $theme_template_id => $priority ) {
			$document = ThemeBuilder::instance()->get_document( $theme_template_id );
			if ( $document ) {
				$documents[] = $document;
			} else {
				$this->purge_post_from_cache( $theme_template_id );
			}

			if ( empty( $location_settings['multiple'] ) ) {
				break;
			}
		}

		return $documents;
	}

	public function purge_post_from_cache( $post_id ) {
		return $this->cache->remove( $post_id )->save();
	}

	public function get_cache() {
		return $this->cache;
	}
}
