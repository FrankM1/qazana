var defaults = {
    color: '#f42958',
    hoverColor: null,
    type: 'delayed',
    delay: 0,
    animated: true,
    duration: 100,
    resetOnHover: false,
    customColorApplied: false,
    gradientColor: [ '#f42958', '#f42958' ],
    hoverGradientColor: [ '#f42958', '#f42958' ],
};

var Plugin = function( $element ) {
    this.element = $element.get( 0 );
    this.$element = $element;

    if ( ! this.$element.data( 'animations' ) || ! this.$element.data( 'animations' ).svg ) {
        return false;
    }

    var options = this.$element.data( 'animations' ).svg;

    if ( options.color ) {
        options.customColorApplied = true;
    }

    this.options = jQuery.extend( {}, defaults, options );

    this.$iconContainer = this.$element.find( this.options[ 0 ].target );
    this.$obj = this.$iconContainer.children( 'svg' ); // used .children() because there's also .svg-icon-holder svg element

    this.init = function() {
        if ( ! this.$obj.length ) {
            return false;
        }

        anime( {
            targets: this.$iconContainer.get(),
            opacity: 1,
        } );

        if ( this.$element.find( '.svg-icon-holder' ).data( 'animate-icon' ) ) {
            this.animateIcon();
        } else {
            this.addColors( this.$element );
        }

        // var args = {
        //     triggerElement: this.$obj.get(),
        //     offset: 10,
        // };

        // qazanaFrontendExt.inView( args, function() {
        //    console.log( 'inview' );
        // } );
    };

    this.animateIcon = function() {
        var self = this;

        var vivusObj = new Vivus( self.$obj.get( 0 ), {
            type: self.options.type,
            duration: self.options.duration,
           // pathTimingFunction: Vivus.EASE_OUT,
           // animTimingFunction: Vivus.LINEAR,
            //start: 'manual',
            onReady: function onReady( vivus ) {
                self.addColors.call( self, vivus );
            },

        } ).setFrameProgress( 1 );

        this.animate( vivusObj );
    };

    this.addColors = function() {
        var gid = Math.round( Math.random() * 1000000 );
        var hoverGradientValues = this.options.hoverGradientColor;
        var gradientValues = this.options.gradientColor;

        var strokegradients = null;
        var strokeHoverGradients = document.createElementNS( 'http://www.w3.org/2000/svg', 'style' );

        strokegradients = '<defs xmlns="http://www.w3.org/2000/svg">';
            strokegradients += '<linearGradient gradientUnits="userSpaceOnUse" id="grad' + gid + '" x1="0%" y1="0%" x2="0%" y2="100%">';
            strokegradients += '<stop offset="0%" stop-color="' + gradientValues[ 0 ] + '" />';
            strokegradients += '<stop offset="100%" stop-color="' + gradientValues[ 1 ] + '" />';
        strokegradients += '</linearGradient>';
        strokegradients += '</defs>';

        var xmlStrokegradients = new DOMParser().parseFromString( strokegradients, 'text/xml' );

        strokeHoverGradients = this.$obj.prepend( xmlStrokegradients.documentElement );

        if ( null !== hoverGradientValues ) {
            strokeHoverGradients.innerHTML = '.qazana-element-' + this.$element.data( 'id' ) + ':hover .svg-icon-holder defs stop:first-child { stop-color:' + hoverGradientValues[ 0 ] + '; }' + '#' + this.$element.data( 'id' ) + ':hover .svg-icon-holder defs stop:last-child { stop-color:' + hoverGradientValues[ 1 ] + '; }';
            this.$obj.prepend( strokeHoverGradients );
        }

        if ( this.options.customColorApplied ) {
            this.$obj.find( 'path, rect, ellipse, circle, polygon, polyline, line' ).attr( {
                stroke: 'url(#grad' + gid + ')',
                fill: 'none',
            } );
        }

        this.$element.addClass( 'qazana-icon-animating' );
    };

    this.animate = function( vivusObj ) {
        var self = this;

        var delayTime = parseInt( self.options.delay, 10 );
        var duration = self.options.duration;

        if ( self.options.animated ) {
            vivusObj.reset().stop();

            var inViewCallback = function( entries, observer ) {
                entries.forEach( function( entry ) {
                    if ( entry.isIntersecting && 'start' === vivusObj.getStatus() && vivusObj.getStatus() !== 'progress' ) {
                        self.resetAnimate( vivusObj, delayTime, duration );
                        self.eventHandlers( vivusObj, delayTime, duration );

                        observer.unobserve( entry.target );
                    }
                } );
            };

            var observer = new IntersectionObserver( inViewCallback, self.options );

            observer.observe( this.element );
        }
    };

    this.eventHandlers = function( vivusObj, delayTime, duration ) {
        var self = this;

        jQuery( document ).on( 'shown.bs.tab', 'a[data-toggle="tab"]', function( event ) {
            var $target = jQuery( jQuery( event.currentTarget ).attr( 'href' ) );

            if ( $target.find( self.element ).length ) {
                self.resetAnimate.call( self, vivusObj, delayTime, duration );
            }
        } );

        if ( self.options.resetOnHover ) {
            this.$element.on( 'mouseenter', function() {
                if ( 'end' === vivusObj.getStatus() ) {
                    self.resetAnimate( vivusObj, 0, duration );
                }
            } );
        }
    };

    this.resetAnimate = function( vivusObj, delay, duration ) {
        vivusObj.stop().reset();

        setTimeout( function() {
            vivusObj.play( duration / 100 );
        }, delay );

        // anime( {
        //     targets: this.$iconContainer.get(),
        //     opacity: 0,
        // } );
    };

    this.init();
};

module.exports = Plugin;
