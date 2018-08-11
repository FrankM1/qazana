var RepeaterRowView = require( './conditions-repeater-row' );

module.exports = qazana.modules.controls.Repeater.extend( {

	childView: RepeaterRowView,

	updateActiveRow: function() {},

	initialize: function( options ) {
		qazana.modules.controls.Repeater.prototype.initialize.apply( this, arguments );

		this.config = qazana.config.theme_builder;

		this.updateConditionsOptions( this.config.settings.template_type );
	},

	checkConflicts:function( model ) {
		var modelId = model.get( '_id' ),
			rowId = 'qazana-condition-id-' + modelId,
			errorMessageId = 'qazana-conditions-conflict-message-' + modelId,
			$error = jQuery( '#' + errorMessageId );

		// On render - the row isn't exist, so don't cache it.
		jQuery( '#' + rowId ).removeClass( 'qazana-error' );

		$error.remove();

		qazana.ajax.addRequest( 'theme_builder_conditions_check_conflicts', {
			unique_id: rowId,
			data: {
				condition: model.toJSON( { removeDefaults: true } )
			},
			success: function( data ) {
				if ( ! _.isEmpty( data ) ) {
					jQuery( '#' + rowId )
						.addClass( 'qazana-error' )
						.after( '<div id="' + errorMessageId + '" class="qazana-conditions-conflict-message">' + data + '</div>' );

				}
			}
		} );
	},

	updateConditionsOptions: function( templateType ) {
		var self = this,
			conditionType = self.config.types[ templateType ].condition_type,
			options = {};

		_( [ conditionType ] ).each( function( conditionId, conditionIndex ) {
			var conditionConfig = self.config.conditions[ conditionId ],
				group = {
					label: conditionConfig.label,
					options: {}
				};

			group.options[ conditionId ] = conditionConfig.all_label;

			_( conditionConfig.sub_conditions ).each( function( subConditionId ) {
				group.options[ subConditionId ] = self.config.conditions[ subConditionId ].label;
			} );

			options[ conditionIndex ] = group;
		} );

		var fields = this.model.get( 'fields' );

		fields[1]['default'] = conditionType;

		if ( 'general' === conditionType ) {
			fields[1].groups = options;
		} else {
			fields[2].groups = options;
		}
	},

	togglePublishButtonState: function() {
		var conditionsModalUI = qazana.modules.themeBuilder.conditionsLayout.modalContent.currentView.ui,
			$publishButton = conditionsModalUI.publishButton,
			$publishButtonTitle = conditionsModalUI.publishButtonTitle;

		if ( this.collection.length ) {
			$publishButton.addClass( 'qazana-button-success' );

			$publishButtonTitle.text( qazana.translate( 'publish' ) );
		} else {
			$publishButton.removeClass( 'qazana-button-success' );

			$publishButtonTitle.text( qazana.translate( 'save_without_conditions' ) );
		}
	},

	onRender: function() {
		this.ui.btnAddRow.text( qazana.translate( 'add_condition' ) );

		var self = this;

		this.collection.each( function( model ) {
			self.checkConflicts( model );
		});

		_.defer( this.togglePublishButtonState.bind( this ) );
	},

	// Overwrite thr original + checkConflicts.
	onRowControlChange: function( model ) {
		this.checkConflicts( model );
	},

	onRowUpdate: function() {
		qazana.modules.controls.Repeater.prototype.onRowUpdate.apply( this, arguments );

		this.togglePublishButtonState();
	}
} );