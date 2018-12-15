var BaseRegion = require( 'qazana-regions/base' );
var PanelLayoutView = require( 'qazana-regions/panel/layout' );

module.exports = BaseRegion.extend( {
	el: '#qazana-panel',

	getStorageKey: function() {
		return 'panel';
	},

	getDefaultStorage: function() {
		return {
			docked: false,
			visible: true,
			size: {
				width: '',
				height: '',
				top: '',
				bottom: '',
				right: '',
				left: '',
			},
		};
	},

	constructor: function() {
		BaseRegion.prototype.constructor.apply( this, arguments );

		var savedStorage = qazana.getStorage( this.getStorageKey() );

		this.storage = savedStorage ? savedStorage : this.getDefaultStorage();

		this.storageSizeKeys = Object.keys( this.storage.size );

		this.listenTo( qazana.channels.dataEditMode, 'switch', this.onEditModeSwitched );

		this.isDocked = true;

		this.opened = false;

		this.ensurePosition = this.ensurePosition.bind( this );

		if ( this.storage.visible ) {
			this.open();
		}
	},

	beforeFirstOpen: function() {
		this.show( new PanelLayoutView() );
		this.$el.draggable( this.getDraggableOptions() );
		this.$el.resizable( this.getResizableOptions() );
	},

	getLayout: function() {
		return this.currentView;
	},

	getDraggableOptions: function() {
		return {
			iframeFix: true,
			handle: '#qazana-panel-header',
			drag: this.onDrag.bind( this ),
			stop: this.onDragStop.bind( this ),
		};
	},

	getResizableOptions: function() {
		var side = qazana.config.is_rtl ? 'right' : 'left';

		return {
			handles: qazana.config.is_rtl ? 'w' : 'e',
			containment: 'document',
			minWidth: 200,
			maxWidth: 680,
			minHeight: 240,
			start: () => {
				qazana.$previewWrapper.addClass( 'ui-resizable-resizing' );
			},
			stop: () => {
				qazana.$previewWrapper.removeClass( 'ui-resizable-resizing' );
				qazana.getPanelView().updateScrollbar();

				if ( this.isDocked ) {
					this.storage.size.width = qazana.helpers.getElementInlineStyle( this.$el, [ 'width' ] ).width;

					qazana.setStorage( 'panel', this.storage );
				} else {
					this.saveSize();
				}
			},
			resize: function( event, ui ) {
				qazana.$previewWrapper.css( side, ui.size.width );
			},
		};
	},

	setSize: function() {
		var width = this.storage.size.width,
			side = qazana.config.is_rtl ? 'right' : 'left';

		this.$el.css( 'width', width );

		qazana.$previewWrapper.css( side, width );
	},

	setDockedSize: function() {
		this.$el.css( 'width', this.storage.size.width );
	},

	open: function( model ) {
		if ( ! this.opened ) {
			this.beforeFirstOpen();

			this.opened = true;
		}

		this.$el.show();

		if ( this.storage.docked ) {
			this.dock();

			this.setDockedSize();
		} else {
			this.setSize();
		}

		if ( model ) {
			model.trigger( 'request:edit' );
		}

		this.saveStorage( 'visible', true );

		this.ensurePosition();

		qazana.$window.on( 'resize', this.ensurePosition );
	},

	close: function( silent ) {
		this.$el.hide();

		if ( this.isDocked ) {
			this.undock( true );
		}

		if ( ! silent ) {
			this.saveStorage( 'visible', false );
		}

		qazana.$window.off( 'resize', this.ensurePosition );
	},

	isOpen: function() {
		return this.$el.is( ':visible' );
	},

	dock: function() {
		qazana.$body.addClass( 'qazana-panel-docked' ).removeClass( 'qazana-panel-undocked' );

		const side = qazana.config.is_rtl ? 'left' : 'right',
			resizableOptions = this.getResizableOptions();

		this.$el.css( {
			height: '',
			top: '',
			bottom: '',
			left: '',
			right: '',
		} );

		qazana.$previewWrapper.css( side, this.storage.size.width );

		this.$el.resizable( 'destroy' );

		resizableOptions.handles = qazana.config.is_rtl ? 'e' : 'w';

		resizableOptions.resize = ( event, ui ) => {
			qazana.$previewWrapper.css( side, ui.size.width );
		};

		this.$el.resizable( resizableOptions );

		this.isDocked = true;

		this.saveStorage( 'docked', true );
	},

	undock: function( silent ) {
		qazana.$body.removeClass( 'qazana-panel-docked' ).addClass( 'qazana-panel-undocked' );

		qazana.$body.find( '#qazana-preview' ).css( qazana.config.is_rtl ? 'left' : 'right', '' );

		this.setSize();

		this.$el.resizable( 'destroy' );

		this.$el.resizable( this.getResizableOptions() );

		this.isDocked = false;

		if ( ! silent ) {
			this.saveStorage( 'docked', false );
		}
	},

	ensurePosition: function() {
		if ( this.isDocked ) {
			return;
		}

		const offset = this.$el.offset();

		if ( offset.left > innerWidth ) {
			this.$el.css( {
				left: '',
				right: '',
			} );
		}

		if ( offset.top > innerHeight ) {
			this.$el.css( {
				top: '',
				bottom: '',
			} );
		}
	},

	onDrag: function( _event, ui ) {
		if ( this.isDocked ) {
			if ( ui.position.left === ui.originalPosition.left ) {
				if ( ui.position.top !== ui.originalPosition.top ) {
					return false;
				}
			} else {
				this.undock();
			}

			return;
		}

		if ( 0 > ui.position.top ) {
			ui.position.top = 0;
		}

		const isOutOfLeft = 0 > ui.position.left,
			isOutOfRight = ui.position.left + this.el.offsetWidth > innerWidth;

		if ( qazana.config.is_rtl ) {
			if ( isOutOfRight ) {
				ui.position.left = innerWidth - this.el.offsetWidth;
			}
		} else if ( isOutOfLeft ) {
			ui.position.left = 0;
		}

		qazana.$body.toggleClass( 'qazana-panel--dock-hint', qazana.config.is_rtl ? isOutOfLeft : isOutOfRight );
	},

	onDragStop: function( _event, ui ) {
		if ( this.isDocked ) {
			return;
		}

		this.saveSize();

		const elementRight = ui.position.left + this.el.offsetWidth;

		if ( 0 > ui.position.left || elementRight > innerWidth ) {
			this.dock();
		}

		qazana.$body.removeClass( 'qazana-panel--dock-hint' );
	},

	onEditModeSwitched: function( activeMode ) {
		if ( 'edit' === activeMode && this.storage.visible ) {
			this.open();
		} else {
			this.close( true );
		}
	},
} );
