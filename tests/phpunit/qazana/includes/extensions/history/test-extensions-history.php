<?php

namespace Qazana\Testing\Extensions\History;

use Qazana\Extensions\History;
use Qazana\Testing\Qazana_Test_Base;
use Qazana\Extensions\Manager;

class Qazana_Test_Manager extends Qazana_Test_Base {

	public function test_should_get_name() {

        $manager = $this->qazana()->extensions_manager;

        $manager->loader->add_stack( array( 'path' => $this->qazana()->plugin_dir, 'uri' => $this->qazana()->plugin_url ), $this->qazana()->plugin_extensions_locations );

        foreach ( $manager->loader->merge_files_stack_locations() as $path ) {
             if ( ! is_dir( $path ) ) {
                return false;
            }
            
            $folders = scandir( $path, 1 );

            $manager->initialize_extension( 'history', $path );
        }

        $extension = $manager->get_extension( 'history' );

		$this->assertEquals( $extension->get_name(), 'history' );
	}
}
