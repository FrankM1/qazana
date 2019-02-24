<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Qazana button widget.
 *
 * Qazana widget that displays a button with the ability to control every
 * aspect of the button design.
 *
 * @since 1.0.0
 */
class Widget_Button extends Widget_Base {

	/**
	 * Get widget name.
	 *
	 * Retrieve button widget name.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget name.
	 */
	public function get_name() {
		return 'button';
	}

	/**
	 * Get widget title.
	 *
	 * Retrieve button widget title.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget title.
	 */
	public function get_title() {
		return __( 'Button', 'qazana' );
	}

	/**
	 * Get widget icon.
	 *
	 * Retrieve button widget icon.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget icon.
	 */
	public function get_icon() {
		return 'eicon-button';
	}

	/**
	 * Get widget categories.
	 *
	 * Retrieve the list of categories the button widget belongs to.
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
		return [ 'button', 'link', 'url' ];
    }

	/**
	 * Get button sizes.
	 *
	 * Retrieve an array of button sizes for the button widget.
	 *
	 * @since 1.0.0
	 * @access public
	 * @static
	 *
	 * @return array An array containing button sizes.
	 */
	public static function get_sizes() {
		return [
			'xs' => __( 'Extra Small', 'qazana' ),
			'sm' => __( 'Small', 'qazana' ),
			'md' => __( 'Medium', 'qazana' ),
			'lg' => __( 'Large', 'qazana' ),
			'xl' => __( 'Extra Large', 'qazana' ),
		];
	}

