var BaseRegion = require( 'qazana-regions/base' );

module.exports = BaseRegion.extend( {
	el: '#qazana-panel',

	getStorageKey: function() {
		return 'panel';
	},

	getDefaultStorage: function() {
		return {
			size: {
				width: '',
			},
		};
	},

	constructor: function() {
		BaseRegion.prototype.constructor.apply( this, arguments );

		var PanelLayoutView = require( 'qazana-regions/panel/layout' );

		this.show( new PanelLayoutView() );

		this.resizable();

		this.setSize();

		this.listenTo( qazana.channels.dataEditMode, 'switch', this.onEditModeSwitched );
	},

	setSize: function() {
		var width = this.storage.size.width,
			side = qazana.config.is_rtl ? 'right' : 'left';

		this.$el.css( 'width', width );

		qazana.$previewWrapper.css( side, width );
	},

	resizable: function() {
		var self = this,
			side = qazana.config.is_rtl ? 'right' : 'left';

		self.$el.resizable( {
			handles: qazana.config.is_rtl ? 'w' : 'e',
			minWidth: 200,
			maxWidth: 680,
			start: function() {
				qazana.$previewWrapper.addClass( 'ui-resizable-resizing' );
			},
			stop: function() {
				qazana.$previewWrapper.removeClass( 'ui-resizable-resizing' );

				qazana.getPanelView().updateScrollbar();

				self.saveSize();
			},
			resize: function( event, ui ) {
				qazana.$previewWrapper.css( side, ui.size.width );
			},
		} );
	},

	onEditModeSwitched: function( activeMode ) {
		if ( 'edit' !== activeMode ) {
			return;
		}

		this.setSize();
	},
} );
