var TemplateLibraryTemplateView = require( 'qazana-templates/views/template/base' ),
	TemplateLibraryTemplateRemoteView;

TemplateLibraryTemplateRemoteView = TemplateLibraryTemplateView.extend( {
	template: '#tmpl-qazana-template-library-template-remote',

	ui: function() {
		return jQuery.extend( TemplateLibraryTemplateView.prototype.ui.apply( this, arguments ), {
			favoriteCheckbox: '.qazana-template-library-template-favorite-input',
		} );
	},

	events: function() {
		return jQuery.extend( TemplateLibraryTemplateView.prototype.events.apply( this, arguments ), {
			'change @ui.favoriteCheckbox': 'onFavoriteCheckboxChange',
		} );
	},

	onPreviewButtonClick: function() {
		qazana.templates.getLayout().showPreviewView( this.model );
	},

	onFavoriteCheckboxChange: function() {
		var isFavorite = this.ui.favoriteCheckbox[ 0 ].checked;

		this.model.set( 'favorite', isFavorite );

		qazana.templates.markAsFavorite( this.model, isFavorite );

		if ( ! isFavorite && qazana.templates.getFilter( 'favorite' ) ) {
			qazana.channels.templates.trigger( 'filter:change' );
		}
	},
} );

module.exports = TemplateLibraryTemplateRemoteView;
