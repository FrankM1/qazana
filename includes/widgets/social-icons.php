<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Qazana social icons widget.
 *
 * Qazana widget that displays icons to social pages like Facebook and Twitter.
 *
 * @since 1.0.0
 */
class Widget_Social_Icons extends Widget_Base {

	/**
	 * Get widget name.
	 *
	 * Retrieve social icons widget name.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget name.
	 */
	public function get_name() {
		return 'social-icons';
	}

	/**
	 * Get widget title.
	 *
	 * Retrieve social icons widget title.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget title.
	 */
	public function get_title() {
		return __( 'Social Icons', 'qazana' );
	}

	/**
	 * Get widget icon.
	 *
	 * Retrieve social icons widget icon.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget icon.
	 */
	public function get_icon() {
		return 'eicon-social-icons';
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
		return [ 'social', 'share', 'icon' ];
    }

	/**
	 * Register social icons widget controls.
	 *
	 * Adds different input fields to allow the user to change and customize the widget settings.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	protected function _register_controls() {
		$this->start_controls_section(
			'section_social_icon',
			[
				'label' => __( 'Social Icons', 'qazana' ),
			]
		);

		$this->add_control(
			'social_icon_list',
			[
				'label' => __( 'Social Icons', 'qazana' ),
				'type' => Controls_Manager::REPEATER,
				'default' => [
					[
						'heading' => __( 'Facebook', 'qazana' ),
						'social' => 'fa fa-facebook',
					],
					[
						'heading' => __( 'Twitter', 'qazana' ),
						'social' => 'fa fa-twitter',
					],
					[
						'heading' => __( 'Google Plus', 'qazana' ),
						'social' => 'fa fa-google-plus',
					],
				],
				'fields' => [
					[
						'name' => 'heading',
						'label' => __( 'Heading', 'qazana' ),
						'type' => Controls_Manager::TEXT,
						'label_block' => true,
						'placeholder' => __( 'Social account name', 'qazana' ),
					],
					[
						'name' => 'social',
						'label' => __( 'Icon', 'qazana' ),
						'type' => Controls_Manager::ICON,
						'label_block' => true,
						'default' => 'fa fa-wordpress',
						'include' => [
							'fa fa-android',
							'fa fa-apple',
							'fa fa-behance',
							'fa fa-bitbucket',
							'fa fa-codepen',
							'fa fa-delicious',
							'fa fa-digg',
							'fa fa-dribbble',
							'fa fa-envelope',
							'fa fa-facebook',
							'fa fa-flickr',
							'fa fa-foursquare',
							'fa fa-github',
							'fa fa-google-plus',
							'fa fa-houzz',
							'fa fa-instagram',
							'fa fa-jsfiddle',
							'fa fa-linkedin',
							'fa fa-medium',
							'fa fa-odnoklassniki',
							'fa fa-meetup',
							'fa fa-pinterest',
							'fa fa-product-hunt',
							'fa fa-reddit',
							'fa fa-rss',
							'fa fa-shopping-cart',
							'fa fa-skype',
							'fa fa-slideshare',
							'fa fa-snapchat',
							'fa fa-soundcloud',
							'fa fa-spotify',
							'fa fa-stack-overflow',
							'fa fa-steam',
							'fa fa-stumbleupon',
							'fa fa-telegram',
							'fa fa-thumb-tack',
							'fa fa-tripadvisor',
							'fa fa-tumblr',
							'fa fa-twitch',
							'fa fa-twitter',
							'fa fa-vimeo',
							'fa fa-vk',
							'fa fa-weibo',
							'fa fa-weixin',
							'fa fa-whatsapp',
							'fa fa-wordpress',
							'fa fa-xing',
							'fa fa-yelp',
							'fa fa-youtube',
							'fa fa-500px',
						],
					],
					[
						'name' => 'link',
						'label' => __( 'Link', 'qazana' ),
						'type' => Controls_Manager::URL,
						'label_block' => true,
						'default' => [
							'is_external' => 'true',
						],
						'placeholder' => __( 'https://your-link.com', 'qazana' ),
					],
				],
				'title_field' => '{{{ heading }}}',
			]
		);

		$this->add_control(
			'shape',
			[
				'label' => __( 'Shape', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'rounded',
				'options' => [
					'rounded' => __( 'Rounded', 'qazana' ),
					'square' => __( 'Square', 'qazana' ),
					'circle' => __( 'Circle', 'qazana' ),
				],
				'prefix_class' => 'qazana-shape-',
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
				'default' => 'center',
				'selectors' => [
					'{{WRAPPER}}' => 'text-align: {{VALUE}};',
				],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_social_style',
			[
				'label' => __( 'Icon', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->start_controls_tabs( 'tabs_icon_styles' );

		$this->start_controls_tab(
			"tab_default_styles",
			[
				'label' => __( 'Default', 'qazana' ),
			]
		);

		$this->add_control(
			'icon_color',
			[
				'label' => __( 'Color', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'default',
				'options' => [
					'default' => __( 'Official Color', 'qazana' ),
					'transparent' => __( 'Official Color - Transparent', 'qazana' ),
					'custom' => __( 'Custom', 'qazana' ),
				],
			]
		);

		$this->add_control(
			'icon_primary_color',
			[
				'label' => __( 'Background Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'condition' => [
					'icon_color' => 'custom',
				],
				'selectors' => [
                    '{{WRAPPER}} .qazana-social-icon:not(:hover)' => 'background-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'icon_secondary_color',
			[
				'label' => __( 'Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'condition' => [
					'icon_color' => 'custom',
				],
				'selectors' => [
                    '{{WRAPPER}} .qazana-social-icon:not(:hover)' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_responsive_control(
			'icon_size',
			[
				'label' => __( 'Size', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'min' => 6,
						'max' => 300,
					],
				],
				'size_units' => [ 'px', 'em', 'rem' ],
				'selectors' => [
					'{{WRAPPER}} .qazana-social-icon' => 'font-size: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_responsive_control(
			'icon_padding',
			[
				'label' => __( 'Padding', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'selectors' => [
					'{{WRAPPER}} .qazana-social-icon' => 'padding: {{SIZE}}{{UNIT}};',
				],
				'default' => [
					'unit' => 'em',
				],
				'tablet_default' => [
					'unit' => 'em',
				],
				'mobile_default' => [
					'unit' => 'em',
				],
				'range' => [
					'em' => [
						'min' => 0,
						'max' => 5,
					],
				],
				'size_units' => [ 'px', 'em', 'rem' ],
			]
		);

		$icon_spacing = is_rtl() ? 'margin-left: {{SIZE}}{{UNIT}};' : 'margin-right: {{SIZE}}{{UNIT}};';

		$this->add_responsive_control(
			'icon_spacing',
			[
				'label' => __( 'Spacing', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'min' => 0,
						'max' => 100,
					],
				],
				'size_units' => [ 'px', 'em', 'rem' ],
				'selectors' => [
					'{{WRAPPER}} .qazana-social-icon:not(:last-child)' => $icon_spacing,
				],
			]
		);

		$this->add_group_control(
			Group_Control_Border::get_type(),
			[
				'name' => 'border',
				'selector' => '{{WRAPPER}} .qazana-social-icon',
				'separator' => 'before',
			]
		);

		$this->add_control(
			'border_radius',
			[
				'label' => __( 'Border Radius', 'qazana' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%' ],
				'selectors' => [
					'{{WRAPPER}} .qazana-icon' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
		);

		$this->end_controls_tab();

		$this->start_controls_tab(
			"tab_hover_style",
			[
				'label' => __( 'Hover', 'qazana' ),
			]
		);

		$this->add_control(
			'hover_primary_color',
			[
				'label' => __( 'Background Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} .qazana-social-icon:hover' => 'background-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'hover_secondary_color',
			[
				'label' => __( 'Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} .qazana-social-icon:hover i' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'hover_border_color',
			[
				'label' => __( 'Border Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'condition' => [
					'border_border!' => '',
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-social-icon:hover' => 'border-color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Hover_Animations::get_type(),
			[
				'name' => 'hover_animation',
			]
		);

		$this->end_controls_tab();

		$this->end_controls_tabs();

		$this->end_controls_section();

	}

	/**
	 * Render social icons widget output on the frontend.
	 *
	 * Written in PHP and used to generate the final HTML.
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function render() {
		$settings = $this->get_settings_for_display();

		$class_animation = '';
		if ( ! empty( $settings['hover_animation_type'] ) ) {
			$class_animation = ' qazana-animation-' . $settings['hover_animation_type'];
		}

		?>
		<div class="qazana-social-icons-wrapper qazana-social-icons-<?php echo $this->get_settings_for_display('icon_color'); ?> qazana-social-icons-align-<?php echo $this->get_settings_for_display('align'); ?>">
			<?php foreach ( $this->get_settings_for_display( 'social_icon_list' ) as $index => $item ) :

				$social = preg_replace('/^[^-]*-\s*/', '', $item['social']);
				$social = str_replace( ' ', '-', $social );

