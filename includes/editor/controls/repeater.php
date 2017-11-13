<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * NOTE! THIS CONTROL IS UNDER DEVELOPMENT, USE AT YOUR OWN RISK.
 *
 * Repeater control allows you to build repeatable blocks of fields. You can create for example a set of fields that
 * will contain a checkbox and a textfield. The user will then be able to add “rows”, and each row will contain a
 * checkbox and a textfield.
 *
 * @since 1.0.0
 */
class Control_Repeater extends Base_Data_Control {

	public function get_type() {
		return 'repeater';
	}

	protected function get_default_settings() {
		return [
			'prevent_empty' => true,
			'is_repeater' => true,
		];
	}

	public function get_value( $control, $widget ) {
		$value = parent::get_value( $control, $widget );

		if ( ! empty( $value ) ) {
			foreach ( $value as &$item ) {
				foreach ( $control['fields'] as $field ) {
					$control_obj = qazana()->controls_manager->get_control( $field['type'] );
					if ( ! $control_obj instanceof Base_Data_Control )
						continue;

					$item[ $field['name'] ] = $control_obj->get_value( $field, $item );
				}
			}
		}
		return $value;
    }
 
    /**
	 * Import repeater.
	 *
	 * Used as a wrapper method for inner controls while importing Qazana
	 * template JSON file, and replacing the old data.
	 *
	 * @since 1.3.0
	 * @access public
	 *
	 * @param array $settings     Control settings.
	 * @param array $control_data Optional. Control data. Default is an empty array.
	 *
	 * @return array Control settings.
	 */
	public function on_import( $settings, $control_data = [] ) {
		if ( empty( $settings ) || empty( $control_data['fields'] ) ) {
			return $settings;
		}

		$method = 'on_import';

		foreach ( $settings as &$item ) {
			foreach ( $control_data['fields'] as $field ) {
				if ( empty( $field['name'] ) || empty( $item[ $field['name'] ] ) ) {
					continue;
				}

				$control_obj = qazana()->controls_manager->get_control( $field['type'] );

				if ( ! $control_obj ) {
					continue;
				}

				if ( method_exists( $control_obj, $method ) ) {
					$item[ $field['name'] ] = $control_obj->{$method}( $item[ $field['name'] ], $field );
				}
			}
		}

		return $settings;
	}

	public function content_template() {
		?>
		<label>
			<span class="qazana-control-title">{{{ data.label }}}</span>
		</label>
		<div class="qazana-repeater-fields"></div>
		<div class="qazana-button-wrapper">
			<button class="qazana-button qazana-button-default qazana-repeater-add" type="button">
				<span class="eicon-plus"></span><?php _e( 'Add Item', 'qazana' ); ?>
			</button>
        </div>
		<?php
	}
}
