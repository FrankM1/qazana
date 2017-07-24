<?php
namespace Qazana;

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
		$scheme_value = get_option( 'qazana_scheme_' . static::get_type() );

		if ( ! $scheme_value ) {
			$scheme_value = $this->get_default_scheme();

			update_option( 'qazana_scheme_' . static::get_type(), $scheme_value );
		}

		return $scheme_value;
	}

	public function save_scheme( array $posted ) {
		$scheme_value = $this->get_scheme_value();

		update_option( 'qazana_scheme_' . static::get_type(), array_replace( $scheme_value, array_intersect_key( $posted, $scheme_value ) ) );

		update_option( '_qazana_scheme_last_updated', time() );
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
		<script type="text/template" id="tmpl-qazana-panel-schemes-<?php echo static::get_type(); ?>">
			<div class="qazana-panel-scheme-buttons">
				<div class="qazana-panel-scheme-button-wrapper qazana-panel-scheme-reset">
					<button class="qazana-button">
						<i class="fa fa-undo"></i><?php _e( 'Reset', 'qazana' ); ?>
					</button>
				</div>
				<div class="qazana-panel-scheme-button-wrapper qazana-panel-scheme-discard">
					<button class="qazana-button">
						<i class="fa fa-times"></i><?php _e( 'Discard', 'qazana' ); ?>
					</button>
				</div>
				<div class="qazana-panel-scheme-button-wrapper qazana-panel-scheme-save">
					<button class="qazana-button qazana-button-success" disabled><?php _e( 'Apply', 'qazana' ); ?></button>
				</div>
			</div>
			<?php $this->print_template_content(); ?>
		</script>
		<?php
	}
}
