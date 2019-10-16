<?php
namespace Qazana\Extensions;

class Polylang extends Base {

    /**
	 * Unique extension name
	 *
	 * @return string
	 */
	public function get_name() {
        return 'polylang';
    }

    /**
     * Extension title
     *
     * @return string
     */
    public function get_title() {
        return 'Polylang';
    }

    public function __construct() {
        // Copy qazana data while polylang creates a translation copy
		add_filter( 'pll_copy_post_metas', [ __CLASS__, 'save_polylang_meta' ], 10 , 4 );
    }

    /**
	 * Save polylang meta.
	 *
	 * Copy qazana data while polylang creates a translation copy. Fired by
	 * `pll_copy_post_metas` filter.
	 *
	 * @since 1.3.1
	 * @access public
	 * @static
	 *
	 * @param array $keys List of custom fields names.
	 * @param bool  $sync True if it is synchronization, false if it is a copy.
	 * @param int   $from ID of the post from which we copy informations.
	 * @param int   $to   ID of the post to which we paste informations.
	 *
	 * @return array List of custom fields names.
	*/
	public static function save_polylang_meta( $keys, $sync, $from, $to ) {
		// Copy only for a new post.
		if ( ! $sync ) {
			qazana()->get_db()->copy_qazana_meta( $from, $to );
		}

		return $keys;
	}

}
