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
        'grid',
    ];

    /**
	 * Default animation
	 * @var array
	 */
	private $defaults = [
        'fadeIn' => [
            'group' => [ 'entry-exit' ],
            'easing' => 'easeOutQuint',
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
            'easing' => 'easeOutQuint',
            'animation' => [
                'out' => [
                    'opacity' => 0,
                    'translateY' => '-40px',
                ],
                'in' => [
                    'opacity' => 1,
                    'translateY' => '0',
                ],
            ],
        ],
        'fadeInUp' => [
            'group' => [ 'entry-exit' ],
            'easing' => 'easeOutQuint',
            'animation' => [
                'out' => [
                    'opacity' => 0,
                    'translateY' => '40px',
                ],
                'in' => [
                    'opacity' => 1,
                    'translateY' => 0,
                ],
            ],
        ],
        'fadeInLeft' => [
            'group' => [ 'entry-exit' ],
            'easing' => 'easeOutQuint',
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
            'easing' => 'easeOutQuint',
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
        'fadeUpPerspective' => [
            'group' => [ 'entry-exit' ],
            'easing' => 'easeOutQuint',
            'animation' => [
                'out' => [
                    'translateY' => '-45px',
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
        'fadeLeftPerspective' => [
            'group' => [ 'entry-exit' ],
            'easing' => 'easeOutQuint',
            'animation' => [
                'out' => [
                    "translateX" => '144',
                    "scaleX" =>' 0.75',
                    "scaleY" => '0.75',
                    "rotateY" => '-65',
                    "opacity" => '0'
                ],
                'in' => [
                    "translateX" => 0,
                    "scaleX" => 1,
                    "scaleY" => 1,
                    "rotateY" => 0,
                    "opacity" => 1
                ],
            ],
        ],
        'fadeRightPerspective' => [
            'group' => [ 'entry-exit' ],
            'easing' => 'easeOutQuint',
            'animation' => [
                'out' => [
                    "translateX" => '-144',
                    "scaleX" =>' 0.75',
                    "scaleY" => '0.75',
                    "rotateY" => '-65',
                    "opacity" => '0'
                ],
                'in' => [
                    "translateX" => 0,
                    "scaleX" => 1,
                    "scaleY" => 1,
                    "rotateY" => 0,
                    "opacity" => 1
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

        'move-up' => [
            'group' => [ 'grid' ],
            'easing' => 'easeInOutQuad',
            'duration' => 200,
            'animation' => [
                'out' => [
                    'translateY' => '40px',
                ],
                'in' => [
                    'translateY' => '0',
                ],
            ],
        ],

        'bounce' => [
            'group' => [ 'grid' ],
            'easing' => 'easeInOutQuad',
            'duration' => 0,
            'animation' => [
                'out' => [
                    'scale' => '.001',
                ],
                'in' => [
                    'scale' => '0',
                ],
            ],
        ],

        'scale' => [
            'group' => [ 'grid' ],
            'easing' => 'easeInOutQuad',
            'duration' => 100,
            'animation' => [
                'out' => [
                    'scale' => '.08',
                ],
                'in' => [
                    'scale' => '0',
                ],
            ],
        ],

        'flip' => [
            'group' => [ 'grid' ],
            'easing' => 'easeInOutQuad',
            'duration' => 100,
            'animation' => [
                'out' => [
                    'rotate3d' => '1, 0, 0, -80deg',
                ],
                'in' => [
                    'rotate3d' => '0',
                ],
            ],
        ],

        'fall-perspective' => [
            'group' => [ 'grid' ],
            'easing' => 'easeInOutQuad',
            'duration' => 100,
            'animation' => [
                'out' => [
                    'translateZ' => '100px',
                    'translateY' => '75px',
                    'rotate3d' => '-1, 1, 0, 30deg'
                ],
                'in' => [
                    'rotate3d' => '0',
                    'translateZ' => 0,
                    'translateY' => 0,
                    'rotate3d' => 0
                ],
            ],
        ],
        'slide-in-left' => [
            'group' => [ 'grid' ],
            'easing' => 'easeInOutQuad',
            'duration' => 100,
            'animation' => [
                'out' => [
                    'translateX' => '-30%',
                ],
                'in' => [
                    'translateX' => 0
                ],
            ],
        ],

        'up-perspective' => [
            'group' => [ 'grid' ],
            'easing' => 'cubic-bezier(.1,.3,.27,1)',
            'duration' => 100,
            'animation' => [
                'out' => [
                    'translateZ' => '0',
                    'translateY' => '100px',
                    'rotateX' => '24deg'
                ],
                'in' => [
                    'translateZ' => '0',
                    'translateY' => '0',
                    'rotateX' => '0'
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