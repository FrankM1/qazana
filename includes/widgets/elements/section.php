<?php
namespace Builder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Element_Section extends Element_Base {

	protected static $_edit_tools;

	private static $presets = [];

	protected static function get_default_edit_tools() {
		return [
			'duplicate' => [
				'title' => __( 'Duplicate', 'builder' ),
				'icon' => 'files-o',
			],
			'save' => [
				'title' => __( 'Save', 'builder' ),
				'icon' => 'floppy-o',
			],
			'remove' => [
				'title' => __( 'Remove', 'builder' ),
				'icon' => 'times',
			],
		];
	}

	public function get_name() {
		return 'section';
	}

	public function get_title() {
		return __( 'Section', 'builder' );
	}

	public function get_icon() {
		return 'eicon-columns';
	}

	public static function get_presets( $columns_count = null, $preset_index = null ) {
		if ( ! self::$presets ) {
			self::init_presets();
		}

		$presets = self::$presets;

		if ( null !== $columns_count ) {
			$presets = $presets[ $columns_count ];
		}

		if ( null !== $preset_index ) {
			$presets = $presets[ $preset_index ];
		}

		return $presets;
	}

	public static function init_presets() {
		$additional_presets = [
			2 => [
				[
					'preset' => [ 33, 66 ],
				],
				[
					'preset' => [ 66, 33 ],
				],
			],
			3 => [
				[
					'preset' => [ 25, 25, 50 ],
				],
				[
					'preset' => [ 50, 25, 25 ],
				],
				[
					'preset' => [ 25, 50, 25 ],
				],
				[
					'preset' => [ 16, 66, 16 ],
				],
			],
		];

		foreach ( range( 1, 10 ) as $columns_count ) {
			self::$presets[ $columns_count ] = [
				[
					'preset' => [],
				],
			];

			$preset_unit = floor( 1 / $columns_count * 100 );

			for ( $i = 0; $i < $columns_count; $i++ ) {
				self::$presets[ $columns_count ][0]['preset'][] = $preset_unit;
			}

			if ( ! empty( $additional_presets[ $columns_count ] ) ) {
				self::$presets[ $columns_count ] = array_merge( self::$presets[ $columns_count ], $additional_presets[ $columns_count ] );
			}

			foreach ( self::$presets[ $columns_count ] as $preset_index => & $preset ) {
				$preset['key'] = $columns_count . $preset_index;
			}
		}
	}

	protected function _get_initial_config() {
		$config = parent::_get_initial_config();

		$config['presets'] = self::get_presets();

		return $config;
	}

