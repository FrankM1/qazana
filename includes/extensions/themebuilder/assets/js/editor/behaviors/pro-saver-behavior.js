var SaverBehavior = qazana.modules.components.saver.behaviors.FooterSaver;

module.exports = SaverBehavior.extend( {
	ui: function() {
		var ui = SaverBehavior.prototype.ui.apply( this, arguments );

		ui.menuConditions = '#qazana-pro-panel-saver-conditions';
		ui.previewWrapper = '#qazana-panel-footer-theme-builder-button-preview-wrapper';
		ui.buttonPreviewSettings = '#qazana-panel-footer-theme-builder-button-preview-settings';
		ui.buttonOpenPreview = '#qazana-panel-footer-theme-builder-button-open-preview';

		return ui;
	},

	events: function() {
		var events = SaverBehavior.prototype.events.apply( this, arguments );

		events[ 'click @ui.previewWrapper' ] = 'onClickPreviewWrapper';
		events[ 'click @ui.menuConditions' ] = 'onClickMenuConditions';
		events[ 'click @ui.buttonPreviewSettings' ] = 'onClickButtonPreviewSettings';
		events[ 'click @ui.buttonOpenPreview' ] = 'onClickButtonPreview';

		return events;
	},

	initialize: function() {
		SaverBehavior.prototype.initialize.apply( this, arguments );

		qazana.settings.page.model.on( 'change', this.onChangeLocation.bind( this ) );
	},

	onRender: function() {
		SaverBehavior.prototype.onRender.apply( this, arguments );

		var $menuConditions = jQuery( '<div />', {
			id: 'qazana-pro-panel-saver-conditions',
			class: 'qazana-panel-footer-sub-menu-item',
			html: '<i class="qazana-icon fa fa-paper-plane"></i>' +
			'<span class="qazana-title">' +
			qazana.translate( 'display_conditions' ) +
			'</span>'
		} );

		this.ui.menuConditions = $menuConditions;

		this.toggleMenuConditions();

		this.ui.saveTemplate.before( $menuConditions );

		this.ui.buttonPreview.replaceWith( jQuery( '#tmpl-qazana-theme-builder-button-preview' ).html() );
	},

	toggleMenuConditions: function() {
		this.ui.menuConditions.toggle( ! ! qazana.config.theme_builder.settings.location );
	},

	onChangeLocation: function( settings ) {
		if ( ! _.isUndefined( settings.changed.location ) ) {
			qazana.config.theme_builder.settings.location = settings.changed.location;
			this.toggleMenuConditions();
		}
	},

	onClickPreviewWrapper: function( event ) {
		var $target = jQuery( event.target ),
			$tool = $target.closest( '.qazana-panel-footer-tool' ),
			isClickInsideOfTool = $target.closest( '.qazana-panel-footer-sub-menu-wrapper' ).length;

		if ( isClickInsideOfTool ) {
			$tool.removeClass( 'qazana-open' );
			return;
		}

		this.ui.menuButtons.filter( ':not(.qazana-leave-open)' ).removeClass( 'qazana-open' );

		var isClosedTool = $tool.length && ! $tool.hasClass( 'qazana-open' );
		$tool.toggleClass( 'qazana-open', isClosedTool );

		event.stopPropagation();
	},

	onClickMenuConditions: function() {
		qazana.modules.themeBuilder.showConditionsModal();
	},

	onClickButtonPublish: function() {
		var hasConditions = qazana.config.theme_builder.settings.conditions.length,
			hasLocation = qazana.config.theme_builder.settings.location,
			isDraft = 'draft' === qazana.settings.page.model.get( 'post_status' );
		if ( ( hasConditions && ! isDraft ) || ! hasLocation ) {
			SaverBehavior.prototype.onClickButtonPublish.apply( this, arguments );
		} else {
			qazana.modules.themeBuilder.showConditionsModal();
		}
	},

	onClickButtonPreviewSettings: function() {
		var panel = qazana.getPanelView();
		panel.setPage( 'page_settings' );
		panel.getCurrentPageView().activateSection( 'preview_settings' );
		panel.getCurrentPageView()._renderChildren();
	}
} );