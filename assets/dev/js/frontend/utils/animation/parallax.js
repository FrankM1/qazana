/**
 * @copyright Greg Priday - <https://siteorigin.com/>
 * @license GPL 3.0 http://www.gnu.org/licenses/gpl.html
 */
( function( $ ) {
	$.fn.qazanaParallax = function( options ) {
		var $element = $( this );

		if ( 'refreshParallax' === options ) {
			return $element.trigger( 'refreshParallax' );
		}

		options = $.extend( {
			// We need to know the background image URL to use
			backgroundUrl: null,
			// And the exact size of that image
			backgroundSize: null,
			// We can work out the aspect ratio from the size
			backgroundAspectRatio: null,
			// How we want to handle sizing of the background image
			backgroundSizing: 'scaled',
			// Should we limit the amount of motion in the background image
			// The number of pixels the background image can move for every pixel of scrolling
			limitMotion: 'auto',
		}, options );

		if ( null === options.backgroundAspectRatio ) {
			options.backgroundAspectRatio = options.backgroundSize[ 0 ] / options.backgroundSize[ 1 ];
		}

		var setupParallax = function() {
			try {
				var wrapperSize = [
					$element.outerWidth(),
					$element.outerHeight(),
				];

				var bounding = $element[ 0 ].getBoundingClientRect();
				var windowHeight = $( window ).outerHeight();

				if ( $element.data( 'qazana-parallax-init' ) === undefined ) {
					// Do the initial setup
					$element.css( {
						'background-image': 'url(' + options.backgroundUrl + ')',
					} );
				}

				var limitMotion;
				if ( 'auto' === options.limitMotion ) {
					if ( windowHeight < 720 ) {
						limitMotion = 0.55;
					} else if ( windowHeight > 1300 ) {
						limitMotion = 0.45;
					} else {
						limitMotion = ( -0.00017 * ( windowHeight - 720 ) ) + 0.55;
					}
				} else {
					limitMotion = parseFloat( options.limitMotion );
				}

				// What percent is this through a screen cycle
				// -1 is when the bottom of the wrapper is at the top of the screen
				// 1 is when the top of the wrapper is at the bottom of the screen
				var position = ( bounding.bottom + ( bounding.top - windowHeight ) ) / ( windowHeight + bounding.height );
				var percent = ( position - 1 ) / -2;
				var topPosition = 0;
				var limitScale = 1;
				var backgroundSize = options.backgroundSize;

				// Do the setup for every time something changes
				if ( 'scaled' === options.backgroundSizing ) {
					// This is the required Y height to create a parallax effect
					var finalY = wrapperSize[ 1 ] / ( limitMotion ? limitMotion : 1 );
					var scaleBG = wrapperSize[ 0 ] / backgroundSize[ 0 ]; // The initial scaling is based on container width

					if ( finalY > backgroundSize[ 1 ] * scaleBG ) {
						// This image wouldn't be tall enough to give a decent parallax effect, so we'll scale it up
						scaleBG = finalY / backgroundSize[ 1 ];
						limitMotion = false;
					}

					$element.css(
						'background-size',
						( backgroundSize[ 0 ] * scaleBG ) + 'px ' +
						( backgroundSize[ 1 ] * scaleBG ) + 'px'
					);

					// Work out the top position
					if ( bounding.top > -wrapperSize[ 1 ] && bounding.bottom - windowHeight < wrapperSize[ 1 ] ) {
						// This is the scaled background height
						var backgroundHeight = backgroundSize[ 1 ] * scaleBG;

						// Check if we need to limit the amount of motion in the background image
						if ( limitMotion && backgroundHeight > windowHeight * limitMotion ) {
							// Work out how much to scale percent position based on how much motion we want.
							limitScale = ( windowHeight * limitMotion ) / ( backgroundHeight );
							// Percent is scaled so that the midpoint is still 0.5
							percent = ( percent * limitScale ) + ( ( 1 - limitScale ) / 2 );
						}
						topPosition = -( backgroundHeight - wrapperSize[ 1 ] ) * percent;
					}

					$element.css( 'background-position', '50% ' + topPosition + 'px' );
				} else if ( 'original' === options.backgroundSizing ) {
					// See scaled version or explanation of this code.
					if ( limitMotion && backgroundSize[ 1 ] > windowHeight * limitMotion ) {
						limitScale = ( windowHeight * limitMotion ) / ( backgroundSize[ 1 ] );
						percent = ( percent * limitScale ) + ( ( 1 - limitScale ) / 2 );
					}

					// In this case, the background height is always the background size
					topPosition = -( backgroundSize[ 1 ] - wrapperSize[ 1 ] ) * percent;

					// This is a version with no scaling
					$element.css( 'background-size', 'auto' );
					$element.css( 'background-position', '50% ' + topPosition + 'px' );
				}
			} catch ( err ) {
				$element.css( {
					'background-size': 'scaled' === options.backgroundSizing ? 'cover' : 'auto',
					'background-position': '50% 50%',
				} );
			}
		};
		setupParallax();

		// All the events where we'll need to change the parallax
		$( window ).on( 'scroll', setupParallax );
		$( window ).on( 'resize', setupParallax );
		$element.on( 'refreshParallax', setupParallax );
		// Ensure that the parallax has run on initial load.
		setTimeout( function() {
			setupParallax();
		}, 100 );
	};
}( jQuery ) );
