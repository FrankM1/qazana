var defaults = {
	delay: 2000,
	activeKeyword: 0,
	duration: 800,
	easing: 'easeInOutCirc',
	animation: 'rotate', // rotate, type,
};

var Plugin = function( $element, options ) {
	var self = this;

	this.element = $element[ 0 ];
	this.$element = $element;

	this.options = jQuery.extend( {}, defaults, options );

	this.$keywordsContainer = jQuery(
		'.qazana-text-rotate-keywords',
		this.element
	);
	this.$keywords = jQuery( '.qazana-text-keyword', this.$keywordsContainer );
	this.keywordsLength = this.$keywords.length;
	this.$activeKeyword = this.$keywords.eq( this.options.activeKeyword );
    this.isFirstItterate = true;

	this.init = function() {
		this.setContainerWidth( this.$activeKeyword );
		this.setIntersectionObserver();

		this.$element.addClass( 'qazana-text-slide-activated' );
	};

	this.getNextKeyword = function() {
		return this.$activeKeyword.next().length ?
			this.$activeKeyword.next() :
			this.$keywords.eq( 0 );
	};

	this.setContainerWidth = function( $keyword ) {
		this.$keywordsContainer.addClass( 'is-changing qazana-ws-nowrap' );

		var keywordContainer = this.$keywordsContainer.get( 0 );

		anime.remove( keywordContainer );

		anime( {
			targets: keywordContainer,
			width: $keyword.outerWidth() + 1,
			duration: this.options.duration / 1.25,
			easing: this.options.easing,
		} );
	};

	this.setActiveKeyword = function( $keyword ) {
		this.$activeKeyword = $keyword;
		$keyword
			.addClass( 'qazana-active' )
			.siblings()
			.removeClass( 'qazana-active' );
	};

	this.slideInNextKeyword = function() {
		var $nextKeyword = this.getNextKeyword();

		this.$activeKeyword.addClass( 'qazana-will-change' );

		anime.remove( $nextKeyword.get( 0 ) );

		anime( {
			targets: $nextKeyword.get( 0 ),
			translateY: [ '65%', '0%' ],
			translateZ: [ -120, 1 ],
			rotateX: [ -95, -1 ],
			opacity: [ 0, 1 ],
			round: 100,
			duration: this.options.duration,
			easing: this.options.easing,
			delay: this.isFirstItterate ?
				this.options.delay / 2 :
				this.options.delay,
			changeBegin: function changeBegin() {
				self.isFirstItterate = false;

				self.setContainerWidth( $nextKeyword );
				self.slideOutAciveKeyword();
			},
			complete: function complete() {
				self.$keywordsContainer.removeClass( 'is-changing qazana-ws-nowrap' );

				self.setActiveKeyword( $nextKeyword );
				self.$keywords.removeClass( 'is-next qazana-will-change' );
				self.getNextKeyword().addClass( 'is-next qazana-will-change' );
			},
		} );
	};

	this.slideOutAciveKeyword = function() {
		var activeKeyword = this.$activeKeyword.get( 0 );

		anime.remove( activeKeyword );

		anime( {
			targets: activeKeyword,
			translateY: [ '0%', '-65%' ],
			translateZ: [ 1, -120 ],
			rotateX: [ 1, 95 ],
			opacity: [ 1, 0 ],
			round: 100,
			duration: this.options.duration,
			easing: this.options.easing,
			complete: function complete() {
				self.slideInNextKeyword();
			},
		} );
	};

	this.initAnimations = function() {
        switch ( this.options.animation ) {
            case 'rotate':
                this.slideInNextKeyword();
                break;

            default:
                this.slideInNextKeyword();
                break;
        }
	};

	this.setIntersectionObserver = function() {
		var inViewCallback = function inViewCallback( entries, observer ) {
			entries.forEach( function( entry ) {
				if ( entry.isIntersecting ) {
					self.initAnimations();
					observer.unobserve( entry.target );
				}
			} );
		};

		var observer = new IntersectionObserver( inViewCallback );

		observer.observe( this.element );
	};

	this.init();
};

module.exports = Plugin;
