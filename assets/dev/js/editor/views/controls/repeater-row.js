var RepeaterRowView;

RepeaterRowView = Marionette.CompositeView.extend( {
	template: Marionette.TemplateCache.get( '#tmpl-qazana-repeater-row' ),

	className: 'repeater-fields',

	ui: {
		duplicateButton: '.qazana-repeater-tool-duplicate',
		editButton: '.qazana-repeater-tool-edit',
		removeButton: '.qazana-repeater-tool-remove',
		itemTitle: '.qazana-repeater-row-item-title'
	},

	behaviors: {
		HandleInnerTabs: {
			behaviorClass: require( 'qazana-behaviors/inner-tabs' )
		}
	},

	triggers: {
		'click @ui.removeButton': 'click:remove',
		'click @ui.duplicateButton': 'click:duplicate',
		'click @ui.itemTitle': 'click:edit'
	},

	templateHelpers: function() {
		return {
			itemIndex: this.getOption( 'itemIndex' )
		};
	},

	childViewContainer: '.qazana-repeater-row-controls',

	getChildView: function( item ) {
		var controlType = item.get( 'type' );

		return qazana.getControlView( controlType );
	},

	childViewOptions: function() {
		return {
			elementSettingsModel: this.model
		};
	},

	checkConditions: function() {
		var self = this;

		self.collection.each( function( model ) {
			var conditions = model.get( 'conditions' ),
				parentConditions = model.get( 'parent_conditions' ),
				isVisible = true;

			if ( conditions ) {
				isVisible = qazana.conditions.check( conditions, self.model.attributes );
			}

			if ( parentConditions ) {
				isVisible = qazana.conditions.check( parentConditions, self.getOption( 'parentModel' ).attributes );
			}

			var child = self.children.findByModelCid( model.cid );

			child.$el.toggleClass( 'qazana-panel-hide', ! isVisible );
		} );
	},

	updateIndex: function( newIndex ) {
		this.itemIndex = newIndex;
		this.setTitle();
	},

	setTitle: function() {
		var self = this,
			titleField = self.getOption( 'titleField' ),
			title = '';

		if ( titleField ) {
			var values = {};

			self.children.each( function( child ) {
				values[ child.model.get( 'name' ) ] = child.getControlValue();
			} );

			title = Marionette.TemplateCache.prototype.compileTemplate( titleField )( values );
		}

		if ( ! title ) {
			title = qazana.translate( 'Item #{0}', [ self.getOption( 'itemIndex' ) ] );
		}

		self.ui.itemTitle.html( title );
	},

	initialize: function( options ) {
		var self = this;

		self.elementSettingsModel = options.elementSettingsModel;

		self.itemIndex = 0;

		// Collection for Controls list
		self.collection = new Backbone.Collection( options.controlFields );

		self.listenTo( self.model, 'change', self.checkConditions );
		self.listenTo( self.getOption( 'parentModel' ), 'change', self.checkConditions );

		if ( options.titleField ) {
			self.listenTo( self.model, 'change', self.setTitle );
		}
	},

	onRender: function() {
		this.setTitle();
		this.checkConditions();
	},

	onChildviewResponsiveSwitcherClick: function( childView, device ) {
		if ( 'desktop' === device ) {
			qazana.getPanelView().getCurrentPageView().$el.toggleClass( 'qazana-responsive-switchers-open' );
		}
	}
} );

module.exports = RepeaterRowView;
