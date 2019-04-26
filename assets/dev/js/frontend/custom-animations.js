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
        target: 'this', // it can be also a selector e.g. '.selector'
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

        // triggerHandler: 'focus', // "focus", "inview"
        // triggerTarget: 'input',
        // triggerRelation: 'siblings',
        // offTriggerHandler: 'blur',
    };

    var Plugin = function( $element ) {
        var self = this;

        this.element = $element[ 0 ];
        this.$element = $element;

        this.isRTL = 'rtl' === jQuery( 'html' ).attr( 'dir' );

        this.getElements = function() {
            this.animationTarget = this._getAnimationTargets();
        };

        this.elementConfig = function( $currentElement ) {
            var elementConfig = jQuery.extend( {}, defaults, $currentElement.data( 'animations' ) );

            if ( 'mouseenter' === elementConfig.triggerHandler ) {
                elementConfig.triggerHandler = 'mouseenter touchstart';
            }
            if ( 'mouseleave' === elementConfig.triggerHandler ) {
                elementConfig.triggerHandler = 'mouseleave touchend';
            }

            return elementConfig;
        };

        this._build = function( activeElement ) {
            self._init( activeElement );
        };

        this._init = function( activeElement ) {
            this._initValues( activeElement );
            this._eventHandlers( activeElement );
           // this._handleResize( activeElement );
        };

        this._getAnimationTargets = function() {
            var animationTarget = this.options.target;

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
                    if ( ! this.$element.is( '.qazana-widget-spacer' ) ) {
                        this.$element.find( this.options.targets ).each( function( i, element ) {
                            elementsArray.push( element );
                        } );
                    } else {
                        elementsArray.push( $element.get() );
                    }
                    break;
            }

            return elementsArray;
        };

        this._eventHandlers = function( _activeElement ) {
            var triggerTarget = ! this.options.triggerRelation ? this.$element : this.$element[ this.options.triggerRelation ]( this.options.triggerTarget );

            if ( 'inview' === this.options.triggerHandler && ! this.options.animateTargetsWhenVisible ) {
                this._initInviewAnimations( triggerTarget );
            } else if ( 'inview' === this.options.triggerHandler && this.options.animateTargetsWhenVisible ) {
                this._targetsIO();
            }

            triggerTarget.on( this.options.triggerHandler, self._runAnimations.bind( self, false ) );
            triggerTarget.on( this.options.offTriggerHandler, self._offAnimations.bind( self ) );
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

            observer.observe( $triggerTarget.get() );
        };

        this._targetsIO = function() {
            var inviewCallback = function inviewCallback( entries, observer ) {
                entries.forEach( function( entry ) {
                    if ( entry.isIntersecting ) {
                        self._runAnimations( entry.target );
                        observer.unobserve( entry.target );
                    }
                } );
            };

            var observer = new IntersectionObserver( inviewCallback, {
                threshold: 0.35,
            } );

            jQuery.each( this.animationTarget, function( _i, target ) {
                observer.observe( target );
            } );
        };

        // eslint-disable-next-line no-shadow
        this._inviewAnimationsThreshold = function( $element ) {
            var windowWidth = window.innerWidth;
            var windowHeight = window.innerHeight;
            var elementOuterWidth = $element.outerWidth();
            var elementOuterHeight = $element.outerHeight();
            var elementOffset = $element.offset();

            var width = windowWidth / elementOuterWidth;
            var height = windowHeight / elementOuterHeight;

            if ( elementOuterWidth + elementOffset.left >= windowWidth ) {
                width = windowWidth / ( elementOuterWidth - ( elementOuterWidth + elementOffset.left - windowWidth ) );
            }

            return Math.min( Math.max( height / width / 2, 0 ), 0.8 );
        };

        this._needPerspective = function( options ) {
            var initValues = options.initValues;
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

        this._initValues = function( activeElement ) {
            var $activeElement = jQuery( activeElement );

            var animationOptions = self.elementConfig( $activeElement );

            var $animationTarget = $activeElement.find( animationOptions.target );

            $activeElement.css( 'transition', 'none' );

            if ( 'inview' === self.options.triggerHandler ) {
                $animationTarget.addClass( 'qazana-will-change' );
            }

            /** Default animation value */
            var initValues = {
                targets: animationOptions.target,
                duration: 0,
                easing: 'linear',
            };

            var animations = jQuery.extend( {}, animationOptions.initValues, initValues );

            anime( animations );

            $activeElement.addClass( 'qazana-animation-initialized' );

            if ( this._needPerspective( animationOptions ) && 'inview' === animationOptions.triggerHandler ) {
                $activeElement.addClass( 'qazana-perspective' );
            }
        };

        // eslint-disable-next-line no-shadow
        this._getTargetThreshold = function( $element ) {
            var windowHeight = jQuery( window ).height();
            var elementOuterHeight = $element.outerHeight();

            return Math.min( Math.max( windowHeight / elementOuterHeight / 5, 0 ), 1 );
        };

        this._runAnimations = function( activeElement ) {
            var $animationTarget = jQuery( activeElement ).closest( '.qazana-element' );
            var options = self.elementConfig( $animationTarget );

            var defaultAnimations = {
                targets: activeElement,
                duration: options.duration,
                easing: options.easing,
                delay: anime.stagger( options.delay, {
                    start: options.startDelay,
                } ),
                complete: function complete( anime ) {
                    self._onAnimationsComplete( anime );
                },
            };

            var animations = jQuery.extend( {}, options.animations, defaultAnimations );

            console.log( $animationTarget );
            console.log( animations );

            anime.remove( activeElement );

            anime( animations );
        };

        this._onAnimationsComplete = function( anime ) {
            jQuery.each( anime.animatables, function( _i, animatable ) {
                // eslint-disable-next-line no-shadow
                var $element = jQuery( animatable.target );

                $element.css( {
                    transition: '',
                } ).removeClass( 'qazana-will-change' );

                if ( 'inview' === self.options.triggerHandler && $element.is( '.btn' ) ) {
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
            var animationTarget = Array.prototype.slice.call( this.animationTarget ).reverse();

            if ( 'this' === this.options.target ) {
                animationTarget = this.element;
            }

            var offAnimationVal = {
                targets: animationTarget,
                easing: this.options.easing,
                duration: this.options.offDuration,
                delay: anime.stagger( ( this.options.delay / 2 ), {
                    start: this.options.offDelay,
                } ),
                complete: function complete() {
                    self._initValues();
                },
            };

            var _offAnimations = jQuery.extend( {}, this.options.initValues, offAnimationVal );

            anime.remove( this.animationTarget );

            anime( _offAnimations );
        };

        this._handleResize = function( _activeElement ) {
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

        this.init = function() {
            this.options = this.elementConfig( this.$element );
            this.getElements();

            var callback = function callback( entries, observer ) {
                entries.forEach( function( entry ) {
                    if ( entry.isIntersecting ) {
                        self._build( entry.target );
                        observer.unobserve( entry.target );
                    }
                } );
            };

            var observer = new IntersectionObserver( callback, {
                rootMargin: '10%',
            } );

            observer.observe( self.element );
        };

        this.init();
    };

    jQuery( '[data-custom-animations]' ).each( function() {
        new Plugin( jQuery( this ) );
    } );
};

module.exports = ElementsHandler;
