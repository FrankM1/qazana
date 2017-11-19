<?php
namespace Qazana\Extensions\Widgets;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

use Qazana\Controls_Manager;
use Qazana\Utils;
use Qazana\Widget_Base as Widget_Base;
use Qazana\Group_Control_Border;
use Qazana\Scheme_Color;
use Qazana\Group_Control_Typography;
use Qazana\Scheme_Typography;

/**
 * Tabs Widget
 */
class Tabs extends Widget_Base {

    /**
	 * Retrieve tabs widget name.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget name.
	 */
	public function get_name() {
		return 'tabs';
	}

    /**
	 * Retrieve tabs widget title.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget title.
	 */
	public function get_title() {
		return __( 'Tabs', 'qazana' );
	}

    /**
	 * Retrieve tabs widget icon.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget icon.
	 */
	public function get_icon() {
		return 'eicon-tabs';
	}

    /**
	 * Retrieve the list of categories the tabs widget belongs to.
	 *
	 * Used to determine where to display the widget in the editor.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return array Widget categories.
	 */
	public function get_categories() {
		return [ 'general-elements' ];
    }
    
    /**
	 * Retrieve the scripts and stylesheets needed by this widget.
	 *
	 * Used to add scripts only when needed.
	 *
	 * @since 1.0.0
	 * @access public
	 */
    public function add_element_dependencies() {
        $this->add_frontend_stylesheet( 'qazana-extension-tabs' );
    }

    /**
	 * Register tabs widget controls.
	 *
	 * Adds different input fields to allow the user to change and customize the widget settings.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	protected function _register_controls() {
		$this->start_controls_section(
			'section_tabs',
			[
				'label' => __( 'Tabs', 'qazana' ),
			]
		);

		$this->add_control(
			'type',
			[
				'label' => __( 'Type', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'horizontal',
				'options' => [
					'horizontal' => __( 'Horizontal', 'qazana' ),
					'vertical' => __( 'Vertical', 'qazana' ),
				],
				'prefix_class' => 'qazana-tabs-view-',
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

		$this->end_controls_section();

		$this->start_controls_section(
			'section_tabs_style',
			[
				'label' => __( 'Tabs', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'navigation_width',
			[
				'label' => __( 'Navigation Width', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'unit' => '%',
				],
				'range' => [
					'%' => [
						'min' => 10,
						'max' => 50,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-tabs-wrapper' => 'width: {{SIZE}}{{UNIT}}',
				],
				'condition' => [
					'type' => 'vertical',
				],
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
					'{{WRAPPER}} .qazana-tab-title, {{WRAPPER}} .qazana-tab-title:before, {{WRAPPER}} .qazana-tab-title:after, {{WRAPPER}} .qazana-tab-content, {{WRAPPER}} .qazana-tabs-content-wrapper' => 'border-width: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'border_color',
			[
				'label' => __( 'Border Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .qazana-tab-mobile-title, {{WRAPPER}} .qazana-tab-desktop-title.active, {{WRAPPER}} .qazana-tab-title:before, {{WRAPPER}} .qazana-tab-title:after, {{WRAPPER}} .qazana-tab-content, {{WRAPPER}} .qazana-tabs-content-wrapper' => 'border-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'background_color',
			[
				'label' => __( 'Background Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .qazana-tab-desktop-title.active' => 'background-color: {{VALUE}};',
					'{{WRAPPER}} .qazana-tabs-content-wrapper' => 'background-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'heading_title',
			[
				'label' => __( 'Title', 'qazana' ),
				'type' => Controls_Manager::HEADING,
				'separator' => 'before',
			]
		);

		$this->add_control(
			'tab_color',
			[
				'label' => __( 'Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .qazana-tab-title' => 'color: {{VALUE}};',
				],
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_1,
				],
			]
		);

		$this->add_control(
			'tab_active_color',
			[
				'label' => __( 'Active Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .qazana-tab-title.active' => 'color: {{VALUE}};',
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
				'selector' => '{{WRAPPER}} .qazana-tab-title',
				'scheme' => Scheme_Typography::TYPOGRAPHY_1,
			]
		);

		$this->add_control(
			'heading_content',
			[
				'label' => __( 'Content', 'qazana' ),
				'type' => Controls_Manager::HEADING,
				'separator' => 'before',
			]
		);

		$this->add_control(
			'content_color',
			[
				'label' => __( 'Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .qazana-tab-content' => 'color: {{VALUE}};',
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

    /**
	 * Render tabs widget output on the frontend.
	 *
	 * Written in PHP and used to generate the final HTML.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	public function render() {
		$tabs = $this->get_settings( 'tabs' );
		?>
		<div class="qazana-tabs" role="tablist">
			<?php $counter = 1; ?>
			<div class="qazana-tabs-wrapper" role="tab">
				<?php foreach ( $tabs as $item ) : ?>
					<div class="qazana-tab-title qazana-tab-desktop-title" data-tab="<?php echo $counter; ?>"><span><?php echo $item['tab_title']; ?></span></div>
				<?php
					$counter++;
				endforeach;
				?>
			</div>

			<?php $counter = 1; ?>
			<div class="qazana-tabs-content-wrapper" role="tabpanel">
				<?php foreach ( $tabs as $item ) : ?>
					<div class="qazana-tab-title qazana-tab-mobile-title" data-tab="<?php echo $counter; ?>"><span><?php echo $item['tab_title']; ?></span></div>
					<div class="qazana-tab-content qazana-clearfix" data-tab="<?php echo $counter; ?>"><?php echo $this->parse_text_editor( $item['tab_content'] ); ?></div>
				<?php
					$counter++;
				endforeach;
				?>
			</div>
		</div>
		<?php
	}

    /**
	 * Render tabs widget output in the editor.
	 *
	 * Written as a Backbone JavaScript template and used to generate the live preview.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	protected function _content_template() {
		?>
		<div class="qazana-tabs" data-active-tab="{{ editSettings.activeItemIndex ? editSettings.activeItemIndex : 0 }}" role="tablist">
			<#
			if ( settings.tabs ) {
				var counter = 1; #>
				<div class="qazana-tabs-wrapper" role="tab">
					<#
					_.each( settings.tabs, function( item ) { #>
						<div class="qazana-tab-title qazana-tab-desktop-title" data-tab="{{ counter }}"><span>{{{ item.tab_title }}}</span></div>
					<#
						counter++;
					} ); #>
				</div>

				<# counter = 1; #>
				<div class="qazana-tabs-content-wrapper" role="tabpanel">
					<#
					_.each( settings.tabs, function( item ) { #>
						<div class="qazana-tab-title qazana-tab-mobile-title" data-tab="{{ counter }}"><span>{{{ item.tab_title }}}</span></div>
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
