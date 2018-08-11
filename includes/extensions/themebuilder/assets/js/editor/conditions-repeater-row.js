module.exports = qazana.modules.controls.RepeaterRow.extend( {

	template: '#tmpl-qazana-theme-builder-conditions-repeater-row',

	childViewContainer: '.qazana-theme-builder-conditions-repeater-row-controls',

	id: function() {
		return 'qazana-condition-id-' + this.model.get( '_id' );
	},

	onBeforeRender: function() {
		var	subNameModel = this.collection.findWhere( {
				name: 'sub_name'
			} ),
			subIdModel = this.collection.findWhere( {
				name: 'sub_id'
			} ),
			subConditionConfig = this.config.conditions[ this.model.attributes.sub_name ];

		subNameModel.attributes.groups = this.getOptions();

		if ( subConditionConfig && subConditionConfig.controls ) {
			_( subConditionConfig.controls ).each( function( control ) {
				subIdModel.set( control );
				subIdModel.set( 'name', 'sub_id' );
			} );
		}
	},

	initialize: function( options ) {
		qazana.modules.controls.RepeaterRow.prototype.initialize.apply( this, arguments );

		this.config = qazana.config.theme_builder;
	},

	updateOptions:function() {
		if ( this.model.changed.name ) {
			this.model.set({
				sub_name: '',
				sub_id: ''
			} );
		}

		if ( this.model.changed.name || this.model.changed.sub_name ) {
			this.model.set( 'sub_id', '' );

			var subIdModel = this.collection.findWhere( {
				name: 'sub_id'
			} );

			subIdModel.set( {
				type: 'select',
				options: {
					'': 'All'
				}
			} );

			this.render();
		}

		if ( this.model.changed.type ) {
			this.setTypeAttribute();
		}
	},

	getOptions:function() {
		var self = this,
			conditionConfig = self.config.conditions[ this.model.get( 'name' ) ];

		if ( ! conditionConfig ) {
			return;
		}

		var options = {
			'': conditionConfig.all_label
		};

		_( conditionConfig.sub_conditions ).each( function( conditionId, conditionIndex ) {
			var subConditionConfig = self.config.conditions[ conditionId ],
				group;

			if ( ! subConditionConfig ) {
				return;
			}

			if ( subConditionConfig.sub_conditions.length ) {
				group = {
					label: subConditionConfig.label,
					options: {}
				};
				group.options[ conditionId ]	= subConditionConfig.all_label;

				_( subConditionConfig.sub_conditions ).each( function( subConditionId ) {
					group.options[ subConditionId ] = self.config.conditions[ subConditionId ].label;
				} );

				// Use a sting key - to keep order
				options[ 'key' + conditionIndex ] = group;
			} else {
				options[ conditionId ] = subConditionConfig.label;
			}
		} );

		return options;
	},

	setTypeAttribute: function() {
		var typeView = this.children.findByModel( this.collection.findWhere( { name: 'type' } ) );

		typeView.$el.attr( 'data-qazana-condition-type', typeView.getControlValue() );
	},

	onRender: function() {
		var nameModel = this.collection.findWhere( {
				name: 'name'
			} ),
			subNameModel = this.collection.findWhere( {
				name: 'sub_name'
			} ),
			subIdModel = this.collection.findWhere( {
				name: 'sub_id'
			} ),
			nameView = this.children.findByModel( nameModel ),
			subNameView = this.children.findByModel( subNameModel ),
			subIdView = this.children.findByModel( subIdModel ),
			conditionConfig = this.config.conditions[ this.model.attributes.name ],
			subConditionConfig = this.config.conditions[ this.model.attributes.sub_name ],
			typeConfig = this.config.types[ this.config.settings.template_type ];

		if ( typeConfig.condition_type === nameView.getControlValue() && 'general' !== nameView.getControlValue() && ! _.isEmpty( conditionConfig.sub_conditions ) ) {
			nameView.$el.hide();
		}

		if ( ! conditionConfig || ( _.isEmpty( conditionConfig.sub_conditions ) && _.isEmpty( conditionConfig.controls ) ) || ! nameView.getControlValue() || 'general' === nameView.getControlValue() ) {
			subNameView.$el.hide();
		}

		if ( ! subConditionConfig || ( _.isEmpty( subConditionConfig.controls ) ) || ! subNameView.getControlValue() ) {
			subIdView.$el.hide();
		}

		this.setTypeAttribute();
	},

	onModelChange: function() {
		qazana.modules.controls.RepeaterRow.prototype.onModelChange.apply( this, arguments );

		this.updateOptions();
	}
} );