	/**
	 * Register button widget controls.
	 *
	 * Adds different input fields to allow the user to change and customize the widget settings.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	protected function _register_controls() {
		$this->start_controls_section(
			'section_button',
			[
				'label' => __( 'Button', 'qazana' ),
			]
		);

		$this->add_control(
			'type',
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
				'prefix_class' => 'qazana-button-',
			]
		);

		$this->add_control(
            'weight',
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
			'size',
			[
				'label' => __( 'Size', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'sm',
				'options' => self::get_sizes(),
				'style_transfer' => true,
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
					'{{WRAPPER}} .qazana-align-icon-right .qazana-inline-icon' => 'margin-left: {{SIZE}}{{UNIT}};',
					'{{WRAPPER}} .qazana-align-icon-left .qazana-inline-icon' => 'margin-right: {{SIZE}}{{UNIT}};',
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
					'{{WRAPPER}} .qazana-inline-icon i' => 'font-size: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'css_id',
			[
				'label' => __( 'Button ID', 'qazana' ),
				'type' => Controls_Manager::TEXT,
				'default' => '',
				'title' => __( 'Add your custom id WITHOUT the Pound key. e.g: my-id', 'qazana' ),
				'label_block' => false,
				'description' => __( 'Please make sure the ID is unique and not used elsewhere on the page this form is displayed. This field allows <code>A-z 0-9</code> & underscore chars without spaces.', 'qazana' ),
				'separator' => 'before',

			]
		);

		$this->add_control(
			'attributes',
			[
				'label' => __( 'Button Attributes', 'qazana' ),
				'type' => Controls_Manager::TEXTAREA,
				'placeholder' => __( 'key=value', 'qazana' ),
				'description' => sprintf( __( 'Set custom attributes for the button link. Each attribute in a separate line. Separate attribute key from the value using %s character.', 'qazana' ), '<code>=</code>' ),
				'classes' => 'qazana-control-direction-ltr',
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_style',
			[
				'label' => __( 'Button', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'text_color',
			[
				'label' => __( 'Text Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} .qazana-button .qazana-inline-content' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'typography',
				'label' => __( 'Typography', 'qazana' ),
				'scheme' => Scheme_Typography::TYPOGRAPHY_4,
				'selector' => '{{WRAPPER}} .qazana-button .qazana-inline-content',
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
					'{{WRAPPER}} .qazana-button .qazana-inline-content' => 'background-color: {{VALUE}};',
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
				'selector' => '{{WRAPPER}} .qazana-button .qazana-inline-content',
			]
		);

		$this->add_control(
			'border_radius',
			[
				'label' => __( 'Border Radius', 'qazana' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'selectors' => [
					'{{WRAPPER}} .qazana-button .qazana-inline-content' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
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
					'{{WRAPPER}} .qazana-button .qazana-inline-content' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_hover',
			[
				'label' => __( 'Button Hover', 'qazana' ),
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
					'{{WRAPPER}} .qazana-button:hover .qazana-inline-content' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'background_hover_color',
			[
				'label' => __( 'Background Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .qazana-button:hover .qazana-inline-content' => 'background-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'hover_border_color',
			[
				'label' => __( 'Border Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'condition' => [
					'border_border!' => '',
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-button:hover .qazana-inline-content' => 'border-color: {{VALUE}};',
				],
			]
		);

		$this->end_controls_section();
	}

	/**
	 * Render button widget output on the frontend.
	 *
	 * Written in PHP and used to generate the final HTML.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	public function add_button_render_attribute() {
		$settings = $this->get_settings_for_display();

		$this->add_render_attribute( 'wrapper', 'class', 'qazana-button-wrapper qazana-inner-wrapper' );

		if ( ! empty( $settings['link']['url'] ) ) {
			$this->add_render_attribute( 'button', 'href', $settings['link']['url'] );
			$this->add_render_attribute( 'button', 'class', 'qazana-button-link' );

			if ( ! empty( $settings['link']['is_external'] ) ) {
				$this->add_render_attribute( 'button', 'target', '_blank' );
			}

			if ( $settings['link']['nofollow'] ) {
				$this->add_render_attribute( 'button', 'rel', 'nofollow' );
			}
		}

		if ( ! empty( $settings['attributes'] ) ) {
			$attributes = explode( "\n", $settings['attributes'] );
			foreach ( $attributes as $attribute ) {
				if ( ! empty( $attribute ) ) {
					$attr = explode( '=', $attribute, 2 );
					if ( ! isset( $attr[1] ) ) {
						$attr[1] = '';
					}
					$this->add_render_attribute( 'button', trim( $attr[0] ), trim( $attr[1] ) );
				}
			}
		}

		$this->add_render_attribute( 'button', 'class', 'qazana-button' );
		$this->add_render_attribute( 'button', 'role', 'button' );

		if ( ! empty( $settings['css_id'] ) ) {
			$this->add_render_attribute( 'button', 'id', $settings['css_id'] );
		}

        if ( ! empty( $settings['css_class'] ) ) {
			$this->add_render_attribute( 'button', 'class', $settings['css_class'] );
		}

		if ( ! empty( $settings['size'] ) ) {
			$this->add_render_attribute( 'button', 'class', 'qazana-size-' . $settings['size'] );
		}

        if ( ! empty( $settings['weight'] ) ) {
            $this->add_render_attribute( 'button', 'class', 'qazana-weight-' . $settings['weight'] );
        }

        if ( ! empty( $settings['type'] ) ) {
            $this->add_render_attribute( 'button', 'class', 'qazana-button-' . $settings['type'] );
        }

		$this->add_render_attribute( 'button', 'class', 'qazana-align-icon-' . $this->get_responsive_settings('icon_align') );

        $this->add_render_attribute( 'content-wrapper', 'class', 'qazana-inline-content' );
        $this->add_render_attribute( 'button-icon', 'class', 'qazana-inline-icon' );
    }

    /**
	 * Render button widget output on the frontend.
	 *
	 * Written in PHP and used to generate the final HTML.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
    public function render() {
        $this->add_button_render_attribute();

        ?><div <?php $this->render_attribute_string( 'wrapper' ); ?>>
            <a <?php $this->render_attribute_string( 'button' ); ?>>
                <span <?php $this->render_attribute_string( 'content-wrapper' ); ?>>
                    <?php if ( $this->get_settings_for_display('icon') ) : ?>
                        <span <?php $this->render_attribute_string( 'button-icon' ); ?>>
                            <i class="<?php echo esc_attr( $this->get_settings_for_display('icon') ); ?>"></i>
                        </span>
                    <?php endif; ?>
                    <?php if ( $this->get_settings_for_display('text') ) : ?>
                        <span class="qazana-button-text"><?php echo $this->get_settings_for_display('text'); ?></span>
                    <?php endif; ?>
                </span>
            </a>
        </div><?php

    }
	/**
	 * Render button widget output in the editor.
	 *
	 * Written as a Backbone JavaScript template and used to generate the live preview.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	protected function _content_template() {
		?>
		<#
		view.addRenderAttribute( 'text', 'class', 'qazana-button-text' );

		view.addInlineEditingAttributes( 'text', 'none' );
		#>
        <div class="qazana-button-wrapper qazana-inner-wrapper qazana-align-icon-{{ settings.icon_align }}">
            <a id="{{ settings.css_id }}" class="qazana-button qazana-button-{{ settings.type }} qazana-weight-{{ settings.weight }} qazana-size-{{ settings.size }} qazana-hover-animation-{{ settings.hover_animation }}" href="{{ settings.link.url }}" role="button">
                <span class="qazana-inline-content">
                    <# if ( settings.icon ) { #>
                    <span class="qazana-inline-icon">
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
