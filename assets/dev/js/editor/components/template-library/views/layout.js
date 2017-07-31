var TemplateLibraryHeaderLogoView = require( 'qazana-templates/views/parts/header/logo' ),
	TemplateLibraryHeaderSaveView = require( 'qazana-templates/views/parts/header/save' ),
	TemplateLibraryHeaderImportView = require( 'qazana-templates/views/parts/header/import' ),
	TemplateLibraryHeaderMenuView = require( 'qazana-templates/views/parts/header/menu' ),
	TemplateLibraryHeaderPreviewView = require( 'qazana-templates/views/parts/header/preview' ),
	TemplateLibraryHeaderSearchView = require( 'qazana-templates/views/parts/header/search' ),
	TemplateLibraryHeaderBackView = require( 'qazana-templates/views/parts/header/back' ),

	TemplateLibraryHeaderView = require( 'qazana-templates/views/parts/panel/header' ),
	TemplateLibraryLoadingView = require( 'qazana-templates/views/parts/panel/loading' ),
	TemplateLibraryCollectionView = require( 'qazana-templates/views/parts/panel/templates' ),
	TemplateLibrarySaveTemplateView = require( 'qazana-templates/views/parts/panel/save-template' ),
	TemplateLibraryImportView = require( 'qazana-templates/views/parts/panel/import' ),
	TemplateLibraryPreviewView = require( 'qazana-templates/views/parts/panel/preview' ),
	TemplateLibraryLayoutView;

TemplateLibraryLayoutView = Marionette.LayoutView.extend( {
	el: '#qazana-template-library-modal',

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
		headerView.import.show( new TemplateLibraryHeaderImportView() );
		headerView.menuArea.show( new TemplateLibraryHeaderMenuView() );
		headerView.logoArea.show( new TemplateLibraryHeaderLogoView() );
		headerView.searchArea.show( new TemplateLibraryHeaderSearchView() );
	},

	showImportView: function() {
		this.modalContent.show( new TemplateLibraryImportView() );

		var headerView = this.getHeaderView();

		headerView.tools.reset();
		headerView.import.reset();
		headerView.menuArea.reset();
		headerView.searchArea.reset();
		headerView.logoArea.show( new TemplateLibraryHeaderLogoView() );
	},

	showSaveTemplateView: function( elementModel ) {
		this.modalContent.show( new TemplateLibrarySaveTemplateView( { model: elementModel } ) );

		var headerView = this.getHeaderView();

		headerView.tools.reset();
		headerView.import.reset();
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
