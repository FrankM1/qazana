module.exports = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-navigator__elements--empty',

	className: 'qazana-empty-view',

	onRender: function() {
		this.$el.css( 'padding-' + ( qazana.config.is_rtl ? 'right' : 'left' ), this.getOption( 'indent' ) );
	}
} );
