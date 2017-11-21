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
		return 'eicon-counter-circle';
	}

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
        $this->add_frontend_script('jquery-circle-progress');
        $this->add_frontend_stylesheet( 'qazana-extension-' . $this->get_name() );
    }

	protected function _register_controls() {
		$this->start_controls_section(
			'section_piechart',
			[
				'label' => __( 'Counter', 'qazana' ),
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
			]
		);

		$this->add_control(
			'counterclock',
			[
				'label' => __( 'Counterclock', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'default' => '',
				'label_on' => __( 'Yes', 'qazana' ),
				'label_off' => __( 'No', 'qazana' ),
				'prefix_class' => 'qazana-piechart-counterclockwise-',
				'description' => __( 'Reverse chart animation direction', 'qazana' )
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
				]
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
				]
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

		$this->add_control(
			'duration',
			[
				'label' => __( 'Animation Duration', 'qazana' ),
				'type' => Controls_Manager::NUMBER,
				'default' => 1700,
				'min' => 100,
				'step' => 100,
			]
		);

		$this->add_control(
			'title',
			[
				'label' => __( 'Title', 'qazana' ),
				'type' => Controls_Manager::TEXT,
				'label_block' => true,
				'default' => __( 'Cool Chart', 'qazana' ),
				'placeholder' => __( 'Cool Chart', 'qazana' ),
			]
		);

		$this->add_control(
			'subtitle',
			[
				'label' => __( 'Sub Title', 'qazana' ),
				'type' => Controls_Manager::TEXT,
				'label_block' => true,
				'default' => __( 'Cool chart subtitle', 'qazana' ),
				'placeholder' => __( 'Cool chart Subtitle', 'qazana' ),
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_circle',
			[
				'label' => __( 'Circle', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'circle_start_color',
			[
				'label' => __( 'Start Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'default' => 'green',
			]
		);

		$this->add_control(
			'circle_end_color',
			[
				'label' => __( 'End Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'default' => 'blue',
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
					'{{WRAPPER}} .piechart-number' => 'width: {{SIZE}}{{UNIT}}; height: {{SIZE}}{{UNIT}}; line-height: {{SIZE}}{{UNIT}};',
				],
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
					'{{WRAPPER}} .piechart-number:before' => 'border-width: {{SIZE}}{{UNIT}};',
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
					'{{WRAPPER}} .piechart-number:before' => 'border-color: {{VALUE}};',
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
					'{{WRAPPER}} .piechart-number' => 'margin-bottom: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_title',
			[
				'label' => __( 'Title', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'title_color',
			[
				'label' => __( 'Title Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_2,
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-piechart-title' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_control(
			'title_spacing',
			[
				'label' => __( 'Title Spacing', 'qazana' ),
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

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'typography_title',
				'scheme' => Scheme_Typography::TYPOGRAPHY_2,
				'selector' => '{{WRAPPER}} .qazana-piechart-title',
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_subtitle',
			[
				'label' => __( 'Sub Title', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'subtitle_color',
			[
				'label' => __( 'Sub Title Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
				'scheme' => [
					'type' => Scheme_Color::get_type(),
					'value' => Scheme_Color::COLOR_3,
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-piechart-subtitle' => 'color: {{VALUE}};',
				],
			]
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'typography_subtitle',
				'scheme' => Scheme_Typography::TYPOGRAPHY_2,
				'selector' => '{{WRAPPER}} .qazana-piechart-subtitle',
			]
		);

		$this->add_control(
			'subtitle_spacing',
			[
				'label' => __( 'Sub Title Spacing', 'qazana' ),
				'type' => Controls_Manager::SLIDER,
				'range' => [
					'px' => [
						'min' => 0,
						'max' => 100,
					],
				],
				'selectors' => [
					'{{WRAPPER}} .qazana-piechart-subtitle' => 'margin-bottom: {{SIZE}}{{UNIT}};',
				],
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'section_prefix_style',
			[
				'label' => __( 'Prefix Style', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
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
			'section_suffix_style',
			[
				'label' => __( 'Suffix Style', 'qazana' ),
				'tab' => Controls_Manager::TAB_STYLE,
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

	public function style_1() {

		$settings = $this->get_settings();

		?><div <?php $this->render_attribute_string( 'piechart' ); ?>>
			<div class="piechart-number">
				<span class="qazana-piechart-number-progress">
					<span class="qazana-piechart-number-prefix"><?php echo $settings['prefix']; ?></span>
					<span class="qazana-piechart-number-count" data-value="<?php echo $settings['ending_number']['size']; ?>">0</span>
					<span class="qazana-piechart-number-suffix"><?php echo $settings['suffix']; ?></span>
				</span>
			</div>
			<?php if ( $settings['title'] ) : ?>
				<div class="qazana-piechart-title"><?php echo $settings['title']; ?></div>
			<?php endif; ?>

			<?php if ( $settings['subtitle'] ) : ?>
				<div class="qazana-piechart-subtitle"><?php echo $settings['subtitle']; ?></div>
			<?php endif; ?>
  		</div><?php

	}

	public function render() {
		$settings = $this->get_settings();

		$this->add_render_attribute( 'piechart', [
			'class' => 'qazana-piechart',
			'data-duration' => $settings['duration'],
			'data-emptyfill' => "transparent",
			'data-animation-start-value' => $settings['starting_number']['size'],
			'data-value' => ( $settings['ending_number']['size'] / 100 ),
			'data-size' => $settings['circle_size']['size'],
			'data-thickness' => $settings['circle_width']['size'],
			'data-fill' => "{&quot;gradient&quot;: [&quot;". $settings['circle_start_color'] ."&quot;,&quot;". $settings['circle_end_color'] ."&quot;]}",
			'data-reverse' => "true",
		] );

		$this->style_1();

	}

	protected function _content_template() {
		?>

		<div class="qazana-piechart"
			data-duration="{{{ settings.duration }}}"
			data-emptyfill="transparent"
			data-animation-start-value="{{{ settings.starting_number.size }}}"
			data-value="{{ ( settings.ending_number.size / 100 ) }}"
			data-size="{{{ settings.circle_size.size }}}"
			data-thickness="{{{ settings.circle_width.size }}}"
			data-reverse="true"
			data-fill = "{&quot;gradient&quot;: [&quot;{{{ settings.circle_start_color }}}&quot;,&quot;{{{ settings.circle_end_color }}}&quot;]}"
		>
			<div class="piechart-number">
				<div class="qazana-piechart-number-progress">
					<span class="qazana-piechart-number-prefix">{{{ settings.prefix }}}</span>
					<span class="qazana-piechart-number-count" data-value="{{ settings.ending_number.size }}">0</span>
					<span class="qazana-piechart-number-suffix">{{{ settings.suffix }}}</span>
				</div>
			</div>

			<# if ( settings.title ) {
				#><div class="qazana-piechart-title">{{{ settings.title }}}</div><#
			} #>
			<# if ( settings.subtitle ) {
				#><div class="qazana-piechart-subtitle">{{{ settings.subtitle }}}</div><#
			} #>

  		</div>
		<?php
	}


}
