var Module = require( 'qazana-utils/module' ),
	SettingsModel = require( 'qazana-elements/models/base-settings' );

module.exports = Module.extend( {

	CACHE_KEY_NOT_FOUND_ERROR: 'Cache key not found',

	tags: {
		Base: require( 'qazana-dynamic-tags/tag' ),
	},

	cache: {},

	cacheRequests: {},

	cacheCallbacks: [],

	addCacheRequest: function( tag ) {
		this.cacheRequests[ this.createCacheKey( tag ) ] = true;
	},

	createCacheKey: function( tag ) {
		return btoa( tag.getOption( 'name' ) ) + '-' + btoa( encodeURIComponent( JSON.stringify( tag.model ) ) );
	},

	loadTagDataFromCache: function( tag ) {
		var cacheKey = this.createCacheKey( tag );

		if ( undefined !== this.cache[ cacheKey ] ) {
			return this.cache[ cacheKey ];
		}

		if ( ! this.cacheRequests[ cacheKey ] ) {
			this.addCacheRequest( tag );
		}
	},

	loadCacheRequests: function() {
		var cache = this.cache,
			cacheRequests = this.cacheRequests,
			cacheCallbacks = this.cacheCallbacks;

		this.cacheRequests = {};

		this.cacheCallbacks = [];

		jQuery.ajax( {
			type: 'POST',
				url: qazana.config.ajaxurl,
			data: {
				action: 'qazana_render_tags',
				post_id: qazana.config.document.id,
				tags: Object.keys( cacheRequests ),
				_nonce: qazana.config.nonce,
				editor_post_id: qazana.config.document.id,
			},
			dataType: 'json',
			success: function( data ) {
				jQuery.extend( cache, data );
				cacheCallbacks.forEach( function( callback ) {
					callback();
				} );
			},
		} );
	},

	refreshCacheFromServer: function( callback ) {
		this.cacheCallbacks.push( callback );

		this.loadCacheRequests();
	},

	getConfig: function( key ) {
		return this.getItems( qazana.config.dynamicTags, key );
	},

	parseTagsText: function( text, settings, parseCallback ) {
		var self = this;

		if ( 'object' === settings.returnType ) {
			return self.parseTagText( text, settings, parseCallback );
		}

		return text.replace( /\[qazana-tag[^\]]+]/g, function( tagText ) {
			return self.parseTagText( tagText, settings, parseCallback );
		} );
	},

	parseTagText: function( tagText, settings, parseCallback ) {
		var tagData = this.tagTextToTagData( tagText );

		if ( ! tagData ) {
			if ( 'object' === settings.returnType ) {
				return {};
			}

			return '';
		}

		return parseCallback( tagData.id, tagData.name, tagData.settings );
	},

	tagTextToTagData: function( tagText ) {
		var tagIDMatch = tagText.match( /id="(.*?(?="))"/ ),
			tagNameMatch = tagText.match( /name="(.*?(?="))"/ ),
			tagSettingsMatch = tagText.match( /settings="(.*?(?="]))/ );

		if ( ! tagIDMatch || ! tagNameMatch || ! tagSettingsMatch ) {
			return false;
		}

		return {
			id: tagIDMatch[ 1 ],
			name: tagNameMatch[ 1 ],
			settings: JSON.parse( decodeURIComponent( tagSettingsMatch[ 1 ] ) ),
		};
	},

	createTag: function( tagID, tagName, tagSettings ) {
		var tagConfig = this.getConfig( 'tags.' + tagName );

		if ( ! tagConfig ) {
			return;
		}

		var TagClass = this.tags[ tagName ] || this.tags.Base,
			model = new SettingsModel( tagSettings, {
				controls: tagConfig.controls,
			} );

		return new TagClass( { id: tagID, name: tagName, model: model } );
	},

	getTagDataContent: function( tagID, tagName, tagSettings ) {
		var tag = this.createTag( tagID, tagName, tagSettings );

		if ( ! tag ) {
			return;
		}

		return tag.getContent();
	},

	tagDataToTagText: function( tagID, tagName, tagSettings ) {
		tagSettings = encodeURIComponent( JSON.stringify( ( tagSettings && tagSettings.toJSON( { removeDefault: true } ) ) || {} ) );

		return '[qazana-tag id="' + tagID + '" name="' + tagName + '" settings="' + tagSettings + '"]';
	},

	cleanCache: function() {
		this.cache = {};
	},

	onInit: function() {
		this.loadCacheRequests = _.debounce( this.loadCacheRequests, 300 );
	},
} );
