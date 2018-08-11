module.exports = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-empty-preview',

	className: 'qazana-empty-view',

	events: {
		'click': 'onClickAdd'
	},

	behaviors: function() {
		return {
			contextMenu: {
				behaviorClass: require( 'qazana-behaviors/context-menu' ),
				groups: this.getContextMenuGroups()
			}
		};
	},

	getContextMenuGroups: function() {
		return [
			{
				name: 'general',
				actions: [
					{
						name: 'paste',
						title: qazana.translate( 'paste' ),
						callback: this.paste.bind( this ),
						isEnabled: this.isPasteEnabled.bind( this )
					}
				]
			}
		];
	},

	paste: function() {
		var self = this,
			elements = qazana.getStorage( 'transfer' ).elements,
			index = 0;

		elements.forEach( function( item ) {
			self._parent.addChildElement( item, { at: index, clone: true } );

			index++;
		} );
	},

	isPasteEnabled: function() {
		var transferData = qazana.getStorage( 'transfer' );

		if ( ! transferData ) {
			return false;
		}

		if ( 'section' === transferData.elementsType ) {
			return transferData.elements[0].isInner && ! this._parent.isInner();
		}

		return 'widget' === transferData.elementsType;
	},

	onClickAdd: function() {
		qazana.getPanelView().setPage( 'elements' );
	}
} );
