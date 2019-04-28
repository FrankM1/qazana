var ControlsStack = require( 'qazana-views/controls-stack' );

module.exports = ControlsStack.extend( {
	id: 'qazana-panel-page-settings',

	template: '#tmpl-qazana-panel-page-settings',

	childViewContainer: '#qazana-panel-page-settings-controls',

	childViewOptions: function() {
		return {
			elementSettingsModel: this.model,
		};
	},

	initialize: function() {
		this.model = qazana.settings.page.model;

		this.collection = new Backbone.Collection( _.values( this.model.controls ) );
	},
} );
