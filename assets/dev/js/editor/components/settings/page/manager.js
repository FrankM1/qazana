var BaseSettings = require( 'qazana-editor/components/settings/base/manager' );

module.exports = BaseSettings.extend( {

	save: function() {},

	changeCallbacks: {
		post_title: function( newValue ) {
			var $title = qazanaFrontend.getElements( '$document' ).find( qazana.config.page_title_selector );

			$title.text( newValue );
		},

		template: function() {
			qazana.saver.saveAutoSave( {
				onSuccess: function() {
					qazana.reloadPreview();

					qazana.once( 'preview:loaded', function() {
						qazana.getPanelView().setPage( 'page_settings' );
					} );
				}
			} );

		},

		custom_css: function( newValue ) {
			this.custom_css( newValue );
		}
    },

    custom_css: function( newValue ) {
		var controlsCSS = this.getControlsCSS();

        if ( ! newValue ) {
            newValue = this.model.get('custom_css');
        } 

        if ( newValue ) {
            newValue = newValue.replace( /selector/g, this.getSettings( 'cssWrapperSelector' ) );
            controlsCSS.stylesheet.addRawCSS('page-settings-custom-css', newValue);
        }
    },

    updateStylesheet: function( keepOldEntries ) {
        var controlsCSS = this.getControlsCSS();

		if ( ! keepOldEntries ) {
			controlsCSS.stylesheet.empty();
        }
        
		controlsCSS.addStyleRules(this.model.getStyleControls(), this.model.attributes, this.model.controls, [/{{WRAPPER}}/g], [this.getSettings('cssWrapperSelector')]);
        
        this.custom_css();
        
		controlsCSS.addStyleToDocument();
	},
    
	renderStyles: function() {
        var controlsCSS = this.getControlsCSS();
		controlsCSS.addStyleRules(this.model.getStyleControls(), this.model.attributes, this.model.controls, [/\{\{WRAPPER}}/g], ['body.qazana-page-' + qazana.config.post_id]);
		controlsCSS.stylesheet.addRawCSS('page-settings-custom-css', this.model.get('custom_css').replace(/selector/g, 'body.qazana-page-' + qazana.config.post_id));
	},

	onModelChange: function() {
		qazana.saver.setFlagEditorChange( true );
		BaseSettings.prototype.onModelChange.apply( this, arguments );
	},

	getDataToSave: function( data ) {
		data.id = qazana.config.document.id;
		return data;
	},

	reloadPreview: function() {
		qazana.reloadPreview();

		qazana.once( 'preview:loaded', function() {
			qazana.getPanelView().setPage( 'page_settings' );
		} );
	}
} );
