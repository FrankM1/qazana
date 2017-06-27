var BaseElementView = require( 'qazana-views/base-element' ),
	ElementEmptyView = require( 'qazana-views/element-empty' ),
	ColumnView;

ColumnView = BaseElementView.extend( {
	template: Marionette.TemplateCache.get( '#tmpl-qazana-element-column-content' ),

	emptyView: ElementEmptyView,

	childViewContainer: '> .qazana-column-wrap > .qazana-widget-wrap',

	behaviors: {
		Sortable: {
			behaviorClass: require( 'qazana-behaviors/sortable' ),
			elChildType: 'widget'
		},
		Resizable: {
			behaviorClass: require( 'qazana-behaviors/resizable' )
		},
		HandleDuplicate: {
			behaviorClass: require( 'qazana-behaviors/handle-duplicate' )
		},
		HandleEditToolsSection: {
			behaviorClass: require( 'qazana-behaviors/edit-tools-section' )
		},
		HandleAddMode: {
			behaviorClass: require( 'qazana-behaviors/duplicate' )
		}
	},

	className: function() {
		var classes = BaseElementView.prototype.className.apply( this, arguments ),
			type = this.isInner() ? 'inner' : 'top';

		return classes + ' qazana-column qazana-' + type + '-column';
	},

	ui: function() {
		var ui = BaseElementView.prototype.ui.apply( this, arguments );

		ui.duplicateButton = '> .qazana-element-overlay .qazana-editor-column-settings-list .qazana-editor-element-duplicate';
		ui.removeButton = '> .qazana-element-overlay .qazana-editor-column-settings-list .qazana-editor-element-remove';
		ui.saveButton = '> .qazana-element-overlay .qazana-editor-column-settings-list .qazana-editor-element-save';
		ui.triggerButton = '> .qazana-element-overlay .qazana-editor-column-settings-list .qazana-editor-element-trigger';
		ui.addButton = '> .qazana-element-overlay .qazana-editor-column-settings-list .qazana-editor-element-add';
		ui.columnTitle = '.column-title';
		ui.columnInner = '> .qazana-column-wrap';
		ui.listTriggers = '> .qazana-element-overlay .qazana-editor-element-trigger';

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

		this.listenTo( qazana.channels.data, 'widget:drag:start', this.onWidgetDragStart );
		this.listenTo( qazana.channels.data, 'widget:drag:end', this.onWidgetDragEnd );
	},

	isDroppingAllowed: function() {
		var elementView = qazana.channels.panelElements.request( 'element:selected' ),
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
			connectWith: '.qazana-widget-wrap',
			items: '> .qazana-element'
		};
	},

	// Events
	onCollectionChanged: function() {
		BaseElementView.prototype.onCollectionChanged.apply( this, arguments );

		this.changeChildContainerClasses();
	},

	changeChildContainerClasses: function() {
		var emptyClass = 'qazana-element-empty',
			populatedClass = 'qazana-element-populated';

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
			items: ' > .qazana-column-wrap > .qazana-widget-wrap > .qazana-element, >.qazana-column-wrap > .qazana-widget-wrap > .qazana-empty-view > .qazana-first-add',
			axis: [ 'vertical' ],
			groups: [ 'qazana-element' ],
			isDroppingAllowed: _.bind( self.isDroppingAllowed, self ),
			onDragEnter: function() {
				self.$el.addClass( 'qazana-dragging-on-child' );
			},
			onDragging: function( side, event ) {
				event.stopPropagation();

				if ( this.dataset.side !== side ) {
					Backbone.$( this ).attr( 'data-side', side );
				}
			},
			onDragLeave: function() {
				self.$el.removeClass( 'qazana-dragging-on-child' );

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
			isTriggerActive = $trigger.hasClass( 'qazana-active' );

		this.ui.listTriggers.removeClass( 'qazana-active' );

		if ( ! isTriggerActive ) {
			$trigger.addClass( 'qazana-active' );
		}
	},

	onWidgetDragStart: function() {
		this.$el.addClass( 'qazana-dragging' );
	},

	onWidgetDragEnd: function() {
		this.$el.removeClass( 'qazana-dragging' );
	}
} );

module.exports = ColumnView;
