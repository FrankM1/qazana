var FooterSaver = require( './footer-saver' );

module.exports = FooterSaver.extend( {

	ui: function() {
		return {
			buttonPreview: '#qazana-panel-header-saver-button-preview',
			buttonPublish: '#qazana-panel-header-saver-button-publish',
			buttonSaveOptions: '#qazana-panel-header-saver-button-save-options',
			buttonPublishLabel: '#qazana-panel-header-saver-button-publish-label',
			menuSaveDraft: '#qazana-panel-header-saver-button-save-draft',
			lastEditedWrapper: '.qazana-last-edited-wrapper',
		};
    },

    events: function() {
        return {
            'click @ui.buttonPreview': 'onClickButtonPreview',
            'click @ui.buttonPublish': 'onClickButtonPublish',
            'click @ui.menuSaveDraft': 'onClickMenuSaveDraft',
        };
    },

    activateSaveButtons: function( hasChanges ) {
        hasChanges = hasChanges || 'draft' === qazana.settings.page.model.get( 'post_status' );

        this.ui.buttonPublish.add( this.ui.menuSaveDraft ).toggleClass( 'qazana-saver-disabled', ! hasChanges );
        this.ui.buttonSaveOptions.toggleClass( 'qazana-saver-disabled', ! hasChanges );
    },

    addTooltip: function() {
        // Create tooltip on controls
        this.$el.find( '.tooltip-target' ).tipsy( {
            gravity: function() {
                // `n` for down, `s` for up
                var gravity = jQuery( this ).data( 'tooltip-pos' );

                if ( undefined !== gravity ) {
                    return gravity;
                }
                return 'n';
            },
            title: function() {
                return this.getAttribute( 'data-tooltip' );
            },
        } );
    },

} );
