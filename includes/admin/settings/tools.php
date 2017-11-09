<?php
namespace Qazana\Admin\Settings;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Tools extends Panel {

	const PAGE_ID = 'qazana-tools';

	/**
	 * @since 1.3.0
	 * @access public
	*/
	public function register_admin_menu() {
		add_submenu_page(
			qazana()->slug,
			__( 'Tools', 'qazana' ),
			__( 'Tools', 'qazana' ),
			'manage_options',
			self::PAGE_ID,
			[ $this, 'display_settings_page' ]
		);
	}

	/**
	 * @since 1.3.0
	 * @access public
	*/
	public function ajax_qazana_clear_cache() {
		check_ajax_referer( 'qazana_clear_cache', '_nonce' );

		qazana()->posts_css_manager->clear_cache();

		wp_send_json_success();
	}

	/**
	 * @since 1.1.0
	 * @access public
	*/
	public function ajax_qazana_replace_url() {
		check_ajax_referer( 'qazana_replace_url', '_nonce' );

		$from = ! empty( $_POST['from'] ) ? trim( $_POST['from'] ) : '';
		$to = ! empty( $_POST['to'] ) ? trim( $_POST['to'] ) : '';

		$is_valid_urls = ( filter_var( $from, FILTER_VALIDATE_URL ) && filter_var( $to, FILTER_VALIDATE_URL ) );
		if ( ! $is_valid_urls ) {
			wp_send_json_error( __( 'The `from` and `to` URL\'s must be a valid URL', 'qazana' ) );
		}

		if ( $from === $to ) {
			wp_send_json_error( __( 'The `from` and `to` URL\'s must be different', 'qazana' ) );
		}

		global $wpdb;

		// @codingStandardsIgnoreStart cannot use `$wpdb->prepare` because it remove's the backslashes
		$rows_affected = $wpdb->query(
			"UPDATE {$wpdb->postmeta} " .
			"SET `meta_value` = REPLACE(`meta_value`, '" . str_replace( '/', '\\\/', $from ) . "', '" . str_replace( '/', '\\\/', $to ) . "') " .
			"WHERE `meta_key` = '_qazana_data' AND `meta_value` LIKE '[%' ;" ); // meta_value LIKE '[%' are json formatted
		// @codingStandardsIgnoreEnd

		if ( false === $rows_affected ) {
			wp_send_json_error( __( 'An error occurred', 'qazana' ) );
		} else {
			qazana()->posts_css_manager->clear_cache();
			wp_send_json_success( sprintf( __( '%d Rows Affected', 'qazana' ), $rows_affected ) );
		}
	}

	/**
	 * @since 1.3.0
	 * @access public
	*/
	public function __construct() {
		parent::__construct();

		add_action( 'admin_menu', [ $this, 'register_admin_menu' ], 205 );

		if ( ! empty( $_POST ) ) {
			add_action( 'wp_ajax_qazana_clear_cache', [ $this, 'ajax_qazana_clear_cache' ] );
			add_action( 'wp_ajax_qazana_replace_url', [ $this, 'ajax_qazana_replace_url' ] );
		}
	}

	/**
	 * @since 1.3.0
	 * @access protected
	*/
	protected function create_tabs() {
		return [
			'general' => [
				'label' => __( 'General', 'qazana' ),
				'sections' => [
					'tools' => [
						'fields' => [
							'clear_cache' => [
								'label' => __( 'Regenerate CSS', 'qazana' ),
								'field_args' => [
									'type' => 'raw_html',
									'html' => sprintf( '<button data-nonce="%s" class="button qazana-button-spinner" id="qazana-clear-cache-button">%s</button>', wp_create_nonce( 'qazana_clear_cache' ), __( 'Regenerate Files', 'qazana' ) ),
									'desc' => __( 'Styles set in Qazana are saved in CSS files in the uploads folder. Recreate those files, according to the most recent settings.', 'qazana' ),
								],
							],
							'reset_api_data' => [
								'label' => __( 'Sync Library', 'qazana' ),
								'field_args' => [
									'type' => 'raw_html',
									'html' => sprintf( '<button data-nonce="%s" class="button qazana-button-spinner" id="qazana-library-sync-button">%s</button>', wp_create_nonce( 'qazana_reset_library' ), __( 'Sync Library', 'qazana' ) ),
									'desc' => __( 'Qazana Library automatically updates on a daily basis. You can also manually update it by clicking on the sync button.', 'qazana' ),
								],
							],
						],
					],
				],
			],
			'replace_url' => [
				'label' => __( 'Replace URL', 'qazana' ),
				'sections' => [
					'replace_url' => [
						'callback' => function() {
							$intro_text = sprintf( __( '<strong>Important:</strong> It is strongly recommended that you <a target="_blank" href="%s">backup your database</a> before using Replace URL.', 'qazana' ), 'https://codex.wordpress.org/WordPress_Backups' );
							$intro_text = '<div>' . $intro_text . '</div>';

							echo $intro_text;
						},
						'fields' => [
							'replace_url' => [
								'label' => __( 'Update Site Address (URL)', 'qazana' ),
								'field_args' => [
									'type' => 'raw_html',
									'html' => sprintf( '<input type="text" name="from" placeholder="http://old-url.com" class="medium-text"><input type="text" name="to" placeholder="http://new-url.com" class="medium-text"><button data-nonce="%s" class="button qazana-button-spinner" id="qazana-replace-url-button">%s</button>', wp_create_nonce( 'qazana_replace_url' ), __( 'Replace URL', 'qazana' ) ),
									'desc' => __( 'Enter your old and new URLs for your WordPress installation, to update all Qazana data (Relevant for domain transfers or move to \'HTTPS\').', 'qazana' ),
								],
							],
						],
					],
				],
			],
		];
	}

	/**
	 * @since 1.3.0
	 * @access public
	*/
	public function display_settings_page() {
		wp_enqueue_script( 'qazana-dialog' );

		parent::display_settings_page();
	}

	/**
	 * @since 1.3.0
	 * @access protected
	*/
	protected function get_page_title() {
	    return __( 'Tools', 'qazana' );
	}
}
