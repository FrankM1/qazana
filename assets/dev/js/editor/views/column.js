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
		HandleAddMode: {
			behaviorClass: require( 'qazana-behaviors/duplicate' )
		}
	},

	className: function() {
		var classes = BaseElementView.prototype.className.apply( this, arguments ),
			type = this.isInner() ? 'inner' : 'top';

		return classes + ' qazana-column qazana-' + type + '-column';
	},

	tagName: function() {
		var html_tag = this.model.getSetting( 'html_tag' ) ? this.model.getSetting( 'html_tag' ) : 'div';

		return html_tag;
	},

	ui: function() {
		var ui = BaseElementView.prototype.ui.apply( this, arguments );

		ui.columnInner = '> .qazana-column-wrap';

		ui.percentsTooltip = '> .qazana-element-overlay .qazana-column-percents-tooltip';

		return ui;
	},

	triggers: {
		'click @ui.addButton': 'click:new'
	},

	initialize: function() {
		BaseElementView.prototype.initialize.apply( this, arguments );

		this.addControlValidator( '_inline_size', this.onEditorInlineSizeInputChange );
	},

	isDroppingAllowed: function() {
		var elementView = qazana.channels.panelElements.request( 'element:selected' ),
			elType = elementView.model.get( 'elType' );

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
			self.ui.percentsTooltip.text( self.getPercentsForDisplay() );
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
			items: '> .qazana-element'
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
			isDroppingAllowed: _.bind( self.isDroppingAllowed, self ),
			currentElementClass: 'qazana-html5dnd-current-element',
			placeholderClass: 'qazana-sortable-placeholder qazana-widget-placeholder',
			hasDraggingOnChildClass: 'qazana-dragging-on-child',
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
	}
} );

module.exports = ColumnView;
