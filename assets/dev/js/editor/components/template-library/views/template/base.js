var TemplateLibraryInsertTemplateBehavior = require( 'qazana-templates/behaviors/insert-template' ),
	TemplateLibraryTemplateView;

TemplateLibraryTemplateView = Marionette.ItemView.extend( {
	className: function() {
		var classes = 'qazana-template-library-template',
			source = this.model.get( 'source' );

		classes += ' qazana-template-library-template-' + source;

		if ( 'remote' === source ) {
			classes += ' qazana-template-library-template-' + this.model.get( 'type' );
		}

		return classes;
	},

	ui: function() {
		return {
			insertButton: '.qazana-template-library-template-insert',
			previewButton: '.qazana-template-library-template-preview'
		};
	},

	events: function() {
		return {
			'click @ui.insertButton': 'onInsertButtonClick',
			'click @ui.previewButton': 'onPreviewButtonClick'
		};
	},

	behaviors: {
		insertTemplate: {
			behaviorClass: TemplateLibraryInsertTemplateBehavior
		}
	}
} );

module.exports = TemplateLibraryTemplateView;
