<?php
namespace Qazana\Admin\System\Info;

use Qazana\Admin\System\Info\Classes\Abstracts\Base_Reporter;
use Qazana\System\Info\Helpers\Model;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Main {

	private $capability = 'manage_options';

	/**
	 * @var array
	 */
	private $settings = [];

	private static $reports = [
		'server'          => [],
		'wordpress'       => [],
		'theme'           => [],
		'user'            => [],
		'plugins'         => [],
		'network_plugins' => [],
		'mu_plugins'      => [],
	];

	public function __construct() {
		$this->require_files();
		$this->init_settings();
		$this->add_actions();
	}

	private function require_files() {
		require __DIR__ . '/classes/abstracts/base-reporter.php';
		require __DIR__ . '/helpers/model-helper.php';
	}

	/**
	 * @param array $properties
	 *
	 * @return \WP_Error|false|Base_Reporter
	 */
	public function create_reporter( array $properties ) {
		$properties = Model::prepare_properties( $this->get_settings( 'reporter_properties' ), $properties );

		$reporter_class = $properties['class_name'] ? $properties['class_name'] : $this->get_reporter_class( $properties['name'] );

		$reporter = new $reporter_class( $properties );

		if ( ! ( $reporter instanceof Base_Reporter ) ) {
			return new \WP_Error( 'Each reporter must to be an instance or sub-instance of Base_Reporter class' );
		}

		if ( ! $reporter->is_enabled() ) {
			return false;
		}

		return $reporter;
	}

	private function add_actions() {
		add_action( 'admin_menu', [ $this, 'register_menu' ], 501 );

		add_action( 'wp_ajax_qazana_system_info_download_file', [ $this, 'download_file' ] );
	}

	public function display_page() {
		$reports_info = self::get_allowed_reports();

		$reports = $this->load_reports( $reports_info );

		?>
		<div id="qazana-system-info">
			<h3><?php _e( 'System Info', 'qazana' ); ?></h3>
			<div><?php $this->print_report( $reports, 'html' ); ?></div>
			<h3><?php _e( 'Copy & Paste Info', 'qazana' ); ?></h3>
			<div id="qazana-system-info-raw">
				<label id="qazana-system-info-raw-code-label" for="qazana-system-info-raw-code"><?php _e( 'You can copy the below info as simple text with Ctrl+C / Ctrl+V:', 'qazana' ); ?></label>
				<textarea id="qazana-system-info-raw-code" readonly>
					<?php
					unset( $reports['wordpress']['report']['admin_email'] );

					$this->print_report( $reports, 'raw' );
					?>
				</textarea>
				<script>
					var textarea = document.getElementById( 'qazana-system-info-raw-code' );
					var selectRange = function() {
						textarea.setSelectionRange( 0, textarea.value.length );
					};
					textarea.onfocus = textarea.onblur = textarea.onclick = selectRange;
					textarea.onfocus();
				</script>
			</div>
			<hr>
			<form action="<?php echo admin_url( 'admin-ajax.php' ); ?>" method="post">
				<input type="hidden" name="action" value="qazana_system_info_download_file">
				<input type="submit" class="button button-primary" value="<?php _e( 'Download System Info', 'qazana' ); ?>">
			</form>
		</div>
		<?php
	}

	public function download_file() {
		if ( ! current_user_can( $this->capability ) ) {
			wp_die( __( 'You don\'t have a permission to download this file', 'qazana' ) );
		}

		$reports_info = self::get_allowed_reports();
		$reports = $this->load_reports( $reports_info );

		header( 'Content-Type: text/plain' );
		header( 'Content-Disposition:attachment; filename=system-info-' . $_SERVER['HTTP_HOST'] . '-' . date( 'd-m-Y' ) . '.txt' );

		$this->print_report( $reports );

		die;
	}

	public function get_reporter_class( $reporter_type ) {
		return $this->get_settings( 'namespaces.classes_namespace' ) . '\\' . ucfirst( $reporter_type ) . '_Reporter';
	}

	public function load_reports( $reports ) {
		$result = [];

		$settings = $this->get_settings();

		foreach ( $reports as $report_name => $report_info ) {
			if ( ! empty( $report_info['file_name'] ) ) {
				$file_name = $report_info['file_name'];
			} else {
				$file_name = $settings['dirs']['classes'] . $settings['reportFilePrefix'] . str_replace( '_', '-', $report_name ) . '.php';
			}

			require_once $file_name;

			$reporter_params = [
				'name' => $report_name,
			];

			$reporter_params = array_merge( $reporter_params, $report_info );

			$reporter = $this->create_reporter( $reporter_params );

			if ( ! $reporter instanceof Base_Reporter ) {
				continue;
			}

			$result[ $report_name ] = [
				'report' => $reporter->get_report(),
				'label' => $reporter->get_title(),
			];

			if ( ! empty( $report_info['sub'] ) ) {
				$result[ $report_name ]['sub'] = $this->load_reports( $report_info['sub'] );
			}
		}

		return $result;
	}

	public function print_report( $reports, $template = 'raw' ) {
		static $tabs_count = 0;

		static $required_plugins_properties = [
			'Name',
			'Version',
			'URL',
			'Author',
		];

		$template_path = $this->get_settings( 'dirs.templates' ) . $template . '.php';

		require $template_path;
	}

	public function register_menu() {
		$system_info_text = __( 'System Info', 'qazana' );

		add_submenu_page(
			'qazana',
			$system_info_text,
			$system_info_text,
			$this->capability,
			'qazana-system-info',
			[ $this, 'display_page' ]
		);
	}

	protected function get_default_settings() {
		$settings = [];

		$reporter_properties = Base_Reporter::get_properties_keys();

		array_push( $reporter_properties, 'category', 'name', 'class_name' );

		$settings['reporter_properties'] = $reporter_properties;

		$base_lib_dir = qazana()->includes_dir  . 'admin/settings/system-info/';

		$settings['dirs'] = [
			'lib'       => $base_lib_dir,
			'templates' => $base_lib_dir . 'templates/',
			'classes'   => $base_lib_dir . 'classes/',
			'helpers'   => $base_lib_dir . 'helpers/',
		];

		$settings['namespaces'] = [
			'namespace' => __NAMESPACE__,
			'classes_namespace' => __NAMESPACE__ . '\Classes',
		];

		$settings['reportFilePrefix'] = '';

		return $settings;
	}

	private function init_settings() {
		$this->settings = $this->get_default_settings();
	}

	/**
	 * @param string $setting
	 * @param array $container
	 *
	 * @return mixed
	 */
	public final function get_settings( $setting = null, array $container = null ) {
		if ( ! $container ) {
			$container = $this->settings;
		}

		if ( $setting ) {
			$setting_thread = explode( '.', $setting );
			$parent_thread = array_shift( $setting_thread );

			if ( $setting_thread ) {
				return $this->get_settings( implode( '.', $setting_thread ), $container[ $parent_thread ] );
			}

			return $container[ $parent_thread ];
		}
		return $container;
	}

	public static function get_allowed_reports() {
		return self::$reports;
	}

	public static function add_report( $report_name, $report_info ) {
		self::$reports[ $report_name ] = $report_info;
	}
}
