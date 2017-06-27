<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * A Box Shadow set of controls
 *
 * @param array  $default    {
 * 		@type integer $horizontal Default 0
 * 		@type integer $vertical   Default 0
 * 		@type integer $blur       Default 10
 * 		@type integer $spread     Default 0
 * 		@type bool    $inset      Unused //TODO: allow set an inset shadow
 * 		@type string  $color      Shadow color, in rgb|rgba|hex format.
 * }
 *
 * @since 1.0.0
 */
class Control_Box_Shadow extends Base_Control_Multiple {

	public function get_type() {
		return 'box_shadow';
	}

	public function get_default_value() {
		return [
			'horizontal' => 0,
			'vertical' => 0,
			'blur' => 10,
			'spread' => 0,
			'inset' => '',
			'color' => 'rgba(0,0,0,0.5)',
		];
	}

	public function get_sliders() {
		return [
			[ 'label' => __( 'Blur', 'qazana' ), 'type' => 'blur', 'min' => 0, 'max' => 100 ],
			[ 'label' => __( 'Spread', 'qazana' ), 'type' => 'spread', 'min' => 0, 'max' => 100 ],
			[ 'label' => __( 'Horizontal', 'qazana' ), 'type' => 'horizontal', 'min' => -100, 'max' => 100 ],
			[ 'label' => __( 'Vertical', 'qazana' ), 'type' => 'vertical', 'min' => -100, 'max' => 100 ],
		];
	}

	public function content_template() {
		?>
		<#
		var defaultColorValue = '';

		if ( data.default.color ) {
			if ( '#' !== data.default.color.substring( 0, 1 ) ) {
				defaultColorValue = '#' + data.default.color;
			} else {
				defaultColorValue = data.default.color;
			}

			defaultColorValue = ' data-default-color=' + defaultColorValue; // Quotes added automatically.
		}
		#>
		<div class="qazana-control-field">
			<label class="qazana-control-title"><?php _e( 'Color', 'qazana' ); ?></label>
			<div class="qazana-control-input-wrapper">
				<input data-setting="color" class="qazana-box-shadow-color-picker" type="text" maxlength="7" placeholder="<?php esc_attr_e( 'Hex Value', 'qazana' ); ?>" data-alpha="true"{{{ defaultColorValue }}} />
			</div>
		</div>
		<?php foreach ( $this->get_sliders() as $slider ) : ?>
			<div class="qazana-box-shadow-slider">
				<label class="qazana-control-title"><?php echo $slider['label']; ?></label>
				<div class="qazana-control-input-wrapper">
					<div class="qazana-slider" data-input="<?php echo $slider['type']; ?>"></div>
					<div class="qazana-slider-input">
						<input type="number" min="<?php echo $slider['min']; ?>" max="<?php echo $slider['max']; ?>" data-setting="<?php echo $slider['type']; ?>"/>
					</div>
				</div>
			</div>
		<?php endforeach; ?>
		<?php
	}
}
