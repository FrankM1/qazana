<?php
namespace Builder;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Accordion extends Widget_Base {

	public function get_name() {
		return 'accordion';
	}

	public function get_title() {
		return __( 'Accordion', 'builder' );
	}

	public function get_icon() {
		return 'eicon-accordion';
	}

	public function get_categories() {
		return [ 'general-elements' ];
	}
	protected function _register_controls() {
		$this->_register_accordion_controls();
		$this->_register_accordion_icons_controls();
		$this->_register_style_controls();
	}

	protected function _register_accordion_controls() {
		$this->start_controls_section(
			'section_title',
			[
				'label' => __( 'Accordion', 'builder' ),
			]
		);

		$this->add_control(
			'tabs',
			[
				'label' => __( 'Accordion Items', 'builder' ),
				'type' => Controls_Manager::REPEATER,
				'default' => [
					[
						'tab_title' => __( 'Accordion #1', 'builder' ),
						'tab_content' => __( 'I am item content. Click the edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.', 'builder' ),
					],
					[
						'tab_title' => __( 'Accordion #2', 'builder' ),
						'tab_content' => __( 'I am item content. Click the edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.', 'builder' ),
					],
				],
				'fields' => [
					[
						'name' => 'tab_title',
						'label' => __( 'Title & Content', 'builder' ),
						'type' => Controls_Manager::TEXT,
						'default' => __( 'Accordion Title' , 'builder' ),
						'label_block' => true,
					],
					[
						'name' => 'tab_content',
						'label' => __( 'Content', 'builder' ),
						'type' => Controls_Manager::WYSIWYG,
						'default' => __( 'Accordion Content', 'builder' ),
						'show_label' => false,
					],
				],
				'title_field' => '{{{ tab_title }}}',
			]
		);

		$this->add_control(
			'view',
			[
				'label' => __( 'View', 'builder' ),
				'type' => Controls_Manager::HIDDEN,
				'default' => 'traditional',
			]
		);

		$this->end_controls_section();

	}

