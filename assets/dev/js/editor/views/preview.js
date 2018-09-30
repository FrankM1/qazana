var BaseSectionsContainerView = require( 'qazana-views/base-sections-container' ),
	Preview;

import AddSectionView from './add-section/independent';

Preview = BaseSectionsContainerView.extend( {
	template: Marionette.TemplateCache.get( '#tmpl-qazana-preview' ),

	className: 'qazana-inner',

	childViewContainer: '.qazana-section-wrap',

	behaviors: function() {
		var parentBehaviors = BaseSectionsContainerView.prototype.behaviors.apply( this, arguments ),
			behaviors = {
				contextMenu: {
					behaviorClass: require( 'qazana-behaviors/context-menu' ),
					groups: this.getContextMenuGroups(),
				},
			};

		return jQuery.extend( parentBehaviors, behaviors );
	},

	getContextMenuGroups: function() {
		var hasContent = function() {
			return qazana.elements.length > 0;
		};

		return [
			{
				name: 'paste',
				actions: [
					{
						name: 'paste',
						title: qazana.translate( 'paste' ),
						callback: this.paste.bind( this ),
						isEnabled: this.isPasteEnabled.bind( this ),
					},
				],
			}, {
				name: 'content',
				actions: [
					{
						name: 'copy_all_content',
						title: qazana.translate( 'copy_all_content' ),
						callback: this.copy.bind( this ),
						isEnabled: hasContent,
					}, {
						name: 'delete_all_content',
						title: qazana.translate( 'delete_all_content' ),
						callback: qazana.clearPage.bind( qazana ),
						isEnabled: hasContent,
					},
				],
			},
		];
	},

	copy: function() {
		qazana.setStorage( 'transfer', {
			type: 'copy',
			elementsType: 'section',
			elements: qazana.elements.toJSON( { copyHtmlCache: true } ),
		} );
	},

	paste: function( atIndex ) {
		var self = this,
			transferData = qazana.getStorage( 'transfer' ),
			section,
			index = undefined !== atIndex ? atIndex : this.collection.length;

		qazana.channels.data.trigger( 'element:before:add', transferData.elements[ 0 ] );

		if ( 'section' === transferData.elementsType ) {
			transferData.elements.forEach( function( element ) {
				self.addChildElement( element, {
					at: index,
					edit: false,
					clone: true,
				} );

				index++;
			} );
		} else if ( 'column' === transferData.elementsType ) {
			section = self.addChildElement( { allowEmpty: true }, { at: atIndex } );

			section.model.unset( 'allowEmpty' );

			index = 0;

			transferData.elements.forEach( function( element ) {
				section.addChildElement( element, {
					at: index,
					clone: true,
				} );

				index++;
			} );

			section.redefineLayout();
		} else {
			section = self.addChildElement( null, { at: atIndex } );

			index = 0;

			transferData.elements.forEach( function( element ) {
				section.addChildElement( element, {
					at: index,
					clone: true,
				} );

				index++;
			} );
		}

		qazana.channels.data.trigger( 'element:after:add', transferData.elements[ 0 ] );
	},

	isPasteEnabled: function() {
		return qazana.getStorage( 'transfer' );
	},

	onRender: function() {
		if ( ! qazana.userCan( 'design' ) ) {
			return;
		}
		var addNewSectionView = new AddSectionView();

		addNewSectionView.render();

		this.$el.append( addNewSectionView.$el );
	},
} );

module.exports = Preview;
