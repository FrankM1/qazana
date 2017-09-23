var SectionView = require( 'qazana-views/section' ),
	BaseContainer = require( 'qazana-views/base-container' ),
	BaseSectionsContainerView;

BaseSectionsContainerView = BaseContainer.extend( {
	childView: SectionView,

	behaviors: function() {
		var behaviors = {
			Sortable: {
				behaviorClass: require( 'qazana-behaviors/sortable' ),
				elChildType: 'section'
			},
			HandleDuplicate: {
				behaviorClass: require( 'qazana-behaviors/handle-duplicate' )
			},
			HandleAddMode: {
				behaviorClass: require( 'qazana-behaviors/duplicate' )
			}
		};

		return qazana.hooks.applyFilters( 'elements/base-section-container/behaviors', behaviors, this );
	},

	getSortableOptions: function() {
		return {
			handle: '> .qazana-element-overlay .qazana-editor-section-settings .qazana-editor-element-trigger',
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

	addSection: function( properties, options ) {
		var newSection = {
			id: qazana.helpers.getUniqueID(),
			elType: 'section',
			settings: {},
			elements: []
		};

		if ( properties ) {
			_.extend( newSection, properties );
		}

		var newModel = this.addChildModel( newSection, options );

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