	protected function _register_accordion_icons_controls() {
		$this->start_controls_section(
			'section_icons',
			[
				'label' => __( 'Icon', 'builder' ),
			]
		);

		$this->add_control(
			'icon_align',
			[
				'label' => __( 'Icon Alignment', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'default' => is_rtl() ? 'right' : 'left',
				'options' => [
					'left' => __( 'Left', 'builder' ),
					'right' => __( 'Right', 'builder' ),
				],
			]
		);

		$this->add_control(
			'icon_type',
			[
				'label' => __( 'Icon type', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'icon',
				'options' => [
					'icon' => __( 'Icon', 'builder' ),
					'image' => __( 'Image File', 'builder' ),
				],
			]
		);

		$this->add_control(
			'icon_image',
			[
				'label' => __( 'Choose Image', 'builder' ),
				'type' => Controls_Manager::MEDIA,
				'condition' => [
					'icon_type' => 'image',
				],
				'default' => [
					'url' => Utils::get_placeholder_image_src(),
				],
			]
		);

		$this->add_control(
			'icon',
			[
				'label' => __( 'Icon', 'builder' ),
				'type' => Controls_Manager::ICON,
				'label_block' => true,
				'default' => 'fa fa-file-o',
			]

		);

		$this->end_controls_section();

	}

	protected function _register_style_controls() {

		$this->start_controls_section(
			'section_title_style',
			[
				'label' => __( 'Accordion', 'builder' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'tab_tab_heading',
			[
				'label' => __( 'Tab Border', 'builder' ),
				'type' => Controls_Manager::HEADING,
			]
		);

		$this->add_control(
			'tab_border_type',
			[
				'label' => _x( 'Border Type', 'Border Control', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'' => __( 'None', 'builder' ),
					'solid' => _x( 'Solid', 'Border Control', 'builder' ),
					'double' => _x( 'Double', 'Border Control', 'builder' ),
					'dotted' => _x( 'Dotted', 'Border Control', 'builder' ),
					'dashed' => _x( 'Dashed', 'Border Control', 'builder' ),
				],
				'selectors' => [
					'{{WRAPPER}} .builder-accordion .builder-accordion-title' => 'border-style: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'tab_border_width',
			[
				'label' => _x( 'Width', 'Border Control', 'builder' ),
				'type' => Controls_Manager::DIMENSIONS,
				'selectors' => [
					'{{WRAPPER}} .builder-accordion .builder-accordion-title' => 'border-width: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'tab_border_color',
			[
				'label' => __( 'Border Color', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .builder-accordion .builder-accordion-title' => 'border-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'content_tab_heading',
			[
				'label' => __( 'Content Border', 'builder' ),
				'type' => Controls_Manager::HEADING,
			]
		);

		$this->add_control(
			'content_border_type',
			[
				'label' => _x( 'Border Type', 'Border Control', 'builder' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'' => __( 'None', 'builder' ),
					'solid' => _x( 'Solid', 'Border Control', 'builder' ),
					'double' => _x( 'Double', 'Border Control', 'builder' ),
					'dotted' => _x( 'Dotted', 'Border Control', 'builder' ),
					'dashed' => _x( 'Dashed', 'Border Control', 'builder' ),
				],
				'selectors' => [
					'{{WRAPPER}} .builder-accordion .builder-accordion-item' => 'border-style: {{VALUE}};',
				],
				'separator' => 'before',
			]
		);

		$this->add_control(
			'content_border_width',
			[
				'label' => _x( 'Width', 'Border Control', 'builder' ),
				'type' => Controls_Manager::DIMENSIONS,
				'selectors' => [
					'{{WRAPPER}} .builder-accordion .builder-accordion-item' => 'border-width: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'content_border_color',
			[
				'label' => __( 'Border Color', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .builder-accordion .builder-accordion-item' => 'border-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'title_color',
			[
				'label' => __( 'Title Color', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .builder-accordion .builder-accordion-title' => 'color: {{VALUE}};',
				],
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_1,
				],
				'separator' => 'before',
			]
		);

		$this->add_control(
			'title_background',
			[
				'label' => __( 'Title Background', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .builder-accordion .builder-accordion-title' => 'background-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'tab_active_color',
			[
				'label' => __( 'Active Color', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .builder-accordion .builder-accordion-title.active' => 'color: {{VALUE}};',
				],
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_4,
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'label' => __( 'Title Typography', 'builder' ),
				'name' => 'title_typography',
				'selector' => '{{WRAPPER}} .builder-accordion .builder-accordion-title',
				'scheme' => Scheme_Typography::TYPOGRAPHY_1,
			]
		);

		$this->add_control(
			'content_background_color',
			[
				'label' => __( 'Content Background', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .builder-accordion .builder-accordion-content' => 'background-color: {{VALUE}};',
				],
				'separator' => 'before',
			]
		);

		$this->add_control(
			'content_color',
			[
				'label' => __( 'Content Color', 'builder' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .builder-accordion .builder-accordion-content' => 'color: {{VALUE}};',
				],
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_3,
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'content_typography',
				'label' => __( 'Content Typography', 'builder' ),
				'selector' => '{{WRAPPER}} .builder-accordion .builder-accordion-content',
				'scheme' => Scheme_Typography::TYPOGRAPHY_3,
			]
		);

		$this->end_controls_section();
	}

	protected function get_render_icon() {

		$settings = $this->get_settings();

		if ( ! empty( $settings['icon'] ) ) {
			$this->add_render_attribute( 'i', 'class', $settings['icon'] );
		}

		if ( $settings['icon_type'] === 'image' ) {

			$filetype = wp_check_filetype( $settings['icon_image']['url'] );

			if ( $filetype['ext'] === 'svg' ) {
				$this->add_render_attribute( 'image', 'class', 'svg-icon-holder svg-baseline' );
				$this->add_render_attribute( 'image', 'data-animation-speed', $settings['animation_speed'] );
				$this->add_render_attribute( 'image', 'data-size', $settings['icon_size']['size'] );
				$this->add_render_attribute( 'image', 'data-animation-delay', $settings['animation_delay'] );
				$this->add_render_attribute( 'image', 'data-color', $settings['icon_color'] );
				$this->add_render_attribute( 'image', 'data-icon', builder_maybe_ssl_url( $settings['icon_image']['url'] ) );
			}
		}

		if ( $settings['icon_type'] === 'image' ) {
			$output = '<span '. $this->get_render_attribute_string( 'image' ) .'><img src="'. builder_maybe_ssl_url( $settings['icon_image']['url'] ) .'" /></span>';
		} else {
			$output = '<i '. $this->get_render_attribute_string( 'i' ) .'></i>';
		}

		return $output;
	}

	protected function render() {
		$settings = $this->get_settings();
		?>
		<div class="builder-accordion">
			<?php
			$counter = 1; ?>
			<?php foreach ( $settings['tabs'] as $item ) : ?>
				<div class="builder-accordion-item">
					<div class="builder-accordion-title" data-section="<?php echo $counter; ?>">
						<span class="builder-accordion-icon builder-accordion-icon-<?php echo $settings['icon_align']; ?>">
							<?php echo $this->get_render_icon(); ?>
						</span>
						<?php echo $item['tab_title']; ?>
					</div>
					<div class="builder-accordion-content builder-clearfix" data-section="<?php echo $counter; ?>"><?php echo $this->parse_text_editor( $item['tab_content'] ); ?></div>
				</div>
			<?php
				$counter++;
			endforeach; ?>
		</div>
		<?php
	}

	protected function _content_template() {
		?>
		<div class="builder-accordion" data-active-section="{{ editSettings.activeItemIndex ? editSettings.activeItemIndex : 0 }}">
			<#
			if ( settings.tabs ) {
				var counter = 1;
				_.each( settings.tabs, function( item ) { #>
					<div class="builder-accordion-item">
						<div class="builder-accordion-title" data-section="{{ counter }}">
							<span class="builder-accordion-icon builder-accordion-icon-{{ settings.icon_align }}">
								<i class="{{ settings.icon }}"></i>
							</span>
							{{{ item.tab_title }}}
						</div>
						<div class="builder-accordion-content builder-clearfix" data-section="{{ counter }}">{{{ item.tab_content }}}</div>
					</div>
				<#
					counter++;
				} );
			} #>
		</div>
		<?php
	}
}