                $link_key = 'link_' . $index;

                if ( ! empty( $item['link']['url'] ) ) {
                    $this->add_render_attribute( $link_key, 'href', $item['link']['url'] );

                    if ( $item['link']['is_external'] ) {
                        $this->add_render_attribute( $link_key, 'target', '_blank' );
                    }

                    if ( $item['link']['nofollow'] ) {
                        $this->add_render_attribute( $link_key, 'rel', 'nofollow' );
                    }
                }
				?>
				<a class="qazana-social-icon qazana-social-icon-<?php echo $social . $class_animation; ?>" <?php $this->render_attribute_string( $link_key ); ?>>
					<span class="qazana-screen-only"><?php echo ucwords( $social ); ?></span>
					<i class="<?php echo $item['social']; ?>"></i>
				</a>
			<?php endforeach; ?>
		</div>
		<?php
	}

	/**
	 * Render social icons widget output in the editor.
	 *
	 * Written as a Backbone JavaScript template and used to generate the live preview.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	protected function _content_template() {
        ?>
		<div class="qazana-social-icons-wrapper qazana-social-icons-{{ settings.icon_color }} qazana-social-icons-align-{{ settings.align }}">
			<# _.each( settings.social_icon_list, function( item ) {
				var link = item.link ? item.link.url : '',
                    social = item.social.replace( 'fa fa-', '' );
 				#>
				<a class="qazana-icon qazana-social-icon qazana-social-icon-{{ social }} qazana-animation-{{ settings.hover_animation }}" href="{{ link }}">
					<span class="qazana-screen-only">{{{ social }}}</span>
					<i class="{{ item.social }}"></i>
				</a>
			<# } ); #>
		</div>
		<?php
	}
}
