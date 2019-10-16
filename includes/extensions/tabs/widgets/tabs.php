<?php
namespace Qazana\Extensions\Widgets;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

use Qazana\Controls_Manager;
use Qazana\Utils;
use Qazana\Widget_Base;
use Qazana\Group_Control_Border;
use Qazana\Scheme_Color;
use Qazana\Group_Control_Typography;
use Qazana\Scheme_Typography;
use Qazana\Repeater;

/**
 * Qazana tabs widget.
 *
 * Qazana widget that displays vertical or horizontal tabs with different
 * pieces of content.
 *
 * @since 1.0.0
 */
class Tabs extends Widget_Base {

	/**
	 * Get widget name.
	 *
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
	 * Get widget title.
	 *
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
	 * Get widget icon.
	 *
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
		return [ 'general' ];
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
	 * Get widget keywords.
	 *
	 * Retrieve the list of keywords the widget belongs to.
	 *
	 * @since 2.1.0
	 * @access public
	 *
	 * @return array Widget keywords.
	 */
	public function get_keywords() {
		return [ 'tabs', 'accordion', 'toggle' ];
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

        $repeater = new Repeater();

        $repeater->add_control(
			'tab_icon',
			[
				'label' => __( 'Icon', 'qazana' ),
				'type' => Controls_Manager::ICON,
			]
		);

		$repeater->add_control(
			'tab_title',
			[
				'label' => __( 'Title & Description', 'qazana' ),
				'type' => Controls_Manager::TEXT,
				'default' => __( 'Tab Title', 'qazana' ),
				'placeholder' => __( 'Tab Title', 'qazana' ),
				'label_block' => true,
			]
		);

		$repeater->add_control(
			'tab_content',
			[
				'label' => __( 'Content', 'qazana' ),
				'default' => __( 'Tab Content', 'qazana' ),
				'placeholder' => __( 'Tab Content', 'qazana' ),
				'type' => Controls_Manager::WYSIWYG,
				'show_label' => false,
			]
		);

		$this->add_control(
			'tabs',
			[
				'label' => __( 'Tabs Items', 'qazana' ),
				'type' => Controls_Manager::REPEATER,
				'fields' => $repeater->get_controls(),
				'default' => [
					[
                        'tab_icon' => 'fa fa-picture',
						'tab_title' => __( 'Tab #1', 'qazana' ),
                        'tab_content' => __( 'Click edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.', 'qazana' ),
					],
					[
                        'tab_icon' => 'fa fa-picture',
						'tab_title' => __( 'Tab #2', 'qazana' ),
						'tab_content' => __( 'Click edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.', 'qazana' ),
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
				'separator' => 'before',
			]
        );

        $this->add_control(
			'icon_align',
			[
				'label' => __( 'Icon Position', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'left',
				'options' => [
					'left' => __( 'Before', 'qazana' ),
					'right' => __( 'After', 'qazana' ),
				],
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
					'{{WRAPPER}} .qazana-tab-title' => 'border-width: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'border_color',
			[
				'label' => __( 'Border Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .qazana-tab-mobile-title, {{WRAPPER}} .qazana-tab-desktop-title.qazana-active' => 'border-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'background_color',
			[
				'label' => __( 'Background Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .qazana-tab-desktop-title.qazana-active' => 'background-color: {{VALUE}};'
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
					'{{WRAPPER}} .qazana-tab-title.qazana-active' => 'color: {{VALUE}};',
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
		$tabs = $this->get_settings_for_display( 'tabs' );

		$id_int = substr( $this->get_id_int(), 0, 3 );
		?>
		<div class="qazana-tabs" role="tablist">
			<div class="qazana-tabs-wrapper">
				<?php
				foreach ( $tabs as $index => $item ) :
					$tab_count = $index + 1;

					$tab_title_setting_key = $this->get_repeater_setting_key( 'tab_title', 'tabs', $index );
					$tab_icon_setting_key = $this->get_repeater_setting_key( 'tab_icon', 'tabs', $index );
					$tab_inline_content_setting_key = $this->get_repeater_setting_key( 'tab_inline_content', 'tabs', $index );

					$this->add_render_attribute( $tab_title_setting_key, [
						'id' => 'qazana-tab-title-' . $id_int . $tab_count,
						'class' => [ 'qazana-tab-title', 'qazana-tab-desktop-title' ],
						'data-tab' => $tab_count,
						'role' => 'tab',
						'aria-controls' => 'qazana-tab-content-' . $id_int . $tab_count,
                    ] );

                    $this->add_render_attribute( $tab_icon_setting_key, [
						'class' => [ 'qazana-inline-icon', 'qazana-tab-title-icon' ],
                    ] );

                    $this->add_render_attribute( $tab_inline_content_setting_key, [
                        'href' => '#!',
						'class' => [ 'qazana-inline-content', 'qazana-inline-content-' . $this->get_settings( 'icon_align' ) ]
                    ] );

					?>
                    <div <?php echo $this->get_render_attribute_string( $tab_title_setting_key ); ?>>
                        <a <?php $this->render_attribute_string( $tab_inline_content_setting_key ); ?>>
                            <?php if ( $item['tab_icon'] ) : ?>
                                <span <?php $this->render_attribute_string( $tab_icon_setting_key ); ?>>
                                    <i class="<?php echo esc_attr( $item['tab_icon'] ); ?>"></i>
                                </span>
                            <?php endif; ?>
                            <span class="qazana-tab-title-text"><?php echo $item['tab_title']; ?></span>
                        </a>
                    </div>
				<?php endforeach; ?>
			</div>
			<div class="qazana-tabs-content-wrapper">
				<?php
				foreach ( $tabs as $index => $item ) :
					$tab_count = $index + 1;

					$tab_content_setting_key = $this->get_repeater_setting_key( 'tab_content', 'tabs', $index );

					$tab_title_mobile_setting_key = $this->get_repeater_setting_key( 'tab_title_mobile', 'tabs', $tab_count );

					$this->add_render_attribute( $tab_content_setting_key, [
						'id' => 'qazana-tab-content-' . $id_int . $tab_count,
						'class' => [ 'qazana-tab-content', 'qazana-clearfix' ],
						'data-tab' => $tab_count,
						'role' => 'tabpanel',
						'aria-labelledby' => 'qazana-tab-title-' . $id_int . $tab_count,
					] );

					$this->add_render_attribute( $tab_title_mobile_setting_key, [
						'class' => [ 'qazana-tab-title', 'qazana-tab-mobile-title' ],
						'data-tab' => $tab_count,
						'role' => 'tab',
					] );

					$this->add_inline_editing_attributes( $tab_content_setting_key, 'advanced' );
					?>
					<div <?php echo $this->get_render_attribute_string( $tab_title_mobile_setting_key ); ?>><?php echo $item['tab_title']; ?></div>
					<div <?php echo $this->get_render_attribute_string( $tab_content_setting_key ); ?>><?php echo $this->parse_text_editor( $item['tab_content'] ); ?></div>
				<?php endforeach; ?>
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
		<div class="qazana-tabs" role="tablist">
			<#
			if ( settings.tabs ) {
				var tabindex = view.getIDInt().toString().substr( 0, 3 );
				#>
				<div class="qazana-tabs-wrapper">
					<#
					_.each( settings.tabs, function( item, index ) {
						var tabCount = index + 1;
						#>
						<div id="qazana-tab-title-{{ tabindex + tabCount }}" class="qazana-tab-title qazana-tab-desktop-title" data-tab="{{ tabCount }}" role="tab" aria-controls="qazana-tab-content-{{ tabindex + tabCount }}"><a href="">{{{ item.tab_title }}}</a></div>
					<# } ); #>
				</div>
				<div class="qazana-tabs-content-wrapper">
					<#
					_.each( settings.tabs, function( item, index ) {
						var tabCount = index + 1,
							tabContentKey = view.getRepeaterSettingKey( 'tab_content', 'tabs',index );

						view.addRenderAttribute( tabContentKey, {
							'id': 'qazana-tab-content-' + tabindex + tabCount,
							'class': [ 'qazana-tab-content', 'qazana-clearfix', 'qazana-repeater-item-' + item._id ],
							'data-tab': tabCount,
							'role' : 'tabpanel',
							'aria-labelledby' : 'qazana-tab-title-' + tabindex + tabCount
						} );

						view.addInlineEditingAttributes( tabContentKey, 'advanced' );
						#>
						<div class="qazana-tab-title qazana-tab-mobile-title" data-tab="{{ tabCount }}" role="tab">{{{ item.tab_title }}}</div>
						<div {{{ view.getRenderAttributeString( tabContentKey ) }}}>{{{ item.tab_content }}}</div>
					<# } ); #>
				</div>
			<# } #>
		</div>
		<?php
	}
}
