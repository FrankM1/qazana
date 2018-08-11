var EditModeItemView = require( 'qazana-layouts/edit-mode' ),
	PanelLayoutView;

PanelLayoutView = Marionette.LayoutView.extend( {
	template: '#tmpl-qazana-panel',

	id: 'qazana-panel-inner',

	regions: {
		content: '#qazana-panel-content-wrapper',
		header: '#qazana-panel-header-wrapper',
		footer: '#qazana-panel-footer',
		modeSwitcher: '#qazana-mode-switcher'
	},

	pages: {},

	childEvents: {
		'click:add': function() {
			this.setPage( 'elements' );
		},
		'editor:destroy': function() {
			this.setPage( 'elements', null, { autoFocusSearch: false } );
		}
	},

	currentPageName: null,

	currentPageView: null,

	_isScrollbarInitialized: false,

	initialize: function() {
		this.initPages();
	},

	buildPages: function() {
		var pages = {
			elements: {
				view: require( 'qazana-panel/pages/elements/elements' ),
				title: '<img src="' + qazana.config.assets_url + 'images/logo-panel.svg">'
			},
			editor: {
				view: require( 'qazana-panel/pages/editor' )
			},
			menu: {
				view: qazana.modules.layouts.panel.pages.menu.Menu,
				title: '<img src="' + qazana.config.assets_url + 'images/logo-panel.svg">'
			},
			colorScheme: {
				view: require( 'qazana-panel/pages/schemes/colors' )
			},
			typographyScheme: {
				view: require( 'qazana-panel/pages/schemes/typography' )
			},
			colorPickerScheme: {
				view: require( 'qazana-panel/pages/schemes/color-picker' )
			}
		};

		var schemesTypes = Object.keys( qazana.schemes.getSchemes() ),
			disabledSchemes = _.difference( schemesTypes, qazana.schemes.getEnabledSchemesTypes() );

		_.each( disabledSchemes, function( schemeType ) {
			var scheme  = qazana.schemes.getScheme( schemeType );

			pages[ schemeType + 'Scheme' ].view = require( 'qazana-panel/pages/schemes/disabled' ).extend( {
				disabledTitle: scheme.disabled_title
			} );
		} );

		return pages;
	},

	initPages: function() {
		var pages;

		this.getPages = function( page ) {
			if ( ! pages ) {
				pages = this.buildPages();
			}

			return page ? pages[ page ] : pages;
		};

		this.addPage = function( pageName, pageData ) {
			if ( ! pages ) {
				pages = this.buildPages();
			}

			pages[ pageName ] = pageData;
		};
	},

	getHeaderView: function() {
		return this.getChildView( 'header' );
	},

	getFooterView: function() {
		return this.getChildView( 'footer' );
	},

	getCurrentPageName: function() {
		return this.currentPageName;
	},

	getCurrentPageView: function() {
		return this.currentPageView;
	},

	setPage: function( page, title, viewOptions ) {
		if ( 'elements' === page && ! qazana.userCan( 'design' ) ) {
			var pages = this.getPages();
			if ( pages.hasOwnProperty( 'page_settings' ) ) {
				page = 'page_settings';
			}
		}
		var pageData = this.getPages( page );

		if ( ! pageData ) {
			throw new ReferenceError( 'Qazana panel doesn\'t have page named \'' + page + '\'' );
		}

		if ( pageData.options ) {
			viewOptions = _.extend( pageData.options, viewOptions );
		}

		var View = pageData.view;

		if ( pageData.getView ) {
			View = pageData.getView();
		}

		this.currentPageName = page;

		this.currentPageView = new View( viewOptions );

		this.showChildView( 'content', this.currentPageView );

		this.getHeaderView().setTitle( title || pageData.title );

		this
			.trigger( 'set:page', this.currentPageView )
			.trigger( 'set:page:' + page, this.currentPageView );
	},

	openEditor: function( model, view ) {
		var currentPageName = this.getCurrentPageName();

		if ( 'editor' === currentPageName ) {
			var currentPageView = this.getCurrentPageView(),
				currentEditableModel = currentPageView.model;

			if ( currentEditableModel === model ) {
				return;
			}
		}

		var elementData = qazana.getElementData( model );

		this.setPage( 'editor', qazana.translate( 'edit_element', [ elementData.title ] ), {
			model: model,
			controls: qazana.getElementControls( model ),
			editedElementView: view
		} );

		var action = 'panel/open_editor/' + model.get( 'elType' );

		// Example: panel/open_editor/widget
		qazana.hooks.doAction( action, this, model, view );

		// Example: panel/open_editor/widget/heading
		qazana.hooks.doAction( action + '/' + model.get( 'widgetType' ), this, model, view );
	},

	onBeforeShow: function() {
		var PanelFooterItemView = require( 'qazana-layouts/panel/footer' ),
			PanelHeaderItemView = require( 'qazana-layouts/panel/header' );

		// Edit Mode
		this.showChildView( 'modeSwitcher', new EditModeItemView() );

		// Header
		this.showChildView( 'header', new PanelHeaderItemView() );

		// Footer
		this.showChildView( 'footer', new PanelFooterItemView() );

		// Added Editor events
		this.updateScrollbar = _.throttle( this.updateScrollbar, 100 );

		this.getRegion( 'content' )
			.on( 'before:show', this.onEditorBeforeShow.bind( this ) )
			.on( 'empty', this.onEditorEmpty.bind( this ) )
			.on( 'show', this.updateScrollbar.bind( this ) );

		// Set default page to elements
		this.setPage( 'elements' );
	},

	onEditorBeforeShow: function() {
		_.defer( this.updateScrollbar.bind( this ) );
	},

	onEditorEmpty: function() {
		this.updateScrollbar();
	},

	updateScrollbar: function() {
		var $panel = this.content.$el;

		if ( ! this._isScrollbarInitialized ) {
			$panel.perfectScrollbar();
			this._isScrollbarInitialized = true;

			return;
		}

		$panel.perfectScrollbar( 'update' );
	}
} );

module.exports = PanelLayoutView;
