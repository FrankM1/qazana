var ViewModule = require( '../utils/view-module' ),
	HandlerModule;

HandlerModule = ViewModule.extend( {
	$element: null,

	onElementChange: null,

	onEditSettingsChange: null,

	onGeneralSettingsChange: null,

	onPageSettingsChange: null,

	isEdit: null,

	__construct: function( settings ) {
		this.$element  = settings.$element;

		this.isEdit = this.$element.hasClass( 'qazana-element-edit-mode' );

		if ( this.isEdit ) {
			this.addEditorListener();
		}
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

	addEditorListener: function() {
		var self = this,
			uniqueHandlerID = self.getUniqueHandlerID();

		if ( self.onElementChange ) {
			var elementName = self.getElementName(),
				eventName = 'change';

			if ( 'global' !== elementName ) {
				eventName += ':' + elementName;
			}

			qazanaFrontend.addListenerOnce( uniqueHandlerID, eventName, function( controlView, elementView ) {
				var elementViewHandlerID = self.getUniqueHandlerID( elementView.model.cid, elementView.$el );

				if ( elementViewHandlerID !== uniqueHandlerID ) {
					return;
				}

				self.onElementChange( controlView.model.get( 'name' ),  controlView, elementView );
			}, qazana.channels.editor );
		}

		if ( self.onEditSettingsChange ) {
			qazanaFrontend.addListenerOnce( uniqueHandlerID, 'change:editSettings', function( changedModel, view ) {
				if ( view.model.cid !== self.getModelCID() ) {
					return;
				}

				self.onEditSettingsChange( Object.keys( changedModel.changed )[0] );
			}, qazana.channels.editor );
		}

		[ 'page', 'general' ].forEach( function( settingsType ) {
			var listenerMethodName = 'on' + settingsType.charAt( 0 ).toUpperCase() + settingsType.slice( 1 ) + 'SettingsChange';

			if ( self[ listenerMethodName ] ) {
				qazanaFrontend.addListenerOnce( uniqueHandlerID, 'change', function( model ) {
					self[ listenerMethodName ]( model.changed );
				}, qazana.settings[ settingsType ].model );
			}
		} );
	},

	getElementName: function() {
		return this.$element.data( 'element_type' ).split( '.' )[0];
	},

	getSkinName: function() {
		return this.$element.data( 'element_type' ).split( '.' )[1];
	},

	getID: function() {
		return this.$element.data( 'id' );
	},

	getModelCID: function() {
		return this.$element.data( 'model-cid' );
	},

    getElementSettings: function( setting ) {
		var elementSettings = {},
			modelCID = this.getModelCID(),
			self = this,
			settings,
			elementName = self.getElementName().replace(/-/g, '_'),
			skinName = self.getSkinName() && 'global' !== elementName ? self.getSkinName().replace(/-/g, '_') : 'default';
		
		if ( qazanaFrontend.isEditMode() && modelCID ) {
			settings = qazanaFrontend.config.elements.data[ modelCID ];

			jQuery.each( settings.getActiveControls(), function( controlKey ) {
                var newControlKey = controlKey;
                if ( skinName !== 'default' ) {
                    newControlKey = controlKey.replace( skinName + '_', '' );
                } 
                elementSettings[ newControlKey ] = settings.attributes[ controlKey ];
			} );

		} else {

			settings = this.$element.data( 'settings' ) || {};

			if ( settings && skinName !== 'default' ) {
				jQuery.each( settings, function( controlKey ) {
					var newControlKey = controlKey;
					newControlKey = controlKey.replace( skinName + '_', '' );
					elementSettings[ newControlKey ] = self.getItems( settings, controlKey );
				} );

			} else {
				elementSettings = settings;
			}

		}

		return this.getItems( elementSettings, setting );
    },

	getEditSettings: function( setting ) {
		var attributes = {};

		if ( this.isEdit ) {
			attributes = qazanaFrontend.config.elements.editSettings[ this.getModelCID() ].attributes;
		}

		return this.getItems( attributes, setting );
	}
} );

module.exports = HandlerModule;
