<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Image_Carousel extends Widget_Base {

	public $carousel = true;
	
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
			'section_carousel_settings',
			[
				'label' => __( 'Carousel Settings', 'qazana' ),
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
				'selector' => '{{WRAPPER}} .qazana-image-carousel .slick-slide-image',
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
					'{{WRAPPER}} .qazana-image-carousel .slick-slide-image' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->end_controls_section();
	}

	protected function render() {
		$settings = $this->get_settings();

		if ( empty( $settings['carousel'] ) )
			return;

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

		$is_rtl = ( 'rtl' ===  $this->get_settings('direction') );
		$direction = $is_rtl ? 'rtl' : 'ltr';

		$carousel_classes = [ 'qazana-grid-wrapper', 'slick-slides-biggie', 'slick-slider' ];

		$this->add_render_attribute( 'slides', [
			'class' => $carousel_classes
		] );
		
		?><div class="qazana-slides-wrapper qazana-slick-slider" dir="<?php echo $direction; ?>">
			<div <?php echo $this->get_render_attribute_string( 'slides' ); ?>>
				
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
		</div><?php

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
