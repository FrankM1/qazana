var BaseModalLayout = require( 'qazana-templates/views/base-modal-layout' ),
	TemplateLibraryHeaderActionsView = require( 'qazana-templates/views/parts/header-parts/actions' ),
	TemplateLibraryHeaderMenuView = require( 'qazana-templates/views/parts/header-parts/menu' ),
	TemplateLibraryHeaderPreviewView = require( 'qazana-templates/views/parts/header-parts/preview' ),
	TemplateLibraryHeaderBackView = require( 'qazana-templates/views/parts/header-parts/back' ),
	TemplateLibraryCollectionView = require( 'qazana-templates/views/parts/templates' ),
	TemplateLibrarySaveTemplateView = require( 'qazana-templates/views/parts/save-template' ),
	TemplateLibraryImportView = require( 'qazana-templates/views/parts/import' ),
	TemplateLibraryPreviewView = require( 'qazana-templates/views/parts/preview' );

module.exports = BaseModalLayout.extend( {

	getModalOptions: function() {
		return {
			id: 'qazana-template-library-modal',
		};
	},

	getLogoOptions: function() {
		return {
			title: qazana.translate( 'library' ),
			click: function() {
				qazana.templates.setTemplatesPage( 'remote', 'page' );
			},
		};
	},

	getTemplateActionButton: function( templateData ) {
		var viewId = '#tmpl-qazana-template-library-insert-button';

		viewId = qazana.hooks.applyFilters( 'qazana/editor/template-library/template/action-button', viewId, templateData );

		var template = Marionette.TemplateCache.get( viewId );

		return Marionette.Renderer.render( template );
	},

	setHeaderDefaultParts: function() {
		var headerView = this.getHeaderView();

		headerView.tools.show( new TemplateLibraryHeaderActionsView() );
		headerView.menuArea.show( new TemplateLibraryHeaderMenuView() );

		this.showLogo();
	},

	showTemplatesView: function( templatesCollection ) {
		this.modalContent.show( new TemplateLibraryCollectionView( {
			collection: templatesCollection,
		} ) );

		this.setHeaderDefaultParts();
	},

	showImportView: function() {
		this.getHeaderView().menuArea.reset();

		this.modalContent.show( new TemplateLibraryImportView() );
	},

	showSaveTemplateView: function( elementModel ) {
		this.getHeaderView().menuArea.reset();

		this.modalContent.show( new TemplateLibrarySaveTemplateView( { model: elementModel } ) );
	},

	showPreviewView: function( templateModel ) {
		this.modalContent.show( new TemplateLibraryPreviewView( {
			url: templateModel.get( 'url' ),
		} ) );

		var headerView = this.getHeaderView();

		headerView.menuArea.reset();

		headerView.tools.show( new TemplateLibraryHeaderPreviewView( {
			model: templateModel,
		} ) );

		headerView.logoArea.show( new TemplateLibraryHeaderBackView() );
	},
} );
