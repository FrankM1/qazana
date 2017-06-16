var SectionView = require( 'builder-views/section' ),
	BaseSectionsContainerView;

BaseSectionsContainerView = Marionette.CompositeView.extend( {
	childView: SectionView,

	behaviors: {
		Sortable: {
			behaviorClass: require( 'builder-behaviors/sortable' ),
			elChildType: 'section'
		},
		HandleDuplicate: {
			behaviorClass: require( 'builder-behaviors/handle-duplicate' )
		},
		HandleAdd: {
			behaviorClass: require( 'builder-behaviors/duplicate' )
		}
	},

	getSortableOptions: function() {
		return {
			handle: '> .builder-container > .builder-row > .builder-column > .builder-element-overlay .builder-editor-section-settings-list .builder-editor-element-trigger',
			items: '> .builder-section'
		};
	},

	getChildType: function() {
		return [ 'section' ];
	},

	isCollectionFilled: function() {
		return false;
	},

	initialize: function() {
		this
			.listenTo( this.collection, 'add remove reset', this.onCollectionChanged )
			.listenTo( builder.channels.panelElements, 'element:drag:start', this.onPanelElementDragStart )
			.listenTo( builder.channels.panelElements, 'element:drag:end', this.onPanelElementDragEnd );
	},

	addChildModel: function( model, options ) {
		return this.collection.add( model, options, true );
	},

	addSection: function( properties ) {
		var newSection = {
			id: builder.helpers.getUniqueID(),
			elType: 'section',
			settings: {},
			elements: []
		};

		if ( properties ) {
			_.extend( newSection, properties );
		}

		var newModel = this.addChildModel( newSection );

		return this.children.findByModelCid( newModel.cid );
	},

	onCollectionChanged: function() {
		builder.setFlagEditorChange( true );
	},

	onPanelElementDragStart: function() {
		builder.helpers.disableElementEvents( this.$el.find( 'iframe' ) );
	},

	onPanelElementDragEnd: function() {
		builder.helpers.enableElementEvents( this.$el.find( 'iframe' ) );
	}
} );

module.exports = BaseSectionsContainerView;
