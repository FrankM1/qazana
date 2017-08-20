<?php
namespace Qazana\Extensions\Library\WP_Widgets;

use Qazana\Plugin;
use Qazana\Template_Library\Source_Local;
use Qazana\Extensions\Library;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Qazana_Library extends \WP_Widget {

	public function __construct() {
		parent::__construct(
			'qazana-library',
			esc_html__( 'Qazana Library', 'energia' ),
			[
				'description' => esc_html__( 'Embed your saved elements.', 'energia' ),
			]
		);
	}

	/**
	 * @param array $args
	 * @param array $instance
	 */
	public function widget( $args, $instance ) {
		echo $args['before_widget'];

		if ( ! empty( $instance['title'] ) ) {
			echo $args['before_title'] . apply_filters( 'widget_title', $instance['title'] ) . $args['after_title'];
		}

		if ( ! empty( $instance['template_id'] ) ) {
			echo qazana()->frontend->get_builder_content_for_display( $instance['template_id'] );
		}

		echo $args['after_widget'];
	}

	/**
	 * @param array $instance
	 *
	 * @return void
	 */
	public function form( $instance ) {
		if ( ! isset( $instance['title'] ) ) :
			$instance['title'] = '';
		endif;
		if ( ! isset( $instance['template_id'] ) ) :
			$instance['template_id'] = '';
		endif;

		$templates = Library::get_templates();

		if ( empty( $templates ) ) {
			echo Library::empty_templates_message();
			return;
		}
		?>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>"><?php esc_attr_e( 'Title', 'energia' ); ?>:</label>
			<input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'title' ) ); ?>" type="text" value="<?php echo esc_attr( $instance['title'] ); ?>">
		</p>

		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'template_id' ) ); ?>"><?php esc_attr_e( 'Choose Template', 'energia' ); ?>:</label>
			<select class="widefat qazana-widget-template-select" id="<?php echo esc_attr( $this->get_field_id( 'template_id' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'template_id' ) ); ?>">
				<option value="">-- <?php _e( 'Select', 'energia' ); ?> --</option>
				<?php
				foreach ( $templates as $template ) :
					$selected = selected( $template['template_id'], $instance['template_id'] );
					?>
					<option value="<?php echo $template['template_id'] ?>" <?php echo $selected; ?> data-type="<?php echo $template['type']; ?>">
						<?php echo $template['title']; ?> (<?php echo $template['type']; ?>)
					</option>
				<?php endforeach; ?>
			</select>
			<?php
			$style = '';
			$template_type = get_post_meta( $template['template_id'], Source_Local::TYPE_META_KEY, true );

			// 'widget' is editable only from an Qazana page
			if ( 'widget' === $template_type ) {
				$style = 'style="display:none"';
			}
			?>
			<a target="_blank" class="qazana-edit-template" <?php echo $style; ?> href="<?php echo add_query_arg( 'qazana', '', get_permalink( $instance['template_id'] ) ); ?>">
				<i class="fa fa-pencil"></i> <?php echo __( 'Edit Template', 'energia' ); ?>
			</a>
		</p>
		<?php
	}

	/**
	 *
	 * @param array $new_instance
	 * @param array $old_instance
	 *
	 * @return array
	 */
	public function update( $new_instance, $old_instance ) {
		$instance = [];
		$instance['title'] = ( ! empty( $new_instance['title'] ) ) ? strip_tags( $new_instance['title'] ) : '';
		$instance['template_id'] = $new_instance['template_id'];

		return $instance;
	}
}
