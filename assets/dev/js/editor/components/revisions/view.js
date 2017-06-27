module.exports =  Marionette.ItemView.extend( {
	template: '#tmpl-qazana-panel-revisions-revision-item',

	className: 'qazana-revision-item',

	ui: {
		detailsArea: '.qazana-revision-item__details',
		deleteButton: '.qazana-revision-item__tools-delete'
	},

	triggers: {
		'click @ui.detailsArea': 'detailsArea:click',
		'click @ui.deleteButton': 'delete:click'
	}
} );
