var inlineControlsStack = require( 'qazana-editor/inline-controls-stack.js' );

module.exports = inlineControlsStack.extend( {
	id: 'qazana-theme-builder-conditions-view',

	template: '#tmpl-qazana-theme-builder-conditions-view',

	childViewContainer: '#qazana-theme-builder-conditions-controls',

	ui: function() {
		var ui = inlineControlsStack.prototype.ui.apply( this, arguments );

		ui.publishButton = '#qazana-theme-builder-conditions__publish';

		ui.publishButtonTitle = '#qazana-theme-builder-conditions__publish__title';

		return ui;
	},

	events: {
		'click @ui.publishButton': 'onClickPublish'
	},

	templateHelpers: function() {
		return {
			title: qazana.translate( 'conditions_title' ),
			description: qazana.translate( 'conditions_description' )
		};
	},

	childViewOptions: function() {
		return {
			elementSettingsModel: this.model
		};
	},

	onClickPublish: function( event ) {
		var self = this,
			$button = jQuery( event.currentTarget ),
			data = this.model.toJSON( { removeDefault: true } );

		event.stopPropagation();

		$button
			.attr( 'disabled', true )
			.addClass( 'qazana-button-state' );

		// Publish.
		qazana.ajax.addRequest( 'theme_builder_save_conditions', {
			data: data,
			success: function() {
				qazana.config.theme_builder.settings.conditions = self.model.get( 'conditions' );
				qazana.saver.publish();
			},
			complete: function() {
				self.afterAjax( $button );
			}
		} );
	},

	afterAjax: function( $button ) {
		$button
			.attr( 'disabled', false )
			.removeClass( 'qazana-button-state' );

		qazana.modules.themeBuilder.conditionsLayout.modal.hide();
	}
} );