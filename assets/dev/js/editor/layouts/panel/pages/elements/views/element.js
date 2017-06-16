var PanelElementsElementView;

PanelElementsElementView = Marionette.ItemView.extend( {
	template: '#tmpl-builder-element-library-element',

	className: 'builder-element-wrapper',

	onRender: function() {
		var self = this;

		this.$el.html5Draggable( {

			onDragStart: function() {
				builder.channels.panelElements
					.reply( 'element:selected', self )
					.trigger( 'element:drag:start' );
			},

			onDragEnd: function() {
				builder.channels.panelElements.trigger( 'element:drag:end' );
			},

			groups: [ 'builder-element' ]
		} );
	}
} );

module.exports = PanelElementsElementView;
