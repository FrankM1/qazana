(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
jQuery(function () {

    var fontManager = require('./font-manager'),
        typekitAdmin = require('./typekit');

    new fontManager().init();
    new typekitAdmin();
});
},{"./font-manager":4,"./typekit":5}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
module.exports = function() {
	var self = this;

	self.fields = {
		upload: require( './fields/upload' ),
		repeater: require( './fields/repeater' )
	};

	self.selectors = {
		editPageClass: 'post-type-qazana_font',
		title: '#title',
		repeaterBlock: '.repeater-block',
		repeaterTitle: '.repeater-title',
		removeRowBtn: '.remove-repeater-row',
		editRowBtn: '.toggle-repeater-row',
		closeRowBtn: '.close-repeater-row',
		styleInput: '.font_style',
		weightInput: '.font_weight',
		customFontsMetaBox: '#qazana-font-custommetabox',
		closeHandle: 'button.handlediv',
		toolbar: '.qazana-field-toolbar',
		inlinePreview: '.inline-preview',
		fileUrlInput: '.qazana-field-file input[type="text"]'
	};

	self.fontLabelTemplate = '<ul class="row-font-label"><li class="row-font-weight">{{weight}}</li><li class="row-font-style">{{style}}</li><li class="row-font-preview">{{preview}}</li>{{toolbar}}</ul>';

	self.renderTemplate = function( tpl, data ) {
		var re = /{{([^}}]+)?}}/g, match;
		while ( match = re.exec( tpl ) ) {
			tpl = tpl.replace( match[ 0 ], data[ match[ 1 ] ] );
		}
		return tpl;
	};

	self.ucFirst = function ( string ) {
		return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
	};

	self.getPreviewStyle = function( $table ) {
		var self = qazanaProAdmin.assetsManager.fontManager,
			fontFamily = jQuery( self.selectors.title ).val(),
			style = $table.find( 'select' + self.selectors.styleInput ).first().val(),
			weight = $table.find( 'select' + self.selectors.weightInput ).first().val();

		return {
			style: self.ucFirst( style ),
			weight: self.ucFirst( weight ),
			styleAttribute: 'font-family: ' + fontFamily + ' ;font-style: ' + style + '; font-weight: ' + weight + ';'
		};
	};

	self.updateRowLabel = function( event, $table, $label, value ) {
		var self = qazanaProAdmin.assetsManager.fontManager,
			$block = $table.closest( self.selectors.repeaterBlock ),
			$deleteBtn = $block.find( self.selectors.removeRowBtn ).first(),
			$editBtn = $block.find( self.selectors.editRowBtn ).first(),
			$closeBtn = $block.find( self.selectors.closeRowBtn ).first(),
			$toolbar = $table.find( self.selectors.toolbar ).last().clone(),
			previewStyle = self.getPreviewStyle( $table ),
			toolbarHtml;

		if ( $editBtn.length > 0) {
			$editBtn.not( self.selectors.toolbar + ' ' + self.selectors.editRowBtn ).remove();
		}

		if ( $closeBtn.length > 0) {
			$closeBtn.not( self.selectors.toolbar + ' ' + self.selectors.closeRowBtn ).remove();
		}

		if ( $deleteBtn.length > 0) {
			$deleteBtn.not( self.selectors.toolbar + ' ' + self.selectors.removeRowBtn ).remove();
		}

		toolbarHtml =  jQuery( '<li class="row-font-actions">' ).append( $toolbar )[0].outerHTML;

		return self.renderTemplate( self.fontLabelTemplate, {
			weight: '<span class="label">Weight:</span>' + previewStyle.weight,
			style: '<span class="label">Style:</span>' + previewStyle.style,
			preview: '<span style="' + previewStyle.styleAttribute + '">Elementor is making the web beautiful</span>',
			toolbar: toolbarHtml
		});
	};

	self.onRepeaterToggleVisible = function( event, $btn, $table, $toggleLabel ) {
		var self = qazanaProAdmin.assetsManager.fontManager,
			$previewElement = $table.find( self.selectors.inlinePreview ),
			previewStyle = self.getPreviewStyle( $table );

		$previewElement.attr( 'style', previewStyle.styleAttribute );
	};

	self.onRepeaterNewRow = function( event, $btn, $block ) {
		var self = qazanaProAdmin.assetsManager.fontManager;
		$block.find( self.selectors.removeRowBtn ).first().remove();
		$block.find( self.selectors.editRowBtn ).first().remove();
		$block.find( self.selectors.closeRowBtn ).first().remove();
	};

	self.maybeToggle = function( event ) {
		var self = qazanaProAdmin.assetsManager.fontManager;
		event.preventDefault();

		if ( jQuery( this ).is( ':visible' ) && ! jQuery( event.target ).hasClass( self.selectors.editRowBtn ) ) {
			jQuery( this ).find( self.selectors.editRowBtn ).click();
		}
	};

	self.onInputChange = function( event ) {
		var self = this,
			$el = jQuery( event.target ).next();

		self.fields.upload.setFields( $el );
		self.fields.upload.setLabels( $el );
		self.fields.upload.replaceButtonClass( $el );
	};

	self.bind = function() {
		jQuery( document ).on( 'repeaterComputedLabel', this.updateRowLabel )
			.on( 'onRepeaterToggleVisible', this.onRepeaterToggleVisible )
			.on( 'onRepeaterNewRow', this.onRepeaterNewRow )
			.on( 'click', this.selectors.repeaterTitle, this.maybeToggle )
			.on( 'input', this.selectors.fileUrlInput, this.onInputChange.bind( this ) );
	};

	self.removeCloseHandle = function() {
		jQuery( this.selectors.closeHandle ).remove();
		jQuery( this.selectors.customFontsMetaBox ).removeClass( 'closed' ).removeClass( 'postbox' );
	};

	self.titleRequired = function() {
		jQuery( self.selectors.title ).prop( 'required', true );
	};

	self.init = function() {
		if ( ! jQuery( 'body' ).hasClass( self.selectors.editPageClass ) ) {
			return;
		}

		this.removeCloseHandle();
		this.titleRequired();
		this.bind();
		this.fields.upload.init();
		this.fields.repeater.init();
	};
};
},{"./fields/repeater":2,"./fields/upload":3}],5:[function(require,module,exports){
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
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmNsdWRlcy9leHRlbnNpb25zL2Fzc2V0cy1tYW5hZ2VyL2Fzc2V0cy9qcy9hZG1pbi9hZG1pbi5qcyIsImluY2x1ZGVzL2V4dGVuc2lvbnMvYXNzZXRzLW1hbmFnZXIvYXNzZXRzL2pzL2FkbWluL2ZpZWxkcy9yZXBlYXRlci5qcyIsImluY2x1ZGVzL2V4dGVuc2lvbnMvYXNzZXRzLW1hbmFnZXIvYXNzZXRzL2pzL2FkbWluL2ZpZWxkcy91cGxvYWQuanMiLCJpbmNsdWRlcy9leHRlbnNpb25zL2Fzc2V0cy1tYW5hZ2VyL2Fzc2V0cy9qcy9hZG1pbi9mb250LW1hbmFnZXIuanMiLCJpbmNsdWRlcy9leHRlbnNpb25zL2Fzc2V0cy1tYW5hZ2VyL2Fzc2V0cy9qcy9hZG1pbi90eXBla2l0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJqUXVlcnkoZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIGZvbnRNYW5hZ2VyID0gcmVxdWlyZSgnLi9mb250LW1hbmFnZXInKSxcbiAgICAgICAgdHlwZWtpdEFkbWluID0gcmVxdWlyZSgnLi90eXBla2l0Jyk7XG5cbiAgICBuZXcgZm9udE1hbmFnZXIoKS5pbml0KCk7XG4gICAgbmV3IHR5cGVraXRBZG1pbigpO1xufSk7IiwibW9kdWxlLmV4cG9ydHMgPSAge1xuXHRzZWxlY3RvcnM6IHtcblx0XHRhZGQ6ICcuYWRkLXJlcGVhdGVyLXJvdycsXG5cdFx0cmVtb3ZlOiAnLnJlbW92ZS1yZXBlYXRlci1yb3cnLFxuXHRcdHRvZ2dsZTogJy50b2dnbGUtcmVwZWF0ZXItcm93Jyxcblx0XHRjbG9zZTogJy5jbG9zZS1yZXBlYXRlci1yb3cnLFxuXHRcdHNvcnQ6ICcuc29ydC1yZXBlYXRlci1yb3cnLFxuXHRcdHRhYmxlOiAnLmZvcm0tdGFibGUnLFxuXHRcdGJsb2NrOiAnLnJlcGVhdGVyLWJsb2NrJyxcblx0XHRyZXBlYXRlckxhYmVsOiAnLnJlcGVhdGVyLXRpdGxlJyxcblx0XHRyZXBlYXRlckZpZWxkOiAnLmVsZW1lbnRvci1maWVsZC1yZXBlYXRlcidcblx0fSxcblxuXHRjb3VudGVyczogW10sXG5cblx0dHJpZ2dlcjogZnVuY3Rpb24oIGV2ZW50TmFtZSAsIHBhcmFtcyApIHtcblx0XHRqUXVlcnkoIGRvY3VtZW50ICkudHJpZ2dlciggZXZlbnROYW1lLCBwYXJhbXMgKTtcblx0fSxcblxuXHR0cmlnZ2VySGFuZGxlcjogZnVuY3Rpb24oIGV2ZW50TmFtZSwgcGFyYW1zICkge1xuXHRcdHJldHVybiBqUXVlcnkoIGRvY3VtZW50ICkudHJpZ2dlckhhbmRsZXIoIGV2ZW50TmFtZSwgcGFyYW1zICk7XG5cdH0sXG5cblx0Y291bnRCbG9ja3M6IGZ1bmN0aW9uKCAkYnRuICkge1xuXHRcdHJldHVybiAkYnRuLmNsb3Nlc3QoIHRoaXMuc2VsZWN0b3JzLnJlcGVhdGVyRmllbGQgKS5maW5kKCB0aGlzLnNlbGVjdG9ycy5ibG9jayApLmxlbmd0aCB8fCAwO1xuXHR9LFxuXG5cdGFkZDogZnVuY3Rpb24oIGJ0biwgZXZlbnQgKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdFx0JGJ0biA9IGpRdWVyeSggYnRuICksXG5cdFx0XHRpZCA9ICRidG4uZGF0YSggJ3RlbXBsYXRlLWlkJyApLFxuXHRcdFx0cmVwZWF0ZXJCbG9jaztcblx0XHRpZiAoICEgc2VsZi5jb3VudGVycy5oYXNPd25Qcm9wZXJ0eSggaWQgKSApIHtcblx0XHRcdHNlbGYuY291bnRlcnNbIGlkIF0gPSBzZWxmLmNvdW50QmxvY2tzKCAkYnRuICk7XG5cdFx0fVxuXHRcdHNlbGYuY291bnRlcnNbIGlkIF0gKz0gMTtcblx0XHRyZXBlYXRlckJsb2NrID0galF1ZXJ5KCAnIycgKyBpZCApLmh0bWwoKTtcblx0XHRyZXBlYXRlckJsb2NrID0gc2VsZi5yZXBsYWNlQWxsKCAnX19jb3VudGVyX18nLCBzZWxmLmNvdW50ZXJzWyBpZCBdLCByZXBlYXRlckJsb2NrICk7XG5cdFx0JGJ0bi5iZWZvcmUoIHJlcGVhdGVyQmxvY2sgKTtcblx0XHRzZWxmLnRyaWdnZXIoICdvblJlcGVhdGVyTmV3Um93JywgWyAkYnRuLCAkYnRuLnByZXYoKSBdICk7XG5cdH0sXG5cblx0cmVtb3ZlOiBmdW5jdGlvbiggYnRuLCBldmVudCApIHtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0alF1ZXJ5KCBidG4gKS5jbG9zZXN0KCBzZWxmLnNlbGVjdG9ycy5ibG9jayApLnJlbW92ZSgpO1xuXHR9LFxuXG5cdHRvZ2dsZTogZnVuY3Rpb24oIGJ0biwgZXZlbnQgKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdFx0JGJ0biA9IGpRdWVyeSggYnRuICksXG5cdFx0XHQkdGFibGUgPSAkYnRuLmNsb3Nlc3QoIHNlbGYuc2VsZWN0b3JzLmJsb2NrICkuZmluZCggc2VsZi5zZWxlY3RvcnMudGFibGUgKSxcblx0XHRcdCR0b2dnbGVMYWJlbCA9ICRidG4uY2xvc2VzdCggc2VsZi5zZWxlY3RvcnMuYmxvY2sgKS5maW5kKCBzZWxmLnNlbGVjdG9ycy5yZXBlYXRlckxhYmVsICk7XG5cblx0XHQkdGFibGUudG9nZ2xlKCAwLCAnbm9uZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCAkdGFibGUuaXMoICc6dmlzaWJsZScgKSApIHtcblx0XHRcdFx0JHRhYmxlLmNsb3Nlc3QoIHNlbGYuc2VsZWN0b3JzLmJsb2NrICkuYWRkQ2xhc3MoICdibG9jay12aXNpYmxlJyApO1xuXHRcdFx0XHRzZWxmLnRyaWdnZXIoICdvblJlcGVhdGVyVG9nZ2xlVmlzaWJsZScsIFsgJGJ0biwgJHRhYmxlLCAkdG9nZ2xlTGFiZWwgXSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHRhYmxlLmNsb3Nlc3QoIHNlbGYuc2VsZWN0b3JzLmJsb2NrICkucmVtb3ZlQ2xhc3MoICdibG9jay12aXNpYmxlJyApO1xuXHRcdFx0XHRzZWxmLnRyaWdnZXIoICdvblJlcGVhdGVyVG9nZ2xlSGlkZGVuJywgWyAkYnRuLCAkdGFibGUsICR0b2dnbGVMYWJlbCBdICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0JHRvZ2dsZUxhYmVsLnRvZ2dsZSgpO1xuXG5cdFx0Ly8gVXBkYXRlIHJvdyBsYWJlbFxuXHRcdHNlbGYudXBkYXRlUm93TGFiZWwoIGJ0biApO1xuXHR9LFxuXG5cdGNsb3NlOiBmdW5jdGlvbiggYnRuLCBldmVudCApIHtcblx0XHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0XHQkYnRuID0galF1ZXJ5KCBidG4gKSxcblx0XHRcdCR0YWJsZSA9ICRidG4uY2xvc2VzdCggc2VsZi5zZWxlY3RvcnMuYmxvY2sgKS5maW5kKCBzZWxmLnNlbGVjdG9ycy50YWJsZSApLFxuXHRcdFx0JHRvZ2dsZUxhYmVsID0gJGJ0bi5jbG9zZXN0KCBzZWxmLnNlbGVjdG9ycy5ibG9jayApLmZpbmQoIHNlbGYuc2VsZWN0b3JzLnJlcGVhdGVyTGFiZWwgKTtcblxuXHRcdCR0YWJsZS5jbG9zZXN0KCBzZWxmLnNlbGVjdG9ycy5ibG9jayApLnJlbW92ZUNsYXNzKCAnYmxvY2stdmlzaWJsZScgKTtcblx0XHQkdGFibGUuaGlkZSgpO1xuXHRcdHNlbGYudHJpZ2dlciggJ29uUmVwZWF0ZXJUb2dnbGVIaWRkZW4nLCBbICRidG4sICR0YWJsZSwgJHRvZ2dsZUxhYmVsIF0gKTtcblx0XHQkdG9nZ2xlTGFiZWwuc2hvdygpO1xuXHRcdHNlbGYudXBkYXRlUm93TGFiZWwoIGJ0biApO1xuXHR9LFxuXG5cdHVwZGF0ZVJvd0xhYmVsOiBmdW5jdGlvbiggYnRuICkge1xuXHRcdHZhciBzZWxmID0gdGhpcyxcblx0XHRcdCRidG4gPSBqUXVlcnkoIGJ0biApLFxuXHRcdFx0JHRhYmxlID0gJGJ0bi5jbG9zZXN0KCBzZWxmLnNlbGVjdG9ycy5ibG9jayApLmZpbmQoIHNlbGYuc2VsZWN0b3JzLnRhYmxlICksXG5cdFx0XHQkdG9nZ2xlTGFiZWwgPSAkYnRuLmNsb3Nlc3QoIHNlbGYuc2VsZWN0b3JzLmJsb2NrICkuZmluZCggc2VsZi5zZWxlY3RvcnMucmVwZWF0ZXJMYWJlbCApO1xuXG5cdFx0dmFyIHNlbGVjdG9yID0gJHRvZ2dsZUxhYmVsLmRhdGEoICdzZWxlY3RvcicgKTtcblx0XHQvLyBGb3Igc29tZSBicm93c2VycywgYGF0dHJgIGlzIHVuZGVmaW5lZDsgZm9yIG90aGVycywgIGBhdHRyYCBpcyBmYWxzZS4gIENoZWNrIGZvciBib3RoLlxuXHRcdGlmICggdHlwZW9mIHNlbGVjdG9yICE9PSB0eXBlb2YgdW5kZWZpbmVkICYmIGZhbHNlICE9PSBzZWxlY3RvciApIHtcblx0XHRcdHZhciB2YWx1ZSA9IGZhbHNlLFxuXHRcdFx0XHRzdGQgPSAkdG9nZ2xlTGFiZWwuZGF0YSggJ2RlZmF1bHQnICk7XG5cblx0XHRcdGlmICggJHRhYmxlLmZpbmQoIHNlbGVjdG9yICkubGVuZ3RoICkge1xuXHRcdFx0XHR2YWx1ZSA9ICR0YWJsZS5maW5kKCBzZWxlY3RvciApLnZhbCgpO1xuXHRcdFx0fVxuXG5cdFx0XHQvL2ZpbHRlciBob29rXG5cdFx0XHR2YXIgY29tcHV0ZWRMYWJlbCA9IGZhbHNlO1xuXHRcdFx0Y29tcHV0ZWRMYWJlbCA9IHNlbGYudHJpZ2dlckhhbmRsZXIoICdyZXBlYXRlckNvbXB1dGVkTGFiZWwnLCBbICR0YWJsZSwgJHRvZ2dsZUxhYmVsLCB2YWx1ZSBdICk7XG5cblx0XHRcdC8vIEZvciBzb21lIGJyb3dzZXJzLCBgYXR0cmAgaXMgdW5kZWZpbmVkOyBmb3Igb3RoZXJzLCAgYGF0dHJgIGlzIGZhbHNlLiAgQ2hlY2sgZm9yIGJvdGguXG5cdFx0XHRpZiAodHlwZW9mIGNvbXB1dGVkTGFiZWwgIT09IHR5cGVvZiB1bmRlZmluZWQgJiYgZmFsc2UgIT09IGNvbXB1dGVkTGFiZWwgKSB7XG5cdFx0XHRcdHZhbHVlID0gY29tcHV0ZWRMYWJlbDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRmFsbGJhY2sgdG8gZGVmYXVsdCByb3cgbGFiZWxcblx0XHRcdGlmICggdHlwZW9mIHZhbHVlID09PSB0eXBlb2YgdW5kZWZpbmVkIHx8IGZhbHNlID09PSB2YWx1ZSApIHtcblx0XHRcdFx0dmFsdWUgPSBzdGQ7XG5cdFx0XHR9XG5cblx0XHRcdCR0b2dnbGVMYWJlbC5odG1sKCB2YWx1ZSApO1xuXHRcdH1cblx0fSxcblxuXHRyZXBsYWNlQWxsOiBmdW5jdGlvbiggc2VhcmNoLCByZXBsYWNlLCBzdHJpbmcpIHtcblx0XHRyZXR1cm4gc3RyaW5nLnJlcGxhY2UoIG5ldyBSZWdFeHAoIHNlYXJjaCwgJ2cnICksIHJlcGxhY2UgKTtcblx0fSxcblxuXHRpbml0OiBmdW5jdGlvbigpIHtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0alF1ZXJ5KCBkb2N1bWVudCApXG5cdFx0XHQub24oICdjbGljaycsIHRoaXMuc2VsZWN0b3JzLmFkZCwgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRzZWxmLmFkZCggalF1ZXJ5KCB0aGlzICksIGV2ZW50ICk7XG5cdFx0XHR9IClcblx0XHRcdC5vbiggJ2NsaWNrJywgdGhpcy5zZWxlY3RvcnMucmVtb3ZlLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHZhciByZXN1bHQgPSBjb25maXJtKCBqUXVlcnkoIHRoaXMgKS5kYXRhKCAnY29uZmlybScgKS50b1N0cmluZygpICk7XG5cdFx0XHRcdGlmICggISByZXN1bHQgKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHNlbGYucmVtb3ZlKCBqUXVlcnkoIHRoaXMgKSwgZXZlbnQgKTtcblx0XHRcdH0gKVxuXHRcdFx0Lm9uKCAnY2xpY2snLCB0aGlzLnNlbGVjdG9ycy50b2dnbGUsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdHNlbGYudG9nZ2xlKCBqUXVlcnkoIHRoaXMgKSwgZXZlbnQgKTtcblx0XHRcdH0gKVxuXHRcdFx0Lm9uKCAnY2xpY2snLCB0aGlzLnNlbGVjdG9ycy5jbG9zZSwgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0c2VsZi5jbG9zZSggalF1ZXJ5KCB0aGlzICksIGV2ZW50ICk7XG5cdFx0XHR9ICk7XG5cblx0XHRqUXVlcnkoIHRoaXMuc2VsZWN0b3JzLnRvZ2dsZSApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0c2VsZi51cGRhdGVSb3dMYWJlbCggalF1ZXJ5KCB0aGlzICkgKTtcblx0XHR9ICk7XG5cblx0XHR0aGlzLnRyaWdnZXIoICdvblJlcGVhdGVyTG9hZGVkJywgWyB0aGlzIF0gKTtcblx0fVxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0JGJ0bjogbnVsbCxcblx0ZmlsZUlkOiBudWxsLFxuXHRmaWxlVXJsOiBudWxsLFxuXHRmaWxlRnJhbWU6IFtdLFxuXG5cdHNlbGVjdG9yczoge1xuXHRcdHVwbG9hZEJ0bkNsYXNzOiAnZWxlbWVudG9yLXVwbG9hZC1idG4nLFxuXHRcdGNsZWFyQnRuQ2xhc3M6ICdlbGVtZW50b3ItdXBsb2FkLWNsZWFyLWJ0bicsXG5cdFx0dXBsb2FkQnRuOiAnLmVsZW1lbnRvci11cGxvYWQtYnRuJyxcblx0XHRjbGVhckJ0bjogJy5lbGVtZW50b3ItdXBsb2FkLWNsZWFyLWJ0bidcblx0fSxcblxuXHRoYXNWYWx1ZTogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICggJycgIT09IGpRdWVyeSggdGhpcy5maWxlVXJsICkudmFsKCkgKTtcblx0fSxcblxuXHRzZXRMYWJlbHM6IGZ1bmN0aW9uKCAkZWwgKSB7XG5cdFx0aWYgKCAhIHRoaXMuaGFzVmFsdWUoKSApIHtcblx0XHRcdCRlbC52YWwoICRlbC5kYXRhKCAndXBsb2FkX3RleHQnICkgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JGVsLnZhbCggJGVsLmRhdGEoICdyZW1vdmVfdGV4dCcgKSApO1xuXHRcdH1cblx0fSxcblxuXHRzZXRGaWVsZHM6IGZ1bmN0aW9uKCBlbCApIHtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0c2VsZi5maWxlVXJsID0galF1ZXJ5KCBlbCApLnByZXYoKTtcblx0XHRzZWxmLmZpbGVJZCA9IGpRdWVyeSggc2VsZi5maWxlVXJsICkucHJldigpO1xuXHRcdGpRdWVyeWJ0biA9IGpRdWVyeSggZWwgKTtcblx0fSxcblxuXHRzZXRVcGxvYWRQYXJhbXM6IGZ1bmN0aW9uKCBleHQsIG5hbWUgKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdHNlbGYuZmlsZUZyYW1lWyBuYW1lIF0udXBsb2FkZXIudXBsb2FkZXIucGFyYW0oICd1cGxvYWRlVHlwZScsIGV4dCApO1xuXHRcdHNlbGYuZmlsZUZyYW1lWyBuYW1lIF0udXBsb2FkZXIudXBsb2FkZXIucGFyYW0oICd1cGxvYWRlVHlwZWNhbGxlcicsICdlbGVtZW50b3ItYWRtaW4tdXBsb2FkJyApO1xuXHR9LFxuXG5cdHJlcGxhY2VCdXR0b25DbGFzczogZnVuY3Rpb24oIGVsICkge1xuXHRcdGlmICggdGhpcy5oYXNWYWx1ZSgpICkge1xuXHRcdFx0alF1ZXJ5KCBlbCApLnJlbW92ZUNsYXNzKCB0aGlzLnNlbGVjdG9ycy51cGxvYWRCdG5DbGFzcyApLmFkZENsYXNzKCB0aGlzLnNlbGVjdG9ycy5jbGVhckJ0bkNsYXNzICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGpRdWVyeSggZWwgKS5yZW1vdmVDbGFzcyggdGhpcy5zZWxlY3RvcnMuY2xlYXJCdG5DbGFzcyApLmFkZENsYXNzKCB0aGlzLnNlbGVjdG9ycy51cGxvYWRCdG5DbGFzcyApO1xuXHRcdH1cblx0XHR0aGlzLnNldExhYmVscyggZWwgKTtcblx0fSxcblxuXHR1cGxvYWRGaWxlOiBmdW5jdGlvbiggZWwgKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdFx0JGVsID0galF1ZXJ5KCBlbCApLFxuXHRcdFx0bWltZSA9ICRlbC5hdHRyKCAnZGF0YS1taW1lX3R5cGUnICkgfHwgJycsXG5cdFx0XHRleHQgPSAkZWwuYXR0ciggJ2RhdGEtZXh0JyApIHx8IGZhbHNlLFxuXHRcdFx0bmFtZSA9ICRlbC5hdHRyKCAnaWQnICk7XG5cdFx0Ly8gSWYgdGhlIG1lZGlhIGZyYW1lIGFscmVhZHkgZXhpc3RzLCByZW9wZW4gaXQuXG5cdFx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIHNlbGYuZmlsZUZyYW1lWyBuYW1lIF0gKSB7XG5cdFx0XHRpZiAoIGV4dCApIHtcblx0XHRcdFx0c2VsZi5zZXRVcGxvYWRQYXJhbXMoIGV4dCwgbmFtZSApO1xuXHRcdFx0fVxuXG5cdFx0XHRzZWxmLmZpbGVGcmFtZVsgbmFtZSBdLm9wZW4oKTtcblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIENyZWF0ZSB0aGUgbWVkaWEgZnJhbWUuXG5cdFx0c2VsZi5maWxlRnJhbWVbIG5hbWUgXSA9IHdwLm1lZGlhKCB7XG5cdFx0XHRsaWJyYXJ5OiB7XG5cdFx0XHRcdHR5cGU6IG1pbWUuc3BsaXQoICcsJyApXG5cdFx0XHR9LFxuXHRcdFx0dGl0bGU6ICRlbC5kYXRhKCAnYm94X3RpdGxlJyApLFxuXHRcdFx0YnV0dG9uOiB7XG5cdFx0XHRcdHRleHQ6ICRlbC5kYXRhKCAnYm94X2FjdGlvbicgKVxuXHRcdFx0fSxcblx0XHRcdG11bHRpcGxlOiBmYWxzZVxuXHRcdH0gKTtcblxuXG5cdFx0Ly8gV2hlbiBhbiBmaWxlIGlzIHNlbGVjdGVkLCBydW4gYSBjYWxsYmFjay5cblx0XHRzZWxmLmZpbGVGcmFtZVsgbmFtZSBdLm9uKCAnc2VsZWN0JywgZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBXZSBzZXQgbXVsdGlwbGUgdG8gZmFsc2Ugc28gb25seSBnZXQgb25lIGltYWdlIGZyb20gdGhlIHVwbG9hZGVyXG5cdFx0XHR2YXIgYXR0YWNobWVudCA9IHNlbGYuZmlsZUZyYW1lWyBuYW1lIF0uc3RhdGUoKS5nZXQoICdzZWxlY3Rpb24nICkuZmlyc3QoKS50b0pTT04oKTtcblx0XHRcdC8vIERvIHNvbWV0aGluZyB3aXRoIGF0dGFjaG1lbnQuaWQgYW5kL29yIGF0dGFjaG1lbnQudXJsIGhlcmVcblx0XHRcdGpRdWVyeSggc2VsZi5maWxlSWQgKS52YWwoIGF0dGFjaG1lbnQuaWQgKTtcblx0XHRcdGpRdWVyeSggc2VsZi5maWxlVXJsICkudmFsKCBhdHRhY2htZW50LnVybCApO1xuXHRcdFx0c2VsZi5yZXBsYWNlQnV0dG9uQ2xhc3MoIGVsICk7XG5cdFx0XHRzZWxmLnVwZGF0ZVByZXZpZXcoIGVsICk7XG5cdFx0fSk7XG5cblx0XHQvLyBGaW5hbGx5LCBvcGVuIHRoZSBtb2RhbFxuXHRcdHNlbGYuZmlsZUZyYW1lWyBuYW1lIF0ub3BlbigpO1xuXHRcdGlmICggZXh0ICkge1xuXHRcdFx0c2VsZi5zZXRVcGxvYWRQYXJhbXMoIGV4dCwgbmFtZSApO1xuXHRcdH1cblx0fSxcblxuXHR1cGRhdGVQcmV2aWV3OiBmdW5jdGlvbiggZWwgKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdFx0JHVsID0galF1ZXJ5KCBlbCApLnBhcmVudCgpLmZpbmQoICd1bCcgKSxcblx0XHRcdCRsaSA9IGpRdWVyeSggJzxsaT4nICksXG5cdFx0XHRzaG93VXJsVHlwZSA9IGpRdWVyeSggZWwgKS5kYXRhKCAncHJldmlld19hbmNob3InICkgfHwgJ2Z1bGwnO1xuXG5cdFx0JHVsLmh0bWwoICcnICk7XG5cblx0XHRpZiAoIHNlbGYuaGFzVmFsdWUoKSAmJiAnbm9uZScgIT09IHNob3dVcmxUeXBlICkge1xuXHRcdFx0dmFyIGFuY2hvciA9IGpRdWVyeSggc2VsZi5maWxlVXJsICkudmFsKCk7XG5cdFx0XHRpZiAoICdmdWxsJyAhPT0gc2hvd1VybFR5cGUgKSB7XG5cdFx0XHRcdGFuY2hvciA9IGFuY2hvci5zdWJzdHJpbmcoIGFuY2hvci5sYXN0SW5kZXhPZiggJy8nICkgKyAxICk7XG5cdFx0XHR9XG5cblx0XHRcdCRsaS5odG1sKCAnPGEgaHJlZj1cIicgKyBqUXVlcnkoIHNlbGYuZmlsZVVybCApLnZhbCgpICsgJ1wiIGRvd25sb2FkPicgKyBhbmNob3IgKyAnPC9hPicgKTtcblx0XHRcdCR1bC5hcHBlbmQoICRsaSApO1xuXHRcdH1cblx0fSxcblxuXHRzZXR1cDogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdGpRdWVyeSggc2VsZi5zZWxlY3RvcnMudXBsb2FkQnRuICsgJywgJyArIHNlbGYuc2VsZWN0b3JzLmNsZWFyQnRuICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cdFx0XHRzZWxmLnNldEZpZWxkcyggalF1ZXJ5KCB0aGlzICkgKTtcblx0XHRcdHNlbGYudXBkYXRlUHJldmlldyggalF1ZXJ5KCB0aGlzICkgKTtcblx0XHRcdHNlbGYuc2V0TGFiZWxzKCBqUXVlcnkoIHRoaXMgKSApO1xuXHRcdFx0c2VsZi5yZXBsYWNlQnV0dG9uQ2xhc3MoIGpRdWVyeSggdGhpcyApICk7XG5cdFx0fSk7XG5cdH0sXG5cblx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0alF1ZXJ5KCBkb2N1bWVudCApLm9uKCAnY2xpY2snLCBzZWxmLnNlbGVjdG9ycy51cGxvYWRCdG4sIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRzZWxmLnNldEZpZWxkcyggalF1ZXJ5KCB0aGlzICkgKTtcblx0XHRcdHNlbGYudXBsb2FkRmlsZSggalF1ZXJ5KCB0aGlzICkgKTtcblx0XHR9ICk7XG5cblx0XHRqUXVlcnkoIGRvY3VtZW50ICkub24oICdjbGljaycsIHNlbGYuc2VsZWN0b3JzLmNsZWFyQnRuLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0c2VsZi5zZXRGaWVsZHMoIGpRdWVyeSggdGhpcyApICk7XG5cdFx0XHRqUXVlcnkoIHNlbGYuZmlsZVVybCApLnZhbCggJycgKTtcblx0XHRcdGpRdWVyeSggc2VsZi5maWxlSWQgKS52YWwoICcnICk7XG5cblx0XHRcdHNlbGYudXBkYXRlUHJldmlldyggalF1ZXJ5KCB0aGlzICkgKTtcblx0XHRcdHNlbGYucmVwbGFjZUJ1dHRvbkNsYXNzKCBqUXVlcnkoIHRoaXMgKSApO1xuXHRcdH0gKTtcblxuXHRcdHRoaXMuc2V0dXAoKTtcblxuXHRcdGpRdWVyeSggZG9jdW1lbnQgKS5vbiggJ29uUmVwZWF0ZXJOZXdSb3cnLCBmdW5jdGlvbigpIHtcblx0XHRcdHNlbGYuc2V0dXAoKTtcblx0XHR9ICk7XG5cdH1cbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdHNlbGYuZmllbGRzID0ge1xuXHRcdHVwbG9hZDogcmVxdWlyZSggJy4vZmllbGRzL3VwbG9hZCcgKSxcblx0XHRyZXBlYXRlcjogcmVxdWlyZSggJy4vZmllbGRzL3JlcGVhdGVyJyApXG5cdH07XG5cblx0c2VsZi5zZWxlY3RvcnMgPSB7XG5cdFx0ZWRpdFBhZ2VDbGFzczogJ3Bvc3QtdHlwZS1xYXphbmFfZm9udCcsXG5cdFx0dGl0bGU6ICcjdGl0bGUnLFxuXHRcdHJlcGVhdGVyQmxvY2s6ICcucmVwZWF0ZXItYmxvY2snLFxuXHRcdHJlcGVhdGVyVGl0bGU6ICcucmVwZWF0ZXItdGl0bGUnLFxuXHRcdHJlbW92ZVJvd0J0bjogJy5yZW1vdmUtcmVwZWF0ZXItcm93Jyxcblx0XHRlZGl0Um93QnRuOiAnLnRvZ2dsZS1yZXBlYXRlci1yb3cnLFxuXHRcdGNsb3NlUm93QnRuOiAnLmNsb3NlLXJlcGVhdGVyLXJvdycsXG5cdFx0c3R5bGVJbnB1dDogJy5mb250X3N0eWxlJyxcblx0XHR3ZWlnaHRJbnB1dDogJy5mb250X3dlaWdodCcsXG5cdFx0Y3VzdG9tRm9udHNNZXRhQm94OiAnI3FhemFuYS1mb250LWN1c3RvbW1ldGFib3gnLFxuXHRcdGNsb3NlSGFuZGxlOiAnYnV0dG9uLmhhbmRsZWRpdicsXG5cdFx0dG9vbGJhcjogJy5xYXphbmEtZmllbGQtdG9vbGJhcicsXG5cdFx0aW5saW5lUHJldmlldzogJy5pbmxpbmUtcHJldmlldycsXG5cdFx0ZmlsZVVybElucHV0OiAnLnFhemFuYS1maWVsZC1maWxlIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJ1xuXHR9O1xuXG5cdHNlbGYuZm9udExhYmVsVGVtcGxhdGUgPSAnPHVsIGNsYXNzPVwicm93LWZvbnQtbGFiZWxcIj48bGkgY2xhc3M9XCJyb3ctZm9udC13ZWlnaHRcIj57e3dlaWdodH19PC9saT48bGkgY2xhc3M9XCJyb3ctZm9udC1zdHlsZVwiPnt7c3R5bGV9fTwvbGk+PGxpIGNsYXNzPVwicm93LWZvbnQtcHJldmlld1wiPnt7cHJldmlld319PC9saT57e3Rvb2xiYXJ9fTwvdWw+JztcblxuXHRzZWxmLnJlbmRlclRlbXBsYXRlID0gZnVuY3Rpb24oIHRwbCwgZGF0YSApIHtcblx0XHR2YXIgcmUgPSAve3soW159fV0rKT99fS9nLCBtYXRjaDtcblx0XHR3aGlsZSAoIG1hdGNoID0gcmUuZXhlYyggdHBsICkgKSB7XG5cdFx0XHR0cGwgPSB0cGwucmVwbGFjZSggbWF0Y2hbIDAgXSwgZGF0YVsgbWF0Y2hbIDEgXSBdICk7XG5cdFx0fVxuXHRcdHJldHVybiB0cGw7XG5cdH07XG5cblx0c2VsZi51Y0ZpcnN0ID0gZnVuY3Rpb24gKCBzdHJpbmcgKSB7XG5cdFx0cmV0dXJuIHN0cmluZy5jaGFyQXQoIDAgKS50b1VwcGVyQ2FzZSgpICsgc3RyaW5nLnNsaWNlKCAxICk7XG5cdH07XG5cblx0c2VsZi5nZXRQcmV2aWV3U3R5bGUgPSBmdW5jdGlvbiggJHRhYmxlICkge1xuXHRcdHZhciBzZWxmID0gcWF6YW5hUHJvQWRtaW4uYXNzZXRzTWFuYWdlci5mb250TWFuYWdlcixcblx0XHRcdGZvbnRGYW1pbHkgPSBqUXVlcnkoIHNlbGYuc2VsZWN0b3JzLnRpdGxlICkudmFsKCksXG5cdFx0XHRzdHlsZSA9ICR0YWJsZS5maW5kKCAnc2VsZWN0JyArIHNlbGYuc2VsZWN0b3JzLnN0eWxlSW5wdXQgKS5maXJzdCgpLnZhbCgpLFxuXHRcdFx0d2VpZ2h0ID0gJHRhYmxlLmZpbmQoICdzZWxlY3QnICsgc2VsZi5zZWxlY3RvcnMud2VpZ2h0SW5wdXQgKS5maXJzdCgpLnZhbCgpO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHN0eWxlOiBzZWxmLnVjRmlyc3QoIHN0eWxlICksXG5cdFx0XHR3ZWlnaHQ6IHNlbGYudWNGaXJzdCggd2VpZ2h0ICksXG5cdFx0XHRzdHlsZUF0dHJpYnV0ZTogJ2ZvbnQtZmFtaWx5OiAnICsgZm9udEZhbWlseSArICcgO2ZvbnQtc3R5bGU6ICcgKyBzdHlsZSArICc7IGZvbnQtd2VpZ2h0OiAnICsgd2VpZ2h0ICsgJzsnXG5cdFx0fTtcblx0fTtcblxuXHRzZWxmLnVwZGF0ZVJvd0xhYmVsID0gZnVuY3Rpb24oIGV2ZW50LCAkdGFibGUsICRsYWJlbCwgdmFsdWUgKSB7XG5cdFx0dmFyIHNlbGYgPSBxYXphbmFQcm9BZG1pbi5hc3NldHNNYW5hZ2VyLmZvbnRNYW5hZ2VyLFxuXHRcdFx0JGJsb2NrID0gJHRhYmxlLmNsb3Nlc3QoIHNlbGYuc2VsZWN0b3JzLnJlcGVhdGVyQmxvY2sgKSxcblx0XHRcdCRkZWxldGVCdG4gPSAkYmxvY2suZmluZCggc2VsZi5zZWxlY3RvcnMucmVtb3ZlUm93QnRuICkuZmlyc3QoKSxcblx0XHRcdCRlZGl0QnRuID0gJGJsb2NrLmZpbmQoIHNlbGYuc2VsZWN0b3JzLmVkaXRSb3dCdG4gKS5maXJzdCgpLFxuXHRcdFx0JGNsb3NlQnRuID0gJGJsb2NrLmZpbmQoIHNlbGYuc2VsZWN0b3JzLmNsb3NlUm93QnRuICkuZmlyc3QoKSxcblx0XHRcdCR0b29sYmFyID0gJHRhYmxlLmZpbmQoIHNlbGYuc2VsZWN0b3JzLnRvb2xiYXIgKS5sYXN0KCkuY2xvbmUoKSxcblx0XHRcdHByZXZpZXdTdHlsZSA9IHNlbGYuZ2V0UHJldmlld1N0eWxlKCAkdGFibGUgKSxcblx0XHRcdHRvb2xiYXJIdG1sO1xuXG5cdFx0aWYgKCAkZWRpdEJ0bi5sZW5ndGggPiAwKSB7XG5cdFx0XHQkZWRpdEJ0bi5ub3QoIHNlbGYuc2VsZWN0b3JzLnRvb2xiYXIgKyAnICcgKyBzZWxmLnNlbGVjdG9ycy5lZGl0Um93QnRuICkucmVtb3ZlKCk7XG5cdFx0fVxuXG5cdFx0aWYgKCAkY2xvc2VCdG4ubGVuZ3RoID4gMCkge1xuXHRcdFx0JGNsb3NlQnRuLm5vdCggc2VsZi5zZWxlY3RvcnMudG9vbGJhciArICcgJyArIHNlbGYuc2VsZWN0b3JzLmNsb3NlUm93QnRuICkucmVtb3ZlKCk7XG5cdFx0fVxuXG5cdFx0aWYgKCAkZGVsZXRlQnRuLmxlbmd0aCA+IDApIHtcblx0XHRcdCRkZWxldGVCdG4ubm90KCBzZWxmLnNlbGVjdG9ycy50b29sYmFyICsgJyAnICsgc2VsZi5zZWxlY3RvcnMucmVtb3ZlUm93QnRuICkucmVtb3ZlKCk7XG5cdFx0fVxuXG5cdFx0dG9vbGJhckh0bWwgPSAgalF1ZXJ5KCAnPGxpIGNsYXNzPVwicm93LWZvbnQtYWN0aW9uc1wiPicgKS5hcHBlbmQoICR0b29sYmFyIClbMF0ub3V0ZXJIVE1MO1xuXG5cdFx0cmV0dXJuIHNlbGYucmVuZGVyVGVtcGxhdGUoIHNlbGYuZm9udExhYmVsVGVtcGxhdGUsIHtcblx0XHRcdHdlaWdodDogJzxzcGFuIGNsYXNzPVwibGFiZWxcIj5XZWlnaHQ6PC9zcGFuPicgKyBwcmV2aWV3U3R5bGUud2VpZ2h0LFxuXHRcdFx0c3R5bGU6ICc8c3BhbiBjbGFzcz1cImxhYmVsXCI+U3R5bGU6PC9zcGFuPicgKyBwcmV2aWV3U3R5bGUuc3R5bGUsXG5cdFx0XHRwcmV2aWV3OiAnPHNwYW4gc3R5bGU9XCInICsgcHJldmlld1N0eWxlLnN0eWxlQXR0cmlidXRlICsgJ1wiPkVsZW1lbnRvciBpcyBtYWtpbmcgdGhlIHdlYiBiZWF1dGlmdWw8L3NwYW4+Jyxcblx0XHRcdHRvb2xiYXI6IHRvb2xiYXJIdG1sXG5cdFx0fSk7XG5cdH07XG5cblx0c2VsZi5vblJlcGVhdGVyVG9nZ2xlVmlzaWJsZSA9IGZ1bmN0aW9uKCBldmVudCwgJGJ0biwgJHRhYmxlLCAkdG9nZ2xlTGFiZWwgKSB7XG5cdFx0dmFyIHNlbGYgPSBxYXphbmFQcm9BZG1pbi5hc3NldHNNYW5hZ2VyLmZvbnRNYW5hZ2VyLFxuXHRcdFx0JHByZXZpZXdFbGVtZW50ID0gJHRhYmxlLmZpbmQoIHNlbGYuc2VsZWN0b3JzLmlubGluZVByZXZpZXcgKSxcblx0XHRcdHByZXZpZXdTdHlsZSA9IHNlbGYuZ2V0UHJldmlld1N0eWxlKCAkdGFibGUgKTtcblxuXHRcdCRwcmV2aWV3RWxlbWVudC5hdHRyKCAnc3R5bGUnLCBwcmV2aWV3U3R5bGUuc3R5bGVBdHRyaWJ1dGUgKTtcblx0fTtcblxuXHRzZWxmLm9uUmVwZWF0ZXJOZXdSb3cgPSBmdW5jdGlvbiggZXZlbnQsICRidG4sICRibG9jayApIHtcblx0XHR2YXIgc2VsZiA9IHFhemFuYVByb0FkbWluLmFzc2V0c01hbmFnZXIuZm9udE1hbmFnZXI7XG5cdFx0JGJsb2NrLmZpbmQoIHNlbGYuc2VsZWN0b3JzLnJlbW92ZVJvd0J0biApLmZpcnN0KCkucmVtb3ZlKCk7XG5cdFx0JGJsb2NrLmZpbmQoIHNlbGYuc2VsZWN0b3JzLmVkaXRSb3dCdG4gKS5maXJzdCgpLnJlbW92ZSgpO1xuXHRcdCRibG9jay5maW5kKCBzZWxmLnNlbGVjdG9ycy5jbG9zZVJvd0J0biApLmZpcnN0KCkucmVtb3ZlKCk7XG5cdH07XG5cblx0c2VsZi5tYXliZVRvZ2dsZSA9IGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHR2YXIgc2VsZiA9IHFhemFuYVByb0FkbWluLmFzc2V0c01hbmFnZXIuZm9udE1hbmFnZXI7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdGlmICggalF1ZXJ5KCB0aGlzICkuaXMoICc6dmlzaWJsZScgKSAmJiAhIGpRdWVyeSggZXZlbnQudGFyZ2V0ICkuaGFzQ2xhc3MoIHNlbGYuc2VsZWN0b3JzLmVkaXRSb3dCdG4gKSApIHtcblx0XHRcdGpRdWVyeSggdGhpcyApLmZpbmQoIHNlbGYuc2VsZWN0b3JzLmVkaXRSb3dCdG4gKS5jbGljaygpO1xuXHRcdH1cblx0fTtcblxuXHRzZWxmLm9uSW5wdXRDaGFuZ2UgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdFx0JGVsID0galF1ZXJ5KCBldmVudC50YXJnZXQgKS5uZXh0KCk7XG5cblx0XHRzZWxmLmZpZWxkcy51cGxvYWQuc2V0RmllbGRzKCAkZWwgKTtcblx0XHRzZWxmLmZpZWxkcy51cGxvYWQuc2V0TGFiZWxzKCAkZWwgKTtcblx0XHRzZWxmLmZpZWxkcy51cGxvYWQucmVwbGFjZUJ1dHRvbkNsYXNzKCAkZWwgKTtcblx0fTtcblxuXHRzZWxmLmJpbmQgPSBmdW5jdGlvbigpIHtcblx0XHRqUXVlcnkoIGRvY3VtZW50ICkub24oICdyZXBlYXRlckNvbXB1dGVkTGFiZWwnLCB0aGlzLnVwZGF0ZVJvd0xhYmVsIClcblx0XHRcdC5vbiggJ29uUmVwZWF0ZXJUb2dnbGVWaXNpYmxlJywgdGhpcy5vblJlcGVhdGVyVG9nZ2xlVmlzaWJsZSApXG5cdFx0XHQub24oICdvblJlcGVhdGVyTmV3Um93JywgdGhpcy5vblJlcGVhdGVyTmV3Um93IClcblx0XHRcdC5vbiggJ2NsaWNrJywgdGhpcy5zZWxlY3RvcnMucmVwZWF0ZXJUaXRsZSwgdGhpcy5tYXliZVRvZ2dsZSApXG5cdFx0XHQub24oICdpbnB1dCcsIHRoaXMuc2VsZWN0b3JzLmZpbGVVcmxJbnB1dCwgdGhpcy5vbklucHV0Q2hhbmdlLmJpbmQoIHRoaXMgKSApO1xuXHR9O1xuXG5cdHNlbGYucmVtb3ZlQ2xvc2VIYW5kbGUgPSBmdW5jdGlvbigpIHtcblx0XHRqUXVlcnkoIHRoaXMuc2VsZWN0b3JzLmNsb3NlSGFuZGxlICkucmVtb3ZlKCk7XG5cdFx0alF1ZXJ5KCB0aGlzLnNlbGVjdG9ycy5jdXN0b21Gb250c01ldGFCb3ggKS5yZW1vdmVDbGFzcyggJ2Nsb3NlZCcgKS5yZW1vdmVDbGFzcyggJ3Bvc3Rib3gnICk7XG5cdH07XG5cblx0c2VsZi50aXRsZVJlcXVpcmVkID0gZnVuY3Rpb24oKSB7XG5cdFx0alF1ZXJ5KCBzZWxmLnNlbGVjdG9ycy50aXRsZSApLnByb3AoICdyZXF1aXJlZCcsIHRydWUgKTtcblx0fTtcblxuXHRzZWxmLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRpZiAoICEgalF1ZXJ5KCAnYm9keScgKS5oYXNDbGFzcyggc2VsZi5zZWxlY3RvcnMuZWRpdFBhZ2VDbGFzcyApICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMucmVtb3ZlQ2xvc2VIYW5kbGUoKTtcblx0XHR0aGlzLnRpdGxlUmVxdWlyZWQoKTtcblx0XHR0aGlzLmJpbmQoKTtcblx0XHR0aGlzLmZpZWxkcy51cGxvYWQuaW5pdCgpO1xuXHRcdHRoaXMuZmllbGRzLnJlcGVhdGVyLmluaXQoKTtcblx0fTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHNlbGYgPSB0aGlzO1xuXHRzZWxmLmNhY2hlRWxlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmNhY2hlID0ge1xuXHRcdFx0JGJ1dHRvbjogalF1ZXJ5KCAnI3FhemFuYV90eXBla2l0X3ZhbGlkYXRlX2J1dHRvbicgKSxcblx0XHRcdCRraXRJZEZpZWxkOiBqUXVlcnkoICcjcWF6YW5hX3R5cGVraXQta2l0LWlkJyApLFxuXHRcdFx0JGRhdGFMYWJlbFNwYW46IGpRdWVyeSggJy5xYXphbmEtcHJvLXR5cGVraXQtZGF0YScpXG5cdFx0fTtcblx0fTtcblx0c2VsZi5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdHRoaXMuY2FjaGUuJGJ1dHRvbi5vbiggJ2NsaWNrJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdHNlbGYuZmV0Y2hGb250cygpO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5jYWNoZS4ka2l0SWRGaWVsZC5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdHNlbGYuc2V0U3RhdGUoICdjbGVhcicgKTtcblx0XHR9ICk7XG5cdH07XG5cdHNlbGYuZmV0Y2hGb250cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc2V0U3RhdGUoICdsb2FkaW5nJyApO1xuXHRcdHRoaXMuY2FjaGUuJGRhdGFMYWJlbFNwYW4uYWRkQ2xhc3MoICdoaWRkZW4nICk7XG5cblx0XHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0XHRraXRJRCA9IHRoaXMuY2FjaGUuJGtpdElkRmllbGQudmFsKCk7XG5cblx0XHRpZiAoICcnID09PSBraXRJRCApIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoICdjbGVhcicgKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRqUXVlcnkucG9zdCggYWpheHVybCwge1xuXHRcdFx0YWN0aW9uOiAncWF6YW5hX2FkbWluX2ZldGNoX2ZvbnRzJyxcblx0XHRcdGtpdF9pZDoga2l0SUQsXG5cdFx0XHRfbm9uY2U6IHNlbGYuY2FjaGUuJGJ1dHRvbi5kYXRhKCAnbm9uY2UnIClcblx0XHR9ICkuZG9uZSggZnVuY3Rpb24oIGRhdGEgKSB7XG5cdFx0XHRpZiAoIGRhdGEuc3VjY2VzcyApIHtcblx0XHRcdFx0dmFyIHRlbXBsYXRlID0gc2VsZi5jYWNoZS4kYnV0dG9uLmRhdGEoICdmb3VuZCcgKTtcblx0XHRcdFx0dGVtcGxhdGUgPSB0ZW1wbGF0ZS5yZXBsYWNlKCAne3tjb3VudH19JywgZGF0YS5kYXRhLmNvdW50ICk7XG5cdFx0XHRcdHNlbGYuY2FjaGUuJGRhdGFMYWJlbFNwYW4uaHRtbCggdGVtcGxhdGUgKS5yZW1vdmVDbGFzcyggJ2hpZGRlbicgKTtcblx0XHRcdFx0c2VsZi5zZXRTdGF0ZSggJ3N1Y2Nlc3MnICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZWxmLnNldFN0YXRlKCAnZXJyb3InICk7XG5cdFx0XHR9XG5cdFx0fSApLmZhaWwoIGZ1bmN0aW9uKCkge1xuXHRcdFx0c2VsZi5zZXRTdGF0ZSgpO1xuXHRcdH0gKTtcblx0fTtcblx0c2VsZi5zZXRTdGF0ZSA9IGZ1bmN0aW9uKCB0eXBlICl7XG5cdFx0dmFyIGNsYXNzZXMgPSBbICdsb2FkaW5nJywgJ3N1Y2Nlc3MnLCAnZXJyb3InIF0sXG5cdFx0XHRjdXJyZW50Q2xhc3MsIGNsYXNzSW5kZXg7XG5cblx0XHRmb3IgKCBjbGFzc0luZGV4IGluIGNsYXNzZXMgKSB7XG5cdFx0XHRjdXJyZW50Q2xhc3MgPSBjbGFzc2VzWyBjbGFzc0luZGV4IF07XG5cdFx0XHRpZiAoIHR5cGUgPT09IGN1cnJlbnRDbGFzcyApIHtcblx0XHRcdFx0dGhpcy5jYWNoZS4kYnV0dG9uLmFkZENsYXNzKCBjdXJyZW50Q2xhc3MgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuY2FjaGUuJGJ1dHRvbi5yZW1vdmVDbGFzcyggY3VycmVudENsYXNzICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHRzZWxmLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmNhY2hlRWxlbWVudHMoKTtcblx0XHR0aGlzLmJpbmRFdmVudHMoKTtcblx0fTtcblx0c2VsZi5pbml0KCk7XG59OyJdfQ==
