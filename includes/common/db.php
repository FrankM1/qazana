<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class DB {

	const STATUS_PUBLISH = 'publish';
	const STATUS_DRAFT = 'draft';
	const STATUS_AUTOSAVE = 'autosave';

	/**
	 * @var array
	 */
	protected $switched_post_data = [];

	/**
	 * Save builder method.
	 *
	 * @since 1.0.0
	 *
	 * @param int $post_id
	 * @param array $posted
	 * @param string $status
	 *
	 * @return void
	 */
	public function save_editor( $post_id, $posted, $status = self::STATUS_PUBLISH, $save_state = 'save' ) {

		// Change the global post to current library post, so widgets can use `get_the_ID` and other post data
		$this->switch_to_post( $post_id );

		$editor_data = $this->_get_editor_data( $posted );

        // exit if data is empty and save state is not in delete mode. Important for prevention of accidental template deletions
        if ( ! $editor_data && $save_state !== 'delete' ) {
            return false;
        }

		// We need the `wp_slash` in order to avoid the unslashing during the `update_post_meta`
		$json_value = wp_slash( wp_json_encode( $editor_data ) );

		if ( self::STATUS_PUBLISH === $status ) {

			$this->remove_draft( $post_id );

			$is_meta_updated = update_metadata( 'post', $post_id, '_qazana_data', $json_value );

			if ( $is_meta_updated ) {
				Revisions_Manager::handle_revision();
			}

			$this->_save_plain_text( $post_id );
		} elseif ( self::STATUS_AUTOSAVE === $status ) {
			Revisions_Manager::handle_revision();

			$old_autosave = wp_get_post_autosave( $post_id, get_current_user_id() );

			if ( $old_autosave ) {
				wp_delete_post_revision( $old_autosave->ID );
			}

			$autosave_id = wp_create_post_autosave( [
				'post_ID' => $post_id,
				'post_title' => __( 'Auto Save', 'qazana' ) . ' ' . date( 'Y-m-d H:i' ),
				'post_modified' => current_time( 'mysql' ),
			] );

			if ( $autosave_id ) {
				update_metadata( 'post',  $autosave_id, '_qazana_data', $json_value );
			}
		}

		update_post_meta( $post_id, '_qazana_version', qazana_get_db_version() );

		// Restore global post
		$this->restore_current_post();

		// Remove Post CSS
		delete_post_meta( $post_id, Post_CSS_File::META_KEY );

		do_action( 'qazana/editor/after_save', $post_id, $editor_data );
	}

	/**
	 * Get & Parse the builder from DB.
	 *
	 * @since 1.0.0
	 * @param int $post_id
	 * @param string $status
	 *
	 * @return array
	 */
	public function get_builder( $post_id, $status = self::STATUS_PUBLISH ) {
		$data = $this->get_plain_editor( $post_id, $status );

		$this->switch_to_post( $post_id );
		$editor_data = $this->_get_editor_data( $data, true );
		$this->restore_current_post();

		return $editor_data;
	}

	protected function _get_json_meta( $post_id, $key ) {
		$meta = get_post_meta( $post_id, $key, true );

		if ( is_string( $meta ) && ! empty( $meta ) ) {
			$meta = json_decode( $meta, true );
		}

		return $meta;
	}

	public function get_plain_editor( $post_id, $status = self::STATUS_PUBLISH ) {
		$data = $this->_get_json_meta( $post_id, '_qazana_data' );

		if ( self::STATUS_DRAFT === $status && isset( $_GET['qazana'] ) ) {
			$draft_data = $this->_get_json_meta( $post_id, '_qazana_draft_data' );

			if ( ! empty( $draft_data ) ) {
				$data = $draft_data;
			}

			if ( empty( $data ) ) {
				$data = $this->_get_new_editor_from_wp_editor( $post_id );
			}
		}

		return $data;
	}

	protected function _get_new_editor_from_wp_editor( $post_id ) {
		$post = get_post( $post_id );

		if ( empty( $post ) || empty( $post->post_content ) ) {
			return [];
		}

		$text_editor_widget_type = qazana()->widgets_manager->get_widget_types( 'text-editor' );

		// TODO: Better coding to start template for editor
		return [
			[
				'id' => Utils::generate_random_string(),
				'elType' => 'section',
				'elements' => [
					[
						'id' => Utils::generate_random_string(),
						'elType' => 'column',
						'elements' => [
							[
								'id' => Utils::generate_random_string(),
								'elType' => $text_editor_widget_type::get_type(),
								'widgetType' => $text_editor_widget_type->get_name(),
								'settings' => [
									'editor' => $post->post_content,
								],
							],
						],
					],
				],
			],
		];
	}

	/**
	 * Remove draft data from DB.
	 *
	 * @since 1.0.0
	 * @param $post_id
	 *
	 * @return void
	 */
	public function remove_draft( $post_id ) {
		delete_post_meta( $post_id, '_qazana_draft_data' );
	}

	/**
	 * Get edit mode by Page ID
	 *
	 * @since 1.0.0
	 * @param $post_id
	 *
	 * @return mixed
	 */
	public function get_edit_mode( $post_id ) {
		return get_post_meta( $post_id, '_qazana_edit_mode', true );
	}

	/**
	 * Setup the edit mode per Page ID
	 *
	 * @since 1.0.0
	 * @param int $post_id
	 * @param string $mode
	 *
	 * @return void
	 */
	public function set_edit_mode( $post_id, $mode = 'qazana' ) {

		global $pagenow;

		if ( 'qazana' === $mode ) {
			update_post_meta( $post_id, '_qazana_edit_mode', $mode );
			do_action('qazana/db/set_edit_mode', $mode, $post_id );
		} else {
			delete_post_meta( $post_id, '_qazana_edit_mode' );
		}
	}

	/**
	 * Set whether the page is qazana page or not
	 *
	 * @since 1.5.0
	 *
	 * @param int $post_id
	 * @param bool $is_qazana
	 *
	 */
	public function set_is_builder_page( $post_id, $is_qazana = true ) {
		if ( $is_qazana ) {
			// Use the string `qazana` and not a boolean for rollback compatibility
			update_post_meta( $post_id, '_qazana_edit_mode', 'qazana' );
		} else {
			delete_post_meta( $post_id, '_qazana_edit_mode' );
		}
	}

	private function _render_element_plain_content( $element_data ) {
		if ( 'widget' === $element_data['elType'] ) {
			/** @var Widget_Base $widget */
			$widget = qazana()->elements_manager->create_element_instance( $element_data );

			if ( is_object( $widget ) ) {
				$widget->render_plain_content();
			}
		}

		if ( ! empty( $element_data['elements'] ) ) {
			foreach ( $element_data['elements'] as $element ) {
				$this->_render_element_plain_content( $element );
			}
		}
	}

	private function _save_plain_text( $post_id ) {
		ob_start();

		$data = $this->get_plain_editor( $post_id );

		if ( $data ) {
			foreach ( $data as $element_data ) {
				$this->_render_element_plain_content( $element_data );
			}
		}

		$plain_text = ob_get_clean();

		// Remove unnecessary tags.
		$plain_text = preg_replace( '/<\/?div[^>]*\>/i', '', $plain_text );
		$plain_text = preg_replace( '/<\/?span[^>]*\>/i', '', $plain_text );
		$plain_text = preg_replace( '#<script(.*?)>(.*?)</script>#is', '', $plain_text );
		$plain_text = preg_replace( '/<i [^>]*><\\/i[^>]*>/', '', $plain_text );
		$plain_text = preg_replace( '/ class=".*?"/', '', $plain_text );

		// Remove empty lines.
		$plain_text = preg_replace( '/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/', "\n", $plain_text );

		wp_update_post(
			[
				'ID' => $post_id,
				'post_content' => $plain_text,
			]
		);
	}

	/**
	 * Sanitize posted data.
	 *
	 * @since 1.0.0
	 *
	 * @param array $data
	 *
	 * @param bool $with_html_content
	 *
	 * @return array
	 */
	private function _get_editor_data( $data, $with_html_content = false ) {
		$editor_data = [];

        if ( empty ( $data ) ) {
            return false;
        }

		foreach ( $data as $element_data ) {
			$element = qazana()->elements_manager->create_element_instance( $element_data );

			$editor_data[] = $element->get_raw_data( $with_html_content );
		} // End Section

        if ( empty ( $editor_data ) ) {
            return false;
        }

		return $editor_data;
	}

	public function iterate_data( $data_container, $callback ) {
		if ( isset( $data_container['elType'] ) ) {
			if ( ! empty( $data_container['elements'] ) ) {
				$data_container['elements'] = $this->iterate_data( $data_container['elements'], $callback );
			}

			return $callback( $data_container );
		}

		if ( is_array( $data_container ) ) {
		foreach ( $data_container as $element_key => $element_value ) {
			$element_data = $this->iterate_data( $data_container[ $element_key ], $callback );

			if ( null === $element_data ) {
				continue;
			}

			$data_container[ $element_key ] = $element_data;
			}
		}

		return $data_container;
	}

	public function copy_qazana_meta( $from_post_id, $to_post_id ) {
		$from_post_meta = get_post_meta( $from_post_id );

		foreach ( $from_post_meta as $meta_key => $values ) {
			// Copy only meta with the `_qazana` prefix
			if ( 0 === strpos( $meta_key, '_qazana' ) ) {
				$value = $values[0];

				// The qazana JSON needs slashes before saving
				if ( '_qazana_data' === $meta_key ) {
					$value = wp_slash( $value );
				} else {
 					$value = maybe_unserialize( $value );
  				}

				// Don't use `update_post_meta` that can't handle `revision` post type
				update_metadata( 'post', $to_post_id, $meta_key, $value );
			}
		}
	}

	public function is_built_with_qazana( $post_id ) {
		return ! ! get_post_meta( $post_id, '_qazana_edit_mode', true );
	}

	/**
	 * @deprecated 1.4.0
	 */
	public function has_qazana_in_post( $post_id ) {
		return $this->is_built_with_qazana( $post_id );
	}

	public function switch_to_post( $post_id ) {
		// If is already switched, or is the same post, return.
		if ( get_the_ID() === $post_id ) {
			$this->switched_post_data[] = false;
			return;
		}

		$this->switched_post_data[] = [
			'switched_id' => $post_id,
			'original_id' => get_the_ID(),// Note, it can be false if the global isn't set
		];

		$GLOBALS['post'] = get_post( $post_id );
		setup_postdata( $GLOBALS['post'] );
	}

	public function restore_current_post() {
		$data = array_pop( $this->switched_post_data );

		// If not switched, return.
		if ( ! $data ) {
			return;
		}

		// It was switched from an empty global post, restore this state and unset the global post
		if ( false === $data['original_id'] ) {
			unset( $GLOBALS['post'] );
			return;
		}

		$GLOBALS['post'] = get_post( $data['original_id'] );
		setup_postdata( $GLOBALS['post'] );
	}
}
