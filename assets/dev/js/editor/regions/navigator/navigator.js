const BaseRegion = require( 'qazana-regions/base' );

import NavigatorLayout from './layout';

export default class extends BaseRegion {
	constructor( options ) {
		super( options );

		this.isDocked = false;

		this.opened = false;

		this.ensurePosition = this.ensurePosition.bind( this );

		this.listenTo( qazana.channels.dataEditMode, 'switch', this.onEditModeSwitched );

		if ( this.storage.visible ) {
			this.open();
		}
	}

	getStorageKey() {
		return 'navigator';
	}

	getDefaultStorage() {
		return {
			visible: false,
			size: {
				width: '',
				height: '',
				top: '',
				bottom: '',
				right: '',
				left: '',
			},
		};
	}

	getLayout() {
		return this.currentView;
	}

	getDraggableOptions() {
		return {
			iframeFix: true,
			handle: '#qazana-navigator__header',
			drag: this.onDrag.bind( this ),
			stop: this.onDragStop.bind( this ),
		};
	}

	getResizableOptions() {
		return {
			handles: 'all',
			containment: 'document',
			minWidth: 150,
			maxWidth: 500,
			minHeight: 240,
			start: () => {
				qazana.$previewWrapper.addClass( 'ui-resizable-resizing' );
			},
			stop: () => {
				qazana.$previewWrapper.removeClass( 'ui-resizable-resizing' );

				if ( this.isDocked ) {
					this.storage.size.width = qazana.helpers.getElementInlineStyle( this.$el, [ 'width' ] ).width;

					qazana.setStorage( 'navigator', this.storage );
				} else {
					this.saveSize();
				}
			},
		};
	}

	beforeFirstOpen() {
		this.show( new NavigatorLayout() );

		this.$el.draggable( this.getDraggableOptions() );

		this.$el.resizable( this.getResizableOptions() );
	}

	open( model ) {
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
	}

	close( silent ) {
		this.$el.hide();

		if ( this.isDocked ) {
			this.undock( true );
		}

		if ( ! silent ) {
			this.saveStorage( 'visible', false );
		}

		qazana.$window.off( 'resize', this.ensurePosition );
	}

	isOpen() {
		return this.$el.is( ':visible' );
	}

	dock() {
		qazana.$body.addClass( 'qazana-navigator-docked' );

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
	}

	undock( silent ) {
		qazana.$body.removeClass( 'qazana-navigator-docked' );

		qazana.$previewWrapper.css( qazana.config.is_rtl ? 'left' : 'right', '' );

		this.setSize();

		this.$el.resizable( 'destroy' );

		this.$el.resizable( this.getResizableOptions() );

		this.isDocked = false;

		if ( ! silent ) {
			this.saveStorage( 'docked', false );
		}
	}

	setSize() {
		if ( this.storage.size ) {
			this.$el.css( this.storage.size );
		}
	}

	setDockedSize() {
		this.$el.css( 'width', this.storage.size.width );
	}

	ensurePosition() {
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
	}

	onDrag( event, ui ) {
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

		qazana.$body.toggleClass( 'qazana-navigator--dock-hint', qazana.config.is_rtl ? isOutOfLeft : isOutOfRight );
	}

	onDragStop( event, ui ) {
		if ( this.isDocked ) {
			return;
		}

		this.saveSize();

		const elementRight = ui.position.left + this.el.offsetWidth;

		if ( 0 > ui.position.left || elementRight > innerWidth ) {
			this.dock();
		}

		qazana.$body.removeClass( 'qazana-navigator--dock-hint' );
	}

	onEditModeSwitched( activeMode ) {
		if ( 'edit' === activeMode && this.storage.visible ) {
			this.open();
		} else {
			this.close( true );
		}
	}
}
