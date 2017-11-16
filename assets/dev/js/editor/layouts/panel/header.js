var PanelHeaderItemView;

PanelHeaderItemView = Marionette.ItemView.extend( {
    template: '#tmpl-qazana-panel-header',

    id: 'qazana-panel-header',

    ui: {
        menuButton: '#qazana-panel-header-menu-button',
        menuDropButton: '#qazana-panel-header-nav-button',
        title: '#qazana-panel-header-title',
        addButton: '#qazana-panel-header-add-button',
        buttonSave: '#qazana-panel-header-save',
        buttonSaveButton: '#qazana-panel-header-save .qazana-button'
    },

    events: {
        'click @ui.addButton': 'onClickAdd',
        'click @ui.menuButton': 'onClickMenu',
        'click @ui.menuDropButton': 'onClickMenuDrop',
        'click @ui.buttonSave': 'onClickButtonSave',
        'click @ui.buttonPublish': 'onClickButtonPublish'
    },

    initialize: function() {
        this._initDialog();
        this.onClickMenuDrop();

        this.listenTo( qazana.channels.editor, 'status:change', this.onEditorChanged )
			.listenTo( qazana.channels.deviceMode, 'status:change', this.onDeviceModeChange );
    },

    _initDialog: function() {
		var dialog;

		this.getDialog = function() {
			if ( ! dialog ) {
				var $ = Backbone.$,
					$dialogMessage = $( '<div>', {
						'class': 'qazana-dialog-message'
					} ),
					$messageIcon = $( '<i>', {
						'class': 'fa fa-check-circle'
					} ),
					$messageText = $( '<div>', {
						'class': 'qazana-dialog-message-text'
					} ).text( qazana.translate( 'saved' ) );

				$dialogMessage.append( $messageIcon, $messageText );

				dialog = qazana.dialogsManager.createWidget( 'simple', {
					id: 'qazana-saved-popup',
					position: {
						element: 'message',
						of: 'widget'
					},
					hide: {
						auto: true,
						autoDelay: 1500
					}
				} );

				dialog.setMessage( $dialogMessage );
			}

			return dialog;
		};
	},

    _publishBuilder: function() {
        var self = this;

        var options = {
            status: 'publish',
            onSuccess: function() {
                self.getDialog().show();
                self.ui.buttonSaveButton.removeClass( 'qazana-button-state' );
                NProgress.done();
            }
        };

        self.ui.buttonSaveButton.addClass( 'qazana-button-state' );

        NProgress.start();

        qazana.saveEditor( options );
    },

    _saveBuilderDraft: function() {
        qazana.saveEditor();
    },

    setTitle: function( title ) {
        this.ui.title.html( title );
    },

    onClickAdd: function() {
        qazana.getPanelView().setPage( 'elements' );
    },

    onClickMenu: function() {
        var panel = qazana.getPanelView(),
            currentPanelPageName = panel.getCurrentPageName(),
            nextPage = 'menu' === currentPanelPageName ? 'elements' : 'menu';

        panel.setPage( nextPage );
    },

    onClickMenuDrop: function() {

        var $ = Backbone.$;

        // Delay showing of main nav with hoverIntent
        $( 'ul.qazana-panel-header-nav > li' ).hoverIntent(
            function() { $( this ).addClass( 'qazana-menu-hover' ); },
            function() { $( this ).removeClass( 'qazana-menu-hover' ); }
        );
    },

    onEditorChanged: function() {
        this.ui.buttonSave.toggleClass( 'qazana-save-active', qazana.isEditorChanged() );
    },

    onClickButtonSave: function() {
        //this._saveBuilderDraft();
        this._publishBuilder();
    },

    onClickButtonPublish: function( event ) {
        // Prevent click on save button
        event.stopPropagation();
        this._publishBuilder();
    }

} );

module.exports = PanelHeaderItemView;
