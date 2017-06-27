<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Element_Section_Tabs extends Element_Base {

	protected static $_edit_tools;

	protected static function get_default_edit_tools() {
		return [
			'duplicate' => [
				'title' => __( 'Duplicate', 'qazana' ),
				'icon' => 'files-o',
			],
			'add' => [
				'title' => __( 'Add', 'qazana' ),
				'icon' => 'plus',
			],
			'remove' => [
				'title' => __( 'Remove', 'qazana' ),
				'icon' => 'times',
			],
		];
	}

	public function get_name() {
		return 'section_tabs';
	}

	public function get_title() {
		return __( 'Section Tab Wrapper', 'qazana' );
	}

	public function get_icon() {
		return 'eicon-tabs';
	}

	protected function _register_controls() {
		$this->start_controls_section(
			'section_style',
			[
				'label' => __( 'Background & Border', 'qazana' ),
				'type' => Controls_Manager::SECTION,
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_group_control(
			Group_Control_Background::get_type(),
			[
				'name' => 'background',
				'selector' => '{{WRAPPER}} > .qazana-element-populated',
			]
		);

		$this->add_group_control(
			Group_Control_Border::get_type(),
			[
				'name' => 'border',
				'selector' => '{{WRAPPER}} > .qazana-element-populated',
			]
		);

		$this->add_control(
			'border_radius',
			[
				'label' => __( 'Border Radius', 'qazana' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'selectors' => [
					'{{WRAPPER}} > .qazana-element-populated' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Box_Shadow::get_type(),
			[
				'name' => 'box_shadow',
				'selector' => '{{WRAPPER}} > .qazana-element-populated',
			]
		);

		$this->end_controls_section();

		// Section Typography
		$this->start_controls_section(
			'section_typo',
			[
				'label' => __( 'Typography', 'qazana' ),
				'type' => Controls_Manager::SECTION,
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'heading_color',
			[
				'label' => __( 'Heading Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} .qazana-element-populated .qazana-heading-title' => 'color: {{VALUE}};',
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
					'{{WRAPPER}} > .qazana-element-populated' => 'color: {{VALUE}};',
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
					'{{WRAPPER}} .qazana-element-populated a' => 'color: {{VALUE}};',
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
					'{{WRAPPER}} .qazana-element-populated a:hover' => 'color: {{VALUE}};',
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
					'{{WRAPPER}} > .qazana-element-populated' => 'text-align: {{VALUE}};',
				],
			]
		);

		$this->end_controls_section();

		// Section Advanced
		$this->start_controls_section(
			'section_advanced',
			[
				'label' => __( 'Advanced', 'qazana' ),
				'type' => Controls_Manager::SECTION,
				'tab' => Controls_Manager::TAB_ADVANCED,
			]
		);

		$this->add_responsive_control(
			'margin',
			[
				'label' => __( 'Margin', 'qazana' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'selectors' => [
					'{{WRAPPER}} > .qazana-element-populated' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
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
					'{{WRAPPER}} > .qazana-element-populated' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
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
			'section_responsive',
			[
				'label' => __( 'Responsive', 'qazana' ),
				'tab' => Controls_Manager::TAB_ADVANCED,
			]
		);

		$responsive_points = [
			'screen_sm' => [
				'title' => __( 'Mobile Width', 'qazana' ),
				'class_prefix' => 'qazana-sm-',
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
						'default' => __( 'Default', 'qazana' ),
						'custom' => __( 'Custom', 'qazana' ),
					],
					'description' => $point_data['description'],
					'classes' => $point_data['classes'],
				]
			);

			$this->add_control(
				$point_name . '_width',
				[
					'label' => __( 'Column Width', 'qazana' ),
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
		<div class="qazana-element-overlay">
			<div class="column-title"></div>
			<div class="qazana-editor-element-settings qazana-editor-section-tabs-settings">
				<ul class="qazana-editor-element-settings-list qazana-editor-section-tabs-settings-list">
					<li class="qazana-editor-element-setting qazana-editor-element-trigger">
						<a title="<?php _e( 'Drag Tabs', 'qazana' ); ?>"><?php _e( 'Section tabs', 'qazana' ); ?></a>
					</li>
					<?php foreach ( self::get_edit_tools() as $edit_tool_name => $edit_tool ) : ?>
						<li class="qazana-editor-element-setting qazana-editor-element-<?php echo $edit_tool_name; ?>">
							<a title="<?php echo $edit_tool['title']; ?>">
								<span class="qazana-screen-only"><?php echo $edit_tool['title']; ?></span>
								<i class="fa fa-<?php echo $edit_tool['icon']; ?>"></i>
							</a>
						</li>
					<?php endforeach; ?>
				</ul>
				<ul class="qazana-editor-element-settings-list  qazana-editor-section-settings-list">
					<li class="qazana-editor-element-setting qazana-editor-element-trigger">
						<a title="<?php _e( 'Drag Section', 'qazana' ); ?>"><?php _e( 'Section', 'qazana' ); ?></a>
					</li>
					<?php foreach ( Element_Section::get_edit_tools() as $edit_tool_name => $edit_tool ) : ?>
						<li class="qazana-editor-element-setting qazana-editor-element-<?php echo $edit_tool_name; ?>">
							<a title="<?php echo $edit_tool['title']; ?>">
								<span class="qazana-screen-only"><?php echo $edit_tool['title']; ?></span>
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
		<div class="qazana-section-tabs-wrap">
			<div class="qazana-widget-wrap"></div>
		</div>
		<?php
	}

	public function before_render() {
		$is_inner = $this->get_data( 'isInner' );

		$section_tabs_type = ! empty( $is_inner ) ? 'inner' : 'top';

		$settings = $this->get_settings();

		$this->add_render_attribute( 'wrapper', 'class', [
			'qazana-section-tabs',
			'qazana-element',
			'qazana-element-' . $this->get_id(),
			'qazana-col-' . $settings['_section_tabs_size'],
			'qazana-' . $section_tabs_type . '-section-tabs',
		] );

		foreach ( self::get_class_controls() as $control ) {
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
		?>
		<div <?php echo $this->get_render_attribute_string( 'wrapper' ); ?>>
			<div class="qazana-section-tabs-wrap<?php if ( $this->get_children() ) echo ' qazana-element-populated'; ?>">
				<div class="qazana-widget-wrap">
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
			return qazana()->elements_manager->get_element_types( 'section' );
		}

		return qazana()->widgets_manager->get_widget_types( $element_data['widgetType'] );
	}
}
