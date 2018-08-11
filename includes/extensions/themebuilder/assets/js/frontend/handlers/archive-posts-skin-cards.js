var PostsCardHandler = require( './cards' );

module.exports = PostsCardHandler.extend( {

	getElementName: function() {
		return 'archive-posts';
	},

	getSkinPrefix: function() {
		return 'archive_cards_';
	}
} );