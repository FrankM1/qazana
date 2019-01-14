<?php
namespace Qazana\Core\DocumentConditions\Conditions;

use Qazana\Template_Library\Source_Local;
use Qazana\Core\Base\Document;
use Qazana\Core\DocumentConditions;
use Qazana\Core\Utils\Exceptions;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class DB {

	const OPTION_NAME = 'qazana_conditions';

	const META_OPTION_NAME = '_qazana_conditions';

	protected $conditions = [];

	public function __construct( $type ) {
		add_action( 'qazana/ajax/register_actions', [ $this, 'register_ajax_actions' ] );
		add_action( 'untrashed_post', [ $this, 'on_untrash_post' ] );

		add_action( 'manage_' . Source_Local::CPT . '_posts_columns', [ $this, 'admin_columns_headers' ] );
		add_action( 'manage_' . Source_Local::CPT . '_posts_custom_column', [ $this, 'admin_columns_content' ] , 10, 2 );

		$this->refresh();
	}

	public function get_by_location( $location ) {
		if ( isset( $this->condition_instances[ $location ] ) ) {
			return $this->condition_instances[ $location ];
		}
		return [];
	}

	public function on_untrash_post( $post_id ) {
		$document = qazana()->get_documents()->get( $post_id );
		if ( $document ) {
			$conditions = $document->get_meta( '_qazana_conditions' );
			if ( $conditions ) {
				$this->add( $document, $conditions )->save();
			}
		}
	}

	/**
	 * @param Document $document
	 *
	 * @return array
	 */
	public function get_document_conditions( $document ) {
		$saved_conditions = $document->get_main_meta( self::META_OPTION_NAME );
		$conditions = [];

		if ( is_array( $saved_conditions ) ) {
			foreach ( $saved_conditions as $condition ) {
				$conditions[] = $this->parse_condition( $condition );
			}
		}

		return $conditions;
	}

	public function parse_condition( $condition ) {
		list ( $type, $name, $sub_name, $sub_id ) = array_pad( explode( '/', $condition ), 4,'' );
		return compact( 'type', 'name', 'sub_name', 'sub_id' );
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

		$document = qazana()->get_documents()->get( $post_id );

		if ( ! $document || get_post_meta( $post_id, Document::TYPE_META_KEY, $document->get_name() ) !== 'site-hero' ) {
			return;
		}

		$document_conditions = $this->get_document_conditions( $document );

		$manager = qazana()->document_conditions->get_document_support( $document->get_name() )->get_conditions_manager();

		$found_instances = [];
		if ( ! empty( $document_conditions ) ) {
			foreach ( $document_conditions as $document_condition ) {
				if ( 'exclude' === $document_condition['type'] ) {
					continue;
				}

				$condition_name = ! empty( $document_condition['sub_name'] ) ? $document_condition['sub_name'] : $document_condition['name'];

				$condition = $manager->get_condition( $condition_name );
				if ( ! $condition ) {
					continue;
				}

				if ( ! empty( $document_condition['sub_id'] ) ) {
					$found_instances_label = $condition->get_title() . " #{$document_condition['sub_id']}";
				} else {
					$found_instances_label = $condition->get_group_title();
				}

				$found_instances[] = $found_instances_label;
			}
		}

		if ( ! empty( $found_instances ) ) {
			echo implode( '<br />', $found_instances );
		} else {
			echo __( 'None', 'qazana' );
		}
	}

	/**
	 * @param Document $document
	 * @param array $conditions
	 *
	 * @return $this
	 */
	public function add( Document $document, array $conditions ) {

		if ( empty( $this->condition_instances ) ) {
			$this->condition_instances = [];
		}

		if ( ! method_exists( $document, 'get_location' ) ) {
			return $this;
		}

		$location = $document->get_location();

		if ( $location ) {
			if ( ! isset( $this->condition_instances[ $location ] ) ) {
				$this->condition_instances[ $location ] = [];
			}
			$this->condition_instances[ $location ][ $document->get_main_id() ] = $conditions;
		}

		return $this;
	}

	/**
	 * @param int $post_id
	 *
	 * @return $this
	 */
	public function remove( $post_id ) {
		$post_id = absint( $post_id );

		foreach ( $this->condition_instances as $location => $templates ) {
			foreach ( $templates as $id => $template ) {
				if ( $post_id === $id ) {
					unset( $this->condition_instances[ $location ][ $id ] );
				}
			}
		}

		return $this;
	}

	/**
	 * @param Document $document
	 * @param array $conditions
	 *
	 * @return $this
	 */
	public function update( $document, $conditions ) {
		return $this->remove( $document->get_main_id() )->add( $document, $conditions );
	}

	public function save() {
		return update_option( self::OPTION_NAME, $this->condition_instances );
	}

	public function refresh() {
		$this->condition_instances = get_option( self::OPTION_NAME, [] );
		return $this;
	}

	public function clear() {
		$this->condition_instances = [];
		return $this;
	}

	public function regenerate_templates_conditions() {

		$this->clear();

		$query = new \WP_Query( [
			'posts_per_page' => -1,
			'post_type'      => Source_Local::CPT,
			'fields'         => 'ids',
			'meta_key'       => self::META_OPTION_NAME,
		] );

		foreach ( $query->posts as $post_id ) {
			$document = qazana()->get_documents()->get( $post_id );
			$conditions = $document->get_meta( self::META_OPTION_NAME );
			$this->add( $document, $conditions );
		}

		$this->save();

		return $this;
	}

	/**
	 * @access public
	 *
	 * @param Ajax_Manager $ajax_manager
	 */
	public function register_ajax_actions( $ajax_manager ) {
		foreach ( qazana()->document_conditions->documents_support as $key ) {
			$ajax_manager->register_ajax_action( str_replace( '-', '_', $key ) . '_save_conditions', [ $this, 'ajax_save_conditions' ] );
			$ajax_manager->register_ajax_action( str_replace( '-', '_', $key ) . '_conditions_check_conflicts', [ $this, 'ajax_check_conditions_conflicts' ] );
		}
	}

	public function save_conditions( $post_id, $conditions ) {
		$conditions_to_save = [];

		foreach ( $conditions as $condition ) {
			unset( $condition['_id'] );
			$conditions_to_save[] = rtrim( implode( '/', $condition ), '/' );
		}

		$document = qazana()->get_documents()->get( $post_id );
		if ( empty( $conditions_to_save ) ) {
			$document->delete_meta( self::META_OPTION_NAME );
		} else {
			$document->update_meta( self::META_OPTION_NAME, $conditions_to_save );
		}

		return $this->regenerate_templates_conditions();
	}

	public function ajax_check_conditions_conflicts( $request ) {
		$post_id = $request['editor_post_id'];
		$condition = $request['condition'];

		unset( $condition['_id'] );

		$conditions_to_check = rtrim( implode( '/', $condition ), '/' );

		$document = qazana()->get_documents()->get( $post_id );

		$conditions_groups = $this->get_by_location( $document->get_location() );

		$conflicted = [];
		$message = '';

		if ( ! empty( $conditions_groups ) ) {
			foreach ( $conditions_groups as $template_id => $conditions ) {
				if ( ! get_post( $template_id ) ) {
					$this->remove( $template_id )->save();
				}

				if ( $post_id === $template_id ) {
					continue;
				}

				if ( false !== array_search( $conditions_to_check, $conditions, true ) ) {
					$edit_url = qazana()->get_documents()->get( $template_id )->get_edit_url();
					$conflicted[] = sprintf( '<a href="%s" target="_blank">%s</a>', $edit_url, get_the_title( $template_id ) );
				}
			}
		}

		if ( ! empty( $conflicted ) ) {
			$message = __( 'Qazana recognized that you have set this location for other templates: ', 'qazana' ) . ' ' . implode( ', ', $conflicted );
		}

		return $message;
	}

	public function ajax_save_conditions( $request ) {
		if ( ! isset( $request['conditions'] ) ) {
			$request['conditions'] = [];
		}
		$is_saved = $this->save_conditions( $request['editor_post_id'], $request['conditions'] );

		if ( ! $is_saved ) {
			throw new \Exception( 'Error while saving conditions.', Exceptions::INTERNAL_SERVER_ERROR );
		}
	}

}
