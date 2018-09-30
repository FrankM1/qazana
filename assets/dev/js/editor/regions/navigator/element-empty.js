export default class extends Marionette.ItemView {
	getTemplate() {
		return '#tmpl-qazana-navigator__elements--empty';
	}

	className() {
		return 'qazana-empty-view';
	}

	onRendr() {
		this.$el.css( 'padding-' + ( qazana.config.is_rtl ? 'right' : 'left' ), this.getOption( 'indent' ) );
	}
}
