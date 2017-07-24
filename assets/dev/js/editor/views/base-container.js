module.exports = Marionette.CompositeView.extend( {

	addChildModel: function( model, options ) {
		return this.collection.add( model, options, true );
	},

	addChildElement: function( itemData, options ) {
		options = options || {};

		var myChildType = this.getChildType(),
			elType = itemData.get ? itemData.get( 'elType' ) : itemData.elType;

		if ( -1 === myChildType.indexOf( elType ) ) {
			delete options.at;

			return this.children.last().addChildElement( itemData, options );
		}

		var newModel = this.addChildModel( itemData, options ),
			newView = this.children.findByModel( newModel );

		newView.edit();

		return newView;
	}
} );
