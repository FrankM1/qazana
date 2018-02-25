<?php
namespace Qazana\Extensions;

class Gutenberg extends Base {

    /**
	 * Unique extension name
	 *
	 * @return string
	 */
	public function get_name() {
        return 'gutenberg';
    }

    /**
     * Extension title
     *
     * @return string
     */
    public function get_title() {
        return 'Gutenberg';
    }

    public function __construct() {
        add_action( 'init', [ __CLASS__, 'init' ] );
    }

    public static function init() {

    }

}
