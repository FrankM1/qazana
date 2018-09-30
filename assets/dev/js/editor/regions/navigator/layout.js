import ElementView from './element';

export default class extends Marionette.LayoutView {
	getTemplate() {
		return '#tmpl-qazana-navigator';
	}

	id() {
		return 'qazana-navigator__inner';
	}

	ui() {
		return {
			toggleAll: '#qazana-navigator__toggle-all',
			close: '#qazana-navigator__close',
		};
	}

	events() {
		return {
			'click @ui.toggleAll': 'toggleAll',
			'click @ui.close': 'onCloseClick',
		};
	}

	regions() {
		return {
			elements: '#qazana-navigator__elements',
		};
	}

	toggleAll() {
		const state = 'expand' === this.ui.toggleAll.data( 'qazana-action' ),
			classes = [ 'eicon-collapse', 'eicon-expand' ];

		this.ui.toggleAll
			.data( 'qazana-action', state ? 'collapse' : 'expand' )
			.removeClass( classes[ +state ] )
			.addClass( classes[ +! state ] );

		this.elements.currentView.recursiveChildInvoke( 'toggleList', state );
	}

	activateElementsMouseInteraction() {
		this.elements.currentView.recursiveChildInvoke( 'activateMouseInteraction' );
	}

	deactivateElementsMouseInteraction() {
		this.elements.currentView.recursiveChildInvoke( 'deactivateMouseInteraction' );
	}

	onShow() {
		this.elements.show( new ElementView( {
			model: qazana.elementsModel,
		} ) );
	}

	onCloseClick() {
		qazana.navigator.close();
	}
}
