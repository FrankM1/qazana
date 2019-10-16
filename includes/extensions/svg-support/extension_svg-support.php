<?php
namespace Qazana\Extensions;

use Qazana\Utils;

class Svg_Support extends Base {

    /**
	 * Unique extension name
	 *
	 * @return string
	 */
    public function get_name() {
        return 'svg-support';
    }

    /**
     * Extension title
     *
     * @return string
     */
    public function get_title() {
        return __( 'SVG Support', 'qazana' );
    }

	public function __construct() {
        add_filter( 'upload_mimes', [ $this, 'mime_types' ] );
	}

    function mime_types($mimes) {
        $mimes['svg'] = 'image/svg+xml';
        return $mimes;
    }
}
