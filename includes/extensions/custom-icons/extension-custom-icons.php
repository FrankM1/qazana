<?php

namespace Qazana\Extensions;

if ( ! defined('ABSPATH') ) {
    exit; // Exit if accessed directly
}

class Custom_Icons extends Base {

    /**
     * Extension title
     *
     * @return string
     */
    public function get_title() {
        return __('Custom Icons', 'qazana');
    }

    /**
     * Unique extension name
     *
     * @return string
     */
    public function get_name() {
        return 'custom-icons';
    } 

}