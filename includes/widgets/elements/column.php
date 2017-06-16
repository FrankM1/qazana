<?php
namespace Builder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Element_Column extends Element_Base {

	protected static $_edit_tools;

	protected static function get_default_edit_tools() {
		return [
			'duplicate' => [
				'title' => __( 'Duplicate', 'builder' ),
				'icon' => 'files-o',
			],
			'add' => [
				'title' => __( 'Add', 'builder' ),
				'icon' => 'plus',
			],
			'remove' => [
				'title' => __( 'Remove', 'builder' ),
				'icon' => 'times',
			],
		];
	}

	public function get_name() {
		return 'column';
	}

	public function get_title() {
		return __( 'Column', 'builder' );
	}

	public function get_icon() {
		return 'eicon-columns';
	}

	protected function _register_controls() {
		$this->start_controls_section(
			'section_style',
			[
				'label' => __( 'Background & Border', 'builder' ),
				'type' => Controls_Manager::SECTION,
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_group_control(
			Group_Control_Background::get_type(),
			[
				'name' => 'background',
				'selector' => '{{WRAPPER}} > .builder-element-populated',
			]
		);

		$this->add_group_control(
			Group_Control_Border::get_type(),
			[
				'name' => 'border',
				'selector' => '{{WRAPPER}} > .builder-element-populated',
			]
		);

		$this->add_control(
			'border_radius',
			[
				'label' => __( 'Border Radius', 'builder' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'selectors' => [
					'{{WRAPPER}} > .builder-element-populated' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Box_Shadow::get_type(),
			[
				'name' => 'box_shadow',
				'selector' => '{{WRAPPER}} > .builder-element-populated',
			]
		);

		$this->end_controls_section();

		// Section Typography
		$this->start_controls_section(
			'section_typo',
			[
				'label' => __( 'Typography', 'builder' ),
				'type' => Controls_Manager::SECTION,
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'heading_color',
			[
				'label' => __( 'Heading Color', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} .builder-element-populated .builder-heading-title' => 'color: {{VALUE}};',
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
					'{{WRAPPER}} > .builder-element-populated' => 'color: {{VALUE}};',
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
					'{{WRAPPER}} .builder-element-populated a' => 'color: {{VALUE}};',
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
					'{{WRAPPER}} .builder-element-populated a:hover' => 'color: {{VALUE}};',
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
					'{{WRAPPER}} > .builder-element-populated' => 'text-align: {{VALUE}};',
				],
			]
		);

		$this->end_controls_section();

		// Section Advanced
		$this->start_controls_section(
			'section_advanced',
			[
				'label' => __( 'Advanced', 'builder' ),
				'type' => Controls_Manager::SECTION,
				'tab' => Controls_Manager::TAB_ADVANCED,
			]
		);

		$this->add_responsive_control(
			'margin',
			[
				'label' => __( 'Margin', 'builder' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'selectors' => [
					'{{WRAPPER}} > .builder-element-populated' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
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
					'{{WRAPPER}} > .builder-element-populated' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Background::get_type(),
			[
				'name' => '_background',
				'selector' => '{{WRAPPER}} .builder-widget-container',
			]
		);

		$this->add_group_control(
			Group_Control_Animations::get_type(),
			[
				'name' => '_animation',
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

		$this->start_controls_section(
			'section_column_hover',
			[
				'label' => __( 'Column Hover', 'builder' ),
				'type' => Controls_Manager::SECTION,
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'hover_animation',
			[
				'label' => __( 'Animation', 'builder' ),
				'type' => Controls_Manager::HOVER_ANIMATION,
			]
		);

		$this->end_controls_section();

		// Section Responsive
		$this->start_controls_section(
			'section_responsive',
			[
				'label' => __( 'Responsive', 'builder' ),
				'tab' => Controls_Manager::TAB_ADVANCED,
			]
		);

		$responsive_points = [
			'screen_sm' => [
				'title' => __( 'Mobile Width', 'builder' ),
				'class_prefix' => 'builder-sm-',
				'classes' => '',
				'description' => '',
			],
		];

		foreach ( $responsive_points as $point_name => $point_data ) {
			$this->add_control(
				$point_name,
				[
					'label' => $point_data['title'],
					'type' => Controls_Manager::SELECT,
					'default' => 'default',
					'options' => [
						'default' => __( 'Default', 'builder' ),
						'custom' => __( 'Custom', 'builder' ),
					],
					'description' => $point_data['description'],
					'classes' => $point_data['classes'],
				]
			);

			$this->add_control(
				$point_name . '_width',
				[
					'label' => __( 'Column Width', 'builder' ),
					'type' => Controls_Manager::SELECT,
					'options' => [
						'10' => '10%',
						'11' => '11%',
						'12' => '12%',
						'14' => '14%',
						'16' => '16%',
						'20' => '20%',
						'25' => '25%',
						'30' => '30%',
						'33' => '33%',
						'40' => '40%',
						'50' => '50%',
						'60' => '60%',
						'66' => '66%',
						'70' => '70%',
						'75' => '75%',
						'80' => '80%',
						'83' => '83%',
						'90' => '90%',
						'100' => '100%',
					],
					'default' => '100',
					'condition' => [
						$point_name => [ 'custom' ],
					],
					'prefix_class' => $point_data['class_prefix'],
				]
			);
		}

		$this->end_controls_section();
	}

	protected function _render_settings() {
		?>
		<div class="builder-element-overlay">
			<div class="column-title"></div>
			<div class="builder-editor-element-settings builder-editor-column-settings">
				<ul class="builder-editor-element-settings-list builder-editor-column-settings-list">
					<li class="builder-editor-element-setting builder-editor-element-trigger">
						<a title="<?php _e( 'Drag Column', 'builder' ); ?>"><?php _e( 'Column', 'builder' ); ?></a>
					</li>
					<?php foreach ( self::get_edit_tools() as $edit_tool_name => $edit_tool ) : ?>
						<li class="builder-editor-element-setting builder-editor-element-<?php echo $edit_tool_name; ?>">
							<a title="<?php echo $edit_tool['title']; ?>">
								<span class="builder-screen-only"><?php echo $edit_tool['title']; ?></span>
								<i class="fa fa-<?php echo $edit_tool['icon']; ?>"></i>
							</a>
						</li>
					<?php endforeach; ?>
				</ul>
				<ul class="builder-editor-element-settings-list  builder-editor-section-settings-list">
					<li class="builder-editor-element-setting builder-editor-element-trigger">
						<a title="<?php _e( 'Drag Section', 'builder' ); ?>"><?php _e( 'Section', 'builder' ); ?></a>
					</li>
					<?php foreach ( Element_Section::get_edit_tools() as $edit_tool_name => $edit_tool ) : ?>
						<li class="builder-editor-element-setting builder-editor-element-<?php echo $edit_tool_name; ?>">
							<a title="<?php echo $edit_tool['title']; ?>">
								<span class="builder-screen-only"><?php echo $edit_tool['title']; ?></span>
								<i class="fa fa-<?php echo $edit_tool['icon']; ?>"></i>
							</a>
						</li>
					<?php endforeach; ?>
				</ul>
			</div>
		</div>
		<?php
	}

	protected function _content_template() {
		?>
		<div class="builder-column-wrap">
			<div class="builder-widget-wrap"></div>
		</div>
		<?php
	}

	public function before_render() {
		$is_inner = $this->get_data( 'isInner' );

		$column_type = ! empty( $is_inner ) ? 'inner' : 'top';

		$settings = $this->get_settings();

		$this->add_render_attribute( 'wrapper', 'class', [
			'builder-column',
			'builder-element',
			'builder-element-' . $this->get_id(),
			'builder-col-' . $settings['_column_size'],
			'builder-' . $column_type . '-column',
		] );

		foreach ( self::get_class_controls() as $control ) {
			if ( empty( $settings[ $control['name'] ] ) )
				continue;

			if ( ! $this->is_control_visible( $control ) )
				continue;

			$this->add_render_attribute( 'wrapper', 'class', $control['prefix_class'] . $settings[ $control['name'] ] );
		}

		if ( ! empty( $settings['_element_id'] ) ) {
			$this->add_render_attribute( 'wrapper', 'id', trim( $settings['_element_id'] ) );
		}

		if ( ! empty( $settings['_animation_animated'] ) && ! empty( $settings['_animation_in'] ) ) {
			$this->add_render_attribute( 'wrapper', 'class', 'builder-column-animated' );
			$this->add_render_attribute( 'wrapper', 'data-animation-in', $settings['_animation_in'] );
			$this->add_render_attribute( 'wrapper', 'data-animation-out', $settings['_animation_in'] );
			$this->add_render_attribute( 'wrapper', 'data-scroll', '"toggle(.column-animation-in-play, .column-animation-out-play)"' );
		}

		if ( ! empty( $settings['hover_animation'] ) ) {
            $this->add_render_attribute( 'wrapper', 'class', 'builder-hover-animation-' . $settings['hover_animation'] );
        }

		$this->add_render_attribute( 'wrapper', 'data-element_type', $this->get_name() );
		?>
		<div <?php echo $this->get_render_attribute_string( 'wrapper' ); ?>>
			<div class="builder-column-wrap<?php if ( $this->get_children() ) echo ' builder-element-populated'; ?>">
				<div class="builder-widget-wrap">
		<?php
	}

	public function after_render() {
		?>
				</div>
			</div>
		</div>
		<?php
	}

	protected function _get_default_child_type( array $element_data ) {
		if ( 'section' === $element_data['elType'] ) {
			return builder()->elements_manager->get_element_types( 'section' );
		}

		return builder()->widgets_manager->get_widget_types( $element_data['widgetType'] );
	}
}
