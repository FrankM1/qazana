var ControlChooseView = require( 'qazana-controls/choose' ),
	ControlPopoverStarterView;

ControlPopoverStarterView = ControlChooseView.extend( {
	ui: function() {
		var ui = ControlChooseView.prototype.ui.apply( this, arguments );

		ui.popoverToggle = '.qazana-control-popover-toggle-toggle';

		return ui;
	},

	events: function() {
		return _.extend( ControlChooseView.prototype.events.apply( this, arguments ), {
			'click @ui.popoverToggle': 'onPopoverToggleClick'
		} );
	},

	onPopoverToggleClick: function() {
		this.$el.next( '.qazana-controls-popover' ).toggle();
	}
}, {

	onPasteStyle: function( control, clipboardValue ) {
		return ! clipboardValue || clipboardValue === control.return_value;
	}
} );

module.exports = ControlPopoverStarterView;
