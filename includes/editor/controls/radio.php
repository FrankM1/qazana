<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * A single Radio control
 *
 * @param string $default     Whether to initial it as checked. 'on' for checked, and '' (empty string) for unchecked
 *                            Default ''
 *
 * @since 1.0.0
 */
class Control_Radio extends Base_Control {

	public function get_type() {
		return 'radio';
	}

	public function content_template() {
		?>
		<label class="qazana-control-title">
            <# _.each( data.options, function( option_title, option_value ) {
                var value = data.controlValue;
                if ( typeof value == 'string' ) {
                    var selected = ( option_value === value ) ? 'checked' : '';
                } else if ( null !== value ) {
                    var value = _.values( value );
                    var selected = ( -1 !== value.indexOf( option_value ) ) ? 'checked' : '';
                }
                #>
                <input type="radio" value="{{ value }}" />
                <span>{{{ option_title }}}</span>
            <# } ); #>
		</label>
		<# if ( data.description ) { #>
		<div class="qazana-control-description">{{{ data.description }}}</div>
		<# } #>
		<?php
	}
}
