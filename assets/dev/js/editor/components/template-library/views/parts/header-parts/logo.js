module.exports = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-templates-modal__header__logo',

	className: 'qazana-templates-modal__header__logo',

	events: {
		'click': 'onClick'
	},

	templateHelpers: function() {
		return {
			title: this.getOption( 'title' )
		};
	},

	onClick: function() {
		var clickCallback = this.getOption( 'click' );

		if ( clickCallback ) {
			clickCallback();
		}
	}
} );
