module.exports = Marionette.Region.extend( {
	el: '#qazana-panel',

	constructor: function() {
		Marionette.Region.prototype.constructor.apply( this, arguments );

		var PanelLayoutView = require( 'qazana-layouts/panel/layout' );

		this.show( new PanelLayoutView() );

		this.resizable();
	},

	resizable: function() {
		var side = qazana.config.is_rtl ? 'right' : 'left';

		this.$el.resizable( {
			handles: qazana.config.is_rtl ? 'w' : 'e',
			minWidth: 200,
			maxWidth: 680,
			start: function() {
				qazana.$previewWrapper.addClass( 'ui-resizable-resizing' );
			},
			stop: function() {
				qazana.$previewWrapper.removeClass( 'ui-resizable-resizing' );

				qazana.getPanelView().updateScrollbar();
			},
			resize: function( event, ui ) {
				qazana.$previewWrapper.css( side, ui.size.width );
			}
		} );
	}
} );
