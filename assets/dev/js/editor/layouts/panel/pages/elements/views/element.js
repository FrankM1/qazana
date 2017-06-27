var PanelElementsElementView;

PanelElementsElementView = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-element-library-element',

	className: 'qazana-element-wrapper',

	onRender: function() {
		var self = this;

		this.$el.html5Draggable( {

			onDragStart: function() {
				qazana.channels.panelElements
					.reply( 'element:selected', self )
					.trigger( 'element:drag:start' );
			},

			onDragEnd: function() {
				qazana.channels.panelElements.trigger( 'element:drag:end' );
			},

			groups: [ 'qazana-element' ]
		} );
	}
} );

module.exports = PanelElementsElementView;
