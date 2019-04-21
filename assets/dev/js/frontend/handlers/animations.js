var HandlerModule = require( 'qazana-frontend/handler-module' ),
    AnimationHandler;
var SplitText = require( '../animations/splitText' );

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

        // triggerHandler: 'focus', // "focus", "inview"
        // triggerTarget: 'input',
        // triggerRelation: 'siblings',
        // offTriggerHandler: 'blur',
    },

    getAnimationSettings: function() {
        return this.$element.data( 'animations' );
    },

    getElementName: function() {
        return 'global';
    },

    splitText: function() {
        var settings = this.getAnimationSettings();

        if ( settings.splitText ) {
            this.Text = new SplitText( this.$element );
        }
    },

    animate: function() {
        var self = this;

        var settings = this.getAnimationSettings();

        // if ( 'button.default' === this.$element.data( 'element_type' ) ) {
        //     console.log( settings );
        // }

        if ( ! settings || ! settings.inView || ! settings.inView[ 0 ] ) {
            return;
        }

        jQuery.each( settings.inView, function( _i, animationGroup ) {
            if ( animationGroup.target !== 'all-children' ) {
                self.$element.css( 'transition', 'none' );

                var $target = self.$element.find( animationGroup.target );

                if ( 'inview' === animationGroup.triggerHandler ) {
                    $target.addClass( 'qazana-will-change' );
                }

                /** Default animation value */
                var initValues = {
                    targets: $target.get(),
                    duration: 0,
                    easing: 'linear',
                };

                var animations = jQuery.extend( {},
                    animationGroup.initValues,
                    initValues
                );

                anime( animations );

                self.$element.addClass( 'qazana-animation-initialized' );

                if ( self.needPerspective( animationGroup ) && 'inview' === animationGroup.triggerHandler ) {
                    self.$element.addClass( 'qazana-perspective' );
                }

                self.$element.addClass( 'qazana-perspective' );
            }
        } );

        this.animateInview( settings.inView );
    },

    animateInview: function( inView ) {
        var self = this;

        jQuery.each( inView, function( _i, animationGroup ) {
            if ( animationGroup.target !== 'all-children' ) {
                var $target = self.$element.find( animationGroup.target );

                if ( 'inview' === animationGroup.triggerHandler ) {
                    $target.addClass( 'qazana-will-change' );
                }

                /** Default animation value */
                var defaultValues = {
                    targets: $target.get(),
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

                console.log( animationGroup.finalValues );

                anime.remove( $target.get() );

                anime( animations );
            }
        } );
    },

    onAnimationsComplete: function( anime, animationGroup ) {
        var self = this;

        jQuery.each( anime.animatables, function( _i, animatable ) {
            // eslint-disable-next-line no-shadow
            var $element = self.$element.find( animatable.target );

            $element.css( {
                transition: '',
            } ).removeClass( 'qazana-will-change' );

            if ( 'inview' === animationGroup.triggerHandler && $element.is( '.btn' ) ) {
                $element.css( {
                    transform: '',
                } );
            }
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

    removeLoader: function() {
        this.$element.find( '.qazana-loading-indicator' ).remove();
        this.$element.removeClass( 'qazana-has-loading-indicator' );
        jQuery( window ).trigger( 'resize' );
    },

    onInit: function() {
        var self = this;
        HandlerModule.prototype.onInit.apply( this, arguments );
        self.removeLoader();

        if ( self.$element.is( '[data-custom-animations]' ) ) {
         // self.splitText();
            self.animate();
        }
    },

    onElementChange: function( propertyName ) {
        if ( /^_?animation/.test( propertyName ) ) {
            this.animate();
        }
    },

} );

module.exports = function( $scope ) {
    new AnimationHandler( {
        $element: $scope,
    } );
};
