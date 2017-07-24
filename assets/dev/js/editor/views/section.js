var BaseElementView = require( 'qazana-views/base-element' ),
	AddSectionView = require( 'qazana-views/add-section/inline' ),
	SectionView;

SectionView = BaseElementView.extend( {
	template: Marionette.TemplateCache.get( '#tmpl-qazana-element-section-content' ),

	addSectionView: null,

	toggleEditTools: false,

	className: function() {
		var classes = BaseElementView.prototype.className.apply( this, arguments ),
			type = this.isInner() ? 'inner' : 'top';

		return classes + ' qazana-section qazana-' + type + '-section';
	},

	tagName: function() {
		return this.model.getSetting( 'html_tag' );
	},

	childViewContainer: '> .qazana-container > .qazana-row',

	behaviors: {
		Sortable: {
			behaviorClass: require( 'qazana-behaviors/sortable' ),
			elChildType: 'column'
		},
		HandleDuplicate: {
			behaviorClass: require( 'qazana-behaviors/handle-duplicate' )
		},
		HandleAddMode: {
			behaviorClass: require( 'qazana-behaviors/duplicate' )
		}
	},

	errors: {
		columnWidthTooLarge: 'New column width is too large',
		columnWidthTooSmall: 'New column width is too small'
	},

	events: function() {
		var events = BaseElementView.prototype.events.apply( this, arguments );

		events[ 'click @ui.addButton' ] = 'onClickAdd';

		return events;
	},

	initialize: function() {
		BaseElementView.prototype.initialize.apply( this, arguments );

		this.listenTo( this.collection, 'add remove reset', this._checkIsFull );
	},

	addEmptyColumn: function() {
		this.addChildModel( {
			id: qazana.helpers.getUniqueID(),
			elType: 'column',
			settings: {},
			elements: []
		} );
	},

	addChildModel: function( model, options ) {
		var isModelInstance = model instanceof Backbone.Model,
			isInner = this.isInner();

		if ( isModelInstance ) {
			model.set( 'isInner', isInner );
		} else {
			model.isInner = isInner;
		}

		return BaseElementView.prototype.addChildModel.apply( this, arguments );
	},

	getSortableOptions: function() {
		var sectionConnectClass = this.isInner() ? '.qazana-inner-section' : '.qazana-top-section';

		return {
			connectWith: sectionConnectClass + ' > .qazana-container > .qazana-row',
			handle: '> .qazana-element-overlay .qazana-editor-column-settings .qazana-editor-element-trigger',
			items: '> .qazana-column',
			forcePlaceholderSize: true,
			tolerance: 'pointer'
		};
	},

	getColumnPercentSize: function( element, size ) {
		return +( size / element.parent().width() * 100 ).toFixed( 3 );
	},

	getDefaultStructure: function() {
		return this.collection.length + '0';
	},

	getStructure: function() {
		return this.model.getSetting( 'structure' );
	},

	setStructure: function( structure ) {
		var parsedStructure = qazana.presetsFactory.getParsedStructure( structure );

		if ( +parsedStructure.columnsCount !== this.collection.length ) {
			throw new TypeError( 'The provided structure doesn\'t match the columns count.' );
		}

		this.model.setSetting( 'structure', structure );

		this.redefineLayout();
	},

	redefineLayout: function() {
		var preset = qazana.presetsFactory.getPresetByStructure( this.getStructure() );

		this.collection.each( function( model, index ) {
			model.setSetting( '_column_size', preset.preset[ index ] );
			model.setSetting( '_inline_size', null );
		} );
	},

	resetLayout: function() {
		this.setStructure( this.getDefaultStructure() );
	},

	resetColumnsCustomSize: function() {
		this.collection.each( function( model ) {
			model.setSetting( '_inline_size', null );
		} );
	},

	isCollectionFilled: function() {
		var MAX_SIZE = 10,
			columnsCount = this.collection.length;

		return ( MAX_SIZE <= columnsCount );
	},

	_checkIsFull: function() {
		this.$el.toggleClass( 'qazana-section-filled', this.isCollectionFilled() );
	},

	_checkIsEmpty: function() {
		if ( ! this.collection.length ) {
			this.addEmptyColumn();
		}
	},

	getColumnAt: function( index ) {
		var model = this.collection.at( index );

		return model ? this.children.findByModelCid( model.cid ) : null;
	},

	getNextColumn: function( columnView ) {
		return this.getColumnAt( this.collection.indexOf( columnView.model ) + 1 );
	},

	getPreviousColumn: function( columnView ) {
		return this.getColumnAt( this.collection.indexOf( columnView.model ) - 1 );
	},

	showChildrenPercentsTooltip: function( columnView, nextColumnView ) {
		columnView.ui.percentsTooltip.show();

		columnView.ui.percentsTooltip.attr( 'data-side', qazana.config.is_rtl ? 'right' : 'left' );

		nextColumnView.ui.percentsTooltip.show();

		nextColumnView.ui.percentsTooltip.attr( 'data-side', qazana.config.is_rtl ? 'left' : 'right' );
	},

	hideChildrenPercentsTooltip: function( columnView, nextColumnView ) {
		columnView.ui.percentsTooltip.hide();

		nextColumnView.ui.percentsTooltip.hide();
	},

	resizeChild: function( childView, currentSize, newSize ) {
		var nextChildView = this.getNextColumn( childView ) || this.getPreviousColumn( childView );

		if ( ! nextChildView ) {
			throw new ReferenceError( 'There is not any next column' );
		}

		var minColumnSize = 10,
			$nextElement = nextChildView.$el,
			nextElementCurrentSize = +nextChildView.model.getSetting( '_inline_size' ) || this.getColumnPercentSize( $nextElement, $nextElement[0].getBoundingClientRect().width ),
			nextElementNewSize = +( currentSize + nextElementCurrentSize - newSize ).toFixed( 3 );

		if ( nextElementNewSize < minColumnSize ) {
			throw new RangeError( this.errors.columnWidthTooLarge );
		}

		if ( newSize < minColumnSize ) {
			throw new RangeError( this.errors.columnWidthTooSmall );
		}

		nextChildView.model.setSetting( '_inline_size', nextElementNewSize );

		return true;
	},

	destroyAddSectionView: function() {
		if ( this.addSectionView && ! this.addSectionView.isDestroyed ) {
			this.addSectionView.destroy();
		}
	},

	onBeforeRender: function() {
		this._checkIsEmpty();
	},

	onRender: function() {
		BaseElementView.prototype.onRender.apply( this, arguments );

		this._checkIsFull();
	},

	onClickAdd: function() {
		if ( this.addSectionView && ! this.addSectionView.isDestroyed ) {
			this.addSectionView.fadeToDeath();

			return;
		}

		var myIndex = this.model.collection.indexOf( this.model ),
			addSectionView = new AddSectionView( {
				atIndex: myIndex
			} );

		addSectionView.render();

		this.$el.before( addSectionView.$el );

		addSectionView.$el.hide();

		// Delaying the slide down for slow-render browsers (such as FF)
		setTimeout( function() {
			addSectionView.$el.slideDown();
		} );

		this.addSectionView = addSectionView;
	},

	onAddChild: function() {
		if ( ! this.isBuffering ) {
			// Reset the layout just when we have really add/remove element.
			this.resetLayout();
		}
	},

	onRemoveChild: function() {
		if ( ! this.isManualRemoving ) {
			return;
		}

		// If it's the last column, please create new one.
		this._checkIsEmpty();

		this.resetLayout();
	},

	onChildviewRequestResizeStart: function( columnView ) {
		var nextColumnView = this.getNextColumn( columnView );

		if ( ! nextColumnView ) {
			return;
		}

		this.showChildrenPercentsTooltip( columnView, nextColumnView );

		var $iframes = columnView.$el.find( 'iframe' ).add( nextColumnView.$el.find( 'iframe' ) );

		qazana.helpers.disableElementEvents( $iframes );
	},

	onChildviewRequestResizeStop: function( columnView ) {
		var nextColumnView = this.getNextColumn( columnView );

		if ( ! nextColumnView ) {
			return;
		}

		this.hideChildrenPercentsTooltip( columnView, nextColumnView );

		var $iframes = columnView.$el.find( 'iframe' ).add( nextColumnView.$el.find( 'iframe' ) );

		qazana.helpers.enableElementEvents( $iframes );
	},

	onChildviewRequestResize: function( columnView, ui, event ) {
		// Get current column details
		var currentSize = +columnView.model.getSetting( '_inline_size' ) || this.getColumnPercentSize( columnView.$el, columnView.$el.data( 'originalWidth' ) );

		ui.element.css( {
			width: '',
			left: 'initial' // Fix for RTL resizing
		} );

		var newSize = this.getColumnPercentSize( ui.element, ui.size.width );

		try {
			this.resizeChild( columnView, currentSize, newSize );
		} catch ( e ) {
			return;
		}

		columnView.model.setSetting( '_inline_size', newSize );
	},

	onDestroy: function() {
		BaseElementView.prototype.onDestroy.apply( this, arguments );

		this.destroyAddSectionView();
	}
} );

module.exports = SectionView;
