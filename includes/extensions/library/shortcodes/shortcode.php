<?php

namespace Qazana\Extensions\Library\Classes;

use Qazana\Template_Library\Source_Local;
use Qazana\User;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Shortcode {

	const SHORTCODE = 'qazana-template';

	public function __construct() {
		$this->add_actions();
	}

	public function admin_columns_headers( $defaults ) {
		$defaults['shortcode'] = __( 'Shortcode', 'qazana' );
		return $defaults;
	}

	public function admin_columns_content( $column_name, $post_id ) {
		if ( 'shortcode' === $column_name ) {
			// %s = shortcode, %d = post_id
			$shortcode = esc_attr( sprintf( '[%s id="%d"]', self::SHORTCODE, $post_id ) );
			printf( '<input class="qazana-shortcode-input" type="text" readonly onfocus="this.select()" value="%s" />', $shortcode );
		}
	}

	public function shortcode( $attributes = [] ) {
		if ( empty( $attributes['id'] ) ) {
			return '';
		}

		$output = qazana()->frontend->get_builder_content_for_display( $attributes['id'] );

		if ( User::is_current_user_can_edit() ) {
			$output .= '<a target="_blank" class="qazana-edit-template" href="'. add_query_arg( 'qazana', '', get_permalink( $attributes['id'] ) ) .'"><i class="fa fa-pencil"></i> '. __( 'Edit Template', 'qazana' ) .'</a>';
		}

		return $output;
	}

	private function add_actions() {

		if ( is_admin() ) {
			add_action( 'manage_' . Source_Local::CPT . '_posts_columns', [ $this, 'admin_columns_headers' ] );
			add_action( 'manage_' . Source_Local::CPT . '_posts_custom_column', [ $this, 'admin_columns_content' ] , 10, 2 );
		}

		add_shortcode( self::SHORTCODE, [ $this, 'shortcode' ] );
	}
}
