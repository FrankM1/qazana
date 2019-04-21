var QazanaRotateText = require( './textRotator' );
var SplitText = require( '../utils/splitText' );

var defaults = {
    target: '',
    type: 'words', // "words", "chars", "lines". or mixed e.g. "words, chars"
    forceApply: false,
};

var Plugin = function( $element ) {
    var self = this;
    this.element = $element[ 0 ];
    this.$element = $element;

    var options = this.$element.data( 'animations' ).splitText;

    this.options = jQuery.extend( {}, defaults, options );
    this.splittedTextArray = [];
    this.splitTextInstance = null;
    this.isRTL = 'rtl' === jQuery( 'html' ).attr( 'dir' );

    this.init = function() {
        this.splitTextInstance = this._doSplit();
        this._onSplittingDone();
        this._windowResize();
    };

    this.getSplitTypeArray = function() {
        var type = this.options.type;

        var splitTypeArray = type.split( ',' ).map( function( item ) {
            return item.replace( ' ', '' );
        } );

        if ( ! this.isRTL ) {
            return splitTypeArray;
        }

        return splitTypeArray.filter( function( splitType ) {
            return splitType !== 'chars';
        } );
    };

    this._doSplit = function() {
        if ( this.$element.hasClass( 'qazana-split-text-applied' ) ) {
            return false;
        }

        var splitType = this.getSplitTypeArray();

        var targetElement = this.options.target ? this.$element.find( this.options.target ).get( 0 ) : this.element;

        var splittedText = new SplitText( targetElement, {
            type: splitType,
            charsClass: 'qazana-text-chars',
            linesClass: 'qazana-text-lines',
            wordsClass: 'qazana-text-words',
        } );

        jQuery.each( splitType, function( i, type ) {
            jQuery.each( splittedText[ type ], function( i, element ) {
                self.splittedTextArray.push( element );
            } );
        } );

        this._unitsOp( this.splittedTextArray );

        this.$element.addClass( 'qazana-split-text-applied' );

        return splittedText;
    };

    this._unitsOp = function( splittedElements ) {
        jQuery.each( splittedElements, function( i, element ) {
            var $splitUnit = jQuery( element ).addClass( 'qazana-split-unit' );
            var innerText = $splitUnit.text();

            $splitUnit.wrapInner( '<span data-text="' + innerText + '" class="qazana-split-inner" />' );
        } );
    };

    this._onSplittingDone = function() {
        var parentColumn = this.$element.closest( '.qazana-column' );

        /**
         * if it's only a split text, then call textRotator
         * Otherwise if it has custom animations, then wait for animations to be done
         * and then textRotator will be called from customAnimations
         */
        if (
            this.$element.is( '[data-text-rotator]' ) &&
            ! this.element.hasAttribute( 'data-custom-animations' ) &&
            parentColumn.length &&
            ! parentColumn.get( 0 ).hasAttribute( 'data-custom-animations' )
        ) {
            new QazanaRotateText( this.$element, this.$element.data( 'text-rotator' ) );
        }
    };

    this._onCollapse = function() {
        jQuery( '[data-toggle="tab"]' ).on( 'shown.bs.tab', function( e ) {
            var href = e.target.getAttribute( 'href' );
            var targetPane = jQuery( e.target )
                .closest( '.tabs' )
                .find( href );
            var element = targetPane.find( self.element );

            if ( ! element.length ) {
                return;
            }

            self.splitText.revert();
            self._doSplit();
        } );
    };

    this._windowResize = function() {
        var onResize = qazanaFrontend.debounce( 500, this._onWindowResize );

        jQuery( window ).on( 'resize', onResize.bind( this ) );
    };

    this._onWindowResize = function() {
        jQuery( 'html' ).addClass( 'window-resizing' );

        if ( self.splitTextInstance ) {
            self.splitTextInstance.revert();
            self.$element.removeClass( 'qazana-split-text-applied' );
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
