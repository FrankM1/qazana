var PostsClassicHandler = require( './posts' );

module.exports = PostsClassicHandler.extend( {

	getElementName: function() {
		return 'archive-posts';
	},

	getSkinPrefix: function() {
		return 'archive_classic_';
	}
} );