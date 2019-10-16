<?php
namespace Qazana\Core\DocumentConditions\Conditions;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

use Qazana\Core\DocumentConditions;

/**
 * Define Conditions\Manager class
 */
class Manager {

	/**
	 * @var Condition/Excludes[]
	 */
    protected $excludes = [];

    /**
	 * @var Condition/Base[]
	 */
    public $conditions = [];

    /**
     * Load extension files
     */
    public function __construct( $type ) {
		$this->type = $type;
        $this->include_files();
		add_action( 'wp_loaded', [ $this, 'register_conditions' ] ); // After Plugins Registered CPT.
    }

    public function include_files() {
        require_once  __DIR__ . '/site/base.php';

        require_once  __DIR__ . '/site/archives/author.php';
        require_once  __DIR__ . '/site/archives/date.php';
        require_once  __DIR__ . '/site/archives/search.php';
        require_once  __DIR__ . '/site/archives/archive.php';
        require_once  __DIR__ . '/site/archives/taxonomy.php';
        require_once  __DIR__ . '/site/archives/post-type-archive.php';

        require_once  __DIR__ . '/site/singular/not-found404.php';
        require_once  __DIR__ . '/site/singular/front-page.php';
        require_once  __DIR__ . '/site/singular/singular.php';
        require_once  __DIR__ . '/site/singular/child-of.php';
        require_once  __DIR__ . '/site/singular/in-taxonomy.php';
        require_once  __DIR__ . '/site/singular/post.php';

        require_once  __DIR__ . '/site/general.php';
    }

    public function get_conditions_config() {
		$config = [];

		foreach ( $this->get_conditions() as $condition ) {
			$config[ $condition->get_name() ] = $condition->get_condition_config();
		}

		return $config;
    }

    /**
	 * @param Condition/Base $condition
	 */
	public function register_condition_instance( $condition ) {
		$condition->parent_name = $this->type;
		$condition->get_sub_conditions();
        $this->conditions[ $condition->get_name() ] = $condition;
	}

    public function register_conditions() {

        $this->register_condition( 'general' );

        /**
         * You could register custom conditions on this hook.
         * Note - each condition should be presented like instance of class 'Conditions\Base'
         */
        do_action( 'qazana/conditions/register', $this );

    }

    private function register_condition( $id, $args = [] ) {
		if ( isset( $this->conditions[ $id ] ) ) {
			return;
		}

		$class_name = ucfirst( $id );
		$class_name = '\\Qazana\\DocumentConditions\\Conditions\\' . $class_name;
		/** @var Condition/Base $condition */
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
	 * Get exclude template from documents
	 */
    public function get_excluded_documents() {
        return $this->excludes;
	}

	/**
	 * Exclude template from documents
	 */
	public function excludes_document( $document_id ) {
		$this->excludes[] = $document_id;
	}

    /**
	 * Get template conditions
     */
    public function get_conditions() {
        return ! empty( $this->conditions ) ? $this->conditions : false;
    }

    /**
     * [get_condition description]
     */
    public function get_condition( $condition_id ) {
        return isset( $this->conditions[ $condition_id ] ) ? $this->conditions[ $condition_id ] : false;
    }

    private function parse_condition( $condition ) {
		list ( $type, $name, $sub_name, $sub_id ) = array_pad( explode( '/', $condition ), 4,'' );
		return compact( 'type', 'name', 'sub_name', 'sub_id' );
    }

    /**
	 * @param Condition/Base $condition_instance
	 * @param Condition/Base $sub_condition_instance
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

    public function get_location_templates( $location ) {
		$conditions_priority = [];

		$conditions_groups = qazana()->document_conditions->get_document_support( $location )->get_conditions_db()->get_by_location( $location );

		if ( empty( $conditions_groups ) ) {
			return $conditions_priority;
		}

		foreach ( $conditions_groups as $template_id => $conditions ) {
			$template_id = apply_filters( 'qazana/conditions/get_location_templates/template_id', $template_id, $this );

			$post_status = get_post_status( $template_id );

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
						$conditions_priority[ $template_id ] = $this->get_condition_priority( $condition_instance, $sub_condition_instance, $sub_id );
					} else {
						$this->excludes_document( $template_id );
					}
				}
			}
		}

		foreach ( array_unique( $this->get_excluded_documents() ) as $exclude_id ) {
			unset( $conditions_priority[ $exclude_id ] );
        }

		asort( $conditions_priority );

		return $conditions_priority;
	}

    public function get_theme_templates_ids( $location ) {

        // In case the user want to preview any page with a template_id,
		// like http://domain.com/any-post/?preview=1&template_id=6453
		if ( ! empty( $_GET['template_id'] ) ) {
			$force_template_id = $_GET['template_id'];
			$document = qazana()->get_documents()->get( $force_template_id );
			// e.g. header / header
			if ( $document && $location === $document->get_location() ) {
				return [
					$force_template_id => 1,
				];
			}
		}

		$templates = $this->get_location_templates( $location );

		return $templates;
	}


    public function purge_post_from_cache( $post_id ) {
		return qazana()->document_conditions->get_document_support()->get_conditions_db()->remove( $post_id )->save();
    }

}
