var defaults = {
	type: 'words', // "words", "chars", "lines". or mixed e.g. "words, chars"
	forceApply: false,
};

var Plugin = function( element, options ) {
    var self = this;
	this.element = element[ 0 ];
	this.$element = jQuery( element );

	this.options = jQuery.extend( {}, defaults, options );
	this.splittedTextArray = [];
	this.splitTextInstance = null;
	this.isRTL = 'rtl' === jQuery( 'html' ).attr( 'dir' );

	this.init = function() {
		if ( this.options.forceApply ) {
			this._initSplit();
			this._windowResize();

			return false;
		}

		new IntersectionObserver(
			function( enteries, observer ) {
				enteries.forEach( function( entery ) {
					if ( entery.isIntersecting ) {
						self._initSplit();
						self._windowResize();

						observer.unobserve( entery.target );
					}
				} );
			},
			{ rootMargin: '10%' }
		).observe( this.element );
	};
	this._initSplit = function() {
		if ( this.options.forceApply ) {
			this.splitTextInstance = this._doSplit();
			this._onSplittingDone();

			return false;
		}

		this._onFontsLoad();
	};
	this._onFontsLoad = function() {
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
				self.splitTextInstance = self._doSplit();
				self._onSplittingDone();
			},
			function() {
				self.splitTextInstance = self._doSplit();
				self._onSplittingDone();
			}
		);
	};
	this.getSplitTypeArray = function() {
		var type = this.options.type;

		var splitTypeArray = type.split( ',' ).map( function( item ) {
			return item.replace( ' ', '' );
		} );

		if ( ! this.isRTL ) {
			return splitTypeArray;
		}
		return splitTypeArray.filter( function( type ) {
			return type !== 'chars';
		} );
	};
	this._doSplit = function() {
		if (
			this.$element.hasClass( 'split-text-applied' ) ||
			( this.$element.closest( '.tabs-pane' ).length &&
				this.$element.closest( '.tabs-pane' ).is( ':hidden' ) )
		) {
			return false;
		}

		var splitType = this.getSplitTypeArray();

		var splittedText = new SplitText( this.element, {
			type: splitType,
			charsClass: 'qazana-text-chars',
			linesClass: 'qazana-text-lines',
			wordsClass: 'qazana-text-words',
		} );

		jQuery.each( splitType, function( i, type ) {
			jQuery.each( splittedText[ type ], function() {
				self.splittedTextArray.push( this );
			} );
		} );

		this._unitsOp( this.splittedTextArray );

		jQuery( this.element ).addClass( 'split-text-applied' );

		return splittedText;
	};
	this._unitsOp = function( splittedElements ) {
		jQuery.each( splittedElements, function() {
			var $element = jQuery( this ).addClass( 'split-unit' );
			var innerText = $element.text();

			$element.wrapInner(
				'<span data-text="' + innerText + '" class="split-inner" />'
			);
		} );
	};
	this._onSplittingDone = function() {
		var parentColumn = jQuery( this.element ).closest( '.qazana-column' );

		/*
         if it's only a split text, then call textRotator
         Otherwise if it has custom animations, then wait for animations to be done
         and then textRotator will be called from customAnimations
        */
		if (
			jQuery( this.element ).is( '[data-text-rotator]' ) &&
			! this.element.hasAttribute( 'data-custom-animations' ) &&
			parentColumn.length &&
			! parentColumn.get( 0 ).hasAttribute( 'data-custom-animations' )
		) {
			jQuery( this.element ).liquidTextRotator();
		}
	};

    // this._onCollapse = function() {

	// 	jQuery( '[data-toggle="tab"]' ).on( 'shown.bs.tab', function( e ) {
	// 		var href = e.target.getAttribute( 'href' );
	// 		var targetPane = jQuery( e.target )
	// 			.closest( '.tabs' )
	// 			.find( href );
	// 		var element = targetPane.find( self.element );

	// 		if ( ! element.length ) {
	// 			return;
	// 		}

	// 		self.splitText.revert();
	// 		self._doSplit();
	// 	} );
	// };

    this._windowResize = function() {
		var onResize = qazanaFrontend.debounce( 500, this._onWindowResize );

		jQuery( window ).on( 'resize', onResize.bind( this ) );
	};
	this._onWindowResize = function() {
		jQuery( 'html' ).addClass( 'window-resizing' );

		if ( self.splitTextInstance ) {
			self.splitTextInstance.revert();
			self.$element.removeClass( 'split-text-applied' );
		}

		self._onAfterWindowResize();
	};
	this._onAfterWindowResize = function() {
		jQuery( 'html' ).removeClass( 'window-resizing' );

		this.splitTextInstance = this._doSplit();
    };

    this.init();
};

module.exports = Plugin;
