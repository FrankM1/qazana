<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Audio Widget
 */
class Widget_Audio extends Widget_Base {

	/**
	 * Current instance.
	 *
	 * @access protected
	 *
	 * @var array
	 */
	protected $_current_instance = [];

	/**
	 * Retrieve audio widget name.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget name.
	 */
	public function get_name() {
		return 'audio';
	}

	/**
	 * Retrieve audio widget title.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget title.
	 */
	public function get_title() {
		return __( 'SoundCloud', 'qazana' );
	}

	/**
	 * Retrieve audio widget icon.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget icon.
	 */
	public function get_icon() {
		return 'eicon-headphones';
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
		return [ 'audio', 'media', 'mp3' ];
    }

	/**
	 * Retrieve the list of categories the audio widget belongs to.
	 *
	 * Used to determine where to display the widget in the editor.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return array Widget categories.
	 */
	public function get_categories() {
		return [ 'general-elements' ];
	}

	/**
	 * Register audio widget controls.
	 *
	 * Adds different input fields to allow the user to change and customize the widget settings.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
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
				'label'   => __( 'Link', 'qazana' ),
				'type'    => Controls_Manager::URL,
				'default' => [
					'url' => 'https://soundcloud.com/shchxango/john-coltrane-1963-my-favorite',
				],
				'show_external' => false,
			]
		);

		$this->add_control(
			'visual',
			[
				'label'   => __( 'Visual Player', 'qazana' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'no',
				'options' => [
					'yes' => __( 'Yes', 'qazana' ),
					'no'  => __( 'No', 'qazana' ),
				],
			]
		);

		$this->add_control(
			'sc_options',
			[
				'label'     => __( 'Additional Options', 'qazana' ),
				'type'      => Controls_Manager::HEADING,
				'separator' => 'before',
			]
		);

		$this->add_control(
			'sc_auto_play',
			[
				'label' => __( 'Autoplay', 'qazana' ),
				'type'  => Controls_Manager::SWITCHER,
			]
		);

		$this->add_control(
			'sc_buying',
			[
				'label'     => __( 'Buy Button', 'qazana' ),
				'type'      => Controls_Manager::SWITCHER,
				'label_off' => __( 'Hide', 'qazana' ),
				'label_on'  => __( 'Show', 'qazana' ),
				'default'   => 'yes',
			]
		);

		$this->add_control(
			'sc_liking',
			[
				'label'     => __( 'Like Button', 'qazana' ),
				'type'      => Controls_Manager::SWITCHER,
				'label_off' => __( 'Hide', 'qazana' ),
				'label_on'  => __( 'Show', 'qazana' ),
				'default'   => 'yes',
			]
		);

		$this->add_control(
			'sc_download',
			[
				'label'     => __( 'Download Button', 'qazana' ),
				'type'      => Controls_Manager::SWITCHER,
				'label_off' => __( 'Hide', 'qazana' ),
				'label_on'  => __( 'Show', 'qazana' ),
				'default'   => 'yes',
			]
		);

		$this->add_control(
			'sc_sharing',
			[
				'label'     => __( 'Share Button', 'qazana' ),
				'type'      => Controls_Manager::SWITCHER,
				'label_off' => __( 'Hide', 'qazana' ),
				'label_on'  => __( 'Show', 'qazana' ),
				'default'   => 'yes',
			]
		);

		$this->add_control(
			'sc_show_comments',
			[
				'label'     => __( 'Comments', 'qazana' ),
				'type'      => Controls_Manager::SWITCHER,
				'label_off' => __( 'Hide', 'qazana' ),
				'label_on'  => __( 'Show', 'qazana' ),
				'default'   => 'yes',
			]
		);

		$this->add_control(
			'sc_show_playcount',
			[
				'label'     => __( 'Play Counts', 'qazana' ),
				'type'      => Controls_Manager::SWITCHER,
				'label_off' => __( 'Hide', 'qazana' ),
				'label_on'  => __( 'Show', 'qazana' ),
				'default'   => 'yes',
			]
		);

		$this->add_control(
			'sc_show_user',
			[
				'label'     => __( 'Username', 'qazana' ),
				'type'      => Controls_Manager::SWITCHER,
				'label_off' => __( 'Hide', 'qazana' ),
				'label_on'  => __( 'Show', 'qazana' ),
				'default'   => 'yes',
			]
		);

		$this->add_control(
			'sc_color',
			[
				'label' => __( 'Controls Color', 'qazana' ),
				'type'  => Controls_Manager::COLOR,
			]
		);

		$this->add_control(
			'view',
			[
				'label'   => __( 'View', 'qazana' ),
				'type'    => Controls_Manager::HIDDEN,
				'default' => 'soundcloud',
			]
		);

		$this->end_controls_section();

	}

	/**
	 * Render audio widget output on the frontend.
	 *
	 * Written in PHP and used to generate the final HTML.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	public function render() {
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

	/**
	 * Filter audio widget oEmbed results.
	 *
	 * Written in PHP and used to generate the final HTML.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @param string $html The HTML returned by the oEmbed provider.
	 */
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

	/**
	 * Render audio widget output in the editor.
	 *
	 * Written as a Backbone JavaScript template and used to generate the live preview.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	protected function _content_template() {}
}
