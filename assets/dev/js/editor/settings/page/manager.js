var BaseSettings = require( 'qazana-editor/settings/base/manager' );

module.exports = BaseSettings.extend( {
	changeCallbacks: {
		post_title: function( newValue ) {
			var $title = qazanaFrontend.getElements( '$document' ).find( qazana.config.page_title_selector );

			$title.text( newValue );
		},

		template: function() {
			this.save( function() {
				qazana.reloadPreview();

				qazana.once( 'preview:loaded', function() {
					qazana.getPanelView().setPage( 'page_settings' );
				} );
			} );
		}
	},

	getDataToSave: function( data ) {
		data.id = qazana.config.post_id;

		return data;
	}
} );
