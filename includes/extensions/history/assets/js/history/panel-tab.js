module.exports = Marionette.CompositeView.extend( {
	id: 'qazana-panel-history',

	template: '#tmpl-qazana-panel-history-tab',

	childView: Marionette.ItemView.extend( {
		template: '#tmpl-qazana-panel-history-item',
		ui: {
			item: '.qazana-history-item'
		},
		triggers: {
			'click @ui.item': 'item:click'
		}
	} ),

	childViewContainer: '#qazana-history-list',

	currentItem: null,

	onRender: function() {
		var self = this;

		_.defer( function() {
			// Set current item - the first not applied item
			if ( self.children.length ) {
				var currentItem = self.collection.find( function( model ) {
						return 'not_applied' ===  model.get( 'status' );
					} ),
					currentView = self.children.findByModel( currentItem );

				self.updateCurrentItem( currentView.$el );
			}
		} );
	},

	updateCurrentItem: function( element ) {
		var currentItemClass = 'qazana-history-item-current';

		if ( this.currentItem ) {
			this.currentItem.removeClass( currentItemClass );
		}

		this.currentItem = element;

		this.currentItem.addClass( currentItemClass );
	},

	onChildviewItemClick: function( childView, event ) {
		if ( childView.$el === this.currentItem ) {
			return;
		}

		var collection = event.model.collection,
			itemIndex = collection.findIndex( event.model );

		qazana.history.history.doItem( itemIndex );

		this.updateCurrentItem( childView.$el );

		if ( ! this.isDestroyed ) {
			this.render();
		}
	}
} );
