var ControlBaseView = require( 'qazana-controls/base' );

module.exports = ControlBaseView.extend( {

	ui: function() {
		var ui = ControlBaseView.prototype.ui.apply( this, arguments );

		ui.button = 'button';

		return ui;
	},

	events: {
		'click @ui.button': 'onButtonClick',
	},

	onButtonClick: function() {
		var eventName = this.model.get( 'event' );

		qazana.channels.editor.trigger( eventName, this );
	},
} );
