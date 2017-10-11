<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Link extends Widget_Base {

	public function get_name() {
		return 'link';
	}

	public function get_title() {
		return __( 'Link', 'qazana' );
	}

	public function get_icon() {
		return 'eicon-anchor';
	}

	public function get_categories() {
		return [ 'general-elements' ];
	}

	protected function _register_controls() {
		$this->start_controls_section(
			'section_link',
			[
				'label' => __( 'Link', 'qazana' ),
			]
		);

		$this->add_control(
			'link',
			[
				'label' => __( 'Link', 'qazana' ),
				'type' => Controls_Manager::URL,
				'placeholder' => 'http://your-link.com',
				'default' => [
					'url' => '#',
				],
			]
		);

		$this->add_control(
			'link_text',
			[
				'label' => __( 'Text', 'qazana' ),
				'type' => Controls_Manager::TEXT,
				'default' => __( 'Click me', 'qazana' ),
				'placeholder' => __( 'Click me', 'qazana' ),
			]
		);

		$this->add_responsive_control(
			'link_align',
			[
				'label' => __( 'Alignment', 'qazana' ),
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
					'justify' => [
						'title' => __( 'Justified', 'qazana' ),
						'icon' => 'fa fa-align-justify',
					],
				],
				'prefix_class' => 'qazana-align-',
				'render_type' => 'template',
			]
		);

		$this->add_control(
			'link_classes',
			[
				'label' => __( 'Link Classes', 'qazana' ),
				'type' => Controls_Manager::TEXT,
				'default' => '',
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_icon',
			[
				'label' => __( 'Icon', 'qazana' ),
			]
		);

		$this->add_control(
            'link_icon',
            [
                'label' => __( 'Icon', 'qazana' ),
                'type' => Controls_Manager::ICON,
                'label_block' => true,
                'default' => '',
            ]
        );

		$this->add_control(
			'link_click_animate',
			[
				'label' => __( 'Click Animation', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'default' => 'yes',
				'label_on' => __( 'Yes', 'qazana' ),
				'label_off' => __( 'No', 'qazana' ),
				'prefix_class' => 'qazana-link-click-animated-',
				'description' => __( 'Show animation on click.', 'qazana' ),
			]
		);

        $this->add_control(
			'link_icon_hover_reveal',
			[
				'label' => __( 'Reveal Icon on Hover', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'default' => 'yes',
				'label_on' => __( 'Yes', 'qazana' ),
				'label_off' => __( 'No', 'qazana' ),
				'prefix_class' => 'qazana-icon-hover-reveal-',
				'description' => __( 'Reveal the icon when you hover on the link.', 'qazana' ),
			]
		);

        $this->add_control(
            'link_icon_align',
            [
                'label' => __( 'Icon Position', 'qazana' ),
                'type' => Controls_Manager::SELECT,
                'default' => 'left',
                'options' => [
                    'left' => __( 'Before', 'qazana' ),
                    'right' => __( 'After', 'qazana' ),
                ],
                'condition' => [
                    'link_icon!' => '',
                    'link_text!' => '',
                ],
            ]
        );

        $this->add_responsive_control(
            'link_icon_indent',
            [
                'label' => __( 'Icon Spacing', 'qazana' ),
                'type' => Controls_Manager::SLIDER,
                'range' => [
                    'px' => [
                        'max' => 50,
                    ],
                ],
                'condition' => [
                    'link_icon!' => '',
                ],
                'selectors' => [
                    '{{WRAPPER}} .qazana-link.qazana-align-icon-right .qazana-link-icon' => 'margin-left: {{SIZE}}{{UNIT}};',
                    '{{WRAPPER}} .qazana-link .qazana-align-icon-left .qazana-link-icon' => 'margin-right: {{SIZE}}{{UNIT}};',
                    '{{WRAPPER}} .qazana-icon-hover-reveal-yes .qazana-link:hover .qazana-link.qazana-align-icon-right .qazana-link-icon' => 'margin-left: {{SIZE}}{{UNIT}};',
                    '{{WRAPPER}} .qazana-icon-hover-reveal-yes .qazana-link:hover .qazana-link.qazana-align-icon-left .qazana-link-icon' => 'margin-right: {{SIZE}}{{UNIT}};',
                ],
            ]
        );

        $this->add_responsive_control(
			'link_icon_size',
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
					'link_icon!' => '',
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-link-icon i' => 'font-size: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_style',
			[
				'label' => __( 'Style', 'qazana' ),
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
					'{{WRAPPER}} .qazana-link' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'typography',
				'label' => __( 'Typography', 'qazana' ),
				'scheme' => Scheme_Typography::TYPOGRAPHY_4,
				'selector' => '{{WRAPPER}} .qazana-link',
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_hover',
			[
				'label' => __( 'Hover', 'qazana' ),
				'type' => Controls_Manager::SECTION,
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'link_hover_color',
			[
				'label' => __( 'Text Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .qazana-link:hover' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'link_background_hover_color',
			[
				'label' => __( 'Background Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'selectors' => [
					'{{WRAPPER}} .qazana-link:hover' => 'background-color: {{VALUE}};',
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
					'{{WRAPPER}} .qazana-link:hover' => 'border-color: {{VALUE}};',
				],
			]
		);

		$this->end_controls_section();

	}

	public function render() {

		$settings = $this->get_settings();

		if ( ! empty( $settings['link']['url'] ) ) {
			$this->add_render_attribute( 'link', 'href', $settings['link']['url'] );
			$this->add_render_attribute( 'link', 'class', 'qazana-link' );

			if ( ! empty( $settings['link']['is_external'] ) ) {
				$this->add_render_attribute( 'link', 'target', '_blank' );
			}

			if ( $settings['link']['nofollow'] ) {
				$this->add_render_attribute( 'link', 'rel', 'nofollow' );
			}


			if ( $settings['link_classes'] ) {
				$this->add_render_attribute( 'link', 'class', $settings['link_classes'] );
			}

		}

		$this->add_render_attribute( 'link', 'class', 'qazana-align-icon-' . $this->get_settings('link_icon_align') );
        $this->add_render_attribute( 'icon-align', 'class', 'qazana-link-icon' );

		?>
		<a <?php echo $this->get_render_attribute_string( 'link' ); ?>>
			<span class="qazana-link-wrapper">
				<?php if ( $this->get_settings('link_icon') ) : ?>
					<span <?php echo $this->get_render_attribute_string( 'icon-align' ); ?>>
						<i class="<?php echo esc_attr( $this->get_settings('link_icon') ); ?>"></i>
					</span>
				<?php endif; ?>
				<span class="qazana-text"><?php echo esc_html( $settings['link_text'] ); ?></span>
			</span>
		</a>
		<?php
	}

	protected function _content_template() {
		?>
		<a class="qazana-link {{ settings.link_classes }} qazana-align-icon-{{ settings.link_icon_align }}" href="#">
			<span class="qazana-link-wrapper">
				<# if ( settings.link_icon ) { #>
					<span class="qazana-button-icon qazana-link-icon">
						<i class="{{ settings.link_icon }}"></i>
					</span>
				<# } #>
				<span class="qazana-text">{{ settings.link_text }}</span>
			</span>
		</a>
		<?php
	}
}
