var ControlBaseDataView = require( 'qazana-controls/base-data' ),
	ControlIconView;

ControlIconView = ControlBaseDataView.extend( {

	initialize: function() {
		ControlBaseDataView.prototype.initialize.apply( this, arguments );

		this.filterIcons();
	},

	filterIcons: function() {
		var icons = this.model.get( 'options' ),
			include = this.model.get( 'include' ),
			exclude = this.model.get( 'exclude' );

		if ( include ) {
			var filteredIcons = {};

			_.each( include, function( iconKey ) {
				filteredIcons[ iconKey ] = icons[ iconKey ];
			} );

			this.model.set( 'options', filteredIcons );
			return;
		}

		if ( exclude ) {
			_.each( exclude, function( iconKey ) {
				delete icons[ iconKey ];
			} );
		}
	},

	iconsList: function( icon ) {
		if ( ! icon.id ) {
			return icon.text;
		}

		return jQuery(
			'<span><i class="' + icon.id + '"></i> ' + icon.text + '</span>'
		);
	},

	onReady: function() {
        this.ui.select.fontIconPicker( {
            theme: 'fip-grey',
        } ); // Load with default options
	},

	templateHelpers: function() {
		var helpers = ControlBaseDataView.prototype.templateHelpers.apply( this, arguments );

		helpers.getIconsByGroups = _.bind( function( groups ) {
			var icons = this.model.get( 'options' ),
				filterIcons = {};

			_.each( icons, function( iconType, iconName ) {
				if ( ( _.isArray( groups ) && _.contains( groups, iconType ) ) || iconType === groups ) {
					filterIcons[ iconName ] = iconType;
				}
			} );

			return filterIcons;
		}, this );

		return helpers;
	},

} );

module.exports = ControlIconView;
