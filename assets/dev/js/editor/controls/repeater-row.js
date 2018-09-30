var ControlBaseDataView = require( 'qazana-controls/base-data' ),
	RepeaterRowView;

RepeaterRowView = Marionette.CompositeView.extend( {
	template: Marionette.TemplateCache.get( '#tmpl-qazana-repeater-row' ),

	className: 'qazana-repeater-fields',

	ui: {
		duplicateButton: '.qazana-repeater-tool-duplicate',
		editButton: '.qazana-repeater-tool-edit',
		removeButton: '.qazana-repeater-tool-remove',
		itemTitle: '.qazana-repeater-row-item-title',
	},

	behaviors: {
		HandleInnerTabs: {
			behaviorClass: require( 'qazana-behaviors/inner-tabs' ),
		},
	},

	triggers: {
		'click @ui.removeButton': 'click:remove',
		'click @ui.duplicateButton': 'click:duplicate',
		'click @ui.itemTitle': 'click:edit',
	},

	modelEvents: {
		change: 'onModelChange',
	},

	templateHelpers: function() {
		return {
			itemIndex: this.getOption( 'itemIndex' ),
		};
	},

	childViewContainer: '.qazana-repeater-row-controls',

	getChildView: function( item ) {
		var controlType = item.get( 'type' );

		return qazana.getControlView( controlType );
	},

	childViewOptions: function() {
		return {
			elementSettingsModel: this.model,
		};
	},

	updateIndex: function( newIndex ) {
		this.itemIndex = newIndex;
	},

	setTitle: function() {
		var titleField = this.getOption( 'titleField' ),
			title = '';

		if ( titleField ) {
			var values = {};

			this.children.each( function( child ) {
				if ( ! ( child instanceof ControlBaseDataView ) ) {
					return;
				}

				values[ child.model.get( 'name' ) ] = child.getControlValue();
			} );

			title = Marionette.TemplateCache.prototype.compileTemplate( titleField )( this.model.parseDynamicSettings() );
		}

		if ( ! title ) {
			title = qazana.translate( 'Item #{0}', [ this.getOption( 'itemIndex' ) ] );
		}

		this.ui.itemTitle.html( title );
	},

	initialize: function( options ) {
		this.itemIndex = 0;

		// Collection for Controls list
		this.collection = new Backbone.Collection( _.values( qazana.mergeControlsSettings( options.controlFields ) ) );
	},

	onRender: function() {
		this.setTitle();
	},

	onModelChange: function() {
		if ( this.getOption( 'titleField' ) ) {
			this.setTitle();
		}
	},

	onChildviewResponsiveSwitcherClick: function( childView, device ) {
		if ( 'desktop' === device ) {
			qazana.getPanelView().getCurrentPageView().$el.toggleClass( 'qazana-responsive-switchers-open' );
		}
	},
} );

module.exports = RepeaterRowView;
