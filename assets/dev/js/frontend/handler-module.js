var ViewModule = require( '../utils/view-module' ),
	HandlerModule;

HandlerModule = ViewModule.extend( {
	$element: null,

	editorListeners: null,

	onElementChange: null,

	onEditSettingsChange: null,

	onGeneralSettingsChange: null,

	onPageSettingsChange: null,

	isEdit: null,

	__construct: function( settings ) {
		this.$element = settings.$element;

		this.isEdit = this.$element.hasClass( 'qazana-element-edit-mode' );

		if ( this.isEdit ) {
			this.addEditorListeners();
		}
	},

	findElement: function( selector ) {
		var $mainElement = this.$element;

		return $mainElement.find( selector ).filter( function() {
			return jQuery( this ).closest( '.qazana-element' ).is( $mainElement );
		} );
	},

	getUniqueHandlerID: function( cid, $element ) {
		if ( ! cid ) {
			cid = this.getModelCID();
		}

		if ( ! $element ) {
			$element = this.$element;
		}

		return cid + $element.attr( 'data-element_type' ) + this.getConstructorID();
	},

	initEditorListeners: function() {
		var self = this;

		self.editorListeners = [
			{
				event: 'element:destroy',
				to: qazana.channels.data,
				callback: function( removedModel ) {
					if ( removedModel.cid !== self.getModelCID() ) {
						return;
					}

					self.onDestroy();
				},
			},
		];

		if ( self.onElementChange ) {
			var elementName = self.getElementName(),
				eventName = 'change';

			if ( 'global' !== elementName ) {
				eventName += ':' + elementName;
			}

			self.editorListeners.push( {
				event: eventName,
				to: qazana.channels.editor,
				callback: function( controlView, elementView ) {
					var elementViewHandlerID = self.getUniqueHandlerID( elementView.model.cid, elementView.$el );

					if ( elementViewHandlerID !== self.getUniqueHandlerID() ) {
						return;
					}

					self.onElementChange( controlView.model.get( 'name' ), controlView, elementView );
				},
			} );
		}

		if ( self.onEditSettingsChange ) {
			self.editorListeners.push( {
				event: 'change:editSettings',
				to: qazana.channels.editor,
				callback: function( changedModel, view ) {
					if ( view.model.cid !== self.getModelCID() ) {
						return;
					}

					self.onEditSettingsChange( Object.keys( changedModel.changed )[ 0 ] );
				},
			} );
		}

		[ 'page', 'general' ].forEach( function( settingsType ) {
			var listenerMethodName = 'on' + qazana.helpers.firstLetterUppercase( settingsType ) + 'SettingsChange';

			if ( self[ listenerMethodName ] ) {
				self.editorListeners.push( {
					event: 'change',
					to: qazana.settings[ settingsType ].model,
					callback: function( model ) {
						self[ listenerMethodName ]( model.changed );
					},
				} );
			}
		} );
	},

	getEditorListeners: function() {
		if ( ! this.editorListeners ) {
			this.initEditorListeners();
		}

		return this.editorListeners;
	},

	addEditorListeners: function() {
		var uniqueHandlerID = this.getUniqueHandlerID();

		this.getEditorListeners().forEach( function( listener ) {
			qazanaFrontend.addListenerOnce( uniqueHandlerID, listener.event, listener.callback, listener.to );
		} );
	},

	removeEditorListeners: function() {
		var uniqueHandlerID = this.getUniqueHandlerID();

		this.getEditorListeners().forEach( function( listener ) {
			qazanaFrontend.removeListeners( uniqueHandlerID, listener.event, null, listener.to );
		} );
	},

	getElementName: function() {
		return this.$element.data( 'element_type' ).split( '.' )[ 0 ];
	},

	getSkinName: function() {
		return this.$element.data( 'element_type' ).split( '.' )[ 1 ];
	},

	getID: function() {
		return this.$element.data( 'id' );
	},

	getModelCID: function() {
		return this.$element.data( 'model-cid' );
	},

	getDocumentSettings: function() {
		if ( qazanaFrontend.isEditMode() ) {
			return qazana.settings.page.getSettings().settings;
		}

		return jQuery( this.$element ).closest( '.qazana' ).data( 'settings' );
	},

    getElementSettings: function( setting ) {
        var elementSettings = {},
            skinName,
            settings,
			modelCID = this.getModelCID(),
			self = this,
			elementName = self.getElementName().replace( /-/g, '_' ),
            handHeldDevice = this.getDeviceName();

		if ( qazanaFrontend.isEditMode() && modelCID ) {
			settings = qazanaFrontend.config.elements.data[ modelCID ];

            skinName = 'global' !== elementName ? settings.attributes._skin : 'default';

			jQuery.each( settings.getActiveControls(), function( controlKey ) {
                var newControlKey = controlKey;
                if ( skinName !== 'default' ) {
                    newControlKey = controlKey.replace( skinName + '_', '' );
                }
                elementSettings[ newControlKey ] = settings.attributes[ controlKey ];
			} );
		} else {
            skinName = self.getSkinName() && 'global' !== elementName ? self.getSkinName().replace( /-/g, '_' ) : 'default';
                settings = this.$element.data( 'settings' ) || {};

            elementSettings = settings;

			if ( settings && skinName !== 'default' ) {
				jQuery.each( settings, function( controlKey ) {
					var newControlKey = controlKey;
					newControlKey = controlKey.replace( skinName + '_', '' );
					elementSettings[ newControlKey ] = self.getItems( settings, controlKey );
				} );
			}
        }

        if ( handHeldDevice ) {
            jQuery.each( elementSettings, function( controlKey ) {
                if ( typeof elementSettings[ controlKey + '_' + handHeldDevice ] !== 'undefined' ) {
                   elementSettings[ controlKey ] = elementSettings[ controlKey + '_' + handHeldDevice ]; // rewrite main value with mobile version
                }
            } );
        }

		return this.getItems( elementSettings, setting );
    },

	getEditSettings: function( setting ) {
		var attributes = {};

		if ( this.isEdit ) {
			attributes = qazanaFrontend.config.elements.editSettings[ this.getModelCID() ].attributes;
		}

		return this.getItems( attributes, setting );
	},

	onDestroy: function() {
		this.removeEditorListeners();

		if ( this.unbindEvents ) {
			this.unbindEvents();
		}
	},
} );

module.exports = HandlerModule;
