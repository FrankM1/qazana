var TemplateLibraryInsertTemplateBehavior = require( 'qazana-templates/behaviors/insert-template' );

module.exports = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-template-library-header-preview',

	id: 'qazana-template-library-header-preview',

	behaviors: {
		insertTemplate: {
			behaviorClass: TemplateLibraryInsertTemplateBehavior
		}
	}
} );
