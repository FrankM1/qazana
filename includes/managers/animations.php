<?php
namespace Qazana;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Qazana animations.
 *
 * Qazana animation handler class is responsible for initializing Qazana
 * animations and register new animations.
 *
 * @since 1.0.0
 */
class Animation_Manager {

    private $groups = [
        'entry-exit',
        'parallax',
        'hover',
    ];

    /**
	 * Default animation
	 * @var array
	 */
	private $defaults = [
        'fadeIn' => [
            'group' => [ 'entry-exit' ],
            'easing' => 'easeInOutQuad',
            'animation' => [
                'out' => [
                    'opacity' => 0,
                ],
                'in' => [
                    'opacity' => 1,
                ],
            ],
        ],
        'fadeInDown' => [
            'group' => [ 'entry-exit' ],
            'easing' => 'easeInOutQuad',
            'animation' => [
                'out' => [
                    'opacity' => 0,
                    'translateY' => '40px',
                ],
                'in' => [
                    'opacity' => 1,
                    'translateY' => '0',
                ],
            ],
        ],
        'fadeInLeft' => [
            'group' => [ 'entry-exit' ],
            'easing' => 'easeInOutQuad',
            'animation' => [
                'out' => [
                    'opacity' => 0,
                    'translateX' => '-40px',
                ],
                'in' => [
                    'opacity' => 1,
                    'translateX' => 0,
                ],
            ],
        ],
        'fadeInRight' => [
            'group' => [ 'entry-exit' ],
            'easing' => 'easeInOutQuad',
            'animation' => [
                'out' => [
                    'opacity' => 0,
                    'translateX' => '40px',
                ],
                'in' => [
                    'opacity' => 1,
                    'translateX' => 0,
                ],
            ],
        ],
        'fadeInUp' => [
            'group' => [ 'entry-exit' ],
            'easing' => 'easeInOutQuad',
            'animation' => [
                'out' => [
                    'opacity' => 0,
                    'translateX' => '-40px',
                ],
                'in' => [
                    'opacity' => 1,
                    'translateX' => 0,
                ],
            ],
        ],
        'fadeInPerspective' => [
            'group' => [ 'entry-exit' ],
            'easing' => 'easeOutQuint',
            'animation' => [
                'out' => [
                    'translateY' => '45px',
                    'translateZ' => '-146px',
                    'rotateX' => -66,
                    'opacity' => 0,
                ],
                'in' => [
                    'translateY' => 0,
                    'translateZ' => 0,
                    'rotateX' => 0,
                    'opacity' => 1,
                ],
            ],
        ],
        'blindsLeft' => [
            'group' => [ 'entry-exit' ],
            'easing' => 'easeInOutQuad',
            'animation' => [
                'out' => [
                    'translateX' => '100%',
                ],
                'in' => [
                    'translateX' => [ '0%', '-100%' ],
                ],
            ],
        ],
        'blindsRight' => [
            'group' => [ 'entry-exit' ],
            'easing' => 'easeInOutQuad',
            'animation' => [
                'out' => [
                    'translateX' => '-100%',
                ],
                'in' => [
                    'translateX' => [ '0%', '100%' ],
                ],
            ],
        ],
        'blindsTop' => [
            'group' => [ 'entry-exit' ],
            'easing' => 'easeInOutQuad',
            'animation' => [
                'out' => [
                    'translateY' => '-100%',
                ],
                'in' => [
                    'translateY' => [ '0%', '100%' ],
                ],
            ],
        ],
        'blindsBottom' => [
            'group' => [ 'entry-exit' ],
            'easing' => 'easeInOutQuad',
            'animation' => [
                'out' => [
                    'translateY' => '100%',
                ],
                'in' => [
                    'translateY' => [ '0%', '-100%' ],
                ],
            ],
        ],
    ];

	/**
	 * Register new animation
     *
	 * @param ID
	 * @param bool
	 */
	public function add_animations( $id, $animation ) {

		if ( ! isset( $this->defaults[ $id ] ) ) {
			$this->defaults[ $id ] = [];
		}

		$this->defaults[ $id ] = $animation;

		return true;
    }

    /**
	 * Remove Animation
     *
	 * @param ID
	 * @param bool
	 */
	public function remove_animations( $id ) {

		if ( ! isset( $this->defaults[ $id ] ) ) {
			return new \WP_Error( __( 'Cannot remove not-existent animation.', 'qazana' ) );
		}

		unset( $this->defaults[ $id ] );

		return true;
	}

    public function get_animations() {
        return $this->defaults;
    }

    public function get_animation( $type ) {

		if ( ! isset( $this->defaults[ $type ] ) ) {
			return false;
		}

        return $this->defaults[ $type ];
    }
}