module.exports = qazana.modules.views.ControlsStack.extend( {
	activeTab: 'content',

	activeSection: 'settings',

	initialize: function() {
		this.collection = new Backbone.Collection( _.values( this.options.controls ) );
	},

	filter: function( model ) {
		if ( 'section' === model.get( 'type' ) ) {
			return true;
		}

		var section = model.get( 'section' );

		return ! section || section === this.activeSection;
	},

	childViewOptions: function() {
		return {
			elementSettingsModel: this.model,
		};
	},
} );
