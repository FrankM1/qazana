module.exports = Marionette.LayoutView.extend( {
	template: '#tmpl-qazana-navigator',

	id: 'qazana-navigator__inner',

	ui: {
		toggleAll: '#qazana-navigator__toggle-all',
		close: '#qazana-navigator__close'
	},

	events: {
		'click @ui.toggleAll': 'toggleAll',
		'click @ui.close': 'onCloseClick'
	},

	regions: {
		elements: '#qazana-navigator__elements'
	},

	toggleAll: function() {
		var state = 'expand' === this.ui.toggleAll.data( 'qazana-action' ),
			classes = [ 'eicon-collapse', 'eicon-expand' ];

		this.ui.toggleAll
			.data( 'qazana-action', state ? 'collapse' : 'expand' )
			.removeClass( classes[ +state ] )
			.addClass( classes[ +! state ] );

		this.elements.currentView.recursiveChildInvoke( 'toggleList', state );
	},

	activateElementsMouseInteraction: function() {
		this.elements.currentView.recursiveChildInvoke( 'activateMouseInteraction' );
	},

	deactivateElementsMouseInteraction: function() {
		this.elements.currentView.recursiveChildInvoke( 'deactivateMouseInteraction' );
	},

	onShow: function() {
		var ElementsView = require( 'qazana-layouts/navigator/element' );

		this.elements.show( new ElementsView( {
			model: qazana.elementsModel
		} ) );
	},

	onCloseClick: function() {
		qazana.navigator.close();
	}
} );
