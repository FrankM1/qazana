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

    /**
	 * Default animation
	 * @var array
	 */
	private $defaults = [
        'fadeIn' => [
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
            'easing' => 'easeOutQuint',
            'animation' => [
                'out' => [
                    'translateY' => 45,
                    'translateZ' => -146,
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
            'easing' => 'easeOutQuint',
            'animation' => [
                'out' => [
                    'translateY' => 45,
                    'translateZ' => -146,
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