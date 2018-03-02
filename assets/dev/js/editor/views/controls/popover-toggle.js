var ControlChooseView = require( 'qazana-views/controls/choose' ),
	ControlPopoverStarterView;

ControlPopoverStarterView = ControlChooseView.extend( {
	ui: function() {
		var ui = ControlChooseView.prototype.ui.apply( this, arguments );

		ui.popoverToggle = 'label.qazana-control-popover-toggle-toggle-label';

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
} );

module.exports = ControlPopoverStarterView;
