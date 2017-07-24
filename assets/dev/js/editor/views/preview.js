var BaseSectionsContainerView = require( 'qazana-views/base-sections-container' ),
	AddSectionView = require( 'qazana-views/add-section/independent' ),
	Preview;

Preview = BaseSectionsContainerView.extend( {
	template: Marionette.TemplateCache.get( '#tmpl-qazana-preview' ),

	className: 'qazana-inner',

	childViewContainer: '.qazana-section-wrap',

	onRender: function() {
		var addNewSectionView = new AddSectionView();

		addNewSectionView.render();

		this.$el.append( addNewSectionView.$el );
	}
} );

module.exports = Preview;
