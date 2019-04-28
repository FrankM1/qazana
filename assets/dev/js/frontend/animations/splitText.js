import { QazanaRotateText } from './textRotator';
import Splitting from 'splitting';

var defaults = {
    target: '',
    type: 'words', // "words", "chars", "lines".
    exclude: '.qazana-text-rotate-keywords',
};

export default class SplitText {
    constructor( $element ) {
        var self = this;

        this.element = $element[ 0 ];
        this.$element = $element;

        var targets = ( this.$element.data( 'animations' ) && this.$element.data( 'animations' ).splitText ) ? this.$element.data( 'animations' ).splitText : {};

        this.options = targets.map( function( target ) {
            var item = jQuery.extend( {}, defaults, target );
            item.target = self.$element.find( item.target ).get();
            return item;
        } );

        this.splitTextInstance = null;
        this.isRTL = 'rtl' === jQuery( 'html' ).attr( 'dir' );

        this.init();
    }

    init() {
        this.splitTextInstance = this._doSplit();
        this._onSplittingDone();
        this._windowResize();
    }

    _doSplit() {
        if ( this.$element.hasClass( 'qazana-split-text-applied' ) ) {
            return false;
        }

        var splitTextInstance = [];

        jQuery.each( this.options, function( _i, options ) {
            splitTextInstance.push( new Splitting( options ) );
        } );

        this.$element.addClass( 'qazana-split-text-applied' );

        return splitTextInstance;
    }

    _onSplittingDone() {
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
            ! parentColumn.get().hasAttribute( 'data-custom-animations' )
        ) {
            new QazanaRotateText( this.$element, this.$element.data( 'text-rotator' ) );
        }
    }

    _onCollapse() {
        var self = this;

        jQuery( '[data-toggle="tab"]' ).on( 'shown.bs.tab', function( e ) {
            var href = e.target.getAttribute( 'href' );
            var targetPane = jQuery( e.target )
                .closest( '.tabs' )
                .find( href );
            var element = targetPane.find( self.element );

            if ( ! element.length ) {
                return;
            }

            self._doSplit();
        } );
    }

    _onWindowResize() {
        var self = this;

        if ( self.splitTextInstance ) {
            self.$element.removeClass( 'qazana-split-text-applied' );
        }

        self._onAfterWindowResize();
    }

    _windowResize() {
        var onResize = qazanaFrontend.debounce( 500, this._onWindowResize );

        jQuery( window ).on( 'resize', onResize.bind( this ) );
    }

    _onAfterWindowResize() {
        this.splitTextInstance = this._doSplit();
    }
}
