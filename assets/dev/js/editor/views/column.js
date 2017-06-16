var BaseElementView = require( 'builder-views/base-element' ),
	ElementEmptyView = require( 'builder-views/element-empty' ),
	ColumnView;

ColumnView = BaseElementView.extend( {
	template: Marionette.TemplateCache.get( '#tmpl-builder-element-column-content' ),

	emptyView: ElementEmptyView,

	childViewContainer: '> .builder-column-wrap > .builder-widget-wrap',

	behaviors: {
		Sortable: {
			behaviorClass: require( 'builder-behaviors/sortable' ),
			elChildType: 'widget'
		},
		Resizable: {
			behaviorClass: require( 'builder-behaviors/resizable' )
		},
		HandleDuplicate: {
			behaviorClass: require( 'builder-behaviors/handle-duplicate' )
		},
		HandleEditToolsSection: {
			behaviorClass: require( 'builder-behaviors/edit-tools-section' )
		},
		HandleAddMode: {
			behaviorClass: require( 'builder-behaviors/duplicate' )
		}
	},

	className: function() {
		var classes = BaseElementView.prototype.className.apply( this, arguments ),
			type = this.isInner() ? 'inner' : 'top';

		return classes + ' builder-column builder-' + type + '-column';
	},

	ui: function() {
		var ui = BaseElementView.prototype.ui.apply( this, arguments );

		ui.duplicateButton = '> .builder-element-overlay .builder-editor-column-settings-list .builder-editor-element-duplicate';
		ui.removeButton = '> .builder-element-overlay .builder-editor-column-settings-list .builder-editor-element-remove';
		ui.saveButton = '> .builder-element-overlay .builder-editor-column-settings-list .builder-editor-element-save';
		ui.triggerButton = '> .builder-element-overlay .builder-editor-column-settings-list .builder-editor-element-trigger';
		ui.addButton = '> .builder-element-overlay .builder-editor-column-settings-list .builder-editor-element-add';
		ui.columnTitle = '.column-title';
		ui.columnInner = '> .builder-column-wrap';
		ui.listTriggers = '> .builder-element-overlay .builder-editor-element-trigger';

		return ui;
	},

	triggers: {
		'click @ui.addButton': 'click:new'
	},

	events: function() {
		var events = BaseElementView.prototype.events.apply( this, arguments );

		events[ 'click @ui.listTriggers' ] = 'onClickTrigger';
		events[ 'click @ui.triggerButton' ] = 'onClickEdit';

		return events;
	},

	initialize: function() {
		BaseElementView.prototype.initialize.apply( this, arguments );

		this.listenTo( builder.channels.data, 'widget:drag:start', this.onWidgetDragStart );
		this.listenTo( builder.channels.data, 'widget:drag:end', this.onWidgetDragEnd );
	},

	isDroppingAllowed: function() {
		var elementView = builder.channels.panelElements.request( 'element:selected' ),
			elType = elementView.model.get( 'elType' );

		if ( 'section' === elType ) {
			return ! this.isInner();
		}

		return 'widget' === elType;
	},

	changeSizeUI: function() {
		var columnSize = this.model.getSetting( '_column_size' ),
			inlineSize = this.model.getSetting( '_inline_size' ),
			columnSizeTitle = parseFloat( inlineSize || columnSize ).toFixed( 1 ) + '%';

		this.$el.attr( 'data-col', columnSize );

		this.ui.columnTitle.html( columnSizeTitle );
	},

	getSortableOptions: function() {
		return {
			connectWith: '.builder-widget-wrap',
			items: '> .builder-element'
		};
	},

	// Events
	onCollectionChanged: function() {
		BaseElementView.prototype.onCollectionChanged.apply( this, arguments );

		this.changeChildContainerClasses();
	},

	changeChildContainerClasses: function() {
		var emptyClass = 'builder-element-empty',
			populatedClass = 'builder-element-populated';

		if ( this.collection.isEmpty() ) {
			this.ui.columnInner.removeClass( populatedClass ).addClass( emptyClass );
		} else {
			this.ui.columnInner.removeClass( emptyClass ).addClass( populatedClass );
		}
	},

	onRender: function() {
		var self = this;

		self.changeChildContainerClasses();
		self.changeSizeUI();

		self.$el.html5Droppable( {
			items: ' > .builder-column-wrap > .builder-widget-wrap > .builder-element, >.builder-column-wrap > .builder-widget-wrap > .builder-empty-view > .builder-first-add',
			axis: [ 'vertical' ],
			groups: [ 'builder-element' ],
			isDroppingAllowed: _.bind( self.isDroppingAllowed, self ),
			onDragEnter: function() {
				self.$el.addClass( 'builder-dragging-on-child' );
			},
			onDragging: function( side, event ) {
				event.stopPropagation();

				if ( this.dataset.side !== side ) {
					Backbone.$( this ).attr( 'data-side', side );
				}
			},
			onDragLeave: function() {
				self.$el.removeClass( 'builder-dragging-on-child' );

				Backbone.$( this ).removeAttr( 'data-side' );
			},
			onDropping: function( side, event ) {
				event.stopPropagation();

				var newIndex = Backbone.$( this ).index();

				if ( 'bottom' === side ) {
					newIndex++;
				}

				self.addElementFromPanel( { at: newIndex } );
			}
		} );
	},

	onClickTrigger: function( event ) {
		event.preventDefault();

		var $trigger = this.$( event.currentTarget ),
			isTriggerActive = $trigger.hasClass( 'builder-active' );

		this.ui.listTriggers.removeClass( 'builder-active' );

		if ( ! isTriggerActive ) {
			$trigger.addClass( 'builder-active' );
		}
	},

	onWidgetDragStart: function() {
		this.$el.addClass( 'builder-dragging' );
	},

	onWidgetDragEnd: function() {
		this.$el.removeClass( 'builder-dragging' );
	}
} );

module.exports = ColumnView;
