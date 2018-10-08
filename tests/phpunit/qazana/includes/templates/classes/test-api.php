<?php
namespace Qazana\Testing\Includes\Template_Library;

use Qazana\Template_Library\Manager;
use Qazana\Template_Library\Api;
use Qazana\Testing\Qazana_Test_Base;

class Qazana_Test_Templates_Api extends Qazana_Test_Base {

    public function test_connection() {
        $response = wp_remote_post( Api::$api_info_url, [
            'timeout' => 500,
            'body' => [
                // Which API version is used.
                'api_version' => qazana_get_version(),
                // Which language to return.
                'site_lang' => get_bloginfo( 'language' ),
            ],
        ] );

        $body = wp_remote_retrieve_body( $response );

        $this->assertNotEmpty( $body );
    }

}