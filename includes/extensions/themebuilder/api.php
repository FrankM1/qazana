<?php

function qazana_theme_do_location( $location ) {
	return Qazana\Extensions\ThemeBuilder::instance()->get_locations_manager()->do_location( $location );
}

function qazana_location_exits( $location, $check_match = false ) {
	return Qazana\Extensions\ThemeBuilder::instance()->get_locations_manager()->location_exits( $location, $check_match );
}
