var BaseAddSectionView = require( 'qazana-views/add-section/base' );

module.exports = BaseAddSectionView.extend( {
	id: 'qazana-add-new-section',

	onCloseButtonClick: function() {
		this.closeSelectPresets();
	}
} );
