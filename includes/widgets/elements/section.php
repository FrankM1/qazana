<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Element_Section extends Element_Base {

	protected static $_edit_tools;

	private static $presets = [];

	protected static function get_default_edit_tools() {
		$section_label = __( 'Section', 'qazana' );

		return [
			'duplicate' => [
				'title' => sprintf( __( 'Duplicate %s', 'qazana' ), $section_label ),
				'icon' => 'clone',
			],
			'add' => [
				'title' => sprintf( __( 'Add %s', 'qazana' ), $section_label ),
				'icon' => 'plus',
			],
			'save' => [
				'title' => sprintf( __( 'Save %s', 'qazana' ), $section_label ),
				'icon' => 'floppy-o',
			],
			'remove' => [
				'title' => sprintf( __( 'Remove %s', 'qazana' ), $section_label ),
				'icon' => 'times',
			],
		];
	}

	public function get_name() {
		return 'section';
	}

	public function get_title() {
		return __( 'Section', 'qazana' );
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
				'label' => __( 'Layout', 'qazana' ),
				'tab' => Controls_Manager::TAB_LAYOUT,
			]
		);

		$this->add_control(
			'stretch_section',
			[
				'label' => __( 'Stretch Section', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'default' => '',
				'label_on' => __( 'Yes', 'qazana' ),
				'label_off' => __( 'No', 'qazana' ),
				'return_value' => 'section-stretched',
				'prefix_class' => 'qazana-',
				'render_type' => 'template',
				'hide_in_inner' => true,
				'description' => __( 'Stretch the section to the full width of the page using JS.', 'qazana' ) . sprintf( ' <a href="%s" target="_blank">%s</a>', 'https://go.qazana.com/stretch-section/', __( 'Learn more.', 'qazana' ) ),
			]
		);

		$this->add_control(
			'layout',
			[
				'label' => __( 'Content Width', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'boxed',
				'options' => [
					'boxed' => __( 'Boxed', 'qazana' ),
					'full_width' => __( 'Full Width', 'qazana' ),
				],
				'prefix_class' => 'qazana-section-',
			]
		);

		$this->add_control(
			'content_width',
			[
				'label' => __( 'Content Width', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'min' => 500,
						'max' => 1600,
					],
				],
				'selectors' => [
					'{{WRAPPER}}.qazana-section-boxed>.qazana-container, {{WRAPPER}}.qazana-section-boxed>.qazana-container' => 'max-width: {{SIZE}}{{UNIT}};',
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
				'label' => __( 'Columns Gap', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'default',
				'options' => [
					'default' => __( 'Default', 'qazana' ),
					'no' => __( 'No Gap', 'qazana' ),
					'narrow' => __( 'Narrow', 'qazana' ),
					'extended' => __( 'Extended', 'qazana' ),
					'wide' => __( 'Wide', 'qazana' ),
					'wider' => __( 'Wider', 'qazana' ),
				],
			]
		);

		$this->add_control(
			'height',
			[
				'label' => __( 'Height', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'default',
				'options' => [
					'default' => __( 'Default', 'qazana' ),
					'full' => __( 'Fit To Screen', 'qazana' ),
					'min-height' => __( 'Min Height', 'qazana' ),
				],
				'prefix_class' => 'qazana-section-height-',
				'hide_in_inner' => true,
			]
		);

		$this->add_responsive_control(
			'custom_height',
			[
				'label' => __( 'Minimum Height', 'qazana' ),
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
					'{{WRAPPER}} > .qazana-container' => 'min-height: {{SIZE}}{{UNIT}};',
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
				'label' => __( 'Height', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'default',
				'options' => [
					'default' => __( 'Default', 'qazana' ),
					'min-height' => __( 'Min Height', 'qazana' ),
				],
				'prefix_class' => 'qazana-section-height-',
				'hide_in_top' => true,
			]
		);

		$this->add_control(
			'custom_height_inner',
			[
				'label' => __( 'Minimum Height', 'qazana' ),
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
					'{{WRAPPER}} > .qazana-container' => 'min-height: {{SIZE}}{{UNIT}};',
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
				'label' => __( 'Column Position', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'middle',
				'options' => [
					'stretch' => __( 'Stretch', 'qazana' ),
					'top' => __( 'Top', 'qazana' ),
					'middle' => __( 'Middle', 'qazana' ),
					'bottom' => __( 'Bottom', 'qazana' ),
				],
				'prefix_class' => 'qazana-section-items-',
				'condition' => [
					'height' => [ 'full', 'min-height' ],
				],
			]
		);

		$this->add_control(
			'content_position',
			[
				'label' => __( 'Content Position', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => '',
				'options' => [
					'' => __( 'Default', 'qazana' ),
					'top' => __( 'Top', 'qazana' ),
					'middle' => __( 'Middle', 'qazana' ),
					'bottom' => __( 'Bottom', 'qazana' ),
				],
				'prefix_class' => 'qazana-section-content-',
			]
		);

		$possible_tags = [
			'section',
			'header',
			'footer',
			'aside',
			'article',
			'nav',
			'div',
		];

		$this->add_control(
			'html_tag',
			[
				'label' => __( 'HTML Tag', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'section',
				'options' => array_combine( $possible_tags, $possible_tags ),
			]
		);

		$this->add_control(
			'structure',
			[
				'label' => __( 'Structure', 'qazana' ),
				'type' => Controls_Manager::STRUCTURE,
				'default' => '10',
				'render_type' => 'none',
			]
		);

		$this->end_controls_section();

		// Section background
		$this->start_controls_section(
			'section_background',
			[
				'label' => __( 'Background', 'qazana' ),
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
				'label' => __( 'Parallax', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'default' => '',
				'prefix_class' => 'qazana-',
				'label_on' => __( 'Yes', 'qazana' ),
				'label_off' => __( 'No', 'qazana' ),
				'return_value' => 'parallax',
				'description' => __( 'Enable parallax scroll on this section.', 'qazana' ),
				'condition' => [
					'background_background' => [ 'classic' ],
				],
			]
		);

		$this->add_control(
			'parallax_speed',
			[
				'label' => __( 'Parallax speed', 'qazana' ),
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
				'label' => __( 'Background Overlay', 'qazana' ),
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
				'selector' => '{{WRAPPER}} > .qazana-background-overlay',
				'condition' => [
					'background_background' => [ 'none', 'classic', 'gradient', 'video' ],
				],
			]
		);

		$this->add_control(
			'background_overlay_opacity',
			[
				'label' => __( 'Opacity (%)', 'qazana' ),
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
					'{{WRAPPER}} > .qazana-background-overlay' => 'opacity: {{SIZE}};',
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
				'label' => __( 'Border', 'qazana' ),
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
				'label' => __( 'Border Radius', 'qazana' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'selectors' => [
					'{{WRAPPER}}, {{WRAPPER}} > .qazana-background-overlay' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
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
				'label' => __( 'Typography', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		if ( in_array( Scheme_Color::get_type(), Schemes_Manager::get_enabled_schemes() ) ) {
			$this->add_control(
				'colors_warning',
				[
					'type' => Controls_Manager::RAW_HTML,
					'raw' => __( 'Note: The following colors won\'t work if Global Colors are enabled.', 'qazana' ),
					'content_classes' => 'qazana-panel-alert qazana-panel-alert-warning',
				]
			);
		}

		$this->add_control(
			'heading_color',
			[
				'label' => __( 'Heading Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} > .qazana-container .qazana-heading-title' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'color_text',
			[
				'label' => __( 'Text Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} > .qazana-container' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'color_link',
			[
				'label' => __( 'Link Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} > .qazana-container a' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'color_link_hover',
			[
				'label' => __( 'Link Hover Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} > .qazana-container a:hover' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'text_align',
			[
				'label' => __( 'Text Align', 'qazana' ),
				'type' => Controls_Manager::CHOOSE,
				'options' => [
					'left' => [
						'title' => __( 'Left', 'qazana' ),
						'icon' => 'fa fa-align-left',
					],
					'center' => [
						'title' => __( 'Center', 'qazana' ),
						'icon' => 'fa fa-align-center',
					],
					'right' => [
						'title' => __( 'Right', 'qazana' ),
						'icon' => 'fa fa-align-right',
					],
				],
				'selectors' => [
					'{{WRAPPER}} > .qazana-container' => 'text-align: {{VALUE}};',
				],
			]
		);

		$this->end_controls_section();

		// Section Advanced
		$this->start_controls_section(
			'section_advanced',
			[
				'label' => __( 'Advanced', 'qazana' ),
				'tab' => Controls_Manager::TAB_ADVANCED,
			]
		);

		$this->add_responsive_control(
			'margin',
			[
				'label' => __( 'Margin', 'qazana' ),
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
				'label' => __( 'Padding', 'qazana' ),
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
				'selector' => '{{WRAPPER}} .qazana-widget-container',
			]
		);


		$this->add_control(
			'_element_id',
			[
				'label' => __( 'CSS ID', 'qazana' ),
				'type' => Controls_Manager::TEXT,
				'default' => '',
				'label_block' => true,
				'title' => __( 'Add your custom id WITHOUT the Pound key. e.g: my-id', 'qazana' ),
			]
		);

		$this->add_control(
			'css_classes',
			[
				'label' => __( 'CSS Classes', 'qazana' ),
				'type' => Controls_Manager::TEXT,
				'default' => '',
				'prefix_class' => '',
				'label_block' => true,
				'title' => __( 'Add your custom class WITHOUT the dot. e.g: my-class', 'qazana' ),
			]
		);

		$this->end_controls_section();

		// Section Responsive
		$this->start_controls_section(
			'_section_responsive',
			[
				'label' => __( 'Responsive', 'qazana' ),
				'tab' => Controls_Manager::TAB_ADVANCED,
			]
		);

		$this->add_control(
			'reverse_order_mobile',
			[
				'label' => __( 'Reverse Columns', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'default' => '',
				'prefix_class' => 'qazana-',
				'label_on' => __( 'Yes', 'qazana' ),
				'label_off' => __( 'No', 'qazana' ),
				'return_value' => 'reverse-mobile',
				'description' => __( 'Reverse column order - When on mobile, the column order is reversed, so the last column appears on top and vice versa.', 'qazana' ),
			]
		);

		$this->add_control(
			'heading_visibility',
			[
				'label' => __( 'Visibility', 'qazana' ),
				'type' => Controls_Manager::HEADING,
				'separator' => 'before',
			]
		);

		$this->add_control(
			'responsive_description',
			[
				'raw' => __( 'Attention: The display settings (show/hide for mobile, tablet or desktop) will only take effect once you are on the preview or live page, and not while you\'re in editing mode in Qazana.', 'qazana' ),
				'type' => Controls_Manager::RAW_HTML,
				'classes' => 'qazana-descriptor',
			]
		);

		$this->add_control(
			'hide_desktop',
			[
				'label' => __( 'Hide On Desktop', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'default' => '',
				'prefix_class' => 'qazana-',
				'label_on' => __( 'Hide', 'qazana' ),
				'label_off' => __( 'Show', 'qazana' ),
				'return_value' => 'hidden-desktop',
			]
		);

		$this->add_control(
			'hide_tablet',
			[
				'label' => __( 'Hide On Tablet', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'default' => '',
				'prefix_class' => 'qazana-',
				'label_on' => __( 'Hide', 'qazana' ),
				'label_off' => __( 'Show', 'qazana' ),
				'return_value' => 'hidden-tablet',
			]
		);

		$this->add_control(
			'hide_mobile',
			[
				'label' => __( 'Hide On Mobile', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'default' => '',
				'prefix_class' => 'qazana-',
				'label_on' => __( 'Hide', 'qazana' ),
				'label_off' => __( 'Show', 'qazana' ),
				'return_value' => 'hidden-phone',
			]
		);

		$this->end_controls_section();

	}

	protected function _render_settings() {
		?>
		<div class="qazana-element-overlay">
			<ul class="qazana-editor-element-settings qazana-editor-section-settings">
				<li class="qazana-editor-element-setting qazana-editor-element-trigger qazana-active" title="<?php printf( __( 'Edit %s', 'qazana' ),  __( 'Section', 'qazana' ) ); ?>"><i class="fa fa-bars"></i></li>
				<?php foreach ( Element_Section::get_edit_tools() as $edit_tool_name => $edit_tool ) : ?>
					<?php if ( 'add' === $edit_tool_name ) : ?>
						<# if ( ! isInner ) { #>
					<?php endif; ?>
					<li class="qazana-editor-element-setting qazana-editor-element-<?php echo $edit_tool_name; ?>" title="<?php echo $edit_tool['title']; ?>">
						<span class="qazana-screen-only"><?php echo $edit_tool['title']; ?></span>
						<i class="fa fa-<?php echo $edit_tool['icon']; ?>"></i>
					</li>
					<?php if ( 'add' === $edit_tool_name ) : ?>
						<# } #>
					<?php endif; ?>
				<?php endforeach; ?>
			</ul>
		</div>
		<?php
	}

	protected function _content_template() {
		?>
		<# if ( 'video' === settings.background_background ) {
			var videoLink = settings.background_video_link;

			if ( videoLink ) {
				var videoID = qazana.helpers.getYoutubeIDFromURL( settings.background_video_link ); #>

				<div class="qazana-background-video-container qazana-hidden-phone">
					<# if ( videoID ) { #>
						<div class="qazana-background-video" data-video-id="{{ videoID }}"></div>
					<# } else { #>
						<video class="qazana-background-video" src="{{ videoLink }}" autoplay loop muted></video>
					<# } #>
				</div>
			<# }

			if ( settings.background_video_fallback ) { #>
				<div class="qazana-background-video-fallback" style="background-image: url({{ settings.background_video_fallback.url }})"></div>
			<# }
		}

		if ( 'classic' === settings.background_overlay_background ) { #>
			<div class="qazana-background-overlay"></div>
		<# } #>

		<div class="qazana-shape qazana-shape-top"></div>
		<div class="qazana-shape qazana-shape-bottom"></div>
		<div class="qazana-container qazana-column-gap-{{ settings.gap }}" <# if ( settings.get_render_attribute_string ) { #>{{{ settings.get_render_attribute_string( 'wrapper' ) }}} <# } #> >
			<div class="qazana-row"></div>
		</div>
		<?php
	}

	private function print_shape_divider( $side ) {
	    $settings = $this->get_active_settings();
	    $base_setting_key = "shape_divider_$side";
		$negative = ! empty( $settings[ $base_setting_key . '_negative' ] );
	    ?>
		<div class="qazana-shape qazana-shape-<?php echo $side; ?>" data-negative="<?php echo var_export( $negative ); ?>">
			<?php include Shapes::get_shape_path( $settings[ $base_setting_key ], ! empty( $settings[ $base_setting_key . '_negative' ] ) ); ?>
		</div>
		<?php
	}

	public function before_render() {
		$section_type = $this->get_data( 'isInner' ) ? 'inner' : 'top';

		$this->add_render_attribute( 'wrapper', 'class', [
			'qazana-section',
			'qazana-element',
			'qazana-element-' . $this->get_id(),
			'qazana-' . $section_type . '-section',
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
		$this->add_render_attribute( 'row', 'class', 'qazana-row' );

        ?>
        <section <?php echo $this->get_render_attribute_string( 'wrapper' ); ?>>
            <?php

            if ( 'video' === $settings['background_background'] ) :
                if ( $settings['background_video_link'] ) :
                    $video_data = Utils::get_video_id_from_url( $settings['background_video_link'] );
                    ?>
                    <div class="qazana-background-video-container qazana-hidden-phone">
                        <?php if ( ! empty( $video_data ) ) : ?>
                            <div class="qazana-background-video" data-video-host="<?php echo $video_data['host']; ?>" data-video-id="<?php echo $video_data['id']; ?>"></div>
                        <?php else : ?>
                            <video class="qazana-background-video qazana-html5-video" src="<?php echo $settings['background_video_link'] ?>" autoplay loop muted></video>
                        <?php endif; ?>
                    </div>
                <?php endif;
            endif;

            if ( in_array( $settings['background_overlay_background'], [ 'classic', 'gradient' ] ) ) : ?>
                <div class="qazana-background-overlay"></div>
            <?php endif; ?>

            <div class="qazana-container qazana-column-gap-<?php echo esc_attr( $settings['gap'] ); ?>">
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
		return qazana()->elements_manager->get_element_types( 'column' );
	}
}
