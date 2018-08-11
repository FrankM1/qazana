<?php

use Qazana\Extensions\ThemeBuilder as Module;

$location_manager = Module::instance()->get_locations_manager();

$location_manager->do_location( 'footer' ); ?>

<?php wp_footer(); ?>

</body>
</html>
