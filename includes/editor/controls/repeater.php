<?php
namespace Builder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * NOTE! THIS CONTROL IS UNDER DEVELOPMENT, USE AT YOUR OWN RISK.
 *
 * Repeater control allows you to build repeatable blocks of fields. You can create for example a set of fields that
 * will contain a checkbox and a textfield. The user will then be able to add “rows”, and each row will contain a
 * checkbox and a textfield.
 *
 *
 *
 * @since 1.0.0
 */
class Control_Repeater extends Base_Control {

	public function get_type() {
		return 'repeater';
	}

	protected function get_default_settings() {
		return [
			'prevent_empty' => true,
		];
	}

	public function get_value( $control, $widget ) {
		$value = parent::get_value( $control, $widget );

		if ( ! empty( $value ) ) {
			foreach ( $value as &$item ) {
				foreach ( $control['fields'] as $field ) {
					$control_obj = builder()->controls_manager->get_control( $field['type'] );
					if ( ! $control_obj )
						continue;

					$item[ $field['name'] ] = $control_obj->get_value( $field, $item );
				}
			}
		}
		return $value;
	}

	public function content_template() {
		?>
		<label>
			<span class="builder-control-title">{{{ data.label }}}</span>
		</label>
		<div class="builder-repeater-fields"></div>
		<div class="builder-button-wrapper">
			<button class="builder-button builder-button-default builder-repeater-add"><span class="eicon-plus"></span><?php _e( 'Add Item', 'builder' ); ?></button>
		</div>
		<?php
	}
}
