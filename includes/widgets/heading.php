<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Heading extends Widget_Base {

	public function get_name() {
		return 'heading';
	}

	public function get_title() {
		return __( 'Heading', 'qazana' );
	}

	public function get_icon() {
		return 'eicon-type-tool';
	}

	protected function _register_controls() {
		$this->start_controls_section(
			'section_title',
			[
				'label' => __( 'Title', 'qazana' ),
			]
		);

		$this->add_control(
			'title',
			[
				'label' => __( 'Title', 'qazana' ),
				'type' => Controls_Manager::TEXTAREA,
				'placeholder' => __( 'Enter your title', 'qazana' ),
				'default' => __( 'This is heading element', 'qazana' ),
			]
		);

		$this->add_control(
			'link',
			[
				'label' => __( 'Link', 'qazana' ),
				'type' => Controls_Manager::URL,
				'placeholder' => 'http://your-link.com',
				'default' => [
					'url' => '',
				],
				'separator' => 'before',
			]
		);

		$this->add_responsive_control(
			'size',
			[
				'label' => __( 'Size', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'default',
				'options' => [
					'default' => __( 'Default', 'qazana' ),
					'small' => __( 'Small', 'qazana' ),
					'medium' => __( 'Medium', 'qazana' ),
					'large' => __( 'Large', 'qazana' ),
					'xl' => __( 'XL', 'qazana' ),
					'xxl' => __( 'XXL', 'qazana' ),
				],
			]
		);

		$this->add_control(
			'header_size',
			[
				'label' => __( 'HTML Tag', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'h1' => __( 'H1', 'qazana' ),
					'h2' => __( 'H2', 'qazana' ),
					'h3' => __( 'H3', 'qazana' ),
					'h4' => __( 'H4', 'qazana' ),
					'h5' => __( 'H5', 'qazana' ),
					'h6' => __( 'H6', 'qazana' ),
					'div' => __( 'div', 'qazana' ),
					'span' => __( 'span', 'qazana' ),
					'p' => __( 'p', 'qazana' ),
				],
				'default' => 'h2',
			]
		);

		$this->add_responsive_control(
			'max_width',
			[
				'label' => _x( 'Max width', 'Size Control', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'size_units' => [ '%', 'px', 'em', 'rem' ],
				'range' => [
					'px' => [
                        'min' => 10,
						'max' => 2000,
					],
				],
				'responsive' => true,
				'selectors' => [
					'{{WRAPPER}} .qazana-widget-container .qazana-heading-wrapper' => 'max-width: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_responsive_control(
			'align',
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
				'default' => '',
				'selectors' => [
					'{{WRAPPER}}' => 'text-align: {{VALUE}};',
				],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_title_style',
			[
				'label' => __( 'Title', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'title_color',
			[
				'label' => __( 'Text Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'scheme' => [
				    'type' => Scheme_Color::get_type(),
				    'value' => Scheme_Color::COLOR_1,
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-heading-title' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'typography',
				'scheme' => Scheme_Typography::TYPOGRAPHY_1,
				'selector' => '{{WRAPPER}} .qazana-heading-title',
			]
		);

		$this->end_controls_section();
	}

	protected function render() {
		$settings = $this->get_settings();

		if ( empty( $settings['title'] ) )
			return;

		$this->add_render_attribute( 'heading', 'class', 'qazana-heading-title' );
        $this->add_render_attribute( 'heading-wrapper', 'class', 'qazana-heading-wrapper' );

		if ( ! empty( $settings['size'] ) ) {
			$this->add_render_attribute( 'heading', 'class', 'qazana-size-' . $settings['size'] );
		}

        if ( ! empty( $this->get_responsive_settings('align') ) ) {
			$this->add_render_attribute( 'heading-wrapper', 'class', 'qazana-align-' . $this->get_responsive_settings('align') );
		}

		if ( ! empty( $settings['link']['url'] ) ) {
			$this->add_render_attribute( 'url', 'href', $settings['link']['url'] );

			if ( $settings['link']['is_external'] ) {
				$this->add_render_attribute( 'url', 'target', '_blank' );
			}

			if ( ! empty( $settings['link']['nofollow'] ) ) {
				$this->add_render_attribute( 'url', 'rel', 'nofollow' );
			}

			$settings['title'] = sprintf( '<a %1$s>%2$s</a>', $this->get_render_attribute_string( 'url' ), $settings['title'] );
		}

		$title_html = sprintf( '<%1$s %2$s>%3$s</%1$s>', $settings['header_size'], $this->get_render_attribute_string( 'heading' ), $settings['title'] );

		?><div <?php echo $this->get_render_attribute_string( 'heading-wrapper' ); ?>>
            <?php echo $title_html; ?>
        </div><?php

	}

	protected function _content_template() {
		?>

		<#
		if ( '' !== settings.title ) {
			var title_html = '<' + settings.header_size  + ' class="qazana-heading-title qazana-size-' + settings.size + '">' + settings.title + '</' + settings.header_size + '>';
		}

		if ( '' !== settings.link.url ) {
			var title_html = '<' + settings.header_size  + ' class="qazana-heading-title qazana-size-' + settings.size + '"><a href="' + settings.link.url + '">' + title_html + '</a></' + settings.header_size + '>';
		}

		print( title_html );
        #>
		<?php
	}
}
