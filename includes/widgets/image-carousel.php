<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Image_Carousel extends Widget_Base {

	public function get_name() {
		return 'image-carousel';
	}

	public function get_title() {
		return __( 'Image Carousel', 'qazana' );
	}

	public function get_icon() {
		return 'eicon-slider-push';
	}

	public function get_categories() {
		return [ 'general-elements' ];
	}

	protected function _register_controls() {
		$this->start_controls_section(
			'section_image_carousel',
			[
				'label' => __( 'Image Carousel', 'qazana' ),
			]
		);

		$this->add_control(
			'carousel',
			[
				'label' => __( 'Add Images', 'qazana' ),
				'type' => Controls_Manager::GALLERY,
				'default' => [],
			]
		);

		$this->add_group_control(
			Group_Control_Image_Size::get_type(),
			[
				'name' => 'thumbnail',
			]
		);

		$slides_to_show = range( 1, 10 );
		$slides_to_show = array_combine( $slides_to_show, $slides_to_show );

		$this->add_responsive_control(
			'slides_to_show',
			[
				'label' => __( 'Slides to Show', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => '3',
				'options' => [ '' => __( 'Default', 'qazana' ) ] + $slides_to_show,
				'frontend_available' => true,
			]
		);

		$this->add_control(
			'slides_to_scroll',
			[
				'label' => __( 'Slides to Scroll', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => '2',
				'options' => $slides_to_show,
				'condition' => [
					'slides_to_show!' => '1',
				],
				'frontend_available' => true,
			]
		);

		$this->add_control(
			'image_stretch',
			[
				'label' => __( 'Image Stretch', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'no',
				'options' => [
					'no' => __( 'No', 'qazana' ),
					'yes' => __( 'Yes', 'qazana' ),
				],
			]
		);

		$this->add_control(
			'navigation',
			[
				'label' => __( 'Navigation', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'both',
				'options' => [
					'both' => __( 'Arrows and Dots', 'qazana' ),
					'arrows' => __( 'Arrows', 'qazana' ),
					'dots' => __( 'Dots', 'qazana' ),
					'thumbnails' => __( 'Thumbnails', 'qazana' ),
					'none' => __( 'None', 'qazana' ),
				],
				'frontend_available' => true,
			]
		);

		$this->add_control(
			'link_to',
			[
				'label' => __( 'Link to', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'none',
				'options' => [
					'none' => __( 'None', 'qazana' ),
					'file' => __( 'Media File', 'qazana' ),
					'custom' => __( 'Custom URL', 'qazana' ),
				],
			]
		);

		$this->add_control(
			'link',
			[
				'label' => 'Link to',
				'type' => Controls_Manager::URL,
				'placeholder' => __( 'http://your-link.com', 'qazana' ),
				'condition' => [
					'link_to' => 'custom',
				],
				'show_label' => false,
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_additional_options',
			[
				'label' => __( 'Additional Options', 'qazana' ),
			]
		);

		$this->add_control(
			'pause_on_hover',
			[
				'label' => __( 'Pause on Hover', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'yes',
				'options' => [
					'yes' => __( 'Yes', 'qazana' ),
					'no' => __( 'No', 'qazana' ),
				],
				'frontend_available' => true,
			]
		);

		$this->add_control(
			'autoplay',
			[
				'label' => __( 'Autoplay', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'yes',
				'options' => [
					'yes' => __( 'Yes', 'qazana' ),
					'no' => __( 'No', 'qazana' ),
				],
				'frontend_available' => true,
			]
		);

		$this->add_control(
			'autoplay_speed',
			[
				'label' => __( 'Autoplay Speed', 'qazana' ),
				'type' => Controls_Manager::NUMBER,
				'default' => 5000,
				'frontend_available' => true,
			]
		);

		$this->add_control(
			'infinite',
			[
				'label' => __( 'Infinite Loop', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'yes',
				'options' => [
					'yes' => __( 'Yes', 'qazana' ),
					'no' => __( 'No', 'qazana' ),
				],
				'frontend_available' => true,
			]
		);

		$this->add_control(
			'effect',
			[
				'label' => __( 'Effect', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'slide',
				'options' => [
					'slide' => __( 'Slide', 'qazana' ),
					'fade' => __( 'Fade', 'qazana' ),
				],
				'condition' => [
					'slides_to_show' => '1',
				],
				'frontend_available' => true,
			]
		);

		$this->add_control(
			'speed',
			[
				'label' => __( 'Animation Speed', 'qazana' ),
				'type' => Controls_Manager::NUMBER,
				'default' => 500,
				'frontend_available' => true,
			]
		);

		$this->add_control(
			'direction',
			[
				'label' => __( 'Direction', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'ltr',
				'options' => [
					'ltr' => __( 'Left', 'qazana' ),
					'rtl' => __( 'Right', 'qazana' ),
				],
				'frontend_available' => true,
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_style_navigation',
			[
				'label' => __( 'Navigation', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
				'condition' => [
					'navigation' => [ 'arrows', 'dots', 'both' ],
				],
			]
		);

		$this->add_control(
			'heading_style_arrows',
			[
				'label' => __( 'Arrows', 'qazana' ),
				'type' => Controls_Manager::HEADING,
				'separator' => 'before',
				'condition' => [
					'navigation' => [ 'arrows', 'both' ],
				],
			]
		);

		$this->add_control(
			'arrows_position',
			[
				'label' => __( 'Arrows Position', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'inside',
				'options' => [
					'inside' => __( 'Inside', 'qazana' ),
					'outside' => __( 'Outside', 'qazana' ),
				],
				'condition' => [
					'navigation' => [ 'arrows', 'both' ],
				],
			]
		);

		$this->add_control(
			'arrows_size',
			[
				'label' => __( 'Arrows Size', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'min' => 20,
						'max' => 60,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-image-carousel-wrapper .slick-slider .slick-prev:before, {{WRAPPER}} .qazana-image-carousel-wrapper .slick-slider .slick-next:before' => 'font-size: {{SIZE}}{{UNIT}};',
				],
				'condition' => [
					'navigation' => [ 'arrows', 'both' ],
				],
			]
		);

		$this->add_control(
            'arrows_color',
            [
                'label' => __( 'Arrows Color', 'qazana' ),
                'type' => Controls_Manager::COLOR,
                'selectors' => [
					'{{WRAPPER}} .qazana-image-carousel-wrapper .slick-slider .slick-prev, {{WRAPPER}} .qazana-image-carousel-wrapper .slick-slider .slick-next' => 'color: {{VALUE}}; border-color: {{VALUE}}; box-shadow: 0 0 1px {{VALUE}};',
                ],
                'condition' => [
                    'navigation' => [ 'arrows', 'both' ],
                ],
            ]
        );

        $this->add_control(
            'arrows_hover_color',
            [
                'label' => __( 'Arrows Hover Color', 'qazana' ),
                'type' => Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .qazana-image-carousel-wrapper .slick-slider .slick-prev:hover, {{WRAPPER}} .qazana-image-carousel-wrapper .slick-slider .slick-next:hover' => 'color: {{VALUE}}; border-color: {{VALUE}}; box-shadow: 0 0 1px {{VALUE}};',
                ],
                'condition' => [
                    'navigation' => [ 'arrows', 'both' ],
                ],
            ]
        );

		$this->add_control(
			'heading_style_dots',
			[
				'label' => __( 'Dots', 'qazana' ),
				'type' => Controls_Manager::HEADING,
				'separator' => 'before',
				'condition' => [
					'navigation' => [ 'dots', 'both' ],
				],
			]
		);

		$this->add_control(
			'dots_position',
			[
				'label' => __( 'Dots Position', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'outside',
				'options' => [
					'outside' => __( 'Outside', 'qazana' ),
					'inside' => __( 'Inside', 'qazana' ),
				],
				'condition' => [
					'navigation' => [ 'dots', 'both' ],
				],
			]
		);

		$this->add_control(
			'dots_size',
			[
				'label' => __( 'Dots Size', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'min' => 5,
						'max' => 10,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-image-carousel-wrapper .qazana-image-carousel .slick-dots li button:before' => 'font-size: {{SIZE}}{{UNIT}};',
				],
				'condition' => [
					'navigation' => [ 'dots', 'both' ],
				],
			]
		);

		$this->add_control(
			'dots_color',
			[
				'label' => __( 'Dots Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .qazana-image-carousel-wrapper .qazana-image-carousel .slick-dots li button:before' => 'color: {{VALUE}};',
				],
				'condition' => [
					'navigation' => [ 'dots', 'both' ],
				],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_style_image',
			[
				'label' => __( 'Image', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'image_spacing',
			[
				'label' => __( 'Spacing', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'' => __( 'Default', 'qazana' ),
					'custom' => __( 'Custom', 'qazana' ),
				],
				'default' => '',
				'condition' => [
					'slides_to_show!' => '1',
				],
			]
		);

		$this->add_control(
			'image_spacing_custom',
			[
				'label' => __( 'Image Spacing', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'max' => 100,
					],
				],
				'default' => [
					'size' => 20,
				],
				'show_label' => false,
				'selectors' => [
					'{{WRAPPER}} .slick-list' => 'margin-left: -{{SIZE}}{{UNIT}};',
					'{{WRAPPER}} .slick-slide .slick-slide-inner' => 'padding-left: {{SIZE}}{{UNIT}};',
				],
				'condition' => [
					'image_spacing' => 'custom',
					'slides_to_show!' => '1',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Border::get_type(),
			[
				'name' => 'image_border',
				'selector' => '{{WRAPPER}} .qazana-image-carousel-wrapper .qazana-image-carousel .slick-slide-image',
				'separator' => 'before',
			]
		);

		$this->add_control(
			'image_border_radius',
			[
				'label' => __( 'Border Radius', 'qazana' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'selectors' => [
					'{{WRAPPER}} .qazana-image-carousel-wrapper .qazana-image-carousel .slick-slide-image' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->end_controls_section();
	}

	protected function render() {
		$settings = $this->get_settings();

		if ( empty( $settings['carousel'] ) )
			return;

		$this->add_script_dependencies(['jquery-slick']);

		$slides = [];

		$count = 0;

		foreach ( $settings['carousel'] as $attachment ) {
			$image_url = Group_Control_Image_Size::get_attachment_image_src( $attachment['id'], 'thumbnail', $settings );
			$image_html = '<img class="slick-slide-image" src="' . esc_attr( $image_url ) . '" alt="' . esc_attr( Control_Media::get_image_alt( $attachment ) ) . '" />';

			$link = $this->get_link_url( $attachment, $settings );
			if ( $link ) {
				$target = '';
				if ( ! empty( $link['is_external'] ) ) {
					$target = ' target="_blank"';
				}

				$image_html = sprintf( '<a href="%s"%s>%s</a>', $link['url'], $target, $image_html );
			}

			$slides[] = '<div class="slick-slide" data-index="'. esc_attr( $count ) .'" data-slide-id="'. esc_attr( $count ) .'"><div class="slick-slide-inner">' . $image_html . '</div></div>';

			$count++;
		}

		if ( empty( $slides ) ) {
			return;
		}

		$show_thumbs = ( in_array( $settings['navigation'], [ 'thumbnails' ] ) );

		if ( $show_thumbs ) {

			$thumbs = [];

			$count = 0;

			foreach ( $settings['carousel'] as $attachment ) {

				$image_url = Group_Control_Image_Size::get_attachment_image_src( $attachment['id'], 'thumbnail', $settings );

				$params = array( 'width' => 138, 'height' => 80 );

				$image_url = bfi_thumb( $image_url, $params );

				$image_html = '<span><img class="slick-slide-image" src="' . esc_attr( $image_url ) . '" alt="' . esc_attr( Control_Media::get_image_alt( $attachment ) ) . '" /></span>';

				$link = $this->get_link_url( $attachment, $settings );
				if ( $link ) {
					$link_key = 'link_' . $index;

					$this->add_render_attribute( $link_key, 'href', $link );

					if ( ! empty( $link['is_external'] ) ) {
						$this->add_render_attribute( $link_key, 'target', '_blank' );
					}

					if ( ! empty( $link['nofollow'] ) ) {
						$this->add_render_attribute( $link_key, 'rel', 'nofollow' );
					}

					$image_html = '<a ' . $this->get_render_attribute_string( $link_key ) . '>' . $image_html . '</a>';
				}

				$thumbs[] = '<div class="slick-slide" data-index="'. esc_attr( $count ) .'" data-slide-id="'. esc_attr( $count ) .'"><div class="slick-slide-inner">' . $image_html . '</div></div>';

				$count++;
			}

		}

		$is_slideshow = '1' === $settings['slides_to_show'];
		$is_rtl = ( 'rtl' === $settings['direction'] );
		$direction = $is_rtl ? 'rtl' : 'ltr';
		$show_dots = ( in_array( $settings['navigation'], [ 'dots', 'both' ] ) );
		$show_arrows = ( in_array( $settings['navigation'], [ 'arrows', 'both' ] ) );

		$slick_options = [
			'slidesToShow' => absint( $settings['slides_to_show'] ),
			'autoplaySpeed' => absint( $settings['autoplay_speed']  ),
			'autoplay' => ( $this->bool( $settings['autoplay'] ) ),
			'infinite' => ( $this->bool( $settings['infinite'] ) ),
			'pauseOnHover' => ( $this->bool( $settings['pause_on_hover'] ) ),
			'speed' => absint( $settings['speed'] ),
			'arrows' => $show_arrows,
			'dots' => $show_dots,
			'rtl' => $is_rtl,
		];

		$carousel_classes = [ 'qazana-image-carousel' ];

		if ( $show_arrows ) {
			$carousel_classes[] = 'slick-arrows-' . $settings['arrows_position'];
		}

		if ( $show_dots ) {
			$carousel_classes[] = 'slick-dots-' . $settings['dots_position'];
		}

		if ( 'yes' === $settings['image_stretch'] ) {
			$carousel_classes[] = 'slick-image-stretch';
		}

		if ( ! $is_slideshow ) {
			$slick_options['slidesToScroll'] = absint( $settings['slides_to_scroll'] );
		} else {
			$slick_options['fade'] = ( 'fade' === $settings['effect'] );
		}

		?>
		<div class="qazana-image-carousel-wrapper qazana-slick-slider" dir="<?php echo $direction; ?>">
			<div class="<?php echo implode( ' ', $carousel_classes ); ?>" data-slider_options='<?php echo esc_attr( wp_json_encode( $slick_options ) ); ?>'>
				<div class="slick-slideshow-large-container-biggie">
					<div class="slick-slides slick-slides-biggie">
						<?php echo implode( '', $slides ); ?>
					</div>
				</div>

				<?php if ( $show_thumbs ) { ?>
					<div class="slick-slideshow-large-container-smalls">
						<div class="slick-slides slick-slides-smalls">
							<?php echo implode( '', $thumbs ); ?>
						</div>
					</div>
				<?php } ?>

			</div>
		</div>
	<?php
	}

	protected function _content_template() {}

	private function get_link_url( $attachment, $instance ) {
		if ( 'none' === $instance['link_to'] ) {
			return false;
		}

		if ( 'custom' === $instance['link_to'] ) {
			if ( empty( $instance['link']['url'] ) ) {
				return false;
			}
			return $instance['link'];
		}

		return [
			'url' => wp_get_attachment_url( $attachment['id'] ),
		];
	}
}
