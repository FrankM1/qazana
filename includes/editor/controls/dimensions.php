<?php
namespace Builder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * A group of Dimensions settings (Top, Right, Bottom, Left) With the option to link them together
 *
 * @param array  $default {
 * 		@type integer       $top                     Default empty
 * 		@type integer       $right                   Default empty
 * 		@type integer       $bottom                  Default empty
 * 		@type integer       $left                    Default empty
 * 		@type string        $unit                    The selected CSS Unit. 'px', '%', 'em'
 * 		                               				 Default 'px'
 * 		@type bool          $isLinked                Whether to link them together ( prevent set different values )
 * 		                               				 Default true
 * }
 *
 * @param array|string $allowed_dimensions      Which fields to show, 'all' | 'horizontal' | 'vertical' | [ 'top', 'left' ... ]
 *                                              Default 'all'
 *
 * @since                         1.0.0
 */
class Control_Dimensions extends Control_Base_Units {

	public function get_type() {
		return 'dimensions';
	}

	public function get_default_value() {
		return array_merge( parent::get_default_value(), [
			'top' => '',
			'right' => '',
			'bottom' => '',
			'left' => '',
			'isLinked' => true,
		] );
	}

	protected function get_default_settings() {
		return array_merge( parent::get_default_settings(), [
			'label_block' => true,
			'allowed_dimensions' => 'all',
			'placeholder' => '',
		] );
	}

	public function content_template() {
		$dimensions = [
			'top' => __( 'Top', 'builder' ),
			'right' => __( 'Right', 'builder' ),
			'bottom' => __( 'Bottom', 'builder' ),
			'left' => __( 'Left', 'builder' ),
		];
		?>
		<div class="builder-control-field">
			<label class="builder-control-title">{{{ data.label }}}</label>
			<?php $this->print_units_template(); ?>
			<div class="builder-control-input-wrapper">
				<ul class="builder-control-dimensions">
					<?php foreach ( $dimensions as $dimension_key => $dimension_title ) : ?>
						<li class="builder-control-dimension">
							<input type="number" data-setting="<?php echo esc_attr( $dimension_key ); ?>"
							       placeholder="<#
						       if ( _.isObject( data.placeholder ) ) {
						        if ( ! _.isUndefined( data.placeholder.<?php echo $dimension_key; ?> ) ) {
						            print( data.placeholder.<?php echo $dimension_key; ?> );
						        }
						       } else {
						        print( data.placeholder );
						       } #>"
							<# if ( -1 === _.indexOf( allowed_dimensions, '<?php echo $dimension_key; ?>' ) ) { #>
								disabled
								<# } #>
									/>
									<span><?php echo $dimension_title; ?></span>
						</li>
					<?php endforeach; ?>
					<li>
						<button class="builder-link-dimensions tooltip-target" data-tooltip="<?php _e( 'Link values together', 'builder' ); ?>">
							<span class="builder-linked"><i class="fa fa-link"></i></span>
							<span class="builder-unlinked"><i class="fa fa-chain-broken"></i></span>
						</button>
					</li>
				</ul>
			</div>
		</div>
		<# if ( data.description ) { #>
		<div class="builder-control-description">{{{ data.description }}}</div>
		<# } #>
		<?php
	}
}
