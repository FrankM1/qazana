var SectionView = require( 'qazana-views/section' ),
	BaseSectionsContainerView;

BaseSectionsContainerView = Marionette.CompositeView.extend( {
	childView: SectionView,

	behaviors: {
		Sortable: {
			behaviorClass: require( 'qazana-behaviors/sortable' ),
			elChildType: 'section'
		},
		HandleDuplicate: {
			behaviorClass: require( 'qazana-behaviors/handle-duplicate' )
		},
		HandleAdd: {
			behaviorClass: require( 'qazana-behaviors/duplicate' )
		}
	},

	getSortableOptions: function() {
		return {
			handle: '> .qazana-container > .qazana-row > .qazana-column > .qazana-element-overlay .qazana-editor-section-settings-list .qazana-editor-element-trigger',
			items: '> .qazana-section'
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
			.listenTo( qazana.channels.panelElements, 'element:drag:start', this.onPanelElementDragStart )
			.listenTo( qazana.channels.panelElements, 'element:drag:end', this.onPanelElementDragEnd );
	},

	addChildModel: function( model, options ) {
		return this.collection.add( model, options, true );
	},

	addSection: function( properties ) {
		var newSection = {
			id: qazana.helpers.getUniqueID(),
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
		qazana.setFlagEditorChange( true );
	},

	onPanelElementDragStart: function() {
		qazana.helpers.disableElementEvents( this.$el.find( 'iframe' ) );
	},

	onPanelElementDragEnd: function() {
		qazana.helpers.enableElementEvents( this.$el.find( 'iframe' ) );
	}
} );

module.exports = BaseSectionsContainerView;
