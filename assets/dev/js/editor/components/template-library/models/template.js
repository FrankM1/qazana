module.exports = Backbone.Model.extend( {
	defaults: {
		template_id: 0,
		name: '',
		title: '',
		source: '',
		type: '',
		subtype: '',
		author: '',
		thumbnail: '',
		url: '',
		export_link: '',
		categories: [],
		tags: [],
		keywords: [],
	},
} );
