var CustomEntryAnimation = function( $element, settings ) {
	this.runAnimation = function( $item, recurring ) {
		$item.addClass( 'qazana-item-animated' );

		var self = this;
		var animation = settings.animation_type;
		var animationLoop = settings.animation_loop;
		var animationDuration = settings.animation_duration;
		var delay = settings.animation_delay;
		var stagger = settings.animation_stagger;
		var $animatedElement = $item;
		var animateChild = false;

		if (
			$item.hasClass( 'qazana-widget' ) ||
			$item.hasClass( 'qazana-animate-child' )
		) {
			$animatedElement = $item.find( '>:first-child' );
			animateChild = true;
		}

		if ( animation ) {
			$animatedElement.velocity( animation, {
				stagger: stagger,
				delay: delay,
				duration: animationDuration,
				display: '',
				begin: function( element ) {
					if ( animateChild ) {
						jQuery( element )
							.parent()
							.addClass( 'visible' );
					}
				},
				complete: function() {
					recurring++;
					if ( recurring < animationLoop || true === animationLoop ) {
						self.runAnimation( $item, recurring );
					} else {
						$item.css( 'transform', '' );
					}
				},
			} );
		}
	};

	this.animateVisible = function( value ) {
		var self = this;
		var $items = jQuery();

		value.each( function() {
			if ( ! jQuery( this ).hasClass( 'qazana-item-animated' ) ) {
				if ( jQuery( this ).inView() ) {
					if ( jQuery( this ).hasClass( 'animation-stagger' ) ) {
						$items = $items.add( jQuery( this ) );
					} else {
						self.runAnimation( jQuery( this ), 0 );
					}
				}
			}
		} );

		if ( $items.length ) {
			self.runAnimation( $items, 0 );
		}
	};

	this.init = function() {
		var self = this;
		self.animateVisible( $element );
		jQuery( window ).scroll( function() {
			self.animateVisible( $element );
		} );
	};
};

module.exports = CustomEntryAnimation;
