<?php
namespace Qazana\Extensions;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Editor_Tools extends Base {

    public function get_name() {
		return 'editor_tools';
	}

	public function get_title() {
		return __( 'Editor tools', 'qazana' );
    }

	public function __construct() {
    }

    public function preview_grid() {
        echo '<div id="grid">
            <div class="qazana-container">
                <div class="qazana-row">
                    <div class="qazana-column" data-col="12"><div class="shadow"></div></div>
                    <div class="qazana-column" data-col="12"><div class="shadow"></div></div>
                    <div class="qazana-column" data-col="12"><div class="shadow"></div></div>
                    <div class="qazana-column" data-col="12"><div class="shadow"></div></div>
                    <div class="qazana-column" data-col="12"><div class="shadow"></div></div>
                    <div class="qazana-column" data-col="12"><div class="shadow"></div></div>
                    <div class="qazana-column" data-col="12"><div class="shadow"></div></div>
                    <div class="qazana-column" data-col="12"><div class="shadow"></div></div>
                    <div class="qazana-column" data-col="12"><div class="shadow"></div></div>
                    <div class="qazana-column" data-col="12"><div class="shadow"></div></div>
                    <div class="qazana-column" data-col="12"><div class="shadow"></div></div>
                    <div class="qazana-column" data-col="12"><div class="shadow"></div></div>
                </div>
            </div>
        </div>';
    }

}