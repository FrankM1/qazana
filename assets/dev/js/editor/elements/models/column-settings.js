var BaseSettingsModel = require( 'qazana-elements/models/base-settings' ),
	ColumnSettingsModel;

ColumnSettingsModel = BaseSettingsModel.extend( {
	defaults: {
		_column_size: 100,
	},
} );

module.exports = ColumnSettingsModel;
