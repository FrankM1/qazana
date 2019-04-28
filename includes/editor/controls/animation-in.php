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
class Control_Animation_In extends Base_Data_Control {

	private static $_animations;

	public function get_type() {
		return 'animation_in';
	}

	public static function get_animations() {
		if ( is_null( self::$_animations ) ) {
			self::$_animations = [
				'Fading' => [
                    'fadeInPerspective' => 'Fade In Perspective',
					'fadeIn' => 'Fade In',
					'fadeInDown' => 'Fade In Down',
					'fadeInLeft' => 'Fade In Left',
					'fadeInRight' => 'Fade In Right',
					'fadeInUp' => 'Fade In Up',
                ],
                'Blinds' => [
                    'blindsLeft' => 'Blinds Left',
                    'blindsRight' => 'Blinds Right',
                    'blindsTop' => 'Blinds Top',
                    'blindsBottom' => 'Blinds Bottom',
                ],
                'Text' => [
                    'textType' => 'Type',
                    'textFadeInPerspective' => 'Fade in Perspective',
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
		<div class="qazana-control-field-description">{{{ data.description }}}</div>
		<# } #>
		<?php
	}
}
