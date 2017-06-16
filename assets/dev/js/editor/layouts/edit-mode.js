var EditModeItemView;

EditModeItemView = Marionette.ItemView.extend( {
	template: '#tmpl-builder-mode-switcher-content',

	id: 'builder-mode-switcher-inner',

	ui: {
		previewButton: '#builder-mode-switcher-preview-input',
		previewLabel: '#builder-mode-switcher-preview',
		previewLabelA11y: '#builder-mode-switcher-preview .builder-screen-only'
	},

	events: {
		'change @ui.previewButton': 'onPreviewButtonChange'
	},

	initialize: function() {
		this.listenTo( builder.channels.dataEditMode, 'switch', this.onEditModeChanged );
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
		this.onPreviewButtonChange();
	},

	onPreviewButtonChange: function() {
		builder.changeEditMode( this.getCurrentMode() );
	},

	onEditModeChanged: function( activeMode ) {
		var title = builder.translate( 'preview' === activeMode ? 'back_to_editor' : 'preview' );

		this.ui.previewLabel.attr( 'title', title );
		this.ui.previewLabelA11y.text( title );
	}
} );

module.exports = EditModeItemView;
