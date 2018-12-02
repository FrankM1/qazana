var SaverBehavior = qazana.modules.components.saver.behaviors.HeaderSaver;

module.exports = SaverBehavior.extend({
	ui: function() {
		var ui = SaverBehavior.prototype.ui.apply( this, arguments );

		ui.menuConditions = '#qazana-panel-saver-conditions';
		ui.previewWrapper = '#qazana-panel-header-document-conditions-button-preview-wrapper';
		ui.buttonPreviewSettings = '#qazana-panel-header-document-conditions-button-preview-settings';
		ui.buttonOpenPreview = '#qazana-panel-header-document-conditions-button-open-preview';

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
        this.config = qazana.config.documentConditions;
		qazana.settings.page.model.on( 'change', this.onChangeLocation.bind( this ) );
	},

	onRender: function() {
		SaverBehavior.prototype.onRender.apply( this, arguments );

		var $menuConditions = jQuery( '<div />', {
			id: 'qazana-panel-saver-conditions',
			class: 'qazana-panel-header-sub-menu-item',
			html: '<i class="qazana-icon fa fa-paper-plane"></i>' + '<span class="qazana-title">' + qazana.translate( 'display_conditions' ) + '</span>'
		});

		this.ui.menuConditions = $menuConditions;

        this.toggleMenuConditions();

        this.ui.saveTemplate.before( $menuConditions );

		this.ui.buttonPreview.replaceWith( jQuery( '#tmpl-qazana-document-conditions-button-preview' ).html() );
	},

	toggleMenuConditions: function() {
		this.ui.menuConditions.toggle( ! ! this.config.settings.location );
	},

	onChangeLocation: function( settings ) {
		if ( ! _.isUndefined( settings.changed.location ) ) {
			this.config.settings.location = settings.changed.location;
			this.toggleMenuConditions();
		}
	},

	onClickPreviewWrapper: function( event ) {
		var $target = jQuery( event.target ),
			$tool = $target.closest( '.qazana-panel-header-tool' ),
			isClickInsideOfTool = $target.closest( '.qazana-panel-header-sub-menu-wrapper' ).length;

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
		qazana.documentConditions.showConditionsModal();
	},

	onClickButtonPublish: function() {
		var hasConditions = this.config.settings.conditions.length,
			hasLocation = this.config.settings.location,
			isDraft = 'draft' === qazana.settings.page.model.get( 'post_status' );
		if ( ( hasConditions && ! isDraft ) || ! hasLocation ) {
			SaverBehavior.prototype.onClickButtonPublish.apply( this, arguments );
		} else {
			qazana.documentConditions.showConditionsModal();
		}
	},

	onClickButtonPreviewSettings: function() {
		var panel = qazana.getPanelView();
		panel.setPage( 'page_settings' );
		panel.getCurrentPageView().activateSection( 'preview_settings' );
		panel.getCurrentPageView()._renderChildren();
	}
});
