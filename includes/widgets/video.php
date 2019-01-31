<?php
namespace Qazana;

use Qazana\Extensions\DynamicTags;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Video extends Widget_Base {

	/**
	 * Get widget name.
	 *
	 * Retrieve video widget name.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget name.
	 */
	public function get_name() {
		return 'video';
	}

	/**
	 * Get widget title.
	 *
	 * Retrieve video widget title.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget title.
	 */
	public function get_title() {
		return __( 'Video', 'qazana' );
	}

	/**
	 * Get widget icon.
	 *
	 * Retrieve video widget icon.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget icon.
	 */
	public function get_icon() {
		return 'eicon-youtube';
	}

	/**
	 * Get widget categories.
	 *
	 * Retrieve the list of categories the video widget belongs to.
	 *
	 * Used to determine where to display the widget in the editor.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return array Widget categories.
	 */
	public function get_categories() {
		return [ 'general' ];
	}

	/**
	 * Get widget keywords.
	 *
	 * Retrieve the list of keywords the widget belongs to.
	 *
	 * @since 2.1.0
	 * @access public
	 *
	 * @return array Widget keywords.
	 */
	public function get_keywords() {
		return [ 'video', 'player', 'embed', 'youtube', 'vimeo', 'dailymotion' ];
	}

	/**
	 * Register video widget controls.
	 *
	 * Adds different input fields to allow the user to change and customize the widget settings.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	protected function _register_controls() {
		$this->start_controls_section(
			'section_video',
			[
				'label' => __( 'Video', 'qazana' ),
			]
		);

		$this->add_control(
			'video_type',
			[
				'label' => __( 'Source', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'youtube',
				'options' => [
					'youtube' => __( 'YouTube', 'qazana' ),
					'vimeo' => __( 'Vimeo', 'qazana' ),
					'dailymotion' => __( 'Dailymotion', 'qazana' ),
					'video_central' => __( 'Video Central', 'energia' ),
					'hosted' => __( 'Self Hosted', 'qazana' ),
				],
			]
		);

		$this->add_control(
			'youtube_url',
			[
				'label' => __( 'Link', 'qazana' ),
				'type' => Controls_Manager::TEXT,
				'dynamic' => [
					'active' => true,
					'categories' => [
						DynamicTags::POST_META_CATEGORY,
						DynamicTags::URL_CATEGORY,
					],
				],
				'placeholder' => __( 'Enter your URL', 'qazana' ) . ' (YouTube)',
				'default' => 'https://www.youtube.com/watch?v=0GK1xf6rv5w',
				'label_block' => true,
				'condition' => [
					'video_type' => 'youtube',
				],
			]
		);

		$this->add_control(
			'vimeo_url',
			[
				'label' => __( 'Link', 'qazana' ),
				'type' => Controls_Manager::TEXT,
				'dynamic' => [
					'active' => true,
					'categories' => [
						DynamicTags::POST_META_CATEGORY,
						DynamicTags::URL_CATEGORY,
					],
				],
				'placeholder' => __( 'Enter your URL', 'qazana' ) . ' (Vimeo)',
				'default' => 'https://vimeo.com/209928779',
				'label_block' => true,
				'condition' => [
					'video_type' => 'vimeo',
				],
			]
		);

		$this->add_control(
			'dailymotion_url',
			[
				'label' => __( 'Link', 'qazana' ),
				'type' => Controls_Manager::TEXT,
				'dynamic' => [
					'active' => true,
					'categories' => [
						DynamicTags::POST_META_CATEGORY,
						DynamicTags::URL_CATEGORY,
					],
				],
				'placeholder' => __( 'Enter your URL', 'qazana' ) . ' (Dailymotion)',
				'default' => 'https://www.dailymotion.com/video/x6tqhqb',
				'label_block' => true,
				'condition' => [
					'video_type' => 'dailymotion',
				],
			]
		);

		$this->add_control(
			'insert_url',
			[
				'label' => __( 'External URL', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'condition' => [
					'video_type' => 'hosted',
				],
			]
		);

		$this->add_control(
			'hosted_url',
			[
				'label' => __( 'Choose File', 'qazana' ),
				'type' => Controls_Manager::MEDIA,
				'dynamic' => [
					'active' => true,
					'categories' => [
						DynamicTags::MEDIA_CATEGORY,
					],
				],
				'media_type' => 'video',
				'condition' => [
					'video_type' => 'hosted',
					'insert_url' => '',
				],
			]
		);

		$this->add_control(
			'external_url',
			[
				'label' => __( 'URL', 'qazana' ),
				'type' => Controls_Manager::URL,
				'autocomplete' => false,
				'show_external' => false,
				'label_block' => true,
				'show_label' => false,
				'dynamic' => [
					'active' => true,
					'categories' => [
						DynamicTags::POST_META_CATEGORY,
						DynamicTags::URL_CATEGORY,
					],
				],
				'media_type' => 'video',
				'placeholder' => __( 'Enter your URL', 'qazana' ),
				'condition' => [
					'video_type' => 'hosted',
					'insert_url' => 'yes',
				],
			]
		);

		$this->add_control(
			'start',
			[
				'label' => __( 'Start Time', 'qazana' ),
				'type' => Controls_Manager::NUMBER,
				'description' => __( 'Specify a start time (in seconds)', 'qazana' ),
				'condition' => [
					'loop' => '',
				],
			]
		);

		$this->add_control(
			'end',
			[
				'label' => __( 'End Time', 'qazana' ),
				'type' => Controls_Manager::NUMBER,
				'description' => __( 'Specify an end time (in seconds)', 'qazana' ),
				'condition' => [
					'loop' => '',
					'video_type' => [ 'youtube', 'hosted' ],
				],
			]
		);

		$this->add_control(
			'video_options',
			[
				'label' => __( 'Video Options', 'qazana' ),
				'type' => Controls_Manager::HEADING,
				'separator' => 'before',
			]
		);

		$this->add_control(
			'autoplay',
			[
				'label' => __( 'Autoplay', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
			]
		);

		$this->add_control(
			'mute',
			[
				'label' => __( 'Mute', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
			]
		);

		$this->add_control(
			'loop',
			[
				'label' => __( 'Loop', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'condition' => [
					'video_type!' => 'dailymotion',
				],
			]
		);

		$this->add_control(
			'controls',
			[
				'label' => __( 'Player Controls', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'label_off' => __( 'Hide', 'qazana' ),
				'label_on' => __( 'Show', 'qazana' ),
				'default' => 'yes',
				'condition' => [
					'video_type!' => 'vimeo',
				],
			]
		);

		$this->add_control(
			'showinfo',
			[
				'label' => __( 'Video Info', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'label_off' => __( 'Hide', 'qazana' ),
				'label_on' => __( 'Show', 'qazana' ),
				'default' => 'yes',
				'condition' => [
					'video_type' => [ 'dailymotion' ],
				],
			]
		);

		$this->add_control(
			'modestbranding',
			[
				'label' => __( 'Modest Branding', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'condition' => [
					'video_type' => [ 'youtube' ],
					'controls' => 'yes',
				],
			]
		);

		$this->add_control(
			'logo',
			[
				'label' => __( 'Logo', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'label_off' => __( 'Hide', 'qazana' ),
				'label_on' => __( 'Show', 'qazana' ),
				'default' => 'yes',
				'condition' => [
					'video_type' => [ 'dailymotion' ],
				],
			]
		);

		$this->add_control(
			'color',
			[
				'label' => __( 'Controls Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'condition' => [
					'video_type' => [ 'vimeo', 'dailymotion' ],
				],
			]
		);

		// YouTube.
		$this->add_control(
			'yt_privacy',
			[
				'label' => __( 'Privacy Mode', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'description' => __( 'When you turn on privacy mode, YouTube won\'t store information about visitors on your website unless they play the video.', 'qazana' ),
				'condition' => [
					'video_type' => 'youtube',
				],
			]
		);

		$this->add_control(
			'rel',
			[
				'label' => __( 'Suggested Videos', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'' => __( 'Current Video Channel', 'qazana' ),
					'yes' => __( 'Any Video', 'qazana' ),
				],
				'condition' => [
					'video_type' => 'youtube',
				],
			]
		);

		// Vimeo.
		$this->add_control(
			'vimeo_title',
			[
				'label' => __( 'Intro Title', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'label_off' => __( 'Hide', 'qazana' ),
				'label_on' => __( 'Show', 'qazana' ),
				'default' => 'yes',
				'condition' => [
					'video_type' => 'vimeo',
				],
			]
		);

		$this->add_control(
			'vimeo_portrait',
			[
				'label' => __( 'Intro Portrait', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'label_off' => __( 'Hide', 'qazana' ),
				'label_on' => __( 'Show', 'qazana' ),
				'default' => 'yes',
				'condition' => [
					'video_type' => 'vimeo',
				],
			]
		);

		$this->add_control(
			'vimeo_byline',
			[
				'label' => __( 'Intro Byline', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'label_off' => __( 'Hide', 'qazana' ),
				'label_on' => __( 'Show', 'qazana' ),
				'default' => 'yes',
				'condition' => [
					'video_type' => 'vimeo',
				],
			]
		);

		$this->add_control(
			'download_button',
			[
				'label' => __( 'Download Button', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'label_off' => __( 'Hide', 'qazana' ),
				'label_on' => __( 'Show', 'qazana' ),
				'condition' => [
					'video_type' => 'hosted',
				],
			]
		);

		$this->add_control(
			'poster',
			[
				'label' => __( 'Poster', 'qazana' ),
				'type' => Controls_Manager::MEDIA,
				'condition' => [
					'video_type' => 'hosted',
				],
			]
		);

		$this->add_control(
			'view',
			[
				'label' => __( 'View', 'qazana' ),
				'type' => Controls_Manager::HIDDEN,
				'default' => 'youtube',
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_image_overlay',
			[
				'label' => __( 'Image Overlay', 'qazana' ),
			]
		);

		$this->add_control(
			'show_image_overlay',
			[
				'label' => __( 'Image Overlay', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'label_off' => __( 'Hide', 'qazana' ),
				'label_on' => __( 'Show', 'qazana' ),
			]
		);

		$this->add_control(
			'image_overlay',
			[
				'label' => __( 'Choose Image', 'qazana' ),
				'type' => Controls_Manager::MEDIA,
				'default' => [
					'url' => Utils::get_placeholder_image_src(),
				],
				'dynamic' => [
					'active' => true,
				],
				'condition' => [
					'show_image_overlay' => 'yes',
				],
			]
		);

		$this->add_control(
			'lazy_load',
			[
				'label' => __( 'Lazy Load', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'condition' => [
					'show_image_overlay' => 'yes',
					'video_type!' => 'hosted',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Image_Size::get_type(),
			[
				'name' => 'image_overlay', // Usage: `{name}_size` and `{name}_custom_dimension`, in this case `image_overlay_size` and `image_overlay_custom_dimension`.
				'default' => 'full',
				'separator' => 'none',
				'condition' => [
					'show_image_overlay' => 'yes',
				],
			]
		);

		$this->add_control(
			'show_play_icon',
			[
				'label' => __( 'Play Icon', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'default' => 'yes',
				'condition' => [
					'show_image_overlay' => 'yes',
					'image_overlay[url]!' => '',
				],
			]
		);

		$this->add_control(
			'lightbox',
			[
				'label' => __( 'Lightbox', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'frontend_available' => true,
				'label_off' => __( 'Off', 'qazana' ),
				'label_on' => __( 'On', 'qazana' ),
				'condition' => [
					'show_image_overlay' => 'yes',
					'image_overlay[url]!' => '',
				],
				'separator' => 'before',
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_video_style',
			[
				'label' => __( 'Video', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'aspect_ratio',
			[
				'label' => __( 'Aspect Ratio', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'169' => '16:9',
					'219' => '21:9',
					'43' => '4:3',
					'32' => '3:2',
				],
				'default' => '169',
				'prefix_class' => 'qazana-aspect-ratio-',
				'frontend_available' => true,
			]
		);

		$this->add_group_control(
			Group_Control_Css_Filter::get_type(),
			[
				'name' => 'css_filters',
				'selector' => '{{WRAPPER}} .qazana-wrapper',
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_lightbox_style',
			[
				'label' => __( 'Lightbox', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
				'condition' => [
					'show_image_overlay' => 'yes',
					'image_overlay[url]!' => '',
					'lightbox' => 'yes',
				],
			]
		);

		$this->add_control(
			'lightbox_color',
			[
				'label' => __( 'Background Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'#qazana-lightbox-{{ID}}' => 'background-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'lightbox_ui_color',
			[
				'label' => __( 'UI Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'#qazana-lightbox-{{ID}} .dialog-lightbox-close-button' => 'color: {{VALUE}}',
				],
			]
		);

		$this->add_control(
			'lightbox_ui_color_hover',
			[
				'label' => __( 'UI Hover Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'#qazana-lightbox-{{ID}} .dialog-lightbox-close-button:hover' => 'color: {{VALUE}}',
				],
				'separator' => 'after',
			]
		);

		$this->add_control(
			'lightbox_video_width',
			[
				'label' => __( 'Content Width', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'unit' => '%',
				],
				'range' => [
					'%' => [
						'min' => 50,
					],
				],
				'selectors' => [
					'(desktop+)#qazana-lightbox-{{ID}} .qazana-video-container' => 'width: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'lightbox_content_position',
			[
				'label' => __( 'Content Position', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'frontend_available' => true,
				'options' => [
					'' => __( 'Center', 'qazana' ),
					'top' => __( 'Top', 'qazana' ),
				],
				'selectors' => [
					'#qazana-lightbox-{{ID}} .qazana-video-container' => '{{VALUE}}; transform: translateX(-50%);',
				],
				'selectors_dictionary' => [
					'top' => 'top: 60px',
				],
			]
		);

		$this->add_control(
			'lightbox_content_animation',
			[
				'label' => __( 'Entrance Animation', 'qazana' ),
				'type' => Controls_Manager::ANIMATION,
				'frontend_available' => true,
				'label_block' => true,
			]
		);

		$this->end_controls_section();
	}

	/**
	 * Render video widget output on the frontend.
	 *
	 * Written in PHP and used to generate the final HTML.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	public function render() {
		$settings = $this->get_settings_for_display();

		$video_url = $settings[ $settings['video_type'] . '_url' ];

		if ( 'hosted' === $settings['video_type'] ) {
			$video_url = $this->get_hosted_video_url();
		}

		if ( empty( $video_url ) ) {
			return;
		}

		if ( 'hosted' === $settings['video_type'] ) {
			ob_start();

			$this->render_hosted_video();

			$video_html = ob_get_clean();
		} else {
			$embed_params = $this->get_embed_params();

			$embed_options = $this->get_embed_options();

			$video_html = Embed::get_embed_html( $video_url, $embed_params, $embed_options );
		}

		if ( empty( $video_html ) ) {
			echo esc_url( $video_url );
			return;
		}

		$this->add_button_render_attribute();

        $this->add_render_attribute( 'video-wrapper', 'class', [ 'qazana-wrapper', 'qazana-video-wrapper', 'dark', 'mejs-green', 'clearfix'] );

		if ( ! $settings['lightbox'] ) {
			$this->add_render_attribute( 'video-wrapper', 'class', 'qazana-fit-aspect-ratio' );
		}

		$this->add_render_attribute( 'video-wrapper', 'class', 'qazana-open-' . ( $settings['lightbox'] ? 'lightbox' : 'inline' ) );
		?>
		<div <?php echo $this->get_render_attribute_string( 'video-wrapper' ); ?>>
			<?php
			if ( ! $settings['lightbox'] ) {
				echo $video_html; // XSS ok.
			}

			if ( $this->has_image_overlay() ) {
				$this->add_render_attribute( 'image-overlay', 'class', 'qazana-custom-embed-image-overlay' );

				if ( $settings['lightbox'] ) {
					if ( 'hosted' === $settings['video_type'] ) {
						$lightbox_url = $video_url;
					} else {
						$lightbox_url = Embed::get_embed_url( $video_url, $embed_params, $embed_options );
					}

					$lightbox_options = [
						'type' => 'video',
						'videoType' => $settings['video_type'],
						'url' => $lightbox_url,
						'modalOptions' => [
							'id' => 'qazana-lightbox-' . $this->get_id(),
							'entranceAnimation' => $settings['lightbox_content_animation'],
							'videoAspectRatio' => $settings['aspect_ratio'],
						],
					];

					if ( 'hosted' === $settings['video_type'] ) {
						$lightbox_options['videoParams'] = $this->get_hosted_params();
					}

					$this->add_render_attribute( 'image-overlay', [
						'data-qazana-open-lightbox' => 'yes',
						'data-qazana-lightbox' => wp_json_encode( $lightbox_options ),
					] );

					if ( qazana()->editor->is_edit_mode() ) {
						$this->add_render_attribute( 'image-overlay', [
							'class' => 'qazana-clickable',
						] );
					}
				} else {
					$this->add_render_attribute( 'image-overlay', 'style', 'background-image: url(' . Group_Control_Image_Size::get_attachment_image_src( $settings['image_overlay']['id'], 'image_overlay', $settings ) . ');' );
				}
				?>
				<div <?php echo $this->get_render_attribute_string( 'image-overlay' ); ?>>
					<?php if ( $settings['lightbox'] ) : ?>
						<?php echo Group_Control_Image_Size::get_attachment_image_html( $settings, 'image_overlay' ); ?>
					<?php endif; ?>
					<?php if ( 'yes' === $settings['show_play_icon'] ) : ?>
						<div class="qazana-custom-embed-play" role="button">
							<i class="eicon-play" aria-hidden="true"></i>
							<span class="qazana-screen-only"><?php _e( 'Play Video', 'qazana' ); ?></span>
						</div>
					<?php endif; ?>
				</div>
			<?php } ?>
		</div>
		<?php
	}

	/**
	 * Render video widget as plain content.
	 *
	 * Override the default behavior, by printing the video URL instead of rendering it.
	 *
	 * @since 1.4.5
	 * @access public
	 */
	public function render_plain_content() {
		$settings = $this->get_settings_for_display();

		if ( 'hosted' !== $settings['video_type'] ) {
			$url = $settings[ $settings['video_type'] . '_url' ];
		} else {
			$url = $this->get_hosted_video_url();
		}

		echo esc_url( $url );
	}

	/**
	 * Get embed params.
	 *
	 * Retrieve video widget embed parameters.
	 *
	 * @since 1.5.0
	 * @access public
	 *
	 * @return array Video embed parameters.
	 */
	public function get_embed_params() {
		$settings = $this->get_settings_for_display();

		$params = [];

		if ( $settings['autoplay'] && ! $this->has_image_overlay() ) {
			$params['autoplay'] = '1';
		}

		$params_dictionary = [];

		if ( 'youtube' === $settings['video_type'] ) {
			$params_dictionary = [
				'loop',
				'controls',
				'mute',
				'rel',
				'modestbranding',
			];

			if ( $settings['loop'] ) {
				$video_properties = Embed::get_video_properties( $settings['youtube_url'] );

				$params['playlist'] = $video_properties['video_id'];
			}

			$params['start'] = $settings['start'];

			$params['end'] = $settings['end'];

			$params['wmode'] = 'opaque';
		} elseif ( 'vimeo' === $settings['video_type'] ) {
			$params_dictionary = [
				'loop',
				'mute' => 'muted',
				'vimeo_title' => 'title',
				'vimeo_portrait' => 'portrait',
				'vimeo_byline' => 'byline',
			];

			$params['color'] = str_replace( '#', '', $settings['color'] );

			$params['autopause'] = '0';
		} elseif ( 'dailymotion' === $settings['video_type'] ) {
			$params_dictionary = [
				'controls',
				'mute',
				'showinfo' => 'ui-start-screen-info',
				'logo' => 'ui-logo',
			];

			$params['ui-highlight'] = str_replace( '#', '', $settings['color'] );

			$params['start'] = $settings['start'];

			$params['endscreen-enable'] = '0';
		}

		foreach ( $params_dictionary as $key => $param_name ) {
			$setting_name = $param_name;

			if ( is_string( $key ) ) {
				$setting_name = $key;
			}

			$setting_value = $settings[ $setting_name ] ? '1' : '0';

			$params[ $param_name ] = $setting_value;
		}

		return $params;
	}

	/**
	 * Whether the video widget has an overlay image or not.
	 *
	 * Used to determine whether an overlay image was set for the video.
	 *
	 * @since 1.0.0
	 * @access protected
	 *
	 * @return bool Whether an image overlay was set for the video.
	 */
	protected function has_image_overlay() {
		$settings = $this->get_settings_for_display();

		return ! empty( $settings['image_overlay']['url'] ) && 'yes' === $settings['show_image_overlay'];
	}

	/**
	 * @since 2.1.0
	 * @access private
	 */
	private function get_embed_options() {
		$settings = $this->get_settings_for_display();

		$embed_options = [];

		if ( 'youtube' === $settings['video_type'] ) {
			$embed_options['privacy'] = $settings['yt_privacy'];
		} elseif ( 'vimeo' === $settings['video_type'] ) {
			$embed_options['start'] = $settings['start'];
		}

		$embed_options['lazy_load'] = ! empty( $settings['lazy_load'] );

		return $embed_options;
	}

	/**
	 * @since 2.1.0
	 * @access private
	 */
	private function get_hosted_params() {
		$settings = $this->get_settings_for_display();

		$video_params = [];

		foreach ( [ 'autoplay', 'loop', 'controls' ] as $option_name ) {
			if ( $settings[ $option_name ] ) {
				$video_params[ $option_name ] = '';
			}
		}

		if ( $settings['mute'] ) {
			$video_params['muted'] = 'muted';
		}

		if ( ! $settings['download_button'] ) {
			$video_params['controlsList'] = 'nodownload';
		}

		if ( $settings['poster']['url'] ) {
			$video_params['poster'] = $settings['poster']['url'];
		}

		return $video_params;
	}

	/**
	 * @param bool $from_media
	 *
	 * @return string
	 * @since 2.1.0
	 * @access private
	 */
	private function get_hosted_video_url() {
		$settings = $this->get_settings_for_display();

		if ( ! empty( $settings['insert_url'] ) ) {
			$video_url = $settings['external_url']['url'];
		} else {
			$video_url = $settings['hosted_url']['url'];
		}

		if ( empty( $video_url ) ) {
			return '';
		}

		if ( $settings['start'] || $settings['end'] ) {
			$video_url .= '#t=';
		}

		if ( $settings['start'] ) {
			$video_url .= $settings['start'];
		}

		if ( $settings['end'] ) {
			$video_url .= ',' . $settings['end'];
		}

		return $video_url;
	}

	/**
	 *
	 * @since 2.1.0
	 * @access private
	 */
	private function render_hosted_video() {
		$video_url = $this->get_hosted_video_url();
		if ( empty( $video_url ) ) {
			return;
		}

		$video_params = $this->get_hosted_params();
		?>
		<video class="qazana-video" src="<?php echo esc_url( $video_url ); ?>" <?php echo Utils::render_html_attributes( $video_params ); ?>></video>
		<?php
	}

}
