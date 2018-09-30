var BaseElementView = require( 'qazana-elements/views/base' ),
	ColumnEmptyView = require( 'qazana-elements/views/column-empty' ),
	ColumnView;

ColumnView = BaseElementView.extend( {
	template: Marionette.TemplateCache.get( '#tmpl-qazana-column-content' ),

	emptyView: ColumnEmptyView,

	childViewContainer: '> .qazana-column-wrap > .qazana-widget-wrap',

	toggleEditTools: true,

	behaviors: function() {
		var behaviors = BaseElementView.prototype.behaviors.apply( this, arguments );

		_.extend( behaviors, {
			Sortable: {
				behaviorClass: require( 'qazana-behaviors/sortable' ),
				elChildType: 'widget',
			},
			Resizable: {
				behaviorClass: require( 'qazana-behaviors/resizable' ),
			},
		} );

		return qazana.hooks.applyFilters( 'elements/column/behaviors', behaviors, this );
	},

	className: function() {
		var classes = BaseElementView.prototype.className.apply( this, arguments ),
			type = this.isInner() ? 'inner' : 'top';

		return classes + ' qazana-column qazana-' + type + '-column';
	},

	tagName: function() {
		return this.model.getSetting( 'html_tag' ) || 'div';
	},

	ui: function() {
		var ui = BaseElementView.prototype.ui.apply( this, arguments );

		ui.columnInner = '> .qazana-column-wrap';

		ui.percentsTooltip = '> .qazana-element-overlay .qazana-column-percents-tooltip';

		return ui;
	},

	initialize: function() {
		BaseElementView.prototype.initialize.apply( this, arguments );

		this.addControlValidator( '_inline_size', this.onEditorInlineSizeInputChange );
	},

	getContextMenuGroups: function() {
		var groups = BaseElementView.prototype.getContextMenuGroups.apply( this, arguments ),
			generalGroupIndex = groups.indexOf( _.findWhere( groups, { name: 'general' } ) );

		groups.splice( generalGroupIndex + 1, 0, {
			name: 'addNew',
			actions: [
				{
					name: 'addNew',
                    icon: 'eicon-plus',
					title: qazana.translate( 'new_column' ),
					callback: this.addNewColumn.bind( this ),
				},
			],
		} );

		return groups;
	},

	isDroppingAllowed: function() {
		var elementView = qazana.channels.panelElements.request( 'element:selected' );

		if ( ! elementView ) {
			return false;
		}

		var elType = elementView.model.get( 'elType' );

		if ( 'section' === elType ) {
			return ! this.isInner();
		}

		return 'widget' === elType;
	},

	getPercentsForDisplay: function() {
		var inlineSize = +this.model.getSetting( '_inline_size' ) || this.getPercentSize();

		return inlineSize.toFixed( 1 ) + '%';
	},

	changeSizeUI: function() {
		var self = this,
			columnSize = self.model.getSetting( '_column_size' );

		self.$el.attr( 'data-col', columnSize );

		_.defer( function() { // Wait for the column size to be applied
			if ( self.ui.percentsTooltip ) {
				self.ui.percentsTooltip.text( self.getPercentsForDisplay() );
			}
		} );
	},

	getPercentSize: function( size ) {
		if ( ! size ) {
			size = this.el.getBoundingClientRect().width;
		}

		return +( size / this.$el.parent().width() * 100 ).toFixed( 3 );
	},

	getSortableOptions: function() {
		return {
			connectWith: '.qazana-widget-wrap',
			items: '> .qazana-element',
		};
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

	addNewColumn: function() {
		this.trigger( 'request:add:new' );
	},

	// Events
	onCollectionChanged: function() {
		BaseElementView.prototype.onCollectionChanged.apply( this, arguments );

		this.changeChildContainerClasses();
	},

	onRender: function() {
		var self = this;

		BaseElementView.prototype.onRender.apply( self, arguments );

		self.changeChildContainerClasses();

		self.changeSizeUI();

		self.$el.html5Droppable( {
			items: ' > .qazana-column-wrap > .qazana-widget-wrap > .qazana-element, >.qazana-column-wrap > .qazana-widget-wrap > .qazana-empty-view > .qazana-first-add',
			axis: [ 'vertical' ],
			groups: [ 'qazana-element' ],
			isDroppingAllowed: self.isDroppingAllowed.bind( self ),
			currentElementClass: 'qazana-html5dnd-current-element',
			placeholderClass: 'qazana-sortable-placeholder qazana-widget-placeholder',
			hasDraggingOnChildClass: 'qazana-dragging-on-child',
			onDropping: function( side, event ) {
				event.stopPropagation();

				var newIndex = jQuery( this ).index();

				if ( 'bottom' === side ) {
					newIndex++;
				}

				self.addElementFromPanel( { at: newIndex } );
			},
		} );
	},

	onSettingsChanged: function( settings ) {
		BaseElementView.prototype.onSettingsChanged.apply( this, arguments );

		var changedAttributes = settings.changedAttributes();

		if ( '_column_size' in changedAttributes || '_inline_size' in changedAttributes ) {
			this.changeSizeUI();
		}
	},

	onEditorInlineSizeInputChange: function( newValue, oldValue ) {
		var errors = [],
			columnSize = this.model.getSetting( '_column_size' );

		// If there's only one column
		if ( 100 === columnSize ) {
			errors.push( 'Could not resize one column' );

			return errors;
		}

		if ( ! oldValue ) {
			oldValue = columnSize;
		}

		try {
			this._parent.resizeChild( this, +oldValue, +newValue );
		} catch ( e ) {
			if ( e.message === this._parent.errors.columnWidthTooLarge ) {
				errors.push( e.message );
			}
		}

		return errors;
	},

	onAddButtonClick: function( event ) {
		event.stopPropagation();

		this.addNewColumn();
	},
} );

module.exports = ColumnView;
