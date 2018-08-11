var SectionView = require( 'qazana-elements/views/section' ),
	BaseContainer = require( 'qazana-views/base-container' ),
	BaseSectionsContainerView;

BaseSectionsContainerView = BaseContainer.extend( {
	childView: SectionView,

	behaviors: function() {
		var behaviors = {
			Sortable: {
				behaviorClass: require( 'qazana-behaviors/sortable' ),
				elChildType: 'section'
			}
		};

		return qazana.hooks.applyFilters( 'elements/base-section-container/behaviors', behaviors, this );
	},

	getSortableOptions: function() {
		return {
			handle: '> .qazana-element-overlay .qazana-editor-element-edit',
			items: '> .qazana-section'
		};
	},

	getChildType: function() {
		return [ 'section' ];
	},

	initialize: function() {
		BaseContainer.prototype.initialize.apply( this, arguments );

		this
			.listenTo( this.collection, 'add remove reset', this.onCollectionChanged )
			.listenTo( qazana.channels.panelElements, 'element:drag:start', this.onPanelElementDragStart )
			.listenTo( qazana.channels.panelElements, 'element:drag:end', this.onPanelElementDragEnd );
	},

	onCollectionChanged: function() {
		qazana.saver.setFlagEditorChange( true );
	},

	onPanelElementDragStart: function() {
		qazana.helpers.disableElementEvents( this.$el.find( 'iframe' ) );
	},

	onPanelElementDragEnd: function() {
		qazana.helpers.enableElementEvents( this.$el.find( 'iframe' ) );
	}
} );

module.exports = BaseSectionsContainerView;
