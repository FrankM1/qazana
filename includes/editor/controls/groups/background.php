<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Group_Control_Background extends Group_Base_Control {

	protected static $fields;

	private static $background_types;

	public static function get_type() {
		return 'background';
	}


	public static function get_background_types() {
		if ( null === self::$background_types ) {
			self::$background_types = self::init_background_types();
		}

		return self::$background_types;
	}

	private static function init_background_types() {
		return [
			'none' => [
				'title' => _x( 'None', 'Background Control', 'qazana' ),
				'icon' => 'fa fa-ban',
			],
			'classic' => [
				'title' => _x( 'Classic', 'Background Control', 'qazana' ),
				'icon' => 'fa fa-paint-brush',
			],
			'gradient' => [
				'title' => _x( 'Gradient', 'Background Control', 'qazana' ),
				'icon' => 'fa fa-barcode',
			],
			'video' => [
				'title' => _x( 'Background Video', 'Background Control', 'qazana' ),
				'icon' => 'fa fa-video-camera',
			],
		];
	}

	public function init_fields() {
		$fields = [];

		$fields['background'] = [
			'label' => _x( 'Background Type', 'Background Control', 'qazana' ),
			'type' => Controls_Manager::CHOOSE,
			'label_block' => true,
		];

		$fields['color'] = [
			'label' => _x( 'Color', 'Background Control', 'qazana' ),
			'type' => Controls_Manager::COLOR,
			'default' => '',
			'title' => _x( 'Background Color', 'Background Control', 'qazana' ),
			'selectors' => [
				'{{SELECTOR}}' => 'background-color: {{VALUE}};',
			],
			'condition' => [
				'background' => [ 'classic', 'gradient' ],
			],
		];

		$fields['color_stop'] = [
			'label' => _x( 'Location', 'Background Control', 'qazana' ),
			'type' => Controls_Manager::SLIDER,
			'size_units' => [ '%' ],
			'default' => [
				'unit' => '%',
				'size' => 0,
			],
			'render_type' => 'ui',
			'condition' => [
				'background' => [ 'gradient' ],
			],
			'of_type' => 'gradient',
		];

		$fields['color_b'] = [
			'label' => _x( 'Second Color', 'Background Control', 'qazana' ),
			'type' => Controls_Manager::COLOR,
			'default' => '#f2295b',
			'render_type' => 'ui',
			'condition' => [
				'background' => [ 'gradient' ],
			],
			'of_type' => 'gradient',
		];

		$fields['color_b_stop'] = [
			'label' => _x( 'Location', 'Background Control', 'qazana' ),
			'type' => Controls_Manager::SLIDER,
			'size_units' => [ '%' ],
			'default' => [
				'unit' => '%',
				'size' => 100,
			],
			'render_type' => 'ui',
			'condition' => [
				'background' => [ 'gradient' ],
			],
			'of_type' => 'gradient',
		];

		$fields['gradient_type'] = [
			'label' => _x( 'Type', 'Background Control', 'qazana' ),
			'type' => Controls_Manager::SELECT,
			'options' => [
				'linear' => _x( 'Linear', 'Background Control', 'qazana' ),
				'radial' => _x( 'Radial', 'Background Control', 'qazana' ),
			],
			'default' => 'linear',
			'render_type' => 'ui',
			'condition' => [
				'background' => [ 'gradient' ],
			],
			'of_type' => 'gradient',
		];

		$fields['gradient_angle'] = [
			'label' => _x( 'Angle', 'Background Control', 'qazana' ),
			'type' => Controls_Manager::SLIDER,
			'size_units' => [ 'deg' ],
			'default' => [
				'unit' => 'deg',
				'size' => 180,
			],
			'range' => [
				'deg' => [
					'step' => 10,
				],
			],
			'selectors' => [
				'{{SELECTOR}}' => 'background-color: transparent; background-image: linear-gradient({{SIZE}}{{UNIT}}, {{color.VALUE}} {{color_stop.SIZE}}{{color_stop.UNIT}}, {{color_b.VALUE}} {{color_b_stop.SIZE}}{{color_b_stop.UNIT}})',
			],
			'condition' => [
				'background' => [ 'gradient' ],
				'gradient_type' => 'linear',
			],
			'of_type' => 'gradient',
		];

		$fields['gradient_position'] = [
			'label' => _x( 'Position', 'Background Control', 'qazana' ),
			'type' => Controls_Manager::SELECT,
			'options' => [
				'center center' => _x( 'Center Center', 'Background Control', 'qazana' ),
				'center left' => _x( 'Center Left', 'Background Control', 'qazana' ),
				'center right' => _x( 'Center Right', 'Background Control', 'qazana' ),
				'top center' => _x( 'Top Center', 'Background Control', 'qazana' ),
				'top left' => _x( 'Top Left', 'Background Control', 'qazana' ),
				'top right' => _x( 'Top Right', 'Background Control', 'qazana' ),
				'bottom center' => _x( 'Bottom Center', 'Background Control', 'qazana' ),
				'bottom left' => _x( 'Bottom Left', 'Background Control', 'qazana' ),
				'bottom right' => _x( 'Bottom Right', 'Background Control', 'qazana' ),
			],
			'default' => 'center center',
			'selectors' => [
				'{{SELECTOR}}' => 'background-color: transparent; background-image: radial-gradient(at {{VALUE}}, {{color.VALUE}} {{color_stop.SIZE}}{{color_stop.UNIT}}, {{color_b.VALUE}} {{color_b_stop.SIZE}}{{color_b_stop.UNIT}})',
			],
			'condition' => [
				'background' => [ 'gradient' ],
				'gradient_type' => 'radial',
			],
			'of_type' => 'gradient',
		];

		$fields['image'] = [
			'label' => _x( 'Image', 'Background Control', 'qazana' ),
			'type' => Controls_Manager::MEDIA,
			'title' => _x( 'Background Image', 'Background Control', 'qazana' ),
			'selectors' => [
				'{{SELECTOR}}' => 'background-image: url("{{URL}}");',
			],
			'condition' => [
				'background' => [ 'classic' ],
			],
		];

		$fields['position'] = [
			'label' => _x( 'Position', 'Background Control', 'qazana' ),
			'type' => Controls_Manager::SELECT,
			'default' => '',
			'options' => [
				'' => _x( 'Default', 'Background Control', 'qazana' ),
				'top left' => _x( 'Top Left', 'Background Control', 'qazana' ),
				'top center' => _x( 'Top Center', 'Background Control', 'qazana' ),
				'top right' => _x( 'Top Right', 'Background Control', 'qazana' ),
				'center left' => _x( 'Center Left', 'Background Control', 'qazana' ),
				'center center' => _x( 'Center Center', 'Background Control', 'qazana' ),
				'center right' => _x( 'Center Right', 'Background Control', 'qazana' ),
				'bottom left' => _x( 'Bottom Left', 'Background Control', 'qazana' ),
				'bottom center' => _x( 'Bottom Center', 'Background Control', 'qazana' ),
				'bottom right' => _x( 'Bottom Right', 'Background Control', 'qazana' ),
			],
			'selectors' => [
				'{{SELECTOR}}' => 'background-position: {{VALUE}};',
			],
			'condition' => [
				'background' => [ 'classic' ],
				'image[url]!' => '',
			],
		];

		$fields['attachment'] = [
			'label' => _x( 'Attachment', 'Background Control', 'qazana' ),
			'type' => Controls_Manager::SELECT,
			'default' => '',
			'options' => [
				'' => _x( 'Default', 'Background Control', 'qazana' ),
				'scroll' => _x( 'Scroll', 'Background Control', 'qazana' ),
				'fixed' => _x( 'Fixed', 'Background Control', 'qazana' ),
			],
			'selectors' => [
				'(tablet+){{SELECTOR}}' => 'background-attachment: {{VALUE}};',
			],
			'condition' => [
				'background' => [ 'classic' ],
				'image[url]!' => '',
			],
		];

		$fields['repeat'] = [
			'label' => _x( 'Repeat', 'Background Control', 'qazana' ),
			'type' => Controls_Manager::SELECT,
			'default' => '',
			'options' => [
				'' => _x( 'Default', 'Background Control', 'qazana' ),
				'no-repeat' => _x( 'No-repeat', 'Background Control', 'qazana' ),
				'repeat' => _x( 'Repeat', 'Background Control', 'qazana' ),
				'repeat-x' => _x( 'Repeat-x', 'Background Control', 'qazana' ),
				'repeat-y' => _x( 'Repeat-y', 'Background Control', 'qazana' ),
			],
			'selectors' => [
				'{{SELECTOR}}' => 'background-repeat: {{VALUE}};',
			],
			'condition' => [
				'background' => [ 'classic' ],
				'image[url]!' => '',
			],
		];

		$fields['size'] = [
			'label' => _x( 'Size', 'Background Control', 'qazana' ),
			'type' => Controls_Manager::SELECT,
			'default' => '',
			'options' => [
				'' => _x( 'Default', 'Background Control', 'qazana' ),
				'auto' => _x( 'Auto', 'Background Control', 'qazana' ),
				'cover' => _x( 'Cover', 'Background Control', 'qazana' ),
				'contain' => _x( 'Contain', 'Background Control', 'qazana' ),
			],
			'selectors' => [
				'{{SELECTOR}}' => 'background-size: {{VALUE}};',
			],
			'condition' => [
				'background' => [ 'classic' ],
				'image[url]!' => '',
			],
		];

		$fields['video_source'] = [
			'label' 		=> __( 'Video Source', 'energia' ),
			'type' 			=> Controls_Manager::CHOOSE,
			'default'		=> 'self-hosted',
			'options' 		=> [
				'youtube' 		=> [
					'title' => __( 'Youtube', 'energia' ),
					'icon' 	=> 'fa fa-youtube',
				],
				'self_hosted' 	=> [
					'title' => __( 'Self Hosted', 'energia' ),
					'icon' 	=> 'fa fa-play',
				],
			],
			'condition' => [
				'background' => [ 'video' ],
			],
		];

		$fields['youtube_video_link'] = [
			'label' => _x( 'Youtube Video Link', 'Background Control', 'qazana' ),
			'type' => Controls_Manager::TEXT,
			'placeholder' => 'https://www.youtube.com/watch?v=9uOETcuFjbE',
			'description' => __( 'Insert YouTube link', 'qazana' ),
			'label_block' => true,
			'default' => '',
			'condition' => [
				'background' => [ 'video' ],
				'video_source' => [ 'youtube' ],
			],
			'of_type' => 'video',
		];

		$fields['video_link'] = [
			'label' => _x( 'Video Link', 'Background Control', 'qazana' ),
			'type' => Controls_Manager::TEXT,
			'placeholder' => '',
			'description' => __( 'Insert video link', 'qazana' ),
			'label_block' => true,
			'default' => '',
			'condition' => [
				'background' => [ 'video' ],
				'video_source' => [ 'self_hosted' ],
			],
			'of_type' => 'video',
		];

		$fields['video_fallback'] = [
			'label' => _x( 'Background Fallback', 'Background Control', 'qazana' ),
			'description' => __( 'This cover image will replace the background video on mobile or tablet.', 'qazana' ),
			'type' => Controls_Manager::MEDIA,
			'label_block' => true,
			'condition' => [
				'background' => [ 'video' ],
			],
			'selectors' => [
				'{{SELECTOR}}' => 'background: url("{{URL}}") 50% 50%; background-size: cover;',
			],
			'of_type' => 'video',
		];

		return $fields;
	}

	protected function get_child_default_args() {
		return [
			'types' => [ 'none', 'classic' ],
		];
	}

	protected function filter_fields() {
		$fields = parent::filter_fields();

		$args = $this->get_args();

		foreach ( $fields as &$field ) {
			if ( isset( $field['of_type'] ) && ! in_array( $field['of_type'], $args['types'] ) ) {
				unset( $field );
			}
		}

		return $fields;
	}

	protected function prepare_fields( $fields ) {
		$args = $this->get_args();

		$background_types = self::get_background_types();

		$choose_types = [];

		foreach ( $args['types'] as $type ) {
			if ( isset( $background_types[ $type ] ) ) {
				$choose_types[ $type ] = $background_types[ $type ];
			}
		}

		$fields['background']['options'] = $choose_types;

		return parent::prepare_fields( $fields );
	}
}
