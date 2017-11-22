var Module = require( 'qazana-utils/module' );

module.exports = Module.extend( {
	modules: {
		base: require( 'qazana-editor/settings/base/manager' ),
		general: require( 'qazana-editor/settings/general/manager' ),
		page: require( 'qazana-editor/settings/page/manager' )
	},

	panelPages: {
		base: require( 'qazana-editor/settings/base/panel' )
	},

	onInit: function() {
		this.initSettings();
	},

	initSettings: function() {
		var self = this;

		_.each( qazana.config.settings, function( config, name ) {
			var Manager = self.modules[ name ] || self.modules.base;

			self[ name ] = new Manager( config );
		} );
	}
} );
