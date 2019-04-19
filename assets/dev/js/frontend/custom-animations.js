var ElementsHandler = function() {
    var FontFaceObserver = require( 'fontfaceobserver' );
    var QazanaSplitText = require( './animations/splitText' );
    var QazanaRotateText = require( './animations/textRotator' );

	var defaults = {
		delay: 0,
		startDelay: 0,
		offDelay: 0,
		direction: 'forward',
		duration: 300,
		offDuration: 300,
		easing: 'easeOutQuint',
		animationTarget: 'this', // it can be also a selector e.g. '.selector'
		initValues: {
			translateX: 0,
			translateY: 0,
			translateZ: 0,
			rotateX: 0,
			rotateY: 0,
			rotateZ: 0,
			scaleX: 1,
			scaleY: 1,
			opacity: 1,
		},
		animations: {},
        animateTargetsWhenVisible: true,

		// triggerHandler: 'focus', // "inview"
		// triggerTarget: 'input',
		// triggerRelation: 'siblings',
		// offTriggerHandler: 'blur',
	};

	var Plugin = function( $element, options ) {
        var self = this;

        this.element = $element[ 0 ];
		this.$element = $element;
        this.options = jQuery.extend( {}, defaults, options );

		if ( 'mouseenter' === this.options.triggerHandler ) {
			this.options.triggerHandler = 'mouseenter touchstart';
		}
		if ( 'mouseleave' === this.options.triggerHandler ) {
			this.options.triggerHandler = 'mouseleave touchend';
		}

		this.splitText = null;
		this.isRTL = 'rtl' === jQuery( 'html' ).attr( 'dir' );

		this.init = function() {
			var callback = function callback( entries, observer ) {
				entries.forEach( function( entry ) {
					if ( entry.isIntersecting ) {
						self._build();
						observer.unobserve( entry.target );
					}
				} );
			};

			var observer = new IntersectionObserver( callback, {
				rootMargin: '10%',
            } );

			observer.observe( self.element );
		};

		this._build = function() {
			var $splitTextElements = self.$element.find( '[data-split-text]' );

			if ( $splitTextElements.length ) {
				this.splitText = new QazanaSplitText( $splitTextElements, $splitTextElements.data( 'split-options' ) );

				var fonts = {};

				jQuery.each( $splitTextElements, function( i, element ) {
					var elementFontFamily = jQuery( element )
						.css( 'font-family' )
						.replace( /\"/g, '' )
						.replace( /\'/g, '' )
						.split( ',' )[ 0 ];
					var elementFontWeight = jQuery( element ).css( 'font-weight' );
					var elementFontStyle = jQuery( element ).css( 'font-style' );

					fonts[ elementFontFamily ] = {
						weight: elementFontWeight,
						style: elementFontStyle,
					};
				} );

				var observers = [];

				Object.keys( fonts ).forEach( function( family ) {
					var data = fonts[ family ];
					var obs = new FontFaceObserver( family, data );
					observers.push( obs.load() );
				} );

				Promise.all( observers )
					.then( function() {
						self._init();
					} )
					.catch( function( err ) {
						// eslint-disable-next-line no-console
						console.warn( 'Some critical fonts are not available:', err );
						self._init();
					} );
			} else if ( this.$element.is( '[data-split-text]' ) ) {
				this.splitText = new QazanaSplitText( this.$element, this.$element.data( 'split-options' ) );

				var elementFontFamily = this.$element
					.css( 'font-family' )
					.replace( /\"/g, '' )
					.replace( /\'/g, '' )
					.split( ',' )[ 0 ];
				var elementFontWeight = this.$element.css( 'font-weight' );
				var elementFontStyle = this.$element.css( 'font-style' );

				var font = new FontFaceObserver( elementFontFamily, {
					weight: elementFontWeight,
					style: elementFontStyle,
				} );

				font.load().then(
					function() {
						self._init();
					},
					function() {
						self._init();
					}
				);
			} else {
				self._init();
			}
		};

		this._init = function() {
			this.animationTarget = this._getAnimationTargets();

            console.log( this.animationTarget );

			this._initValues();
			this._eventHandlers();
			this._handleResize();
		};

		this._getAnimationTargets = function() {
            var animationTarget = this.options.animationTarget;

			if ( 'this' === animationTarget ) {
				return this.element;
			} else if ( 'all-children' === animationTarget ) {
				return this._getChildElments();
            }

			return this.element.querySelectorAll( animationTarget );
		};

		this._getChildElments = function() {
            var elementsArray = [],
                elementType = this.$element.data( 'element_type' );

            switch ( elementType ) {
                case 'section':

                    this.$element.find( '.qazana-column' ).each( function( i, element ) {
                        elementsArray.push( element );
                    } );

                    break;

                case 'column':

                    if ( $element.is( '.qazana-top-column' ) ) {
                        $element.find( '> .qazana-column-wrap > .qazana-widget-wrap > .qazana-widget' ).each( function( i, innerColumn ) {
                            if ( ! jQuery( this ).is( '.qazana-widget-spacer' ) ) {
                                elementsArray.push( innerColumn );
                            }
                        } );
                    }

                    break;

                default:
                    if ( ! this.$element.is( '.qazana-widget-spacer' ) && ! this.$element.is( '[data-split-text]' ) ) {
                        this.$element.find( this.options.targets ).each( function( i, element ) {
                            elementsArray.push( element );
                        } );
                    } else {
                        elementsArray.push( $element.get( 0 ) );
                    }
                break;
            }

			return elementsArray;
		};

		this._eventHandlers = function() {
			var triggerTarget = ! this.options.triggerRelation ? this.$element : this.$element[ this.options.triggerRelation ]( this.options.triggerTarget );

			if ( 'inview' == this.options.triggerHandler && ! this.options.animateTargetsWhenVisible ) {
                this._initInviewAnimations( triggerTarget );
			} else if ( 'inview' == this.options.triggerHandler && this.options.animateTargetsWhenVisible ) {
                this._targetsIO();
			}

			//triggerTarget.on( this.options.triggerHandler, self._runAnimations.bind( self, false ) );
			//triggerTarget.on( this.options.offTriggerHandler, self._offAnimations.bind( self ) );
		};

		this._initInviewAnimations = function( $triggerTarget ) {
			var threshold = this._inviewAnimationsThreshold( $triggerTarget );

			var inviewCallback = function inviewCallback( entries, observer ) {
				entries.forEach( function( entry ) {
					if ( entry.isIntersecting ) {
						self._runAnimations();

						observer.unobserve( entry.target );
					}
				} );
			};

			var observer = new IntersectionObserver( inviewCallback, {
				threshold: threshold,
			} );

			observer.observe( $triggerTarget.get( 0 ) );
		};

        this._targetsIO = function() {
			var inviewCallback = function inviewCallback( entries, observer ) {
				var inviewTargetsArray = [];

				entries.forEach( function( entry ) {
					if ( entry.isIntersecting ) {
						inviewTargetsArray.push( entry.target );

						self._runAnimations( inviewTargetsArray );

						observer.unobserve( entry.target );
					}
				} );
			};

			var observer = new IntersectionObserver( inviewCallback, {
				threshold: 0.35,
			} );

			jQuery.each( this.animationTarget, function( i, target ) {
				observer.observe( target );
			} );
		};

		this._inviewAnimationsThreshold = function( $element ) {
			var windowWidth = window.innerWidth;
			var windowHeight = window.innerHeight;
			var elementOuterWidth = $element.outerWidth();
			var elementOuterHeight = $element.outerHeight();
			var elementOffset = $element.offset();

			var w = windowWidth / elementOuterWidth;
			var h = windowHeight / elementOuterHeight;

			if ( elementOuterWidth + elementOffset.left >= windowWidth ) {
				w =
					windowWidth /
					( elementOuterWidth -
						( elementOuterWidth + elementOffset.left - windowWidth ) );
			}

			return Math.min( Math.max( h / w / 2, 0 ), 0.8 );
		};

		this._needPerspective = function() {
			var initValues = this.options.initValues;
			var valuesNeedPerspective = [
				'translateZ',
				'rotateX',
				'rotateY',
				'scaleZ',
			];
			var needPerspective = false;

			for ( var prop in initValues ) {
				for ( var i = 0; i <= valuesNeedPerspective.length - 1; i++ ) {
					var val = valuesNeedPerspective[ i ];

					if ( prop === val ) {
						needPerspective = true;
						break;
					}
				}
			}

			return needPerspective;
		};

		this._initValues = function() {
            jQuery( this.animationTarget ).each( function() {
                var $animationTarget = jQuery( this );
                var animationOptions = $animationTarget.data( 'ca-options' );

                $animationTarget.css( 'transition', 'none' );

                if ( 'inview' == self.options.triggerHandler ) {
                    $animationTarget.addClass( 'qazana-will-change' );
                }

                /** Default animation value */
                var initValues = {
                    targets: '.qazana-split-inner',
                    duration: 0,
                    easing: 'linear',
                };

                var animations = jQuery.extend(
                    {},
                    animationOptions.initValues,
                    initValues
                );

                animations.targets = animationOptions.animationTarget;

                anime( animations );
            } );

			this.$element.addClass( 'ca-initvalues-applied' );

			if ( this._needPerspective() && 'inview' == this.options.triggerHandler ) {
				this.$element.addClass( 'qazana-perspective' );
			}
		};

		this._getTargetThreshold = function( $element ) {
			var windowHeight = jQuery( window ).height();
			var elementOuterHeight = $element.outerHeight();

			return Math.min(
				Math.max( windowHeight / elementOuterHeight / 5, 0 ),
				1
			);
		};

		this._runAnimations = function( inviewTargetsArray ) {
			var _delay = parseInt( this.options.delay, 10 );
			var startDelay = parseInt( this.options.startDelay, 10 );
			var duration = parseInt( this.options.duration, 10 );
			var easing = this.options.easing;

			var targets = [];

			if ( inviewTargetsArray ) {
				targets = inviewTargetsArray;
			} else {
				targets = jQuery.isArray( this.animationTarget ) ? this.animationTarget : jQuery.makeArray( this.animationTarget );
            }

            jQuery( this.animationTarget ).each( function() {
                var $animationTarget = jQuery( this );
                var animationOptions = $animationTarget.data( 'ca-options' );

                targets = 'backward' === self.options.direction ? targets.reverse() : targets;

                var defaultAnimations = {
                    targets: targets,
                    duration: duration,
                    easing: easing,
                    delay: anime.stagger( _delay, { start: startDelay } ),
                    complete: function complete( anime ) {
                        self._onAnimationsComplete( anime );
                    },
                };

                var animations = jQuery.extend(
                    {},
                    animationOptions.animations,
                    defaultAnimations
                );

                animations.targets = animationOptions.animationTarget;

                anime.remove( animationOptions.animationTarget );

                anime( animations );
            } );
		};

		this._onAnimationsComplete = function( anime ) {
			jQuery.each( anime.animatables, function( i, animatable ) {
				var $element = jQuery( animatable.target );

				$element
					.css( {
						transition: '',
					} )
					.removeClass( 'qazana-will-change' );

				if (
					'inview' == self.options.triggerHandler &&
					$element.is( '.btn' )
				) {
					$element.css( {
						transform: '',
					} );
				}
			} );

			/* calling textRotator if there's any text-rotator inside the element, or if the element itself is text-rotator */
            if ( this.$element.find( '[data-text-rotator]' ).length > 0 ) {
                new QazanaRotateText( this.$element.find( '[data-text-rotator]' ) );
            }

            if ( this.$element.is( '[data-text-rotator]' ) ) {
                new QazanaRotateText( this.$element );
            }
		};

		this._offAnimations = function() {
			var _delay2 = this.options.delay;
			var offDuration = this.options.offDuration;
			var offDelay = this.options.offDelay;
			var easing = this.options.easing;
			var animationTarget = Array.prototype.slice
				.call( this.animationTarget )
				.reverse();

			if ( 'this' === this.options.animationTarget ) {
				animationTarget = this.element;
			}

			var offAnimationVal = {
				targets: animationTarget,
				easing: easing,
				duration: offDuration,
				delay: function delay( el, i ) {
					return ( i * ( _delay2 / 2 ) ) + offDelay;
				},
				complete: function complete() {
					self._initValues();
				},
			};

			var _offAnimations = jQuery.extend(
				{},
				this.options.initValues,
				offAnimationVal
			);

			anime.remove( this.animationTarget );

			anime( _offAnimations );
		};

		this._handleResize = function() {
			var onResize = qazanaFrontend.debounce( 500, this._onWindowResize );

			jQuery( window ).on( 'resize', onResize.bind( this ) );
		};

		this._onWindowResize = function() {
			if ( self.options.triggerHandler !== 'inview' ) {
				self.animationTarget = self._getAnimationTargets();
				self._initValues();
				self._eventHandlers();
			}
		};

        this.init();
	};

    jQuery( '[data-custom-animations]' ).map( function( i, element ) {
		var $element = jQuery( element );
		var $customAnimationParent = $element.parents( '.qazana-section[data-custom-animations], .qazana-column[data-custom-animations]' );

		if ( $customAnimationParent.length ) {
			$element.removeAttr( 'data-custom-animations' );
			$element.removeAttr( 'data-ca-options' );
		}
	} );

	var $elements = jQuery( '[data-custom-animations]' ).filter( function( i, element ) {
		var $element = jQuery( element );
		var $rowBgparent = $element.closest( '.vc_row[data-row-bg]' );
		var $slideshowBgParent = $element.closest( '.vc_row[data-slideshow-bg]' );
		var $fullpageSection = $element.closest( '.vc_row.pp-section' );

		return ! $rowBgparent.length && ! $slideshowBgParent.length && ! $fullpageSection.length;
    } );

    $elements.each( function() {
        new Plugin( jQuery( this ), jQuery( this ).data( 'ca-options' ) );
    } );
};

module.exports = ElementsHandler;
