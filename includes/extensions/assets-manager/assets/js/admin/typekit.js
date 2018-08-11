module.exports = function() {
	var self = this;
	self.cacheElements = function() {
		this.cache = {
			$button: jQuery( '#qazana_typekit_validate_button' ),
			$kitIdField: jQuery( '#qazana_typekit-kit-id' ),
			$dataLabelSpan: jQuery( '.qazana-pro-typekit-data')
		};
	};
	self.bindEvents = function() {
		var self = this;
		this.cache.$button.on( 'click', function( event ) {
			event.preventDefault();
			self.fetchFonts();
		});

		this.cache.$kitIdField.on( 'change', function( event ) {
			self.setState( 'clear' );
		} );
	};
	self.fetchFonts = function() {
		this.setState( 'loading' );
		this.cache.$dataLabelSpan.addClass( 'hidden' );

		var self = this,
			kitID = this.cache.$kitIdField.val();

		if ( '' === kitID ) {
			this.setState( 'clear' );
			return;
		}

		jQuery.post( ajaxurl, {
			action: 'qazana_admin_fetch_fonts',
			kit_id: kitID,
			_nonce: self.cache.$button.data( 'nonce' )
		} ).done( function( data ) {
			if ( data.success ) {
				var template = self.cache.$button.data( 'found' );
				template = template.replace( '{{count}}', data.data.count );
				self.cache.$dataLabelSpan.html( template ).removeClass( 'hidden' );
				self.setState( 'success' );
			} else {
				self.setState( 'error' );
			}
		} ).fail( function() {
			self.setState();
		} );
	};
	self.setState = function( type ){
		var classes = [ 'loading', 'success', 'error' ],
			currentClass, classIndex;

		for ( classIndex in classes ) {
			currentClass = classes[ classIndex ];
			if ( type === currentClass ) {
				this.cache.$button.addClass( currentClass );
			} else {
				this.cache.$button.removeClass( currentClass );
			}
		}
	};
	self.init = function() {
		this.cacheElements();
		this.bindEvents();
	};
	self.init();
};