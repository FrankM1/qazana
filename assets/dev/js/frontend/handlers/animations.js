var HandlerModule = require( 'qazana-frontend/handler-module' ),
    AnimationHandler;
var SvgAnimation = require( '../animations/svgAnimation' );
var SplitText = require( '../animations/splitText' ).default;

AnimationHandler = HandlerModule.extend( {

    getAnimationDefaults: {
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

        // triggerTarget: 'input',
        // triggerRelation: 'siblings',
        // offTriggerHandler: 'blur',
    },

    getElementSettings: function( setting ) {
        var elementSettings = {},
            skinName,
            settings,
			modelCID = this.getModelCID(),
			self = this,
            handHeldDevice = this.getDeviceName();

		if ( qazanaFrontend.isEditMode() && modelCID ) {
			settings = qazanaFrontend.config.elements.data[ modelCID ];

            skinName = settings.attributes._skin;

			jQuery.each( settings.getActiveControls(), function( controlKey ) {
                var newControlKey = controlKey;
                if ( skinName !== 'default' ) {
                    newControlKey = controlKey.replace( skinName + '_', '' );
                }
                elementSettings[ newControlKey ] = settings.attributes[ controlKey ];
			} );
		} else {
            skinName = self.getSkinName() ? self.getSkinName().replace( /-/g, '_' ) : 'default';
                settings = this.$element.data( 'settings' ) || {};

            elementSettings = settings;

			if ( settings && skinName !== 'default' ) {
				jQuery.each( settings, function( controlKey ) {
					var newControlKey = controlKey;
					newControlKey = controlKey.replace( skinName + '_', '' );
					elementSettings[ newControlKey ] = self.getItems( settings, controlKey );
				} );
			}
        }

        if ( handHeldDevice ) {
            jQuery.each( elementSettings, function( controlKey ) {
                if ( typeof elementSettings[ controlKey + '_' + handHeldDevice ] !== 'undefined' ) {
                   elementSettings[ controlKey ] = elementSettings[ controlKey + '_' + handHeldDevice ]; // rewrite main value with mobile version
                }
            } );
        }

		return this.getItems( elementSettings, setting );
    },

    getAnimationSettings: function() {
        return this.$element.data( 'animations' );
    },

    getElementName: function() {
        return 'global';
    },

    splitText: function( settings ) {
        if ( settings && settings.splitText ) {
            this.Text = new SplitText( this.$element );
        }
    },

    animateInBulk: function( settings ) {
        var self = this;

        var $elements = this.$element.find( '.qazana-widget' );

        if ( ! settings || ! settings.inView || ! settings.inView[ 0 ] ) {
            return;
        }

       // var targets = $();

        // $elements.each( function() {
        //     var $el = jQuery( this );
        //     var animations = $el.data( 'animations' );
        //     if ( animations && 'spacer.default' !== $el.data( 'element_type' ) ) {
        //         jQuery.each( animations.inView, function( _i, target ) {
        //             if ( $el.find( target.target ).length > 0 ) {
        //                 targets.add( $el.find( target.target ) );
        //             } else if ( jQuery( target.target ).is( '.qazana-element' ) ) {
        //                 targets.add( $el );
        //             } else {
        //             }
        //         } );
        //     }
        // } );

        self.splitText( settings );
        self.resetElement( $elements.not( 'qazana-widget-spacer' ), settings.inView[ 0 ] );
        self.animateElement( $elements.not( 'qazana-widget-spacer' ), settings.inView[ 0 ] );
    },

    resetElement: function( $targets, animationGroup ) {
        var self = this;

        self.$element.addClass( 'qazana-animation-initialized' ).css( 'transition', 'none' );

        if ( self.needPerspective( animationGroup ) ) {
            self.$element.addClass( 'qazana-perspective' );
        }

        if ( 'blindsLeft' === this.settings._animation_inView_type ) {
            this.$element.find( '.qazana-widget-container' ).append( '<div class="qazana-clipping-wrapper"><div class="qazana-clipping-mask"></div></div>' );
            $targets = this.$element.find( '.qazana-clipping-mask' );
        }

        $targets.addClass( 'qazana-will-change' );

        /** Default animation value */
        var initValues = {
            targets: $targets.get(),
            duration: 0,
            easing: 'linear',
        };

        var animations = jQuery.extend( {},
            animationGroup.initValues,
            initValues
        );

        anime( animations );
    },

    animateElement: function( $targets, animationGroup ) {
        var self = this;

        if ( 'blindsLeft' === this.settings._animation_inView_type ) {
            $targets = this.$element.find( '.qazana-clipping-mask' );
        }

        $targets.addClass( 'qazana-will-change' );

        var defaultValues = {
            targets: $targets.get(),
            duration: animationGroup.duration,
            easing: animationGroup.easing,
            delay: anime.stagger( animationGroup.delay, {
                start: animationGroup.startDelay,
            } ),
            complete: function complete( anime ) {
                self.onAnimationsComplete( anime, animationGroup );
            },
        };

        var animations = jQuery.extend( {}, defaultValues, animationGroup.finalValues );

        anime.remove( $targets.get() );

        anime( animations );
    },

    animate: function( settings ) {
        var self = this;

        if ( ! settings || ! settings.inView || ! settings.inView[ 0 ] ) {
            return;
        }

        jQuery.each( settings.inView, function( _i, animationGroup ) {
            self.resetElement( self.$element.find( animationGroup.target ), animationGroup );
            self.animateElement( self.$element.find( animationGroup.target ), animationGroup );
        } );
    },

    // eslint-disable-next-line no-unused-vars
    onAnimationsComplete: function( anime, _animationGroup ) {
        var self = this;

        jQuery.each( anime.animatables, function( _i, animatable ) {
            var $element = self.$element.find( animatable.target );

            $element.css( {
                transition: '',
            } ).removeClass( 'qazana-will-change' );
        } );

        /* calling textRotator if there's any text-rotator inside the element, or if the element itself is text-rotator */
        // if ( this.$element.find( '[data-text-rotator]' ).length > 0 ) {
        //     new QazanaRotateText( this.$element.find( '[data-text-rotator]' ) );
        // }

        // if ( this.$element.is( '[data-text-rotator]' ) ) {
        //     new QazanaRotateText( this.$element );
        // }
    },

    needPerspective: function( options ) {
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
    },

    svgAnimation: function() {
        new SvgAnimation( this.$element );
    },

    removeLoader: function() {
        this.$element.find( '.qazana-loading-indicator' ).remove();
        this.$element.removeClass( 'qazana-has-loading-indicator' );
        jQuery( window ).trigger( 'resize' );
    },

    targetsIO: function() {
        var self = this;

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

        this.$element.each( function() {
            observer.observe( this );
        } );
    },

    _runAnimations: function() {
        var self = this;

        var animationSettings = this.getAnimationSettings();
        this.settings = this.getElementSettings();

        if ( self.getElementSettings()._animation_enable && -1 !== self.getElementSettings()._animation_trigger.indexOf( 'inView' ) ) {
            if ( ! this.$element.is( '.qazana-widget' ) ) {
                self.animateInBulk( animationSettings );
            } else {
                self.splitText( animationSettings );
                self.animate( animationSettings );
            }
        }
    },

    onInit: function() {
        HandlerModule.prototype.onInit.apply( this, arguments );
        this.svgAnimation();
        this.removeLoader();
        this.targetsIO();
    },

    onElementChange: function( propertyName ) {
        var animationSettings = this.getAnimationSettings();

        if ( /^_?animation/.test( propertyName ) ) {
            this.animate( animationSettings );
        }
    },

} );

module.exports = function( $scope ) {
    new AnimationHandler( {
        $element: $scope,
    } );
};
