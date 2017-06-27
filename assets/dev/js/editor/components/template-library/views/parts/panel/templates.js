var TemplateLibraryTemplateLocalView = require( 'qazana-templates/views/template/local' ),
    TemplateLibraryTemplateRemoteView = require( 'qazana-templates/views/template/remote' ),
    TemplateLibraryTemplateThemeView = require( 'qazana-templates/views/template/theme' ),
    TemplateLibraryTemplatesEmptyView = require( 'qazana-templates/views/parts/panel/templates-empty' ),
    TemplateLibraryCollectionView;

TemplateLibraryCollectionView = Marionette.CompositeView.extend( {
	template: '#tmpl-qazana-template-library-templates',

	id: 'qazana-template-library-templates',

	childViewContainer: '#qazana-template-library-templates-container',

	emptyView: TemplateLibraryTemplatesEmptyView,

	getChildView: function( childModel ) {
		if ( 'remote' === childModel.get( 'source' ) ) {
			return TemplateLibraryTemplateRemoteView;
		}

        if ( 'theme' === childModel.get( 'source' ) ) {
            return TemplateLibraryTemplateThemeView;
        }

        return TemplateLibraryTemplateLocalView;
    },

	initialize: function() {
		this.listenTo( qazana.channels.templates, 'filter:change', this._renderChildren );
	},

	filterByName: function( model ) {
		var filterValue = qazana.channels.templates.request( 'filter:text' );

		if ( ! filterValue ) {
			return true;
		}

		filterValue = filterValue.toLowerCase();

		if ( model.get( 'title' ).toLowerCase().indexOf( filterValue ) >= 0 ) {
			return true;
		}

		return _.any( model.get( 'keywords' ), function( keyword ) {
			return keyword.toLowerCase().indexOf( filterValue ) >= 0;
		} );
	},

	filterBySource: function( model ) {
		var filterValue = qazana.channels.templates.request( 'filter:source' );

		if ( ! filterValue ) {
			return true;
		}

		return filterValue === model.get( 'source' );
	},

	filterByType: function( model ) {
		return qazana.templates.getTemplateTypes( model.get( 'type' ) ) && false !== qazana.templates.getTemplateTypes( model.get( 'type' ) ).showInLibrary;
	},

	filter: function( childModel ) {
		return this.filterByName( childModel ) && this.filterBySource( childModel ) && this.filterByType( childModel );
	},

	onRenderCollection: function() {
		var isEmpty = this.children.isEmpty();

		this.$childViewContainer.attr( 'data-template-source', isEmpty ? 'empty' : qazana.channels.templates.request( 'filter:source' ) );
	}
} );

module.exports = TemplateLibraryCollectionView;
