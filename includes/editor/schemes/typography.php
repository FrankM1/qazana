<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Qazana typography scheme.
 *
 * Qazana typography scheme class is responsible for initializing a scheme
 * for typography.
 *
 * @since 1.0.0
 */
class Scheme_Typography extends Scheme_Base {

	/**
	 * 1st typography scheme.
	 */
	const TYPOGRAPHY_1 = '1';

	/**
	 * 2nd typography scheme.
	 */
	const TYPOGRAPHY_2 = '2';

	/**
	 * 3rd typography scheme.
	 */
	const TYPOGRAPHY_3 = '3';

	/**
	 * 4th typography scheme.
	 */
	const TYPOGRAPHY_4 = '4';

	/**
	 * Get typography scheme type.
	 *
	 * Retrieve the typography scheme type.
	 *
	 * @since 1.0.0
	 * @access public
	 * @static
	 *
	 * @return string Typography scheme type.
	 */
	public static function get_type() {
		return 'typography';
	}

	/**
	 * Get typography scheme title.
	 *
	 * Retrieve the typography scheme title.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Typography scheme title.
	 */
	public function get_title() {
		return __( 'Typography', 'qazana' );
	}

	/**
	 * Get typography scheme disabled title.
	 *
	 * Retrieve the typography scheme disabled title.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Typography scheme disabled title.
	 */
	public function get_disabled_title() {
		return __( 'Default Fonts', 'qazana' );
	}

	/**
	 * Get typography scheme titles.
	 *
	 * Retrieve the typography scheme titles.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return array Typography scheme titles.
	 */
	public function get_scheme_titles() {
		return [
			self::TYPOGRAPHY_1 => __( 'Primary Headline', 'qazana' ),
			self::TYPOGRAPHY_2 => __( 'Secondary Headline', 'qazana' ),
			self::TYPOGRAPHY_3 => __( 'Body Text', 'qazana' ),
			self::TYPOGRAPHY_4 => __( 'Accent Text', 'qazana' ),
		];
	}

	/**
	 * Get default typography scheme.
	 *
	 * Retrieve the default typography scheme.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return array Default typography scheme.
	 */

    public function get_default_scheme() {
        $fonts = array(
            self::TYPOGRAPHY_1 => array(
                'font_family' => 'Roboto',
                'font_weight' => '600',
            ),
            self::TYPOGRAPHY_2 => array(
                'font_family' => 'Roboto Slab',
                'font_weight' => '400',
            ),
            self::TYPOGRAPHY_3 => array(
                'font_family' => 'Roboto',
                'font_weight' => '400',
            ),
            self::TYPOGRAPHY_4 => array(
                'font_family' => 'Roboto',
                'font_weight' => '500',
            ),
        );

        return apply_filters( 'qazana/schemes/default_fonts', $fonts );

    }

	/**
	 * Init system typography schemes.
	 *
	 * Initialize the system typography schemes.
	 *
	 * @since 1.0.0
	 * @access protected
	 *
	 * @return array System typography schemes.
	 */
	protected function _init_system_schemes() {
		return [];
	}

	/**
	 * Print typography scheme content template.
	 *
	 * Used to generate the HTML in the editor using Underscore JS template. The
	 * variables for the class are available using `data` JS object.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function print_template_content() {
		?>
		<div class="qazana-panel-scheme-items"></div>
		<?php
	}
}
