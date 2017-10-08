<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Global_CSS_File extends CSS_File {

	const META_KEY = '_qazana_global_css';

	const FILE_HANDLER_ID = 'qazana-global';

	public function get_name() {
		return 'global';
	}

	/**
	 * @return array
	 */
	protected function load_meta() {
		return get_option( self::META_KEY );
	}

	/**
	 * @param string $meta
	 */
	protected function update_meta( $meta ) {
		update_option( self::META_KEY, $meta );
	}

	/**
	 * @return string
	 */
	protected function get_file_handle_id() {
		return self::FILE_HANDLER_ID;
	}

	protected function render_css() {
		$this->render_schemes_css();
	}

	/**
	 * @return string
	 */
	protected function get_file_name() {
		return 'global';
	}
	
	protected function get_enqueue_dependencies() {
		return [ 'qazana-frontend' ];
	}

	protected function get_inline_dependency() {
		return 'qazana-frontend';
	}

	/**
	 * @return bool
	 */
	protected function is_update_required() {
		$file_last_updated = $this->get_meta( 'time' );

		$schemes_last_update = get_option( '_qazana_scheme_last_updated' );

		if ( $file_last_updated < $schemes_last_update ) {
			return true;
		}

		$qazana_settings_last_updated = get_option( '_qazana_settings_update_time' );

		if ( $file_last_updated < $qazana_settings_last_updated ) {
			return true;
		}

		return false;
	}

	private function render_schemes_css() {
		$qazana = qazana();

		foreach ( $qazana->widgets_manager->get_widget_types() as $widget ) {
			$scheme_controls = $widget->get_scheme_controls();

			foreach ( $scheme_controls as $control ) {
				$this->add_control_rules(
					$control, $widget->get_controls(), function( $control ) use ( $qazana ) {
						$scheme_value = $qazana->schemes_manager->get_scheme_value( $control['scheme']['type'], $control['scheme']['value'] );

						if ( empty( $scheme_value ) ) {
							return null;
						}

						if ( ! empty( $control['scheme']['key'] ) ) {
							$scheme_value = $scheme_value[ $control['scheme']['key'] ];
						}

						if ( empty( $scheme_value ) ) {
							return null;
						}

						return $scheme_value;
					}, [ '{{WRAPPER}}' ], [ '.qazana-widget-' . $widget->get_name() ]
				);
			}
		}
	}
}
