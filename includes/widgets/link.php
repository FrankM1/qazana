<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Qazana link widget.
 *
 * Qazana widget that displays a link with the ability to control every
 * aspect of the link design.
 *
 * @since 1.0.0
 */
class Widget_Link extends Widget_Base {

	/**
	 * Get widget name.
	 *
	 * Retrieve link widget name.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget name.
	 */
	public function get_name() {
		return 'link';
	}

	/**
	 * Get widget title.
	 *
	 * Retrieve link widget title.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget title.
	 */
	public function get_title() {
		return __( 'Link', 'qazana' );
	}

	/**
	 * Get widget icon.
	 *
	 * Retrieve link widget icon.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget icon.
	 */
	public function get_icon() {
		return 'eicon-anchor';
	}

	/**
	 * Get widget categories.
	 *
	 * Retrieve the list of categories the link widget belongs to.
	 *
	 * Used to determine where to display the widget in the editor.
	 *
	 * @since 2.0.0
	 * @access public
	 *
	 * @return array Widget categories.
	 */
	public function get_categories() {
		return [ 'basic' ];
	}

    /**
	 * Retrieve widget keywords.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return array Widget keywords.
	 */
	public function get_keywords() {
		return [ 'link', 'url' ];
    }

	/**
	 * Register link widget controls.
	 *
	 * Adds different input fields to allow the user to change and customize the widget settings.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	protected function _register_controls() {
		$this->start_controls_section(
			'section_link',
			[
				'label' => __( 'Link', 'qazana' ),
			]
		);

		$this->add_control(
			'link_type',
			[
				'label' => __( 'Type', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => '',
				'options' => [
					'' => __( 'Default', 'qazana' ),
					'info' => __( 'Info', 'qazana' ),
					'success' => __( 'Success', 'qazana' ),
					'warning' => __( 'Warning', 'qazana' ),
					'danger' => __( 'Danger', 'qazana' ),
				],
				'prefix_class' => 'qazana-link-',
			]
		);

		$this->add_control(
            'link_weight',
            [
                'label' => __( 'Weight', 'qazana' ),
                'type' => Controls_Manager::SELECT,
                'default' => '',
                'options' => [
                    '' => __( 'Default', 'qazana' ),
                    'transparent' => __( 'Transparent', 'qazana' ),
                    'solid' => __( 'Solid', 'qazana' ),
                ],
            ]
        );

		$this->add_control(
			'text',
			[
				'label' => __( 'Text', 'qazana' ),
				'type' => Controls_Manager::TEXT,
				'dynamic' => [
					'active' => true,
				],
				'default' => __( 'Click here', 'qazana' ),
				'placeholder' => __( 'Click here', 'qazana' ),
			]
		);

		$this->add_control(
			'link',
			[
				'label' => __( 'Link', 'qazana' ),
				'type' => Controls_Manager::URL,
				'dynamic' => [
					'active' => true,
				],
				'placeholder' => __( 'https://your-link.com', 'qazana' ),
				'default' => [
					'url' => '#',
				],
			]
		);

		$this->add_responsive_control(
			'align',
			[
				'label' => __( 'Alignment', 'qazana' ),
				'type' => Controls_Manager::CHOOSE,
				'options' => [
					'left'    => [
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
					'justify' => [
						'title' => __( 'Justified', 'qazana' ),
						'icon' => 'fa fa-align-justify',
					],
				],
				'prefix_class' => 'qazana%s-align-',
				'default' => '',
			]
		);

		$this->add_control(
			'icon',
			[
				'label' => __( 'Icon', 'qazana' ),
				'type' => Controls_Manager::ICON,
				'label_block' => true,
				'default' => '',
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
				'condition' => [
					'icon!' => '',
				],
			]
		);

		$this->add_control(
			'icon_indent',
			[
				'label' => __( 'Icon Spacing', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'max' => 50,
					],
				],
				'condition' => [
					'icon!' => '',
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-link .qazana-align-icon-right' => 'margin-left: {{SIZE}}{{UNIT}};',
					'{{WRAPPER}} .qazana-link .qazana-align-icon-left' => 'margin-right: {{SIZE}}{{UNIT}};',
				],
			]
		);

        $this->add_control(
			'icon_size',
			[
				'label' => __( 'Icon Size', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => 20
				],
                		'range' => [
					'px' => [
						'max' => 50,
					],
				],
				'condition' => [
					'icon!' => '',
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-link-icon i' => 'font-size: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'link_css_id',
			[
				'label' => __( 'Link ID', 'qazana' ),
				'type' => Controls_Manager::TEXT,
				'default' => '',
				'title' => __( 'Add your custom id WITHOUT the Pound key. e.g: my-id', 'qazana' ),
				'label_block' => false,
				'description' => __( 'Please make sure the ID is unique and not used elsewhere on the page this form is displayed. This field allows <code>A-z 0-9</code> & underscore chars without spaces.', 'qazana' ),
				'separator' => 'before',

			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_style',
			[
				'label' => __( 'Link', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'link_text_color',
			[
				'label' => __( 'Text Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} .qazana-link .qazana-link-content-wrapper' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'typography',
				'label' => __( 'Typography', 'qazana' ),
				'scheme' => Scheme_Typography::TYPOGRAPHY_4,
				'selector' => '{{WRAPPER}} .qazana-link .qazana-link-content-wrapper',
			]
		);

		$this->add_control(
			'background_color',
			[
				'label' => __( 'Background Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_4,
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-link .qazana-link-content-wrapper' => 'background-color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Border::get_type(),
			[
				'name' => 'border',
				'label' => __( 'Border', 'qazana' ),
				'placeholder' => '1px',
				'default' => '1px',
				'selector' => '{{WRAPPER}} .qazana-link .qazana-link-content-wrapper',
			]
		);

		$this->add_control(
			'border_radius',
			[
				'label' => __( 'Border Radius', 'qazana' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'selectors' => [
					'{{WRAPPER}} .qazana-link .qazana-link-content-wrapper' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
				'condition' => [
					'border_border!' => ''
				]
			]
		);

		$this->add_control(
			'text_padding',
			[
				'label' => __( 'Text Padding', 'qazana' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'selectors' => [
					'{{WRAPPER}} .qazana-link .qazana-link-content-wrapper' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_hover',
			[
				'label' => __( 'Link Hover', 'qazana' ),
				'type' => Controls_Manager::SECTION,
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'hover_color',
			[
				'label' => __( 'Text Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .qazana-link:hover .qazana-link-content-wrapper' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'link_background_hover_color',
			[
				'label' => __( 'Background Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .qazana-link:hover .qazana-link-content-wrapper' => 'background-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'link_hover_border_color',
			[
				'label' => __( 'Border Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'condition' => [
					'border_border!' => '',
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-link:hover .qazana-link-content-wrapper' => 'border-color: {{VALUE}};',
				],
			]
		);

		$this->end_controls_section();
	}

	/**
	 * Render link widget output on the frontend.
	 *
	 * Written in PHP and used to generate the final HTML.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	public function render() {
		$settings = $this->get_settings_for_display();

		$this->add_render_attribute( 'wrapper', 'class', 'qazana-link-wrapper qazana-inner-wrapper' );

		if ( ! empty( $settings['link']['url'] ) ) {
			$this->add_render_attribute( 'link', 'href', $settings['link']['url'] );
			$this->add_render_attribute( 'link', 'class', 'qazana-link-link' );

			if ( ! empty( $settings['link']['is_external'] ) ) {
				$this->add_render_attribute( 'link', 'target', '_blank' );
			}

			if ( $settings['link']['nofollow'] ) {
				$this->add_render_attribute( 'link', 'rel', 'nofollow' );
			}
		}

		$this->add_render_attribute( 'link', 'class', 'qazana-link' );
		$this->add_render_attribute( 'link', 'role', 'link' );

		if ( ! empty( $settings['link_css_id'] ) ) {
			$this->add_render_attribute( 'link', 'id', $settings['link_css_id'] );
		}

		if ( ! empty( $settings['size'] ) ) {
			$this->add_render_attribute( 'link', 'class', 'qazana-size-' . $settings['size'] );
		}

        if ( ! empty( $settings['link_weight'] ) ) {
            $this->add_render_attribute( 'link', 'class', 'qazana-weight-' . $settings['link_weight'] );
        }

        if ( ! empty( $settings['link_type'] ) ) {
            $this->add_render_attribute( 'link', 'class', 'qazana-link-' . $settings['link_type'] );
        }

        $this->add_render_attribute( 'content-wrapper', 'class', 'qazana-link-content-wrapper' );
        $this->add_render_attribute( 'icon-align', 'class', 'qazana-align-icon-' . $this->get_responsive_settings('icon_align') );
        $this->add_render_attribute( 'icon-align', 'class', 'qazana-link-icon' );

        ?><div <?php $this->render_attribute_string( 'wrapper' ); ?>>
            <a <?php $this->render_attribute_string( 'link' ); ?>>
                <span <?php $this->render_attribute_string( 'content-wrapper' ); ?>>
                    <?php if ( $this->get_settings_for_display('icon') ) : ?>
                        <span <?php $this->render_attribute_string( 'icon-align' ); ?>>
                            <i class="<?php echo esc_attr( $this->get_settings_for_display('icon') ); ?>"></i>
                        </span>
                    <?php endif; ?>
                    <span class="qazana-link-text"><?php echo $settings['text']; ?></span>
                </span>
            </a>
        </div><?php

    }
	/**
	 * Render link widget output in the editor.
	 *
	 * Written as a Backbone JavaScript template and used to generate the live preview.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	protected function _content_template() {
		?>
		<#
		view.addRenderAttribute( 'text', 'class', 'qazana-link-text' );

		view.addInlineEditingAttributes( 'text', 'none' );
		#>
        <div class="qazana-link-wrapper qazana-inner-wrapper">
            <a id="{{ settings.link_css_id }}" class="qazana-link qazana-link-{{ settings.link_type }} qazana-weight-{{ settings.link_weight }} qazana-size-{{ settings.size }} qazana-hover-animation-{{ settings.hover_animation }}" href="{{ settings.link.url }}" role="link">
                <span class="qazana-link-content-wrapper">
                    <# if ( settings.icon ) { #>
                    <span class="qazana-link-icon qazana-align-icon-{{ settings.icon_align }}">
                        <i class="{{ settings.icon }}" aria-hidden="true"></i>
                    </span>
                    <# } #>
                    <span {{{ view.getRenderAttributeString( 'text' ) }}}>{{{ settings.text }}}</span>
                </span>
            </a>
        </div>
        <?php
    }
}
