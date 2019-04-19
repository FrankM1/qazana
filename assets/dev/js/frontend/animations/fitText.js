/*global jQuery */
/*!
 * FitText.js 1.2
 *
 * Copyright 2011, Dave Rupert http://daverupert.com
 * Released under the WTFPL license
 * http://sam.zoy.org/wtfpl/
 *
 * Date: Thu May 05 14:23:00 2011 -0600
 */
var defaults = {
    parentElClass: '.qazana-element',
	compressor: 1,
	minFontSize: Number.NEGATIVE_INFINITY,
	maxFontSize: Number.POSITIVE_INFINITY,
};

var Plugin = function( $element, options ) {
	this.element = $element.find( options.target ).get( 0 );
	this.$element = $element.find( options.target );

	this.options = $.extend( {}, defaults, options );

	this.init = function() {
		this.setMinFontSize();
		this.setMaxFontSize();
		this.resizer();
		this.onWindowResize();
    };

	this.setMinFontSize = function() {
		var minFontSize = this.options.minFontSize;
		var elementFontSize = this.$element.css( 'fontSize' );

		if ( 'currentFontSize' === minFontSize ) {
			this.options.minFontSize = elementFontSize;
		}
    };

	this.setMaxFontSize = function() {
		var maxFontSize = this.options.maxFontSize;
		var elementFontSize = this.$element.css( 'fontSize' );

		if ( 'currentFontSize' === maxFontSize ) {
			this.options.maxFontSize = elementFontSize;
		}
    };

	this.resizer = function() {
		// if it's a heading, get parent width. because parent is set to display: inline-block
		var elementWidth = this.$element.closest( this.options.parentElClass ).length ? this.$element.parent().width() : this.$element.width();

		this.$element.css( 'font-size', Math.max( Math.min( elementWidth / ( this.options.compressor * 10 ), parseFloat( this.options.maxFontSize ) ), parseFloat( this.options.minFontSize ) ) );
    };

	this.onWindowResize = function() {
		$( window ).on( 'resize.fittext orientationchange.fittext', this.resizer.bind( this ) );
	};

	this.init();
};

module.exports = Plugin;
