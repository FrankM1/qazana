module.exports = Marionette.Region.extend( {

	storage: null,

	storageSizeKeys: null,

	constructor: function() {
		Marionette.Region.prototype.constructor.apply( this, arguments );

		var savedStorage = qazana.getStorage( this.getStorageKey() );

		this.storage = savedStorage ? savedStorage : this.getDefaultStorage();

		this.storageSizeKeys = Object.keys( this.storage.size );
	},

	saveStorage: function( key, value ) {
		this.storage[ key ] = value;

		qazana.setStorage( this.getStorageKey(), this.storage );
	},

	saveSize: function() {
		this.saveStorage( 'size', qazana.helpers.getElementInlineStyle( this.$el, this.storageSizeKeys ) );
	},
} );
