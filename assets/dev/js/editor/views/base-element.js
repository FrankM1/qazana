var BaseSettingsModel = require( 'qazana-models/base-settings' ),
	ControlsCSSParser = require( 'qazana-editor-utils/controls-css-parser' ),
	Validator = require( 'qazana-editor-utils/validator' ),
	BaseContainer = require( 'qazana-views/base-container' ),
	BaseElementView;

BaseElementView = BaseContainer.extend( {
	tagName: 'div',

	controlsCSSParser: null,

	toggleEditTools: true,

	className: function() {
		return this.getElementUniqueID();
	},

	attributes: function() {
		var type = this.model.get( 'elType' );

		if ( 'widget'  === type ) {
			type = this.model.get( 'widgetType' );
		}

		return {
			'data-id': this.getID(),
			'data-element_type': type
		};
	},

	ui: function() {
		return {
			triggerButton: '> .qazana-element-overlay .qazana-editor-element-trigger',
			duplicateButton: '> .qazana-element-overlay .qazana-editor-element-duplicate',
			removeButton: '> .qazana-element-overlay .qazana-editor-element-remove',
			saveButton: '> .qazana-element-overlay .qazana-editor-element-save',
			settingsList: '> .qazana-element-overlay .qazana-editor-element-settings',
			addButton: '> .qazana-element-overlay .qazana-editor-element-add'
		};
	},

	events: function() {
		return {
			'click @ui.removeButton': 'onClickRemove',
			'click @ui.saveButton': 'onClickSave',
			'click @ui.duplicateButton': 'onClickDuplicate',
			'click @ui.triggerButton': 'onClickEdit'
		};
	},

	getElementType: function() {
		return this.model.get( 'elType' );
	},

	getChildType: function() {
		return qazana.helpers.getElementChildType( this.getElementType() );
	},

	getChildView: function( model ) {
		var ChildView,
			elType = model.get( 'elType' );

		if ( 'section' === elType ) {
			ChildView = require( 'qazana-views/section' );
		} else if ( 'column' === elType ) {
			ChildView = require( 'qazana-views/column' );
		} else {
			ChildView = qazana.modules.WidgetView;
		}

		return qazana.hooks.applyFilters( 'element/view', ChildView, model, this );
	},

	templateHelpers: function() {
		return {
			elementModel: this.model,
			editModel: this.getEditModel()
		};
	},

	getTemplateType: function() {
		return 'js';
	},

	getEditModel: function() {
		return this.model;
	},

	initialize: function() {
		// grab the child collection from the parent model
		// so that we can render the collection as children
		// of this parent element
		this.collection = this.model.get( 'elements' );

		if ( this.collection ) {
			this.listenTo( this.collection, 'add remove reset', this.onCollectionChanged, this );
			this.listenTo( this.collection, 'switch', this.handleElementHover, this );
		}

		var editModel = this.getEditModel();

		this.listenTo( editModel.get( 'settings' ), 'change', this.onSettingsChanged, this );
		this.listenTo( editModel.get( 'editSettings' ), 'change', this.onEditSettingsChanged, this );

		this.initRemoveDialog();

		this.initControlsCSSParser();
	},

    handleElementHover: function( ) {

        var self = this;

        var config = {
            class : 'qazana-element-settings-active'
        };

        var hoverConfig = {
            sensitivity: 1, // number = sensitivity threshold (must be 1 or higher)
            interval: 10, // number = milliseconds for onMouseOver polling interval
            timeout: 500, // number = milliseconds delay before onMouseOut
            over: function() {
                self.$el.addClass( config.class );
            },
            out: function() {
                self.$el.removeClass(config.class );
            }
        };

        self.$el.hoverIntent(hoverConfig);

    },

	edit: function() {
		qazana.getPanelView().openEditor( this.getEditModel(), this );
	},

	addElementFromPanel: function( options ) {
		var elementView = qazana.channels.panelElements.request( 'element:selected' );

		var itemData = {
			id: qazana.helpers.getUniqueID(),
			elType: elementView.model.get( 'elType' )
		};

		if ( 'widget' === itemData.elType ) {
			itemData.widgetType = elementView.model.get( 'widgetType' );
		} else if ( 'section' === itemData.elType ) {
			itemData.elements = [];
			itemData.isInner = true;
		} else {
			return;
		}

		var customData = elementView.model.get( 'custom' );

		if ( customData ) {
			_.extend( itemData, customData );
		}

		var newView = this.addChildElement( itemData, options );

		if ( 'section' === newView.getElementType() && newView.isInner() ) {
			newView.addEmptyColumn();
		}

	},

	addControlValidator: function( controlName, validationCallback ) {
		validationCallback = _.bind( validationCallback, this );

		var validator = new Validator( { customValidationMethod: validationCallback } ),
			validators = this.getEditModel().get( 'settings' ).validators;

		if ( ! validators[ controlName ] ) {
			validators[ controlName ] = [];
		}

		validators[ controlName ].push( validator );
	},

	isCollectionFilled: function() {
		return false;
	},

	isInner: function() {
		return !! this.model.get( 'isInner' );
	},

	initRemoveDialog: function() {
		var removeDialog;

		this.getRemoveDialog = function() {
			if ( ! removeDialog ) {
				var elementTitle = this.model.getTitle();

				removeDialog = qazana.dialogsManager.createWidget( 'confirm', {
					message: qazana.translate( 'dialog_confirm_delete', [ elementTitle.toLowerCase() ] ),
					headerMessage: qazana.translate( 'delete_element', [ elementTitle ] ),
					strings: {
						confirm: qazana.translate( 'delete' ),
						cancel: qazana.translate( 'cancel' )
					},
					defaultOption: 'confirm',
					onConfirm: _.bind( function() {
						var parent = this._parent;

						parent.isManualRemoving = true;

						this.model.destroy();

						parent.isManualRemoving = false;
					}, this )
				} );
			}

			return removeDialog;
		};
	},

	initControlsCSSParser: function() {
		this.controlsCSSParser = new ControlsCSSParser( { id: this.model.cid } );
	},

	enqueueFonts: function() {
		var editModel = this.getEditModel(),
			settings = editModel.get( 'settings' );

		_.each( settings.getFontControls(), _.bind( function( control ) {
			var fontFamilyName = editModel.getSetting( control.name );

			if ( _.isEmpty( fontFamilyName ) ) {
				return;
			}

			qazana.helpers.enqueueFont( fontFamilyName );
		}, this ) );
	},

	renderStyles: function() {
		var self = this,
			settings = self.getEditModel().get( 'settings' );

		self.controlsCSSParser.stylesheet.empty();

		self.controlsCSSParser.addStyleRules( settings.getStyleControls(), settings.attributes, self.getEditModel().get( 'settings' ).controls, [ /{{ID}}/g, /{{WRAPPER}}/g ], [ self.getID(), '#qazana .' + self.getElementUniqueID() ] );

		self.controlsCSSParser.addStyleToDocument();

		var extraCSS = qazana.hooks.applyFilters( 'editor/style/styleText', '', this );

		if ( extraCSS ) {
			self.controlsCSSParser.elements.$stylesheetElement.append( extraCSS );
		}
	},

	renderCustomClasses: function() {
		var self = this;

		self.$el.addClass( 'qazana-element' );

		var settings = self.getEditModel().get( 'settings' ),
			classControls = settings.getClassControls();

		// Remove all previous classes
		_.each( classControls, function( control ) {
			var previousClassValue = settings.previous( control.name );

			if ( control.classes_dictionary ) {
				if ( undefined !== control.classes_dictionary[ previousClassValue ] ) {
					previousClassValue = control.classes_dictionary[ previousClassValue ];
				}
			}

			self.$el.removeClass( control.prefix_class + previousClassValue );
		} );

		// Add new classes
		_.each( classControls, function( control ) {
			var value = settings.attributes[ control.name ],
				classValue = value;

			if ( control.classes_dictionary ) {
				if ( undefined !== control.classes_dictionary[ value ] ) {
					classValue = control.classes_dictionary[ value ];
				}
			}

			var isVisible = qazana.helpers.isActiveControl( control, settings.attributes );

			if ( isVisible && ! _.isEmpty( classValue ) ) {
				self.$el
					.addClass( control.prefix_class + classValue )
					.addClass( _.result( self, 'className' ) );
			}
		} );
	},

	renderCustomElementID: function() {
		var customElementID = this.getEditModel().get( 'settings' ).get( '_element_id' );

		this.$el.attr( 'id', customElementID );
	},

	renderUI: function() {
		this.renderStyles();
		this.renderCustomClasses();
		this.renderCustomElementID();
		this.enqueueFonts();
	},

	runReadyTrigger: function() {
		_.defer( _.bind( function() {
			qazanaFrontend.elementsHandler.runReadyTrigger( this.$el );
		}, this ) );
	},

	getID: function() {
		return this.model.get( 'id' );
	},

	getElementUniqueID: function() {
		return 'qazana-element-' + this.getID();
	},

	duplicate: function() {
		this.trigger( 'request:duplicate' );
	},

	confirmRemove: function() {
		this.getRemoveDialog().show();
	},

	renderOnChange: function( settings ) {
		// Make sure is correct model
		if ( settings instanceof BaseSettingsModel ) {
			var hasChanged = settings.hasChanged(),
				isContentChanged = ! hasChanged,
				isRenderRequired = ! hasChanged;

			_.each( settings.changedAttributes(), function( settingValue, settingKey ) {
				var control = settings.getControl( settingKey );

				if ( ! control ) {
					isRenderRequired = true;

					return;
				}

				if ( 'none' !== control.render_type ) {
					isRenderRequired = true;
				}

				if ( -1 !== [ 'none', 'ui' ].indexOf( control.render_type ) ) {
					return;
				}

				if ( 'template' === control.render_type || ! settings.isStyleControl( settingKey ) && ! settings.isClassControl( settingKey ) && '_element_id' !== settingKey ) {
					isContentChanged = true;
				}
			} );

			if ( ! isRenderRequired ) {
				return;
			}

			if ( ! isContentChanged ) {
				this.renderUI();
				return;
			}
		}

		// Re-render the template
		var templateType = this.getTemplateType(),
			editModel = this.getEditModel();

		if ( 'js' === templateType ) {
			this.getEditModel().setHtmlCache();
			this.render();
			editModel.renderOnLeave = true;
		} else {
			editModel.renderRemoteServer();
		}
	},

	onRender: function() {
		var self = this;

		self.renderUI();

		self.runReadyTrigger();

		if ( self.toggleEditTools ) {
			self.ui.settingsList.hoverIntent( function() {
				self.ui.triggerButton.addClass( 'qazana-active' );
			}, function() {
				self.ui.triggerButton.removeClass( 'qazana-active' );
			}, { timeout: 500 } );
		}
	},

	onCollectionChanged: function() {
		qazana.setFlagEditorChange( true );
	},

	onEditSettingsChanged: function( changedModel ) {
		this.renderOnChange( changedModel );
	},

	onSettingsChanged: function( changedModel ) {
		qazana.setFlagEditorChange( true );

		this.renderOnChange( changedModel );
	},

	onClickEdit: function( event ) {
		event.preventDefault();
		event.stopPropagation();

		var activeMode = qazana.channels.dataEditMode.request( 'activeMode' );

		if ( 'edit' !== activeMode ) {
			return;
		}

		this.edit();
	},

	onClickDuplicate: function( event ) {
		event.preventDefault();
		event.stopPropagation();

		this.duplicate();
	},

	onClickRemove: function( event ) {
		event.preventDefault();
		event.stopPropagation();

		this.confirmRemove();
	},

	onClickSave: function( event ) {
		event.preventDefault();

		var model = this.model;

		qazana.templates.startModal( {
			onReady: function() {
				qazana.templates.getLayout().showSaveTemplateView( model );
			}
		} );
	},

	onDestroy: function() {
		this.controlsCSSParser.removeStyleFromDocument();
	}
} );

module.exports = BaseElementView;
