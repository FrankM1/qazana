<?php
namespace Builder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Video extends Widget_Base {

	public function get_name() {
		return 'video';
	}

	public function get_title() {
		return __( 'Video', 'builder' );
	}

	public function get_icon() {
		return 'eicon-youtube';
	}

	protected function _register_controls() {
		$this->start_controls_section(
			'section_video',
			[
				'label' => __( 'Video', 'builder' ),
			]
		);

		$this->add_control(
			'video_type',
			[
				'label' => __( 'Video Type', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'youtube',
				'options' => [
					'youtube' => __( 'YouTube', 'builder' ),
					'vimeo' => __( 'Vimeo', 'builder' ),
					//'hosted' => __( 'HTML5 Video', 'builder' ),
				],
			]
		);

		$this->add_control(
			'link',
			[
				'label' => __( 'Link', 'builder' ),
				'type' => Controls_Manager::TEXT,
				'placeholder' => __( 'Enter your YouTube link', 'builder' ),
				'default' => 'https://www.youtube.com/watch?v=1SkAqeshvBA',
				'label_block' => true,
				'condition' => [
					'video_type' => 'youtube',
				],
			]
		);

		$this->add_control(
			'vimeo_link',
			[
				'label' => __( 'Vimeo Link', 'builder' ),
				'type' => Controls_Manager::TEXT,
				'placeholder' => __( 'Enter your Vimeo link', 'builder' ),
				'default' => 'https://vimeo.com/170933924',
				'label_block' => true,
				'condition' => [
					'video_type' => 'vimeo',
				],
			]
		);

		$this->add_control(
			'hosted_link',
			[
				'label' => __( 'Link', 'builder' ),
				'type' => Controls_Manager::TEXT,
				'placeholder' => __( 'Enter your video link', 'builder' ),
				'default' => '',
				'label_block' => true,
				'condition' => [
					'video_type' => 'hosted',
				],
			]
		);

		$this->add_control(
			'aspect_ratio',
			[
				'label' => __( 'Aspect Ratio', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'169' => '16:9',
					'43' => '4:3',
					'32' => '3:2',
				],
				'default' => '169',
				'prefix_class' => 'builder-aspect-ratio-',
			]
		);

		$this->add_control(
			'heading_youtube',
			[
				'label' => __( 'Video Options', 'builder' ),
				'type' => Controls_Manager::HEADING,
				'separator' => 'before',
			]
		);

		// YouTube
		$this->add_control(
			'yt_autoplay',
			[
				'label' => __( 'Autoplay', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'no' => __( 'No', 'builder' ),
					'yes' => __( 'Yes', 'builder' ),
				],
				'condition' => [
					'video_type' => 'youtube',
				],
				'default' => 'no',
			]
		);

		$this->add_control(
			'yt_rel',
			[
				'label' => __( 'Suggested Videos', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'no' => __( 'Hide', 'builder' ),
					'yes' => __( 'Show', 'builder' ),
				],
				'default' => 'no',
				'condition' => [
					'video_type' => 'youtube',
				],
			]
		);

		$this->add_control(
			'yt_controls',
			[
				'label' => __( 'Player Control', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'yes' => __( 'Show', 'builder' ),
					'no' => __( 'Hide', 'builder' ),
				],
				'default' => 'yes',
				'condition' => [
					'video_type' => 'youtube',
				],
			]
		);

		$this->add_control(
			'yt_showinfo',
			[
				'label' => __( 'Player Title & Actions', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'yes' => __( 'Show', 'builder' ),
					'no' => __( 'Hide', 'builder' ),
				],
				'default' => 'yes',
				'condition' => [
					'video_type' => 'youtube',
				],
			]
		);

		// Vimeo
		$this->add_control(
			'vimeo_autoplay',
			[
				'label' => __( 'Autoplay', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'no' => __( 'No', 'builder' ),
					'yes' => __( 'Yes', 'builder' ),
				],
				'default' => 'no',
				'condition' => [
					'video_type' => 'vimeo',
				],
			]
		);

		$this->add_control(
			'vimeo_loop',
			[
				'label' => __( 'Loop', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'no' => __( 'No', 'builder' ),
					'yes' => __( 'Yes', 'builder' ),
				],
				'default' => 'no',
				'condition' => [
					'video_type' => 'vimeo',
				],
			]
		);

		$this->add_control(
			'vimeo_title',
			[
				'label' => __( 'Intro Title', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'yes' => __( 'Show', 'builder' ),
					'no' => __( 'Hide', 'builder' ),
				],
				'default' => 'yes',
				'condition' => [
					'video_type' => 'vimeo',
				],
			]
		);

		$this->add_control(
			'vimeo_portrait',
			[
				'label' => __( 'Intro Portrait', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'yes' => __( 'Show', 'builder' ),
					'no' => __( 'Hide', 'builder' ),
				],
				'default' => 'yes',
				'condition' => [
					'video_type' => 'vimeo',
				],
			]
		);

		$this->add_control(
			'vimeo_byline',
			[
				'label' => __( 'Intro Byline', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'yes' => __( 'Show', 'builder' ),
					'no' => __( 'Hide', 'builder' ),
				],
				'default' => 'yes',
				'condition' => [
					'video_type' => 'vimeo',
				],
			]
		);

		$this->add_control(
			'vimeo_color',
			[
				'label' => __( 'Controls Color', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'condition' => [
					'video_type' => 'vimeo',
				],
			]
		);

		// Self Hosted
		//$this->add_control(
		//	'hosted_width',
		//	[
		//		'label' => __( 'Width', 'builder' ),
		//		'type' => Controls_Manager::NUMBER,
		//		'default' => '640',
		//		'condition' => [
		//			'video_type' => 'hosted',
		//		],
		//	]
		//);
		//
		//$this->add_control(
		//	'hosted_height',
		//	[
		//		'label' => __( 'Height', 'builder' ),
		//		'type' => Controls_Manager::NUMBER,
		//		'default' => '360',
		//		'condition' => [
		//			'video_type' => 'hosted',
		//		],
		//	]
		//);
		//
		//$this->add_control(
		//	'hosted_autoplay',
		//	[
		//		'label' => __( 'Autoplay', 'builder' ),
		//		'type' => Controls_Manager::SELECT,
		//		'options' => [
		//			'no' => __( 'No', 'builder' ),
		//			'yes' => __( 'Yes', 'builder' ),
		//		],
		//		'default' => 'no',
		//		'condition' => [
		//			'video_type' => 'hosted',
		//		],
		//	]
		//);
		//
		//$this->add_control(
		//	'hosted_loop',
		//	[
		//		'label' => __( 'Loop', 'builder' ),
		//		'type' => Controls_Manager::SELECT,
		//		'options' => [
		//			'no' => __( 'No', 'builder' ),
		//			'yes' => __( 'Yes', 'builder' ),
		//		],
		//		'default' => 'no',
		//		'condition' => [
		//			'video_type' => 'hosted',
		//		],
		//	]
		//);

		$this->add_control(
			'view',
			[
				'label' => __( 'View', 'builder' ),
				'type' => Controls_Manager::HIDDEN,
				'default' => 'youtube',
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_image_overlay',
			[
				'label' => __( 'Image Overlay', 'builder' ),
			]
		);

		$this->add_control(
			'show_image_overlay',
			[
				'label' => __( 'Image Overlay', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'no',
				'options' => [
					'no' => __( 'Hide', 'builder' ),
					'yes' => __( 'Show', 'builder' ),
				],
			]
		);

		$this->add_control(
			'image_overlay',
			[
				'label' => __( 'Image', 'builder' ),
				'type' => Controls_Manager::MEDIA,
				'default' => [
					'url' => Utils::get_placeholder_image_src(),
				],
				'condition' => [
					'show_image_overlay' => 'yes',
				],
			]
		);

		$this->add_control(
			'show_play_icon',
			[
				'label' => __( 'Play Icon', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'yes',
				'options' => [
					'yes' => __( 'Yes', 'builder' ),
					'no' => __( 'No', 'builder' ),
				],
				'condition' => [
					'show_image_overlay' => 'yes',
					'image_overlay[url]!' => '',
				],
			]
		);

		$this->add_control(
			'play_icon_type',
			[
				'label' => __( 'Icon type', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'icon',
				'options' => [
					'icon' => __( 'Icon', 'builder' ),
					'image' => __( 'Image File', 'builder' ),
				],
				'condition' => [
					'show_image_overlay' => 'yes',
					'image_overlay[url]!' => '',
				],
			]
		);

		$this->add_control(
			'icon',
			[
				'label' => __( 'Icon', 'builder' ),
				'type' => Controls_Manager::ICON,
				'label_block' => true,
				'default' => 'fa fa-play-circle',
				'condition' => [
					'show_image_overlay' => 'yes',
					'image_overlay[url]!' => '',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Background::get_type(),
			[
				'name' => 'image_background_overlay',
				'selector' => '{{WRAPPER}} .builder-image-background-overlay',
				'condition' => [
					'show_image_overlay' => 'yes',
				],
			]
		);

		$this->add_control(
			'image_background_overlay_opacity',
			[
				'label' => __( 'Opacity (%)', 'builder' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => .5,
				],
				'range' => [
					'px' => [
						'max' => 1,
						'step' => 0.01,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .builder-image-background-overlay' => 'opacity: {{SIZE}};',
				],
				'condition' => [
					'image_background_overlay_background' => [ 'classic' ],
				],
			]
		);

		$this->end_controls_section();

		$this->_register_icon_controls();

	}

	protected function _register_icon_controls() {

		$this->start_controls_section(
			'section_style_icon',
			[
				'label' => __( 'Icon', 'builder' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'icon_color',
			[
				'label' => __( 'Icon Color', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_1,
				],
				'default' => '#fff',
				'selectors' => [
					'{{WRAPPER}} .builder-icon' => 'color: {{VALUE}};',
					'{{WRAPPER}} .builder-icon svg path ' => 'stroke: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'icon_size',
			[
				'label' => __( 'Icon Size', 'builder' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => 100
				],
				'range' => [
					'px' => [
						'min' => 6,
						'max' => 300,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .builder-icon' => 'font-size: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'icon_padding',
			[
				'label' => __( 'Icon Padding', 'builder' ),
				'type' => Controls_Manager::DIMENSIONS,
				'selectors' => [
					'{{WRAPPER}} .builder-icon' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
				'condition' => [
					'view!' => 'default',
				],
			]
		);

		$this->add_control(
			'icon_margin',
			[
				'label' => __( 'Icon Margin', 'builder' ),
				'type' => Controls_Manager::DIMENSIONS,
				'selectors' => [
					'{{WRAPPER}} .builder-icon' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
				'condition' => [
					'view!' => 'default',
				],
			]
		);

		$this->add_control(
			'rotate',
			[
				'label' => __( 'Icon Rotate', 'builder' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => 0,
					'unit' => 'deg',
				],
				'selectors' => [
					'{{WRAPPER}} .builder-icon' => 'transform: rotate({{SIZE}}{{UNIT}});',
				],
			]
		);

		$this->add_control(
			'border_width',
			[
				'label' => __( 'Border Width', 'builder' ),
				'type' => Controls_Manager::DIMENSIONS,
				'selectors' => [
					'{{WRAPPER}} .builder-icon' => 'border-width: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
				'condition' => [
					'view' => 'framed',
				],
			]
		);

		$this->add_control(
			'border_radius',
			[
				'label' => __( 'Border Radius', 'builder' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'selectors' => [
					'{{WRAPPER}} .builder-icon' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
				'condition' => [
					'view!' => 'default',
				],
			]
		);

		$this->end_controls_section();
	}

	protected function get_render_icon() {

		$settings = $this->get_settings();

		$icon_tag = 'span';

		$this->add_render_attribute( 'icon', 'class', [ 'builder-icon' ] );

		$icon_attributes = $this->get_render_attribute_string( 'icon' );

		if ( ! empty( $settings['icon'] ) ) {
			$this->add_render_attribute( 'i', 'class', $settings['icon'] );
		}

		if ( $settings['icon_type'] === 'image' ) {

			$filetype = wp_check_filetype( $settings['image']['url'] );

			if ( $filetype['ext'] === 'svg' ) {
				$this->add_render_attribute( 'image', 'class', 'svg-icon-holder svg-baseline' );
				$this->add_render_attribute( 'image', 'data-animation-speed', $settings['animation_speed'] );
				$this->add_render_attribute( 'image', 'data-size', $settings['icon_size']['size'] );
				$this->add_render_attribute( 'image', 'data-animation-delay', $settings['animation_delay'] );
				$this->add_render_attribute( 'image', 'data-color', $settings['icon_color'] );
				$this->add_render_attribute( 'image', 'data-icon', builder_maybe_ssl_url( $settings['image']['url'] ) );
			}
		}

		$output = '<'. implode( ' ', [ $icon_tag, $icon_attributes ] ) .'>';

			if ( $settings['icon_type'] === 'image' ) {
				$output .= '<span '. $this->get_render_attribute_string( 'image' ) .'><img src="'. builder_maybe_ssl_url( $settings['image']['url'] ) .'" /></span>';
			} else {
				$output .= '<i '. $this->get_render_attribute_string( 'i' ) .'></i>';
			}

		$output .= '</'. $icon_tag .'>';

		return $output;
	}

	protected function render() {
		$settings = $this->get_settings();

		if ( 'hosted' !== $settings['video_type'] ) {
			add_filter( 'oembed_result', [ $this, 'filter_oembed_result' ], 50, 3 );

			$video_link = 'youtube' === $settings['video_type'] ? $settings['link'] : $settings['vimeo_link'];

			if ( empty( $video_link ) )
				return;

			$video_html = wp_oembed_get( $video_link, wp_embed_defaults() );

			remove_filter( 'oembed_result', [ $this, 'filter_oembed_result' ], 50 );
		} else {
			$video_html = wp_video_shortcode( $this->get_hosted_params() );
		}

		if ( $video_html ) : ?>
			<div class="builder-video-wrapper">
				<?php
				echo $video_html;

				if ( $this->has_image_overlay() ) : ?>
					<div class="builder-custom-embed-image-overlay" style="background-image: url(<?php echo $settings['image_overlay']['url']; ?>);">
						<?php if ( 'yes' === $settings['show_play_icon'] ) : ?>
							<div class="builder-custom-embed-play">
								<?php echo $this->get_render_icon(); ?>
							</div>
						<?php endif; ?>
						<div class="builder-image-background-overlay"></div>
					</div>
				<?php endif; ?>
			</div>
		<?php else :
			echo $settings['link'];
		endif;
	}

	public function filter_oembed_result( $html ) {
		$settings = $this->get_settings();

		$params = [];

		if ( 'youtube' === $settings['video_type'] ) {
			$youtube_options = [ 'autoplay', 'rel', 'controls', 'showinfo' ];

			foreach ( $youtube_options as $option ) {
				if ( 'autoplay' === $option && $this->has_image_overlay() )
					continue;

				$value = ( 'yes' === $settings[ 'yt_' . $option ] ) ? '1' : '0';
				$params[ $option ] = $value;
			}

			$params['wmode'] = 'opaque';
		}

		if ( 'vimeo' === $settings['video_type'] ) {
			$vimeo_options = [ 'autoplay', 'loop', 'title', 'portrait', 'byline' ];

			foreach ( $vimeo_options as $option ) {
				if ( 'autoplay' === $option && $this->has_image_overlay() )
					continue;

				$value = ( 'yes' === $settings[ 'vimeo_' . $option ] ) ? '1' : '0';
				$params[ $option ] = $value;
			}

			$params['color'] = str_replace( '#', '', $settings['vimeo_color'] );
		}

		if ( ! empty( $params ) ) {
			preg_match( '/<iframe.*src=\"(.*)\".*><\/iframe>/isU', $html, $matches );
			$url = esc_url( add_query_arg( $params, $matches[1] ) );

			$html = str_replace( $matches[1], $url, $html );
		}

		return $html;
	}

	protected function get_hosted_params() {
		$settings = $this->get_settings();

		$params = [];

		$params['src'] = $settings['hosted_link'];

		$hosted_options = [ 'autoplay', 'loop' ];

		foreach ( $hosted_options as $key => $option ) {
			$value = ( 'yes' === $settings[ 'hosted_' . $option ] ) ? '1' : '0';
			$params[ $option ] = $value;
		}

		if ( ! empty( $settings['hosted_width'] ) ) {
			$params['width'] = $settings['hosted_width'];
		}

		if ( ! empty( $settings['hosted_height'] ) ) {
			$params['height'] = $settings['hosted_height'];
		}
		return $params;
	}

	protected function has_image_overlay() {
		$settings = $this->get_settings();

		return ! empty( $settings['image_overlay']['url'] ) && 'yes' === $settings['show_image_overlay'];
	}

	protected function _content_template() {}
}
