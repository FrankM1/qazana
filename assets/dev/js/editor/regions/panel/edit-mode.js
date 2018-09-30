var EditModeItemView;

EditModeItemView = Marionette.ItemView.extend( {
	template: '#tmpl-qazana-mode-switcher-content',

	id: 'qazana-mode-switcher-inner',

	ui: {
		previewButton: '#qazana-mode-switcher-preview-input',
		previewLabel: '#qazana-mode-switcher-preview',
		previewLabelA11y: '#qazana-mode-switcher-preview .qazana-screen-only',
	},

	events: {
		'change @ui.previewButton': 'onPreviewButtonChange',
	},

	initialize: function() {
		this.listenTo( qazana.channels.dataEditMode, 'switch', this.onEditModeChanged );
	},

	getCurrentMode: function() {
		return this.ui.previewButton.is( ':checked' ) ? 'preview' : 'edit';
	},

	setMode: function( mode ) {
		this.ui.previewButton
			.prop( 'checked', 'preview' === mode )
			.trigger( 'change' );
	},

	toggleMode: function() {
		this.setMode( this.ui.previewButton.prop( 'checked' ) ? 'edit' : 'preview' );
	},

	onRender: function() {
		this.onEditModeChanged();
	},

	onPreviewButtonChange: function() {
		qazana.changeEditMode( this.getCurrentMode() );
	},

	onEditModeChanged: function() {
		var activeMode = qazana.channels.dataEditMode.request( 'activeMode' ),
			title = qazana.translate( 'preview' === activeMode ? 'back_to_editor' : 'preview' );

		this.ui.previewLabel.attr( 'title', title );
		this.ui.previewLabelA11y.text( title );
	},
} );

module.exports = EditModeItemView;
