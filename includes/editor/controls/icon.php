<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 *
 * @property array $icons   A list of font-icon classes. [ 'class-name' => 'nicename', ... ]
 *                            Default Font Awesome icons from the `get_icons` function
 * @property array $include list of classes to include form the $icons property
 * @property array $exclude list of classes to exclude form the $icons property
 *
 * @since 1.0.0
 */
class Control_Icon extends Base_Data_Control {

	public function get_type() {
		return 'icon';
	}

    public function get_icons() {
		return qazana()->icons_manager->get_all_iconsets();
    }

	protected function get_default_settings() {
		return [
			'icons' => $this->get_icons(),
		];
	}

	public function content_template() {
		?>
		<div class="qazana-control-field">
			<label class="qazana-control-title">{{{ data.label }}}</label>
			<div class="qazana-control-input-wrapper">
				<select class="qazana-control-icon" data-setting="{{ data.name }}" data-placeholder="<?php _e( 'Select an Icon', 'qazana' ); ?>">
                    <option value=""><?php _e( 'Select an Icon', 'qazana' ); ?></option>
                    <?php foreach ( $this->get_icons() as $group => $iconset ) {

							if ( empty( $iconset ) ) continue; ?>

                        <optgroup label="<?php echo ucfirst( str_replace( "-", " ", $group) ); ?>">
                            <?php foreach ( $iconset as $key => $value ) { ?>
        					<option value="<?php echo $key; ?>"><?php echo ucfirst( str_replace( "-", " ", $value) ); ?></option>
        					 <?php } ?>
                        </optgroup>
                    <?php } ?>
				</select>
			</div>
		</div>
		<# if ( data.description ) { #>
		<div class="qazana-control-description">{{ data.description }}</div>
		<# } #>
		<?php
	}
}
