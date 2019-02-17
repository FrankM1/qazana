<?php
namespace Qazana\Extensions\Widgets;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

use Qazana\Controls_Manager;
use Qazana\Scheme_Typography;
use Qazana\Scheme_Color;
use Qazana\Group_Control_Typography;

use Qazana\Widget_Base as Widget_Base;

class Piechart extends Widget_Base {

	public function get_name() {
		return 'piechart';
	}

	public function get_title() {
		return __( 'Pie chart', 'qazana' );
	}

	public function get_icon() {
		return 'eicon-circle-circle';
	}

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
        $this->add_frontend_script('jquery-circle-progress');
        $this->add_frontend_stylesheet( 'qazana-extension-' . $this->get_name() );
    }

	protected function _register_controls() {
		$this->start_controls_section(
			'section_piechart',
			[
				'label' => __( 'Circle', 'qazana' ),
			]
		);

		$this->add_control(
			'animation_type',
			[
				'label' => __( 'Animation Type', 'qazana' ),
				'type' => Controls_Manager::CHOOSE,
				'options' => [
					'' => [
						'title' => __( 'Default', 'qazana' ),
					],
					'none' => [
						'title' => __( 'No Animation', 'qazana' ),
					],
				],
                'prefix_class' => 'qazana-piechart-animation-type-',
                'frontend_available' => true
			]
        );

        $this->add_control(
			'position',
			[
				'label' => __( 'Circle Position', 'qazana' ),
				'type' => Controls_Manager::CHOOSE,
				'default' => 'top',
				'options' => [
					'left' => [
						'title_text' => __( 'Left', 'qazana' ),
						'icon' => 'fa fa-align-left',
					],
					'top' => [
						'title_text' => __( 'Top', 'qazana' ),
						'icon' => 'fa fa-align-center',
					],
					'right' => [
						'title_text' => __( 'Right', 'qazana' ),
						'icon' => 'fa fa-align-right',
					],
				],
				'prefix_class' => 'qazana-position-',
				'toggle' => false,
			]
        );

		$this->add_control(
			'circleclock',
			[
				'label' => __( 'Reverse Animation', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'prefix_class' => 'qazana-piechart-clockwise-',
			]
		);

		$this->add_control(
			'starting_number',
			[
				'label' => __( 'Starting Number', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'min' => 10,
						'max' => 100,
					],
				],
				'default' => [
					'size' => 0
                ],
                'frontend_available' => true
			]
		);

		$this->add_control(
			'ending_number',
			[
				'label' => __( 'Ending Number', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'min' => 10,
						'max' => 100,
					],
				],
				'default' => [
					'size' => 75
                ],
                'frontend_available' => true
			]
        );

        $this->add_control(
			'duration',
			[
				'label' => __( 'Animation Duration', 'qazana' ),
				'type' => Controls_Manager::NUMBER,
				'default' => 1700,
				'min' => 100,
                'step' => 100,
                'frontend_available' => true
			]
		);

        $this->end_controls_section();

        $this->start_controls_section(
			'section_secondary',
			[
				'label' => __( 'Prefix & Suffix', 'qazana' ),
			]
        );

		$this->add_control(
			'prefix',
			[
				'label' => __( 'Number Prefix', 'qazana' ),
				'type' => Controls_Manager::TEXT,
				'default' => '',
				'placeholder' => 1,
			]
		);

		$this->add_control(
			'suffix',
			[
				'label' => __( 'Number Suffix', 'qazana' ),
				'type' => Controls_Manager::TEXT,
				'default' => '%',
				'placeholder' => __( 'Plus', 'qazana' ),
			]
		);

        $this->end_controls_section();

        $this->start_controls_section(
			'section_content',
			[
				'label' => __( 'Content', 'qazana' ),
			]
        );

		$this->add_control(
			'title_size',
			[
				'label' => __( 'Title HTML Tag', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'options' => [
					'h1' => 'H1',
					'h2' => 'H2',
					'h3' => 'H3',
					'h4' => 'H4',
					'h5' => 'H5',
					'h6' => 'H6',
					'div' => 'div',
					'span' => 'span',
					'p' => 'p',
				],
				'default' => 'h3',
			]
        );

		$this->add_control(
			'title_text',
			[
				'label' => __( 'Title', 'qazana' ),
				'type' => Controls_Manager::TEXT,
				'label_block' => true,
				'default' => __( 'Cool Number Title', 'qazana' ),
				'placeholder' => __( 'Cool Number Title', 'qazana' ),
			]
		);

		$this->add_control(
			'description_text',
			[
				'label' => __( 'Description', 'qazana' ),
				'type' => Controls_Manager::TEXT,
				'label_block' => true,
				'default' => __( 'Cool number description', 'qazana' ),
				'placeholder' => __( 'Cool number description', 'qazana' ),
			]
        );

        $this->add_control(
			'link',
			[
				'label' => __( 'Link to', 'qazana' ),
				'type' => Controls_Manager::URL,
				'dynamic' => [
					'active' => true,
				],
				'placeholder' => __( 'https://your-link.com', 'qazana' ),
				'separator' => 'before',
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_style_circle',
			[
				'label' => __( 'Circle', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

        $this->add_responsive_control(
			'circle_space',
			[
				'label' => __( 'Circle Box Spacing', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'default' => [
					'size' => 15,
				],
				'range' => [
					'px' => [
						'min' => 0,
						'max' => 100,
					],
				],
				'selectors' => [
					'{{WRAPPER}}.qazana-position-right .qazana-circle-number' => 'margin-left: {{SIZE}}{{UNIT}};',
					'{{WRAPPER}}.qazana-position-left .qazana-circle-number' => 'margin-right: {{SIZE}}{{UNIT}};',
					'{{WRAPPER}}.qazana-position-top .qazana-circle-number' => 'margin-bottom: {{SIZE}}{{UNIT}};',
					'(mobile){{WRAPPER}} .qazana-circle-number' => 'margin-bottom: {{SIZE}}{{UNIT}};',
				],
			]
        );

		$this->add_control(
			'circle_start_color',
			[
				'label' => __( 'Start Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
                'default' => 'green',
                'frontend_available' => true
			]
		);

		$this->add_control(
			'circle_end_color',
			[
				'label' => __( 'End Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
                'default' => 'blue',
                'frontend_available' => true
			]
		);

		$this->add_control(
			'circle_size',
			[
				'label' => __( 'Circle Size', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'force_render' => true,
				'range' => [
					'px' => [
						'min' => 10,
						'max' => 450, // There is a bug with larger values. Circle goes out of sync with border
					],
				],
				'default' => [
					'size' => 160
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-piechart-number' => 'width: {{SIZE}}{{UNIT}}; height: {{SIZE}}{{UNIT}}; line-height: {{SIZE}}{{UNIT}};',
                ],
                'frontend_available' => true
			]
		);

		$this->add_control(
			'circle_width',
			[
				'label' => __( 'Circle Width', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'min' => 0,
						'max' => 50,
					],
				],
				'default' => [
					'size' => 5
				],
                'frontend_available' => true
			]
		);

		$this->add_control(
			'circle_border_width',
			[
				'label' => __( 'Circle Border Width', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'min' => 0,
						'max' => 20,
					],
				],
				'default' => [
					'size' => 1
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-piechart-number:before' => 'border-width: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'circle_border_color',
			[
				'label' => __( 'Border Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} .qazana-piechart-number:before' => 'border-color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'number_spacing',
			[
				'label' => __( 'Spacing', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'min' => 0,
						'max' => 100,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-piechart-number' => 'margin-bottom: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_style_content',
			[
				'label' => __( 'Content', 'qazana' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_responsive_control(
			'text_align',
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
				'selectors' => [
					'{{WRAPPER}} .qazana-piechart' => 'text-align: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'content_vertical_alignment',
			[
				'label' => __( 'Vertical Alignment', 'qazana' ),
				'type'        => Controls_Manager::CHOOSE,
				'options'     => [
					'top' => [
						'title' => __( 'Top', 'qazana' ),
						'icon'  => 'eicon-v-align-top',
					],
					'middle' => [
						'title' => __( 'Middle', 'qazana' ),
						'icon'  => 'eicon-v-align-middle',
					],
					'bottom' => [
						'title' => __( 'Bottom', 'qazana' ),
						'icon'  => 'eicon-v-align-bottom',
					],
				],
				'default' => 'top',
				'prefix_class' => 'qazana-vertical-align-',
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

		$this->add_responsive_control(
			'title_bottom_space',
			[
				'label' => __( 'Spacing', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'min' => 0,
						'max' => 100,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-piechart-title' => 'margin-bottom: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->add_control(
			'title_color',
			[
				'label' => __( 'Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} .qazana-piechart-content .qazana-piechart-title' => 'color: {{VALUE}};',
				],
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_1,
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'title_typography',
				'selector' => '{{WRAPPER}} .qazana-piechart-content .qazana-piechart-title',
				'scheme' => Scheme_Typography::TYPOGRAPHY_1,
			]
		);

		$this->add_control(
			'heading_description',
			[
				'label' => __( 'Description', 'qazana' ),
				'type' => Controls_Manager::HEADING,
				'separator' => 'before',
			]
		);

		$this->add_control(
			'description_color',
			[
				'label' => __( 'Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'default' => '',
				'selectors' => [
					'{{WRAPPER}} .qazana-piechart-content .qazana-piechart-description' => 'color: {{VALUE}};',
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
				'name' => 'description_typography',
				'selector' => '{{WRAPPER}} .qazana-piechart-content .qazana-piechart-description',
				'scheme' => Scheme_Typography::TYPOGRAPHY_3,
			]
		);

        $this->end_controls_section();

		$this->start_controls_section(
			'section_style_prefix',
			[
				'label' => __( 'Prefix Style', 'qazana' ),
                'tab' => Controls_Manager::TAB_STYLE,
                'condition' => [
					'prefix!' => '',
				],
			]
		);

        $this->add_control(
			'prefix_vertical_alignment',
			[
				'label' => __( 'Vertical Alignment', 'qazana' ),
				'type'        => Controls_Manager::CHOOSE,
				'options'     => [
					'top' => [
						'title' => __( 'Top', 'qazana' ),
						'icon'  => 'eicon-v-align-top',
					],
					'middle' => [
						'title' => __( 'Middle', 'qazana' ),
						'icon'  => 'eicon-v-align-middle',
					],
					'bottom' => [
						'title' => __( 'Bottom', 'qazana' ),
						'icon'  => 'eicon-v-align-bottom',
					],
				],
                'default' => 'middle',
                'selectors' => [
					'{{WRAPPER}} .qazana-piechart-number-prefix' => 'align-self: {{VALUE}}',
                ],
                'selectors_dictionary' => [
					'top'    => 'flex-start',
					'middle' => 'center',
					'bottom' => 'flex-end',
				],
			]
        );

		$this->add_control(
			'prefix_color',
			[
				'label' => __( 'Prefix Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_3,
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-piechart-number-prefix' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'typography_prefix',
				'scheme' => Scheme_Typography::TYPOGRAPHY_2,
				'selector' => '{{WRAPPER}} .qazana-piechart-number-prefix',
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_style_suffix',
			[
				'label' => __( 'Suffix Style', 'qazana' ),
                'tab' => Controls_Manager::TAB_STYLE,
                'condition' => [
					'suffix!' => '',
				],
			]
        );

        $this->add_control(
			'suffix_vertical_alignment',
			[
				'label' => __( 'Vertical Alignment', 'qazana' ),
				'type'        => Controls_Manager::CHOOSE,
				'options'     => [
					'top' => [
						'title' => __( 'Top', 'qazana' ),
						'icon'  => 'eicon-v-align-top',
					],
					'middle' => [
						'title' => __( 'Middle', 'qazana' ),
						'icon'  => 'eicon-v-align-middle',
					],
					'bottom' => [
						'title' => __( 'Bottom', 'qazana' ),
						'icon'  => 'eicon-v-align-bottom',
					],
				],
                'default' => 'middle',
                'selectors' => [
					'{{WRAPPER}} .qazana-piechart-number-suffix' => 'align-self: {{VALUE}}',
                ],
                'selectors_dictionary' => [
					'top'    => 'flex-start',
					'middle' => 'center',
					'bottom' => 'flex-end',
				],
			]
        );

		$this->add_control(
			'suffix_color',
			[
				'label' => __( 'Suffix Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_3,
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-piechart-number-suffix' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'typography_suffix',
				'scheme' => Scheme_Typography::TYPOGRAPHY_2,
				'selector' => '{{WRAPPER}} .qazana-piechart-number-suffix',
			]
		);

		$this->end_controls_section();

	}

	public function render() {
        $settings = $this->get_settings();

        $this->add_render_attribute( 'piechart', [
            'class' => 'qazana-piechart',
        ] );

        $this->add_render_attribute( 'piechart-number', [
			'class' => 'qazana-piechart-number',
		] );

		$this->add_render_attribute( 'piechart-value', [
            'class' => 'qazana-piechart-number-value',
			'data-value' => ( $settings['ending_number']['size'] / 100 ),
		] );

		$has_content = ! empty( $settings['title_text'] ) || ! empty( $settings['description_text'] );

        if ( ! empty( $settings['link']['url'] ) ) {
			$this->add_render_attribute( 'link', 'href', $settings['link']['url'] );

			if ( $settings['link']['is_external'] ) {
				$this->add_render_attribute( 'link', 'target', '_blank' );
			}

			if ( ! empty( $settings['link']['nofollow'] ) ) {
				$this->add_render_attribute( 'link', 'rel', 'nofollow' );
			}
        }

		$html = '<div ' . $this->get_render_attribute_string( 'piechart' ) . '>';

            $this->add_render_attribute( 'piechart-progress', 'class', 'qazana-piechart-number-progress' );

            $counter_html = '<div ' . $this->get_render_attribute_string( 'piechart-progress' ) . '>';

            if ( $this->get_settings_for_display('hover_animation') ) {
                $this->add_render_attribute( 'piechart-progress', 'class', 'qazana-animation-' . $this->get_settings_for_display('hover_animation') );
            }

            $counter_html .= '<span class="qazana-piechart-number-prefix">'. $settings['prefix'] . '</span>';
            $counter_html .= '<span ' . $this->get_render_attribute_string( 'piechart-value' ) . '>' . $settings['starting_number']['size'] . '</span>';
            $counter_html .= '<span class="qazana-piechart-number-suffix">'. $settings['suffix'] .'</span>';

            $counter_html .= '</div>';

            if ( ! empty( $settings['link']['url'] ) ) {
                $counter_html = '<a ' . $this->get_render_attribute_string( 'link' ) . '>' . $counter_html . '</a>';
            }

            $html .= '<div ' . $this->get_render_attribute_string( 'piechart-number' ) . '>' . $counter_html . '</div>';

            if ( $has_content ) {
			    $html .= '<div class="qazana-piechart-content">';

                if ( ! empty( $settings['title_text'] ) ) {
                    $this->add_render_attribute( 'title_text', 'class', 'qazana-piechart-title' );

                    $this->add_inline_editing_attributes( 'title_text', 'none' );

                    $title_html = $settings['title_text'];

                    if ( ! empty( $settings['link']['url'] ) ) {
                        $title_html = '<a ' . $this->get_render_attribute_string( 'link' ) . '>' . $title_html . '</a>';
                    }

                    $html .= sprintf( '<%1$s %2$s>%3$s</%1$s>', $settings['title_size'], $this->get_render_attribute_string( 'title_text' ), $title_html );
                }

                if ( ! empty( $settings['description_text'] ) ) {
                    $this->add_render_attribute( 'description_text', 'class', 'qazana-piechart-description' );

                    $this->add_inline_editing_attributes( 'description_text' );

                    $html .= sprintf( '<p %1$s>%2$s</p>', $this->get_render_attribute_string( 'description_text' ), $settings['description_text'] );
                }
                $html .= '</div>';

            }

            $html .= '</div>';

        echo $html;

	}

	protected function _content_template() {
		?>
        <#

        view.addRenderAttribute( 'piechart', {
            'class': [ 'qazana-piechart' ],
        } );

        view.addRenderAttribute( 'piechart-number', {
            'class': [ 'qazana-piechart-number' ]
        } );

        view.addRenderAttribute( 'piechart-value', {
            'class': ['qazana-piechart-number-value'],
			'data-value': ( settings.ending_number.size / 100 )
         } );

		var html = '<div ' + view.getRenderAttributeString( 'piechart' ) + '>';

        html += '<div ' + view.getRenderAttributeString( 'piechart-number' ) + '>';
            html += '<div class="qazana-piechart-progress qazana-animation-'+ settings.hover_animation + '">';
                html += '<span class="qazana-piechart-number-prefix">' + settings.prefix  + '</span>';
                html += '<span ' + view.getRenderAttributeString( 'piechart-value' ) + '>' + settings.starting_number.size + '</span>';
                html += '<span class="qazana-piechart-number-suffix">' + settings.suffix  + '</span>';
            html += '</div>';
        html += '</div>';

        var hasContent = !! ( settings.title_text || settings.description_text );

        if ( hasContent ) {
            html += '<div class="qazana-piechart-content">';

            if ( settings.title_text ) {
                var title_html = settings.title_text;

                if ( settings.link.url ) {
                    title_html = '<a href="' + settings.link.url + '">' + title_html + '</a>';
                }

                view.addRenderAttribute( 'title_text', 'class', 'qazana-piechart-title' );

                view.addInlineEditingAttributes( 'title_text' );

                html += '<' + settings.title_size  + ' ' + view.getRenderAttributeString( 'title_text' ) + '>' + title_html + '</' + settings.title_size  + '>';
            }

            if ( settings.description_text ) {
                view.addRenderAttribute( 'description_text', 'class', 'qazana-piechart-description' );

                view.addInlineEditingAttributes( 'description_text' );

                html += '<p ' + view.getRenderAttributeString( 'description_text' ) + '>' + settings.description_text + '</p>';
            }

            html += '</div>';
        }

		html += '</div>';

		print( html );
		#>
		<?php
	}
}
