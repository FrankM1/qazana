<?php
namespace Qazana\Extensions;

use Qazana\Core\Base\Document;
use Qazana\Template_Library\Source_Local;
use Qazana\Extensions\ThemeBuilder\Classes;
use Qazana\Extensions\ThemeBuilder\Documents\Single;
use Qazana\Extensions\ThemeBuilder\Documents\Theme_Document;
use Qazana\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class ThemeBuilder extends Base {

    private $classes_aliases = [
		'Qazana\Extensions\PanelPostsControl\Module' => 'Qazana\Extensions\Queries_Group_Controls',
		'Qazana\Extensions\PanelPostsControl\Controls\Group_Control_Posts' => 'Qazana\Extensions\QueryControl\Controls\Group_Control_Posts',
		'Qazana\Extensions\PanelPostsControl\Controls\Query' => 'Qazana\Extensions\QueryControl\Controls\Query',
    ];
    
    private $components = [];
    
	public function add_component( $id, $instance ) {
		$this->components[ $id ] = $instance;
	}

	public function get_component( $id ) {
		if ( isset( $this->components[ $id ] ) ) {
			return $this->components[ $id ];
		}

		return false;
    }

	public static function is_preview() {
		return qazana()->preview->is_preview_mode() || is_preview();
	}

	public function get_name() {
		return 'themebuilder';
    }

    /**
     * Extension dependencies
     *
     * Reliably have an extension as child of another.
     *
     * @since 1.3.0
     *
     * @return array of names of parent extensions
     */
    public function get_dependencies() {
        return ['library'];
    }

	public function get_widgets() {
		$widgets = [
			'Post_Title',
			'Post_Excerpt',
			'Post_Content',
			'Post_Featured_Image',
			'Archive_Title',
		];

		if ( class_exists( '\Qazana\Extensions\Widgets\Posts' ) ) {
			$widgets[] = 'Archive_Posts';
		}

		$widgets[] = 'Site_Title';
		$widgets[] = 'Site_Logo';

		return $widgets;
	}

	/**
	 * @return Classes\Conditions_Manager
	 */
	public function get_conditions_manager() {
		return $this->get_component( 'conditions' );
	}

	/**
	 * @return Classes\Locations_Manager
	 */
	public function get_locations_manager() {
		return $this->get_component( 'locations' );
	}

	/**
	 * @return Classes\Preview_Manager
	 */
	public function get_preview_manager() {
		return $this->get_component( 'preview' );
	}

	/**
	 * @return Classes\Templates_Types_Manager
	 */
	public function get_types_manager() {
		return $this->get_component( 'templates_types' );
	}

	/**
	 * @param $post_id
	 *
	 * @return Theme_Document
	 */
	public function get_document( $post_id ) {
		$document = null;

		try {
			$document = qazana()->documents->get( $post_id );
		} catch ( \Exception $e ) {}

		if ( ! empty( $document ) && ! $document instanceof Theme_Document ) {
			$document = null;
		}

		return $document;
    }
    
    public function enqueue_admin_scripts() {
		$suffix = Utils::is_script_debug() ? '' : '.min';

		wp_enqueue_script(
            'qazana-themebuilder-admin',
            $this->extension_url( 'assets/js/admin' . $suffix . '.js'),
            ['jquery'],
            '2.0.0',
            true
        );
   }

    public function enqueue_editor_scripts() {
		$suffix = Utils::is_script_debug() ? '' : '.min';

		wp_enqueue_script(
            'qazana-themebuilder-editor',
            $this->extension_url( 'assets/js/editor' . $suffix . '.js'),
            ['jquery'],
            '2.0.0',
            true
        );
   }

    public function enqueue_frontend_scripts() {
		$suffix = Utils::is_script_debug() ? '' : '.min';

        wp_enqueue_script(
            'qazana-themebuilder-frontend',
            $this->extension_url( 'assets/js/frontend' . $suffix . '.js'),
            ['jquery', 'qazana-frontend'],
            '2.0.0',
            true
        );
   }

   public function enqueue_editor_styles() {
		$suffix = Utils::is_script_debug() ? '' : '.min';
		wp_enqueue_style(
            'qazana-themebuilder-editor',
            $this->extension_url( 'assets/css/editor' . $suffix . '.css'),
            '2.0.0'
        );
   }

    public function localize_settings( $settings ) {
		$post_id = get_the_ID();
		$document = $this->get_document( $post_id );

		if ( ! $document ) {
			return $settings;
		}

		$types_manager = $this->get_types_manager();
		$conditions_manager = $this->get_conditions_manager();
		$template_type = $this->get_template_type( $post_id );

		$settings = array_replace_recursive( $settings, [
			'i18n' => [
				'display_conditions' => __( 'Display Conditions', 'qazana' ),
				'choose' => __( 'Choose', 'qazana' ),
				'add_condition' => __( 'Add Condition', 'qazana' ),
				'save_without_conditions' => __( 'Save Without Conditions', 'qazana' ),
				'conditions_title' => sprintf( __( 'Where Do You Want to Display Your %s?', 'qazana' ), $document::get_title() ),
				'conditions_description' => sprintf( __( 'Set the conditions that determine where your %s is used throughout your site.<br />For example, choose \'Entire Site\' to display the template across your site.', 'qazana' ), $document::get_title() ),
			],
			'theme_builder' => [
				'groups' => qazana()->documents->get_groups(),
				'types' => $types_manager->get_types_config(),
				'conditions' => $conditions_manager->get_conditions_config(),
				'template_conditions' => ( new Classes\Template_Conditions() )->get_config(),
				'is_theme_template' => $this->is_theme_template( $post_id ),
				'settings' => [
					'template_type' => $template_type,
					'location' => $document->get_location(),
					'conditions' => $conditions_manager->get_document_conditions( $document ),
				],
			],
		] );

		return $settings;
	}

	public function register_controls() {
		$controls_manager = qazana()->controls_manager;

		$controls_manager->register_control( Classes\Conditions_Repeater::CONTROL_TYPE, new Classes\Conditions_Repeater() );
	}

	public function create_new_dialog_types( $types ) {
		/**
		 * @var Theme_Document[] $document_types
		 */
		foreach ( $types as $type => $label ) {
			$document_type = qazana()->documents->get_document_type( $type );
			$instance = new $document_type();

			if ( $instance instanceof Theme_Document && 'section' !== $type ) {
				$types[ $type ] .= $instance->get_location_label();
			}
		}

		return $types;
	}

	public function print_location_field() {
		$locations = $this->get_locations_manager()->get_locations_without_core();

		if ( empty( $locations ) ) {
			return;
		}
		?>
		<div id="qazana-new-template__form__location__wrapper" class="qazana-form-field">
			<label for="qazana-new-template__form__location" class="qazana-form-field__label">
				<?php echo __( 'Select a Location', 'qazana' ); ?>
			</label>
			<div class="qazana-form-field__select__wrapper">
				<select id="qazana-new-template__form__location" class="qazana-form-field__select" name="meta_location">
					<option value="">
						<?php echo __( 'Select...', 'qazana' ); ?>
					</option>
					<?php

					foreach ( $locations as $location => $settings ) {
						echo sprintf( '<option value="%1$s">%2$s</option>', $location, $settings['label'] );
					}
					?>
				</select>
			</div>
		</div>
		<?php
	}

	public function print_post_type_field() {
		$post_types = get_post_types( [
			'exclude_from_search' => false,
		], 'objects' );

		if ( empty( $post_types ) ) {
			return;
		}
		?>
		<div id="qazana-new-template__form__post-type__wrapper" class="qazana-form-field">
			<label for="qazana-new-template__form__post-type" class="qazana-form-field__label">
				<?php echo __( 'Select Post Type', 'qazana' ); ?>
			</label>
			<div class="qazana-form-field__select__wrapper">
				<select id="qazana-new-template__form__post-type" class="qazana-form-field__select" name="<?php echo Single::SUB_TYPE_META_KEY ; ?>">
					<option value="">
						<?php echo __( 'Select', 'qazana' ); ?>...
					</option>
					<?php

					foreach ( $post_types as $post_type => $post_type_config ) {
						$doc_type = qazana()->documents->get_document_type( $post_type );
						$doc_name = ( new $doc_type )->get_name();

						if ( 'post' === $doc_name || 'page' === $doc_name ) {
							echo sprintf( '<option value="%1$s">%2$s</option>', $post_type, $post_type_config->labels->singular_name );
						}
					}

					// 404.
					echo sprintf( '<option value="%1$s">%2$s</option>', 'not_found404', __( '404 Page', 'qazana' ) );

					?>
				</select>
			</div>
		</div>
		<?php
	}

	public function admin_head() {
		if ( in_array( get_current_screen()->id, [ 'qazana_library', 'edit-qazana_library' ] ) ) {
			// For column type (Supported/Unsupported) & for `print_location_field`.
			$this->get_locations_manager()->register_locations();
		}
	}

	public function admin_columns_content( $column_name, $post_id ) {
		if ( 'qazana_library_type' === $column_name ) {
			/** @var Document $document */
			$document = qazana()->documents->get( $post_id );

			if ( $document instanceof Theme_Document ) {
				$location_label = $document->get_location_label();

				if ( $location_label ) {
					echo ' - ' . esc_html( $location_label );
				}
			}
		}
	}

	public function get_template_type( $post_id ) {
		return Source_local::get_template_type( $post_id );
	}

	public function is_theme_template( $post_id ) {
		$document = qazana()->documents->get( $post_id );

		return $document instanceof Theme_Document;
    }
    
    public static function instance() {
        return $queries_extension = qazana()->extensions_manager->get_extension( 'themebuilder' );
    }

    public function autoload( $class ) {
		if ( 0 !== strpos( $class, __NAMESPACE__ ) ) {
			return;
		}

		$has_class_alias = isset( $this->classes_aliases[ $class ] );

		// Backward Compatibility: Save old class name for set an alias after the new class is loaded
		if ( $has_class_alias ) {
			$class_alias_name = $this->classes_aliases[ $class ];
			$class_to_load = $class_alias_name;
		} else {
			$class_to_load = $class;
		}

		if ( ! class_exists( $class_to_load ) ) {
			$filename = strtolower(
				preg_replace(
					[ '/^' . __NAMESPACE__ . '\\\/', '/([a-z])([A-Z])/', '/_/', '/\\\/' ],
					[ '', '$1-$2', '-', DIRECTORY_SEPARATOR ],
					$class_to_load
				)
            );

            $filename = str_replace( 'qazana/extensions/theme-builder/', '', $filename );

			$filename = __DIR__ .'/' . $filename . '.php';

            if ( is_readable( $filename ) ) {
				include( $filename );
			}
		}

		if ( $has_class_alias ) {
			class_alias( $class_alias_name, $class );
		}
	}

	public function __construct() {
        spl_autoload_register( [ $this, 'autoload' ] );

		require __DIR__ . '/api.php';

		$this->add_component( 'theme_support', new Classes\Theme_Support() );
		$this->add_component( 'conditions', new Classes\Conditions_Manager() );
		$this->add_component( 'templates_types', new Classes\Templates_Types_Manager() );
		$this->add_component( 'preview', new Classes\Preview_Manager() );
        $this->add_component( 'locations', new Classes\Locations_Manager() );
        
        qazana()->editor->add_editor_template( __DIR__ . '/views/panel-template.php' );

		$this->register_controls();

		// Editor
		add_filter( 'qazana/editor/localize_settings', [ $this, 'localize_settings' ] );

		// Admin
		add_action( 'admin_head', [ $this, 'admin_head' ] );
		add_action( 'manage_' . Source_Local::CPT . '_posts_custom_column', [ $this, 'admin_columns_content' ] , 10, 2 );
		add_action( 'qazana/template-library/create_new_dialog_fields', [ $this, 'print_location_field' ] );
		add_action( 'qazana/template-library/create_new_dialog_fields', [ $this, 'print_post_type_field' ] );
        add_filter( 'qazana/template-library/create_new_dialog_types', [ $this, 'create_new_dialog_types' ] );
        add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_admin_scripts' ] );
        add_action( 'qazana/editor/before_enqueue_scripts', [ $this, 'enqueue_editor_scripts' ] );
        add_action( 'qazana/editor/after_enqueue_styles', [ $this, 'enqueue_editor_styles' ] );
        add_action( 'qazana/frontend/before_enqueue_scripts', [ $this, 'enqueue_frontend_scripts' ] );
	}
}
