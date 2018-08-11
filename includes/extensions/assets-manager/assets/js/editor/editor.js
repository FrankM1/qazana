var EditorModule = require( 'elementor-pro/editor/editor-module' );

module.exports = EditorModule.extend( {
	onElementorInit: function() {
		var FontsManager = require( './font-manager' );

		this.assets = {
			font: new FontsManager()
		};
	}
} );