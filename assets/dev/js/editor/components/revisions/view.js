module.exports =  Marionette.ItemView.extend( {
	template: '#tmpl-builder-panel-revisions-revision-item',

	className: 'builder-revision-item',

	ui: {
		detailsArea: '.builder-revision-item__details',
		deleteButton: '.builder-revision-item__tools-delete'
	},

	triggers: {
		'click @ui.detailsArea': 'detailsArea:click',
		'click @ui.deleteButton': 'delete:click'
	}
} );
