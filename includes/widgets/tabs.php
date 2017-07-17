<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Tabs extends Widget_Base {

	public function get_name() {
		return 'tabs';
	}

	public function get_title() {
		return __( 'Tabs', 'qazana' );
	}

	public function get_icon() {
		return 'eicon-tabs';
	}

	public function get_categories() {
		return [ 'general-elements' ];
	}

	protected function _register_controls() {
		$this->start_controls_section(
			'section_tabs',
			[
				'label' => __( 'Tabs', 'qazana' ),
			]
		);

		$this->add_control(
			'tabs',
			[
				'label' => __( 'Tabs Items', 'qazana' ),
				'type' => Controls_Manager::REPEATER,
				'default' => [
					[
						'tab_title' => __( 'Tab #1', 'qazana' ),
						'tab_content' => __( 'I am tab content. Click the edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.', 'qazana' ),
					],
					[
						'tab_title' => __( 'Tab #2', 'qazana' ),
						'tab_content' => __( 'I am tab content. Click the edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.', 'qazana' ),
					],
				],
				'fields' => [
					[
						'name' => 'tab_title',
						'label' => __( 'Title & Content', 'qazana' ),
						'type' => Controls_Manager::TEXT,
						'default' => __( 'Tab Title', 'qazana' ),
						'placeholder' => __( 'Tab Title', 'qazana' ),
						'label_block' => true,
					],
					[
						'name' => 'tab_content',
						'label' => __( 'Content', 'qazana' ),
						'default' => __( 'Tab Content', 'qazana' ),
						'placeholder' => __( 'Tab Content', 'qazana' ),
						'type' => Controls_Manager::WYSIWYG,
						'show_label' => false,
					],
				],
				'title_field' => '{{{ tab_title }}}',
			]
		);

		$this->add_control(
			'view',
			[
				'label' => __( 'View', 'qazana' ),
				'type' => Controls_Manager::HIDDEN,
				'default' => 'traditional',
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_tabs_style',
			[
				'label' => __( 'Tabs Style', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'border_width',
			[
				'label' => __( 'Border Width', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => 1,
				],
				'range' => [
					'px' => [
						'min' => 0,
						'max' => 10,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-tabs .qazana-tabs-wrapper .qazana-tab-title.active > span:before' => 'border-width: {{SIZE}}{{UNIT}};',
					'{{WRAPPER}} .qazana-tabs .qazana-tabs-wrapper .qazana-tab-title.active > span:after' => 'border-width: {{SIZE}}{{UNIT}};',
					'{{WRAPPER}} .qazana-tabs .qazana-tabs-wrapper .qazana-tab-title.active > span' => 'border-width: {{SIZE}}{{UNIT}};',
					'{{WRAPPER}} .qazana-tabs .qazana-tab-content' => 'border-width: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'border_color',
			[
				'label' => __( 'Border Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .qazana-tabs .qazana-tabs-wrapper .qazana-tab-title.active > span:before' => 'border-color: {{VALUE}};',
					'{{WRAPPER}} .qazana-tabs .qazana-tabs-wrapper .qazana-tab-title.active > span:after' => 'border-color: {{VALUE}};',
					'{{WRAPPER}} .qazana-tabs .qazana-tabs-wrapper .qazana-tab-title.active > span' => 'border-color: {{VALUE}};',
					'{{WRAPPER}} .qazana-tabs .qazana-tab-content' => 'border-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'background_color',
			[
				'label' => __( 'Background Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .qazana-tab-title.active' => 'background-color: {{VALUE}};',
					'{{WRAPPER}} .qazana-tabs .qazana-tab-content' => 'background-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'tab_color',
			[
				'label' => __( 'Title Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .qazana-tab-title' => 'color: {{VALUE}};',
				],
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_1,
				],
				'separator' => 'before',
			]
		);

		$this->add_control(
			'tab_active_color',
			[
				'label' => __( 'Active Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .qazana-tabs .qazana-tabs-wrapper .qazana-tab-title.active' => 'color: {{VALUE}};',
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
				'name' => 'tab_typography',
				'selector' => '{{WRAPPER}} .qazana-tab-title > span',
				'scheme' => Scheme_Typography::TYPOGRAPHY_1,
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_tabs_content',
			[
				'label' => __( 'Tabs Content', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'content_color',
			[
				'label' => __( 'Text Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .qazana-tab-content *' => 'color: {{VALUE}};',
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
				'selector' => '{{WRAPPER}} .qazana-tab-content',
				'scheme' => Scheme_Typography::TYPOGRAPHY_3,
			]
		);

		$this->end_controls_section();
	}

	protected function render() {
		$tabs = $this->get_settings( 'tabs' );
		?>
		<div class="qazana-tabs">
			<?php
			$counter = 1; ?>
			<div class="qazana-tabs-wrapper">
				<?php foreach ( $tabs as $item ) : ?>
					<div class="qazana-tab-title" data-tab="<?php echo $counter; ?>"><span><?php echo $item['tab_title']; ?></span></div>
				<?php
					$counter++;
				endforeach; ?>
			</div>

			<?php
			$counter = 1; ?>
			<div class="qazana-tabs-content-wrapper">
				<?php foreach ( $tabs as $item ) : ?>
					<div class="qazana-tab-content qazana-clearfix" data-tab="<?php echo $counter; ?>"><?php echo $this->parse_text_editor( $item['tab_content'] ); ?></div>
				<?php
					$counter++;
				endforeach; ?>
			</div>
		</div>
		<?php
	}

	protected function _content_template() {
		?>
		<div class="qazana-tabs" data-active-tab="{{ editSettings.activeItemIndex ? editSettings.activeItemIndex : 0 }}">
			<#
			if ( settings.tabs ) {
				var counter = 1; #>
				<div class="qazana-tabs-wrapper">
					<#
					_.each( settings.tabs, function( item ) { #>
						<div class="qazana-tab-title" data-tab="{{ counter }}"><span>{{{ item.tab_title }}}</span></div>
					<#
						counter++;
					} ); #>
				</div>

				<# counter = 1; #>
				<div class="qazana-tabs-content-wrapper">
					<#
					_.each( settings.tabs, function( item ) { #>
						<div class="qazana-tab-content qazana-clearfix qazana-repeater-item-{{ item._id }}" data-tab="{{ counter }}">{{{ item.tab_content }}}</div>
					<#
					counter++;
					} ); #>
				</div>
			<# } #>
		</div>
		<?php
	}
}
