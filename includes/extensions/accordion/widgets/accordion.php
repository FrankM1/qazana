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
 * Accordion Widget
 */
class Accordion extends Widget_Base {

	/**
	 * Retrieve accordion widget name.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget name.
	 */
	public function get_name() {
		return 'accordion';
	}

	/**
	 * Retrieve accordion widget title.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget title.
	 */
	public function get_title() {
		return __( 'Accordion', 'qazana' );
	}

	/**
	 * Retrieve accordion widget icon.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget icon.
	 */
	public function get_icon() {
		return 'eicon-accordion';
	}

	/**
	 * Retrieve the list of categories the accordion widget belongs to.
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
        $this->add_frontend_stylesheet( 'qazana-extension-' . $this->get_name() );
    }

	/**
	 * Register accordion widget controls.
	 *
	 * Adds different input fields to allow the user to change and customize the widget settings.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	protected function _register_controls() {
		$this->_register_accordion_controls();
		$this->_register_accordion_icons_controls();
		$this->_register_style_controls();
	}
	
	protected function _register_accordion_controls() {
		$this->start_controls_section(
			'section_title',
			[
				'label' => __( 'Accordion', 'qazana' ),
			]
		);

		$this->add_control(
			'tabs',
			[
				'label' => __( 'Accordion Items', 'qazana' ),
				'type' => Controls_Manager::REPEATER,
				'default' => [
					[
						'tab_title' => __( 'Accordion #1', 'qazana' ),
						'tab_content' => __( 'I am item content. Click the edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.', 'qazana' ),
					],
					[
						'tab_title' => __( 'Accordion #2', 'qazana' ),
						'tab_content' => __( 'I am item content. Click the edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.', 'qazana' ),
					],
				],
				'fields' => [
					[
						'name' => 'tab_title',
						'label' => __( 'Title & Content', 'qazana' ),
						'type' => Controls_Manager::TEXT,
						'default' => __( 'Accordion Title' , 'qazana' ),
						'label_block' => true,
					],
					[
						'name' => 'tab_content',
						'label' => __( 'Content', 'qazana' ),
						'type' => Controls_Manager::WYSIWYG,
						'default' => __( 'Accordion Content', 'qazana' ),
						'show_label' => false,
					],
				],
				'title_field' => '{{{ tab_title }}}',
			]
		);

		$this->end_controls_section();

	}

	protected function _register_accordion_icons_controls() {
		$this->start_controls_section(
			'section_icons',
			[
				'label' => __( 'Icon', 'qazana' ),
			]
		);

		$this->add_control(
			'icon_align',
			[
				'label' => __( 'Icon Alignment', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => is_rtl() ? 'right' : 'left',
				'options' => [
					'left' => __( 'Left', 'qazana' ),
					'right' => __( 'Right', 'qazana' ),
				],
			]
		);

		$this->add_control(
			'icon_type',
			[
				'label' => __( 'Icon Type', 'qazana' ),
				'type' => Controls_Manager::CHOOSE,
				'label_block' => false,
				'options' => [
					'image' => [
						'title' => __( 'Image', 'qazana' ),
						'icon' => 'fa fa-picture-o',
					],
					'icon' => [
						'title' => __( 'Icon', 'qazana' ),
						'icon' => 'fa fa-star',
					],
				],
				'default' => 'icon',
			]
		);

		$this->add_control(
			'icon_image',
			[
				'label' => __( 'Choose Image', 'qazana' ),
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
				'label' => __( 'Icon', 'qazana' ),
				'type' => Controls_Manager::ICON,
				'label_block' => true,
				'default' => 'fa fa-file-o',
			]

		);

		$this->end_controls_section();

	}

	protected function _register_style_controls() {

        $this->start_controls_section(
			'section_wrapper_style',
			[
				'label' => __( 'Wrapper', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
        );

        $this->add_group_control(
			Group_Control_Border::get_type(),
			[
				'name' => 'tab_wrapper_border',
				'selector' => '{{WRAPPER}} .qazana-accordion .qazana-accordion-item',
			]
        );
                
		$this->end_controls_section();

		$this->start_controls_section(
			'section_title_style',
			[
				'label' => __( 'Accordion Tab', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_group_control(
			Group_Control_Border::get_type(),
			[
				'name' => 'tab_border',
				'selector' => '{{WRAPPER}} .qazana-accordion .qazana-tab-title',
			]
        );
        
        $this->add_responsive_control(
			'title_padding',
			[
				'label' => __( 'Padding', 'qazana' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors' => [
					'{{WRAPPER}} .qazana-accordion .qazana-tab-title' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

        $this->add_control(
			'title_color',
			[
				'label' => __( 'Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .qazana-accordion .qazana-tab-title' => 'color: {{VALUE}};',
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
				'label' => __( 'Title Background', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .qazana-accordion .qazana-tab-title' => 'background-color: {{VALUE}};',
				],
			]
		);
   
		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'title_typography',
				'selector' => '{{WRAPPER}} .qazana-accordion .qazana-tab-title',
				'scheme' => Scheme_Typography::TYPOGRAPHY_1,
			]
        );

        $this->add_control(
			'heading_tab_active',
			[
				'label' => __( 'Active Tab', 'qazana' ),
				'type' => Controls_Manager::HEADING,
				'separator' => 'before',
			]
		);

		$this->add_control(
			'tab_active_color',
			[
				'label' => __( 'Active Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .qazana-accordion .qazana-tab-title.qazana-active' => 'color: {{VALUE}};',
				],
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_4,
				],
			]
        );
        
		$this->end_controls_section();
        
        $this->start_controls_section(
			'section_content_style',
			[
				'label' => __( 'Accordion Content', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_group_control(
			Group_Control_Border::get_type(),
			[
				'name' => 'content_border',
				'selector' => '{{WRAPPER}} .qazana-accordion .qazana-tab-content',
			]
        );
        
        $this->add_responsive_control(
			'content_padding',
			[
				'label' => __( 'Padding', 'qazana' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors' => [
					'{{WRAPPER}} .qazana-accordion .qazana-tab-content' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

        $this->add_control(
			'content_background_color',
			[
				'label' => __( 'Background', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .qazana-accordion .qazana-tab-content' => 'background-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'content_color',
			[
				'label' => __( 'Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .qazana-accordion .qazana-tab-content' => 'color: {{VALUE}};',
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
				'selector' => '{{WRAPPER}} .qazana-accordion .qazana-tab-content',
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
                $this->add_render_attribute( 'image', 'data-icon', qazana_maybe_ssl_url( $settings['icon_image']['url'] ) );
            }
        }

        if ( $settings['icon_type'] === 'image' ) {
			$output = '<span '. $this->get_render_attribute_string( 'image' ) .'><img src="'. qazana_maybe_ssl_url( $settings['icon_image']['url'] ) .'" /></span>';
		} else {
			$output = '<i '. $this->get_render_attribute_string( 'i' ) .'></i>';
        }
        
		return $output;
        
    }

	/**
	 * Render accordion widget output on the frontend.
	 *
	 * Written in PHP and used to generate the final HTML.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	public function render() {
        $settings = $this->get_settings();

		$id_int = substr( $this->get_id_int(), 0, 3 );
		?>
		<div class="qazana-accordion" role="tablist">
			<?php foreach ( $settings['tabs'] as $index => $item ) :
				$tab_count = $index + 1;

				$tab_content_setting_key = $this->get_repeater_setting_key( 'tab_content', 'tabs', $index );

				$this->add_render_attribute( $tab_content_setting_key, [
					'class'    => [ 'qazana-tab-content', 'qazana-clearfix' ],
					'data-tab' => $tab_count,
					'role'     => 'tabpanel',
				] );

				$this->add_inline_editing_attributes( $tab_content_setting_key, 'advanced' );
				?>
				<div class="qazana-accordion-item">
					<div class="qazana-tab-title" tabindex="<?php echo $id_int . $tab_count; ?>" data-tab="<?php echo $tab_count; ?>" role="tab">
                        <span class="qazana-accordion-icon qazana-accordion-icon-<?php echo $this->get_responsive_settings('icon_align'); ?>">
							<?php echo $this->get_render_icon(); ?>
						</span>
						<span class="qazana-accordion-title-wrapper"><?php echo $item['tab_title']; ?></span>
					</div>
					<div <?php $this->render_attribute_string( $tab_content_setting_key ); ?>><?php echo $this->parse_text_editor( $item['tab_content'] ); ?></div>
				</div>
			<?php endforeach; ?>
		</div>
		<?php
	}

	/**
	 * Render accordion widget output in the editor.
	 *
	 * Written as a Backbone JavaScript template and used to generate the live preview.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	protected function _content_template() {
		?>
		<div class="qazana-accordion" role="tablist">
            <#
			if ( settings.tabs ) {
				var tabindex = view.getIDInt().toString().substr( 0, 3 );

				_.each( settings.tabs, function( item, index ) {
					var tabCount = index + 1,
						tabContentKey = view.getRepeaterSettingKey( 'tab_content', 'tabs', index );

					view.addRenderAttribute( tabContentKey, {
						'class': [ 'qazana-tab-content', 'qazana-clearfix' ],
						'data-tab': tabCount,
						'role': 'tabpanel'
					} );

					view.addInlineEditingAttributes( tabContentKey, 'advanced' );
					#>
					<div class="qazana-accordion-item">
						<div class="qazana-tab-title" tabindex="{{ tabindex + tabCount }}" data-tab="{{ tabCount }}" role="tab">
							<span class="qazana-accordion-icon qazana-accordion-icon-{{ settings.icon_align }}">
                                <i class="{{ settings.icon }}"></i>
							</span>
							<span class="qazana-tab-title-text">{{{ item.tab_title }}}</span>
						</div>
						<div {{ view.getRenderAttributeString( tabContentKey ) }}>{{{ item.tab_content }}}</div>
                    </div>
				<#
				} );
			} #>
		</div>
		<?php
	}
}
