var TemplateLibraryHeaderLogoView = require( 'builder-templates/views/parts/header/logo' ),
	TemplateLibraryHeaderSaveView = require( 'builder-templates/views/parts/header/save' ),
	TemplateLibraryHeaderMenuView = require( 'builder-templates/views/parts/header/menu' ),
	TemplateLibraryHeaderPreviewView = require( 'builder-templates/views/parts/header/preview' ),
	TemplateLibraryHeaderSearchView = require( 'builder-templates/views/parts/header/search' ),
	TemplateLibraryHeaderBackView = require( 'builder-templates/views/parts/header/back' ),

	TemplateLibraryHeaderView = require( 'builder-templates/views/parts/panel/header' ),
	TemplateLibraryLoadingView = require( 'builder-templates/views/parts/panel/loading' ),
	TemplateLibraryCollectionView = require( 'builder-templates/views/parts/panel/templates' ),
	TemplateLibrarySaveTemplateView = require( 'builder-templates/views/parts/panel/save-template' ),
	TemplateLibraryImportView = require( 'builder-templates/views/parts/panel/import' ),
	TemplateLibraryPreviewView = require( 'builder-templates/views/parts/panel/preview' ),
	TemplateLibraryLayoutView;

TemplateLibraryLayoutView = Marionette.LayoutView.extend( {
	el: '#builder-template-library-modal',

	regions: {
		modalContent: '.dialog-message',
		modalHeader: '.dialog-widget-header'
	},

	initialize: function() {
		this.getRegion( 'modalHeader' ).show( new TemplateLibraryHeaderView() );
	},

	getHeaderView: function() {
		return this.getRegion( 'modalHeader' ).currentView;
	},

	showLoadingView: function() {
		this.modalContent.show( new TemplateLibraryLoadingView() );
	},

	showTemplatesView: function( templatesCollection ) {
		this.modalContent.show( new TemplateLibraryCollectionView( {
			collection: templatesCollection
		} ) );

		var headerView = this.getHeaderView();

		headerView.tools.show( new TemplateLibraryHeaderSaveView() );
		headerView.menuArea.show( new TemplateLibraryHeaderMenuView() );
		headerView.logoArea.show( new TemplateLibraryHeaderLogoView() );
		headerView.searchArea.show( new TemplateLibraryHeaderSearchView() );
	},

	showImportView: function() {
		this.modalContent.show( new TemplateLibraryImportView() );
	},

	showSaveTemplateView: function( elementModel ) {
		this.modalContent.show( new TemplateLibrarySaveTemplateView( { model: elementModel } ) );

		var headerView = this.getHeaderView();

		headerView.tools.reset();
		headerView.menuArea.reset();
		headerView.searchArea.reset();
		headerView.logoArea.show( new TemplateLibraryHeaderLogoView() );
	},

	showPreviewView: function( templateModel ) {
		this.modalContent.show( new TemplateLibraryPreviewView( {
			url: templateModel.get( 'url' )
		} ) );

		var headerView = this.getHeaderView();

		headerView.menuArea.reset();
		headerView.searchArea.reset();

		headerView.tools.show( new TemplateLibraryHeaderPreviewView( {
			model: templateModel
		} ) );

		headerView.logoArea.show( new TemplateLibraryHeaderBackView() );
	}
} );

module.exports = TemplateLibraryLayoutView;
