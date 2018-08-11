var PostsHandler = require( './posts' );

module.exports = PostsHandler.extend( {
	getSkinPrefix: function() {
		return 'cards_';
	}
} );