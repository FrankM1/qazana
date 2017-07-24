<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * An Animation effect select box control.
 *
 * @param string $default     The selected option key
 *                            Default empty
 *
 * @since 1.0.0
 */
class Control_Animation_Out extends Base_Data_Control {

	private static $_animations;

	public function get_type() {
		return 'animation_out';
	}

	public static function get_animations() {
		if ( is_null( self::$_animations ) ) {
			self::$_animations = [
				'Fading' => [
					'fadeOut' => 'Fade Out',
					'fadeOutDown' => 'Fade Out Down',
					'fadeOutLeft' => 'Fade Out Left',
					'fadeOutRight' => 'Fade Out Right',
					'fadeOutUp' => 'Fade Out Up',
				],
				'Zooming' => [
					'zoomOut' => 'Zoom Out',
					'zoomOutDown' => 'Zoom Out Down',
					'zoomOutLeft' => 'Zoom Out Left',
					'zoomOutRight' => 'Zoom Out Right',
					'zoomOutUp' => 'Zoom Out Up',
				],
				'Bouncing' => [
					'bounceOut' => 'Bounce Out',
					'bounceOutDown' => 'Bounce Out Down',
					'bounceOutLeft' => 'Bounce Out Left',
					'bounceOutRight' => 'Bounce Out Right',
					'bounceOutUp' => 'Bounce Out Up',
				],
				'Sliding' => [
					'slideOutDown' => 'Slide Out Down',
					'slideOutLeft' => 'Slide Out Left',
					'slideOutRight' => 'Slide Out Right',
					'slideOutUp' => 'Slide Out Up',
				],
				'Rotating' => [
					'rotateOut' => 'Rotate Out',
					'rotateOutDownLeft' => 'Rotate Out Down Left',
					'rotateOutDownRight' => 'Rotate Out Down Right',
					'rotateOutUpLeft' => 'Rotate Out Up Left',
					'rotateOutUpRight' => 'Rotate Out Up Right',
				],
				'Attention Seekers' => [
					'bounce' => 'Bounce',
					'flash' => 'Flash',
					'pulse' => 'Pulse',
					'rubberBand' => 'Rubber Band',
					'shake' => 'Shake',
					'headShake' => 'Head Shake',
					'swing' => 'Swing',
					'tada' => 'Tada',
					'wobble' => 'Wobble',
					'jello' => 'Jello',
				],
				'Light Speed' => [
					'lightSpeedOut' => 'Light Speed Out',
				],
				'Specials' => [
					'rollOut' => 'Roll Out',
				],
			];
		}

		return self::$_animations;
	}

	public function content_template() {
		?>
		<div class="qazana-control-field">
			<label class="qazana-control-title">{{{ data.label }}}</label>
			<div class="qazana-control-input-wrapper">
				<select data-setting="{{ data.name }}">
					<option value=""><?php _e( 'None', 'qazana' ); ?></option>
					<?php foreach ( self::get_animations() as $animations_group_name => $animations_group ) : ?>
						<optgroup label="<?php echo $animations_group_name; ?>">
							<?php foreach ( $animations_group as $animation_name => $animation_title ) : ?>
								<option value="<?php echo $animation_name; ?>"><?php echo $animation_title; ?></option>
							<?php endforeach; ?>
						</optgroup>
					<?php endforeach; ?>
				</select>
			</div>
		</div>
		<# if ( data.description ) { #>
		<div class="qazana-control-description">{{{ data.description }}}</div>
		<# } #>
		<?php
	}
}
