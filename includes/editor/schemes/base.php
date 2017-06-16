<?php
namespace Builder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

abstract class Scheme_Base implements Scheme_Interface {

	private $_system_schemes;

	protected abstract function _init_system_schemes();

	public static function get_description() {
		return '';
	}

	public final function get_system_schemes() {
		if ( null === $this->_system_schemes ) {
			$this->_system_schemes = $this->_init_system_schemes();
		}

		return $this->_system_schemes;
	}

	public function get_scheme_value() {
		$scheme_value = get_option( 'builder_scheme_' . static::get_type() );

		if ( ! $scheme_value ) {
			$scheme_value = $this->get_default_scheme();

			update_option( 'builder_scheme_' . static::get_type(), $scheme_value );
		}

		return $scheme_value;
	}

	public function save_scheme( array $posted ) {
		$scheme_value = $this->get_scheme_value();

		update_option( 'builder_scheme_' . static::get_type(), array_replace( $scheme_value, array_intersect_key( $posted, $scheme_value ) ) );
	}

	public function get_scheme() {
		$scheme = [];

		$titles = $this->get_scheme_titles();

		foreach ( $this->get_scheme_value() as $scheme_key => $scheme_value ) {
			$scheme[ $scheme_key ] = [
				'title' => isset( $titles[ $scheme_key ] ) ? $titles[ $scheme_key ] : '',
				'value' => $scheme_value,
			];
		}

		return $scheme;
	}

	public final function print_template() {
		?>
		<script type="text/template" id="tmpl-builder-panel-schemes-<?php echo static::get_type(); ?>">
			<div class="builder-panel-scheme-buttons">
				<div class="builder-panel-scheme-button-wrapper builder-panel-scheme-reset">
					<button class="builder-button">
						<i class="fa fa-undo"></i><?php _e( 'Reset', 'builder' ); ?>
					</button>
				</div>
				<div class="builder-panel-scheme-button-wrapper builder-panel-scheme-discard">
					<button class="builder-button">
						<i class="fa fa-times"></i><?php _e( 'Discard', 'builder' ); ?>
					</button>
				</div>
				<div class="builder-panel-scheme-button-wrapper builder-panel-scheme-save">
					<button class="builder-button builder-button-success" disabled><?php _e( 'Apply', 'builder' ); ?></button>
				</div>
			</div>
			<?php $this->print_template_content(); ?>
		</script>
		<?php
	}
}
