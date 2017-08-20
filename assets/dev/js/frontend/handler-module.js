var ViewModule = require( '../utils/view-module' ),
	HandlerModule;

HandlerModule = ViewModule.extend( {
	$element: null,

	onElementChange: null,

	onGeneralSettingsChange: null,

	onPageSettingsChange: null,

	__construct: function( settings ) {
		this.$element  = settings.$element;

		if ( qazanaFrontend.isEditMode() ) {
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

	getID: function() {
		return this.$element.data( 'id' );
	},

	getModelCID: function() {
		return this.$element.data( 'model-cid' );
	},

	getElementSettings: function( setting ) {
		var elementSettings = {},
			modelCID = this.getModelCID();

		if ( qazanaFrontend.isEditMode() && modelCID ) {
			var settings = qazanaFrontend.config.elements.data[ modelCID ],
				settingsKeys = qazanaFrontend.config.elements.keys[ settings.attributes.widgetType || settings.attributes.elType ];

			jQuery.each( settings.getActiveControls(), function( controlKey ) {
				if ( -1 !== settingsKeys.indexOf( controlKey ) ) {
					elementSettings[ controlKey ] = settings.attributes[ controlKey ];
				}
			} );
		} else {
			elementSettings = this.$element.data( 'settings' ) || {};
		}

		return this.getItems( elementSettings, setting );
	},

	getEditSettings: function( setting ) {
		if ( ! qazanaFrontend.isEditMode() ) {
			return {};
		}

		var editSettings = qazanaFrontend.config.elements.editSettings[ this.getModelCID() ];

		return this.getItems( editSettings.attributes, setting );
	}
} );

module.exports = HandlerModule;
