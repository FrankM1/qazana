var BaseElementView = require( 'qazana-views/base-element' ),
	SectionView;

SectionView = BaseElementView.extend( {
	template: Marionette.TemplateCache.get( '#tmpl-qazana-element-section-content' ),

	className: function() {
		var classes = BaseElementView.prototype.className.apply( this, arguments ),
			type = this.isInner() ? 'inner' : 'top';

		return classes + ' qazana-section qazana-' + type + '-section';
	},

	tagName: 'section',

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

	ui: function() {
		var ui = BaseElementView.prototype.ui.apply( this, arguments );

		ui.duplicateButton = '.qazana-editor-section-settings-list .qazana-editor-element-duplicate';
		ui.removeButton = '.qazana-editor-section-settings-list .qazana-editor-element-remove';
		ui.saveButton = '.qazana-editor-section-settings-list .qazana-editor-element-save';
		ui.triggerButton = '.qazana-editor-section-settings-list .qazana-editor-element-trigger';

		return ui;
	},

	events: function() {
		var events = BaseElementView.prototype.events.apply( this, arguments );

		events[ 'click @ui.triggerButton' ] = 'onClickEdit';

		return events;
	},

	initialize: function() {
		BaseElementView.prototype.initialize.apply( this, arguments );

		this.listenTo( this.collection, 'add remove reset', this._checkIsFull )
			.listenTo( this.collection, 'remove', this.onCollectionRemove )
			.listenTo( this.model, 'change:settings:structure', this.onStructureChanged );
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
			handle: '> .qazana-element-overlay .qazana-editor-column-settings-list .qazana-editor-element-trigger',
			items: '> .qazana-column'
		};
	},

	getColumnPercentSize: function( element, size ) {
		return size / element.parent().width() * 100;
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

		this.model.setSetting( 'structure', structure, true );
	},

	redefineLayout: function() {
		var preset = qazana.presetsFactory.getPresetByStructure( this.getStructure() );

		this.collection.each( function( model, index ) {
			model.setSetting( '_column_size', preset.preset[ index ] );
			model.setSetting( '_inline_size', null );
		} );

		this.children.invoke( 'changeSizeUI' );
	},

	resetLayout: function() {
		this.setStructure( this.getDefaultStructure() );
	},

	resetColumnsCustomSize: function() {
		this.collection.each( function( model ) {
			model.setSetting( '_inline_size', null );
		} );

		this.children.invoke( 'changeSizeUI' );
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

	getNextColumn: function( columnView ) {
		var modelIndex = this.collection.indexOf( columnView.model ),
			nextModel = this.collection.at( modelIndex + 1 );

		return this.children.findByModelCid( nextModel.cid );
	},

	onBeforeRender: function() {
		this._checkIsEmpty();
	},

	onRender: function() {
		this._checkIsFull();
	},

	onAddChild: function() {
		if ( ! this.isBuffering ) {
			// Reset the layout just when we have really add/remove element.
			this.resetLayout();
		}
	},

	onCollectionRemove: function() {
		// If it's the last column, please create new one.
		this._checkIsEmpty();

		this.resetLayout();
	},

	onChildviewRequestResizeStart: function( childView ) {
		var nextChildView = this.getNextColumn( childView );

		if ( ! nextChildView ) {
			return;
		}

		var $iframes = childView.$el.find( 'iframe' ).add( nextChildView.$el.find( 'iframe' ) );

		qazana.helpers.disableElementEvents( $iframes );
	},

	onChildviewRequestResizeStop: function( childView ) {
		var nextChildView = this.getNextColumn( childView );

		if ( ! nextChildView ) {
			return;
		}

		var $iframes = childView.$el.find( 'iframe' ).add( nextChildView.$el.find( 'iframe' ) );

		qazana.helpers.enableElementEvents( $iframes );
	},

	onChildviewRequestResize: function( childView, ui ) {
		// Get current column details
		var currentSize = childView.model.getSetting( '_inline_size' );

		if ( ! currentSize ) {
			currentSize = this.getColumnPercentSize( ui.element, ui.originalSize.width );
		}

		var newSize = this.getColumnPercentSize( ui.element, ui.size.width ),
			difference = newSize - currentSize;

		ui.element.css( {
			//width: currentSize + '%',
			width: '',
			left: 'initial' // Fix for RTL resizing
		} );

		// Get next column details
		var nextChildView = this.getNextColumn( childView );

		if ( ! nextChildView ) {
			return;
		}

		var MINIMUM_COLUMN_SIZE = 10,

			$nextElement = nextChildView.$el,
			nextElementCurrentSize = this.getColumnPercentSize( $nextElement, $nextElement.width() ),
			nextElementNewSize = nextElementCurrentSize - difference;

		if ( newSize < MINIMUM_COLUMN_SIZE || newSize > 100 || ! difference || nextElementNewSize < MINIMUM_COLUMN_SIZE || nextElementNewSize > 100 ) {
			return;
		}

		// Set the current column size
		childView.model.setSetting( '_inline_size', newSize.toFixed( 3 ) );
		childView.changeSizeUI();

		// Set the next column size
		nextChildView.model.setSetting( '_inline_size', nextElementNewSize.toFixed( 3 ) );
		nextChildView.changeSizeUI();
	},

	onStructureChanged: function() {
		this.redefineLayout();
	}
} );

module.exports = SectionView;
