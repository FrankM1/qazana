var ControlBaseView;

ControlBaseView = Marionette.CompositeView.extend( {
	ui: function() {
		return {
			controlTitle: '.qazana-control-title'
		};
	},

	behaviors: function() {
		var behaviors = {};

		return qazana.hooks.applyFilters( 'controls/base/behaviors', behaviors, this );
	},

	getBehavior: function( name ) {
		return this._behaviors[ Object.keys( this.behaviors() ).indexOf( name ) ];
	},

	className: function() {
		// TODO: Any better classes for that?
		var classes = 'qazana-control qazana-control-' + this.model.get( 'name' ) + ' qazana-control-type-' + this.model.get( 'type' ),
			modelClasses = this.model.get( 'classes' ),
			responsive = this.model.get( 'responsive' );

		if ( ! _.isEmpty( modelClasses ) ) {
			classes += ' ' + modelClasses;
		}

		if ( ! _.isEmpty( responsive ) ) {
			classes += ' qazana-control-responsive-' + responsive.max;
		}

		return classes;
	},

	templateHelpers: function() {
		var controlData = {
			_cid: this.model.cid
		};

		return {
			data: _.extend( {}, this.model.toJSON(), controlData )
		};
	},

	getTemplate: function() {
		return Marionette.TemplateCache.get( '#tmpl-qazana-control-' + this.model.get( 'type' ) + '-content' );
	},

	initialize: function( options ) {
		this.elementSettingsModel = options.elementSettingsModel;

		var controlType = this.model.get( 'type' ),
			controlSettings = Backbone.$.extend( true, {}, qazana.config.controls[ controlType ], this.model.attributes );

		this.model.set( controlSettings );

		this.listenTo( this.elementSettingsModel, 'change', this.toggleControlVisibility );
	},

	toggleControlVisibility: function() {
		var isVisible = qazana.helpers.isActiveControl( this.model, this.elementSettingsModel.attributes );

		this.$el.toggleClass( 'qazana-hidden-control', ! isVisible );

		qazana.channels.data.trigger( 'scrollbar:update' );
	},

	onRender: function() {
		var layoutType = this.model.get( 'label_block' ) ? 'block' : 'inline',
			showLabel = this.model.get( 'show_label' ),
			elClasses = 'qazana-label-' + layoutType;

		elClasses += ' qazana-control-separator-' + this.model.get( 'separator' );

		if ( ! showLabel ) {
			elClasses += ' qazana-control-hidden-label';
		}

		this.$el.addClass( elClasses );

		this.toggleControlVisibility();
	}
} );

module.exports = ControlBaseView;
