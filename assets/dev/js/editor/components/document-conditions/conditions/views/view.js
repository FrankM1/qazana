var inlineControlsStack = require( '../../inline-controls-stack.js' );

module.exports = inlineControlsStack.extend( {
	id: 'qazana-document-conditions-view',

	template: '#tmpl-qazana-document-conditions-view',

	childViewContainer: '#qazana-document-conditions-controls',

	ui: function() {
		var ui = inlineControlsStack.prototype.ui.apply( this, arguments );

		ui.publishButton = '#qazana-document-conditions__publish';

		ui.publishButtonTitle = '#qazana-document-conditions__publish__title';

		return ui;
	},

	events: {
		'click @ui.publishButton': 'onClickPublish',
	},

	templateHelpers: function() {
		return {
			title: qazana.translate( 'conditions_title' ),
			description: qazana.translate( 'conditions_description' ),
		};
	},

	childViewOptions: function() {
		return {
			elementSettingsModel: this.model,
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
		qazana.ajax.addRequest( 'site_archive_save_conditions', {
			data: data,
			success: function() {
				qazana.config.documentConditions.settings.conditions = self.model.get( 'conditions' );
				qazana.saver.publish();
			},
			complete: function() {
				self.afterAjax( $button );
			},
		} );
	},

	afterAjax: function( $button ) {
		$button
			.attr( 'disabled', false )
			.removeClass( 'qazana-button-state' );

		qazana.documentConditions.conditionsLayout.modal.hide();
	},
} );
