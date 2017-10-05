<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Widget_Audio extends Widget_Base {
	protected $_current_instance = [];

	public function get_name() {
		return 'audio';
	}

	public function get_title() {
		return __( 'SoundCloud', 'qazana' );
	}

	public function get_icon() {
		return 'eicon-headphones';
	}

	public function get_categories() {
		return [ 'general-elements' ];
	}

	protected function _register_controls() {
		$this->start_controls_section(
			'section_audio',
			[
				'label' => __( 'SoundCloud', 'qazana' ),
			]
		);

		$this->add_control(
			'link',
			[
				'label' => __( 'Link', 'qazana' ),
				'type' => Controls_Manager::URL,
				'default' => [
					'url' => 'https://soundcloud.com/shchxango/john-coltrane-1963-my-favorite',
				],
				'show_external' => false,
			]
		);

		$this->add_control(
			'visual',
			[
				'label' => __( 'Visual Player', 'qazana' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'no',
				'options' => [
					'yes' => __( 'Yes', 'qazana' ),
					'no' => __( 'No', 'qazana' ),
				],
			]
		);

		$this->add_control(
			'sc_options',
			[
				'label' => __( 'Additional Options', 'qazana' ),
				'type' => Controls_Manager::HEADING,
				'separator' => 'before',
			]
		);

		$this->add_control(
			'sc_auto_play',
			[
				'label' => __( 'Autoplay', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
			]
		);

		$this->add_control(
			'sc_buying',
			[
				'label' => __( 'Buy Button', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'label_off' => __( 'Hide', 'qazana' ),
				'label_on' => __( 'Show', 'qazana' ),
				'default' => 'yes',
			]
		);

		$this->add_control(
			'sc_liking',
			[
				'label' => __( 'Like Button', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'label_off' => __( 'Hide', 'qazana' ),
				'label_on' => __( 'Show', 'qazana' ),
				'default' => 'yes',
			]
		);

		$this->add_control(
			'sc_download',
			[
				'label' => __( 'Download Button', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'label_off' => __( 'Hide', 'qazana' ),
				'label_on' => __( 'Show', 'qazana' ),
				'default' => 'yes',
			]
		);

		$this->add_control(
			'sc_sharing',
			[
				'label' => __( 'Share Button', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'label_off' => __( 'Hide', 'qazana' ),
				'label_on' => __( 'Show', 'qazana' ),
				'default' => 'yes',
			]
		);

		$this->add_control(
			'sc_show_comments',
			[
				'label' => __( 'Comments', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'label_off' => __( 'Hide', 'qazana' ),
				'label_on' => __( 'Show', 'qazana' ),
				'default' => 'yes',
			]
		);

		$this->add_control(
			'sc_show_playcount',
			[
				'label' => __( 'Play Counts', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'label_off' => __( 'Hide', 'qazana' ),
				'label_on' => __( 'Show', 'qazana' ),
				'default' => 'yes',
			]
		);

		$this->add_control(
			'sc_show_user',
			[
				'label' => __( 'Username', 'qazana' ),
				'type' => Controls_Manager::SWITCHER,
				'label_off' => __( 'Hide', 'qazana' ),
				'label_on' => __( 'Show', 'qazana' ),
				'default' => 'yes',
			]
		);

		$this->add_control(
			'sc_color',
			[
				'label' => __( 'Controls Color', 'qazana' ),
				'type' => Controls_Manager::COLOR,
			]
		);

		$this->end_controls_section();

	}

	protected function render() {
		$settings = $this->get_settings();

		if ( empty( $settings['link'] ) ) {
			return;
		}

		$this->_current_instance = $settings;

		add_filter( 'oembed_result', [ $this, 'filter_oembed_result' ], 50, 3 );
		$video_html = wp_oembed_get( $settings['link']['url'], wp_embed_defaults() );
		remove_filter( 'oembed_result', [ $this, 'filter_oembed_result' ], 50 );

		if ( $video_html ) : ?>
			<div class="qazana-soundcloud-wrapper">
				<?php echo $video_html; ?>
			</div>
		<?php
		endif;
	}

	public function filter_oembed_result( $html ) {
		$param_keys = [
			'auto_play',
			'buying',
			'liking',
			'download',
			'sharing',
			'show_comments',
			'show_playcount',
			'show_user',
		];

		$params = [];

		foreach ( $param_keys as $param_key ) {
			$params[ $param_key ] = 'yes' === $this->_current_instance[ 'sc_' . $param_key ] ? 'true' : 'false';
		}

		$params['color'] = str_replace( '#', '', $this->_current_instance['sc_color'] );

		preg_match( '/<iframe.*src=\"(.*)\".*><\/iframe>/isU', $html, $matches );

		$url = esc_url( add_query_arg( $params, $matches[1] ) );

		$visual = 'yes' === $this->_current_instance['visual'] ? 'true' : 'false';

		$html = str_replace( [ $matches[1], 'visual=true' ], [ $url, 'visual=' . $visual ], $html );

		if ( 'false' === $visual ) {
			$html = str_replace( 'height="400"', 'height="200"', $html );
		}

		return $html;
	}

	protected function _content_template() {}
}
