var ViewModule = require( '../../utils/view-module' );

module.exports = ViewModule.extend( {
    getDefaultSettings: function() {
		return {
			isInserted: false,
			APISrc: 'https://f.vimeocdn.com/js/froogaloop2.min.js', // using froogaloop2. New vimeo js api is dead buggy
			selectors: {
				firstScript: 'script:first',
			},
		};
	},

	getDefaultElements: function() {
		return {
			$firstScript: jQuery( this.getSettings( 'selectors.firstScript' ) ),
		};
	},

	insertVimeoAPI: function() {
		this.setSettings( 'isInserted', true );
		this.elements.$firstScript.before( jQuery( '<script>', { src: this.getSettings( 'APISrc' ) } ) );
	},

	onVimeoApiReady: function( callback ) {
		var self = this;

		if ( ! self.getSettings( 'IsInserted' ) ) {
			self.insertVimeoAPI();
		}

		if ( window.$f ) {
			callback( $f );
		} else {
			// If not ready check again by timeout..
			setTimeout( function() {
				self.onVimeoApiReady( callback );
			}, 350 );
		}
	},

	getVimeoIDFromURL: function( url ) {
		var videoIDParts = url.match( /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/ );
		return videoIDParts && videoIDParts[ 1 ];
    },

} );
