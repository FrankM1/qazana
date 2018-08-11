module.exports =  {
	selectors: {
		add: '.add-repeater-row',
		remove: '.remove-repeater-row',
		toggle: '.toggle-repeater-row',
		close: '.close-repeater-row',
		sort: '.sort-repeater-row',
		table: '.form-table',
		block: '.repeater-block',
		repeaterLabel: '.repeater-title',
		repeaterField: '.elementor-field-repeater'
	},

	counters: [],

	trigger: function( eventName , params ) {
		jQuery( document ).trigger( eventName, params );
	},

	triggerHandler: function( eventName, params ) {
		return jQuery( document ).triggerHandler( eventName, params );
	},

	countBlocks: function( $btn ) {
		return $btn.closest( this.selectors.repeaterField ).find( this.selectors.block ).length || 0;
	},

	add: function( btn, event ) {
		var self = this,
			$btn = jQuery( btn ),
			id = $btn.data( 'template-id' ),
			repeaterBlock;
		if ( ! self.counters.hasOwnProperty( id ) ) {
			self.counters[ id ] = self.countBlocks( $btn );
		}
		self.counters[ id ] += 1;
		repeaterBlock = jQuery( '#' + id ).html();
		repeaterBlock = self.replaceAll( '__counter__', self.counters[ id ], repeaterBlock );
		$btn.before( repeaterBlock );
		self.trigger( 'onRepeaterNewRow', [ $btn, $btn.prev() ] );
	},

	remove: function( btn, event ) {
		var self = this;
		jQuery( btn ).closest( self.selectors.block ).remove();
	},

	toggle: function( btn, event ) {
		var self = this,
			$btn = jQuery( btn ),
			$table = $btn.closest( self.selectors.block ).find( self.selectors.table ),
			$toggleLabel = $btn.closest( self.selectors.block ).find( self.selectors.repeaterLabel );

		$table.toggle( 0, 'none', function() {
			if ( $table.is( ':visible' ) ) {
				$table.closest( self.selectors.block ).addClass( 'block-visible' );
				self.trigger( 'onRepeaterToggleVisible', [ $btn, $table, $toggleLabel ] );
			} else {
				$table.closest( self.selectors.block ).removeClass( 'block-visible' );
				self.trigger( 'onRepeaterToggleHidden', [ $btn, $table, $toggleLabel ] );
			}
		} );

		$toggleLabel.toggle();

		// Update row label
		self.updateRowLabel( btn );
	},

	close: function( btn, event ) {
		var self = this,
			$btn = jQuery( btn ),
			$table = $btn.closest( self.selectors.block ).find( self.selectors.table ),
			$toggleLabel = $btn.closest( self.selectors.block ).find( self.selectors.repeaterLabel );

		$table.closest( self.selectors.block ).removeClass( 'block-visible' );
		$table.hide();
		self.trigger( 'onRepeaterToggleHidden', [ $btn, $table, $toggleLabel ] );
		$toggleLabel.show();
		self.updateRowLabel( btn );
	},

	updateRowLabel: function( btn ) {
		var self = this,
			$btn = jQuery( btn ),
			$table = $btn.closest( self.selectors.block ).find( self.selectors.table ),
			$toggleLabel = $btn.closest( self.selectors.block ).find( self.selectors.repeaterLabel );

		var selector = $toggleLabel.data( 'selector' );
		// For some browsers, `attr` is undefined; for others,  `attr` is false.  Check for both.
		if ( typeof selector !== typeof undefined && false !== selector ) {
			var value = false,
				std = $toggleLabel.data( 'default' );

			if ( $table.find( selector ).length ) {
				value = $table.find( selector ).val();
			}

			//filter hook
			var computedLabel = false;
			computedLabel = self.triggerHandler( 'repeaterComputedLabel', [ $table, $toggleLabel, value ] );

			// For some browsers, `attr` is undefined; for others,  `attr` is false.  Check for both.
			if (typeof computedLabel !== typeof undefined && false !== computedLabel ) {
				value = computedLabel;
			}

			// Fallback to default row label
			if ( typeof value === typeof undefined || false === value ) {
				value = std;
			}

			$toggleLabel.html( value );
		}
	},

	replaceAll: function( search, replace, string) {
		return string.replace( new RegExp( search, 'g' ), replace );
	},

	init: function() {
		var self = this;
		jQuery( document )
			.on( 'click', this.selectors.add, function( event ) {
				event.preventDefault();
				self.add( jQuery( this ), event );
			} )
			.on( 'click', this.selectors.remove, function( event ) {
				event.preventDefault();
				var result = confirm( jQuery( this ).data( 'confirm' ).toString() );
				if ( ! result ) {
					return;
				}
				self.remove( jQuery( this ), event );
			} )
			.on( 'click', this.selectors.toggle, function( event ) {
				event.preventDefault();
				event.stopPropagation();
				self.toggle( jQuery( this ), event );
			} )
			.on( 'click', this.selectors.close, function( event ) {
				event.preventDefault();
				event.stopPropagation();
				self.close( jQuery( this ), event );
			} );

		jQuery( this.selectors.toggle ).each( function() {
			self.updateRowLabel( jQuery( this ) );
		} );

		this.trigger( 'onRepeaterLoaded', [ this ] );
	}
};