	protected function _register_controls() {

		$this->start_controls_section(
			'section_layout',
			[
				'label' => __( 'Layout', 'builder' ),
				'tab' => Controls_Manager::TAB_LAYOUT,
			]
		);

		$this->add_control(
			'stretch_section',
			[
				'label' => __( 'Stretch Section', 'builder' ),
				'type' => Controls_Manager::SWITCHER,
				'default' => '',
				'label_on' => __( 'Yes', 'builder' ),
				'label_off' => __( 'No', 'builder' ),
				'return_value' => 'section-stretched',
				'prefix_class' => 'builder-',
				'force_render' => true,
				'hide_in_inner' => true,
				'description' => __( 'Stretch the section to the full width of the page using JS.', 'builder' ) . sprintf( ' <a href="%s" target="_blank">%s</a>', 'https://radiumthemes.com/plugins/builder/stretch-section/', __( 'Learn more.', 'builder' ) ),
			]
		);

		$this->add_control(
			'layout',
			[
				'label' => __( 'Content Width', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'boxed',
				'options' => [
					'boxed' => __( 'Boxed', 'builder' ),
					'full_width' => __( 'Full Width', 'builder' ),
				],
				'prefix_class' => 'builder-section-',
			]
		);

		$this->add_control(
			'content_width',
			[
				'label' => __( 'Content Width', 'builder' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'min' => 500,
						'max' => 1600,
					],
				],
				'selectors' => [
					'{{WRAPPER}}.builder-section-boxed>.builder-container, {{WRAPPER}}.builder-section-boxed>.builder-container' => 'max-width: {{SIZE}}{{UNIT}};',
				],
				'condition' => [
					'layout' => [ 'boxed' ],
				],
				'show_label' => false,
				'separator' => 'none',
			]
		);

		$this->add_control(
			'gap',
			[
				'label' => __( 'Columns Gap', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'default',
				'options' => [
					'default' => __( 'Default', 'builder' ),
					'no' => __( 'No Gap', 'builder' ),
					'narrow' => __( 'Narrow', 'builder' ),
					'extended' => __( 'Extended', 'builder' ),
					'wide' => __( 'Wide', 'builder' ),
					'wider' => __( 'Wider', 'builder' ),
				],
			]
		);

		$this->add_control(
			'height',
			[
				'label' => __( 'Height', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'default',
				'options' => [
					'default' => __( 'Default', 'builder' ),
					'full' => __( 'Fit To Screen', 'builder' ),
					'min-height' => __( 'Min Height', 'builder' ),
				],
				'prefix_class' => 'builder-section-height-',
				'hide_in_inner' => true,
			]
		);

		$this->add_control(
			'custom_height',
			[
				'label' => __( 'Minimum Height', 'builder' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => 400,
				],
				'range' => [
					'px' => [
						'min' => 0,
						'max' => 1440,
					],
					'vh' => [
						'min' => 0,
						'max' => 100,
					],
				],
				'size_units' => [ 'px', 'vh' ],
				'selectors' => [
					'{{WRAPPER}} > .builder-container' => 'min-height: {{SIZE}}{{UNIT}};',
				],
				'condition' => [
					'height' => [ 'min-height' ],
				],
				'hide_in_inner' => true,
			]
		);

		$this->add_control(
			'height_inner',
			[
				'label' => __( 'Height', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'default',
				'options' => [
					'default' => __( 'Default', 'builder' ),
					'min-height' => __( 'Min Height', 'builder' ),
				],
				'prefix_class' => 'builder-section-height-',
				'hide_in_top' => true,
			]
		);

		$this->add_control(
			'custom_height_inner',
			[
				'label' => __( 'Minimum Height', 'builder' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => 400,
				],
				'range' => [
					'px' => [
						'min' => 0,
						'max' => 1440,
					],
				],
				'selectors' => [
					'{{WRAPPER}} > .builder-container' => 'min-height: {{SIZE}}{{UNIT}};',
				],
				'condition' => [
					'height_inner' => [ 'min-height' ],
				],
				'hide_in_top' => true,
			]
		);

		$this->add_control(
			'column_position',
			[
				'label' => __( 'Column Position', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'middle',
				'options' => [
					'stretch' => __( 'Stretch', 'builder' ),
					'top' => __( 'Top', 'builder' ),
					'middle' => __( 'Middle', 'builder' ),
					'bottom' => __( 'Bottom', 'builder' ),
				],
				'prefix_class' => 'builder-section-items-',
				'condition' => [
					'height' => [ 'full', 'min-height' ],
				],
			]
		);

		$this->add_control(
			'content_position',
			[
				'label' => __( 'Content Position', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'default' => '',
				'options' => [
					'' => __( 'Default', 'builder' ),
					'top' => __( 'Top', 'builder' ),
					'middle' => __( 'Middle', 'builder' ),
					'bottom' => __( 'Bottom', 'builder' ),
				],
				'prefix_class' => 'builder-section-content-',
			]
		);

		$this->add_control(
			'structure',
			[
				'label' => __( 'Structure', 'builder' ),
				'type' => Controls_Manager::STRUCTURE,
				'default' => '10',
				'selectors' => [
					'' => '',
				], // Hack to define it as a styleControl. @FIXME
			]
		);

		$this->end_controls_section();

		// Section background
		$this->start_controls_section(
			'section_background',
			[
				'label' => __( 'Background', 'builder' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_group_control(
			Group_Control_Background::get_type(),
			[
				'name' => 'background',
				'types' => [ 'classic', 'video' ],
			]
		);

		$this->add_control(
			'parallax',
			[
				'label' => __( 'Parallax', 'builder' ),
				'type' => Controls_Manager::SWITCHER,
				'default' => '',
				'prefix_class' => 'builder-',
				'label_on' => __( 'Yes', 'builder' ),
				'label_off' => __( 'No', 'builder' ),
				'return_value' => 'parallax',
				'description' => __( 'Enable parallax scroll on this section.', 'builder' ),
				'condition' => [
					'background_background' => [ 'classic' ],
				],
			]
		);

		$this->add_control(
			'parallax_speed',
			[
				'label' => __( 'Parallax speed', 'builder' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => 0.2,
				],
				'range' => [
					'px' => [
						'min' => 0.0,
						'max' => 1.0,
						'step' => 0.1,
					],
				],
			]
		);

		$this->end_controls_section();

		// Background Overlay
		$this->start_controls_section(
			'background_overlay_section',
			[
				'label' => __( 'Background Overlay', 'builder' ),
				'tab' => Controls_Manager::TAB_STYLE,
				'condition' => [
					'background_background' => [ 'classic', 'video' ],
				],
			]
		);

		$this->add_group_control(
			Group_Control_Background::get_type(),
			[
				'name' => 'background_overlay',
				'types' => [ 'classic', 'gradient' ],
				'selector' => '{{WRAPPER}} > .builder-background-overlay',
				'condition' => [
					'background_background' => [ 'none', 'classic', 'gradient', 'video' ],
				],
			]
		);

		$this->add_control(
			'background_overlay_opacity',
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
					'{{WRAPPER}} > .builder-background-overlay' => 'opacity: {{SIZE}};',
				],
				'condition' => [
					'background_overlay_background' => [ 'classic', 'gradient' ],
				],
			]
		);

		$this->end_controls_section();

		// Section border
		$this->start_controls_section(
			'section_border',
			[
				'label' => __( 'Border', 'builder' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_group_control(
			Group_Control_Border::get_type(),
			[
				'name' => 'border',
			]
		);

		$this->add_control(
			'border_radius',
			[
				'label' => __( 'Border Radius', 'builder' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'selectors' => [
					'{{WRAPPER}}, {{WRAPPER}} > .builder-background-overlay' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Box_Shadow::get_type(),
			[
				'name' => 'box_shadow',
			]
		);

		$this->end_controls_section();

		// Section Typography
		$this->start_controls_section(
			'section_typo',
			[
				'label' => __( 'Typography', 'builder' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		if ( in_array( Scheme_Color::get_type(), Schemes_Manager::get_enabled_schemes() ) ) {
			$this->add_control(
				'colors_warning',
				[
					'type' => Controls_Manager::RAW_HTML,
					'raw' => __( 'Note: The following colors won\'t work if Global Colors are enabled.', 'builder' ),
					'content_classes' => 'builder-panel-alert builder-panel-alert-warning',
				]
			);
		}

		$this->add_control(
			'heading_color',
			[
				'label' => __( 'Heading Color', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} > .builder-container .builder-heading-title' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'color_text',
			[
				'label' => __( 'Text Color', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} > .builder-container' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'color_link',
			[
				'label' => __( 'Link Color', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} > .builder-container a' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'color_link_hover',
			[
				'label' => __( 'Link Hover Color', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} > .builder-container a:hover' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'text_align',
			[
				'label' => __( 'Text Align', 'builder' ),
				'type' => Controls_Manager::CHOOSE,
				'options' => [
					'left' => [
						'title' => __( 'Left', 'builder' ),
						'icon' => 'fa fa-align-left',
					],
					'center' => [
						'title' => __( 'Center', 'builder' ),
						'icon' => 'fa fa-align-center',
					],
					'right' => [
						'title' => __( 'Right', 'builder' ),
						'icon' => 'fa fa-align-right',
					],
				],
				'selectors' => [
					'{{WRAPPER}} > .builder-container' => 'text-align: {{VALUE}};',
				],
			]
		);

		$this->end_controls_section();

		// Section Advanced
		$this->start_controls_section(
			'section_advanced',
			[
				'label' => __( 'Advanced', 'builder' ),
				'tab' => Controls_Manager::TAB_ADVANCED,
			]
		);

		$this->add_responsive_control(
			'margin',
			[
				'label' => __( 'Margin', 'builder' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'allowed_dimensions' => 'vertical',
				'placeholder' => [
					'top' => '',
					'right' => 'auto',
					'bottom' => '',
					'left' => 'auto',
				],
				'selectors' => [
					'{{WRAPPER}}' => 'margin-top: {{TOP}}{{UNIT}}; margin-bottom: {{BOTTOM}}{{UNIT}};',
				],
			]
		);

		$this->add_responsive_control(
			'padding',
			[
				'label' => __( 'Padding', 'builder' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors' => [
					'{{WRAPPER}}' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

        $this->add_group_control(
			Group_Control_Animations::get_type(),
			[
				'name' => '_background',
				'selector' => '{{WRAPPER}} .builder-widget-container',
			]
		);


		$this->add_control(
			'_element_id',
			[
				'label' => __( 'CSS ID', 'builder' ),
				'type' => Controls_Manager::TEXT,
				'default' => '',
				'label_block' => true,
				'title' => __( 'Add your custom id WITHOUT the Pound key. e.g: my-id', 'builder' ),
			]
		);

		$this->add_control(
			'css_classes',
			[
				'label' => __( 'CSS Classes', 'builder' ),
				'type' => Controls_Manager::TEXT,
				'default' => '',
				'prefix_class' => '',
				'label_block' => true,
				'title' => __( 'Add your custom class WITHOUT the dot. e.g: my-class', 'builder' ),
			]
		);

		$this->end_controls_section();

		// Section Responsive
		$this->start_controls_section(
			'_section_responsive',
			[
				'label' => __( 'Responsive', 'builder' ),
				'tab' => Controls_Manager::TAB_ADVANCED,
			]
		);

		$this->add_control(
			'reverse_order_mobile',
			[
				'label' => __( 'Reverse Columns', 'builder' ),
				'type' => Controls_Manager::SWITCHER,
				'default' => '',
				'prefix_class' => 'builder-',
				'label_on' => __( 'Yes', 'builder' ),
				'label_off' => __( 'No', 'builder' ),
				'return_value' => 'reverse-mobile',
				'description' => __( 'Reverse column order - When on mobile, the column order is reversed, so the last column appears on top and vice versa.', 'builder' ),
			]
		);

		$this->add_control(
			'heading_visibility',
			[
				'label' => __( 'Visibility', 'builder' ),
				'type' => Controls_Manager::HEADING,
				'separator' => 'before',
			]
		);

		$this->add_control(
			'responsive_description',
			[
				'raw' => __( 'Attention: The display settings (show/hide for mobile, tablet or desktop) will only take effect once you are on the preview or live page, and not while you\'re in editing mode in Builder.', 'builder' ),
				'type' => Controls_Manager::RAW_HTML,
				'classes' => 'builder-descriptor',
			]
		);

		$this->add_control(
			'hide_desktop',
			[
				'label' => __( 'Hide On Desktop', 'builder' ),
				'type' => Controls_Manager::SWITCHER,
				'default' => '',
				'prefix_class' => 'builder-',
				'label_on' => __( 'Hide', 'builder' ),
				'label_off' => __( 'Show', 'builder' ),
				'return_value' => 'hidden-desktop',
			]
		);

		$this->add_control(
			'hide_tablet',
			[
				'label' => __( 'Hide On Tablet', 'builder' ),
				'type' => Controls_Manager::SWITCHER,
				'default' => '',
				'prefix_class' => 'builder-',
				'label_on' => __( 'Hide', 'builder' ),
				'label_off' => __( 'Show', 'builder' ),
				'return_value' => 'hidden-tablet',
			]
		);

		$this->add_control(
			'hide_mobile',
			[
				'label' => __( 'Hide On Mobile', 'builder' ),
				'type' => Controls_Manager::SWITCHER,
				'default' => '',
				'prefix_class' => 'builder-',
				'label_on' => __( 'Hide', 'builder' ),
				'label_off' => __( 'Show', 'builder' ),
				'return_value' => 'hidden-phone',
			]
		);

		$this->end_controls_section();

	}

	protected function _render_settings() {
		?>
		<div class="builder-element-overlay"></div>
		<?php
	}

	protected function _content_template() {
		?>
		<# if ( 'video' === settings.background_background ) {
			var videoLink = settings.background_video_link;

			if ( videoLink ) {
				var videoID = builder.helpers.getYoutubeIDFromURL( settings.background_video_link ); #>

				<div class="builder-background-video-container builder-hidden-phone">
					<# if ( videoID ) { #>
						<div class="builder-background-video" data-video-id="{{ videoID }}"></div>
					<# } else { #>
						<video class="builder-background-video" src="{{ videoLink }}" autoplay loop muted></video>
					<# } #>
				</div>
			<# }

			if ( settings.background_video_fallback ) { #>
				<div class="builder-background-video-fallback" style="background-image: url({{ settings.background_video_fallback.url }})"></div>
			<# }
		}

		if ( 'classic' === settings.background_overlay_background ) { #>
			<div class="builder-background-overlay"></div>
		<# } #>

		<div class="builder-shape builder-shape-top"></div>
		<div class="builder-shape builder-shape-bottom"></div>
		<div class="builder-container builder-column-gap-{{ settings.gap }}" <# if ( settings.get_render_attribute_string ) { #>{{{ settings.get_render_attribute_string( 'wrapper' ) }}} <# } #> >
			<div class="builder-row"></div>
		</div>
		<?php
	}

	private function print_shape_divider( $side ) {
	    $settings = $this->get_active_settings();
	    $base_setting_key = "shape_divider_$side";
		$negative = ! empty( $settings[ $base_setting_key . '_negative' ] );
	    ?>
		<div class="builder-shape builder-shape-<?php echo $side; ?>" data-negative="<?php echo var_export( $negative ); ?>">
			<?php include Shapes::get_shape_path( $settings[ $base_setting_key ], ! empty( $settings[ $base_setting_key . '_negative' ] ) ); ?>
		</div>
		<?php
	}

	public function before_render() {
		$section_type = $this->get_data( 'isInner' ) ? 'inner' : 'top';

		$this->add_render_attribute( 'wrapper', 'class', [
			'builder-section',
			'builder-element',
			'builder-element-' . $this->get_id(),
			'builder-' . $section_type . '-section',
		] );

		$settings = $this->get_settings();

		foreach ( $this->get_class_controls() as $control ) {
			if ( empty( $settings[ $control['name'] ] ) )
				continue;

			if ( ! $this->is_control_visible( $control ) )
				continue;

			$this->add_render_attribute( 'wrapper', 'class', $control['prefix_class'] . $settings[ $control['name'] ] );
		}

		if ( ! empty( $settings['animation'] ) ) {
			$this->add_render_attribute( 'wrapper', 'data-animation', $settings['animation'] );
		}

        $this->add_render_attribute( 'wrapper', 'data-element_type', $this->get_name() );
		$this->add_render_attribute( 'row', 'class', 'builder-row' );

        ?>
        <section <?php echo $this->get_render_attribute_string( 'wrapper' ); ?>>
            <?php

            if ( 'video' === $settings['background_background'] ) :
                if ( $settings['background_video_link'] ) :
                    $video_data = Utils::get_video_id_from_url( $settings['background_video_link'] );
                    ?>
                    <div class="builder-background-video-container builder-hidden-phone">
                        <?php if ( ! empty( $video_data ) ) : ?>
                            <div class="builder-background-video" data-video-host="<?php echo $video_data['host']; ?>" data-video-id="<?php echo $video_data['id']; ?>"></div>
                        <?php else : ?>
                            <video class="builder-background-video builder-html5-video" src="<?php echo $settings['background_video_link'] ?>" autoplay loop muted></video>
                        <?php endif; ?>
                    </div>
                <?php endif;
            endif;

            if ( in_array( $settings['background_overlay_background'], [ 'classic', 'gradient' ] ) ) : ?>
                <div class="builder-background-overlay"></div>
            <?php endif; ?>

            <div class="builder-container builder-column-gap-<?php echo esc_attr( $settings['gap'] ); ?>">
                <div <?php echo $this->get_render_attribute_string( 'row' ); ?>>
        <?php
    }

    public function after_render() {
        ?>
                </div>
            </div>
        </section>
        <?php
    }

	protected function _get_default_child_type( array $element_data ) {
		return builder()->elements_manager->get_element_types( 'column' );
	}
}
