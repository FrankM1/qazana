module.exports = {
	$btn: null,
	fileId: null,
	fileUrl: null,
	fileFrame: [],

	selectors: {
		uploadBtnClass: 'elementor-upload-btn',
		clearBtnClass: 'elementor-upload-clear-btn',
		uploadBtn: '.elementor-upload-btn',
		clearBtn: '.elementor-upload-clear-btn'
	},

	hasValue: function() {
		return ( '' !== jQuery( this.fileUrl ).val() );
	},

	setLabels: function( $el ) {
		if ( ! this.hasValue() ) {
			$el.val( $el.data( 'upload_text' ) );
		} else {
			$el.val( $el.data( 'remove_text' ) );
		}
	},

	setFields: function( el ) {
		var self = this;
		self.fileUrl = jQuery( el ).prev();
		self.fileId = jQuery( self.fileUrl ).prev();
		jQuerybtn = jQuery( el );
	},

	setUploadParams: function( ext, name ) {
		var self = this;
		self.fileFrame[ name ].uploader.uploader.param( 'uploadeType', ext );
		self.fileFrame[ name ].uploader.uploader.param( 'uploadeTypecaller', 'elementor-admin-upload' );
	},

	replaceButtonClass: function( el ) {
		if ( this.hasValue() ) {
			jQuery( el ).removeClass( this.selectors.uploadBtnClass ).addClass( this.selectors.clearBtnClass );
		} else {
			jQuery( el ).removeClass( this.selectors.clearBtnClass ).addClass( this.selectors.uploadBtnClass );
		}
		this.setLabels( el );
	},

	uploadFile: function( el ) {
		var self = this,
			$el = jQuery( el ),
			mime = $el.attr( 'data-mime_type' ) || '',
			ext = $el.attr( 'data-ext' ) || false,
			name = $el.attr( 'id' );
		// If the media frame already exists, reopen it.
		if ( 'undefined' !== typeof self.fileFrame[ name ] ) {
			if ( ext ) {
				self.setUploadParams( ext, name );
			}

			self.fileFrame[ name ].open();

			return;
		}

		// Create the media frame.
		self.fileFrame[ name ] = wp.media( {
			library: {
				type: mime.split( ',' )
			},
			title: $el.data( 'box_title' ),
			button: {
				text: $el.data( 'box_action' )
			},
			multiple: false
		} );


		// When an file is selected, run a callback.
		self.fileFrame[ name ].on( 'select', function() {
			// We set multiple to false so only get one image from the uploader
			var attachment = self.fileFrame[ name ].state().get( 'selection' ).first().toJSON();
			// Do something with attachment.id and/or attachment.url here
			jQuery( self.fileId ).val( attachment.id );
			jQuery( self.fileUrl ).val( attachment.url );
			self.replaceButtonClass( el );
			self.updatePreview( el );
		});

		// Finally, open the modal
		self.fileFrame[ name ].open();
		if ( ext ) {
			self.setUploadParams( ext, name );
		}
	},

	updatePreview: function( el ) {
		var self = this,
			$ul = jQuery( el ).parent().find( 'ul' ),
			$li = jQuery( '<li>' ),
			showUrlType = jQuery( el ).data( 'preview_anchor' ) || 'full';

		$ul.html( '' );

		if ( self.hasValue() && 'none' !== showUrlType ) {
			var anchor = jQuery( self.fileUrl ).val();
			if ( 'full' !== showUrlType ) {
				anchor = anchor.substring( anchor.lastIndexOf( '/' ) + 1 );
			}

			$li.html( '<a href="' + jQuery( self.fileUrl ).val() + '" download>' + anchor + '</a>' );
			$ul.append( $li );
		}
	},

	setup: function() {
		var self = this;
		jQuery( self.selectors.uploadBtn + ', ' + self.selectors.clearBtn ).each( function() {
			self.setFields( jQuery( this ) );
			self.updatePreview( jQuery( this ) );
			self.setLabels( jQuery( this ) );
			self.replaceButtonClass( jQuery( this ) );
		});
	},

	init: function() {
		var self = this;

		jQuery( document ).on( 'click', self.selectors.uploadBtn, function( event ) {
			event.preventDefault();
			self.setFields( jQuery( this ) );
			self.uploadFile( jQuery( this ) );
		} );

		jQuery( document ).on( 'click', self.selectors.clearBtn, function( event ) {
			event.preventDefault();
			self.setFields( jQuery( this ) );
			jQuery( self.fileUrl ).val( '' );
			jQuery( self.fileId ).val( '' );

			self.updatePreview( jQuery( this ) );
			self.replaceButtonClass( jQuery( this ) );
		} );

		this.setup();

		jQuery( document ).on( 'onRepeaterNewRow', function() {
			self.setup();
		} );
	}
};